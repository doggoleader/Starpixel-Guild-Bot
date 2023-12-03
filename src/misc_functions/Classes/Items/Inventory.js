const { GuildMember, CommandInteraction, EmbedBuilder } = require("discord.js");
const { User } = require("../../../schemas/userdata");
const wait = require(`timers/promises`).setTimeout


class Inventory {
    client;
    member;
    cur_timestamp;
    userData;

    /**
     * 
     * @param {GuildMember} member Discord Guild Member
     * @param {import("../System/StarpixelClient").StarpixelClient} client Discord CLient
     */
    constructor(member, client) {
        this.client = client;
        this.member = member;
        this.cur_timestamp = Date.now()
    }

    /**
     * @private
     * @returns Mongoose User Data
     */
    async findUserData() {
        const userData = await User.findOne({ userid: this.member.user.id })
        this.userData = userData
        return userData
    }
    getClient() {
        return this.client;
    }

    getMember() {
        return this.member;
    }

    getUserData() {
        return this.userData;
    }

    getCreatedTimestamp() {
        return this.cur_timestamp;
    }


    getItemInventory() {
        const userData = this.userData;
        const items = userData.stacked_items;
        return items;
    }

    getRankCosmetics() {
        const userData = this.userData;
        const items = userData.cosmetics_storage.rank;
        return items;
    }

    getFramesCosmetics() {
        const userData = this.userData;
        const items = userData.cosmetics_storage.ramkas;
        return items;
    }

    getSymbolsCosmetics() {
        const userData = this.userData;
        const items = userData.cosmetics_storage.symbols;
        return items;
    }

    getSuffixCosmetics() {
        const userData = this.userData;
        const items = userData.cosmetics_storage.suffixes;
        return items;
    }

    getColorsInventory() {
        const userData = this.userData;
        const items = userData.cosmetics_storage.colors;
        return items;
    }

    async claimRewards(interaction) {
        if (this.userData.stacked_items.length <= 0) return interaction.reply({
            content: `У вас нет неполученных наград!`,
            ephemeral: true
        })
        const { member } = interaction;
        let claimed = []
        const msg = await interaction.reply({ content: `Начинается выдача наград...`, ephemeral: true, fetchReply: true })
        let items = this.userData.stacked_items.slice(0);
        for (const item of items) {
            if (!member.roles.cache.has(item) && (item !== "1007290181038133269" && item !== "1007290181847613530" && item !== "1007290182883622974" && item !== "850336260265476096")) {
                await claimed.push(item)
                await member.roles.add(item).catch()
                let b = await this.userData.stacked_items.findIndex(it => it == item)
                this.userData.stacked_items.splice(b, 1)
                await interaction.editReply({ content: `Вы получили <@&${item}>... Идёт проверка других наград!`, fetchReply: true })
                await wait(500)
            } else if (item == "1007290181038133269" || item == "1007290181847613530" || item == "1007290182883622974" || item == "850336260265476096") {
                switch (item) {
                    case "1007290181038133269": {
                        if (!member.roles.cache.has("1007290181847613530") && !member.roles.cache.has("1007290182883622974") && !member.roles.cache.has("850336260265476096")) {
                            await claimed.push(item)
                            await member.roles.add(item).catch()
                            let b = await this.userData.stacked_items.findIndex(it => it == item)
                            this.userData.stacked_items.splice(b, 1)
                            await interaction.editReply({ content: `Вы получили <@&${item}>... Идёт проверка других наград!`, fetchReply: true })
                            await wait(500)
                        }
                    }
                        break;
                    case "1007290181847613530": {
                        if (!member.roles.cache.has("1007290182883622974") && !member.roles.cache.has("850336260265476096")) {
                            await claimed.push(item)
                            await member.roles.add(item).catch()
                            let b = await this.userData.stacked_items.findIndex(it => it == item)
                            this.userData.stacked_items.splice(b, 1)
                            await interaction.editReply({ content: `Вы получили <@&${item}>... Идёт проверка других наград!`, fetchReply: true })
                            await wait(500)
                        }
                    }
                        break;
                    case "1007290182883622974": {
                        if (!member.roles.cache.has("850336260265476096")) {
                            await claimed.push(item)
                            await member.roles.add(item).catch()
                            let b = await this.userData.stacked_items.findIndex(it => it == item)
                            this.userData.stacked_items.splice(b, 1)
                            await interaction.editReply({ content: `Вы получили <@&${item}>... Идёт проверка других наград!`, fetchReply: true })
                            await wait(500)
                        }
                    }
                        break;
                    case "850336260265476096": {
                        await claimed.push(item)
                        await member.roles.add(item).catch()
                        let b = await this.userData.stacked_items.findIndex(it => it == item)
                        this.userData.stacked_items.splice(b, 1)
                        await interaction.editReply({ content: `Вы получили <@&${item}>... Идёт проверка других наград!`, fetchReply: true })
                        await wait(500)
                    }
                        break;

                    default:
                        break;
                }
            }
        }
        this.userData.save()
        let i = 1
        if (claimed.length <= 0) return interaction.editReply({
            content: `Вы не получили ни одной награды! Пожалуйста, откройте коробки, а затем пропишите эту команду ещё раз!`
        })
        const map = claimed.map(reward => {
            return `**${i++}.** Получена награда <@&${reward}>!`
        })
        const embed = new EmbedBuilder()
            .setTitle(`Получены награды`)
            .setDescription(`**Список наград:**
${map.join('\n')}

Осталось неполученных наград: ${this.userData.stacked_items.length}!`)
            .setColor(Number(this.client.information.bot_color))
            .setTimestamp(Date.now())

        await interaction.editReply({
            content: ``,
            embeds: [embed]
        })
    }

    /**
     * 
     * @returns Array of arrays of each inventory. Index list:
     * 0 - Item Inventory
     * 1 - Symbols Inventory
     * 2 - Frames Inventory
     * 3 - Suffixes Inventory
     * 4 - Rank Cosmetics Inventory
     * 5 - Color Inventory
     */
    async getEverything() {
        await this.findUserData();
        const items = await this.getItemInventory();
        const ranks = await this.getRankCosmetics();
        const frames = await this.getFramesCosmetics();
        const symbols = await this.getSymbolsCosmetics();
        const suffixes = await this.getSuffixCosmetics();
        const colors = await this.getColorsInventory();

        return [
            items,
            symbols,
            frames,
            suffixes,
            ranks,
            colors
        ]
    }
}



module.exports = {
    Inventory
}