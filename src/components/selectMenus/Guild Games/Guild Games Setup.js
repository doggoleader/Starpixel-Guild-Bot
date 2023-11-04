const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');
const { Apply } = require(`../../../schemas/applications`)
const linksInfo = require(`../../../discord structure/links.json`);
const ch_list = require(`../../../discord structure/channels.json`);
const { User } = require('../../../schemas/userdata');
const api = process.env.hypixel_apikey
const { tasks } = require(`../../../miscellaneous/New Start.json`);
const fetch = require(`node-fetch`);
const { getProperty, daysOfWeek, secondPage } = require('../../../functions');
const { Guild } = require('../../../schemas/guilddata');
const { SearchResultType } = require('distube');
module.exports = {
    plugin: {
        id: "guildgames",
        name: "Совместные игры"
    },
    data: {
        name: "guild_games_settings"
    },
    async execute(interaction, client) {
        try {
            let a = interaction.values[0]
            const guildData = await Guild.findOne({ id: interaction.guild.id })
            const { guild, member, user } = interaction
            switch (a) {
                case `gg_time`: {
                    const modal = new ModalBuilder()
                        .setCustomId(`gg_time_set`)
                        .setTitle(`Настройка времени`)
                        .addComponents(
                            new ActionRowBuilder()
                                .addComponents(
                                    new TextInputBuilder()
                                        .setCustomId(`gg_start_time`)
                                        .setLabel(`Начало совместной игры (ЧЧ:ММ)`)
                                        .setPlaceholder(`Начало совместной игры по московскому времени в формате ЧЧ:ММ`)
                                        .setRequired(true)
                                        .setStyle(TextInputStyle.Short)
                                )
                        )
                        .addComponents(
                            new ActionRowBuilder()
                                .addComponents(
                                    new TextInputBuilder()
                                        .setCustomId(`gg_end_time`)
                                        .setLabel(`Конец совместной игры (ЧЧ:ММ)`)
                                        .setPlaceholder(`Конец совместной игры по московскому времени в формате ЧЧ:ММ`)
                                        .setRequired(true)
                                        .setStyle(TextInputStyle.Short)
                                )
                        )

                    await interaction.showModal(modal)
                }
                    break;
                case `gg_days_offs`: {
                    const selectMenu = new ActionRowBuilder()
                        .addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId(`gg_set_days`)
                                .setMaxValues(7)
                                .setPlaceholder(`Выберите дни, по которым будет проходить совместная игра`)
                                .setOptions(
                                    {
                                        label: `Понедельник`,
                                        value: `1`,
                                        emoji: `1️⃣`
                                    },
                                    {
                                        label: `Вторник`,
                                        value: `2`,
                                        emoji: `2️⃣`
                                    },
                                    {
                                        label: `Среда`,
                                        value: `3`,
                                        emoji: `3️⃣`
                                    },
                                    {
                                        label: `Четверг`,
                                        value: `4`,
                                        emoji: `4️⃣`
                                    },
                                    {
                                        label: `Пятница`,
                                        value: `5`,
                                        emoji: `5️⃣`
                                    },
                                    {
                                        label: `Суббота`,
                                        value: `6`,
                                        emoji: `6️⃣`
                                    },
                                    {
                                        label: `Воскресенье`,
                                        value: `0`,
                                        emoji: `7️⃣`
                                    }
                                )
                        )
                    const button = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`gg_set_days_removeall`)
                                .setEmoji(`❌`)
                                .setLabel(`Отменить совместные`)
                                .setStyle(ButtonStyle.Danger)
                        )

                    const embed = new EmbedBuilder()
                        .setColor(Number(linksInfo.bot_color))
                        .setTitle(`Настройка дней недели`)
                        .setDescription(`С помощью меню ниже настройте дни недели совместной игры и её ведущих. Чтобы отменить все совместные игры, выберите кнопку \`Отменить совместные\`!`)
                    await interaction.reply({
                        embeds: [embed],
                        components: [selectMenu, button],
                        ephemeral: true
                    })
                }
                    break;
                case `gg_pregame_song`: {
                    const modal = new ModalBuilder()
                        .setCustomId(`gg_pregamesong_set`)
                        .setTitle(`Новая предыгровая песня`)
                        .addComponents(
                            new ActionRowBuilder()
                                .addComponents(
                                    new TextInputBuilder()
                                        .setCustomId(`gg_pregamesong`)
                                        .setLabel(`Ссылка на новую предыгровую песню`)
                                        .setPlaceholder(`Введите ссылку на предыгровую песню`)
                                        .setRequired(true)
                                        .setStyle(TextInputStyle.Short)
                                )
                        )

                    await interaction.showModal(modal)
                }
                    break;
                case `gg_add_song`: {
                    const modal = new ModalBuilder()
                        .setCustomId(`gg_addsong`)
                        .setTitle(`Добавить песню`)
                        .addComponents(
                            new ActionRowBuilder()
                                .addComponents(
                                    new TextInputBuilder()
                                        .setCustomId(`gg_songlink`)
                                        .setLabel(`Ссылка на новую песню`)
                                        .setPlaceholder(`Введите ссылку на песню`)
                                        .setRequired(true)
                                        .setStyle(TextInputStyle.Short)
                                )
                        )

                    await interaction.showModal(modal)
                }
                    break;
                case `gg_remove_song`: {
                    const modal = new ModalBuilder()
                        .setCustomId(`gg_removesong`)
                        .setTitle(`Удалить песню`)
                        .addComponents(
                            new ActionRowBuilder()
                                .addComponents(
                                    new TextInputBuilder()
                                        .setCustomId(`gg_songnumber`)
                                        .setLabel(`Порядковый номер`)
                                        .setPlaceholder(`Введите порядковый номер песни`)
                                        .setRequired(true)
                                        .setMaxLength(4)
                                        .setStyle(TextInputStyle.Short)
                                )
                        )

                    await interaction.showModal(modal)
                }
                    break;
                case `gg_songs`: {
                    let n = 0
                    let listM = guildData.guildgames.music.map(async (mus, i) => {
                        const song = await client.distube.search(mus.link, {
                            limit: 1,
                            type: SearchResultType.VIDEO
                        })
                        return `**${++i}**. [${song[0].name}](${mus.link}), отправил <@${mus.sent}>.`
                    })

                    let list = listM.slice(0 + (n * 10), 10 + (n * 10))
                    let listProm = await Promise.all(list)
                    const totalPages = Math.ceil(listM.length / 10)
                    const embed = new EmbedBuilder()
                        .setTitle(`Список песен в автовоспроизведении`)
                        .setDescription(`Список:
${listProm.join(`\n`)}`)
                        .setColor(Number(linksInfo.bot_color))
                        .setThumbnail(interaction.guild.iconURL())
                        .setFooter({ text: `Страница ${n + 1}/${totalPages}` })
                        .setTimestamp(Date.now())

                    const pages = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`prev`)
                                .setLabel(`Предыдущая`)
                                .setEmoji(`⬅`)
                                .setStyle(ButtonStyle.Danger)
                                .setDisabled(true)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`next`)
                                .setLabel(`Следующая`)
                                .setEmoji(`➡`)
                                .setStyle(ButtonStyle.Success)
                                .setDisabled(secondPage(totalPages))
                        )

                    const msg = await interaction.reply({
                        embeds: [embed],
                        components: [pages],
                        fetchReply: true,
                        ephemeral: true
                    })
                    const collector = msg.createMessageComponentCollector()

                    collector.on('collect', async (int) => {
                        if (interaction.user.id !== int.user.id) return int.reply({
                            content: `Вы не можете использовать эту кнопку!`,
                            ephemeral: true
                        })
                        if (int.customId == `prev`) {
                            n = n - 1
                            if (n <= 0) {
                                pages.components[0].setDisabled(true)
                            } else {
                                pages.components[0].setDisabled(false)
                            }
                            list = listM.slice(0 + (n * 10), 10 + (n * 10))
                            listProm = await Promise.all(list)
                            embed.setDescription(`${listProm.join(`\n`)}`).setFooter({
                                text: `Страница ${n + 1}/${totalPages}`
                            })
                            pages.components[1].setDisabled(false)
                            await int.deferUpdate()
                            await interaction.editReply({
                                embeds: [embed],
                                components: [pages],
                                fetchReply: true
                            })
                        } else if (int.customId == `next`) {
                            n = n + 1
                            if (n >= totalPages - 1) {
                                pages.components[1].setDisabled(true)
                            } else {
                                pages.components[1].setDisabled(false)
                            }
                            list = listM.slice(0 + (n * 10), 10 + (n * 10))
                            listProm = await Promise.all(list)
                            embed.setDescription(`${listProm.join(`\n`)}`).setFooter({
                                text: `Страница ${n + 1}/${totalPages}`
                            })
                            pages.components[0].setDisabled(false)
                            await int.deferUpdate()
                            await interaction.editReply({
                                embeds: [embed],
                                components: [pages],
                                fetchReply: true
                            })
                        }
                    })
                    collector.on('end', async (res) => {
                        pages.components[0].setDisabled(true)
                        pages.components[1].setDisabled(true)
                        await interaction.editReply({
                            embeds: [embed],
                            components: [pages]
                        })
                    })
                }
                    break;
                case `gg_check`: {
                    let i = 1
                    const mapDays = guildData.guildgames.game_days.map(day => {
                        return `${daysOfWeek(Number(day))}`
                    })
                    const offs = guildData.guildgames.officers.sort((a, b) => Number(a.day) - Number(b.day))
                    const offInfo = offs.map(async off => {
                        const memb = await guild.members.fetch(off.id)
                        return `**${i++}.** ${memb} -> ${daysOfWeek(Number(off.day))}. Тип игры: \`${off.type}\``
                    })
                    const promOffs = await Promise.all(offInfo)


                    let min_start
                    let hour_start
                    let min_end
                    let hour_end
                    if (String(guildData.guildgames.gamestart_min).length <= 1) {
                        min_start = `0${guildData.guildgames.gamestart_min}`
                    } else if (String(guildData.guildgames.gamestart_min).length > 1) {
                        min_start = guildData.guildgames.gamestart_min
                    }

                    if (String(guildData.guildgames.gamestart_hour).length <= 1) {
                        hour_start = `0${guildData.guildgames.gamestart_hour}`
                    } else if (String(guildData.guildgames.gamestart_hour).length > 1) {
                        hour_start = guildData.guildgames.gamestart_hour
                    }

                    if (String(guildData.guildgames.gameend_min).length <= 1) {
                        min_end = `0${guildData.guildgames.gameend_min}`
                    } else if (String(guildData.guildgames.gameend_min).length > 1) {
                        min_end = guildData.guildgames.gameend_min
                    }

                    if (String(guildData.guildgames.gameend_hour).length <= 1) {
                        hour_end = `0${guildData.guildgames.gameend_hour}`
                    } else if (String(guildData.guildgames.gameend_hour).length > 1) {
                        hour_end = guildData.guildgames.gameend_hour
                    }
                    const embed = new EmbedBuilder()
                        .setTitle(`Установленные настройки совместных игр`)
                        .setColor(Number(linksInfo.bot_color))
                        .setTimestamp(Date.now())
                        .setDescription(`**Предыгровая песня**: [Нажмите здесь](${guildData.guildgames.pregame_song})
**Начало совместной игры**: \`${hour_start}:${min_start}\` по московскому времени
**Конец совместной игры**: \`${hour_end}:${min_end}\` по московскому времени

**Дни совместной игры**: ${mapDays.length < 1 ? `\`Нет дней недели совместной игры.\`` : mapDays.join(`, `)}

**ВЕДУЩИЕ**
${promOffs.length < 1 ? `\`Нет ведущих совместной игры.\`` : promOffs.join(`\n`)}`)
                    await interaction.reply({
                        embeds: [embed],
                        ephemeral: true
                    })
                }
                    break;

                case `gg_save`: {


                    client.SchedulerGuildGamesRem();
                    client.SchedulerGuildGamesOffs();
                    client.SchedulerGuildGamesStart();

                    await interaction.reply({
                        content: `Настройки совместных игр были сохранены!`,
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
}