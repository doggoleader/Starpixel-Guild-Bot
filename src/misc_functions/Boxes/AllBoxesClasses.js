const { ActionRowBuilder, UserSelectMenuBuilder, StringSelectMenuInteraction } = require("discord.js");
const { Boxes } = require("./BoxesAbstract");



/**
 * Boxes, which can be opened through /boxes command 
 */



    /**
     * 
     * @param {StringSelectMenuInteraction} interaction String Select Menu Interaction
     * @param {import("../Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     * 
     */
class Activity extends Boxes {
    constructor(interaction, client) {
        super(interaction, client);
        this.name = "Коробка активности";
        this.id = "983435186920366100";
        this.boxID = "activity";
        this.seasonType = null;
        this.loot_file = require("./Box loot/activity.json");
        this.message = this.getMessage();
        this.amount_loot = 1;
        this.amount_collection = 0;
        this.amount_cosmetics = 0;
        this.amount_mythical = 0;
        this.repeatable_loot = true;
        this.repeatable_collection = true;
        this.repeatable_mythical = true;
        this.repeatable_cosmetics = true;
        this.changeable = false;
        this.removeRole = true;
        this.hasCD = false;
        this.cooldown = 0;
        this.loot_types = [
            this.allTypes.LOOT
        ]
    }
    getMessage() {
        let map = this.receivers.map(r => {
            return `<@${r}>`
        })
        return `◾
╭═────═⌘═────═╮
${map.join(`, `)} получа${map.length > 1 ? "ют" : "ет" } следующие предметы:
%%loot%%
╰═────═⌘═────═╯
◾`
    }
}
/**
 * 
 * @param {StringSelectMenuInteraction} interaction String Select Menu Interaction
 * @param {import("../Classes/System/StarpixelClient").StarpixelClient} client Discord Client
 * 
 */
class Bag extends Boxes {
    constructor(interaction, client) {
        super(interaction, client);
        this.name = "Мешочек";
        this.id = "819930814388240385";
        this.boxID = "bag";
        this.seasonType = null;
        this.loot_file = require("./Box loot/bag.json");
        this.message = this.getMessage();
        this.amount_loot = 0;
        this.amount_collection = 0;
        this.amount_cosmetics = 0;
        this.amount_mythical = 0;
        this.repeatable_loot = true;
        this.repeatable_collection = true;
        this.repeatable_mythical = true;
        this.repeatable_cosmetics = true;
        this.changeable = false;
        this.removeRole = true;
        this.hasCD = false;
        this.cooldown = 0;
        this.loot_types = [
            this.allTypes.ACT_EXP
        ]
    }
    getMessage() {
        let map = this.receivers.map(r => {
            return `<@${r}>`
        })
        return `◾
╔═════════♡════════╗
${map.join(`, `)} получа${map.length > 1 ? "ют" : "ет" } следующие предметы:
%%loot%%
╚═════════♡════════╝
◾`
    }
}
/**
 * 
 * @param {StringSelectMenuInteraction} interaction String Select Menu Interaction
 * @param {import("../Classes/System/StarpixelClient").StarpixelClient} client Discord Client
 * 
 */
class Big extends Boxes {
    constructor(interaction, client) {
        super(interaction, client);
        this.name = "Большая коробка";
        this.id = "521248091853291540";
        this.boxID = "big";
        this.seasonType = null;
        this.loot_file = require("./Box loot/big.json");
        this.message = this.getMessage();
        this.amount_loot = 1;
        this.amount_collection = 0;
        this.amount_cosmetics = 1;
        this.amount_mythical = 0;
        this.repeatable_loot = true;
        this.repeatable_collection = true;
        this.repeatable_mythical = true;
        this.repeatable_cosmetics = true;
        this.changeable = true;
        this.removeRole = true;
        this.hasCD = false;
        this.cooldown = 0;
        this.loot_types = [
            this.allTypes.ACT_EXP,
            this.allTypes.LOOT,
            this.allTypes.COSMETICS,
            this.allTypes.RANK_EXP
        ]
    }
    getMessage() {
        let map = this.receivers.map(r => {
            return `<@${r}>`
        })
        return `◾
╭═────═⌘═────═╮
${map.join(`, `)} получа${map.length > 1 ? "ют" : "ет" } следующие предметы:
%%loot%%
╰═────═⌘═────═╯
◾`
    }
}
/**
 * 
 * @param {StringSelectMenuInteraction} interaction String Select Menu Interaction
 * @param {import("../Classes/System/StarpixelClient").StarpixelClient} client Discord Client
 * 
 */
class Daily extends Boxes {
    constructor(interaction, client) {
        super(interaction, client);
        this.name = "Ежедневная коробка";
        this.id = null;
        this.boxID = "daily";
        this.seasonType = null;
        this.loot_file = require("./Box loot/daily.json");
        this.message = this.getMessage();
        this.amount_loot = 1;
        this.amount_collection = 0;
        this.amount_cosmetics = 0;
        this.amount_mythical = 0;
        this.repeatable_loot = true;
        this.repeatable_collection = true;
        this.repeatable_mythical = true;
        this.repeatable_cosmetics = true;
        this.changeable = false;
        this.removeRole = false;
        this.hasCD = true;
        this.cooldown = 1000 * 60 * 60 * 16;
        this.loot_types = [
            this.allTypes.ACT_EXP,
            this.allTypes.LOOT,
            this.allTypes.RANK_EXP
        ]
    }
    getMessage() {
        let map = this.receivers.map(r => {
            return `<@${r}>`
        })
        return `◾
╭──────────╮
${map.join(`, `)} получа${map.length > 1 ? "ют" : "ет" } следующие предметы:
%%loot%%
╰──────────╯
◾`
    }
}
/**
 * 
 * @param {StringSelectMenuInteraction} interaction String Select Menu Interaction
 * @param {import("../Classes/System/StarpixelClient").StarpixelClient} client Discord Client
 * 
 */
