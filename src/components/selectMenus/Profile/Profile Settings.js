const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');
const { Apply } = require(`../../../schemas/applications`)
const linksInfo = require(`../../../discord structure/links.json`);
const ch_list = require(`../../../discord structure/channels.json`);
const { User } = require('../../../schemas/userdata');
const api = process.env.hypixel_apikey
const { tasks } = require(`../../../jsons/New Start.json`);
const fetch = require(`node-fetch`);
const { getProperty, mentionCommand } = require('../../../functions');
const { Polls } = require('../../../schemas/polls');
/**
 * 
 * @param {import("discord.js").StringSelectMenuInteraction} interaction Interaction
 * @param {import("../../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        const { member, guild, channel, values, user } = interaction
        const userData = await User.findOne({
            userid: user.id
        })
        const backButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`profile_sets_back_1`)
                    .setLabel(`Назад`)
                    .setEmoji(`⬅`)
                    .setStyle(ButtonStyle.Danger)
            )
        const value = values[0]
        switch (value) {
            case `birthday_wishes`: {
                const newValue = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId(`new_value`)
                            .setPlaceholder(`Выберите новое значение настройки`)
                            .setOptions(
                                {
                                    label: `Включить`,
                                    value: `1`,
                                    emoji: `✅`
                                },
                                {
                                    label: `Отключить`,
                                    value: `0`,
                                    emoji: `❌`
                                }
                            )
                    )
                const embed = new EmbedBuilder()
                    .setTitle(`🎂 Поздравления с днём рождения`)
                    .setColor(Number(linksInfo.bot_color))
                    .setDescription(`Устанавливает настройку поздравления бота вас с днём рождения и будет ли бот поздравлять вас в день вашего рождения.
### Примечания
- При отключении вы будете получать подарок на день рождения, однако вы не будете получать роль <@&983441364903665714> и сообщение в чате для поздравлений!`)

                const msg = await interaction.update({
                    embeds: [embed],
                    components: [newValue, backButtons],
                    ephemeral: true
                })

                const collector = msg.createMessageComponentCollector()
                collector.on('collect', async i => {
                    if (i.customId == `new_value`) {
                        const val = Boolean(Number(i.values[0]))
                        userData.pers_settings.birthday_wishes = val
                        userData.save()
                        await i.reply({
                            content: `Установлено значение: \`${val ? `Включено ✅` : `Выключено ❌`}\``,
                            ephemeral: true
                        })
                    } else if (i.customId == `profile_sets_back_1`) {
                        const { embed: emb, selectmenu } = require(`../../../misc_functions/Exporter`)
                        await i.update({
                            embeds: [emb],
                            components: [selectmenu]
                        })
                        collector.stop()
                    }
                })

                collector.on('end', async err => {

                })
            }
                break;
            case `profile_view`: {
                const newValue = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId(`new_value`)
                            .setPlaceholder(`Выберите новое значение настройки`)
                            .setOptions(
                                {
                                    label: `Включить`,
                                    value: `1`,
                                    emoji: `✅`
                                },
                                {
                                    label: `Отключить`,
                                    value: `0`,
                                    emoji: `❌`
                                }
                            )
                    )
                const embed = new EmbedBuilder()
                    .setTitle(`👤 Просмотр профиля другими участниками`)
                    .setColor(Number(linksInfo.bot_color))
                    .setDescription(`Позволяет или запрещает другим пользователям просматривать ваш ${mentionCommand(client, 'profile')}.
### Примечания
- Офицеры и выше по-прежнему смогут просматривать ваш профиль.`)

                const msg = await interaction.update({
                    embeds: [embed],
                    components: [newValue, backButtons],
                    ephemeral: true
                })

                const collector = msg.createMessageComponentCollector()
                collector.on('collect', async i => {
                    if (i.customId == `new_value`) {
                        const val = Boolean(Number(i.values[0]))
                        userData.pers_settings.profile_view = val
                        userData.save()
                        await i.reply({
                            content: `Установлено значение: \`${val ? `Включено ✅` : `Выключено ❌`}\``,
                            ephemeral: true
                        })
                    } else if (i.customId == `profile_sets_back_1`) {
                        const { embed: emb, selectmenu } = require(`../../../misc_functions/Exporter`)
                        await i.update({
                            embeds: [emb],
                            components: [selectmenu]
                        })
                        collector.stop()
                    }
                })

                collector.on('end', async err => {

                })
            }
                break;
            case `marks_view`: {
                const newValue = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId(`new_value`)
                            .setPlaceholder(`Выберите новое значение настройки`)
                            .setOptions(
                                {
                                    label: `Включить`,
                                    value: `1`,
                                    emoji: `✅`
                                },
                                {
                                    label: `Отключить`,
                                    value: `0`,
                                    emoji: `❌`
                                }
                            )
                    )
                const embed = new EmbedBuilder()
                    .setTitle(`🧧 Просмотр значков другими участниками`)
                    .setColor(Number(linksInfo.bot_color))
                    .setDescription(`Позволяет или запрещает другим пользователям просматривать ваш ${mentionCommand(client, 'marks check')}.
### Примечания
- Офицеры и выше по-прежнему смогут просматривать ваши значки.`)

                const msg = await interaction.update({
                    embeds: [embed],
                    components: [newValue, backButtons],
                    ephemeral: true
                })

                const collector = msg.createMessageComponentCollector()
                collector.on('collect', async i => {
                    if (i.customId == `new_value`) {
                        const val = Boolean(Number(i.values[0]))
                        userData.pers_settings.marks_view = val
                        userData.save()
                        await i.reply({
                            content: `Установлено значение: \`${val ? `Включено ✅` : `Выключено ❌`}\``,
                            ephemeral: true
                        })
                    } else if (i.customId == `profile_sets_back_1`) {
                        const { embed: emb, selectmenu } = require(`../../../misc_functions/Exporter`)
                        await i.update({
                            embeds: [emb],
                            components: [selectmenu]
                        })
                        collector.stop()
                    }
                })

                collector.on('end', async err => {

                })
            }
                break;
            case `is_in_leaderboard`: {
                const newValue = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId(`new_value`)
                            .setPlaceholder(`Выберите новое значение настройки`)
                            .setOptions(
                                {
                                    label: `Включить`,
                                    value: `1`,
                                    emoji: `✅`
                                },
                                {
                                    label: `Отключить`,
                                    value: `0`,
                                    emoji: `❌`
                                }
                            )
                    )
                const embed = new EmbedBuilder()
                    .setTitle(`🏅 Отображение в списках лидеров`)
                    .setColor(Number(linksInfo.bot_color))
                    .setDescription(`Изменяет отображение вас в списках лидеров в ${mentionCommand(client, 'leaderboard')}.
### Примечания
- Вы больше не будете отображаться в списках лидеров, а чтобы узнать свою истинную позицию в топах, вы должны отключить данную настройку.
- Не действует на сезонные списки лидеров.`)

                const msg = await interaction.update({
                    embeds: [embed],
                    components: [newValue, backButtons],
                    ephemeral: true
                })

                const collector = msg.createMessageComponentCollector()
                collector.on('collect', async i => {
                    if (i.customId == `new_value`) {
                        const val = Boolean(Number(i.values[0]))
                        userData.pers_settings.is_in_leaderboard = val
                        userData.save()
                        await i.reply({
                            content: `Установлено значение: \`${val ? `Включено ✅` : `Выключено ❌`}\``,
                            ephemeral: true
                        })
                    } else if (i.customId == `profile_sets_back_1`) {
                        const { embed: emb, selectmenu } = require(`../../../misc_functions/Exporter`)
                        await i.update({
                            embeds: [emb],
                            components: [selectmenu]
                        })
                        collector.stop()
                    }
                })

                collector.on('end', async err => {

                })
            }
                break;
            case `view_settings`: {
                let i = 1
                const embed = new EmbedBuilder()
                    .setTitle(`Ваши текущие персональные настройки`)
                    .setColor(Number(linksInfo.bot_color))
                    .setDescription(`**Настройки**:
**${i++}.** 🎂 Поздравления с днём рождения: \`${userData.pers_settings.birthday_wishes ? `Включено` : `Выключено`}\`
**${i++}.** 👤 Просмотр профиля другими участниками: \`${userData.pers_settings.profile_view ? `Включено` : `Выключено`}\`
**${i++}.** 🧧 Просмотр значков другими участниками: \`${userData.pers_settings.marks_view ? `Включено` : `Выключено`}\`
**${i++}.** 🏅 Отображение в списках лидеров: \`${userData.pers_settings.is_in_leaderboard ? `Включено` : `Выключено`}\``)

                await interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                })

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
        id: "items",
        name: "Предметы"
    },
    data: {
        name: "profile_settings"
    },
    execute
}