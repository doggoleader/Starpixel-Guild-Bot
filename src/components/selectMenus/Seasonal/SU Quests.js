const { Temp } = require(`../../../schemas/temp_items`)
const { User } = require(`../../../schemas/userdata`)
const { Guild } = require(`../../../schemas/guilddata`)
const chalk = require(`chalk`)
const fetch = require(`node-fetch`)
const cron = require(`node-cron`)
const ch_list = require(`../../../discord structure/channels.json`)
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js")

const { achievementStats, found, getProperty, createBingoProfile, changeProperty } = require(`../../../functions`)
const { mentionCommand } = require('../../../functions');
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
                            .setColor(Number(client.information.bot_color))
                            .setAuthor({
                                name: `Вы не можете использовать эту команду`
                            })
                            .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${calcCooldown(userData.cooldowns.su_quest - Date.now())}!`)
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
            userData.cooldowns.su_quest = Date.now() + (1000 * 60 * 60 * 16) * (1 - (userData.perks.decrease_cooldowns * 0.1))
            if (userData.cd_remind.includes('su_quest')) {
                let ITEM_ID = userData.cd_remind.findIndex(item_id => item_id == 'su_quest')
                userData.cd_remind.splice(ITEM_ID, 1)
            }
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
Используйте команду ${mentionCommand(client, 'inventory')}, чтобы получить вашу награду!

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
        } else if (action == `bingo`) {
            const bingo = require(`../../../jsons/SummerBingo.json`)
            if (userData.seasonal.summer.bingo.length <= 0) {
                userData = await createBingoProfile(userData, "summer", bingo);
            }

            const bigMap = await bingo.bingo.map(async (array, i) => {
                let it = 0;
                const mapAsync = array.map(async task => {
                    let item = userData.seasonal.summer.bingo[it].find(it => it.id == task.id);
                    while (!item) {
                        it++;
                        item = userData.seasonal.summer.bingo[it].find(it => it.id == task.id);
                    }
                    const before = item.finished;
                    if (task.type == 'discord') {
                        if (await getProperty(userData, task.code) < item.requirement) item.finished = false
                        else item.finished = true
                    } else if (task.type == 'hypixel') {
                        if (await getProperty(json.player, task.code) < item.requirement) item.finished = false
                        else item.finished = true
                    }

                    if (before !== item.finished) {
                        userData.seasonal.summer.points += 5
                    }

                    return `${item.finished ? "✅" : "❌"}`
                })

                const map = await Promise.all(mapAsync);
                return `\`Р${++i}\` :arrow_right: ${map.join(` `)} :arrow_left: \`Р${i}\``
            })



            const map = await Promise.all(bigMap);

            let rew_arr = userData.seasonal.summer.bingo_rewards;


            let claimRewardsR = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`r1`)
                        .setLabel(`Р1`)
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(rew_arr.includes(`Р1`) ? true : false)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`r2`)
                        .setLabel(`Р2`)
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(rew_arr.includes(`Р2`) ? true : false)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`r3`)
                        .setLabel(`Р3`)
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(rew_arr.includes(`Р3`) ? true : false)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`r4`)
                        .setLabel(`Р4`)
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(rew_arr.includes(`Р4`) ? true : false)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`r5`)
                        .setLabel(`Р5`)
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(rew_arr.includes(`Р5`) ? true : false)
                )
            let claimRewardsS = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`s1`)
                        .setLabel(`С1`)
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(rew_arr.includes(`С1`) ? true : false)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`s2`)
                        .setLabel(`С2`)
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(rew_arr.includes(`С2`) ? true : false)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`s3`)
                        .setLabel(`С3`)
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(rew_arr.includes(`С3`) ? true : false)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`s4`)
                        .setLabel(`С4`)
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(rew_arr.includes(`С4`) ? true : false)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`s5`)
                        .setLabel(`С5`)
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(rew_arr.includes(`С5`) ? true : false)
                )

            let claimRewardsD = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`d1`)
                        .setLabel(`Д1`)
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(rew_arr.includes(`Д1`) ? true : false)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`d2`)
                        .setLabel(`Д2`)
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(rew_arr.includes(`Д2`) ? true : false)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`dev1`)
                        .setLabel(`➖`)
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`dev2`)
                        .setLabel(`➖`)
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`all`)
                        .setLabel(`Итоговая`)
                        .setStyle(ButtonStyle.Success)
                        .setDisabled(rew_arr.includes(`ВСЕ`) ? true : false)
                )


            let TaskProgress = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`su_bingo_progress`)
                        .setLabel(`Прогресс заданий`)
                        .setStyle(ButtonStyle.Primary)
                )
            const file = new AttachmentBuilder()
                .setFile(`./src/assets/Seasonal/SummerBingo.png`)
                .setName(`SummerBingo.png`)
            let embed = new EmbedBuilder()
                .setColor(Number(client.information.bot_color))
                .setImage(`attachment://${file.name}`)
                .setDescription(`## ЛЕТНИЙ БИНГО-МАРАФОН
 \`Д1\` ◾ \`С1\` \`С2\` \`С3\` \`С4\` \`С5\` ◾ \`Д2\`    
 ◾ ↘ ⬇ ⬇ ⬇ ⬇ ⬇ ↙ ◾
 ${map.join(`\n`)}
 ◾ ↗ ⬆ ⬆ ⬆ ⬆ ⬆ ↖ ◾
 \`Д2\` ◾ \`С1\` \`С2\` \`С3\` \`С4\` \`С5\` ◾ \`Д1\`
 
 
**Если у вас имеются неполученные награды, то нажмите на кнопки ниже, чтобы получить их!**`)
                .addFields([
                    {
                        name: `РЯДЫ`,
                        value: `\`Ряд 1\` -> ${rew_arr.includes(`Р1`) ? "✅" : '❌'}
 \`Ряд 2\` -> ${rew_arr.includes(`Р2`) ? "✅" : '❌'}
 \`Ряд 3\` -> ${rew_arr.includes(`Р3`) ? "✅" : '❌'}
 \`Ряд 4\` -> ${rew_arr.includes(`Р4`) ? "✅" : '❌'}
 \`Ряд 5\` -> ${rew_arr.includes(`Р5`) ? "✅" : '❌'}`,
                        inline: true
                    },
                    {
                        name: `СТОЛБЦЫ`,
                        value: `\`Столбец 1\` -> ${rew_arr.includes(`С1`) ? "✅" : '❌'}
 \`Столбец 2\` -> ${rew_arr.includes(`С2`) ? "✅" : '❌'}
 \`Столбец 3\` -> ${rew_arr.includes(`С3`) ? "✅" : '❌'}
 \`Столбец 4\` -> ${rew_arr.includes(`С4`) ? "✅" : '❌'}
 \`Столбец 5\` -> ${rew_arr.includes(`С5`) ? "✅" : '❌'}`,
                        inline: true
                    },
                    {
                        name: `ДИАГОНАЛИ`,
                        value: `\`Диагональ 1\` -> ${rew_arr.includes(`Д1`) ? "✅" : '❌'}
 \`Диагональ 2\` -> ${rew_arr.includes(`Д2`) ? "✅" : '❌'}`,
                        inline: true
                    },

                ])
            const msg = await interaction.reply({
                embeds: [embed],
                files: [file],
                components: [claimRewardsR, claimRewardsS, claimRewardsD, TaskProgress],
                ephemeral: true,
                fetchReply: true
            })


            const collector = await msg.createMessageComponentCollector();
            collector.on('collect', async i => {
                if (i.customId !== 'su_bingo_progress') {
                    let msg_text = ``;
                    switch (i.customId) {
                        case `r1`: {
                            let index = 0
                            if (rew_arr.includes(`Р${index + 1}`)) return i.reply({
                                content: `Вы уже получили данную награду!`,
                                ephemeral: true
                            })

                            let result = []
                            for (let item of bingo.bingo[index]) {
                                let usItem = userData.seasonal.summer.bingo[index].find(it => it.id == item.id);
                                result.push(usItem.finished)
                            }

                            if (result.includes(false)) return i.reply({
                                content: `Вы не завершили все задания в данном ряду!`,
                                ephemeral: true
                            })

                            await AddReward(i.guild, userData, bingo.rewards.r1)
                            userData.seasonal.summer.bingo_rewards.push(`Р1`);
                            msg_text = `Вы успешно получили награду за 1 ряд заданий Бинго-марафона!`
                        }
                            break;
                        case `r2`: {
                            let index = 1
                            if (rew_arr.includes(`Р${index + 1}`)) return i.reply({
                                content: `Вы уже получили данную награду!`,
                                ephemeral: true
                            })
                            let result = []
                            for (let item of bingo.bingo[index]) {
                                let usItem = userData.seasonal.summer.bingo[index].find(it => it.id == item.id);
                                result.push(usItem.finished)
                            }

                            if (result.includes(false)) return i.reply({
                                content: `Вы не завершили все задания в данном ряду!`,
                                ephemeral: true
                            })

                            await AddReward(i.guild, userData, bingo.rewards.r2)
                            userData.seasonal.summer.bingo_rewards.push(`Р2`);
                            msg_text = `Вы успешно получили награду за 2 ряд заданий Бинго-марафона!`
                        }
                            break;
                        case `r3`: {
                            let index = 2
                            if (rew_arr.includes(`Р${index + 1}`)) return i.reply({
                                content: `Вы уже получили данную награду!`,
                                ephemeral: true
                            })
                            let result = []
                            for (let item of bingo.bingo[index]) {
                                let usItem = userData.seasonal.summer.bingo[index].find(it => it.id == item.id);
                                result.push(usItem.finished)
                            }

                            if (result.includes(false)) return i.reply({
                                content: `Вы не завершили все задания в данном ряду!`,
                                ephemeral: true
                            })

                            await AddReward(i.guild, userData, bingo.rewards.r3)
                            userData.seasonal.summer.bingo_rewards.push(`Р3`);
                            msg_text = `Вы успешно получили награду за 3 ряд заданий Бинго-марафона!`
                        }
                            break;
                        case `r4`: {
                            let index = 3
                            if (rew_arr.includes(`Р${index + 1}`)) return i.reply({
                                content: `Вы уже получили данную награду!`,
                                ephemeral: true
                            })
                            let result = []
                            for (let item of bingo.bingo[index]) {
                                let usItem = userData.seasonal.summer.bingo[index].find(it => it.id == item.id);
                                result.push(usItem.finished)
                            }

                            if (result.includes(false)) return i.reply({
                                content: `Вы не завершили все задания в данном ряду!`,
                                ephemeral: true
                            })

                            await AddReward(i.guild, userData, bingo.rewards.r4)
                            userData.seasonal.summer.bingo_rewards.push(`Р4`);
                            msg_text = `Вы успешно получили награду за 4 ряд заданий Бинго-марафона!`
                        }
                            break;
                        case `r5`: {
                            let index = 4
                            if (rew_arr.includes(`Р${index + 1}`)) return i.reply({
                                content: `Вы уже получили данную награду!`,
                                ephemeral: true
                            })
                            let result = []
                            for (let item of bingo.bingo[index]) {
                                let usItem = userData.seasonal.summer.bingo[index].find(it => it.id == item.id);
                                result.push(usItem.finished)
                            }

                            if (result.includes(false)) return i.reply({
                                content: `Вы не завершили все задания в данном ряду!`,
                                ephemeral: true
                            })

                            await AddReward(i.guild, userData, bingo.rewards.r5)
                            userData.seasonal.summer.bingo_rewards.push(`Р5`);
                            msg_text = `Вы успешно получили награду за 5 ряд заданий Бинго-марафона!`
                        }
                            break;
                        case `s1`: {
                            let index = 0
                            if (rew_arr.includes(`С${index + 1}`)) return i.reply({
                                content: `Вы уже получили данную награду!`,
                                ephemeral: true
                            })

                            let result = []
                            let index2 = 0
                            for (let item of bingo.bingo) {
                                let usItem = userData.seasonal.summer.bingo[index2].find(it => it.id == item[index].id)
                                result.push(usItem.finished)
                                index2++
                            }

                            if (result.includes(false)) return i.reply({
                                content: `Вы не завершили все задания в данном стобце!`,
                                ephemeral: true
                            })

                            await AddReward(i.guild, userData, bingo.rewards.s1)
                            userData.seasonal.summer.bingo_rewards.push(`С1`);
                            msg_text = `Вы успешно получили награду за 1 столбец заданий Бинго-марафона!`
                        }
                            break;
                        case `s2`: {
                            let index = 1
                            if (rew_arr.includes(`С${index + 1}`)) return i.reply({
                                content: `Вы уже получили данную награду!`,
                                ephemeral: true
                            })

                            let result = []
                            let index2 = 0
                            for (let item of bingo.bingo) {
                                let usItem = userData.seasonal.summer.bingo[index2].find(it => it.id == item[index].id)
                                result.push(usItem.finished)
                                index2++
                            }

                            if (result.includes(false)) return i.reply({
                                content: `Вы не завершили все задания в данном стобце!`,
                                ephemeral: true
                            })

                            await AddReward(i.guild, userData, bingo.rewards.s2)
                            userData.seasonal.summer.bingo_rewards.push(`С2`);
                            msg_text = `Вы успешно получили награду за 2 столбец заданий Бинго-марафона!`
                        }
                            break;
                        case `s3`: {
                            let index = 2
                            if (rew_arr.includes(`С${index + 1}`)) return i.reply({
                                content: `Вы уже получили данную награду!`,
                                ephemeral: true
                            })

                            let result = []
                            let index2 = 0
                            for (let item of bingo.bingo) {
                                let usItem = userData.seasonal.summer.bingo[index2].find(it => it.id == item[index].id)
                                result.push(usItem.finished)
                                index2++
                            }

                            if (result.includes(false)) return i.reply({
                                content: `Вы не завершили все задания в данном стобце!`,
                                ephemeral: true
                            })

                            await AddReward(i.guild, userData, bingo.rewards.s3)
                            userData.seasonal.summer.bingo_rewards.push(`С3`);
                            msg_text = `Вы успешно получили награду за 3 столбец заданий Бинго-марафона!`
                        }
                            break;
                        case `s4`: {
                            let index = 3
                            if (rew_arr.includes(`С${index + 1}`)) return i.reply({
                                content: `Вы уже получили данную награду!`,
                                ephemeral: true
                            })

                            let result = []
                            let index2 = 0
                            for (let item of bingo.bingo) {
                                let usItem = userData.seasonal.summer.bingo[index2].find(it => it.id == item[index].id)
                                result.push(usItem.finished)
                                index2++
                            }

                            if (result.includes(false)) return i.reply({
                                content: `Вы не завершили все задания в данном стобце!`,
                                ephemeral: true
                            })

                            await AddReward(i.guild, userData, bingo.rewards.s4)
                            userData.seasonal.summer.bingo_rewards.push(`С4`);
                            msg_text = `Вы успешно получили награду за 4 столбец заданий Бинго-марафона!`
                        }
                            break;
                        case `s5`: {
                            let index = 4
                            if (rew_arr.includes(`С${index + 1}`)) return i.reply({
                                content: `Вы уже получили данную награду!`,
                                ephemeral: true
                            })

                            let result = []
                            let index2 = 0
                            for (let item of bingo.bingo) {
                                let usItem = userData.seasonal.summer.bingo[index2].find(it => it.id == item[index].id)
                                result.push(usItem.finished)
                                index2++
                            }

                            if (result.includes(false)) return i.reply({
                                content: `Вы не завершили все задания в данном стобце!`,
                                ephemeral: true
                            })

                            await AddReward(i.guild, userData, bingo.rewards.s5)
                            userData.seasonal.summer.bingo_rewards.push(`С5`);
                            msg_text = `Вы успешно получили награду за 5 столбец заданий Бинго-марафона!`
                        }
                            break;
                        case `d1`: {
                            if (rew_arr.includes(`Д1`)) return i.reply({
                                content: `Вы уже получили данную награду!`,
                                ephemeral: true
                            })

                            let result = []
                            for (let index = 0; index < 5; index++) {
                                let usItem = userData.seasonal.summer.bingo[index].find(it => it.id == bingo.bingo[index][index].id)
                                result.push(usItem.finished)
                            }


                            if (result.includes(false)) return i.reply({
                                content: `Вы не завершили все задания в данной диагонали!`,
                                ephemeral: true
                            })

                            await AddReward(i.guild, userData, bingo.rewards.d1)
                            userData.seasonal.summer.bingo_rewards.push(`Д1`);
                            msg_text = `Вы успешно получили награду за 1 диагональ заданий Бинго-марафона!`
                        }
                            break;
                        case `d2`: {
                            if (rew_arr.includes(`Д2`)) return i.reply({
                                content: `Вы уже получили данную награду!`,
                                ephemeral: true
                            })

                            let result = []
                            for (let index1 = 0, index2 = 4; index1 < 5 && index2 >= 0; index1++, index2--) {
                                let usItem = userData.seasonal.summer.bingo[index1].find(it => it.id == bingo.bingo[index1][index2].id)
                                result.push(usItem.finished)
                            }


                            if (result.includes(false)) return i.reply({
                                content: `Вы не завершили все задания в данной диагонали!`,
                                ephemeral: true
                            })

                            await AddReward(i.guild, userData, bingo.rewards.d2)
                            userData.seasonal.summer.bingo_rewards.push(`Д2`);
                            msg_text = `Вы успешно получили награду за 2 диагональ заданий Бинго-марафона!`
                        }
                            break;
                        case `all`: {
                            if (rew_arr.includes(`ВСЕ`)) return i.reply({
                                content: `Вы уже получили данную награду!`,
                                ephemeral: true
                            })

                            let result = []
                            for (let usItems of userData.seasonal.summer.bingo) {
                                for (let usItem of usItems) {
                                    result.push(usItem.finished)
                                }
                            }

                            if (result.includes(false)) return i.reply({
                                content: `Вы не завершили все задания в Бинго-марафоне!`,
                                ephemeral: true
                            })
                            await AddReward(i.guild, userData, bingo.rewards.all)
                            userData.seasonal.summer.bingo_rewards.push(`ВСЕ`);
                            msg_text = `Вы успешно получили награду за завершение Бинго-марафона!`
                        }
                            break;

                        default:
                            break;
                    }


                    userData.save();
                    rew_arr = userData.seasonal.summer.bingo_rewards;

                    await i.reply({
                        content: msg_text,
                        ephemeral: true
                    })

                    claimRewardsR = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`r1`)
                                .setLabel(`Р1`)
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(rew_arr.includes(`Р1`) ? true : false)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`r2`)
                                .setLabel(`Р2`)
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(rew_arr.includes(`Р2`) ? true : false)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`r3`)
                                .setLabel(`Р3`)
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(rew_arr.includes(`Р3`) ? true : false)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`r4`)
                                .setLabel(`Р4`)
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(rew_arr.includes(`Р4`) ? true : false)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`r5`)
                                .setLabel(`Р5`)
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(rew_arr.includes(`Р5`) ? true : false)
                        )
                    claimRewardsS = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`s1`)
                                .setLabel(`С1`)
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(rew_arr.includes(`С1`) ? true : false)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`s2`)
                                .setLabel(`С2`)
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(rew_arr.includes(`С2`) ? true : false)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`s3`)
                                .setLabel(`С3`)
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(rew_arr.includes(`С3`) ? true : false)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`s4`)
                                .setLabel(`С4`)
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(rew_arr.includes(`С4`) ? true : false)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`s5`)
                                .setLabel(`С5`)
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(rew_arr.includes(`С5`) ? true : false)
                        )

                    claimRewardsD = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`d1`)
                                .setLabel(`Д1`)
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(rew_arr.includes(`Д1`) ? true : false)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`d2`)
                                .setLabel(`Д2`)
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(rew_arr.includes(`Д2`) ? true : false)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`dev1`)
                                .setLabel(`➖`)
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`dev2`)
                                .setLabel(`➖`)
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`all`)
                                .setLabel(`Итоговая`)
                                .setStyle(ButtonStyle.Success)
                                .setDisabled(rew_arr.includes(`ВСЕ`) ? true : false)
                        )

                    embed = new EmbedBuilder()
                        .setColor(Number(client.information.bot_color))
                        .setImage(`attachment://${file.name}`)
                        .setDescription(`## ЛЕТНИЙ БИНГО-МАРАФОН
\`Д1\` ◾ \`С1\` \`С2\` \`С3\` \`С4\` \`С5\` ◾ \`Д2\`    
◾ ↘ ⬇ ⬇ ⬇ ⬇ ⬇ ↙ ◾
${map.join(`\n`)}
◾ ↗ ⬆ ⬆ ⬆ ⬆ ⬆ ↖ ◾
\`Д2\` ◾ \`С1\` \`С2\` \`С3\` \`С4\` \`С5\` ◾ \`Д1\`
 
 
**Если у вас имеются неполученные награды, то нажмите на кнопки ниже, чтобы получить их!**`)
                        .addFields([
                            {
                                name: `РЯДЫ`,
                                value: `\`Ряд 1\` -> ${rew_arr.includes(`Р1`) ? "✅" : '❌'}
\`Ряд 2\` -> ${rew_arr.includes(`Р2`) ? "✅" : '❌'}
\`Ряд 3\` -> ${rew_arr.includes(`Р3`) ? "✅" : '❌'}
\`Ряд 4\` -> ${rew_arr.includes(`Р4`) ? "✅" : '❌'}
\`Ряд 5\` -> ${rew_arr.includes(`Р5`) ? "✅" : '❌'}`,
                                inline: true
                            },
                            {
                                name: `СТОЛБЦЫ`,
                                value: `\`Столбец 1\` -> ${rew_arr.includes(`С1`) ? "✅" : '❌'}
\`Столбец 2\` -> ${rew_arr.includes(`С2`) ? "✅" : '❌'}
\`Столбец 3\` -> ${rew_arr.includes(`С3`) ? "✅" : '❌'}
\`Столбец 4\` -> ${rew_arr.includes(`С4`) ? "✅" : '❌'}
\`Столбец 5\` -> ${rew_arr.includes(`С5`) ? "✅" : '❌'}`,
                                inline: true
                            },
                            {
                                name: `ДИАГОНАЛИ`,
                                value: `\`Диагональ 1\` -> ${rew_arr.includes(`Д1`) ? "✅" : '❌'}
\`Диагональ 2\` -> ${rew_arr.includes(`Д2`) ? "✅" : '❌'}`,
                                inline: true
                            },

                        ])

                    await interaction.editReply({
                        embeds: [embed],
                        files: [file],
                        components: [claimRewardsR, claimRewardsS, claimRewardsD, TaskProgress],
                        fetchReply: true
                    })
                } else if (i.customId == `su_bingo_progress`) {
                    await i.deferReply({ ephemeral: true, fetchReply: true })
                    let a = 0;
                    let qNum = 1;
                    let strings = []
                    for (let itemBig of userData.seasonal.summer.bingo) {
                        for (let itemSmall of itemBig) {
                            let bingoQuest = bingo.bingo[a].find(q => q.id == itemSmall.id)
                            if (!bingoQuest) {
                                const before = a;
                                while (!bingoQuest) {
                                    a++
                                    bingoQuest = bingo.bingo[a].find(q => q.id == itemSmall.id)
                                }
                                a = before;
                            }
                            let left = 0;
                            if (bingoQuest.type == 'discord') {
                                let cur = await getProperty(userData, bingoQuest.code)
                                if (!cur) cur = 0;
                                left = itemSmall.requirement - cur
                            } else if (bingoQuest.type == 'hypixel') {
                                let cur = await getProperty(json.player, bingoQuest.code)
                                if (!cur) cur = 0;
                                left = itemSmall.requirement - cur
                            }

                            if (left < 0) left = 0

                            strings.push(`**${qNum++}.** ${bingoQuest.description}.
- Осталось выполнить: ${left} ${left <= 0 ? `**ЗАДАНИЕ ВЫПОЛНЕНО** ✅` : ``}\n`)
                        }
                        a++
                    }

                    const embed = new EmbedBuilder()
                        .setColor(Number(client.information.bot_color))
                        .setDescription(`## Прогресс заданий летнего Бинго-марафона
                    
${strings.join(`\n`)}`)

                    await i.editReply({
                        embeds: [embed]
                    })
                }
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
        name: `season_summer_quests`
    },
    execute
}
async function AddReward(guild, userData, rewards) {
    const member = await guild.members.fetch(userData.userid);
    switch (rewards.type) {
        case 'role': {
            if (!member.roles.cache.has(rewards.id)) {
                for (let i = 0; i < rewards.amount; i++) {
                    if (i == 0) await member.roles.add(rewards.id)
                    else {
                        userData.stacked_items.push(rewards.id);
                    }
                }
            } else {
                for (let i = 0; i < rewards.amount; i++) {
                    userData.stacked_items.push(rewards.id);
                }
            }

        }
            break;
        case 'static': {
            await changeProperty(userData, rewards.id, await getProperty(userData, rewards.id) + rewards.amount)
            if (rewards.id == `rumbik`) {
                userData.progress.items.find(it => it.name == 'RUMBIKS_TOTAL').total_items += rewards.amount
            } else if (rewards.id == 'tickets') {
                userData.progress.items.find(it => it.name == 'TICKETS_TOTAL').total_items += rewards.amount
            }
        }
            break;
        case 'pack': {
            for (let reward of rewards.items) {
                if (reward.type == 'role') {
                    if (!member.roles.cache.has(reward.id)) {
                        for (let i = 0; i < reward.amount; i++) {
                            if (i == 0) await member.roles.add(reward.id)
                            else {
                                userData.stacked_items.push(reward.id);
                            }
                        }
                    } else {
                        for (let i = 0; i < reward.amount; i++) {
                            userData.stacked_items.push(reward.id);
                        }
                    }
                } else if (reward.type == 'static') {
                    await changeProperty(userData, reward.id, await getProperty(userData, reward.id) + reward.amount)
                    if (reward.id == `rumbik`) {
                        userData.progress.items.find(it => it.name == 'RUMBIKS_TOTAL').total_items += reward.amount
                    } else if (reward.id == 'tickets') {
                        userData.progress.items.find(it => it.name == 'TICKETS_TOTAL').total_items += reward.amount
                    }
                }
            }
        }
            break;

        default:
            break;
    }
}