class Easter extends Boxes {
    constructor(interaction, client) {
        super(interaction, client);
        this.name = "Пасхальное яйцо";
        this.id = "1007718117809606736";
        this.boxID = "easter";
        this.seasonType = "easter";
        this.loot_file = require("./Box loot/easter.json");
        this.message = this.getMessage();
        this.amount_loot = 1;
        this.amount_collection = 0;
        this.amount_cosmetics = 0;
        this.amount_mythical = 0;
        this.repeatable_loot = true;
        this.repeatable_collection = true;
        this.repeatable_mythical = true;
        this.repeatable_cosmetics = true;
        this.changeable = false;
        this.removeRole = true;
        this.hasCD = false;
        this.cooldown = 0;
        this.loot_types = [
            this.allTypes.ACT_EXP,
            this.allTypes.LOOT,
            this.allTypes.RANK_EXP,
            this.allTypes.SEASONAL_POINTS
        ]
    }
    getMessage() {
        let map = this.receivers.map(r => {
            return `<@${r}>`
        })
        return `◾

░░░░░░░░░░▄▄██████▄▄░░░░░░░░░░
░░░░░░░░▄███▀▀▀▀▀▀███▄░░░░░░░░
░░░░░░▄███▀░░░░░░░░▀███▄░░░░░░
░░░░░▄██▀░░░░░░░░░░░░▀██▄░░░░░

${map.join(`, `)} получа${map.length > 1 ? "ют" : "ет" } следующие предметы:
%%loot%%

░░▀██▄░░░░░░░░░░░░░░░░░░▄██▀░░
░░░▀███▄▄░░░░░░░░░░░░▄▄███▀░░░
░░░░░▀▀████▄▄▄▄▄▄▄▄████▀▀░░░░░
░░░░░░░░░▀▀▀██████▀▀░░░░░░░░░░
◾`
    }
}
/**
 * 
 * @param {StringSelectMenuInteraction} interaction String Select Menu Interaction
 * @param {import("../Classes/System/StarpixelClient").StarpixelClient} client Discord Client
 * 
 */
class King extends Boxes {
    constructor(interaction, client) {
        super(interaction, client);
        this.name = "Королевская коробка";
        this.id = "584673040470769667";
        this.boxID = "king";
        this.seasonType = null;
        this.loot_file = require("./Box loot/king.json");
        this.message = this.getMessage();
        this.amount_loot = 1;
        this.amount_collection = 0;
        this.amount_cosmetics = 1;
        this.amount_mythical = 0;
        this.repeatable_loot = true;
        this.repeatable_collection = true;
        this.repeatable_mythical = true;
        this.repeatable_cosmetics = true;
        this.changeable = false;
        this.removeRole = true;
        this.hasCD = false;
        this.cooldown = 0;
        this.loot_types = [
            this.allTypes.ACT_EXP,
            this.allTypes.LOOT,
            this.allTypes.COSMETICS,
            this.allTypes.RANK_EXP,
            this.allTypes.RUMBIKS
        ]
    }
    getMessage() {
        let map = this.receivers.map(r => {
            return `<@${r}>`
        })
        return `◾ :crown: ◾
╔━═━═━︽︾♚︾︽━═━═━╗
${map.join(`, `)} получа${map.length > 1 ? "ют" : "ет" } следующие предметы:
%%loot%%
╚━═━═━︾︽♔︽︾━═━═━╝
◾ :crown: ◾`
    }
}
/**
 * 
 * @param {StringSelectMenuInteraction} interaction String Select Menu Interaction
 * @param {import("../Classes/System/StarpixelClient").StarpixelClient} client Discord Client
 * 
 */
class Mega extends Boxes {
    constructor(interaction, client) {
        super(interaction, client);
        this.name = "Огромная коробка";
        this.id = "992820494900412456";
        this.boxID = "mega";
        this.seasonType = null;
        this.loot_file = require("./Box loot/mega.json");
        this.message = this.getMessage();
        this.amount_loot = 2;
        this.amount_collection = 0;
        this.amount_cosmetics = 1;
        this.amount_mythical = 0;
        this.repeatable_loot = true;
        this.repeatable_collection = true;
        this.repeatable_mythical = true;
        this.repeatable_cosmetics = true;
        this.changeable = false;
        this.true = false;
        this.hasCD = false;
        this.cooldown = 0;
        this.loot_types = [
            this.allTypes.ACT_EXP,
            this.allTypes.LOOT,
            this.allTypes.COSMETICS,
            this.allTypes.RUMBIKS,
            this.allTypes.RANK_EXP
        ]
    }
    getMessage() {
        let map = this.receivers.map(r => {
            return `<@${r}>`
        })
        return `◾
╭───────₪۞₪───────╮
${map.join(`, `)} получа${map.length > 1 ? "ют" : "ет" } следующие предметы:
%%loot%%
╰───────₪۞₪───────╯
◾`
    }
}
/**
 * 
 * @param {StringSelectMenuInteraction} interaction String Select Menu Interaction
 * @param {import("../Classes/System/StarpixelClient").StarpixelClient} client Discord Client
 * 
 */
class Monthly extends Boxes {
    constructor(interaction, client) {
        super(interaction, client);
        this.name = "Ежемесячная коробка";
        this.id = null;
        this.boxID = "monthly";
        this.seasonType = null;
        this.loot_file = require("./Box loot/monthly.json");
        this.message = this.getMessage();
        this.amount_loot = 1;
        this.amount_collection = 0;
        this.amount_cosmetics = 0;
        this.amount_mythical = 0;
        this.repeatable_loot = true;
        this.repeatable_collection = true;
        this.repeatable_mythical = true;
        this.repeatable_cosmetics = true;
        this.changeable = false;
        this.removeRole = false;
        this.hasCD = true;
        this.cooldown = 1000 * 60 * 60 * 24 * 30;
        this.loot_types = [
            this.allTypes.ACT_EXP,
            this.allTypes.LOOT,
            this.allTypes.RUMBIKS,
            this.allTypes.RANK_EXP
        ]
    }
    getMessage() {
        let map = this.receivers.map(r => {
            return `<@${r}>`
        })
        return `◾
╭──────────╮
${map.join(`, `)} получа${map.length > 1 ? "ют" : "ет" } следующие предметы:
%%loot%%
╰──────────╯
◾`
    }
}
/**
 * 
 * @param {StringSelectMenuInteraction} interaction String Select Menu Interaction
 * @param {import("../Classes/System/StarpixelClient").StarpixelClient} client Discord Client
 * 
 */
