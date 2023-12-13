const { User } = require(`../../schemas/userdata`)
const chalk = require(`chalk`);
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require(`discord.js`)
const wait = require(`timers/promises`).setTimeout
const ch_list = require(`../../discord structure/channels.json`)
const { Guild } = require(`../../schemas/guilddata`)
const cron = require(`node-cron`)
const { checkPlugin, createBingoProfile } = require("../../functions");
const bingo = require(`../../jsons/NewYearBingo.json`)

const SeasonChannels = [
    "1031224366370914394",
    "1035245590805757995",
    "1031224393189302292",
    "1031224437967683605",
    "1031224424034213999",
]

class NewYear {
    /** @private */
    static id = 'seasonal';
    /** @private */
    static name = 'Сезонное'

    /**
     * 
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async AdvCalendarClear(client) {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", this.id)) return;
            const guildData = await Guild.findOne({ id: guild.id })
            if (guildData.seasonal.new_year.enabled === false) return
            const channel = await guild.channels.fetch(ch_list.ny_calendar)
            const msg1 = await channel.messages.fetch(`1045768548515057726`)
            const msg2 = await channel.messages.fetch(`1045768549928550420`)
            const row1 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`december_1`)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(`💥`)
                        .setLabel(`1-е декабря`)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`december_2`)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(`💥`)
                        .setLabel(`2-е декабря`)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`december_3`)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(`💥`)
                        .setLabel(`3-е декабря`)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`december_4`)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(`💥`)
                        .setLabel(`4-е декабря`)
                )


            const row2 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`december_5`)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(`💥`)
                        .setLabel(`5-е декабря`)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`december_6`)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(`💥`)
                        .setLabel(`6-е декабря`)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`december_7`)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(`💥`)
                        .setLabel(`7-е декабря`)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`december_8`)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(`💥`)
                        .setLabel(`8-е декабря`)
                )

            const row3 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`december_9`)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(`💥`)
                        .setLabel(`9-е декабря`)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`december_10`)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(`💥`)
                        .setLabel(`10-е декабря`)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`december_11`)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(`💥`)
                        .setLabel(`11-е декабря`)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`december_12`)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(`💥`)
                        .setLabel(`12-е декабря`)
                )

            const row4 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`december_13`)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(`💥`)
                        .setLabel(`13-е декабря`)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`december_14`)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(`💥`)
                        .setLabel(`14-е декабря`)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`december_15`)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(`💥`)
                        .setLabel(`15-е декабря`)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`december_16`)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(`💥`)
                        .setLabel(`16-е декабря`)
                )

            const row5 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`december_17`)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(`💥`)
                        .setLabel(`17-е декабря`)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`december_18`)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(`💥`)
                        .setLabel(`18-е декабря`)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`december_19`)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(`💥`)
                        .setLabel(`19-е декабря`)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`december_20`)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(`💥`)
                        .setLabel(`20-е декабря`)
                )

            const row6 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`december_21`)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(`💥`)
                        .setLabel(`21-е декабря`)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`december_22`)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(`💥`)
                        .setLabel(`22-е декабря`)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`december_23`)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(`💥`)
                        .setLabel(`23-е декабря`)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`december_24`)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(`💥`)
                        .setLabel(`24-е декабря`)
                )


            const row7 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`december_25`)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(`💥`)
                        .setLabel(`25-е декабря`)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`december_26`)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(`💥`)
                        .setLabel(`26-е декабря`)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`december_27`)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(`💥`)
                        .setLabel(`27-е декабря`)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`december_28`)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(`💥`)
                        .setLabel(`28-е декабря`)
                )

            const row8 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`december_29`)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(`💥`)
                        .setLabel(`29-е декабря`)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`december_30`)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(`💥`)
                        .setLabel(`30-е декабря`)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`december_31`)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(`💥`)
                        .setLabel(`31-е декабря`)
                )

            await msg1.edit({
                components: [row1, row2, row3, row4, row5]
            })
            await msg2.edit({
                components: [row6, row7, row8]
            })

            this.AdventCalendar(client)
        } catch (e) {
            const admin = await client.users.fetch(`491343958660874242`)
            console.log(e)
            await admin.send({
                content: `-> \`\`\`${e.stack}\`\`\``
            }).catch()
        }

    }

    /**
     * 
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async AdventCalendar(client) {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", this.id)) return;
            const guildData = await Guild.findOne({ id: guild.id })
            const date = new Date()
            const d = await date.getDate()
            const m = await date.getMonth() + 1
            console.log(`${d}-${m}`)
            const channel = await guild.channels.fetch(ch_list.ny_calendar)
            const msg1 = await channel.messages.fetch(`1045768548515057726`)
            const msg2 = await channel.messages.fetch(`1045768549928550420`)
            if (d == 1 && m == 12) {
                const row1 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_1`)
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`🎁`)
                            .setLabel(`1-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_2`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`💥`)
                            .setLabel(`2-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_3`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`💥`)
                            .setLabel(`3-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_4`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`💥`)
                            .setLabel(`4-е декабря`)
                    )
                const row2 = msg1.components[1]
                const row3 = msg1.components[2]
                const row4 = msg1.components[3]
                const row5 = msg1.components[4]
                await msg1.edit({
                    components: [row1, row2, row3, row4, row5]
                })
            } else if (d == 2 && m == 12) {
                const row1 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_1`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🎁`)
                            .setLabel(`1-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_2`)
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`🎁`)
                            .setLabel(`2-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_3`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`💥`)
                            .setLabel(`3-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_4`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`💥`)
                            .setLabel(`4-е декабря`)
                    )
                const row2 = msg1.components[1]
                const row3 = msg1.components[2]
                const row4 = msg1.components[3]
                const row5 = msg1.components[4]
                await msg1.edit({
                    components: [row1, row2, row3, row4, row5]
                })
            } else if (d == 3 && m == 12) {
                const row1 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_1`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🎁`)
                            .setLabel(`1-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_2`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🎁`)
                            .setLabel(`2-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_3`)
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`🌀`)
                            .setLabel(`3-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_4`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`💥`)
                            .setLabel(`4-е декабря`)
                    )
                const row2 = msg1.components[1]
                const row3 = msg1.components[2]
                const row4 = msg1.components[3]
                const row5 = msg1.components[4]
                await msg1.edit({
                    components: [row1, row2, row3, row4, row5]
                })
            } else if (d == 4 && m == 12) {
                const row1 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_1`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🎁`)
                            .setLabel(`1-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_2`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🎁`)
                            .setLabel(`2-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_3`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🌀`)
                            .setLabel(`3-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_4`)
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`💠`)
                            .setLabel(`4-е декабря`)
                    )
                const row2 = msg1.components[1]
                const row3 = msg1.components[2]
                const row4 = msg1.components[3]
                const row5 = msg1.components[4]
                await msg1.edit({
                    components: [row1, row2, row3, row4, row5]
                })
            } else if (d == 5 && m == 12) {
                const row1 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_1`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🎁`)
                            .setLabel(`1-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_2`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🎁`)
                            .setLabel(`2-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_3`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🌀`)
                            .setLabel(`3-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_4`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`💠`)
                            .setLabel(`4-е декабря`)
                            .setDisabled(true)
                    )
                const row2 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_5`)
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`🏷`)
                            .setLabel(`5-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_6`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`💥`)
                            .setLabel(`6-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_7`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`💥`)
                            .setLabel(`7-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_8`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`💥`)
                            .setLabel(`8-е декабря`)
                    )
                const row3 = msg1.components[2]
                const row4 = msg1.components[3]
                const row5 = msg1.components[4]
                await msg1.edit({
                    components: [row1, row2, row3, row4, row5]
                })
            } else if (d == 6 && m == 12) {
                const row1 = msg1.components[0]
                const row2 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_5`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🏷`)
                            .setLabel(`5-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_6`)
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`🎁`)
                            .setLabel(`6-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_7`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`💥`)
                            .setLabel(`7-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_8`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`💥`)
                            .setLabel(`8-е декабря`)
                    )
                const row3 = msg1.components[2]
                const row4 = msg1.components[3]
                const row5 = msg1.components[4]
                await msg1.edit({
                    components: [row1, row2, row3, row4, row5]
                })
            } else if (d == 7 && m == 12) {
                const row1 = msg1.components[0]
                const row2 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_5`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🏷`)
                            .setLabel(`5-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_6`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🎁`)
                            .setLabel(`6-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_7`)
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`🎁`)
                            .setLabel(`7-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_8`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`💥`)
                            .setLabel(`8-е декабря`)
                    )
                const row3 = msg1.components[2]
                const row4 = msg1.components[3]
                const row5 = msg1.components[4]
                await msg1.edit({
                    components: [row1, row2, row3, row4, row5]
                })
            } else if (d == 8 && m == 12) {
                const row1 = msg1.components[0]
                const row2 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_5`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🏷`)
                            .setLabel(`5-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_6`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🎁`)
                            .setLabel(`6-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_7`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🎁`)
                            .setLabel(`7-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_8`)
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`🌀`)
                            .setLabel(`8-е декабря`)
                    )
                const row3 = msg1.components[2]
                const row4 = msg1.components[3]
                const row5 = msg1.components[4]
                await msg1.edit({
                    components: [row1, row2, row3, row4, row5]
                })
            } else if (d == 9 && m == 12) {
                const row1 = msg1.components[0]
                const row2 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_5`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🏷`)
                            .setLabel(`5-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_6`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🎁`)
                            .setLabel(`6-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_7`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🎁`)
                            .setLabel(`7-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_8`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🌀`)
                            .setLabel(`8-е декабря`)
                            .setDisabled(true)
                    )
                const row3 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_9`)
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`💠`)
                            .setLabel(`9-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_10`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`💥`)
                            .setLabel(`10-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_11`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`💥`)
                            .setLabel(`11-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_12`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`💥`)
                            .setLabel(`12-е декабря`)
                    )
                const row4 = msg1.components[3]
                const row5 = msg1.components[4]
                await msg1.edit({
                    components: [row1, row2, row3, row4, row5]
                })
            } else if (d == 10 && m == 12) {
                const row1 = msg1.components[0]
                const row2 = msg1.components[1]
                const row3 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_9`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`💠`)
                            .setLabel(`9-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_10`)
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`<:Rumbik:883638847056003072>`)
                            .setLabel(`10-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_11`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`💥`)
                            .setLabel(`11-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_12`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`💥`)
                            .setLabel(`12-е декабря`)
                    )
                const row4 = msg1.components[3]
                const row5 = msg1.components[4]
                await msg1.edit({
                    components: [row1, row2, row3, row4, row5]
                })
            } else if (d == 11 && m == 12) {
                const row1 = msg1.components[0]
                const row2 = msg1.components[1]
                const row3 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_9`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`💠`)
                            .setLabel(`9-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_10`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`<:Rumbik:883638847056003072>`)
                            .setLabel(`10-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_11`)
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`🎁`)
                            .setLabel(`11-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_12`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`💥`)
                            .setLabel(`12-е декабря`)
                    )
                const row4 = msg1.components[3]
                const row5 = msg1.components[4]
                await msg1.edit({
                    components: [row1, row2, row3, row4, row5]
                })
            } else if (d == 12 && m == 12) {
                const row1 = msg1.components[0]
                const row2 = msg1.components[1]
                const row3 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_9`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`💠`)
                            .setLabel(`9-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_10`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`<:Rumbik:883638847056003072>`)
                            .setLabel(`10-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_11`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🎁`)
                            .setLabel(`11-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_12`)
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`🌀`)
                            .setLabel(`12-е декабря`)
                    )
                const row4 = msg1.components[3]
                const row5 = msg1.components[4]
                await msg1.edit({
                    components: [row1, row2, row3, row4, row5]
                })
            } else if (d == 13 && m == 12) {
                const row1 = msg1.components[0]
                const row2 = msg1.components[1]
                const row3 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_9`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`💠`)
                            .setLabel(`9-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_10`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`<:Rumbik:883638847056003072>`)
                            .setLabel(`10-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_11`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🎁`)
                            .setLabel(`11-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_12`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🌀`)
                            .setLabel(`12-е декабря`)
                            .setDisabled(true)
                    )
                const row4 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_13`)
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`💠`)
                            .setLabel(`13-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_14`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`💥`)
                            .setLabel(`14-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_15`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`💥`)
                            .setLabel(`15-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_16`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`💥`)
                            .setLabel(`16-е декабря`)
                    )
                const row5 = msg1.components[4]
                await msg1.edit({
                    components: [row1, row2, row3, row4, row5]
                })
            } else if (d == 14 && m == 12) {
                const row1 = msg1.components[0]
                const row2 = msg1.components[1]
                const row3 = msg1.components[2]
                const row4 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_13`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`💠`)
                            .setLabel(`13-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_14`)
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`🎁`)
                            .setLabel(`14-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_15`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`💥`)
                            .setLabel(`15-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_16`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`💥`)
                            .setLabel(`16-е декабря`)
                    )
                const row5 = msg1.components[4]
                await msg1.edit({
                    components: [row1, row2, row3, row4, row5]
                })
            } else if (d == 15 && m == 12) {
                const row1 = msg1.components[0]
                const row2 = msg1.components[1]
                const row3 = msg1.components[2]
                const row4 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_13`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`💠`)
                            .setLabel(`13-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_14`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🎁`)
                            .setLabel(`14-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_15`)
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`💠`)
                            .setLabel(`15-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_16`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`💥`)
                            .setLabel(`16-е декабря`)
                    )
                const row5 = msg1.components[4]
                await msg1.edit({
                    components: [row1, row2, row3, row4, row5]
                })
            } else if (d == 16 && m == 12) {
                const row1 = msg1.components[0]
                const row2 = msg1.components[1]
                const row3 = msg1.components[2]
                const row4 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_13`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`💠`)
                            .setLabel(`13-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_14`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🎁`)
                            .setLabel(`14-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_15`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`💠`)
                            .setLabel(`15-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_16`)
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`<:Rumbik:883638847056003072>`)
                            .setLabel(`16-е декабря`)
                    )
                const row5 = msg1.components[4]
                await msg1.edit({
                    components: [row1, row2, row3, row4, row5]
                })
            } else if (d == 17 && m == 12) {
                const row1 = msg1.components[0]
                const row2 = msg1.components[1]
                const row3 = msg1.components[2]
                const row4 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_13`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`💠`)
                            .setLabel(`13-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_14`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🎁`)
                            .setLabel(`14-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_15`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`💠`)
                            .setLabel(`15-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_16`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`<:Rumbik:883638847056003072>`)
                            .setLabel(`16-е декабря`)
                            .setDisabled(true)
                    )
                const row5 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_17`)
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`🌀`)
                            .setLabel(`17-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_18`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`💥`)
                            .setLabel(`18-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_19`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`💥`)
                            .setLabel(`19-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_20`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`💥`)
                            .setLabel(`20-е декабря`)
                    )
                await msg1.edit({
                    components: [row1, row2, row3, row4, row5]
                })
            } else if (d == 18 && m == 12) {
                const row1 = msg1.components[0]
                const row2 = msg1.components[1]
                const row3 = msg1.components[2]
                const row4 = msg1.components[3]
                const row5 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_17`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🌀`)
                            .setLabel(`17-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_18`)
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`💠`)
                            .setLabel(`18-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_19`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`💥`)
                            .setLabel(`19-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_20`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`💥`)
                            .setLabel(`20-е декабря`)
                    )
                await msg1.edit({
                    components: [row1, row2, row3, row4, row5]
                })
            } else if (d == 19 && m == 12) {
                const row1 = msg1.components[0]
                const row2 = msg1.components[1]
                const row3 = msg1.components[2]
                const row4 = msg1.components[3]
                const row5 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_17`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🌀`)
                            .setLabel(`17-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_18`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`💠`)
                            .setLabel(`18-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_19`)
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`🌀`)
                            .setLabel(`19-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_20`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`💥`)
                            .setLabel(`20-е декабря`)
                    )
                await msg1.edit({
                    components: [row1, row2, row3, row4, row5]
                })
            } else if (d == 20 && m == 12) {
                const row1 = msg1.components[0]
                const row2 = msg1.components[1]
                const row3 = msg1.components[2]
                const row4 = msg1.components[3]
                const row5 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_17`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🌀`)
                            .setLabel(`17-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_18`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`💠`)
                            .setLabel(`18-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_19`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🌀`)
                            .setLabel(`19-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_20`)
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`🎁`)
                            .setLabel(`20-е декабря`)
                    )
                await msg1.edit({
                    components: [row1, row2, row3, row4, row5]
                })
            } else if (d == 21 && m == 12) {
                const row1 = msg1.components[0]
                const row2 = msg1.components[1]
                const row3 = msg1.components[2]
                const row4 = msg1.components[3]
                const row5 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_17`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🌀`)
                            .setLabel(`17-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_18`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`💠`)
                            .setLabel(`18-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_19`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🌀`)
                            .setLabel(`19-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_20`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🎁`)
                            .setLabel(`20-е декабря`)
                            .setDisabled(true)
                    )
                await msg1.edit({
                    components: [row1, row2, row3, row4, row5]
                })
                const row6 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_21`)
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`🌀`)
                            .setLabel(`21-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_22`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`💥`)
                            .setLabel(`22-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_23`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`💥`)
                            .setLabel(`23-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_24`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`💥`)
                            .setLabel(`24-е декабря`)
                    )
                const row7 = msg2.components[1]
                const row8 = msg2.components[2]
                await msg2.edit({
                    components: [row6, row7, row8]
                })
            } else if (d == 22 && m == 12) {
                const row6 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_21`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🌀`)
                            .setLabel(`21-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_22`)
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`🎁`)
                            .setLabel(`22-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_23`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`💥`)
                            .setLabel(`23-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_24`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`💥`)
                            .setLabel(`24-е декабря`)
                    )
                const row7 = msg2.components[1]
                const row8 = msg2.components[2]
                await msg2.edit({
                    components: [row6, row7, row8]
                })
            } else if (d == 23 && m == 12) {
                const row6 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_21`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🌀`)
                            .setLabel(`21-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_22`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🎁`)
                            .setLabel(`22-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_23`)
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`💠`)
                            .setLabel(`23-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_24`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`💥`)
                            .setLabel(`24-е декабря`)
                    )
                const row7 = msg2.components[1]
                const row8 = msg2.components[2]
                await msg2.edit({
                    components: [row6, row7, row8]
                })
            } else if (d == 24 && m == 12) {
                const row6 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_21`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🌀`)
                            .setLabel(`21-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_22`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🎁`)
                            .setLabel(`22-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_23`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`💠`)
                            .setLabel(`23-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_24`)
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`🎁`)
                            .setLabel(`24-е декабря`)
                    )
                const row7 = msg2.components[1]
                const row8 = msg2.components[2]
                await msg2.edit({
                    components: [row6, row7, row8]
                })
            } else if (d == 25 && m == 12) {
                const row6 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_21`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🌀`)
                            .setLabel(`21-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_22`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🎁`)
                            .setLabel(`22-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_23`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`💠`)
                            .setLabel(`23-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_24`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🎁`)
                            .setLabel(`24-е декабря`)
                            .setDisabled(true)
                    )
                const row7 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_25`)
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`<:Rumbik:883638847056003072>`)
                            .setLabel(`25-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_26`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`💥`)
                            .setLabel(`26-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_27`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`💥`)
                            .setLabel(`27-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_28`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`💥`)
                            .setLabel(`28-е декабря`)
                    )
                const row8 = msg2.components[2]
                await msg2.edit({
                    components: [row6, row7, row8]
                })
            } else if (d == 26 && m == 12) {
                const row6 = msg2.components[0]
                const row7 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_25`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`<:Rumbik:883638847056003072>`)
                            .setLabel(`25-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_26`)
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`🏷`)
                            .setLabel(`26-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_27`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`💥`)
                            .setLabel(`27-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_28`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`💥`)
                            .setLabel(`28-е декабря`)
                    )
                const row8 = msg2.components[2]
                await msg2.edit({
                    components: [row6, row7, row8]
                })
            } else if (d == 27 && m == 12) {
                const row6 = msg2.components[0]
                const row7 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_25`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`<:Rumbik:883638847056003072>`)
                            .setLabel(`25-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_26`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🏷`)
                            .setLabel(`26-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_27`)
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`🎁`)
                            .setLabel(`27-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_28`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`💥`)
                            .setLabel(`28-е декабря`)
                    )
                const row8 = msg2.components[2]
                await msg2.edit({
                    components: [row6, row7, row8]
                })
            } else if (d == 28 && m == 12) {
                const row6 = msg2.components[0]
                const row7 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_25`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`<:Rumbik:883638847056003072>`)
                            .setLabel(`25-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_26`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🏷`)
                            .setLabel(`26-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_27`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🎁`)
                            .setLabel(`27-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_28`)
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`<:Rumbik:883638847056003072>`)
                            .setLabel(`28-е декабря`)
                    )
                const row8 = msg2.components[2]
                await msg2.edit({
                    components: [row6, row7, row8]
                })
            } else if (d == 29 && m == 12) {
                const row6 = msg2.components[0]
                const row7 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_25`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`<:Rumbik:883638847056003072>`)
                            .setLabel(`25-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_26`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🏷`)
                            .setLabel(`26-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_27`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🎁`)
                            .setLabel(`27-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_28`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`<:Rumbik:883638847056003072>`)
                            .setLabel(`28-е декабря`)
                            .setDisabled(true)
                    )
                const row8 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_29`)
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`🌀`)
                            .setLabel(`29-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_30`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`💥`)
                            .setLabel(`30-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_31`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`💥`)
                            .setLabel(`31-е декабря`)
                    )
                await msg2.edit({
                    components: [row6, row7, row8]
                })
            } else if (d == 30 && m == 12) {
                const row6 = msg2.components[0]
                const row7 = msg2.components[1]
                const row8 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_29`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🌀`)
                            .setLabel(`29-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_30`)
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`<:Rumbik:883638847056003072>`)
                            .setLabel(`30-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_31`)
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji(`💥`)
                            .setLabel(`31-е декабря`)
                    )
                await msg2.edit({
                    components: [row6, row7, row8]
                })
            } else if (d == 31 && m == 12) {
                const row6 = msg2.components[0]
                const row7 = msg2.components[1]
                const row8 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_29`)
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(true)
                            .setEmoji(`🌀`)
                            .setLabel(`29-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_30`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`<:Rumbik:883638847056003072>`)
                            .setLabel(`30-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_31`)
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`👑`)
                            .setLabel(`31-е декабря`)
                    )
                await msg2.edit({
                    components: [row6, row7, row8]
                })
            } else if (d == 1 && m == 1) {
                const row6 = msg2.components[0]
                const row7 = msg2.components[1]
                const row8 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_29`)
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(true)
                            .setEmoji(`🌀`)
                            .setLabel(`29-е декабря`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_30`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`<:Rumbik:883638847056003072>`)
                            .setLabel(`30-е декабря`)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`december_31`)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`👑`)
                            .setLabel(`31-е декабря`)
                            .setDisabled(true)
                    )
                await msg2.edit({
                    components: [row6, row7, row8]
                })
            }
        } catch (e) {
            const admin = await client.users.fetch(`491343958660874242`)
            console.log(e)
            await admin.send({
                content: `-> \`\`\`${e.stack}\`\`\``
            }).catch()
        }



    }

    /**
     * 
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async HappyNewYear(client) {

        cron.schedule(`0 15-23 31 12 *`, async () => {
            try {
                const guild = await client.guilds.fetch(`320193302844669959`)
                if (!await checkPlugin("320193302844669959", this.id)) return;
                const channel = await guild.channels.fetch(`1058339159359631391`)
                const date = new Date()
                const tz = (new Date().getTimezoneOffset() / 60)
                let hour = date.getHours() + (3 + tz)
                if (hour >= 24) hour -= 24

                let regions = require(`./JSON/NewYearTimezones.json`)
                let timezone = await regions.timezones.find(i => i.MoscowTime == hour)
                let list = timezone.regions.map((reg, i) => {
                    return `**${++i}.** ${reg}`
                }).join(`\n`)
                const embed = new EmbedBuilder()
                    .setTitle(`С НОВЫМ ГОДОМ! 🎄`)
                    .setColor(Number(client.information.bot_color))
                    .setDescription(`От лица администрации поздравляю с **НОВЫМ 2024 ГОДОМ** всех участников гильдии в следующих регионах:

${list}`)
                    .setTimestamp(Date.now())


                await channel.send({
                    content: `@everyone`,
                    embeds: [embed],
                    allowedMentions: {
                        parse: ["everyone"]
                    }
                })
            } catch (e) {
                const admin = await client.users.fetch(`491343958660874242`)
                console.log(e)
                await admin.send({
                    content: `-> \`\`\`${e.stack}\`\`\``
                }).catch()
            }

        }, {
            scheduled: true,
            timezone: `Europe/Moscow`
        })

        cron.schedule(`0 0,1 1 1 *`, async () => {
            try {
                const guild = await client.guilds.fetch(`320193302844669959`)
                const channel = await guild.channels.fetch(`1058339159359631391`)
                const date = new Date()
                const tz = (new Date().getTimezoneOffset() / 60)
                let hour = date.getHours() + (3 + tz)
                if (hour >= 24) hour -= 24

                let regions = require(`./JSON/NewYearTimezones.json`)
                let timezone = await regions.timezones.find(i => i.MoscowTime == hour)
                let list = timezone.regions.map((reg, i) => {
                    return `**${++i}.** ${reg}`
                }).join(`\n`)
                const embed = new EmbedBuilder()
                    .setTitle(`С НОВЫМ ГОДОМ! 🎄`)
                    .setColor(Number(client.information.bot_color))
                    .setDescription(`От лица администрации поздравляю с **НОВЫМ 2024 ГОДОМ** всех участников гильдии в следующих часовых поясах:

${list}`)
                    .setTimestamp(Date.now())


                await channel.send({
                    content: `@everyone`,
                    embeds: [embed],
                    allowedMentions: {
                        parse: ["everyone"]
                    }
                })
            } catch (e) {
                const admin = await client.users.fetch(`491343958660874242`)
                console.log(e)
                await admin.send({
                    content: `-> \`\`\`${e.stack}\`\`\``
                }).catch()
            }

        }, {
            scheduled: true,
            timezone: `Europe/Moscow`
        })
    }

    /**
     * 
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async newYearEnd(client) {

        cron.schedule(`0 18 18 1 *`, async () => {
            try {
                const g = await client.guilds.fetch(`320193302844669959`)
                if (!await checkPlugin("320193302844669959", this.id)) return;
                const guildData = await Guild.findOne({ id: g.id })
                SeasonChannels.forEach(async ch => {

                    const channel = await g.channels.fetch(ch).then(async chan => {
                        await chan.edit({
                            permissionOverwrites: [
                                {
                                    id: `504887113649750016`,
                                    deny: [
                                        PermissionsBitField.Flags.ViewChannel,
                                        PermissionsBitField.Flags.SendMessages
                                    ]
                                },
                                {
                                    id: g.id,
                                    deny: [
                                        PermissionsBitField.Flags.ViewChannel,
                                        PermissionsBitField.Flags.SendMessages
                                    ]
                                },
                            ]
                        })
                    }).catch(async (err) => {
                        console.log(err)
                    })




                })

                client.NewYearNamesDisable();
                guildData.seasonal.new_year.enabled = false
                guildData.save()

                const userDatas = await User.find({
                    "seasonal.new_year.points": { $gt: 0 }
                }).then(users => {
                    return users.filter(async user => await g.members.fetch(user.userid))
                })
                const sort = userDatas.sort((a, b) => {
                    return b.seasonal.new_year.points - a.seasonal.new_year.points
                }).slice(0, 10)
                let index = 1
                const map = sort.map(async (user) => {
                    const tag = await g.members.fetch(user.userid)
                    return `**${index++}.** ${tag} > ${user.seasonal.new_year.points} очков`
                })
                let i = 0
                let bestData = sort[i]
                while (bestData.userid == `491343958660874242`) {
                    i++
                    bestData = sort[i]
                }
                let member1 = await g.members.fetch(bestData.userid)
                while (member1.roles.cache.has(`660236704971489310`)) {
                    i++
                    bestData = sort[i]
                    member1 = await g.members.fetch(bestData.userid)
                }
                const mapProm = await Promise.all(map)

                for (let i = 0; i < sort.length; i++) {
                    let userData = sort[i]
                    userData.exp += userData.seasonal.new_year.points * 10
                    userData.rumbik += Math.round(userData.seasonal.new_year.snowflakes * 1.5)
                    userData.progress.items.find(it => it.name == 'RUMBIKS_TOTAL').total_items += Math.round(userData.seasonal.new_year.snowflakes * 1.5)
                    client.ActExp(userData.userid)
                    let member = await g.members.fetch(userData.userid)
                    if (i == 0) {
                        userData.medal_1 += 3
                        userData.progress.items.find(it => it.name == 'MEDALS_1').total_items += 3

                    } else if (i == 1) {
                        userData.medal_2 += 3
                        userData.progress.items.find(it => it.name == 'MEDALS_2').total_items += 3
                    } else if (i == 2) {
                        userData.medal_2 += 2
                        userData.progress.items.find(it => it.name == 'MEDALS_2').total_items += 2
                    } else if (i == 3) {
                        userData.medal_3 += 3
                        userData.progress.items.find(it => it.name == 'MEDALS_3').total_items += 3
                    } else if (i == 4) {
                        userData.medal_3 += 2
                        userData.progress.items.find(it => it.name == 'MEDALS_3').total_items += 2
                    } else {
                        userData.tickets += 5
                        userData.progress.items.find(it => it.name == 'TICKETS_TOTAL').total_items += 5
                    }

                    if (i <= 9) {
                        if (!member.roles.cache.has(`992820494900412456`)) {
                            await member.roles.add(`992820494900412456`)
                        } else {
                            userData.stacked_items.push(`992820494900412456`)
                        }
                    } else {
                        if (!member.roles.cache.has(`521248091853291540`)) {
                            await member.roles.add(`521248091853291540`)
                        } else {
                            userData.stacked_items.push(`521248091853291540`)
                        }
                    }
                    userData.save()
                }

                const embed = new EmbedBuilder()
                    .setColor(Number(client.information.bot_color))
                    .setAuthor({
                        name: `Лучшие пользователи по новогодним очкам`
                    })
                    .setTimestamp(Date.now())
                    .setDescription(`${mapProm.join('\n')}`)

                await g.channels.cache.get(ch_list.main).send({
                    embeds: [embed]
                }).then(async msg => {
                    await msg.react(`🎄`)
                    await wait(1000)
                })
                await g.channels.cache.get(ch_list.main).send(`Идет финальный подсчёт количества очков... Кто же победит?`)
                await wait(3000)
                await g.channels.cache.get(ch_list.main).send(`Ответ вы узнаете через 3...`)
                await wait(3000)
                await g.channels.cache.get(ch_list.main).send(`Ответ вы узнаете через 2...`)
                await wait(3000)
                await g.channels.cache.get(ch_list.main).send(`Ответ вы узнаете через 1...`)
                await wait(3000)
                await g.channels.cache.get(ch_list.main).send({
                    content: `Поздравляем ${member1} с победой в новогоднем мероприятии! Он получает эксклюзивную роль <@&660236704971489310>!  @everyone`,
                    allowedMentions: {
                        parse: ["everyone"]
                    }
                })
                await wait(3000)
                const finalEmbed = new EmbedBuilder()
                    .setTitle(`Награды за призовые места`)
                    .setColor(Number(client.information.bot_color))
                    .setDescription(`Помимо главной награды, награду за призовое место получают все участники с 1 по 5 место в независимости от того, получил ли он главную награду или нет:
1 место - <@${sort[0].userid}>. Награда: \`3x 🥇\`
2 место - <@${sort[1].userid}>. Награда: \`3x 🥈\`
3 место - <@${sort[2].userid}>. Награда: \`2x 🥈\`
4 место - <@${sort[3].userid}>. Награда: \`3x 🥉\`
5 место - <@${sort[4].userid}>. Награда: \`2x 🥉\`
6+ место получают +5 🏷

Все участники получают с 1 по 10 место получают <@&992820494900412456> за участие, все остальные участники получают <@&521248091853291540> за участие.

**Все очки были переведены в опыт активности в соотношении 1:10 (1 новогоднее очко = 10 опыта активности)**
**Все снежинки были переведены в румбики в соотношении 1:1.5 (1 снежинка = 1.5 румбика с учётом правил математического округления)**`)
                await g.channels.cache.get(ch_list.main).send({
                    embeds: [finalEmbed]
                })
                await member1.roles.add(`660236704971489310`)
            } catch (e) {
                const admin = await client.users.fetch(`491343958660874242`)
                console.log(e)
                await admin.send({
                    content: `-> \`\`\`${e.stack}\`\`\``
                }).catch()
            }

        }, {
            scheduled: true,
            timezone: `Europe/Moscow`
        })
    }

    /**
     * 
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async NewYearNamesDisable(client) {
        try {
            if (!await checkPlugin("320193302844669959", this.id)) return;
            const userDatas = await User.find()

            for (const userData of userDatas) {
                const { displayname, rank_number } = userData
                if (displayname.custom_rank == false) {
                    if (rank_number == 0) {
                        displayname.rank = `🦋`
                    } else if (rank_number == 1) {
                        displayname.rank = `🥥`
                    } else if (rank_number == 2) {
                        displayname.rank = `🍕`
                    } else if (rank_number == 3) {
                        displayname.rank = `🍂`
                    } else if (rank_number == 4) {
                        displayname.rank = `🍁`
                    } else if (rank_number == 5) {
                        displayname.rank = `⭐`
                    } else if (rank_number == 6) {
                        displayname.rank = `🏅`
                    } else if (rank_number == 7) {
                        displayname.rank = `🍓`
                    } else if (rank_number == 8) {
                        displayname.rank = `🧨`
                    } else if (rank_number == 9) {
                        displayname.rank = `💎`
                    } else if (rank_number == 10) {
                        displayname.rank = `🍇`
                    }
                }
                userData.save()
            }
        } catch (e) {
            const admin = await client.users.fetch(`491343958660874242`)
            console.log(e)
            await admin.send({
                content: `-> \`\`\`${e.stack}\`\`\``
            }).catch()
        }


    }

    /**
     * 
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async NewYearNamesEnable(client) {
        try {
            if (!await checkPlugin("320193302844669959", this.id)) return;
            const userDatas = await User.find()

            for (const userData of userDatas) {
                const { displayname, rank_number } = userData
                if (displayname.custom_rank == false) {
                    if (rank_number == 0) {
                        displayname.rank = `🎏`
                    } else if (rank_number == 1) {
                        displayname.rank = `🎈`
                    } else if (rank_number == 2) {
                        displayname.rank = `🎁`
                    } else if (rank_number == 3) {
                        displayname.rank = `🎀`
                    } else if (rank_number == 4) {
                        displayname.rank = `🍊`
                    } else if (rank_number == 5) {
                        displayname.rank = `⛄`
                    } else if (rank_number == 6) {
                        displayname.rank = `🎄`
                    } else if (rank_number == 7) {
                        displayname.rank = `🍷`
                    } else if (rank_number == 8) {
                        displayname.rank = `🧁`
                    } else if (rank_number == 9) {
                        displayname.rank = `🍧`
                    } else if (rank_number == 10) {
                        displayname.rank = `🍾`
                    }
                }
                userData.save()
            }
        } catch (e) {
            const admin = await client.users.fetch(`491343958660874242`)
            console.log(e)
            await admin.send({
                content: `-> \`\`\`${e.stack}\`\`\``
            }).catch()
        }

    }

    /**
     * 
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async NewYearRewards(client) {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", this.id)) return;
            const guildData = await Guild.findOne({ id: guild.id })
            if (guildData.seasonal.new_year.enabled === false) return
            const results = await User.find({ guildid: guild.id })

            for (const result of results) {
                const { seasonal } = result
                const member = await guild.members.fetch(result.userid)

                if (seasonal.new_year.achievements.num1 == true && seasonal.new_year.achievements.num2 == true && seasonal.new_year.achievements.num3 == true && seasonal.new_year.achievements.num4 == true && seasonal.new_year.achievements.num5 == true && seasonal.new_year.achievements.num6 == true && !member.roles.cache.has(`1030757867373998190`)) {
                    const done = new EmbedBuilder()
                        .setTitle(`Выдана сезонная роль`)
                        .setColor(Number(client.information.bot_color))
                        .setThumbnail(member.user.displayAvatarURL())
                        .setTimestamp(Date.now())
                        .setDescription(`${member} получил \`${guild.roles.cache.get(`1030757867373998190`).name}\`! В течение часа ему станет доступен сезонный цвет!`)
                    await member.roles.add(`1030757867373998190`)
                    await guild.channels.cache.get(ch_list.main).send({
                        embeds: [done]
                    })
                }


            }
        } catch (e) {
            const admin = await client.users.fetch(`491343958660874242`)
            console.log(e)
            await admin.send({
                content: `-> \`\`\`${e.stack}\`\`\``
            }).catch()
        }

    }

    /**
     * 
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async newYearStart(client) {

        cron.schedule(`0 12 1 12 *`, async () => {
            try {
                const g = await client.guilds.fetch(`320193302844669959`)
                if (!await checkPlugin("320193302844669959", this.id)) return;
                const guildData = await Guild.findOne({ id: g.id })
                SeasonChannels.forEach(async ch => {
                    try {
                        const channel = await g.channels.fetch(ch)
                        await channel.edit({
                            permissionOverwrites: [
                                {
                                    id: `504887113649750016`,
                                    allow: [
                                        PermissionsBitField.Flags.ViewChannel,
                                    ],
                                    deny: [
                                        PermissionsBitField.Flags.SendMessages
                                    ]
                                },
                                {
                                    id: g.id,
                                    deny: [
                                        PermissionsBitField.Flags.ViewChannel,
                                        PermissionsBitField.Flags.SendMessages
                                    ]
                                },
                            ]
                        })
                    } catch (e) {
                        console.log(e)
                    }

                })
                guildData.seasonal.new_year.enabled = true
                guildData.save()
                client.AdvCalendarClear()
                client.NewYearNamesEnable();
                const userDatas = await User.find({ guildid: g.id })
                userDatas.forEach(async userData => {
                    let { points, adventcalendar, santa_suit, opened_gifts, quests_completed, quest, achievements } = userData.seasonal.new_year
                    points = 0
                    adventcalendar = []
                    santa_suit.hat = false
                    santa_suit.chest = false
                    santa_suit.gloves = false
                    santa_suit.bag = false
                    opened_gifts = 0
                    quests_completed = 0
                    achievements.num1 = false
                    achievements.num2 = false
                    achievements.num3 = false
                    achievements.num4 = false
                    achievements.num5 = false
                    achievements.num6 = false
                    quests_completed = 0
                    quest.before = 0
                    quest.id = -1
                    quest.finished = true
                    quest.requirement = Infinity
                    quest.description = `Нет квеста.`
                    userData.seasonal.new_year.bingo_rewards = []
                    userData.seasonal.new_year.bingo = []
                    userData.seasonal.new_year.gifted_packs = 0
                    userData.seasonal.new_year.snowflakes = 0
                    userData.seasonal.new_year.total_snowflakes = 0
                    if (userData.onlinemode == true) {
                        await createBingoProfile(userData, "new_year", bingo)
                    } else {
                        userData.save()
                    }
                })


                const news = await g.channels.fetch(`849313479924252732`)
                const embed = new EmbedBuilder()
                    .setTitle(`Новогодний сезон`)
                    .setDescription(`Сегодня, <t:${Math.floor(new Date().getTime() / 1000)}:f>, гильдия Starpixel открывает новогодний сезон.
Смело открывайте канал <#${ch_list.ny_main}> и зарабатывайте очки, чтобы стать лучшим игроком новогоднего сезона!`)
                const msg = await news.send({
                    content: `@everyone`,
                    embeds: [embed],
                    allowedMentions: {
                        parse: ["everyone"]
                    }
                })
                await msg.react(`✅`)
            } catch (e) {
                const admin = await client.users.fetch(`491343958660874242`)
                console.log(e)
                await admin.send({
                    content: `-> \`\`\`${e.stack}\`\`\``
                }).catch()
            }

        }, {
            scheduled: true,
            timezone: `Europe/Moscow`
        })
    }

    /**
     * 
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async NewYearSnowfall(client) {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", this.id)) return;
            const guildData = await Guild.findOne({ id: guild.id })

            cron.schedule(`0,30 * * * *`, async () => {
                if (guildData.seasonal.new_year.enabled == false) return
                const items = [true, false, false, false]
                const item = items[Math.floor(Math.random() * items.length)]

                if (item) {
                    let prizes = [
                        {
                            id: 1,
                            name: `Новогодний подарок`,
                            amount: 1
                        },
                        {
                            id: 2,
                            name: `Новогодний подарок`,
                            amount: 2
                        },
                        {
                            id: 3,
                            name: `Новогодние очки`,
                            amount: 1
                        },
                        {
                            id: 4,
                            name: `Новогодние очки`,
                            amount: 2
                        },
                        {
                            id: 5,
                            name: `Новогодние очки`,
                            amount: 3
                        },
                        {
                            id: 6,
                            name: `Снежинки`,
                            amount: 3
                        },
                        {
                            id: 7,
                            name: `Снежинки`,
                            amount: 5
                        },
                        {
                            id: 8,
                            name: `Снежинки`,
                            amount: 7
                        }
                    ]

                    let prize = prizes[Math.floor(Math.random() * prizes.length)]

                    const channel = await guild.channels.fetch(ch_list.main);
                    const button = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(`Получить подарок`)
                                .setCustomId(`claim_elf_reward`)
                                .setStyle(ButtonStyle.Success)
                                .setEmoji(`🧝‍♂️`)
                        )

                    const msg = await channel.send({
                        content: `🧝‍♂️ Новогодний эльф прибыл в чат и оставил свой подарок! **Заберите его в течение 10 минут, иначе он растает!**
                        
\`??? x?\` 🎁`,
                        components: [button]
                    })

                    const collector = await msg.createMessageComponentCollector({ time: 1000 * 60 * 10 })
                    let claimed = false
                    collector.on('collect', async (i) => {
                        const userData = await User.findOne({
                            userid: i.user.id,
                            guildid: i.guild.id
                        })

                        if (prize.id == 1 || prize.id == 2) {
                            for (let i = 0; i < prize.amount; i++) {
                                userData.stacked_items.push(`925799156679856240`)
                            }
                        } else if (prize.id == 3 || prize.id == 4 || prize.id == 5) {
                            userData.seasonal.new_year.points += prize.amount
                        } else if (prize.id == 6 || prize.id == 7 || prize.id == 8) {
                            userData.seasonal.new_year.snowflakes += prize.amount
                            userData.seasonal.new_year.total_snowflakes += prize.amount
                        }

                        userData.save()
                        claimed = true

                        await i.reply({
                            content: `Вы получили ${prize.name} x${prize.amount} от новогоднего эльфа!`,
                            ephemeral: true
                        })
                        await msg.edit({
                            content: `🧝‍♂️ Новогодний эльф прибыл в чат и оставил свой подарок! **Заберите его в течение 10 минут, иначе он растает!**
                        
\`${prize.name} x${prize.amount}\` 🎁
Подарок забрал: ${i.user}`,
                            components: []
                        })

                        collector.stop();
                    })

                    collector.on('end', async e => {
                        if (!claimed) {
                            await msg.edit({
                                content: `🧝‍♂️ Новогодний эльф прибыл в чат и оставил свой подарок! **Заберите его в течение 10 минут, иначе он растает!**
                        
\`${prize.name} x${prize.amount}\` 🎁
**Подарок, к сожалению, никто не забрал!**`,
                                components: []
                            })  

                            await wait(60000)
                            await msg.delete();
                        }
                    })



                }

            }, {
                scheduled: true,
                timezone: `Europe/Moscow`
            })
        } catch (e) {
            const admin = await client.users.fetch(`491343958660874242`)
            console.log(e)
            await admin.send({
                content: `-> \`\`\`${e.stack}\`\`\``
            }).catch()
        }

    }
}

module.exports = {
    NewYear
}