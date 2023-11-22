const { ContextMenuCommandBuilder, ApplicationCommandType, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, ModalSubmitInteraction, InteractionType, EmbedBuilder, PermissionFlagsBits, ComponentType, SlashCommandBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');

const { User } = require(`../../schemas/userdata`)
const { Guild } = require(`../../schemas/guilddata`)
const { daysOfWeek, isURL, secondPage } = require(`../../functions`);
const { Song, SearchResultType } = require('distube');
const wait = require(`node:timers/promises`).setTimeout
const moment = require(`moment`)
const cron = require(`node-cron`)
const linksInfo = require(`../../discord structure/links.json`)
const ch_list = require(`../../discord structure/channels.json`);

/**
 * 
 * @param {import("discord.js").ChatInputCommandInteraction} interaction Interaction
 * @param {import("../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        const { member, guild, user, options } = interaction
        const guildData = await Guild.findOne({ id: guild.id })
        if (guildData.plugins.moderation === false) return interaction.reply({ content: `Данный плагин отключён! Попробуйте позже!`, ephemeral: true })
        const err = new EmbedBuilder()
            .setAuthor({
                name: `❗ Вы не можете использовать это!`
            })
            .setDescription(`У вас недостаточно прав для использования данной команды!`)
            .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
            .setColor(`DarkRed`)
            .setTimestamp(Date.now())

        switch (options.getSubcommand()) {
            case `setup`: {
                if (!member.roles.cache.has(`563793535250464809`)) return interaction.reply({
                    embeds: [err],
                    ephemeral: true
                })
                const selectMenu = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId(`guild_games_settings`)
                            .setPlaceholder(`Настройка совместных игр`)
                            .addOptions(
                                {
                                    label: `Время проведения`,
                                    value: `gg_time`,
                                    emoji: `1️⃣`,
                                    description: `Настройка времени проведения совместных игр`
                                },
                                {
                                    label: `Дни недели и ведущие`,
                                    value: `gg_days_offs`,
                                    emoji: `2️⃣`,
                                    description: `Настройка дней недели и ведущих по этим дням`
                                },
                                {
                                    label: `Предыгровая песня`,
                                    value: `gg_pregame_song`,
                                    emoji: `3️⃣`,
                                    description: `Изменить предыгровую песню, которая звучит за 10 минут до начала игры`
                                },
                                {
                                    label: `Добавить песню`,
                                    value: `gg_add_song`,
                                    emoji: `4️⃣`,
                                    description: `Добавить песню в плейлист совместной игры`
                                },
                                {
                                    label: `Удалить песню`,
                                    value: `gg_remove_song`,
                                    emoji: `5️⃣`,
                                    description: `Удалить песню из плейлиста совместной игры`
                                },
                                /* {
                                    label: `Тип совместной игры`,
                                    value: `gg_set_type`,
                                    emoji: `6️⃣`,
                                    description: `Установить тип совместной игры`
                                }, */
                                {
                                    label: `Список песен`,
                                    value: `gg_songs`,
                                    emoji: `❓`,
                                    description: `Показать список всех песен на совместной игре`
                                },
                                {
                                    label: `Проверить настройки`,
                                    value: `gg_check`,
                                    emoji: `❓`,
                                    description: `Проверить настройки совместный игр`
                                },
                                {
                                    label: `Сохранить настройки`,
                                    value: `gg_save`,
                                    emoji: `✅`,
                                    description: `Сохранить настройки совместных игр`
                                },

                            )
                    )

                const embed = new EmbedBuilder()
                    .setTitle(`Настройки совместной игры`)
                    .setColor(Number(linksInfo.bot_color))
                    .setDescription(`Настраивайте совместные игры по вашему усмотрению и расписанию!
**1️⃣ Время проведения** Время проведения совместной игры (от XX до YY). __Указывайте время московскому часовому поясу! Вы можете определить московское время, перейдя по этой [ссылке](https://timescanner.pro/compare)__.
**2️⃣ Дни недели и ведущие** Выберите ведущих на определённые дни недели. Помните, что вам нужно выбрать все дни недели, по которым будет проходить совместная игра.
**3️⃣ Предыгровая песня** Песня, которая играет за 10 минут до начала игры. Вы можете отправить ссылку на YouTube, чтобы изменить её.
**4️⃣ Добавить песню** Вы можете добавить в плейлист совместных игр некоторые песни, __введя ссылку на YouTube__.
**5️⃣ Удалить песню** Вы можете удалить из плейлиста некоторые песни, __набрав порядковый номер этой песни__. Найти номер песни можно, если нажать на "Список песен" в меню.

**❓ Список песен** Вы можете посмотреть полный список песен, которые сейчас доступны на совместной игре. Каждая песня добавляется путём достижения 5❤ в канале <#${ch_list.your_music}> или путем добавления песни администратором. 
**❓ Проверить настройки** Вы можете проверить текущие настройки совместной игры, например, время и ведущие.

**✅ Сохранить настройки** После того, как полностью настроите совместные игры, нажмите на эту кнопку. Несмотря на то, что все автоматически сохраняется, если вы не нажмете на эту кнопку, изменения наступят после перезапуска бота.

**Не удаляйте данное сообщение до тех пор, пока не сохраните все изменения! Прошу также обратить внимание на баг с меню: после настройки чего-либо, вы не сможете нажать на этот пункт ещё раз. Для этого просто нажмите на "Список песен" или "Проверить настройки", а затем повторно нажмите на необходимую вам кнопку! (работает только в основном меню настроек)** `)

                await interaction.reply({
                    embeds: [embed],
                    components: [selectMenu],
                    ephemeral: true
                })
            }
                break;
            case `becomeleader`: {
                if (!member.roles.cache.has(`320880176416161802`) && !member.roles.cache.has(`563793535250464809`) && !member.roles.cache.has(`523559726219526184`)) return interaction.reply({
                    embeds: [err],
                    ephemeral: true
                })
                const date = new Date()
                if (!guildData.guildgames.game_days.includes(date.getDay())) return interaction.reply({
                    content: `По расписанию сегодня нет совместной игры! Попросите администратора изменить это в настройках совместной игры!`,
                    ephemeral: true
                })
                guildData.guildgames.temp_leader = member.user.id
                guildData.save()
                await interaction.reply({
                    content: `Вы стали ведущим на сегодняшнюю совместную игру!`,
                    ephemeral: true
                })
            }
                break;
            case `cancel`: {
                if (!member.roles.cache.has(`320880176416161802`) && !member.roles.cache.has(`563793535250464809`) && !member.roles.cache.has(`523559726219526184`)) return interaction.reply({
                    embeds: [err],
                    ephemeral: true
                })
                const date = new Date()
                if (guildData.guildgames.status == `canceled`) return interaction.reply({
                    content: `Совместная игра уже отменена!`,
                    ephemeral: true
                })
                if (guildData.guildgames.status == `ongoing`) return interaction.reply({
                    content: `Совместная игра сейчас идёт! Вы не можете отменить её после начала!`,
                    ephemeral: true
                })
                if (guildData.guildgames.status == `finished`) return interaction.reply({
                    content: `Совместная игра уже закончилась!`,
                    ephemeral: true
                })
                if (!guildData.guildgames.game_days.includes(date.getDay().toLocaleString(`ru-RU`, { timeZone: `Europe/Moscow` }))) return interaction.reply({
                    content: `По расписанию сегодня нет совместной игры! Попросите администратора изменить это в настройках совместной игры!`,
                    ephemeral: true
                })
                guildData.guildgames.status = `canceled`
                guildData.guildgames.canceled += 1
                guildData.save()
                await interaction.reply({
                    content: `Совместная игра была отменена!`,
                    ephemeral: true
                })
            }
                break;
            case `end`: {
                if (!member.roles.cache.has(`320880176416161802`) && !member.roles.cache.has(`563793535250464809`) && !member.roles.cache.has(`523559726219526184`)) return interaction.reply({
                    embeds: [err],
                    ephemeral: true
                })
                const date = new Date()
                /* if (!guildData.guildgames.game_days.includes(date.getDay().toLocaleString(`ru-RU`, { timeZone: `Europe/Moscow` }))) return interaction.reply({
                    content: `По расписанию сегодня нет совместной игры! Попросите администратора изменить это в настройках совместной игры!`,
                    ephemeral: true
                }) */
                if (guildData.guildgames.started == 0 || guildData.guildgames.started == 1) return interaction.reply({
                    content: `Совместная игра ещё не началась! Вы можете прописать эту команду только после начала совместной игры!`,
                    ephemeral: true
                })
                client.GameEnd();
                await interaction.reply({
                    content: `Вы завершили совместную игру!`,
                    ephemeral: true
                })
            }
                break;
            case `start`: {
                if (!member.roles.cache.has(`320880176416161802`) && !member.roles.cache.has(`563793535250464809`) && !member.roles.cache.has(`523559726219526184`)) return interaction.reply({
                    embeds: [err],
                    ephemeral: true
                })
                const date = new Date()
                /* if (!guildData.guildgames.game_days.includes(date.getDay().toLocaleString(`ru-RU`, { timeZone: `Europe/Moscow` }))) return interaction.reply({
                    content: `По расписанию сегодня нет совместной игры! Попросите администратора изменить это в настройках совместной игры!`,
                    ephemeral: true
                }) */
                /* if (guildData.guildgames.started == 2) return interaction.reply({
                    content: `Совместная игра уже началась! Вы можете прописать эту команду только до начала совместной игры!`,
                    ephemeral: true
                }) */
                const gameStart = await cron.getTasks().get(`GuildGameStart`)
                await gameStart.start()
                await client.GuildGameStart()
                await interaction.reply({
                    content: `Вы начали совместную игру!`,
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
**Команда**: \`${interaction.commandName}\`
**Пользователь**: ${interaction.member}
**Канал**: ${interaction.channel}
**Опции**: \`\`\`json
${interaction.options.data.length <= 0 ? `{"status": false}` : options.join(`,\n`)}
\`\`\``)
        await admin.send(`◾`)
    }


}
module.exports = {
    category: `gg`,
    plugin: {
        id: "guildgames",
        name: "Совместные игры"
    },
    data: new SlashCommandBuilder()
        .setName(`gg`)
        .setDescription(`Совместные игры`)
        .setDMPermission(false)
        .addSubcommand(sb => sb
            .setName(`setup`)
            .setDescription(`Настроить совместные игры`)
        )
        .addSubcommand(sb => sb
            .setName(`becomeleader`)
            .setDescription(`Стать ведущим совместной игры на сегодня`)
        )
        .addSubcommand(sb => sb
            .setName(`cancel`)
            .setDescription(`Отменить сегодняшнюю совместную игру`)
        )
        .addSubcommand(sb => sb
            .setName(`start`)
            .setDescription(`Начать совместную игру пораньше`)
        )
        .addSubcommand(sb => sb
            .setName(`end`)
            .setDescription(`Завершить совместную игру пораньше`)
        ),
    execute
}