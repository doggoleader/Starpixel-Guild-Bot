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
const linksInfo = require(`../../../discord structure/links.json`)
const { lb_summer, stats_summer, quests_summer } = require("../../../misc_functions/Exporter")
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
            components: [lb_summer, quests_summer, stats_summer]
        })
        if (guildData.plugins.seasonal === false) return interaction.reply({ content: `Данный плагин отключён! Попробуйте позже!`, ephemeral: true })
        if (guildData.seasonal.summer.enabled === false) return interaction.reply({
            content: `Сейчас не время для Лета! Попробуйте сделать это в период **1 июня по 31 августа**!`,
            ephemeral: true
        })
        const action = interaction.values[0]

        const quests = require(`../../../jsons/Summer Quests.json`)
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

            if (userData.cooldowns.su_quest > Date.now())
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(Number(linksInfo.bot_color))
                            .setAuthor({
                                name: `Вы не можете использовать эту команду`
                            })
                            .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${prettyMilliseconds(userData.cooldowns.su_quest - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}!`)
                    ],
                    ephemeral: true
                });
            const quest = quests[Math.floor(Math.random() * quests.length)]
            for (let req of quest.requirements) {
                if (req.type == "number") {
                    let wins = await getProperty(json.player.stats, req.code)
                    if (!wins) wins = 0
                    userData.seasonal.summer.quest.before = wins
                    userData.seasonal.summer.quest.requirement = wins + req.amount
                } else if (req.type == "cosmetic") {

                }
            }
            userData.seasonal.summer.quest.description = quest.description
            userData.seasonal.summer.quest.finished = false
            userData.seasonal.summer.quest.id = quest.id
            userData.cooldowns.su_quest = Date.now() + (1000 * 60 * 60 * 16)
            userData.save()
            const questEmbed = new EmbedBuilder()
                .setColor(`Green`)
                .setTitle(`Летний квест для ${interaction.user.username}`)
                .setDescription(`${interaction.member} получил летнее задание:
\`${quest.description}\`
**ТИП КВЕСТА**: \`${quest.type == "Normal" ? "Обычный" : "Уникальный"}\`

За его выполнение вы получите <@&${quest.reward.roleID}> x${quest.reward.amount}`)
                .setTimestamp(Date.now())
                .setThumbnail(interaction.user.displayAvatarURL())

            await interaction.reply({
                embeds: [questEmbed],
                ephemeral: true
            })

        } else if (action == `end_quest`) {
            const quest = quests.find(q => q.id == userData.seasonal.summer.quest.id)
            if (!quest) return interaction.reply({
                content: `Не удалось найти ваш квест!`,
                ephemeral: true
            })
            if (userData.seasonal.summer.quest.finished == true) return interaction.reply({
                content: `Вы уже выполнили этот квест!`,
                ephemeral: true
            })
            let results = [];
            for (let req of quest.requirements) {
                if (req.type == "number") {
                    let wins = await getProperty(json.player.stats, req.code)
                    if (!wins) wins = 0
                    if (wins < userData.seasonal.summer.quest.requirement) {
                        results.push(
                            {
                                text: req.description,
                                result: false
                            }
                        )
                    } else {
                        results.push({
                            text: req.description,
                            result: true
                        })
                    }
                } else if (req.type == "cosmetic") {
                    let cosm = await getProperty(json.player.stats, req.code);
                    if (!cosm) cosm = null;
                    if (cosm !== req.name) results.push({
                        text: req.description,
                        result: false
                    })
                    else results.push({
                        text: req.description,
                        result: true
                    })
                }
            }
            let map = await results.map((item, i) => {
                return `**${++i}.** ${item.text} ${item.result ? "✅" : "❌"}`
            })
            let falseItem = results.find(r => r.result == false)
            if (falseItem) return interaction.reply({
                content: `Вы не выполнили условие этого квеста! Вам нужно \`${quest.description}\`! Пожалуйста, проверьте все необходимые условия данного квеста и повторите попытку позже!
                    
**Условия**
${map.join(`\n`)}`,
                ephemeral: true
            })
            for (let i = 0; i < quest.reward.amount; i++) {
                if (userData.stacked_items.length < userData.upgrades.inventory_size) {
                    await userData.stacked_items.push(quest.reward.roleID)
                } else return interaction.reply({
                    content: `Мы не можем добавить предмет в ваш инвентарь, так как он переполнен. Чтобы увеличить вместительность своего инвентаря, перейдите в канал <#1141026403765211136>!`,
                    ephemeral: true
                })
            }
            if (quest.type == "Unique") {
                userData.seasonal.summer.unique_quests += 1
            }
            userData.quests.seasonal.stats.su.total += 1
            userData.seasonal.summer.quest.finished = true
            userData.seasonal.summer.points += 5
            userData.seasonal.summer.quests_completed += 1
            userData.save()

            const done = new EmbedBuilder()
                .setColor(`Green`)
                .setTitle(`Летний квест выполнен`)
                .setDescription(`${interaction.member} выполнил летнее задание \`${quest.description}\`! Он получил <@&${quest.reward.roleID}> x${quest.reward.amount}!
Используйте команду </rewards claim:1055546254240784492>, чтобы получить вашу награду!

**Количество выполненных заданий**: ${userData.seasonal.summer.quests_completed}
**Количество выполненных уникальных заданий**: ${userData.seasonal.summer.unique_quests}`)
            await interaction.reply({
                embeds: [done],
                ephemeral: true
            })
        } else if (action == `quest_info`) {
            const quest = quests.find(q => q.id == userData.seasonal.summer.quest.id)
            if (!quest) return interaction.reply({
                content: `Не удалось найти ваш квест!`,
                ephemeral: true
            })
            let requirements = []
            for (let req of quest.requirements) {
                if (req.type == "number") {
                    let wins = await getProperty(json.player.stats, req.code)
                    if (!wins) wins = 0
                    if (wins < userData.seasonal.summer.quest.requirement) {
                        requirements.push(
                            {
                                text: req.description,
                                result: false,
                                winsLeft: userData.seasonal.summer.quest.requirement - wins,
                                type: req.type
                            }
                        )
                    } else {
                        requirements.push({
                            text: req.description,
                            result: true,
                            winsLeft: 0,
                            type: req.type
                        })
                    }

                } else if (req.type == "cosmetic") {
                    let cosm = await getProperty(json.player.stats, req.code);
                    if (!cosm) cosm = null;
                    if (cosm !== req.name) requirements.push({
                        text: req.description,
                        result: false,
                        type: req.type
                    })
                    else requirements.push({
                        text: req.description,
                        result: true,
                        type: req.type
                    })
                }
            }

            let map = await requirements.map((item, i) => {
                if (item.type == "number") {
                    return `**${++i}.** ${item.text} ${item.result ? "✅" : "❌"}
**Осталось**: ${item.winsLeft}`
                } else if (item.type == "cosmetic") {
                    return `**${++i}.** ${item.text} ${item.result ? "✅" : "❌"}`
                }

            })
            const done = new EmbedBuilder()
                .setColor(`Green`)
                .setTitle(`Летний квест`)
                .setDescription(`**Основная информация о вашем летнем квесте**

**Название**: ${quest.description}
**Награда**: <@&${quest.reward.roleID}> x${quest.reward.amount}
**Тип квеста**: ${quest.type == "Normal" ? "Обычный" : "Уникальный"}

**УСЛОВИЯ**
${map.join(`\n`)}

**Статус**: \`${userData.seasonal.summer.quest.finished ? `✅ Завершён` : `❌ Не завершён`}\``)
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
        name: `season_summer_quests`
    },
    execute
}
