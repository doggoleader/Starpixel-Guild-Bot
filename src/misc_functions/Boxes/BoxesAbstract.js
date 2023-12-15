const { StringSelectMenuInteraction, ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require("discord.js");
const { Guild } = require("../../schemas/guilddata");
const { User } = require("../../schemas/userdata");
const { Document, Model, Schema } = require("mongoose");
const { calcCooldown, getProperty, changeProperty } = require("../../functions");
const { Temp } = require("../../schemas/temp_items");
const ch_list = require(`../../discord structure/channels.json`)
const wait = require(`timers/promises`).setTimeout
/**
 * @typedef {string} LOOT_TYPE
 */

/**
 * @enum {LOOT_TYPE}
 */
var TYPES = {
    LOOT: "loot",
    MYTHICAL: "mythical",
    COLLECTION: "collection",
    COSMETICS: "cosmetics",
    ACT_EXP: "act_exp",
    RANK_EXP: "rank_exp",
    RUMBIKS: "rumbiks",
    TICKETS: "tickets",
    MEDALS: "medals",
    SEASONAL_POINTS: "seasonal_points",
    SNOWFLAKES: "snowflakes"
}

/**
 * @abstract
 */
class Boxes {
    /**
     * @type {string} Name of the box
     */
    name;

    /**
     * @type {string} Role ID (if null, can be used with any role)
     */
    id;

    /**
     * @type {string} Box ID
     */
    boxID;

    /**
     * @type {'new_year' | 'halloween' | 'easter' | 'summer' | null} Season Type
     */
    seasonType;

    loot_file;
    userData;
    guildData;
    allTypes;
    static allTypes = Boxes.getLootTypes();


    /**
     * @type {StringSelectMenuInteraction} String Select Menu Interaction
     */
    interaction;

    /**
     * @type {import("../Classes/System/StarpixelClient").StarpixelClient} Discord Client
     */
    client;

    /**
     * @type {Array<LOOT_TYPE>} Types of the loot dropped from the box
     */
    loot_types = [];

    /**
     * @type {boolean} Whether the duplicated loot can be changed or not
     */
    changeable;

    /**
     * @type {boolean} Whether this box has cooldown or not
     */
    hasCD;

    /**
     * @type {number} Box cooldown (works if {@link hasCD} parameter is 'true')
     */
    cooldown;

    /**
     * @type {Array<string>} ID's of users which are receivers;
     */
    receivers = [];

    /**
     * @type {boolean} Whether remove role of this box or not (works if {@link id} is not 'null')
     */
    removeRole;

    /**
     * @type {string} Message inside which there will be %%loot%% variable which can be replaced with loot. Without ## Head
     */
    message;

    /** @private */
    #amount_loot;
    get amount_loot() {
        return this.#amount_loot;
    }
    set amount_loot(value) {
        this.#amount_loot = value;
    }
    /** @private */
    #repeatable_loot;
    get repeatable_loot() {
        return this.#repeatable_loot;
    }
    set repeatable_loot(value) {
        this.#repeatable_loot = value;
    }
    /** @private */
    #amount_collection;
    get amount_collection() {
        return this.#amount_collection;
    }
    set amount_collection(value) {
        this.#amount_collection = value;
    }
    /** @private */
    #repeatable_collection;
    get repeatable_collection() {
        return this.#repeatable_collection;
    }
    set repeatable_collection(value) {
        this.#repeatable_collection = value;
    }
    /** @private */
    #amount_mythical;
    get amount_mythical() {
        return this.#amount_mythical;
    }
    set amount_mythical(value) {
        this.#amount_mythical = value;
    }
    /** @private */
    #repeatable_mythical;
    get repeatable_mythical() {
        return this.#repeatable_mythical;
    }
    set repeatable_mythical(value) {
        this.#repeatable_mythical = value;
    }
    /** @private */
    #amount_cosmetics;
    get amount_cosmetics() {
        return this.#amount_cosmetics;
    }
    set amount_cosmetics(value) {
        this.#amount_cosmetics = value;
    }
    /** @private */
    #repeatable_cosmetics;
    get repeatable_cosmetics() {
        return this.#repeatable_cosmetics;
    }
    set repeatable_cosmetics(value) {
        this.#repeatable_cosmetics = value;
    }
    /**
     * 
     * @private
     * @param {StringSelectMenuInteraction} interaction String Select Menu Interaction
     * @param {import("../Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     * 
     * When creating a new class, extending this one, please specify following parameters, shown in example below:
     * @example
     * constructor(interaction, client) {
     *   super(interaction, client);
     *   this.name = "YOUR NAME";
     *   this.id = "ROLE ID";
     *   this.boxID = "BoxID";
     *   this.seasonType = null; //or any other available for this param;
     *   this.loot_file = require("path/to/json/file.json");
     *   this.message = this.getMessage(); //Create a subfunction returning a string with %%loot%% variable.
     *   this.amount_loot = 1;
     *   this.amount_collection = 0;
     *   this.amount_cosmetics = 0;
     *   this.amount_mythical = 0;
     *   this.repeatable_loot = true;
     *   this.repeatable_collection = true;
     *   this.repeatable_mythical = true;
     *   this.repeatable_cosmetics = true;
     *   this.loot_types = []
     *   this.changeable = false;
     *   this.removeRole = true;
     *   this.hasCD = false;
     *   this.cooldown = 0;
     * }  
     */
    constructor(interaction, client) {
        this.interaction = interaction;
        this.client = client;
        this.#amount_loot = 1;
        this.#amount_collection = 0;
        this.#amount_cosmetics = 0;
        this.#amount_mythical = 0;
        this.#repeatable_loot = true;
        this.#repeatable_collection = true;
        this.#repeatable_mythical = true;
        this.#repeatable_cosmetics = true;
        this.changeable = false;
        this.removeRole = true;
        this.loot_types = []
        this.hasCD = false;
        this.receivers.push(this.interaction.user.id)
        this.seasonType = null;
        this.cooldown = 0;
        this.allTypes = this.getLootTypes();
    }
    /**
     * 
     * @private
     */
    async findGuildData() {
        const guildData = await Guild.findOne({ id: this.interaction.guild.id })
        this.guildData = guildData
        return guildData;
    }

    /**
     * 
     * @private
     */
    async findUserData() {
        const userData = await User.findOne({ userid: this.interaction.user.id, guildid: this.interaction.guild.id })
        this.userData = userData
        return userData;
    }

    /**
     * @private
     * @returns All possible loot types.
     */
    static getLootTypes() {
        return TYPES
    }

    /**
     * @private
     * @returns All possible loot types.
     */
    getLootTypes() {
        return TYPES
    }

    /**
     * @private
     * @description Get item or static loot from the box
     * @param {Number} amount Amount of items which can be received from the box
     * @param {Boolean} repeatable Whether items can repeat or not
     * @param {Function=} filter Filter items
     */
    async getLoot(amount, repeatable, filter) {
        if (!this.loot_file.loot) throw new Error('В данной коробке нет предметов лута!');
        let loot = this.loot_file.loot.slice();
        if (filter) {
            loot = loot.filter(filter)
        }
        let finalLoot = []
        for (let a = 0; a < amount; a++) {
            let chances = []
            let sum = 0;
            for (let i = 0; i < loot.length; i++) {
                if (loot[i].rarity == "Common") {
                    sum += loot[i].chance * this.userData.box_chances.common
                    chances.push(loot[i].chance * this.userData.box_chances.common)
                } else if (loot[i].rarity == "Uncommon") {
                    sum += loot[i].chance * this.userData.box_chances.uncommon
                    chances.push(loot[i].chance * this.userData.box_chances.uncommon)
                } else if (loot[i].rarity == "Rare") {
                    sum += loot[i].chance * this.userData.box_chances.rare
                    chances.push(loot[i].chance * this.userData.box_chances.rare)
                } else if (loot[i].rarity == "Epic") {
                    sum += loot[i].chance * this.userData.box_chances.epic
                    chances.push(loot[i].chance * this.userData.box_chances.epic)
                } else if (loot[i].rarity == "Legendary") {
                    sum += loot[i].chance * this.userData.box_chances.legendary
                    chances.push(loot[i].chance * this.userData.box_chances.legendary)
                } else if (loot[i].rarity == "Mythical") {
                    sum += loot[i].chance * this.userData.box_chances.mythical
                    chances.push(loot[i].chance * this.userData.box_chances.mythical)
                } else if (loot[i].rarity == "RNG") {
                    sum += loot[i].chance * this.userData.box_chances.RNG
                    chances.push(loot[i].chance * this.userData.box_chances.RNG)
                } else {
                    sum += loot[i].chance * 1
                    chances.push(loot[i].chance * 1)
                    console.log(`Предмет ${loot[i].name} имеет неправильное отображение редкости!`)
                }
            }
            let r = Math.floor(Math.random() * sum);
            let i = 0;
            for (let s = chances[0]; s <= r; s += chances[i]) {
                i++;
            }

            finalLoot.push(loot[i])

            if (!repeatable) {
                let id = loot.findIndex(l => l.roleID == loot[i].roleID);
                loot.splice(id, 1);
            }
        }

        return finalLoot;
    }

    /**
         * @private
         * @description Get item or static loot from the box
         * @param {Number} amount Amount of items which can be received from the box
         * @param {Boolean} repeatable Whether items can repeat or not
         * @param {Function=} filter Filter items
         */
    async getCollection(amount, repeatable, filter) {
        if (!this.loot_file.collection) throw new Error('В данной коробке нет предметов лута!');
        let loot = this.loot_file.collection.slice();
        if (filter) {
            loot = loot.filter(filter)
        }
        let finalLoot = []
        for (let a = 0; a < amount; a++) {
            let chances = []
            let sum = 0;
            for (let i = 0; i < loot.length; i++) {
                if (loot[i].rarity == "Common") {
                    sum += loot[i].chance * this.userData.box_chances.common
                    chances.push(loot[i].chance * this.userData.box_chances.common)
                } else if (loot[i].rarity == "Uncommon") {
                    sum += loot[i].chance * this.userData.box_chances.uncommon
                    chances.push(loot[i].chance * this.userData.box_chances.uncommon)
                } else if (loot[i].rarity == "Rare") {
                    sum += loot[i].chance * this.userData.box_chances.rare
                    chances.push(loot[i].chance * this.userData.box_chances.rare)
                } else if (loot[i].rarity == "Epic") {
                    sum += loot[i].chance * this.userData.box_chances.epic
                    chances.push(loot[i].chance * this.userData.box_chances.epic)
                } else if (loot[i].rarity == "Legendary") {
                    sum += loot[i].chance * this.userData.box_chances.legendary
                    chances.push(loot[i].chance * this.userData.box_chances.legendary)
                } else if (loot[i].rarity == "Mythical") {
                    sum += loot[i].chance * this.userData.box_chances.mythical
                    chances.push(loot[i].chance * this.userData.box_chances.mythical)
                } else if (loot[i].rarity == "RNG") {
                    sum += loot[i].chance * this.userData.box_chances.RNG
                    chances.push(loot[i].chance * this.userData.box_chances.RNG)
                } else {
                    sum += loot[i].chance * 1
                    chances.push(loot[i].chance * 1)
                    console.log(`Предмет ${loot[i].name} имеет неправильное отображение редкости!`)
                }
            }
            let r = Math.floor(Math.random() * sum);
            let i = 0;
            for (let s = chances[0]; s <= r; s += chances[i]) {
                i++;
            }

            finalLoot.push(loot[i])

            if (!repeatable) {
                let id = loot.findIndex(l => l.roleID == loot[i].roleID);
                loot.splice(id, 1);
            }
        }

        return finalLoot;
    }

    /**
     * @private
     * @description Get item or static loot from the box
     * @param {Number} amount Amount of items which can be received from the box
     * @param {Boolean} repeatable Whether items can repeat or not
     * @param {Function=} filter Filter items
     */
    async getMythical(amount, repeatable, filter) {
        if (!this.loot_file.mythical) throw new Error('В данной коробке нет предметов лута!');
        let loot = this.loot_file.mythical.slice();
        if (filter) {
            loot = loot.filter(filter)
        }
        let finalLoot = []
        for (let a = 0; a < amount; a++) {
            let chances = []
            let sum = 0;
            for (let i = 0; i < loot.length; i++) {
                if (loot[i].rarity == "Common") {
                    sum += loot[i].chance * this.userData.box_chances.common
                    chances.push(loot[i].chance * this.userData.box_chances.common)
                } else if (loot[i].rarity == "Uncommon") {
                    sum += loot[i].chance * this.userData.box_chances.uncommon
                    chances.push(loot[i].chance * this.userData.box_chances.uncommon)
                } else if (loot[i].rarity == "Rare") {
                    sum += loot[i].chance * this.userData.box_chances.rare
                    chances.push(loot[i].chance * this.userData.box_chances.rare)
                } else if (loot[i].rarity == "Epic") {
                    sum += loot[i].chance * this.userData.box_chances.epic
                    chances.push(loot[i].chance * this.userData.box_chances.epic)
                } else if (loot[i].rarity == "Legendary") {
                    sum += loot[i].chance * this.userData.box_chances.legendary
                    chances.push(loot[i].chance * this.userData.box_chances.legendary)
                } else if (loot[i].rarity == "Mythical") {
                    sum += loot[i].chance * this.userData.box_chances.mythical
                    chances.push(loot[i].chance * this.userData.box_chances.mythical)
                } else if (loot[i].rarity == "RNG") {
                    sum += loot[i].chance * this.userData.box_chances.RNG
                    chances.push(loot[i].chance * this.userData.box_chances.RNG)
                } else {
                    sum += loot[i].chance * 1
                    chances.push(loot[i].chance * 1)
                    console.log(`Предмет ${loot[i].name} имеет неправильное отображение редкости!`)
                }
            }
            let r = Math.floor(Math.random() * sum);
            let i = 0;
            for (let s = chances[0]; s <= r; s += chances[i]) {
                i++;
            }

            finalLoot.push(loot[i])

            if (!repeatable) {
                let id = loot.findIndex(l => l.roleID == loot[i].roleID);
                loot.splice(id, 1);
            }
        }

        return finalLoot;
    }
    /**
     * @private
     * @description Get cosmetic items from the box
     * @param {Number} amount Amount of items that can be dropped from this box
     * @param {Boolean} repeatable Whether items can repeat or not
     */
    async getCosmetics(amount, repeatable) {

        if (!this.loot_file.cosmetic) throw new Error('В данной коробке нет косметических предметов!');
        let cosmetic = this.loot_file.cosmetic.slice();
        let finalLoot = []
        for (let a = 0; a < amount; a++) {
            let sum = 0;
            for (let i = 0; i < cosmetic.length; i++) {
                sum += cosmetic[i].chance;
            }
            let r = Math.floor(Math.random() * sum);
            let i = 0;
            for (let s = cosmetic[0].chance; s <= r; s += cosmetic[i].chance) {
                i++;
            }
            finalLoot.push(cosmetic[i])
            if (!repeatable) {
                let id = cosmetic.findIndex(l => l.symbol == cosmetic[i].symbol);
                cosmetic.splice(id, 1);
            }
        }

        return finalLoot;
    }
    /**
     * @private
     * @description Get Activity Experience from the box
     */
    async getActExp() {
        if (!this.loot_file.act_exp) throw new Error('В данной коробке нет опыта рангов!');
        let act_exp = this.loot_file.act_exp.slice();
        let sum = 0;
        for (let i = 0; i < act_exp.length; i++) {
            sum += act_exp[i].chance;
        }
        let r = Math.floor(Math.random() * sum);
        let i = 0;
        for (let s = act_exp[0].chance; s <= r; s += act_exp[i].chance) {
            i++;
        }

        let amount = act_exp[i].amount * this.userData.pers_act_boost * this.guildData.act_exp_boost;

        return amount;
    }
    /**
     * @private
     * @description Get Rank Experience from the box
     */
    async getRankExp() {

        if (!this.loot_file.rank_exp) throw new Error('В данной коробке нет опыта рангов!');
        let rank_exp = this.loot_file.rank_exp.slice();
        let sum = 0;
        for (let i = 0; i < rank_exp.length; i++) {
            sum += rank_exp[i].chance;
        }
        let r = Math.floor(Math.random() * sum);
        let i = 0;
        for (let s = rank_exp[0].chance; s <= r; s += rank_exp[i].chance) {
            i++;
        }

        let amount = rank_exp[i].amount * this.userData.pers_rank_boost + Math.round(rank_exp[i].amount * this.userData.perks.rank_boost * 0.05)


        return amount;
    }
    /**
     * @private
     * @description Get Tickets from the box
     */
    async getTickets() {
        if (!this.loot_file.tickets) throw new Error('В данной коробке нет билетов!');
        let tickets = this.loot_file.tickets.slice();
        let sum = 0;
        for (let i = 0; i < tickets.length; i++) {
            sum += tickets[i].chance;
        }
        let r = Math.floor(Math.random() * sum);
        let i = 0;
        for (let s = tickets[0].chance; s <= r; s += tickets[i].chance) {
            i++;
        }
        let amount = tickets[i].amount

        return amount;
    }
    /**
     * @private
     * @description Get Rumbiks from the box
     */
    async getRumbiks() {
        if (!this.loot_file.rumbik) throw new Error('В данной коробке нет румбиков!');
        let rumbik = this.loot_file.rumbik.slice();
        let sum = 0;
        for (let i = 0; i < rumbik.length; i++) {
            sum += rumbik[i].chance;
        }
        let r = Math.floor(Math.random() * sum);
        let i = 0;
        for (let s = rumbik[0].chance; s <= r; s += rumbik[i].chance) {
            i++;
        }
        let amount = rumbik[i].amount * this.userData.pers_rumb_boost

        return amount;
    }
    /**
     * @private
     * @description Get Medals from the box
     */
    async getMedals() {
        if (!this.loot_file.medals) throw new Error('В данной коробке нет медалей!');
        let medals = this.loot_file.medals.slice();
        let sum = 0;
        for (let i = 0; i < medals.length; i++) {
            sum += medals[i].chance;
        }
        let r = Math.floor(Math.random() * sum);
        let i = 0;
        for (let s = medals[0].chance; s <= r; s += medals[i].chance) {
            i++;
        }
        let amount = medals[i].amount

        return {
            type: medals[i].type,
            amount: amount
        }

    }
    /**
     * @private
     * @description Get Seasonal Points from the box
     */
    async getSeasonalPoints() {
        if (!this.loot_file.seasonal_points) throw new Error('В данной коробке нет сезонных очков!');
        let seasonal_points = this.loot_file.seasonal_points.slice();

        let point = seasonal_points[Math.floor(Math.random() * seasonal_points.length)]

        return point.amount
    }
    /**
     * @private
     * @description Get New Year Snowflakes from the box
     */
    async getSnowflakes() {
        if (!this.loot_file.snowflakes) throw new Error('В данной коробке нет новогодних снежинок!');
        let snowflakes = this.loot_file.snowflakes.slice();

        let snowflake = snowflakes[Math.floor(Math.random() * snowflakes.length)]

        return snowflake.amount

    }
    /**
     * @private
     * @description Get an array of objects of received items from the box
     * @param {LOOT_TYPE[]} items Types of loot which can be dropped from the box
     */
    async createBox(items) {
        await this.findGuildData();

        let finalLoot = []

        for (const item of items) {
            let loot = null;
            switch (item) {
                case TYPES.LOOT: {
                    loot = await this.getLoot(this.amount_loot, this.repeatable_loot);
                }
                    break;
                case TYPES.MYTHICAL: {
                    loot = await this.getMythical(this.amount_mythical, this.repeatable_mythical);
                }
                    break;
                case TYPES.COLLECTION: {
                    loot = await this.getCollection(this.amount_collection, this.repeatable_collection);
                }
                    break;
                case TYPES.COSMETICS: {
                    loot = await this.getCosmetics(this.amount_cosmetics, this.repeatable_cosmetics);
                }
                    break;
                case TYPES.RANK_EXP: {
                    loot = await this.getRankExp();
                }
                    break;
                case TYPES.ACT_EXP: {
                    loot = await this.getActExp();
                }
                    break;
                case TYPES.RUMBIKS: {
                    loot = await this.getRumbiks();
                }
                    break;
                case TYPES.TICKETS: {
                    loot = await this.getTickets();
                }
                    break;
                case TYPES.MEDALS: {
                    loot = await this.getMedals();
                }
                    break;
                case TYPES.SEASONAL_POINTS: {
                    loot = await this.getSeasonalPoints();
                }
                    break;
                case TYPES.SNOWFLAKES: {
                    loot = await this.getSnowflakes();
                }
                    break;

                default:
                    break;
            }



            if (loot !== null) {
                finalLoot.push(
                    {
                        type: item,
                        result: loot
                    }
                )
            }
        }


        return finalLoot
    }

    /**
     * 
     * @private
     * @param {Array.<{ type: LOOT_TYPE, result: (Array | number)}>} array Array which should be sorted
     * @returns {Array.<{ type: LOOT_TYPE, result: (Array | number)}>} Sorted array
     */
    sortInOrder(array) {

        let finalArray = []
        const a1 = array.find(obj => obj.type == TYPES.MYTHICAL)
        if (a1) finalArray.push(a1)
        const a2 = array.find(obj => obj.type == TYPES.LOOT)
        if (a2) finalArray.push(a2)
        const a3 = array.find(obj => obj.type == TYPES.COLLECTION)
        if (a3) finalArray.push(a3)
        const a11 = array.find(obj => obj.type == TYPES.COSMETICS)
        if (a11) finalArray.push(a11)
        const a4 = array.find(obj => obj.type == TYPES.ACT_EXP)
        if (a4) finalArray.push(a4)
        const a5 = array.find(obj => obj.type == TYPES.RANK_EXP)
        if (a5) finalArray.push(a5)
        const a6 = array.find(obj => obj.type == TYPES.RUMBIKS)
        if (a6) finalArray.push(a6)
        const a7 = array.find(obj => obj.type == TYPES.MEDALS)
        if (a7) finalArray.push(a7)
        const a8 = array.find(obj => obj.type == TYPES.TICKETS)
        if (a8) finalArray.push(a8)
        const a9 = array.find(obj => obj.type == TYPES.SEASONAL_POINTS)
        if (a9) finalArray.push(a9)
        const a10 = array.find(obj => obj.type == TYPES.SNOWFLAKES)
        if (a10) finalArray.push(a10)

        return finalArray;
    }
    /**
     * @private
     * @param {{type: LOOT_TYPE, result: (Array | number)}} item Item, which chance is going to calculate
     * @param {Boxes} def_class This class
     */
    async caclItemChances(item, def_class) {
        if (item.type == TYPES.LOOT || item.type == TYPES.MYTHICAL || item.type == TYPES.COLLECTION || item.type == TYPES.COSMETICS) {
            let finalChances = [];
            let array = null
            if (item.type == TYPES.LOOT) {
                array = def_class.loot_file.loot;
            } else if (item.type == TYPES.MYTHICAL) {
                array = def_class.loot_file.mythical;
            } else if (item.type == TYPES.COLLECTION) {
                array = def_class.loot_file.collection;
            } else if (item.type == TYPES.COSMETICS) {
                array = def_class.loot_file.cosmetic;
            }
            let chances = [];
            let sum = 0;

            for (let i = 0; i < array.length; i++) {
                if (array[i].rarity == "Common") {
                    sum += Number(array[i].chance * def_class.userData.box_chances.common)
                    chances.push(Number(array[i].chance * def_class.userData.box_chances.common))
                } else if (array[i].rarity == "Uncommon") {
                    sum += Number(array[i].chance * def_class.userData.box_chances.uncommon)
                    chances.push(Number(array[i].chance * def_class.userData.box_chances.uncommon))
                } else if (array[i].rarity == "Rare") {
                    sum += Number(array[i].chance * def_class.userData.box_chances.rare)
                    chances.push(Number(array[i].chance * def_class.userData.box_chances.rare))
                } else if (array[i].rarity == "Epic") {
                    sum += Number(array[i].chance * def_class.userData.box_chances.epic)
                    chances.push(Number(array[i].chance * def_class.userData.box_chances.epic))
                } else if (array[i].rarity == "Legendary") {
                    sum += Number(array[i].chance * def_class.userData.box_chances.legendary)
                    chances.push(Number(array[i].chance * def_class.userData.box_chances.legendary))
                } else if (array[i].rarity == "Mythical") {
                    sum += Number(array[i].chance * def_class.userData.box_chances.mythical)
                    chances.push(Number(array[i].chance * def_class.userData.box_chances.mythical))
                } else if (array[i].rarity == "RNG") {
                    sum += Number(array[i].chance * def_class.userData.box_chances.RNG)
                    chances.push(Number(array[i].chance * def_class.userData.box_chances.RNG))
                } else {
                    sum += Number(array[i].chance * 1)
                    chances.push(Number(array[i].chance * 1))
                    console.log(`Предмет ${array[i].name} имеет неправильное отображение редкости!`)
                }
            }

            for (let res of item.result) {
                let index
                if (item.type == TYPES.COSMETICS) {
                    index = await array.findIndex(a => a.symbol == res.symbol)
                } else {
                    index = await array.findIndex(a => a.roleID == res.roleID)
                }
                let chance = ((chances[index] / sum) * 100).toFixed(1);
                finalChances.push(chance);
            }

            return finalChances;

        } else if (item.type == TYPES.ACT_EXP) {

        } else if (item.type == TYPES.MEDALS) {

        } else if (item.type == TYPES.RANK_EXP) {

        } else if (item.type == TYPES.RUMBIKS) {

        } else if (item.type == TYPES.SEASONAL_POINTS) {

        } else if (item.type == TYPES.SNOWFLAKES) {

        } else if (item.type == TYPES.TICKETS) {

        }
    }

    /**
     * @description Create box and send its message to the Box Channel
     */
    async sendBox() {
        const interaction = this.interaction;
        const client = this.client;
        const userData = await this.findUserData();
        const guildData = await this.findGuildData();
        const changeable = this.changeable;
        const seasonType = this.seasonType;
        const receivers = this.receivers;
        const types = this.loot_types;
        const caclItemChances = this.caclItemChances
        const loot_file = this.loot_file
        const def_class = this;

        if (this.id) {
            if (userData.stacked_items.includes(this.id)) {
                if (this.removeRole) {
                    let index = userData.stacked_items.findIndex(i => i == this.id)
                    await userData.stacked_items.splice(index, 1);
                }
            } else {
                if (interaction.member.roles.cache.has(this.id)) {
                    if (this.removeRole) {
                        await interaction.member.roles.remove(this.id).catch()
                    }
                } else return interaction.editReply({
                    content: `У вас отсутствует **${this.name.toUpperCase()}**! Выполняйте задания и открывайте коробки более высокого уровня, чтобы получить её!`,
                    ephemeral: true
                })
            }
        }
        if (this.hasCD) {
            if (userData.cooldowns[this.boxID] > Date.now()) return interaction.editReply({
                content: `Команда находится на перезарядке! Пожалуйста, подождите ещё \`${calcCooldown(userData.cooldowns[this.boxID] - Date.now())}\`!`,
                ephemeral: true
            })
            else {
                userData.cooldowns[this.boxID] = Date.now() + (this.cooldown) * (1 - (userData.perks.decrease_cooldowns * 0.1))
                if (userData.cd_remind.includes(this.boxID)) {
                    let ITEM_ID = userData.cd_remind.findIndex(item_id => item_id == this.boxID)
                    userData.cd_remind.splice(ITEM_ID, 1)
                }
            }
        }


        await interaction.deleteReply();
        const typeList = this.allTypes;
        const fullBox = await this.createBox(types);
        let sortedBox = await this.sortInOrder(fullBox);
        let i = 1

        let functionResult = await turnIntoStringsArray(sortedBox);
        let mapGot = functionResult[0];
        let alreadyHasGot = functionResult[1];

        /**
         * 
         * @param {Array} array Array of boxes items
         * @returns {Array<Array>} Two arrays: First is for the whole loot and the second if for items which user already has
         */
        async function turnIntoStringsArray(array) {
            let map = [], alreadyHas = [];
            for (let item of array) {
                if (item.type == typeList.LOOT || item.type == typeList.MYTHICAL || item.type == typeList.COLLECTION || item.type == typeList.COSMETICS) {
                    const chances = await caclItemChances(item, def_class);
                    for (let j = 0; j < item.result.length; j++) {
                        let rew = item.result[j];
                        map.push(`**${i++}.** \`${rew.name}\` (Шанс: \`${chances[j]}%\`)
${rew.description}
`)
                        if (changeable) {
                            if (userData.perks.change_items >= 1) {
                                if (item.type !== typeList.COSMETICS) {
                                    if (rew.type !== 'Color') {
                                        if (interaction.member.roles.cache.has(rew.roleID)) {
                                            alreadyHas.push({
                                                type: item.type,
                                                result: rew
                                            })
                                        }

                                    } else {
                                        if (userData.cosmetics_storage.colors.includes(rew.roleID)) {
                                            alreadyHas.push({
                                                type: item.type,
                                                result: rew
                                            })
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else if (item.type == typeList.ACT_EXP) {
                    map.push(`**${i++}.** \`${item.result}\`🌀`)
                } else if (item.type == typeList.MEDALS) {
                    map.push(`**${i++}.** \`${item.result.amount}\`${item.result.medal_type}`)
                } else if (item.type == typeList.RANK_EXP) {
                    map.push(`**${i++}.** \`${item.result}\`💠`)
                } else if (item.type == typeList.RUMBIKS) {
                    map.push(`**${i++}.** \`${item.result}\`<:Rumbik:883638847056003072>`)
                } else if (item.type == typeList.SEASONAL_POINTS) {
                    map.push(`**${i++}.** \`${item.result}\` очков`)
                } else if (item.type == typeList.SNOWFLAKES) {
                    map.push(`**${i++}.** \`${item.result}\`:snowflake: `)
                } else if (item.type == typeList.TICKETS) {
                    map.push(`**${i++}.** \`${item.result}\`🏷`)
                }
            }


            return [map, alreadyHas]
        }


        let comps = [];
        let perks_msg = ``
        if (changeable) {
            if (userData.perks.change_items >= 1) {
                if (alreadyHasGot.length >= 1) {
                    let components = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`change_item`)
                                .setLabel(`Изменить предмет`)
                                .setEmoji(`✨`)
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(false)
                        )

                    comps.push(components);
                    perks_msg = `У вас есть умение \`✨ Изменение предметов\`, поэтому вы можете попытать удачу и изменить предмет, нажав на кнопку в течение следующих 60 секунд!`
                }
            }
        }

        userData.save()

        const embed = new EmbedBuilder()
            .setColor(Number(client.information.bot_color))
            .setDescription(`## ${this.name}

${this.message.replace(`%%loot%%`, mapGot.join(`\n`))}
${perks_msg}`)

        const msg = await interaction.guild.channels.cache.get(ch_list.box).send({
            embeds: [embed],
            components: comps
        })

        await giveRewards(sortedBox);

        if (comps.length >= 1) {
            const collector = await msg.createMessageComponentCollector({ time: 60_000 });
            collector.on('collect', async (int) => {
                if (int.customId == 'change_item') {
                    await int.deferReply({ ephemeral: true, fetchReply: true })
                    if (int.user.id !== interaction.user.id) return int.editReply({
                        content: `Вы не можете использовать эту кнопку!`,
                        ephemeral: true
                    })
                    let finalLoot = [];
                    let finalLootToGiveNew = []

                    for (const item of alreadyHasGot) {
                        let loot = null;
                        switch (item.type) {
                            case typeList.LOOT: {
                                loot = await this.getLoot(1, this.repeatable_loot, (it) => it.rarity == item.result.rarity && it.type == item.result.type);
                            }
                                break;
                            case typeList.MYTHICAL: {
                                loot = await this.getMythical(1, this.repeatable_mythical, (it) => it.rarity == item.result.rarity && it.type == item.result.type);
                            }
                                break;
                            case typeList.COLLECTION: {
                                loot = await this.getCollection(1, this.repeatable_collection, (it) => it.rarity == item.result.rarity && it.type == item.result.type);
                            }
                                break;

                            default:
                                break;
                        }


                        if (loot !== null) {
                            finalLoot.push(
                                {
                                    type: item.type,
                                    result: loot[0]
                                }
                            )

                            finalLootToGiveNew.push(
                                {
                                    type: item.type,
                                    result: loot
                                }
                            )
                        }
                    }

                    //Final == new
                    //sorted == Before
                    //Already == Dupes
                    //
                    for (let loot of finalLoot) {
                        let find1 = await sortedBox.find(t => t.type == loot.type);
                        let def = await alreadyHasGot.find(t => t.type == loot.type)
                        let find2 = await find1.result.findIndex(t => t.roleID == def.result.roleID)
                        find1.result[find2] = loot.result;
                    }
                    comps[0].components[0].setDisabled(true);
                    i = 1;
                    perks_msg = `~~У вас есть умение \`✨ Изменение предметов\`, поэтому вы можете попытать удачу и изменить предмет, нажав на кнопку в течение следующих 60 секунд!~~`
                    functionResult = await turnIntoStringsArray(sortedBox);
                    mapGot = functionResult[0];

                    embed.setDescription(`## ${this.name}

${this.message.replace(`%%loot%%`, mapGot.join(`\n`))}
:black_medium_small_square:
${perks_msg}`)

                    await msg.edit({
                        components: comps,
                        embeds: [embed]
                    })

                    await giveRewards(finalLootToGiveNew);
                    await collector.stop();
                }


            })

            collector.on('end', async (err) => {
                comps[0].components[0].setDisabled(true);
                perks_msg = `~~У вас есть умение \`✨ Изменение предметов\`, поэтому вы можете попытать удачу и изменить предмет, нажав на кнопку в течение следующих 60 секунд!~~`

                embed.setDescription(`## ${this.name}

${this.message.replace(`%%loot%%`, mapGot.join(`\n`))}
:black_medium_small_square:
${perks_msg}`)

                await msg.edit({
                    components: comps,
                    embeds: [embed]
                })
            })

        }

        /**
         * 
         * @param {Array.<{type: LOOT_TYPE, result: (Array | number)}>} rewards All rewards that were received from the box. 
         */
        async function giveRewards(rewards) {
            for (const receiver of receivers) {
                let usRece = await User.findOne({ userid: receiver })
                const member = await interaction.guild.members.fetch(receiver);
                let toReply = []
                let i = 1;
                for (let reward of rewards) {
                    if (reward.type == typeList.COLLECTION) {
                        if (usRece.rank_number < 9) {
                            toReply.push(`**${i++}.** Вы должны быть **Императором гильдии** или выше, чтобы получать коллекции гильдии!`)
                            await msg.react(`❌`)
                        } else {
                            for (let item of reward.result) {
                                if (member.roles.cache.has(item.roleID)) {
                                    if (changeable) {
                                        if (usRece.perks.change_items >= 1) {
                                            await msg.react(`❌`)
                                        } else {
                                            if (usRece.stacked_items.length < usRece.upgrades.inventory_size && usRece.perks.store_items >= 1) {
                                                await usRece.stacked_items.push(item.roleID)
                                                await msg.react(`✅`)
                                            } else {
                                                await msg.react(`❌`)
                                                toReply.push(`**${i++}.** У вас нет умения \`📦 Сохранение дубликатов из коробок в инвентаре\` или в вашем инвентаре недостаточно места!`)
                                            }
                                        }
                                    } else {
                                        if (usRece.stacked_items.length < usRece.upgrades.inventory_size && usRece.perks.store_items >= 1) {
                                            await usRece.stacked_items.push(item.roleID)
                                            await msg.react(`✅`)
                                        } else {
                                            await msg.react(`❌`)
                                            toReply.push(`**${i++}.** У вас нет умения \`📦 Сохранение дубликатов из коробок в инвентаре\` или в вашем инвентаре недостаточно места!`)
                                        }
                                    }
                                } else {
                                    await member.roles.add(item.roleID)
                                    await msg.react(`✅`)
                                }
                            }
                        }
                    } else if (reward.type == typeList.MYTHICAL) {
                        if (usRece.rank_number < 2) {
                            toReply.push(`**${i++}.** Вы должны быть **Профессионалом гильдии** или выше, чтобы получать мифические предметы!`)
                            await msg.react(`❌`)
                        } else {
                            for (let item of reward.result) {
                                if (member.roles.cache.has(item.roleID)) {
                                    if (changeable) {
                                        if (usRece.perks.change_items >= 1) {
                                            await msg.react(`❌`)
                                        } else {
                                            if (usRece.stacked_items.length < usRece.upgrades.inventory_size && usRece.perks.store_items >= 1) {
                                                await usRece.stacked_items.push(item.roleID)
                                                await msg.react(`✅`)
                                            } else {
                                                await msg.react(`❌`)
                                                toReply.push(`**${i++}.** У вас нет умения \`📦 Сохранение дубликатов из коробок в инвентаре\` или в вашем инвентаре недостаточно места!`)
                                            }
                                        }
                                    } else {
                                        if (usRece.stacked_items.length < usRece.upgrades.inventory_size && usRece.perks.store_items >= 1) {
                                            await usRece.stacked_items.push(item.roleID)
                                            await msg.react(`✅`)
                                        } else {
                                            await msg.react(`❌`)
                                            toReply.push(`**${i++}.** У вас нет умения \`📦 Сохранение дубликатов из коробок в инвентаре\` или в вашем инвентаре недостаточно места!`)
                                        }
                                    }
                                } else {
                                    await member.roles.add(item.roleID)
                                    await msg.react(`✅`)
                                }
                            }
                        }
                    } else if (reward.type == typeList.LOOT) {
                        for (let item of reward.result) {
                            if (item.itemType == "static") {
                                if (typeof item.amount == 'boolean') {
                                    await changeProperty(usRece, item.roleID, item.amount);
                                    await msg.react(`✅`)
                                } else if (typeof item.amount == 'number') {
                                    let before = await getProperty(usRece, item.roleID);
                                    if (item.max && item.max > 0) {
                                        if (before + item.amount > item.max) {
                                            if (before >= item.max) {
                                                await msg.react(`❌`)
                                            } else {
                                                await changeProperty(usRece, item.roleID, item.max)
                                                await msg.react(`✅`)
                                            }
                                        } else {
                                            await changeProperty(usRece, item.roleID, before + item.amount)
                                            await msg.react(`✅`)
                                        }
                                    } else {
                                        await changeProperty(usRece, item.roleID, before + item.amount)
                                        await msg.react(`✅`)
                                    }
                                }
                            } else if (item.itemType == 'role') {
                                if (item.type == 'Mythical Item') {
                                    if (usRece.rank_number < 2) {
                                        toReply.push(`**${i++}.** Вы должны быть **Профессионалом гильдии** или выше, чтобы получать мифические предметы!`)
                                        await msg.react(`❌`)
                                    } else {
                                        if (member.roles.cache.has(item.roleID)) {
                                            if (changeable) {
                                                if (usRece.perks.change_items >= 1) {
                                                    await msg.react(`❌`)
                                                } else {
                                                    if (usRece.stacked_items.length < usRece.upgrades.inventory_size && usRece.perks.store_items >= 1) {
                                                        await usRece.stacked_items.push(item.roleID)
                                                        await msg.react(`✅`)
                                                    } else {
                                                        await msg.react(`❌`)
                                                        toReply.push(`**${i++}.** У вас нет умения \`📦 Сохранение дубликатов из коробок в инвентаре\` или в вашем инвентаре недостаточно места!`)
                                                    }
                                                }
                                            } else {
                                                if (usRece.stacked_items.length < usRece.upgrades.inventory_size && usRece.perks.store_items >= 1) {
                                                    await usRece.stacked_items.push(item.roleID)
                                                    await msg.react(`✅`)
                                                } else {
                                                    await msg.react(`❌`)
                                                    toReply.push(`**${i++}.** У вас нет умения \`📦 Сохранение дубликатов из коробок в инвентаре\` или в вашем инвентаре недостаточно места!`)
                                                }
                                            }
                                        } else {
                                            await member.roles.add(item.roleID)
                                            await msg.react(`✅`)
                                        }
                                    }
                                } else if (item.type == 'Collection') {
                                    if (usRece.rank_number < 9) {
                                        toReply.push(`**${i++}.** Вы должны быть **Императором гильдии** или выше, чтобы получать коллекции гильдии!`)
                                        await msg.react(`❌`)
                                    } else {
                                        if (member.roles.cache.has(item.roleID)) {
                                            if (changeable) {
                                                if (usRece.perks.change_items >= 1) {
                                                    await msg.react(`❌`)
                                                } else {
                                                    if (usRece.stacked_items.length < usRece.upgrades.inventory_size && usRece.perks.store_items >= 1) {
                                                        await usRece.stacked_items.push(item.roleID)
                                                        await msg.react(`✅`)
                                                    } else {
                                                        await msg.react(`❌`)
                                                        toReply.push(`**${i++}.** У вас нет умения \`📦 Сохранение дубликатов из коробок в инвентаре\` или в вашем инвентаре недостаточно места!`)
                                                    }
                                                }
                                            } else {
                                                if (usRece.stacked_items.length < usRece.upgrades.inventory_size && usRece.perks.store_items >= 1) {
                                                    await usRece.stacked_items.push(item.roleID)
                                                    await msg.react(`✅`)
                                                } else {
                                                    await msg.react(`❌`)
                                                    toReply.push(`**${i++}.** У вас нет умения \`📦 Сохранение дубликатов из коробок в инвентаре\` или в вашем инвентаре недостаточно места!`)
                                                }
                                            }
                                        } else {
                                            await member.roles.add(item.roleID)
                                            await msg.react(`✅`)
                                        }
                                    }
                                } else if (item.type == 'Empty') {
                                    let tools = [];
                                    for (let tool of item.req_to_upg) {
                                        if (member.roles.cache.has(tool)) {
                                            tools.push(true)
                                        } else {
                                            tools.push(false)
                                        }
                                    }

                                    if (tools.includes(true)) {
                                        if (member.roles.cache.has(item.roleID)) {
                                            if (usRece.stacked_items.length < usRece.upgrades.inventory_size && usRece.perks.store_items >= 1) {
                                                await usRece.stacked_items.push(item.roleID)
                                                await msg.react(`✅`)
                                                toReply.push(`**${i++}.** Так как у вас имеется необходимый предмет, то вы получаете <@&${item.roleID}>!`)
                                            } else {
                                                await msg.react(`❌`)
                                                toReply.push(`**${i++}.** У вас нет умения \`📦 Сохранение дубликатов из коробок в инвентаре\` или в вашем инвентаре недостаточно места!`)

                                            }
                                        } else {
                                            await member.roles.add(item.roleID)
                                            await msg.react(`✅`);
                                            toReply.push(`**${i++}.** Так как у вас имеется необходимый предмет, то вы получаете <@&${item.roleID}>!`)
                                        }
                                    } else {
                                        await msg.react(`❌`)
                                    }
                                } else if (item.type == 'Color') {
                                    if (usRece.rank_number < 6) {
                                        await msg.react(`❌`);
                                        toReply.push(`**${i++}.** Вы должны быть **Легендой гильдии** или выше, чтобы получать цвета гильдии!`)
                                    } else {
                                        if (!usRece.cosmetics_storage.colors.includes(item.roleID)) {
                                            usRece.cosmetics_storage.colors.push(item.roleID)
                                            await msg.react("✅")
                                        } else {
                                            await msg.react("❌")
                                        }
                                    }
                                } else {
                                    if (item.expire <= 0) {
                                        if (member.roles.cache.has(item.roleID)) {
                                            if (changeable) {
                                                if (usRece.perks.change_items >= 1) {
                                                    await msg.react(`❌`)
                                                } else {
                                                    if (usRece.stacked_items.length < usRece.upgrades.inventory_size && usRece.perks.store_items >= 1) {
                                                        await usRece.stacked_items.push(item.roleID)
                                                        await msg.react(`✅`)
                                                    } else {
                                                        if (item.type == "Box") {
                                                            await usRece.stacked_items.push(item.roleID)
                                                            await msg.react(`✅`)
                                                        } else {
                                                            await msg.react(`❌`)
                                                            toReply.push(`**${i++}.** У вас нет умения \`📦 Сохранение дубликатов из коробок в инвентаре\` или в вашем инвентаре недостаточно места!`)
                                                        }
                                                    }
                                                }
                                            } else {
                                                if (usRece.stacked_items.length < usRece.upgrades.inventory_size && usRece.perks.store_items >= 1) {
                                                    await usRece.stacked_items.push(item.roleID)
                                                    await msg.react(`✅`)
                                                } else {
                                                    if (item.type == "Box") {
                                                        await usRece.stacked_items.push(item.roleID)
                                                        await msg.react(`✅`)
                                                    } else {
                                                        await msg.react(`❌`)
                                                        toReply.push(`**${i++}.** У вас нет умения \`📦 Сохранение дубликатов из коробок в инвентаре\` или в вашем инвентаре недостаточно места!`)
                                                    }
                                                }
                                            }
                                        } else {
                                            await member.roles.add(item.roleID)
                                            await msg.react(`✅`)
                                        }
                                    } else {
                                        const checkTemp = await Temp.findOne({ userid: interaction.user.id, guildid: interaction.guild.id, roleid: item.roleID });
                                        if (checkTemp) {
                                            checkTemp.expire += item.expire * (1 + usRece.perks.temp_items)
                                            checkTemp.save();
                                            toReply.push(`**${i++}.** Длительность предмета \`${item.name}\` была успешно продлена до <t:${Math.round(checkTemp.expire.getTime() / 1000)}:f>!`)
                                            await msg.react(`✅`)
                                        } else {
                                            if (member.roles.cache.has(item.roleID)) {
                                                await msg.react(`❌`)
                                                toReply.push(`**${i++}.** Предмет \`${item.name}\` уже имеется в вашем профиле навсегда!`)
                                            } else {
                                                const temp = new Temp({
                                                    userid: interaction.user.id,
                                                    guildid: interaction.guild.id,
                                                    roleid: item.roleID,
                                                    expire: Date.now() + item.expire * (1 + usRece.perks.temp_items)
                                                })
                                                await msg.react(`✅`)
                                                await member.roles.cache.add(item.roleID)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    } else if (reward.type == typeList.COSMETICS) {
                        for (let item of reward.result) {
                            if (item.type == 'symbol') {
                                if (usRece.rank_number < 4) {
                                    toReply.push(`**${i++}.** Вы должны быть **Чемпионом гильдии** или выше, чтобы получать косметические значки!`)
                                    await msg.react(`❌`);
                                } else {
                                    if (usRece.cosmetics_storage.symbols.includes(item.symbol)) {
                                        await msg.react(`❌`);
                                    } else {
                                        usRece.cosmetics_storage.symbols.push(item.symbol)
                                        await msg.react(`✅`);
                                    }
                                }
                            } else if (item.type == `frame`) {
                                if (usRece.rank_number < 5) {
                                    toReply.push(`**${i++}.** Вы должны быть **Звёздочкой гильдии** или выше, чтобы получать косметические рамки!`)
                                    await msg.react(`❌`);
                                } else {
                                    if (usRece.cosmetics_storage.ramkas.includes({ ramka1: item.symbols[0], ramka2: item.symbols[1] })) {
                                        await msg.react(`❌`);
                                    } else {
                                        usRece.cosmetics_storage.ramkas.push({ ramka1: item.symbols[0], ramka2: item.symbols[1] })
                                        await msg.react(`✅`);
                                    }
                                }
                            } else if (item.type == `suffix`) {
                                if (usRece.rank_number < 8) {
                                    toReply.push(`**${i++}.** Вы должны быть **Лордом гильдии** или выше, чтобы получать косметические постфиксы!`)
                                    await msg.react(`❌`);
                                } else {
                                    if (usRece.cosmetics_storage.suffixes.includes(item.symbol)) {
                                        await msg.react(`❌`);
                                    } else {
                                        usRece.cosmetics_storage.suffixes.push(item.symbol)
                                        await msg.react(`✅`);
                                    }
                                }
                            } else if (item.type == `rank`) {
                                if (usRece.rank_number < 10) {
                                    toReply.push(`**${i++}.** Вы должны быть **Повелителем гильдии** или выше, чтобы получать косметические значки рангов!`)
                                    await msg.react(`❌`);
                                } else {
                                    if (usRece.cosmetics_storage.rank.includes(item.symbol)) {
                                        await msg.react(`❌`);
                                    } else {
                                        usRece.cosmetics_storage.rank.push(item.symbol)
                                        await msg.react(`✅`);
                                    }
                                }
                            }
                        }
                    } else if (reward.type == typeList.ACT_EXP) {
                        usRece.exp += reward.result
                    } else if (reward.type == typeList.RANK_EXP) {
                        usRece.rank += reward.result
                    } else if (reward.type == typeList.RUMBIKS) {
                        if (usRece.rank_number < 3) toReply.push(`**${i++}.** Вы должны быть **Мастером гильдии** или выше, чтобы зарабатывать румбики!`)
                        else {
                            usRece.rumbik += reward.result
                            usRece.progress.items.find(it => it.name == 'RUMBIKS_TOTAL').total_items += reward.result
                        }
                    } else if (reward.type == typeList.SEASONAL_POINTS) {
                        if (seasonType !== null) {
                            usRece.seasonal[seasonType].points += reward.result
                        }
                    } else if (reward.type == typeList.SNOWFLAKES) {
                        usRece.seasonal.new_year.snowflakes += reward.result
                    } else if (reward.type == typeList.TICKETS) {
                        if (usRece.rank_number < 5) toReply.push(`**${i++}.** Вы должны быть **Звёздочкой гильдии** или выше, чтобы зарабатывать билеты!`)
                        else {
                            usRece.tickets += reward.result;
                            usRece.progress.items.find(it => it.name == 'TICKETS_TOTAL').total_items += reward.result
                        }

                    } else if (reward.type == typeList.MEDALS) {
                        if (reward.result.type == 'first') {
                            usRece.medal_1 += reward.result.amount
                            usRece.progress.items.find(it => it.name == 'MEDALS_1').total_items += reward.result.amount
                        } else if (reward.result.type == `second`) {
                            usRece.medal_2 += reward.result.amount
                            usRece.progress.items.find(it => it.name == 'MEDALS_2').total_items += reward.result.amount
                        } else if (reward.result.type == `third`) {
                            usRece.medal_3 += reward.result.amount
                            usRece.progress.items.find(it => it.name == 'MEDALS_3').total_items += reward.result.amount
                        }
                    }
                }


                if (toReply.length >= 1) {
                    await msg.reply({
                        content: `${member}
${toReply.join(`\n`)}`
                    })
                }




                usRece.save();
                client.ActExp(usRece.userid);
                await wait(1000)
                client.ProgressUpdate(member);
            }

        }


    }
}


module.exports = {
    Boxes
}