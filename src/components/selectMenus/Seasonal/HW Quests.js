const { Temp } = require(`../../../schemas/temp_items`)
const { User } = require(`../../../schemas/userdata`)
const { Guild } = require(`../../../schemas/guilddata`)
const chalk = require(`chalk`)
const fetch = require(`node-fetch`)
const cron = require(`node-cron`)
const ch_list = require(`../../../discord structure/channels.json`)
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js")

const { achievementStats, found, getProperty, calcCooldown } = require(`../../../functions`)
const { lb_halloween, stats_halloween, quests_halloween } = require("../../../misc_functions/Exporter")
const { mentionCommand } = require('../../../functions');
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
            components: [lb_halloween, quests_halloween, stats_halloween]
        })
        if (guildData.plugins.seasonal === false) return interaction.reply({ content: `Данный плагин отключён! Попробуйте позже!`, ephemeral: true })
        if (guildData.seasonal.halloween.enabled === false) return interaction.reply({
            content: `Сейчас не время для Хэллоуина! Попробуйте сделать это в период с **7 октября по 7 ноября**!`,
            ephemeral: true
        })
        const action = interaction.values[0]

        const quests = require(`../../../jsons/Halloween Quests.json`)
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

            if (userData.cooldowns.hw_quest > Date.now())
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(Number(client.information.bot_color))
                            .setAuthor({
                                name: `Вы не можете использовать эту команду`
                            })
                            .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${calcCooldown(userData.cooldowns.hw_quest - Date.now())}!`)
                    ],
                    ephemeral: true
                });
            const quest = quests[Math.floor(Math.random() * quests.length)]
            let wins = await getProperty(json.player.stats, quest.code)
            if (!wins) wins = 0

            userData.seasonal.halloween.quest.before = wins
            userData.seasonal.halloween.quest.description = quest.description
            userData.seasonal.halloween.quest.finished = false
            userData.seasonal.halloween.quest.id = quest.id
            userData.seasonal.halloween.quest.requirement = wins + quest.req_wins
            userData.cooldowns.hw_quest = Date.now() + (1000 * 60 * 60 * 16) * (1 - (userData.perks.decrease_cooldowns * 0.1))
            if (userData.cd_remind.includes('hw_quest')) {
                let ITEM_ID = userData.cd_remind.findIndex(item_id => item_id == 'hw_quest')
                userData.cd_remind.splice(ITEM_ID, 1)
            }
            userData.save()
            const questEmbed = new EmbedBuilder()
                .setColor(`Green`)
                .setTitle(`Хэллоуинский квест для ${interaction.user.username}`)
                .setDescription(`${interaction.member} получил хэллоуинское задание:
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
            const quest = quests.find(q => q.id == userData.seasonal.halloween.quest.id)
            if (!quest) return interaction.reply({
                content: `Не удалось найти ваш квест!`,
                ephemeral: true
            })
            if (userData.seasonal.halloween.quest.finished == true) return interaction.reply({
                content: `Вы уже выполнили этот квест!`,
                ephemeral: true
            })
            let wins = await getProperty(json.player.stats, quest.code)
            if (!wins) wins = 0
            if (wins < userData.seasonal.halloween.quest.requirement) return interaction.reply({
                content: `Вы не выполнили условие этого квеста! Вам нужно \`${quest.description}\`, вы сделали ${wins - userData.seasonal.halloween.quest.before}/${quest.req_wins}!`,
                ephemeral: true
            })
            if (interaction.member.roles.cache.has(quest.reward)) {
                if (userData.stacked_items.length < userData.upgrades.inventory_size) {
                    await userData.stacked_items.push(quest.reward)
                    await interaction.reply({
                        content: `Награда была добавлена в инвентарь! Чтобы получить награду, откройте коробки и пропишите команду ${mentionCommand(client, 'inventory')}! Для просмотра списка неполученных наград пропишите ${mentionCommand(client, 'inventory')}!`,
                        ephemeral: true
                    })
                } else return interaction.reply({
                    content: `Мы не можем добавить предмет в ваш инвентарь, так как он переполнен. Чтобы увеличить вместительность своего инвентаря, перейдите в канал <#1141026403765211136>!`,
                    ephemeral: true
                })
            } else {
                await interaction.member.roles.add(quest.reward)
            }
            userData.quests.seasonal.stats.hw.total += 1
            userData.seasonal.halloween.quest.finished = true
            userData.seasonal.halloween.points += 5
            userData.seasonal.halloween.quests_completed += 1
            userData.save()

            const done = new EmbedBuilder()
                .setColor(`Green`)
                .setTitle(`Хэллоуинский квест выполнен`)
                .setDescription(`${interaction.member} выполнил хэллоуинское задание \`${quest.description}\`! Он получил <@&${quest.reward}>!

**Количество выполненных заданий**: ${userData.seasonal.halloween.quests_completed}`)
            await interaction.guild.channels.cache.get(ch_list.main).send({
                embeds: [done]
            })
            await interaction.reply({
                embeds: [done],
                ephemeral: true
            })
        } else if (action == `quest_info`) {
            const quest = quests.find(q => q.id == userData.seasonal.halloween.quest.id)
            if (!quest) return interaction.reply({
                content: `Не удалось найти ваш квест!`,
                ephemeral: true
            })
            let wins = await getProperty(json.player.stats, quest.code)
            if (!wins) wins = 0
            let fin_res
            if (userData.seasonal.halloween.quest.requirement - wins >= 0) fin_res = userData.seasonal.halloween.quest.requirement - wins
            else if (userData.seasonal.halloween.quest.requirement - wins < 0) fin_res = 0
            const done = new EmbedBuilder()
                .setColor(`Green`)
                .setTitle(`Хэллоуинский квест`)
                .setDescription(`**Основная информация о вашем хэллоуинском квесте**

**Название**: ${quest.description}
**Награда**: <@&${quest.reward}>
**Необходимое количество побед**: ${quest.req_wins}

**Побед в режиме сейчас**: ${wins}
**Побед на конец квеста**: ${userData.seasonal.halloween.quest.requirement}
**Осталось побед**: ${fin_res}

**Статус**: \`${userData.seasonal.halloween.quest.finished ? `✅ Завершён` : `❌ Не завершён`}\``)
            await interaction.reply({
                embeds: [done],
                ephemeral: true
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
module.exports = {
    plugin: {
        id: "seasonal",
        name: "Сезонное"
    },
    data: {
        name: `season_halloween_quests`
    },
    execute
}
