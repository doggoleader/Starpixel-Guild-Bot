const { Temp } = require(`../../../schemas/temp_items`)
const { User } = require(`../../../schemas/userdata`)
const { Guild } = require(`../../../schemas/guilddata`)
const chalk = require(`chalk`)
const fetch = require(`node-fetch`)
const cron = require(`node-cron`)
const prettyMilliseconds = require(`pretty-ms`)
const ch_list = require(`../../../discord structure/channels.json`)
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js")

const { achievementStats, found, getProperty } = require(`../../../functions`)
const { lb_summer, stats_summer, quests_summer } = require("../../../misc_functions/Exporter")
const api = process.env.hypixel_apikey
/**
 * 
 * @param {import("discord.js").UserSelectMenuInteraction} interaction Interaction
 * @param {import("../../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        const msg = await interaction.deferReply({ fetchReply: true, ephemeral: true })
        const guildData = await Guild.findOne({ id: interaction.guild.id })
        await interaction.message.edit({
            components: [lb_summer, quests_summer, stats_summer]
        })
        if (guildData.plugins.seasonal === false) return interaction.editReply({ content: `Данный плагин отключён! Попробуйте позже!`, ephemeral: true })
        if (guildData.seasonal.summer.enabled === false) return interaction.editReply({
            content: `Сейчас не время для Лета! Попробуйте сделать это в период **1 июня по 31 августа**!`,
            ephemeral: true
        })

        const member = await interaction.guild.members.fetch(interaction.values[0])
        const { user } = member
        if (user.bot) return interaction.editReply({
            content: `${user} является ботом, а значит он не может получать летнюю статистику :'(`,
            ephemeral: true
        })
        if (!member.roles.cache.has(`504887113649750016`)) return interaction.editReply({
            content: `${member} является гостем гильдии, а значит у него нет летней статистики!`,
            ephemeral: true
        })
        const users = await User.find().then(users => {
            return users.filter(async user => await interaction.guild.members.fetch(user.userid))
        })
        const sorts = users.sort((a, b) => {
            return b.seasonal.summer.points - a.seasonal.summer.points
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
**Очков**: ${userData.seasonal.summer.points}
**Открыто летних коробок**: ${userData.seasonal.summer.opened_boxes}
**Билет на море**: ${found(userData.seasonal.summer.sea_ticket)}
**Выполнено квестов**: ${userData.seasonal.summer.quests_completed}
**Выполнено уникальных квестов**: ${userData.seasonal.summer.unique_quests}
**Посещено событий** ${userData.seasonal.summer.events.events_attended}

**ДОСТИЖЕНИЯ**
**Достижение №1**: ${achievementStats(userData.seasonal.summer.achievements.num1)}
**Достижение №2**: ${achievementStats(userData.seasonal.summer.achievements.num2)}
**Достижение №3**: ${achievementStats(userData.seasonal.summer.achievements.num3)}
**Достижение №4**: ${achievementStats(userData.seasonal.summer.achievements.num4)}
**Достижение №5**: ${achievementStats(userData.seasonal.summer.achievements.num5)}
**Достижение №6**: ${achievementStats(userData.seasonal.summer.achievements.num6)}
**Достижение №7**: ${achievementStats(userData.seasonal.summer.achievements.num7)}
**Достижение №8**: ${achievementStats(userData.seasonal.summer.achievements.num8)}
**Достижение №9**: ${achievementStats(userData.seasonal.summer.achievements.num9)}
**Достижение №10**: ${achievementStats(userData.seasonal.summer.achievements.num10)}

**ТЕКУЩИЙ КВЕСТ**
**Условие**: \`${userData.seasonal.summer.quest.description}\`
**Количество на начало квеста**: ${userData.seasonal.summer.quest.before}
**Количество на конец квеста**: ${userData.seasonal.summer.quest.requirement}
**Статус**: \`${userData.seasonal.summer.quest.finished ? `Завершено ✅` : `Не завершено ❌`}\``)
            .setThumbnail(user.displayAvatarURL())
            .setColor(Number(client.information.bot_color))
            .setTimestamp(Date.now())

        await interaction.editReply({
            embeds: [embed]
        })

    } catch (e) {
        const admin = await client.users.fetch(`491343958660874242`)
        console.log(e)
        await admin.send({
            content: `-> \`\`\`${e.stack}\`\`\``
        }).catch()
    }


}
module.exports = {
    plugin: {
        id: "seasonal",
        name: "Сезонное"
    },
    data: {
        name: `season_summer_stats`
    },
    execute
}
