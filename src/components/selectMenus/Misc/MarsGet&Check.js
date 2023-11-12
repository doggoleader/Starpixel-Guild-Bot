const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } = require('discord.js');
const prettyMilliseconds = require(`pretty-ms`)
const { Temp } = require(`../../../schemas/temp_items`)
const linksInfo = require(`../../../discord structure/links.json`);
const ch_list = require(`../../../discord structure/channels.json`);
const { User } = require('../../../schemas/userdata');
const api = process.env.hypixel_apikey
const { tasks } = require(`../../../jsons/New Start.json`);
const fetch = require(`node-fetch`);
const { getProperty } = require('../../../functions');
const quests = require(`../../../jsons/Quests.json`)

module.exports = {
    plugin: {
        id: "hypixel",
        name: "Hypixel"
    },
    data: {
        name: "mars_check_menu"
    },
    async execute(interaction, client) {
        try {
            await interaction.deferReply({ ephemeral: true, fetchReply: true })
            const { member, user, guild } = interaction;
            const userData = await User.findOne({ userid: user.id, guildid: guild.id })
            if (!userData.onlinemode) return interaction.editReply({
                content: `Вы не можете использовать данное меню, так как у вас нелицензированный аккаунт!`,
                ephemeral: true
            })
            let role = `597746057203548160`
            const no_role = new EmbedBuilder()
                .setAuthor({
                    name: `❗ Отсутствует необходимая роль!`
                })
                .setDescription(`Вы должны иметь роль \`${interaction.guild.roles.cache.get(role).name}\`, чтобы использовать данную команду!`)
                .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                .setColor(`DarkRed`)
                .setTimestamp(Date.now())

            if (!member.roles.cache.has(role)) return interaction.editReply({
                embeds: [no_role],
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

            const action = interaction.values[0];
            if (action == `info`) {

                const quest = quests.mars.find(q => q.id == userData.quests.mars.activated.id)
                if (!quest) return interaction.editReply({
                    content: `Не удалось найти ваш квест!`,
                    ephemeral: true
                })
                const ids = quest.quest_code.split(`.`)
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

                    await interaction.editReply({
                        embeds: [embed]
                    })
                } else if (userData.quests.mars.activated.id == 2) {
                    let expInfo = json_gu.guild.members.find(mem => mem.uuid == userData.uuid)
                    if (!expInfo) return interaction.editReply({
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

                    await interaction.editReply({
                        embeds: [embed]
                    })
                }
            } else if (action == `end`) {


                const quest = quests.mars.find(q => q.id == userData.quests.mars.activated.id)
                if (!quest) return interaction.editReply({
                    content: `Не удалось найти ваш квест!`,
                    ephemeral: true
                })
                const ids = quest.quest_code.split(`.`)
                if (userData.quests.mars.activated.id !== 2) {
                    let wins = json_pl.player.stats[ids[0]][ids[1]]
                    if (!wins) wins = 0
                    if (userData.quests.mars.activated.status == true) return interaction.editReply({
                        content: `Вы уже выполнили этот квест!`,
                        ephemeral: true
                    })
                    if (wins < userData.quests.mars.activated.required) return interaction.editReply({
                        content: `Вы не получили достаточного количества побед для завершения этого квеста! Чтобы получить информацию о квесте, выберите в меню выше кнопку "Посмотреть информацию"!`,
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
                        .setDescription(`**Вы выполнили квест Марса!**

**Название**: ${quest.quest}
**Награда**: ${quest.reward}
**Текущее количество побед**: ${wins}`)
                    userData.save()
                    await interaction.editReply({
                        embeds: [embed]
                    })

                    await interaction.guild.channels.cache.get(ch_list.main)
                        .send({
                            embeds: [embed.setDescription(`**${member} выполнил квест Марса!**

**Название**: ${quest.quest}
**Награда**: ${quest.reward}
**Текущее количество побед**: ${wins}`)]
                        })
                } else if (userData.quests.mars.activated.id == 2) {
                    let expInfo = json_gu.guild.members.find(mem => mem.uuid == userData.uuid)
                    if (userData.quests.mars.activated.status == true) return interaction.editReply({
                        content: `Вы уже выполнили этот квест!`,
                        ephemeral: true
                    })
                    if (!expInfo) return interaction.editReply({
                        content: `По какой-то причине вас не удалось найти в гильдии на Hypixel! Пожалуйста, попробуйте ещё раз и, если ошибка повторится, свяжитесь с администрацией гильдии, указав ваш никнейм!`,
                        ephemeral: true
                    })
                    let expF = Object.values(expInfo.expHistory)
                    let exp = 0
                    for (let exps of expF) {
                        exp += exps
                    }
                    if (exp < userData.quests.mars.activated.required) return interaction.editReply({
                        content: `Вы не получили достаточного количества опыта для завершения этого квеста! Чтобы получить информацию о квесте, выберите в меню выше кнопку "Посмотреть информацию"!`,
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
                        .setDescription(`**Вы выполнили квест Марса!**

**Название**: ${quest.quest}
**Награда**: ${quest.reward}
**Текущее количество опыта за неделю**: ${exp}`)
                    userData.save()
                    await interaction.editReply({
                        embeds: [embed]
                    })

                    await interaction.guild.channels.cache.get(ch_list.main)
                        .send({
                            embeds: [embed.setDescription(`**${member} выполнил квест Марса!**

**Название**: ${quest.quest}
**Награда**: ${quest.reward}
**Текущее количество опыта за неделю**: ${exp}`)]
                        })
                }
            } else if (action == `get`) {

                const cd = new EmbedBuilder()
                    .setColor(Number(linksInfo.bot_color))
                    .setAuthor({
                        name: `Вы не можете использовать эту команду`
                    })
                    .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${prettyMilliseconds(userData.cooldowns.mars - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}!`)

                if (userData.cooldowns.mars > Date.now()) return interaction.editReply({
                    embeds: [cd],
                    ephemeral: true
                })

                const quest = quests.mars[Math.floor(Math.random() * quests.mars.length)]

                const ids = quest.quest_code.split(`.`)
                if (quest.id !== 2) {

                    let gameInfo = json_pl.player.stats[ids[0]][ids[1]]
                    if (!gameInfo) gameInfo = 0
                    userData.quests.mars.activated.status = false
                    userData.quests.mars.activated.id = quest.id
                    userData.quests.mars.activated.required = quest.require + gameInfo

                } else if (quest.id == 2) {

                    let gMember = json_gu.guild.members.find(member => member.uuid == userData.uuid)
                    if (!gMember) return interaction.editReply({
                        content: `По какой-то причине вас не удалось найти в гильдии на Hypixel! Пожалуйста, попробуйте ещё раз и, если ошибка повторится, свяжитесь с администрацией гильдии, указав ваш никнейм!`,
                        ephemeral: true
                    })
                    userData.quests.mars.activated.status = false
                    userData.quests.mars.activated.id = quest.id
                    userData.quests.mars.activated.required = quest.require

                }
                await interaction.editReply({
                    content: `:older_woman: ${user} просит помощи у Марса!

:scroll: Для это ему необходимо пройти испытание:
\`${quest.quest}\`
:crown: В качестве награды он получит ${quest.reward}!
💒 Чтобы посмотреть информацию о вашем текущем квесте или закончить его, в предыдущем меню выберите "Посмотреть информацию"!

Повторно попросить помощь у Марса можно через 2 недели!`,
                    ephemeral: true
                })
                userData.cooldowns.mars = Date.now() + (1000 * 60 * 60 * 24 * 14)
                userData.save()
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
**ID меню**: \`${interaction.customId}\`
**Пользователь**: ${interaction.member}
**Канал**: ${interaction.channel}
**Опции**: \`\`\`json
${interaction.options.data.length <= 0 ? `{"status": false}` : options.join(`,\n`)}
\`\`\``)
            await admin.send(`◾`)
        }


    }
}