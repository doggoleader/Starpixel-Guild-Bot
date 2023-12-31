const { Temp } = require(`../../../schemas/temp_items`)
const { User } = require(`../../../schemas/userdata`)
const { Guild } = require(`../../../schemas/guilddata`)
const chalk = require(`chalk`)
const fetch = require(`node-fetch`)
const cron = require(`node-cron`)
const ch_list = require(`../../../discord structure/channels.json`)
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js")

const { achievementStats, found, getProperty } = require(`../../../functions`)
const { lb_halloween, stats_halloween, quests_halloween } = require("../../../misc_functions/Exporter")
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
            components: [lb_halloween, quests_halloween, stats_halloween]
        })
        if (guildData.plugins.seasonal === false) return interaction.editReply({ content: `Данный плагин отключён! Попробуйте позже!`, ephemeral: true })
        if (guildData.seasonal.halloween.enabled === false) return interaction.editReply({
            content: `Сейчас не время для Хэллоуина! Попробуйте сделать это в период с **7 октября по 7 ноября**!`,
            ephemeral: true
        })

        const member = await interaction.guild.members.fetch(interaction.values[0])
        const { user } = member
        if (user.bot) return interaction.editReply({
            content: `${user} является ботом, а значит он не может получать хэллоуинские очки :'(`,
            ephemeral: true
        })
        if (!member.roles.cache.has(`504887113649750016`)) return interaction.editReply({
            content: `${member} является гостем гильдии, а значит у него хэллоуинских очков!`,
            ephemeral: true
        })
        const users = await User.find().then(users => {
            return users.filter(async user => await interaction.guild.members.fetch(user.userid))
        })
        const sorts = users.sort((a, b) => {
            return b.seasonal.halloween.points - a.seasonal.halloween.points
        })
        var i = 0
        while (sorts[i].userid !== user.id) {
            i++
        }
        const userData = await User.findOne({ userid: user.id, guildid: interaction.guild.id })
        let rank = i + 1
        const embed = new EmbedBuilder()
            .setTitle(`Хэллоуинская статистика пользователя ${user.username}`)
            .setDescription(`**Позиция в топе**: ${rank}
**Очков**: ${userData.seasonal.halloween.points}
**Открыто жутких коробок**: ${userData.seasonal.halloween.opened_scary}
**Хэллоуинская душа**: ${found(userData.seasonal.halloween.hw_soul)}
**Сообщение 31 октября**: ${userData.seasonal.halloween.hw_msg ? "Отправлено ✅" : "Не отправлено ❌"}
**Косметический предмет**: ${userData.seasonal.halloween.hw_cosm ? "Приобретен ✅" : "Не приобретен ❌"}
**Выполнено квестов**: ${userData.seasonal.halloween.quests_completed}

**ДОСТИЖЕНИЯ**
**Достижение №1**: ${achievementStats(userData.seasonal.halloween.achievements.num1)}
**Достижение №2**: ${achievementStats(userData.seasonal.halloween.achievements.num2)}
**Достижение №3**: ${achievementStats(userData.seasonal.halloween.achievements.num3)}
**Достижение №4**: ${achievementStats(userData.seasonal.halloween.achievements.num4)}
**Достижение №5**: ${achievementStats(userData.seasonal.halloween.achievements.num5)}
**Достижение №6**: ${achievementStats(userData.seasonal.halloween.achievements.num6)}

**ТЕКУЩИЙ КВЕСТ**
**Условие**: \`${userData.seasonal.halloween.quest.description}\`
**Количество на начало квеста**: ${userData.seasonal.halloween.quest.before}
**Количество на конец квеста**: ${userData.seasonal.halloween.quest.requirement}
**Статус**: \`${userData.seasonal.halloween.quest.finished ? `Завершено ✅` : `Не завершено ❌`}\``)
            .setThumbnail(user.displayAvatarURL())
            .setColor(Number(client.information.bot_color))
            .setTimestamp(Date.now())

        await interaction.editReply({
            embeds: [embed],
            ephemeral: true
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
        name: `season_halloween_stats`
    },
    execute
}