class Mystery extends Boxes {
    constructor(interaction, client) {
        super(interaction, client);
        this.name = "Загадочная коробка";
        this.id = "992820488298578041";
        this.boxID = "mystery";
        this.seasonType = null;
        this.loot_file = require("./Box loot/mystery.json");
        this.message = this.getMessage();
        this.amount_loot = 7;
        this.amount_collection = 1;
        this.amount_cosmetics = 1;
        this.amount_mythical = 2;
        this.repeatable_loot = false;
        this.repeatable_collection = false;
        this.repeatable_mythical = false;
        this.repeatable_cosmetics = false;
        this.changeable = false;
        this.removeRole = true;
        this.hasCD = false;
        this.loot_types = [
            this.allTypes.ACT_EXP,
            this.allTypes.LOOT,
            this.allTypes.COSMETICS,
            this.allTypes.RANK_EXP,
            this.allTypes.COLLECTION,
            this.allTypes.MYTHICAL,
            this.allTypes.RUMBIKS
        ]
        this.cooldown = 0;
    }
    getMessage() {
        let map = this.receivers.map(r => {
            return `<@${r}>`
        })
        return `｡･:\\*:･ﾟ★,｡･:\\*:･ﾟ☆ﾟ･:\\*:･ﾟ☆ﾟ･:\\*:･｡,★ﾟ･:\\*:･｡
˚\\*•̩̩͙✩•̩̩͙\\*˚＊˚\\*•̩̩͙✩•̩̩͙\\*˚＊˚\\*•̩̩͙✩•̩̩͙\\*˚＊˚\\*•̩̩͙✩•̩̩͙\\*˚＊

${map.join(`, `)} получа${map.length > 1 ? "ют" : "ет" } следующие предметы:

%%loot%%

˚\\*•̩̩͙✩•̩̩͙\\*˚＊˚\\*•̩̩͙✩•̩̩͙\\*˚＊˚\\*•̩̩͙✩•̩̩͙\\*˚＊˚\\*•̩̩͙✩•̩̩͙\\*˚＊
｡･:\\*:･ﾟ★,｡･:\\*:･ﾟ☆ﾟ･:\\*:･ﾟ☆ﾟ･:\\*:･｡,★ﾟ･:\\*:･｡`
    }
}
/**
 * 
 * @param {StringSelectMenuInteraction} interaction String Select Menu Interaction
 * @param {import("../Classes/System/StarpixelClient").StarpixelClient} client Discord Client
 * 
 */
class Myth extends Boxes {
    constructor(interaction, client) {
        super(interaction, client);
        this.name = "Подарок судьбы";
        this.id = "781069821953441832";
        this.boxID = "myth";
        this.seasonType = null;
        this.loot_file = require("./Box loot/myth.json");
        this.message = this.getMessage();
        this.amount_loot = 3;
        this.amount_collection = 0;
        this.amount_cosmetics = 0;
        this.amount_mythical = 1;
        this.repeatable_loot = true;
        this.repeatable_collection = true;
        this.repeatable_mythical = true;
        this.repeatable_cosmetics = true;
        this.changeable = false;
        this.removeRole = true;
        this.hasCD = false;
        this.cooldown = 0;
        this.loot_types = [
            this.allTypes.ACT_EXP,
            this.allTypes.LOOT,
            this.allTypes.MYTHICAL,
            this.allTypes.RUMBIKS,
            this.allTypes.RANK_EXP
        ]
    }
    getMessage() {
        let map = this.receivers.map(r => {
            return `<@${r}>`
        })
        return `☆   :boom:   :comet:   ☆   ☆   ☆   ☆   :comet:   :boom:   ☆
:sparkles:   ☆   ☆   :comet:   ☆   ☆   :comet:   ☆   ☆   :sparkles:
☆   :star2:   ☆   ☆   :star:   :star:   ☆   ☆   :star2:   ☆


${map.join(`, `)} получа${map.length > 1 ? "ют" : "ет" } следующие предметы:

%%loot%%

☆   :star2:   ☆   ☆   :star:   :star:   ☆   ☆   :star2:   ☆
:sparkles:   ☆   ☆   :comet:   ☆   ☆   :comet:   ☆   ☆   :sparkles:
☆   :boom:   :comet:   ☆   ☆   ☆   ☆   :comet:   :boom:   ☆`
    }
}
/**
 * 
 * @param {StringSelectMenuInteraction} interaction String Select Menu Interaction
 * @param {import("../Classes/System/StarpixelClient").StarpixelClient} client Discord Client
 * 
 */
class Present extends Boxes {
    constructor(interaction, client) {
        super(interaction, client);
        this.name = "Новогодний подарок";
        this.id = "925799156679856240";
        this.boxID = "present";
        this.seasonType = "new_year";
        this.loot_file = require("./Box loot/present.json");
        this.message = this.getMessage();
        this.amount_loot = 1;
        this.amount_collection = 0;
        this.amount_cosmetics = 0;
        this.amount_mythical = 0;
        this.repeatable_loot = true;
        this.repeatable_collection = true;
        this.repeatable_mythical = true;
        this.repeatable_cosmetics = true;
        this.changeable = false;
        this.removeRole = true;
        this.hasCD = false;
        this.cooldown = 0;
        this.loot_types = [
            this.allTypes.ACT_EXP,
            this.allTypes.LOOT,
            this.allTypes.SEASONAL_POINTS,
            this.allTypes.SNOWFLAKES,
            this.allTypes.RANK_EXP
        ]
    }
    getMessage() {
        const songs = [
            `Новый год к нам мчится`,
            `А снег идет`,
            `Знает каждый снеговик снеговика`,
            `Новый год, он раз в году!`,
            `На свете есть Волшебный клей`,
            `Наша елка — просто чудо`,
            `Хорошо, что каждый год к нам приходит Новый год`,
            `Не рубили елочку мы на Новый год`,
            `Под Новый год, как в сказке, полным-полно чудес`,
            `Снежинки спускаются с неба`,
            `Белые снежинки кружатся с утра`,
            `Праздник к нам приходит`,

        ]
        const r_song = songs[Math.floor(Math.random() * songs.length)]
        let map = this.receivers.map(r => {
            return `<@${r}>`
        })
        return `◾
╔━═━︽︾︽︾🎅︾︽︾︽━═━╗
${map.join(`, `)} получа${map.length > 1 ? "ют" : "ет" } следующие предметы:
%%loot%%
${r_song}!
╚━═━︽︾︽︾🎅︾︽︾︽━═━╝
◾`
    }
    async getReceivers() {
        const interaction = this.interaction;
        const client = this.client;

        const userSelect = new ActionRowBuilder()
            .addComponents(
                new UserSelectMenuBuilder()
                    .setCustomId(`user_present`)
                    .setPlaceholder(`Выберите пользователя`)
            )
        const rr = await interaction.editReply({
            content: `Выберите пользователя, который станет получателем подарка!`,
            ephemeral: true,
            components: [userSelect],
            fetchReply: true
        })
        const collector = rr.createMessageComponentCollector()
        collector.on('collect', async i => {
            await i.deferReply({ ephemeral: true, fetchReply: true })
            const toReceive = await i.guild.members.fetch(i.values[0])
            if (toReceive.user.id == i.user.id) return i.editReply({
                content: `Вы не можете отправить подарок самому себе!`,
                ephemeral: true
            })
            if (!toReceive.roles.cache.has(`504887113649750016`)) return i.editReply({
                content: `Вы не можете отправить подарок гостю гильдии!`,
                ephemeral: true
            })
            if (toReceive.user.bot) return i.editReply({
                content: `Вы не можете отправить подарок боту!`,
                ephemeral: true
            })
            this.interaction = i;
            let receivers = [
                "opener",
                "gifted",
                "both",
                "both",
                "both"

            ]
            let receiver = receivers[Math.floor(Math.random() * receivers.length)]
            let userToReceive = []
            if (receiver == `opener`) {
                userToReceive.push(i.user.id)
            } else if (receiver == `gifted`) {
                userToReceive.push(toReceive.user.id)
            } else if (receiver == `both`) {
                userToReceive.push(i.user.id)
                userToReceive.push(toReceive.user.id)
            }
            this.receivers = userToReceive;
            this.message = this.getMessage();
            await interaction.deleteReply();

            await this.sendBox();
        })
    }
}
/**
 * 
 * @param {StringSelectMenuInteraction} interaction String Select Menu Interaction
 * @param {import("../Classes/System/StarpixelClient").StarpixelClient} client Discord Client
 * 
 */
