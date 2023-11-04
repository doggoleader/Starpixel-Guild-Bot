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
const { lb_easter, stats_easter, quests_easter } = require("../../../misc_functions/Exporter")
const api = process.env.hypixel_apikey
module.exports = {
    plugin: {
        id: "seasonal",
        name: "Сезонное"
    },
    data: {
        name: `season_easter_stats`
    },
    async execute(interaction, client) {
        try {
            const msg = await interaction.deferReply({ fetchReply: true, ephemeral: true })
            const guildData = await Guild.findOne({ id: interaction.guild.id })
            await interaction.message.edit({
                components: [lb_easter, quests_easter, stats_easter]
            })
            if (guildData.plugins.seasonal === false) return interaction.editReply({ content: `Данный плагин отключён! Попробуйте позже!`, ephemeral: true })
            if (guildData.seasonal.easter.enabled === false) return interaction.editReply({
                content: `Сейчас не время для Пасхи! Попробуйте сделать это в период **1 апреля по 10 мая**!`,
                ephemeral: true
            })

            const member = await interaction.guild.members.fetch(interaction.values[0])
            const { user } = member
            if (user.bot) return interaction.editReply({
                content: `${user} является ботом, а значит он не может получать пасхальные очки :'(`,
                ephemeral: true
            })
            if (!member.roles.cache.has(`504887113649750016`)) return interaction.editReply({
                content: `${member} является гостем гильдии, а значит у него пасхальных очков!`,
                ephemeral: true
            })
            const users = await User.find().then(users => {
                return users.filter(async user => await interaction.guild.members.fetch(user.userid))
            })
            const sorts = users.sort((a, b) => {
                return b.seasonal.easter.points - a.seasonal.easter.points
            })
            var i = 0
            while (sorts[i].userid !== user.id) {
                i++
            }
            const userData = await User.findOne({ userid: user.id, guildid: interaction.guild.id })
            let rank = i + 1
            const embed = new EmbedBuilder()
                .setTitle(`Пасхальная статистика пользователя ${user.username}`)
                .setDescription(`**Позиция в топе**: ${rank}
**Очков**: ${userData.seasonal.easter.points}
**Открыто пасхальных яиц**: ${userData.seasonal.easter.opened_eggs}
**Пасхальный кролик**: ${found(userData.seasonal.easter.rabbit)}
**Выполнено квестов**: ${userData.seasonal.easter.quests_completed}

**ДОСТИЖЕНИЯ**
**Достижение №1**: ${achievementStats(userData.seasonal.easter.achievements.num1)}
**Достижение №2**: ${achievementStats(userData.seasonal.easter.achievements.num2)}
**Достижение №3**: ${achievementStats(userData.seasonal.easter.achievements.num3)}
**Достижение №4**: ${achievementStats(userData.seasonal.easter.achievements.num4)}
**Достижение №5**: ${achievementStats(userData.seasonal.easter.achievements.num5)}

**ТЕКУЩИЙ КВЕСТ**
**Условие**: \`${userData.seasonal.easter.quest.description}\`
**Количество на начало квеста**: ${userData.seasonal.easter.quest.before}
**Количество на конец квеста**: ${userData.seasonal.easter.quest.requirement}
**Статус**: \`${userData.seasonal.easter.quest.finished ? `Завершено ✅` : `Не завершено ❌`}\``)
                .setThumbnail(user.displayAvatarURL())
                .setColor(Number(linksInfo.bot_color))
                .setTimestamp(Date.now())

            await interaction.editReply({
                embeds: [embed],
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
