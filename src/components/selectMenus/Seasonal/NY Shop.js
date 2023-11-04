const { Birthday } = require(`../../../schemas/birthday`)
const { Temp } = require(`../../../schemas/temp_items`)
const { User } = require(`../../../schemas/userdata`)
const { Guild } = require(`../../../schemas/guilddata`)
const chalk = require(`chalk`)
const fetch = require(`node-fetch`)
const cron = require(`node-cron`)
const prettyMilliseconds = require(`pretty-ms`)
const ch_list = require(`../../../discord structure/channels.json`)
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js")
const { execute } = require('../../../events/client/start_bot/ready');
const { achievementStats, found, getProperty } = require(`../../../functions`)
const linksInfo = require(`../../../discord structure/links.json`)
const api = process.env.hypixel_apikey
module.exports = {
    plugin: {
        id: "seasonal",
        name: "Сезонное"
    },
    data: {
        name: `season_newyear_shop`
    },
    async execute(interaction, client) {
        try {
            const guildData = await Guild.findOne({ id: interaction.guild.id })
            if (guildData.plugins.seasonal === false) return interaction.reply({ content: `Данный плагин отключён! Попробуйте позже!`, ephemeral: true })
            if (guildData.seasonal.new_year.enabled === false) return interaction.reply({
                content: `Сейчас не время для Нового года! Попробуйте сделать это в период **1 декабря по 18 января**!`,
                ephemeral: true
            })
            const userData = await User.findOne({ userid: interaction.user.id, guildid: interaction.guild.id })
            const symb = interaction.values[0]
            let price
            if (symb == `🎄` || symb == `✨` || symb == `🎆`) {
                price = 30
            } else if (symb == `🎁`) {
                price = 40
            } else if (symb == `🎇` || symb == `🎈`) {
                price = 50
            }

            if (userData.seasonal.new_year.points < price) return interaction.reply({
                content: `Для покупки \`${symb}\` вам необходимо минимум ${price} очков! У вас на данный момент ${userData.seasonal.new_year.points} очков.`,
                ephemeral: true
            })
            userData.seasonal.new_year.points -= price
            userData.displayname.symbol = symb
            userData.save()
            await interaction.reply({
                content: `Вы приобрели \`${symb}\` за ${price} новогодний очков! В скором времени данный значок появится в вашем никнейме! Если этого не произойдёт в течение 15 минут, обратитесь в вопрос-модерам!`,
                ephemeral: true
            })

        } catch (e) {
            const admin = await client.users.fetch(`491343958660874242`)
            console.log(e)
            let options = interaction?.options.data.map(a => {
                return `{
"status": true,
"name": "${a.name}",
"type": ${a.type},
"autocomplete": ${a?.autocomplete ? true : false},
"value": "${a?.value ? a.value : "No value"}",
"user": "${a?.user?.id ? a.user.id : "No User"}",
"channel": "${a?.channel?.id ? a.channel.id : "No Channel"}",
"role": "${a?.role?.id ? a.role.id : "No Role"}",
"attachment": "${a?.attachment?.url ? a.attachment.url : "No Attachment"}"
}`
            })
            await admin.send(`Произошла ошибка!`)
            await admin.send(`=> ${e}.
**ID кнопки**: \`${interaction.customId}\`
**Пользователь**: ${interaction.member}
**Канал**: ${interaction.channel}
**Опции**: \`\`\`json
${interaction.options.data.length <= 0 ? `{"status": false}` : options.join(`,\n`)}
\`\`\``)
            await admin.send(`◾`)
        }


    }
}