class Prestige extends Boxes {
    constructor(interaction, client) {
        super(interaction, client);
        this.name = "Талисман счастья";
        this.id = "572124606870192143";
        this.boxID = "prestige";
        this.seasonType = null;
        this.loot_file = require("./Box loot/prestige.json");
        this.message = this.getMessage();
        this.amount_loot = 1;
        this.amount_collection = 0;
        this.amount_cosmetics = 0;
        this.amount_mythical = 0;
        this.repeatable_loot = true;
        this.repeatable_collection = true;
        this.repeatable_mythical = true;
        this.repeatable_cosmetics = true;
        this.changeable = false;
        this.removeRole = false;
        this.hasCD = true;
        this.cooldown = 1000 * 60 * 60 * 24 * 7;
        this.loot_types = [
            this.allTypes.ACT_EXP,
            this.allTypes.LOOT
        ]
    }
    getMessage() {
        let map = this.receivers.map(r => {
            return `<@${r}>`
        })
        return `◾
╭═────:nazar_amulet:────═╮
${map.join(`, `)} получа${map.length > 1 ? "ют" : "ет" } следующие предметы:
%%loot%%
╰═────:nazar_amulet:────═╯
◾`
    }
}
/**
 * 
 * @param {StringSelectMenuInteraction} interaction String Select Menu Interaction
 * @param {import("../Classes/System/StarpixelClient").StarpixelClient} client Discord Client
 * 
 */
class SeasonalWinner extends Boxes {
    constructor(interaction, client) {
        super(interaction, client);
        this.name = "Коробка сезонного победителя";
        this.id = "1132678509307904210";
        this.boxID = "seasonalWinner";
        this.seasonType = null;
        this.loot_file = require("./Box loot/seasonalWinner.json");
        this.message = this.getMessage();
        this.amount_loot = 1;
        this.amount_collection = 0;
        this.amount_cosmetics = 0;
        this.amount_mythical = 0;
        this.repeatable_loot = true;
        this.repeatable_collection = true;
        this.repeatable_mythical = true;
        this.repeatable_cosmetics = true;
        this.changeable = false;
        this.removeRole = false;
        this.hasCD = true;
        this.cooldown = 1000 * 60 * 60 * 24 * 7;
        this.loot_types = [
            this.allTypes.ACT_EXP,
            this.allTypes.LOOT
        ]
    }
    getMessage() {
        let map = this.receivers.map(r => {
            return `<@${r}>`
        })
        return `◾ 🏆 ◾
╭────────۞────────╮
${map.join(`, `)} получа${map.length > 1 ? "ют" : "ет" } следующие предметы:
%%loot%%
╰────────۞────────╯
◾ 🏆 ◾`
    }
}
/**
 * 
 * @param {StringSelectMenuInteraction} interaction String Select Menu Interaction
 * @param {import("../Classes/System/StarpixelClient").StarpixelClient} client Discord Client
 * 
 */
class Small extends Boxes {
    constructor(interaction, client) {
        super(interaction, client);
        this.name = "Маленькая коробка";
        this.id = "510932601721192458";
        this.boxID = "small";
        this.seasonType = null;
        this.loot_file = require("./Box loot/small.json");
        this.message = this.getMessage();
        this.amount_loot = 1;
        this.amount_collection = 0;
        this.amount_cosmetics = 0;
        this.amount_mythical = 0;
        this.repeatable_loot = true;
        this.repeatable_collection = true;
        this.repeatable_mythical = true;
        this.repeatable_cosmetics = true;
        this.changeable = true;
        this.removeRole = true;
        this.hasCD = false;
        this.cooldown = 0;
        this.loot_types = [
            this.allTypes.ACT_EXP,
            this.allTypes.LOOT,
            this.allTypes.RANK_EXP
        ]
    }
    getMessage() {
        let map = this.receivers.map(r => {
            return `<@${r}>`
        })
        return `◾
╭─────x─────╮
${map.join(`, `)} получа${map.length > 1 ? "ют" : "ет" } следующие предметы:
%%loot%%
╰─────x─────╯
◾`
    }
}
/**
 * 
 * @param {StringSelectMenuInteraction} interaction String Select Menu Interaction
 * @param {import("../Classes/System/StarpixelClient").StarpixelClient} client Discord Client
 * 
 */
