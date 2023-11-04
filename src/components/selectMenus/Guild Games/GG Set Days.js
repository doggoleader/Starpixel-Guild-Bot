const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, StringSelectMenuBuilder, EmbedBuilder, UserSelectMenuBuilder } = require('discord.js');
const { Apply } = require(`../../../schemas/applications`)
const linksInfo = require(`../../../discord structure/links.json`);
const ch_list = require(`../../../discord structure/channels.json`);
const { User } = require('../../../schemas/userdata');
const api = process.env.hypixel_apikey
const { tasks } = require(`../../../miscellaneous/New Start.json`);
const fetch = require(`node-fetch`);
const { getProperty, daysOfWeek } = require('../../../functions');
const { Guild } = require('../../../schemas/guilddata');
module.exports = {
    plugin: {
        id: "guildgames",
        name: "Совместные игры"
    },
    data: {
        name: "gg_set_days"
    },
    async execute(interaction, client) {
        try {
            let days = interaction.values
            const guildData = await Guild.findOne({ id: interaction.guild.id })
            const { guild, member, user } = interaction
            guildData.guildgames.game_days = []
            guildData.guildgames.officers = []
            await interaction.reply({
                content: `Идёт настройка дней недели... Сейчас вам будет предоставлена возможность выбрать ведущего на каждый из выбранных вами дней!`,
                ephemeral: true
            })
            for (const day of days) {
                guildData.guildgames.game_days.push(day)
                const userSelect = new ActionRowBuilder()
                    .addComponents(
                        new UserSelectMenuBuilder()
                            .setCustomId(`gg_setoffs`)
                            .setPlaceholder(`Выберите ведущего совместной игры`)
                    )
                const typeSel = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId(`gg_set_type`)
                            .setPlaceholder(`Установить тип совместной игры`)
                            .setMaxValues(1)
                            .setOptions([
                                {
                                    label: "Традиционная",
                                    value: "Традиционная"
                                },
                                {
                                    label: "Прохождение карты",
                                    value: "Прохождение карты"
                                },
                                {
                                    label: "Просмотр фильмов/сериалов",
                                    value: "Просмотр фильмов/сериалов"
                                },
                                {
                                    label: "Викторина",
                                    value: "Викторина"
                                },
                                {
                                    label: "Чат-интерактив",
                                    value: "Чат-интерактив"
                                },
                                {
                                    label: "Прочее событие",
                                    value: "Прочее событие"
                                }
                            ])
                    )
                const saveButt = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`gg_save_button`)
                            .setEmoji('👌')
                            .setLabel("Сохранить")
                            .setStyle(ButtonStyle.Success)
                    )
                const msg = await interaction.followUp({
                    content: `Выбор ведущего на день недели: **${daysOfWeek(Number(day))}**
Вы также можете установить тип совместной на этот день. По умолчанию установлен __традиционный__ тип совместной игры!`,
                    components: [userSelect, typeSel, saveButt],
                    fetchReply: true,
                    ephemeral: true
                })

                const collector = msg.createMessageComponentCollector()
                collector.on('collect', async (i) => {
                    if (i.customId == 'gg_setoffs') {
                        const id = i.values[0]
                        const memberTo = await i.guild.members.fetch(id)
                        if (!memberTo.roles.cache.has(`563793535250464809`) && !memberTo.roles.cache.has(`523559726219526184`)) return i.reply({
                            content: `У ${memberTo} нет роли <@&563793535250464809> и <@&523559726219526184>! Пожалуйста, выберите другого пользователя!`,
                            ephemeral: true
                        })
                        let menu = await guildData.guildgames.officers.find(o => o.day == day)
                        if (menu) {
                            menu.id = id;
                            menu.day = day;
                        } else {
                            guildData.guildgames.officers.push({
                                id: id,
                                day: day
                            })
                        }

                        guildData.save()
                        await i.deferUpdate()
                        try {
                            await memberTo.send({
                                content: `Вы ведёте совместную игру в **${daysOfWeek(Number(day))}**! Если вы не можете провести её, сообщите об этом в соответствующем чате или в личных сообщениях администратору!`
                            })
                        } catch (e) {

                        }
                    } else if (i.customId == 'gg_set_type') {
                        const type = i.values[0]
                        await i.deferReply({ ephemeral: true, fetchReply: true })
                        let menu = await guildData.guildgames.officers.find(o => o.day == day)
                        if (menu) {
                            menu.type = type;
                            menu.day = day;
                        } else {
                            guildData.guildgames.officers.push({
                                type: type,
                                day: day
                            })
                        }
                        guildData.save()
                        await i.editReply({
                            content: `Тип игры \`${type}\` был успешно установлен!`
                        })
                    } else if (i.customId == 'gg_save_button') {
                        await i.reply({
                            content: `Настройки были успешно сохранены!`,
                            ephemeral: true
                        })
                        await collector.stop()
                    }
                })

                collector.on('end', async (e) => {
                    guildData.save()
                })
            }
            guildData.save()
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