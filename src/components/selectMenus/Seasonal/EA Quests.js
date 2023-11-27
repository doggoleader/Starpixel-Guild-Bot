const { Temp } = require(`../../../schemas/temp_items`)
const { User } = require(`../../../schemas/userdata`)
const { Guild } = require(`../../../schemas/guilddata`)
const chalk = require(`chalk`)
const fetch = require(`node-fetch`)
const cron = require(`node-cron`)
const prettyMilliseconds = require(`pretty-ms`)
const ch_list = require(`../../../discord structure/channels.json`)
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js")
const { mentionCommand } = require('../../../functions');

const { achievementStats, found, getProperty } = require(`../../../functions`)
const { lb_easter, stats_easter, quests_easter } = require("../../../misc_functions/Exporter")
const api = process.env.hypixel_apikey
/**
 * 
 * @param {import("discord.js").StringSelectMenuInteraction} interaction Interaction
 * @param {import("../../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        const guildData = await Guild.findOne({ id: interaction.guild.id })
        await interaction.message.edit({
            components: [lb_easter, quests_easter, stats_easter]
        })
        if (guildData.plugins.seasonal === false) return interaction.reply({ content: `Данный плагин отключён! Попробуйте позже!`, ephemeral: true })
        if (guildData.seasonal.easter.enabled === false) return interaction.reply({
            content: `Сейчас не время для Пасхи! Попробуйте сделать это в период **1 апреля по 10 мая**!`,
            ephemeral: true
        })
        const action = interaction.values[0]

        const quests = require(`../../../jsons/Easter Quests.json`)
        const userData = await User.findOne({ userid: interaction.user.id, guildid: interaction.guild.id })
        if (!userData.onlinemode) return interaction.reply({
            content: `Вы не можете выполнить брать квесты, так как у вас нелицензированный аккаунт!`,
            ephemeral: true
        })
        const response = await fetch(`https://api.hypixel.net/player?uuid=${userData.uuid}`, {
            headers: {
                "API-Key": api,
                "Content-Type": "application/json"
            }
        })
        let json
        if (response.ok) {
            json = await response.json()
        }
        if (action == `start_quest`) {

            if (userData.cooldowns.ea_quest > Date.now())
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(Number(client.information.bot_color))
                            .setAuthor({
                                name: `Вы не можете использовать эту команду`
                            })
                            .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${prettyMilliseconds(userData.cooldowns.ea_quest - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}!`)
                    ],
                    ephemeral: true
                });
            const quest = quests[Math.floor(Math.random() * quests.length)]
            let wins = await getProperty(json.player.stats, quest.code)
            if (!wins) wins = 0

            userData.seasonal.easter.quest.before = wins
            userData.seasonal.easter.quest.description = quest.description
            userData.seasonal.easter.quest.finished = false
            userData.seasonal.easter.quest.id = quest.id
            userData.seasonal.easter.quest.requirement = wins + quest.req_wins
            userData.cooldowns.ea_quest = Date.now() + (1000 * 60 * 60 * 16) * (1 - (userData.perks.decrease_cooldowns * 0.1))
            if (userData.cd_remind.includes('ea_quest')) {
                let ITEM_ID = userData.cd_remind.findIndex(item_id => item_id == 'ea_quest')
                userData.cd_remind.splice(ITEM_ID, 1)
            }
            userData.save()
            const questEmbed = new EmbedBuilder()
                .setColor(`Green`)
                .setTitle(`Пасхальный квест для ${interaction.user.username}`)
                .setDescription(`${interaction.member} получил пасхальное задание:
\`${quest.description}\`

За его выполнение вы получите <@&${quest.reward}>`)
                .setTimestamp(Date.now())
                .setThumbnail(interaction.user.displayAvatarURL())
            await interaction.guild.channels.cache.get(ch_list.main).send({
                embeds: [questEmbed]
            })
            await interaction.reply({
                embeds: [questEmbed],
                ephemeral: true
            })

        } else if (action == `end_quest`) {
            const quest = quests.find(q => q.id == userData.seasonal.easter.quest.id)
            if (!quest) return interaction.reply({
                content: `Не удалось найти ваш квест!`,
                ephemeral: true
            })
            if (userData.seasonal.easter.quest.finished == true) return interaction.reply({
                content: `Вы уже выполнили этот квест!`,
                ephemeral: true
            })
            let wins = await getProperty(json.player.stats, quest.code)
            if (!wins) wins = 0
            if (wins < userData.seasonal.easter.quest.requirement) return interaction.reply({
                content: `Вы не выполнили условие этого квеста! Вам нужно \`${quest.description}\`, вы сделали ${wins - userData.seasonal.easter.quest.before}/${quest.req_wins}!`,
                ephemeral: true
            })
            if (interaction.member.roles.cache.has(quest.reward)) {
                if (userData.stacked_items.length < userData.upgrades.inventory_size) {
                    await userData.stacked_items.push(quest.reward)
                    await interaction.reply({
                        content: `Награда была добавлена в инвентарь! Чтобы получить награду, откройте коробки и пропишите команду ${mentionCommand(client, 'rewards claim')}! Для просмотра списка неполученных наград пропишите ${mentionCommand(client, 'rewards unclaimed')}!`,
                        ephemeral: true
                    })
                } else return interaction.reply({
                    content: `Мы не можем добавить предмет в ваш инвентарь, так как он переполнен. Чтобы увеличить вместительность своего инвентаря, перейдите в канал <#1141026403765211136>!`,
                    ephemeral: true
                })
            } else {
                await interaction.member.roles.add(quest.reward)
            }
            userData.quests.seasonal.stats.ea.total += 1
            userData.seasonal.easter.quest.finished = true
            userData.seasonal.easter.points += 5
            userData.seasonal.easter.quests_completed += 1
            userData.save()

            const done = new EmbedBuilder()
                .setColor(`Green`)
                .setTitle(`Пасхальный квест выполнен`)
                .setDescription(`${interaction.member} выполнил пасхальное задание \`${quest.description}\`! Он получил <@&${quest.reward}>!

**Количество выполненных заданий**: ${userData.seasonal.easter.quests_completed}`)
            await interaction.guild.channels.cache.get(ch_list.main).send({
                embeds: [done]
            })
            await interaction.reply({
                embeds: [done],
                ephemeral: true
            })
        } else if (action == `quest_info`) {
            const quest = quests.find(q => q.id == userData.seasonal.easter.quest.id)
            if (!quest) return interaction.reply({
                content: `Не удалось найти ваш квест!`,
                ephemeral: true
            })
            let wins = await getProperty(json.player.stats, quest.code)
            if (!wins) wins = 0
            let fin_res
            if (userData.seasonal.easter.quest.requirement - wins >= 0) fin_res = userData.seasonal.easter.quest.requirement - wins
            else if (userData.seasonal.easter.quest.requirement - wins < 0) fin_res = 0
            const done = new EmbedBuilder()
                .setColor(`Green`)
                .setTitle(`Пасхальный квест`)
                .setDescription(`**Основная информация о вашем пасхальном квесте**

**Название**: ${quest.description}
**Награда**: <@&${quest.reward}>
**Необходимое количество побед**: ${quest.req_wins}

**Побед в режиме сейчас**: ${wins}
**Побед на конец квеста**: ${userData.seasonal.easter.quest.requirement}
**Осталось побед**: ${fin_res}

**Статус**: \`${userData.seasonal.easter.quest.finished ? `✅ Завершён` : `❌ Не завершён`}\``)
            await interaction.reply({
                embeds: [done],
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
module.exports = {
    plugin: {
        id: "seasonal",
        name: "Сезонное"
    },
    data: {
        name: `season_easter_quests`
    },
    execute
}