class Spooky extends Boxes {
    constructor(interaction, client) {
        super(interaction, client);
        this.name = "Жуткая коробка";
        this.id = "893932177799135253";
        this.boxID = "spooky";
        this.seasonType = "halloween";
        this.loot_file = require("./Box loot/spooky.json");
        this.message = this.getMessage();
        this.amount_loot = 1;
        this.amount_collection = 0;
        this.amount_cosmetics = 0;
        this.amount_mythical = 0;
        this.repeatable_loot = true;
        this.repeatable_collection = true;
        this.repeatable_mythical = true;
        this.repeatable_cosmetics = true;
        this.changeable = false;
        this.removeRole = true;
        this.hasCD = false;
        this.cooldown = 0;
        this.loot_types = [
            this.allTypes.ACT_EXP,
            this.allTypes.LOOT,
            this.allTypes.SEASONAL_POINTS,
            this.allTypes.RANK_EXP
        ]
    }
    getMessage() {
        let map = this.receivers.map(r => {
            return `<@${r}>`
        })
        return `◾
╔━═━︽︾︽︾🎃︾︽︾︽━═━╗
${map.join(`, `)} получа${map.length > 1 ? "ют" : "ет" } следующие предметы:
%%loot%%
╚━═━︽︾︽︾🎃︾︽︾︽━═━╝
◾`
    }
}
/**
 * 
 * @param {StringSelectMenuInteraction} interaction String Select Menu Interaction
 * @param {import("../Classes/System/StarpixelClient").StarpixelClient} client Discord Client
 * 
 */
class Staffbox extends Boxes {
    constructor(interaction, client) {
        super(interaction, client);
        this.name = "Коробка персонала";
        this.id = "563793535250464809";
        this.boxID = "staffbox";
        this.seasonType = null;
        this.loot_file = require("./Box loot/staffbox.json");
        this.message = this.getMessage();
        this.amount_loot = 1;
        this.amount_collection = 0;
        this.amount_cosmetics = 0;
        this.amount_mythical = 0;
        this.repeatable_loot = true;
        this.repeatable_collection = true;
        this.repeatable_mythical = true;
        this.repeatable_cosmetics = true;
        this.changeable = false;
        this.removeRole = false;
        this.hasCD = true;
        this.cooldown = 1000 * 60 * 60 * 24 * 4;
        this.loot_types = [
            this.allTypes.ACT_EXP,
            this.allTypes.LOOT,
            this.allTypes.RUMBIKS,
            this.allTypes.RANK_EXP
        ]
    }
    getMessage() {
        let map = this.receivers.map(r => {
            return `<@${r}>`
        })
        return `◾ 💼 ◾
╭────────۞────────╮
${map.join(`, `)} получа${map.length > 1 ? "ют" : "ет" } следующие предметы:
%%loot%%
╰────────۞────────╯
◾ 💼 ◾`
    }
}
/**
 * 
 * @param {StringSelectMenuInteraction} interaction String Select Menu Interaction
 * @param {import("../Classes/System/StarpixelClient").StarpixelClient} client Discord Client
 * 
 */
class Summer extends Boxes {
    constructor(interaction, client) {
        super(interaction, client);
        this.name = "Летняя коробка";
        this.id = "1104095303054934168";
        this.boxID = "summer";
        this.seasonType = "summer";
        this.loot_file = require("./Box loot/summer.json");
        this.message = this.getMessage();
        this.amount_loot = 1;
        this.amount_collection = 0;
        this.amount_cosmetics = 0;
        this.amount_mythical = 0;
        this.repeatable_loot = true;
        this.repeatable_collection = true;
        this.repeatable_mythical = true;
        this.repeatable_cosmetics = true;
        this.changeable = false;
        this.removeRole = true;
        this.hasCD = false;
        this.loot_types = [
            this.allTypes.ACT_EXP,
            this.allTypes.LOOT,
            this.allTypes.SEASONAL_POINTS,
            this.allTypes.RANK_EXP
        ]
        this.cooldown = 0;
    }
    getMessage() {
        let map = this.receivers.map(r => {
            return `<@${r}>`
        })
        return `◾

░░░░░░░░░░░░░░░░░░░░░░░
╭◜◞◝◜◟◝╮╭◜◜◝◜◝◝╮
╰◟◝◞◟◜◞╯╰◟◟◞◟◞◞╯
░░░░░░░░░░░░░░░░░░░░░░░


${map.join(`, `)} получа${map.length > 1 ? "ют" : "ет" } следующие предметы:
%%loot%%


░░░░░░░░░░░░░░░░░░░░░░░
╭◜◞◝◜◟◝╮╭◜◜◝◜◝◝╮
╰◟◝◞◟◜◞╯╰◟◟◞◟◞◞╯
░░░░░░░░░░░░░░░░░░░░░░░
◾`
    }
}
/**
 * 
 * @param {StringSelectMenuInteraction} interaction String Select Menu Interaction
 * @param {import("../Classes/System/StarpixelClient").StarpixelClient} client Discord Client
 * 
 */
class Treasure extends Boxes {
    constructor(interaction, client) {
        super(interaction, client);
        this.name = "Сокровище";
        this.id = "595966177969176579";
        this.boxID = "treasure";
        this.seasonType = null;
        this.loot_file = require("./Box loot/treasure.json");
        this.message = this.getMessage();
        this.amount_loot = 1;
        this.amount_collection = 0;
        this.amount_cosmetics = 0;
        this.amount_mythical = 0;
        this.repeatable_loot = true;
        this.repeatable_collection = true;
        this.repeatable_mythical = true;
        this.repeatable_cosmetics = true;
        this.changeable = false;
        this.removeRole = true;
        this.hasCD = false;
        this.loot_types = [
            this.allTypes.ACT_EXP,
            this.allTypes.LOOT,
            this.allTypes.RUMBIKS,
            this.allTypes.RANK_EXP
        ]
        this.cooldown = 0;
    }
    getMessage() {
        let map = this.receivers.map(r => {
            return `<@${r}>`
        })
        return `◾:rosette:◾
▛▀▀▀▀▀▜ ■ ▛▀▀▀▀▀▜ ■ ▛▀▀▀▀▀▜
${map.join(`, `)} получа${map.length > 1 ? "ют" : "ет" } следующие предметы:
%%loot%%
▙▄▄▄▄▄▟ ■ ▙▄▄▄▄▄▟■ ▙▄▄▄▄▄▟
◾:rosette:◾`
    }
}
/**
 * 
 * @param {StringSelectMenuInteraction} interaction String Select Menu Interaction
 * @param {import("../Classes/System/StarpixelClient").StarpixelClient} client Discord Client
 * 
 */
