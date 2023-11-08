const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder, WebhookClient, PermissionsBitField, PermissionFlagsBits, ChannelType } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const { execute } = require('../../events/client/start_bot/ready');
const fs = require(`fs`)
const fetch = require(`node-fetch`);
const api = process.env.hypixel_apikey;
const { User } = require(`../../schemas/userdata`)
const { Guild } = require(`../../schemas/guilddata`)
const cron = require(`node-cron`)
const chalk = require(`chalk`);
const ch_list = require(`../../discord structure/channels.json`)
const prettyMilliseconds = require(`pretty-ms`); //ДОБАВИТЬ В ДРУГИЕ
const wait = require(`node:timers/promises`).setTimeout
const { gameConstructor, calcActLevel, getLevel, isURL, getRes, getProperty } = require(`../../functions`)
const linksInfo = require(`../../discord structure/links.json`)
const toXLS = require(`json2xls`);
const { Chart } = require(`chart.js`)
const quests = require(`../../jsons/Quests.json`)
const marathon = require(`../../jsons/Marathon.json`)
const kings = require(`../../jsons/New Start.json`)
const veterans = require(`../../jsons/Veterans.json`)
const { isOneEmoji } = require(`is-emojis`);
const { Temp } = require('../../schemas/temp_items');

module.exports = {
    category: `quest`,
    plugin: {
        id: "hypixel",
        name: "Hypixel"
    },
    data: new SlashCommandBuilder()
        .setName(`quests`)
        .setDescription(`Квесты гильдии на Hypixel`)
        .setDMPermission(false)
        .addSubcommand(sb => sb
            .setName(`mars`)
            .setDescription(`Квест Марса`)
            .addStringOption(o => o
                .setName(`действие`)
                .setDescription(`Действие, которое вы хотите сделать`)
                .setRequired(true)
                .addChoices(
                    {
                        name: `Посмотреть информацию`,
                        value: `info`
                    },
                    {
                        name: `Завершить квест`,
                        value: `end`
                    }
                )
            )
        )
        .addSubcommand(sb => sb
            .setName(`marathon`)
            .setDescription(`Марафон гильдии`)
            .addStringOption(o => o
                .setName(`действие`)
                .setDescription(`Действие, которое вы хотите сделать`)
                .setRequired(true)
                .addChoices(
                    {
                        name: `Посмотреть информацию`,
                        value: `info`
                    },
                    {
                        name: `Завершить квест`,
                        value: `end`
                    }
                )
            )
        )
        .addSubcommand(sb => sb
            .setName(`veterans`)
            .setDescription(`Задания для ветеранов`)
            .addStringOption(o => o
                .setName(`действие`)
                .setDescription(`Действие, которое вы хотите сделать`)
                .setRequired(true)
                .addChoices(
                    {
                        name: `Посмотреть информацию`,
                        value: `info`
                    },
                    {
                        name: `Завершить квест`,
                        value: `end`
                    }
                )
            )
        )
        .addSubcommand(sb => sb
            .setName(`kings`)
            .setDescription(`Задания канала "Новое начало"`)
            .addStringOption(o => o
                .setName(`действие`)
                .setDescription(`Действие, которое вы хотите сделать`)
                .setRequired(true)
                .addChoices(
                    {
                        name: `Посмотреть информацию`,
                        value: `info`
                    },
                    {
                        name: `Завершить квест`,
                        value: `end`
                    }
                )
            )
        ),

    async execute(interaction, client) {
        try {
            const { member, user, options, guild } = interaction;
            const userData = await User.findOne({ userid: user.id, guildid: guild.id })
            if (!userData.onlinemode) return interaction.reply({
                content: `Вы не можете использовать данную команду, так как у вас нелицензированный аккаунт!`,
                ephemeral: true
            })
            const response_player = await fetch(`https://api.hypixel.net/player?uuid=${userData.uuid}`, {
                headers: {
                    "API-Key": api,
                    "Content-Type": "application/json"
                }
            })
            const response_guild = await fetch(`https://api.hypixel.net/guild?player=${userData.uuid}`, {
                headers: {
                    "API-Key": api,
                    "Content-Type": "application/json"
                }
            })
            let json_pl
            let json_gu
            if (response_player.ok) {
                json_pl = await response_player.json()
            }
            if (response_guild.ok) {
                json_gu = await response_guild.json()
            }
            switch (options.getSubcommand()) {
                case `mars`: {
                    const action = options.getString(`действие`)
                    const quest = quests.mars.find(q => q.id == userData.quests.mars.activated.id)
                    if (!quest) return interaction.reply({
                        content: `Не удалось найти ваш квест!`,
                        ephemeral: true
                    })
                    const ids = quest.quest_code.split(`.`)
                    if (action == `info`) {
                        if (userData.quests.mars.activated.id !== 2) {
                            let wins = json_pl.player.stats[ids[0]][ids[1]]
                            if (!wins) wins = 0
                            let fin_res
                            if (userData.quests.mars.activated.required - wins <= 0) fin_res = 0
                            else fin_res = userData.quests.mars.activated.required - wins
                            const embed = new EmbedBuilder()
                                .setTitle(`Информация о квесте Марса пользователя ${user.username}`)
                                .setColor(Number(linksInfo.bot_color))
                                .setThumbnail(`https://minotar.net/helm/${userData.uuid}.png`)
                                .setTimestamp(Date.now())
                                .setDescription(`**Основная информация о вашем квесте Марса**

**Название**: ${quest.quest}
**Награда**: ${quest.reward}
**Необходимое количество побед**: ${quest.require}

**Побед в режиме сейчас**: ${wins}
**Побед на конец квеста**: ${userData.quests.mars.activated.required}
**Осталось побед**: ${fin_res}

**Статус**: \`${userData.quests.mars.activated.status ? `✅ Завершён` : `❌ Не завершён`}\``)

                            await interaction.reply({
                                embeds: [embed]
                            })
                        } else if (userData.quests.mars.activated.id == 2) {
                            let expInfo = json_gu.guild.members.find(mem => mem.uuid == userData.uuid)
                            if (!expInfo) return interaction.reply({
                                content: `По какой-то причине вас не удалось найти в гильдии на Hypixel! Пожалуйста, попробуйте ещё раз и, если ошибка повторится, свяжитесь с администрацией гильдии, указав ваш никнейм!`,
                                ephemeral: true
                            })
                            let expF = Object.values(expInfo.expHistory)
                            let exp = 0
                            for (let exps of expF) {
                                exp += exps
                            }
                            let fin_res
                            if (userData.quests.mars.activated.required - exp <= 0) fin_res = 0
                            else fin_res = userData.quests.mars.activated.required - exp
                            const embed = new EmbedBuilder()
                                .setTitle(`Информация о квесте Марса пользователя ${user.username}`)
                                .setColor(Number(linksInfo.bot_color))
                                .setThumbnail(`https://minotar.net/helm/${userData.uuid}.png`)
                                .setTimestamp(Date.now())
                                .setDescription(`**Основная информация о вашем квесте Марса**

**Название**: ${quest.quest}
**Награда**: ${quest.reward}
**Необходимое количество опыта**: ${quest.require}

**Текущее количество опыта**: ${exp}
**Опыта на конец квеста**: ${userData.quests.mars.activated.required}
**Осталось опыта**: ${fin_res}

**Статус**: \`${userData.quests.mars.activated.status ? `✅ Завершён` : `❌ Не завершён`}\``)

                            await interaction.reply({
                                embeds: [embed]
                            })
                        }
                    } else if (action == `end`) {
                        if (userData.quests.mars.activated.id !== 2) {
                            let wins = json_pl.player.stats[ids[0]][ids[1]]
                            if (!wins) wins = 0
                            if (userData.quests.mars.activated.status == true) return interaction.reply({
                                content: `Вы уже выполнили этот квест!`,
                                ephemeral: true
                            })
                            if (wins < userData.quests.mars.activated.required) return interaction.reply({
                                content: `Вы не получили достаточного количества побед для завершения этого квеста! Чтобы получить информацию о квесте, используйте \`/quests mars Посмотреть информацию\`!`,
                                ephemeral: true
                            })

                            if (quest.reward_type == `Role`) {
                                await member.roles.add(quest.reward_code)
                                if (quest.reward_amount > 0) {
                                    const temp = await Temp.findOne({ userid: user.id, guildid: guild.id, roleid: quest.reward_code })
                                    if (!temp) {
                                        const newTemp = new Temp({
                                            guildid: guild.id,
                                            userid: user.id,
                                            roleid: quest.reward_code,
                                            expire: Date.now() + (quest.reward_amount * (userData.perks.temp_items + 1))
                                        })
                                        newTemp.save()
                                    } else if (temp) {
                                        let oldVal = temp.expire.getTime()
                                        temp.expire = oldVal + (quest.reward_amount * (userData.perks.temp_items + 1))
                                        temp.save()
                                    }
                                }
                            } else if (quest.reward_type == `Static`) {
                                let prop = await getProperty(userData, quest.reward_code)
                                if (quest.reward_code == `rumbik`) {
                                    userData.progress.items.find(it => it.name == 'RUMBIKS_TOTAL').total_items += quest.reward_amount
                                }
                                prop += quest.reward_amount
                            }
                            userData.quests.mars.stats.total += 1
                            const embed = new EmbedBuilder()
                                .setTitle(`Квест Марса пользователя ${user.username} выполнен!`)
                                .setColor(Number(linksInfo.bot_color))
                                .setThumbnail(`https://minotar.net/helm/${userData.uuid}.png`)
                                .setTimestamp(Date.now())
                                .setDescription(`**${member} выполнил квест Марса!**

**Название**: ${quest.quest}
**Награда**: ${quest.reward}
**Текущее количество побед**: ${wins}`)
                            userData.save()
                            await interaction.reply({
                                embeds: [embed]
                            })
                        } else if (userData.quests.mars.activated.id == 2) {
                            let expInfo = json_gu.guild.members.find(mem => mem.uuid == userData.uuid)
                            if (userData.quests.mars.activated.status == true) return interaction.reply({
                                content: `Вы уже выполнили этот квест!`,
                                ephemeral: true
                            })
                            if (!expInfo) return interaction.reply({
                                content: `По какой-то причине вас не удалось найти в гильдии на Hypixel! Пожалуйста, попробуйте ещё раз и, если ошибка повторится, свяжитесь с администрацией гильдии, указав ваш никнейм!`,
                                ephemeral: true
                            })
                            let expF = Object.values(expInfo.expHistory)
                            let exp = 0
                            for (let exps of expF) {
                                exp += exps
                            }
                            if (exp < userData.quests.mars.activated.required) return interaction.reply({
                                content: `Вы не получили достаточного количества опыта для завершения этого квеста! Чтобы получить информацию о квесте, используйте \`/quests mars Посмотреть информацию\`!`,
                                ephemeral: true
                            })

                            if (quest.reward_type == `Role`) {
                                await member.roles.add(quest.reward_code)
                                if (quest.reward_amount > 0) {
                                    const temp = await Temp.findOne({ userid: user.id, guildid: guild.id, roleid: quest.reward_code })
                                    if (!temp) {
                                        const newTemp = new Temp({
                                            guildid: guild.id,
                                            userid: user.id,
                                            roleid: quest.reward_code,
                                            expire: Date.now() + (quest.reward_amount * (userData.perks.temp_items + 1))
                                        })
                                        newTemp.save()
                                    } else if (temp) {
                                        let oldVal = temp.expire.getTime()
                                        temp.expire = oldVal + (quest.reward_amount * (userData.perks.temp_items + 1))
                                        temp.save()
                                    }
                                }
                            } else if (quest.reward_type == `Static`) {
                                let prop = await getProperty(userData, quest.reward_code)
                                prop += quest.reward_amount
                            }
                            userData.quests.mars.stats.total += 1
                            const embed = new EmbedBuilder()
                                .setTitle(`Квест Марса пользователя ${user.username} выполнен!`)
                                .setColor(Number(linksInfo.bot_color))
                                .setThumbnail(`https://minotar.net/helm/${userData.uuid}.png`)
                                .setTimestamp(Date.now())
                                .setDescription(`**${member} выполнил квест Марса!**

**Название**: ${quest.quest}
**Награда**: ${quest.reward}
**Текущее количество опыта за неделю**: ${exp}`)
                            userData.save()
                            await interaction.reply({
                                embeds: [embed]
                            })
                        }
                    }

                }
                    break;
                case `marathon`: {
                    const action = options.getString(`действие`)
                    const quest = marathon.ids.find(q => q.id == userData.quests.marathon.activated.id)
                    if (!quest) return interaction.reply({
                        content: `Не удалось найти ваш квест!`,
                        ephemeral: true
                    })
                    const ids = quest.code.split(`.`)
                    if (action == `info`) {
                        let wins = await getProperty(json_pl.player.stats, quest.code)
                        if (!wins) wins = 0
                        let fin_res
                        if (userData.quests.marathon.activated.required - wins <= 0) fin_res = 0
                        else fin_res = userData.quests.marathon.activated.required - wins
                        const embed = new EmbedBuilder()
                            .setTitle(`Информация о марафоне пользователя ${user.username}`)
                            .setColor(Number(linksInfo.bot_color))
                            .setThumbnail(`https://minotar.net/helm/${userData.uuid}.png`)
                            .setTimestamp(Date.now())
                            .setDescription(`**Основная информация о вашем марафоне**

**Игра**: ${quest.game}
**Необходимое количество побед**: ${quest.req}
**Стадия**: ${userData.quests.marathon.activated.stage}

**Побед в режиме сейчас**: ${wins}
**Побед на конец стадии**: ${userData.quests.marathon.activated.required}
**Осталось побед**: ${fin_res}

**Статус**: \`${userData.quests.marathon.activated.status ? `✅ Завершена` : `❌ Не завершена`}\``)

                        await interaction.reply({
                            embeds: [embed]
                        })
                    } else if (action == `end`) {
                        let wins = await getProperty(json_pl.player.stats, quest.code)
                        if (!wins) wins = 0
                        if (userData.quests.marathon.activated.status == true) return interaction.reply({
                            content: `Вы уже выполнили этот квест!`,
                            ephemeral: true
                        })
                        if (wins < userData.quests.marathon.activated.required) return interaction.reply({
                            content: `Вы не получили достаточного количества побед для завершения этого квеста! Чтобы получить информацию о квесте, используйте \`/quests marathon Посмотреть информацию\`!`,
                            ephemeral: true
                        })
                        let stage = userData.quests.marathon.activated.stage
                        let str
                        if (stage == 1) {
                            let reward = `510932601721192458`
                            str = `<@&${reward}>`

                            if (member.roles.cache.has(reward)) {
                                if (userData.stacked_items.length < userData.upgrades.inventory_size) {
                                    await userData.stacked_items.push(reward)
                                } else return interaction.reply({
                                    content: `Мы не можем добавить предмет в ваш инвентарь, так как он переполнен. Чтобы увеличить вместительность своего инвентаря, перейдите в канал <#1141026403765211136>!`,
                                    ephemeral: true
                                })
                            } else {
                                await member.roles.add(reward)
                            }
                        } else if (stage == 2) {
                            let reward = `521248091853291540`
                            str = `<@&${reward}>`

                            if (member.roles.cache.has(reward)) {
                                if (userData.stacked_items.length < userData.upgrades.inventory_size) {
                                    await userData.stacked_items.push(reward)
                                } else return interaction.reply({
                                    content: `Мы не можем добавить предмет в ваш инвентарь, так как он переполнен. Чтобы увеличить вместительность своего инвентаря, перейдите в канал <#1141026403765211136>!`,
                                    ephemeral: true
                                })
                            } else {
                                await member.roles.add(reward)
                            }
                        } else if (stage == 3) {
                            let reward = 50
                            str = `${reward}💠`

                            userData.rank += reward
                        } else if (stage == 4) {
                            let reward = `992820494900412456`
                            str = `<@&${reward}>`

                            if (member.roles.cache.has(reward)) {
                                if (userData.stacked_items.length < userData.upgrades.inventory_size) {
                                    await userData.stacked_items.push(reward)
                                } else return interaction.reply({
                                    content: `Мы не можем добавить предмет в ваш инвентарь, так как он переполнен. Чтобы увеличить вместительность своего инвентаря, перейдите в канал <#1141026403765211136>!`,
                                    ephemeral: true
                                })
                            } else {
                                await member.roles.add(reward)
                            }
                        } else if (stage == 5) {
                            let reward = `730891493375475786`
                            if (member.roles.cache.has(reward)) reward = `584673040470769667`
                            str = `<@&${reward}>`
                            userData.quests.marathon.stats.total_mar += 1
                            if (member.roles.cache.has(reward)) {
                                if (userData.stacked_items.length < userData.upgrades.inventory_size) {
                                    await userData.stacked_items.push(reward)
                                } else return interaction.reply({
                                    content: `Мы не можем добавить предмет в ваш инвентарь, так как он переполнен. Чтобы увеличить вместительность своего инвентаря, перейдите в канал <#1141026403765211136>!`,
                                    ephemeral: true
                                })
                            } else {
                                await member.roles.add(reward)
                            }
                        }
                        userData.quests.marathon.stats.total_stages += 1


                        userData.quests.marathon.completed.push(stage)
                        userData.quests.marathon.activated.status = true
                        userData.save()

                        const embed = new EmbedBuilder()
                            .setTitle(`Стадия ${stage} марафона пользователя ${user.username} была выполнена!`)
                            .setColor(Number(linksInfo.bot_color))
                            .setThumbnail(`https://minotar.net/helm/${userData.uuid}.png`)
                            .setTimestamp(Date.now())
                            .setDescription(`**${member} выполнил ${stage} стадию марафона!**

**Игра**: ${quest.game}
**Награда**: ${str}
**Текущее количество побед**: ${wins}`)
                        await interaction.reply({
                            embeds: [embed]
                        })
                    }

                }
                    break;
                case `veterans`: {
                    const action = options.getString(`действие`)
                    const quest = veterans.veterans.find(q => q.id == userData.quests.veterans.activated.id)
                    if (!quest) return interaction.reply({
                        content: `Не удалось найти ваш квест!`,
                        ephemeral: true
                    })
                    if (action == `info`) {
                        let wins = await getProperty(json_pl.player.stats, quest.code)
                        if (!wins) wins = 0
                        let fin_res
                        if (userData.quests.veterans.activated.required - wins <= 0) fin_res = 0
                        else fin_res = userData.quests.veterans.activated.required - wins
                        const embed = new EmbedBuilder()
                            .setTitle(`Информация о задании пользователя ${user.username}`)
                            .setColor(Number(linksInfo.bot_color))
                            .setThumbnail(`https://minotar.net/helm/${userData.uuid}.png`)
                            .setTimestamp(Date.now())
                            .setDescription(`**Основная информация о вашем задании для ветеранов**

**Задание**: ${quest.name}
**Требование**: ${quest.task}
**Необходимое количество побед**: ${quest.req}

**Побед в режиме сейчас**: ${wins}
**Побед на конец задания**: ${userData.quests.veterans.activated.required}
**Осталось побед**: ${fin_res}

**Статус**: \`${userData.quests.veterans.activated.status ? `✅ Завершено` : `❌ Не завершено`}\``)

                        await interaction.reply({
                            embeds: [embed]
                        })
                    } else if (action == `end`) {
                        let wins = await getProperty(json_pl.player.stats, quest.code)
                        if (!wins) wins = 0
                        if (userData.quests.veterans.activated.status == true) return interaction.reply({
                            content: `Вы уже выполнили это задание!`,
                            ephemeral: true
                        })
                        if (wins < userData.quests.veterans.activated.required) return interaction.reply({
                            content: `Вы не получили достаточного количества побед для завершения этого задания! Чтобы получить информацию о задании, используйте \`/quests veterans Посмотреть информацию\`!`,
                            ephemeral: true
                        })
                        let id = userData.quests.veterans.activated.id
                        if (member.roles.cache.has(quest.reward)) {
                            if (userData.stacked_items.length < userData.upgrades.inventory_size) {
                                await userData.stacked_items.push(quest.reward)
                            } else return interaction.reply({
                                content: `Мы не можем добавить предмет в ваш инвентарь, так как он переполнен. Чтобы увеличить вместительность своего инвентаря, перейдите в канал <#1141026403765211136>!`,
                                ephemeral: true
                            })
                        } else {
                            await member.roles.add(quest.reward)
                        }


                        userData.quests.veterans.stats.total += 1
                        userData.quests.veterans.completed.push(id)
                        userData.quests.veterans.activated.status = true
                        userData.save()

                        const embed = new EmbedBuilder()
                            .setTitle(`Пользователь ${user.username} выполнил задание для ветеранов!`)
                            .setColor(Number(linksInfo.bot_color))
                            .setThumbnail(`https://minotar.net/helm/${userData.uuid}.png`)
                            .setTimestamp(Date.now())
                            .setDescription(`**${member} выполнил задание "${quest.name}"!**

**Игра**: ${quest.game}
**Награда**: <@&${quest.reward}>
**Текущее количество побед**: ${wins}`)
                        await interaction.reply({
                            embeds: [embed]
                        })
                    }

                }
                    break;
                case `kings`: {
                    const action = options.getString(`действие`)
                    if (userData.quests.kings.activated_info.length <= 0) return interaction.reply({
                        content: `Вы не начали выполнять ни одно задание!`,
                        ephemeral: true
                    })

                    if (action == `info`) {
                        let map = userData.quests.kings.activated_info.map(async (info, i) => {
                            let quest = kings.tasks.find(t => t.id == info.id)
                            if (!quest) return `**${++i}.** Квест с ID ${info.id} не найден!`
                            if (quest.id == 1) {
                                let expInfo = json_gu.guild.members.find(mem => mem.uuid == userData.uuid)
                                if (!expInfo) return `**${++i}.** По какой-то причине вас не удалось найти в гильдии на Hypixel! Пожалуйста, попробуйте ещё раз и, если ошибка повторится, свяжитесь с администрацией гильдии, указав ваш никнейм! **Информация о задании**: ID ${info.id}`

                                let expF = Object.values(expInfo.expHistory)
                                let exp = 0
                                for (let exps of expF) {
                                    exp += exps
                                }
                                let final
                                if (info.required - exp <= 0) final = 0
                                else final = info.required - exp
                                return `**${++i}.** ${quest.name} - \`${quest.task}\`
**Необходимо опыта**: ${info.required}
**Набито опыта**: ${exp}
**Осталось опыта**: ${final}
**Статус**: \`${info.status ? `✅ Завершено` : `❌ Не завершено`}\`
`

                            } else {
                                let wins = await getProperty(json_pl.player.stats, quest.code)
                                if (!wins) wins = 0
                                let final
                                if (info.required - wins <= 0) final = 0
                                else final = info.required - wins
                                return `**${++i}.** ${quest.name} - \`${quest.task}\`
**Необходимо побед**: ${info.required}
**Набито побед**: ${wins}
**Осталось побед**: ${final}
**Статус**: \`${info.status ? `✅ Завершено` : `❌ Не завершено`}\`
`
                            }
                        })

                        let mapProm = await Promise.all(map)
                        const embed = new EmbedBuilder()
                            .setColor(Number(linksInfo.bot_color))
                            .setTitle(`Информация задания из "Новое начало"`)
                            .setDescription(`${mapProm.join(`\n`)}`)
                            .setThumbnail(`https://minotar.net/helm/${userData.uuid}.png`)
                            .setTimestamp(Date.now())

                        await interaction.reply({
                            embeds: [embed]
                        })
                    } else if (action == `end`) {
                        let texts = []
                        let i = 0
                        for (let info of userData.quests.kings.activated_info) {
                            //let comp = await userData.quests.kings.completed.find(c => c == info.id)
                            if (info.status == false) {
                                let quest = kings.tasks.find(t => t.id == info.id)
                                if (quest) {
                                    if (quest.id == 1) {
                                        let expInfo = json_gu.guild.members.find(mem => mem.uuid == userData.uuid)
                                        if (!expInfo) texts.push(`**${++i}.** По какой-то причине вас не удалось найти в гильдии на Hypixel! Пожалуйста, попробуйте ещё раз и, если ошибка повторится, свяжитесь с администрацией гильдии, указав ваш никнейм! **Информация о задании**: ID ${info.id}`)
                                        else {
                                            let expF = Object.values(expInfo.expHistory)
                                            let exp = 0
                                            for (let exps of expF) {
                                                exp += exps
                                            }
                                            let final
                                            if (info.required - exp <= 0) final = 0
                                            else final = info.required - exp
                                            if (info.required <= exp) {
                                                userData.quests.kings.stats.total += 1
                                                texts.push(`**${++i}.** \`${quest.task}\` **ВЫПОЛНЕНО!**
**Необходимо опыта**: ${info.required}
**Набито опыта**: ${exp}
`)

                                                if (userData.stacked_items.length < userData.upgrades.inventory_size) {
                                                    await userData.stacked_items.push(reward)
                                                } else return interaction.reply({
                                                    content: `Мы не можем добавить предмет в ваш инвентарь, так как он переполнен. Чтобы увеличить вместительность своего инвентаря, перейдите в канал <#1141026403765211136>!`,
                                                    ephemeral: true
                                                })
                                                info.status = true
                                                userData.quests.kings.completed.push(info.id)
                                            } else {
                                                texts.push(`**${++i}.** \`${quest.task}\` **НЕ ВЫПОЛНЕНО!**
**Необходимо опыта**: ${info.required}
**Набито опыта**: ${exp}
**Осталось опыта**: ${final}
`)
                                            }

                                        }



                                    } else {
                                        let wins = await getProperty(json_pl.player.stats, quest.code)
                                        if (!wins) wins = 0
                                        let final
                                        if (info.required - wins <= 0) final = 0
                                        else final = info.required - wins
                                        if (info.required <= wins) {
                                            userData.quests.kings.stats.total += 1
                                            texts.push(`**${++i}.** \`${quest.task}\` **ВЫПОЛНЕНО!**
**Необходимо побед**: ${info.required}
**Сделано побед**: ${wins}
`)
                                            await member.roles.add(quest.reward)
                                            info.status = true
                                            userData.quests.kings.completed.push(info.id)
                                        } else {
                                            texts.push(`**${++i}.** \`${quest.task}\` **НЕ ВЫПОЛНЕНО!**
**Необходимо побед**: ${info.required}
**Сделано побед**: ${wins}
**Осталось опыта**: ${final}
`)


                                        }
                                    }

                                }
                            }


                        }
                        userData.save()
                        if (texts.length > 0) {
                            const embed = new EmbedBuilder()
                                .setColor(Number(linksInfo.bot_color))
                                .setTitle(`Информация о заданиях из "Новое начало"`)
                                .setDescription(`${member}, информация по вашим заданиям была проверена! Держите:
${texts.join(`\n`)}`)
                                .setThumbnail(`https://minotar.net/helm/${userData.uuid}.png`)
                                .setTimestamp(Date.now())

                            await interaction.reply({
                                embeds: [embed]
                            })
                        } else {
                            const embed = new EmbedBuilder()
                                .setColor(Number(linksInfo.bot_color))
                                .setTitle(`Информация о заданиях из "Новое начало"`)
                                .setDescription(`${member}, вы уже выполнили все задания!`)
                                .setThumbnail(`https://minotar.net/helm/${userData.uuid}.png`)
                                .setTimestamp(Date.now())

                            await interaction.reply({
                                embeds: [embed],
                                ephemeral: true
                            })
                        }


                    }

                }
                    break;

                default:
                    break;
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
**Команда**: \`${interaction.commandName}\`
**Пользователь**: ${interaction.member}
**Канал**: ${interaction.channel}
**Опции**: \`\`\`json
${interaction.options.data.length <= 0 ? `{"status": false}` : options.join(`,\n`)}
\`\`\``)
            await admin.send(`◾`)
        }


    }
};