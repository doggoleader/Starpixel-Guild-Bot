const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, StringSelectMenuBuilder } = require('discord.js');
const { Games } = require(`../../../schemas/games`)
const linksInfo = require(`../../../discord structure/links.json`)
const chalk = require(`chalk`)

module.exports = {
    data: {
        name: "mafia_join"
    },
    async execute(interaction, client) {
        try {
            const gameData = await Games.findOne({ messageid: interaction.message.id })
            if (!gameData) return interaction.message.delete()
            let pl = gameData.mafia.players.find(u => u.userid == interaction.user.id)
            if (!pl) return interaction.reply({
                content: `Вы не состоите в игре!`,
                ephemeral: true
            })
            let actionMenu
            if (pl.role == `Мирный житель`) {
                actionMenu = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                        .setCustomId(`mafia_innocent_act`)
                        .setPlaceholder(`Выберите действие`)
                        .addOptions(
                            {
                                label: `Проголосовать против игрока`,
                                value: `vote`
                            }
                        )
                    )
            } else if (pl.role == `Мафия`) {
                actionMenu = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                        .setCustomId(`mafia_mafia_act`)
                        .setPlaceholder(`Выберите действие`)
                        .addOptions(
                            {
                                label: `Убить игрока`,
                                value: `kill`
                            },
                            {
                                label: `Проголосовать против игрока`,
                                value: `vote`
                            }
                        )
                    )
            } else if (pl.role == `Доктор`) {
                actionMenu = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                        .setCustomId(`mafia_healer_act`)
                        .setPlaceholder(`Выберите действие`)
                        .addOptions(
                            {
                                label: `Вылечить игрока`,
                                value: `heal`
                            },
                            {
                                label: `Проголосовать против игрока`,
                                value: `vote`
                            }
                        )
                    )
            } else if (pl.role == `Любовница`) {
                actionMenu = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                        .setCustomId(`mafia_lover_act`)
                        .setPlaceholder(`Выберите действие`)
                        .addOptions(
                            {
                                label: `Переспать с игроком`,
                                value: `sleep`
                            },
                            {
                                label: `Проголосовать против игрока`,
                                value: `vote`
                            }
                        )
                    )
            } else if (pl.role == `Комиссар`) {
                actionMenu = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                        .setCustomId(`mafia_detective_act`)
                        .setPlaceholder(`Выберите действие`)
                        .addOptions(
                            {
                                label: `Проверить игрока`,
                                value: `check`
                            },
                            {
                                label: `Проголосовать против игрока`,
                                value: `vote`
                            }

                        )
                    )
            } else if (pl.role == `Маньяк`) {
                actionMenu = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                        .setCustomId(`mafia_murderer_act`)
                        .setPlaceholder(`Выберите действие`)
                        .addOptions(
                            {
                                label: `Убить игрока`,
                                value: `kill`
                            },
                            {
                                label: `Проголосовать против игрока`,
                                value: `vote`
                            }
                        )
                    )
            } else if (pl.role == `Труп`) {
                actionMenu = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                        .setCustomId(`mafia_dead_act`)
                        .setPlaceholder(`Выберите действие`)
                        .addOptions(
                            {
                                label: `Узнать роли`,
                                value: `get_roles`
                            }
                        )
                    )
            }

            await interaction.reply({
                content: `Меню действий для роли \`${pl.role}\``,
                components: [actionMenu],
                ephemeral: true
            })

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
}