class Weekly extends Boxes {
    constructor(interaction, client) {
        super(interaction, client);
        this.name = "Еженедельная коробка";
        this.id = null;
        this.boxID = "weekly";
        this.seasonType = null;
        this.loot_file = require("./Box loot/weekly.json");
        this.message = this.getMessage();
        this.amount_loot = 1;
        this.amount_collection = 0;
        this.amount_cosmetics = 0;
        this.amount_mythical = 0;
        this.repeatable_loot = true;
        this.repeatable_collection = true;
        this.repeatable_mythical = true;
        this.repeatable_cosmetics = true;
        this.changeable = false;
        this.removeRole = false;
        this.hasCD = true;
        this.cooldown = 1000 * 60 * 60 * 24 * 7;
        this.loot_types = [
            this.allTypes.ACT_EXP,
            this.allTypes.LOOT,
            this.allTypes.RANK_EXP
        ]
    }
    getMessage() {
        let map = this.receivers.map(r => {
            return `<@${r}>`
        })
        return `◾
╭──────────╮
${map.join(`, `)} получа${map.length > 1 ? "ют" : "ет" } следующие предметы:
%%loot%%
╰──────────╯
◾`
    }
}



/**
 * Pets & Elements 
 */


/**
 * 
 * @param {StringSelectMenuInteraction} interaction String Select Menu Interaction
 * @param {import("../Classes/System/StarpixelClient").StarpixelClient} client Discord Client
 * 
 */
class Spet extends Boxes {
    constructor(interaction, client) {
        super(interaction, client);
        this.name = "Питомец Земли";
        this.id = "553637207911563264";
        this.boxID = "spet";
        this.seasonType = null;
        this.loot_file = require("./Box loot/PetEarth.json");
        this.message = this.getMessage();
        this.amount_loot = 1;
        this.amount_collection = 0;
        this.amount_cosmetics = 0;
        this.amount_mythical = 0;
        this.repeatable_loot = true;
        this.repeatable_collection = true;
        this.repeatable_mythical = true;
        this.repeatable_cosmetics = true;
        this.changeable = false;
        this.removeRole = false;
        this.hasCD = true;
        this.cooldown = 1000 * 60 * 60 * 24 * 4;
        this.loot_types = [
            this.allTypes.LOOT
        ]
    }
    getMessage() {
        let map = this.receivers.map(r => {
            return `<@${r}>`
        })
        return `:black_medium_small_square:
╭──────────╮
🐛 ${map.join(`, `)} отправи${map.length > 1 ? "лись" : "лся" } на обучение к Питомцу Земли. 🐛
Он${map.length > 1 ? "и" : "" } получи${map.length > 1 ? "ли" : "л" } следующий урок:
%%loot%%
╰──────────╯
:black_medium_small_square:`
    }
}
/**
 * 
 * @param {StringSelectMenuInteraction} interaction String Select Menu Interaction
 * @param {import("../Classes/System/StarpixelClient").StarpixelClient} client Discord Client
 * 
 */
class Epet extends Boxes {
    constructor(interaction, client) {
        super(interaction, client);
        this.name = "Питомец Воздуха";
        this.id = "553638054238093364";
        this.boxID = "epet";
        this.seasonType = null;
        this.loot_file = require("./Box loot/PetAir.json");
        this.message = this.getMessage();
        this.amount_loot = 1;
        this.amount_collection = 0;
        this.amount_cosmetics = 0;
        this.amount_mythical = 0;
        this.repeatable_loot = true;
        this.repeatable_collection = true;
        this.repeatable_mythical = true;
        this.repeatable_cosmetics = true;
        this.changeable = false;
        this.removeRole = false;
        this.hasCD = true;
        this.cooldown = 1000 * 60 * 60 * 24 * 4;
        this.loot_types = [
            this.allTypes.LOOT
        ]
    }
    getMessage() {
        let map = this.receivers.map(r => {
            return `<@${r}>`
        })
        return `:black_medium_small_square:
╭──────────╮
🕊️ ${map.join(`, `)} отправи${map.length > 1 ? "лись" : "лся" } на обучение к Питомцу Воздуха. 🕊️
Он${map.length > 1 ? "и" : "" } получи${map.length > 1 ? "ли" : "л" } следующий урок:
%%loot%%
╰──────────╯
:black_medium_small_square:`
    }
}
/**
 * 
 * @param {StringSelectMenuInteraction} interaction String Select Menu Interaction
 * @param {import("../Classes/System/StarpixelClient").StarpixelClient} client Discord Client
 * 
 */
class Lpet extends Boxes {
    constructor(interaction, client) {
        super(interaction, client);
        this.name = "Питомец Воды";
        this.id = "553638061817200650";
        this.boxID = "lpet";
        this.seasonType = null;
        this.loot_file = require("./Box loot/PetWater.json");
        this.message = this.getMessage();
        this.amount_loot = 1;
        this.amount_collection = 0;
        this.amount_cosmetics = 0;
        this.amount_mythical = 0;
        this.repeatable_loot = true;
        this.repeatable_collection = true;
        this.repeatable_mythical = true;
        this.repeatable_cosmetics = true;
        this.changeable = false;
        this.removeRole = false;
        this.hasCD = true;
        this.cooldown = 1000 * 60 * 60 * 24 * 4;
        this.loot_types = [
            this.allTypes.LOOT
        ]
    }
    getMessage() {
        let map = this.receivers.map(r => {
            return `<@${r}>`
        })
        return `:black_medium_small_square:
╭──────────╮
🐋 ${map.join(`, `)} отправи${map.length > 1 ? "лись" : "лся" } на обучение к Питомцу Воды. 🐋
Он${map.length > 1 ? "и" : "" } получи${map.length > 1 ? "ли" : "л" } следующий урок:
%%loot%%
╰──────────╯
:black_medium_small_square:`
    }
}
/**
 * 
 * @param {StringSelectMenuInteraction} interaction String Select Menu Interaction
 * @param {import("../Classes/System/StarpixelClient").StarpixelClient} client Discord Client
 * 
 */
class Mpet extends Boxes {
    constructor(interaction, client) {
        super(interaction, client);
        this.name = "Питомец Огня";
        this.id = "605696079819964426";
        this.boxID = "mpet";
        this.seasonType = null;
        this.loot_file = require("./Box loot/PetFire.json");
        this.message = this.getMessage();
        this.amount_loot = 1;
        this.amount_collection = 0;
        this.amount_cosmetics = 0;
        this.amount_mythical = 0;
        this.repeatable_loot = true;
        this.repeatable_collection = true;
        this.repeatable_mythical = true;
        this.repeatable_cosmetics = true;
        this.changeable = false;
        this.removeRole = false;
        this.hasCD = true;
        this.cooldown = 1000 * 60 * 60 * 24 * 4;
        this.loot_types = [
            this.allTypes.LOOT
        ]
    }
    getMessage() {
        let map = this.receivers.map(r => {
            return `<@${r}>`
        })
        return `:black_medium_small_square:
╭──────────╮
🐲 ${map.join(`, `)} отправи${map.length > 1 ? "лись" : "лся" } на обучение к Питомцу Огня. 🐲
Он${map.length > 1 ? "и" : "" } получи${map.length > 1 ? "ли" : "л" } следующий урок:
%%loot%%
╰──────────╯
:black_medium_small_square:`
    }
}
/**
 * 
 * @param {StringSelectMenuInteraction} interaction String Select Menu Interaction
 * @param {import("../Classes/System/StarpixelClient").StarpixelClient} client Discord Client
 * 
 */
