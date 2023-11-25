const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } = require('discord.js');
const { Apply } = require(`../../../schemas/applications`)
const linksInfo = require(`../../../discord structure/links.json`);
const ch_list = require(`../../../discord structure/channels.json`);
const { User } = require('../../../schemas/userdata');
const api = process.env.hypixel_apikey
const { tasks } = require(`../../../jsons/New Start.json`);
const fetch = require(`node-fetch`);
const { getProperty } = require('../../../functions');
const kings = require(`../../../jsons/New Start.json`);
const { selectTaskNewStart, menuCheckNewStart } = require('../../../misc_functions/Exporter');
/**
 * 
 * @param {import("discord.js").StringSelectMenuInteraction} interaction Interaction
 * @param {import("../../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        await interaction.deferReply({ ephemeral: true, fetchReply: true })
        const { member, user, guild } = interaction;
        const userData = await User.findOne({ userid: user.id, guildid: guild.id })
        await interaction.message.edit({
            components: [selectTaskNewStart, menuCheckNewStart]
        })
        if (!userData.onlinemode) return interaction.editReply({
            content: `Вы не можете использовать данное меню, так как у вас нелицензированный аккаунт!`,
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
        if (userData.quests.kings.activated_info.length <= 0) return interaction.editReply({
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
                .setTitle(`Информация о заданиях из "Новое начало"`)
                .setDescription(`${mapProm.join(`\n`)}`)
                .setThumbnail(`https://minotar.net/helm/${userData.uuid}.png`)
                .setTimestamp(Date.now())

            await interaction.editReply({
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
                                    } else return interaction.editReply({
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
**Осталось побед**: ${final}
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

                await interaction.editReply({
                    embeds: [embed]
                })
            } else {
                const embed = new EmbedBuilder()
                    .setColor(Number(linksInfo.bot_color))
                    .setTitle(`Информация о заданиях из "Новое начало"`)
                    .setDescription(`${member}, вы уже выполнили все задания!`)
                    .setThumbnail(`https://minotar.net/helm/${userData.uuid}.png`)
                    .setTimestamp(Date.now())

                await interaction.editReply({
                    embeds: [embed],
                    ephemeral: true
                })
            }


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

module.exports = {
    plugin: {
        id: "hypixel",
        name: "Hypixel"
    },
    data: {
        name: "newstart_check_menu"
    },
    execute
}