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
        name: `season_halloween_leaderboard`
    },
    async execute(interaction, client) {
        try {
            const guildData = await Guild.findOne({ id: interaction.guild.id })
            if (guildData.plugins.seasonal === false) return interaction.reply({ content: `Данный плагин отключён! Попробуйте позже!`, ephemeral: true })
            if (guildData.seasonal.halloween.enabled === false) return interaction.reply({
                content: `Сейчас не время для Хэллоуина! Попробуйте сделать это в период с **7 октября по 7 ноября**!`,
                ephemeral: true
            })
            const users = await User.find({
                "seasonal.halloween.points": { $gt: 0 }
            }).then(users => {
                return users.filter(async user => await interaction.guild.members.fetch(user.userid))
            })
            const sort = users.sort((a, b) => {
                return b.seasonal.halloween.points - a.seasonal.halloween.points
            }).slice(0, 10)
            let index = 1
            const map = sort.map(async (user) => {
                const tag = await interaction.guild.members.fetch(user.userid)
                return `**${index++}.** ${tag}: ${user.seasonal.halloween.points} очков`
            })
            const mapProm = await Promise.all(map)

            if (map.length < 1) {
                await interaction.reply({
                    content: `Пока что никто не заработал ни одного хэллоуинского очка!`,
                    ephemeral: true
                })
            } else {

                const embed = new EmbedBuilder()
                    .setColor(Number(linksInfo.bot_color))
                    .setAuthor({
                        name: `Лучшие пользователи по хэллоуинским очкам`
                    })
                    .setTimestamp(Date.now())
                    .setDescription(`${mapProm.join('\n')}`)

                await interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                })
            }

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