class Earth extends Boxes {
    constructor(interaction, client) {
        super(interaction, client);
        this.name = "Стихия Земли";
        this.id = "930169143347523604";
        this.boxID = "earth";
        this.seasonType = null;
        this.loot_file = require("./Box loot/ElemEarth.json");
        this.message = this.getMessage();
        this.amount_loot = 1;
        this.amount_collection = 0;
        this.amount_cosmetics = 0;
        this.amount_mythical = 0;
        this.repeatable_loot = true;
        this.repeatable_collection = true;
        this.repeatable_mythical = true;
        this.repeatable_cosmetics = true;
        this.changeable = false;
        this.removeRole = false;
        this.hasCD = true;
        this.cooldown = 1000 * 60 * 60 * 24 * 7;
        this.loot_types = [
            this.allTypes.LOOT
        ]
    }
    getMessage() {
        let map = this.receivers.map(r => {
            return `<@${r}>`
        })
        return `:black_medium_small_square:
╭─────✿✿✿─────╮
🌳 ${map.join(`, `)} использу${map.length > 1 ? "ют" : "ет" } стихию Земли. 🌳
Он${map.length > 1 ? "и" : "" } получи${map.length > 1 ? "ли" : "л" } следующее:
%%loot%%
╰─────✿✿✿─────╯
:black_medium_small_square:`
    }
}
/**
 * 
 * @param {StringSelectMenuInteraction} interaction String Select Menu Interaction
 * @param {import("../Classes/System/StarpixelClient").StarpixelClient} client Discord Client
 * 
 */
class Air extends Boxes {
    constructor(interaction, client) {
        super(interaction, client);
        this.name = "Стихия Воздуха";
        this.id = "930169145314652170";
        this.boxID = "air";
        this.seasonType = null;
        this.loot_file = require("./Box loot/ElemAir.json");
        this.message = this.getMessage();
        this.amount_loot = 1;
        this.amount_collection = 0;
        this.amount_cosmetics = 0;
        this.amount_mythical = 0;
        this.repeatable_loot = true;
        this.repeatable_collection = true;
        this.repeatable_mythical = true;
        this.repeatable_cosmetics = true;
        this.changeable = false;
        this.removeRole = false;
        this.hasCD = true;
        this.cooldown = 1000 * 60 * 60 * 24 * 7;
        this.loot_types = [
            this.allTypes.ACT_EXP
        ]
    }
    getMessage() {
        let map = this.receivers.map(r => {
            return `<@${r}>`
        })
        return `:black_medium_small_square:
╭─────↯─────╮
🌪️ ${map.join(`, `)} использу${map.length > 1 ? "ют" : "ет" } стихию Воздуха. 🌪️
Он${map.length > 1 ? "и" : "" } получи${map.length > 1 ? "ли" : "л" } следующее:
%%loot%%
╰─────↯─────╯
:black_medium_small_square:`
    }
}
/**
 * 
 * @param {StringSelectMenuInteraction} interaction String Select Menu Interaction
 * @param {import("../Classes/System/StarpixelClient").StarpixelClient} client Discord Client
 * 
 */
class Water extends Boxes {
    constructor(interaction, client) {
        super(interaction, client);
        this.name = "Стихия Воды";
        this.id = "930169139866259496";
        this.boxID = "water";
        this.seasonType = null;
        this.loot_file = require("./Box loot/ElemWater.json");
        this.message = this.getMessage();
        this.amount_loot = 1;
        this.amount_collection = 0;
        this.amount_cosmetics = 0;
        this.amount_mythical = 0;
        this.repeatable_loot = true;
        this.repeatable_collection = true;
        this.repeatable_mythical = true;
        this.repeatable_cosmetics = true;
        this.changeable = false;
        this.removeRole = false;
        this.hasCD = true;
        this.cooldown = 1000 * 60 * 60 * 24 * 7;
        this.loot_types = [
            this.allTypes.RANK_EXP
        ]
    }
    getMessage() {
        let map = this.receivers.map(r => {
            return `<@${r}>`
        })
        return `:black_medium_small_square:
╭─────ஐ─────╮
🌊 ${map.join(`, `)} использу${map.length > 1 ? "ют" : "ет" } стихию Воды. 🌊
Он${map.length > 1 ? "и" : "" } получи${map.length > 1 ? "ли" : "л" } следующее:
%%loot%%
╰─────ஐ─────╯
:black_medium_small_square:`
    }
}
/**
 * 
 * @param {StringSelectMenuInteraction} interaction String Select Menu Interaction
 * @param {import("../Classes/System/StarpixelClient").StarpixelClient} client Discord Client
 * 
 */
class Fire extends Boxes {
    constructor(interaction, client) {
        super(interaction, client);
        this.name = "Стихия Огня";
        this.id = "930169133671280641";
        this.boxID = "fire";
        this.seasonType = null;
        this.loot_file = require("./Box loot/ElemFire.json");
        this.message = this.getMessage();
        this.amount_loot = 1;
        this.amount_collection = 0;
        this.amount_cosmetics = 0;
        this.amount_mythical = 0;
        this.repeatable_loot = true;
        this.repeatable_collection = true;
        this.repeatable_mythical = true;
        this.repeatable_cosmetics = true;
        this.changeable = false;
        this.removeRole = false;
        this.hasCD = true;
        this.cooldown = 1000 * 60 * 60 * 24 * 7;
        this.loot_types = [
            this.allTypes.RUMBIKS
        ]
    }
    getMessage() {
        let map = this.receivers.map(r => {
            return `<@${r}>`
        })
        return `:black_medium_small_square:
╭─────๑۩۩๑─────╮
🔥 ${map.join(`, `)} использу${map.length > 1 ? "ют" : "ет" } стихию Огня. 🔥
Он${map.length > 1 ? "и" : "" } получи${map.length > 1 ? "ли" : "л" } следующее:
%%loot%%
╰─────๑۩۩๑─────╯
:black_medium_small_square:`
    }
}



/**
 * Subscription
 */


/**
 * 
 * @param {StringSelectMenuInteraction} interaction String Select Menu Interaction
 * @param {import("../Classes/System/StarpixelClient").StarpixelClient} client Discord Client
 * 
 */
class Sub1 extends Boxes {
    constructor(interaction, client) {
        super(interaction, client);
        this.name = "Подписка I";
        this.id = "1007290181038133269";
        this.boxID = "sub_1";
        this.seasonType = null;
        this.loot_file = require("./Box loot/Sub1.json");
        this.message = this.getMessage();
        this.amount_loot = 1;
        this.amount_collection = 0;
        this.amount_cosmetics = 0;
        this.amount_mythical = 0;
        this.repeatable_loot = true;
        this.repeatable_collection = true;
        this.repeatable_mythical = true;
        this.repeatable_cosmetics = true;
        this.changeable = false;
        this.removeRole = false;
        this.hasCD = true;
        this.cooldown = 1000 * 60 * 60 * 24 * 7;
        this.loot_types = [
            this.allTypes.LOOT
        ]
    }
    getMessage() {
        let map = this.receivers.map(r => {
            return `<@${r}>`
        })
        return `◾
|————————۞————————|
${map.join(`, `)} получа${map.length > 1 ? "ют" : "ет" } следующие предметы:
%%loot%%
|————————۞————————|
◾`
    }
}
/**
 * 
 * @param {StringSelectMenuInteraction} interaction String Select Menu Interaction
 * @param {import("../Classes/System/StarpixelClient").StarpixelClient} client Discord Client
 * 
 */
class Sub2 extends Boxes {
    constructor(interaction, client) {
        super(interaction, client);
        this.name = "Подписка II";
        this.id = "1007290181847613530";
        this.boxID = "sub_2";
        this.seasonType = null;
        this.loot_file = require("./Box loot/Sub2.json");
        this.message = this.getMessage();
        this.amount_loot = 1;
        this.amount_collection = 0;
        this.amount_cosmetics = 0;
        this.amount_mythical = 0;
        this.repeatable_loot = true;
        this.repeatable_collection = true;
        this.repeatable_mythical = true;
        this.repeatable_cosmetics = true;
        this.changeable = false;
        this.removeRole = false;
        this.hasCD = true;
        this.cooldown = 1000 * 60 * 60 * 24 * 7;
        this.loot_types = [
            this.allTypes.LOOT
        ]
    }
    getMessage() {
        let map = this.receivers.map(r => {
            return `<@${r}>`
        })
        return `◾
|———————~۞~———————|
${map.join(`, `)} получа${map.length > 1 ? "ют" : "ет" } следующие предметы:
%%loot%%
|———————~۞~———————|
◾`
    }
}
/**
 * 
 * @param {StringSelectMenuInteraction} interaction String Select Menu Interaction
 * @param {import("../Classes/System/StarpixelClient").StarpixelClient} client Discord Client
 * 
 */
class Sub3 extends Boxes {
    constructor(interaction, client) {
        super(interaction, client);
        this.name = "Подписка III";
        this.id = "1007290182883622974";
        this.boxID = "sub_3";
        this.seasonType = null;
        this.loot_file = require("./Box loot/Sub3.json");
        this.message = this.getMessage();
        this.amount_loot = 1;
        this.amount_collection = 0;
        this.amount_cosmetics = 0;
        this.amount_mythical = 0;
        this.repeatable_loot = true;
        this.repeatable_collection = true;
        this.repeatable_mythical = true;
        this.repeatable_cosmetics = true;
        this.changeable = false;
        this.removeRole = false;
        this.hasCD = true;
        this.cooldown = 1000 * 60 * 60 * 24 * 7;
        this.loot_types = [
            this.allTypes.RUMBIKS,
            this.allTypes.LOOT
        ]
    }
    getMessage() {
        let map = this.receivers.map(r => {
            return `<@${r}>`
        })
        return `◾
|———————~ஜ۞ஜ~———————|
${map.join(`, `)} получа${map.length > 1 ? "ют" : "ет" } следующие предметы:
%%loot%%
|———————~ஜ۞ஜ~———————|
◾`
    }
}
/**
 * 
 * @param {StringSelectMenuInteraction} interaction String Select Menu Interaction
 * @param {import("../Classes/System/StarpixelClient").StarpixelClient} client Discord Client
 * 
 */
class SubPrem extends Boxes {
    constructor(interaction, client) {
        super(interaction, client);
        this.name = "Подписка VIP";
        this.id = "850336260265476096";
        this.boxID = "premium";
        this.seasonType = null;
        this.loot_file = require("./Box loot/SubPrem.json");
        this.message = this.getMessage();
        this.amount_loot = 1;
        this.amount_collection = 0;
        this.amount_cosmetics = 0;
        this.amount_mythical = 0;
        this.repeatable_loot = true;
        this.repeatable_collection = true;
        this.repeatable_mythical = true;
        this.repeatable_cosmetics = true;
        this.changeable = false;
        this.removeRole = false;
        this.hasCD = true;
        this.cooldown = 1000 * 60 * 60 * 24 * 7;
        this.loot_types = [
            this.allTypes.RUMBIKS,
            this.allTypes.LOOT
        ]
    }
    getMessage() {
        let map = this.receivers.map(r => {
            return `<@${r}>`
        })
        return `◾:star:◾
|—————~ஜ۩۞۩ஜ~—————|
${map.join(`, `)} получа${map.length > 1 ? "ют" : "ет" } следующие предметы:
%%loot%%
|—————~ஜ۩۞۩ஜ~—————|
◾:star:◾`
    }
}

module.exports = {

    //Boxes using /boxes
    Activity,
    Bag,
    Big,
    Daily,
    Easter,
    King,
    Mega,
    Monthly,
    Mystery,
    Myth,
    Present,
    Prestige,
    SeasonalWinner,
    Small,
    Spooky,
    Staffbox,
    Summer,
    Treasure,
    Weekly,

    //Pets & Elements
    Spet,
    Epet,
    Lpet,
    Mpet,
    Earth,
    Air,
    Water,
    Fire,

    //Subscriptions (no boost)
    Sub1,
    Sub2,
    Sub3,
    SubPrem
}