const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, RoleSelectMenuBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const fetch = require(`node-fetch`);
const api = process.env.hypixel_apikey;
const { User } = require(`../../schemas/userdata`)
const { Guild } = require(`../../schemas/guilddata`)
const chalk = require(`chalk`);
const ch_list = require(`../../discord structure/channels.json`);
const { getApplicationTemplates, getPluginName } = require('../../functions');
const Nodeactyl = require(`nodeactyl`);

/**
 * 
 * @param {import("discord.js").ChatInputCommandInteraction} interaction Interaction
 * @param {import("../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        const dashboard_allowed = [
            "491343958660874242", //Дмитрий
            "307419742853922816" //Павел
        ]
        const { user, member, guild } = interaction;
        if (!dashboard_allowed.includes(user.id)) return interaction.reply({
            content: `Вы не имеете доступ к панели управления! Для получения к ней доступа вы должны быть вручную добавлены Дмитрием в исходный код бота! Если вы считаете, что это ошибка, обратитесь лично к <@491343958660874242>!`,
            ephemeral: true
        })
        const guildData = await Guild.findOne({ id: guild.id })

        const selectMenu = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId("dashboard")
                    .setPlaceholder("Панель управления")
                    .setOptions([
                        {
                            label: "Управление ботом",
                            description: "Позволяет управлять текущим состоянием бота",
                            value: "bot_management",
                            emoji: "🤖"
                        },
                        {
                            label: "Управление плагинами",
                            description: "Позволяет включать/отключать плагины бота",
                            value: "bot_plugins",
                            emoji: "🛠"
                        },
                        {
                            label: "Управление пользователями",
                            description: "Позволяет управлять пользователями и их ролями",
                            value: "user_management",
                            emoji: "👥"
                        },
                        {
                            label: "Заявки без лицензии",
                            description: "Позволяет изменять режим подачи заявок пользователям без лицензии",
                            value: "no_license_applications",
                            emoji: "✏"
                        },
                        {
                            label: "Управление сезонными мероприятиями",
                            description: "Позволяет включать/отключать сезонные мероприятия гильдии",
                            value: "seasonal_events",
                            emoji: "🎄"
                        },

                    ])
            )

        const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('close_dashboard')
                    .setLabel(`Закрыть панель управления`)
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji(`🔒`)
            )
        let k = 1
        const embed = new EmbedBuilder()
            .setColor(Number(client.information.bot_color))
            .setDescription(`## Панель управления системами Starpixel
            
Данная панель управления создана с целью облегчить администрации гильдии управлять различными системами гильдии.

**Список возможностей**:
${k++}. **Управление ботом.** Позволяет управлять текущим состоянием бота.
${k++}. **Управление плагинами.** Позволяет включать/отключать плагины бота.
${k++}. **Управление пользователями.** Позволяет управлять пользователями и их ролями.
${k++}. **Управление заявками без лицензии.** Позволять изменять режим подачи заявок пользователям без лицензии.
${k++}. **Управление сезонными мероприятиями.** Позволяет включать/отключать сезонные мероприятия гильдии без открытия сезонных каналов.
`)

        const msg = await interaction.reply({
            embeds: [embed],
            components: [selectMenu, button],
            ephemeral: true,
            fetchReply: true
        })

        const collector = await msg.createMessageComponentCollector()

        collector.on('collect', async (i) => {
            const id = i.customId;
            const back_button = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`dashboard_back`)
                        .setLabel(`В главное меню`)
                        .setEmoji(`⬅`)
                        .setStyle(ButtonStyle.Danger)
                )
            switch (id) {
                case 'dashboard': {
                    const value = i.values[0];
                    if (value === `no_license_applications`) {
                        const noLicense = new ActionRowBuilder()
                            .addComponents(
                                new StringSelectMenuBuilder()
                                    .setCustomId(`no_license_applications`)
                                    .setPlaceholder("Заявки аккаунтов без лицензии")
                                    .setOptions([
                                        {
                                            label: 'Открытый доступ',
                                            value: "enabled_everyone"
                                        },
                                        {
                                            label: 'Приглашать могут только участники',
                                            value: "enabled_members"
                                        },
                                        {
                                            label: 'Приглашать может только персонал',
                                            value: "enabled_staff"
                                        },
                                        {
                                            label: 'Закрытый доступ',
                                            value: "disabled"
                                        }
                                    ])
                            )


                        const noLicenseEmbed = new EmbedBuilder().setColor(Number(client.information.bot_color))
                            .setDescription(`## Панель управления системами Starpixel
### Раздел: Управление заявками без лицензии
Позволяет отредактировать возможность вступления участников без лицензии и условия их вступления.

**Доступные опции:**
- \`Открытый доступ\` - Люди без лицензии могут свободно присоединяться к гильдии, пройдя необходимые этапы.
- \`Приглашать могут только участники\` - Люди без лицензии могут вступить в гильдию только по приглашению участников гильдии.
- \`Приглашать может только персонал\` - Люди без лицензии могут вступить в гильдию только по приглашению персонала гильдии.
- \`Закрытый доступ\` - Люди без лицензии не могут вступить в гильдию.
`)


                        await interaction.editReply({
                            embeds: [noLicenseEmbed],
                            components: [noLicense, back_button],
                            fetchReply: true
                        })

                        await i.reply({
                            content: `Открыто меню "Управление заявками без лицензии"!`,
                            ephemeral: true
                        })
                    } else if (value == `bot_plugins`) {
                        let p = guildData.plugins
                        let j = 1;
                        const botPluginsEmbed = new EmbedBuilder()
                            .setColor(Number(client.information.bot_color))
                            .setDescription(`## Панель управления системами Starpixel
### Раздел: Управление плагинами
Позволяет включать/отключать плагины, обеспечивающие жизнедеятельность бота гильдии.
    
**Список плагинов**
- **${j++}.** Предметы \`${p.items ? "Включено ✅" : "Отключено ❌"}\`
- **${j++}.** Никнеймы \`${p.nicknames ? "Включено ✅" : "Отключено ❌"}\`
- **${j++}.** Дни рождения \`${p.birthday ? "Включено ✅" : "Отключено ❌"}\`
- **${j++}.** Новые пользователи \`${p.new_users ? "Включено ✅" : "Отключено ❌"}\`
- **${j++}.** Служба поддержки \`${p.tickets ? "Включено ✅" : "Отключено ❌"}\`
- **${j++}.** Журнал аудита \`${p.logs ? "Включено ✅" : "Отключено ❌"}\`
- **${j++}.** Hypixel \`${p.hypixel ? "Включено ✅" : "Отключено ❌"}\`
- **${j++}.** Музыка \`${p.music ? "Включено ✅" : "Отключено ❌"}\`
- **${j++}.** Совместные игры \`${p.guildgames ? "Включено ✅" : "Отключено ❌"}\`
- **${j++}.** Каналы \`${p.channels ? "Включено ✅" : "Отключено ❌"}\`
- **${j++}.** Сезонное \`${p.seasonal ? "Включено ✅" : "Отключено ❌"}\`
- **${j++}.** Административное \`${p.admin ? "Включено ✅" : "Отключено ❌"}\` **НЕВОЗМОЖНО ОТКЛЮЧИТЬ**
- **${j++}.** Разное \`${p.misc ? "Включено ✅" : "Отключено ❌"}\`
    
Чтобы отредактировать плагин, выберите нужный плагин в списке ниже. При выборе автоматически ставится противоположное значение.`)

                        const editPlugin = new ActionRowBuilder()
                            .addComponents(
                                new StringSelectMenuBuilder()
                                    .setCustomId('edit_plugin')
                                    .setPlaceholder(`Выберите плагин`)
                                    .setOptions([
                                        {
                                            label: "Предметы",
                                            value: "items"
                                        },
                                        {
                                            label: "Никнеймы",
                                            value: "nicknames"
                                        },
                                        {
                                            label: "Дни рождения",
                                            value: "birthday"
                                        },
                                        {
                                            label: "Новые пользователи",
                                            value: "new_users"
                                        },
                                        {
                                            label: "Служба поддержки",
                                            value: "tickets"
                                        },
                                        {
                                            label: "Журнал аудита",
                                            value: "logs"
                                        },
                                        {
                                            label: "Hypixel",
                                            value: "hypixel"
                                        },
                                        {
                                            label: "Музыка",
                                            value: "music"
                                        },
                                        {
                                            label: "Совместные игры",
                                            value: "guildgames"
                                        },
                                        {
                                            label: "Каналы",
                                            value: "channels"
                                        },
                                        {
                                            label: "Сезонное",
                                            value: "seasonal"
                                        },
                                        {
                                            label: "Разное",
                                            value: "misc"
                                        }
                                    ])
                            )


                        await interaction.editReply({
                            embeds: [botPluginsEmbed],
                            components: [editPlugin, back_button],
                            fetchReply: true
                        })
                        await i.reply({
                            content: `Открыто меню "Управление плагинами"!`,
                            ephemeral: true
                        })
                    } else if (value == `seasonal_events`) {
                        const embed = new EmbedBuilder()
                            .setColor(Number(client.information.bot_color))
                            .setDescription(`## Панель управления системами Starpixel
### Раздел: Управление сезонными мероприятиями
Позволяет включать/отключать сезонные мероприятия в гильдии (без открытия каналов)

Выберите, какой сезон хотите включить/отключить:
- 🎄 Новый год (плановая дата: \`1 декабря - 18 января\`) ${guildData.seasonal.new_year.enabled ? `**СЕЗОН АКТИВЕН ✅**` : `**СЕЗОН НЕАКТИВЕН ❌**`}
- 🥚 Пасха (плановая дата: \`1 апреля - 10 мая\`) ${guildData.seasonal.easter.enabled ? `**СЕЗОН АКТИВЕН ✅**` : `**СЕЗОН НЕАКТИВЕН ❌**`}
- ⚽ Лето (плановая дата: \`1 июня - 31 августа\`) ${guildData.seasonal.summer.enabled ? `**СЕЗОН АКТИВЕН ✅**` : `**СЕЗОН НЕАКТИВЕН ❌**`}
- 🎃 Хэллоуин (плановая дата: \`7 октября - 7 ноября\`) ${guildData.seasonal.halloween.enabled ? `**СЕЗОН АКТИВЕН ✅**` : `**СЕЗОН НЕАКТИВЕН ❌**`}`)

                        let select = new ActionRowBuilder()
                            .addComponents(
                                new StringSelectMenuBuilder()
                                    .setCustomId(`toggle_season`)
                                    .setPlaceholder(`Выберите сезон, который хотите ВКЛ/ВЫКЛ.`)
                                    .setOptions([
                                        {
                                            label: `Новый год`,
                                            value: `new_year`,
                                            emoji: `🎄`
                                        },
                                        {
                                            label: `Пасха`,
                                            value: `easter`,
                                            emoji: `🥚`
                                        },
                                        {
                                            label: `Лето`,
                                            value: `summer`,
                                            emoji: `⚽`
                                        },
                                        {
                                            label: `Хэллоуин`,
                                            value: `halloween`,
                                            emoji: `🎃`
                                        }
                                    ])
                            )


                        await interaction.editReply({
                            embeds: [embed],
                            components: [select, back_button],
                            fetchReply: true
                        })
                        await i.reply({
                            content: `Открыто меню "Управление сезонными мероприятиями"!`,
                            ephemeral: true
                        })
                    } else if (value == 'bot_management') {
                        const embed = new EmbedBuilder()
                            .setColor(Number(client.information.bot_color))
                            .setDescription(`## Панель управления системами Starpixel
### Раздел: Управление ботом
Позволяет управлять текущим состоянием бота

Выберите, какое действие вы хотите воспроизвести:
- **Отключить бота.** Полное отключение бота без возможности управления им с помощью команд. Для дальнейшего включения необходимо включить его на сайте хостинга.
- **Перезапустить бота.** Отключение бота с последующим включением его обратно. Перезапуск обычно занимает от 1 до 5 минут.
- **Запуск всех функций.** Запускает все функции, которые работают периодично (раз в 10 минут/час/день).

**Помните, что каждая из этих функций может повлиять на правильную работу бота, поэтому используйте на свой страх и риск!**`)

                        let select = new ActionRowBuilder()
                            .addComponents(
                                new StringSelectMenuBuilder()
                                    .setCustomId(`management_action`)
                                    .setPlaceholder(`Выберите, какое действие вы хотите воспроизвести.`)
                                    .setOptions([
                                        {
                                            label: `Отключить бота`,
                                            value: `disable_bot`
                                        },
                                        {
                                            label: `Перезапустить бота`,
                                            value: `restart_bot`
                                        },
                                        {
                                            label: `Запуск всех функций`,
                                            value: `start_functions`
                                        }
                                    ])
                            )


                        await interaction.editReply({
                            embeds: [embed],
                            components: [select, back_button],
                            fetchReply: true
                        })
                        await i.reply({
                            content: `Открыто меню "Управление ботом"!`,
                            ephemeral: true
                        })
                    } else if (value == `user_management`) {
                        const embed = new EmbedBuilder()
                            .setColor(Number(client.information.bot_color))
                            .setDescription(`## Панель управления системами Starpixel
### Раздел: Управление пользователями
Позволяет управлять пользователями и их ролями

Выберите, какое действие вы хотите воспроизвести:
- **Выдать всем роль.** Используйте, чтобы выдать всем пользователям какую-либо роль. __Нельзя выдавать роли персонала! Если у пользователя уже имеется эта роль, дубликат роли выдан не будет!__`)

                        let select = new ActionRowBuilder()
                            .addComponents(
                                new StringSelectMenuBuilder()
                                    .setCustomId(`users_action`)
                                    .setPlaceholder(`Выберите, какое действие вы хотите воспроизвести.`)
                                    .setOptions([
                                        {
                                            label: `Выдать всем роль`,
                                            value: `give_all`
                                        }
                                    ])
                            )


                        await interaction.editReply({
                            embeds: [embed],
                            components: [select, back_button],
                            fetchReply: true
                        })
                        await i.reply({
                            content: `Открыто меню "Управление пользователями"!`,
                            ephemeral: true
                        })
                    }
                }
                    break;
                case `users_action`: {
                    if (i.values[0] == 'give_all') {
                        const chooseRole = new ActionRowBuilder()
                            .addComponents(
                                new RoleSelectMenuBuilder()
                                    .setCustomId('users_action_addrole')
                                    .setPlaceholder(`Выберите роль, которую хотите выдать всем`)
                            )

                        const embed = new EmbedBuilder()
                            .setColor(Number(client.information.bot_color))
                            .setDescription(`## Панель управления системами Starpixel
### Раздел: Управление пользователями
**Функция "Выдать всем роль"**

Выберите в меню ниже роль, которую хотите выдать всем участникам гильдии.`)

                        await interaction.editReply({
                            embeds: [embed],
                            components: [chooseRole, back_button],
                            fetchReply: true
                        })
                        await i.reply({
                            content: `Открыто меню "Управление пользователями"!`,
                            ephemeral: true
                        })
                    }
                }
                case `users_action_addrole`: {
                    await i.deferReply({ fetchReply: true, ephemeral: true })
                    const userDatas = await User.find();
                    let blockedRoles = [
                        "567689925143822346",
                        "883617976790700032",
                        "883617966174896139",
                        "320880176416161802",
                        "563793535250464809",
                        "1133850341285298237",
                        "1059732744218882088",
                        "510355226893615104",
                        "1071833294502645841",
                        "523559726219526184",
                        "1017131191771615243"
                    ]
                    const role = await guild.roles.fetch(i.values[0])
                    if (blockedRoles.includes(role.id)) return i.editReply({
                        content: `Вы не можете выдать эту роль всем участникам гильдии!`,
                        ephemeral: true
                    })
                    for (const userData of userDatas) {
                        const member = await guild.members.fetch(userData.userid)
                        await member.roles.add(role.id).catch()
                    }


                    const chooseRole = new ActionRowBuilder()
                        .addComponents(
                            new RoleSelectMenuBuilder()
                                .setCustomId('users_action_addrole')
                                .setPlaceholder(`Выберите роль, которую хотите выдать всем`)
                        )

                    const embed = new EmbedBuilder()
                        .setColor(Number(client.information.bot_color))
                        .setDescription(`## Панель управления системами Starpixel
### Раздел: Управление пользователями
**Функция "Выдать всем роль"**

Выберите в меню ниже роль, которую хотите выдать всем участникам гильдии.`)

                    await interaction.editReply({
                        embeds: [embed],
                        components: [chooseRole, back_button],
                        fetchReply: true
                    })


                    await i.editReply({
                        content: `Роль ${role} была успешно выдана всем участникам гильдии!`
                    })
                }
                    break;
                case `management_action`: {
                    let value = i.values[0]

                    if (value == `disable_bot`) {
                        const nodeactyl = new Nodeactyl.NodeactylClient("https://dash.dscrd.ru", process.env.host);
                        await i.reply({
                            content: `Бот останавливается...`,
                            ephemeral: true
                        })
                        await interaction.deleteReply()
                        await nodeactyl.stopServer("fa48d9d8")
                    } else if (value == `restart_bot`) {
                        const nodeactyl = new Nodeactyl.NodeactylClient("https://dash.dscrd.ru", process.env.host);
                        await i.reply({
                            content: `Бот перезапускается...`,
                            ephemeral: true
                        })
                        await interaction.deleteReply()
                        await nodeactyl.restartServer("fa48d9d8")
                    } else if (value == `start_functions`) {
                        client.GEXP_PROFILES(); //Ежедневное обновление профилей участников гильдии (GEXP)
                        client.AdventCalendar(); //Адвент календарь
                        //Items
                        client.rank_update(); //Обновление рангов
                        client.updatenicks(); //Изменение никнеймов Discord
                        //Profiles
                        client.AutoElements(); //Автовыдача стихий
                        client.AutoStars(); //Автовыдача звезд
                        client.checkSubscription(); //Проверка на наличие подписки
                        //Seasonal
                        client.halloweenRewards(); //Выдача хэллоуинских наград (Если сезон активен)
                        client.NewYearRewards(); //Выдача новогодних наград (Если сезон активен)
                        client.EasterRewards(); //Выдача пасхальных наград (Если сезон активен)
                        client.SummerRewards(); //Выдача летних наград (Если сезон активен)
                        //Storages
                        client.statsChannel(); //Обновление каналов со статистикой
                        client.temp_roles(); //Уборка временных ролей
                        client.AutoMythical(); //Выдача Солнца
                        client.Discounts(); //Обновление скидок в профилях
                        client.Boosters(); //Обновление множителей в профилях
                        client.UpdateNicknames(); //Обновление никнеймов в базе данных
                        client.birthdayChannel(); //Обновление канала с днями рождения
                        client.update_members(); //Обновление каналов с участниками
                        client.removeNonPremiumColors(); //Уборка цветов у участников без VIP
                        client.emojiUpdate(); //Обновление эмоджи
                        client.wish_birthday(); //Поздравление с днем рождения
                        client.InGuildRewards(); //Выдача наград за время в гильдии
                        client.StopPolls(); //Остановка опроса

                        await i.reply({
                            content: `Успешно запущены все функции бота!`,
                            ephemeral: true
                        })
                    }
                }
                    break;
                case `toggle_season`: {

                    guildData.seasonal[i.values[0]].enabled = !guildData.seasonal[i.values[0]].enabled
                    guildData.save()

                    const embed = new EmbedBuilder()
                        .setColor(Number(client.information.bot_color))
                        .setDescription(`## Панель управления системами Starpixel
### Раздел: Управление сезонными мероприятиями
Позволяет включать/отключать сезонные мероприятия в гильдии (без открытия каналов)

Выберите, какой сезон хотите включить/отключить:
- 🎄 Новый год (плановая дата: \`1 декабря - 18 января\`) ${guildData.seasonal.new_year.enabled ? `**СЕЗОН АКТИВЕН ✅**` : `**СЕЗОН НЕАКТИВЕН ❌**`}
- 🥚 Пасха (плановая дата: \`1 апреля - 10 мая\`) ${guildData.seasonal.easter.enabled ? `**СЕЗОН АКТИВЕН ✅**` : `**СЕЗОН НЕАКТИВЕН ❌**`}
- ⚽ Лето (плановая дата: \`1 июня - 31 августа\`) ${guildData.seasonal.summer.enabled ? `**СЕЗОН АКТИВЕН ✅**` : `**СЕЗОН НЕАКТИВЕН ❌**`}
- 🎃 Хэллоуин (плановая дата: \`7 октября - 7 ноября\`) ${guildData.seasonal.halloween.enabled ? `**СЕЗОН АКТИВЕН ✅**` : `**СЕЗОН НЕАКТИВЕН ❌**`}`)

                    let select = new ActionRowBuilder()
                        .addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId(`toggle_season`)
                                .setPlaceholder(`Выберите сезон, который хотите ВКЛ/ВЫКЛ.`)
                                .setOptions([
                                    {
                                        label: `Новый год`,
                                        value: `new_year`,
                                        emoji: `🎄`
                                    },
                                    {
                                        label: `Пасха`,
                                        value: `easter`,
                                        emoji: `🥚`
                                    },
                                    {
                                        label: `Лето`,
                                        value: `summer`,
                                        emoji: `⚽`
                                    },
                                    {
                                        label: `Хэллоуин`,
                                        value: `halloween`,
                                        emoji: `🎃`
                                    }
                                ])
                        )


                    let seasons = {
                        new_year: "🎄 Новый год",
                        easter: "🥚 Пасха",
                        summer: "⚽ Лето",
                        halloween: "🎃 Хэллоуин"
                    }
                    await interaction.editReply({
                        embeds: [embed],
                        components: [select, back_button],
                        fetchReply: true
                    })
                    await i.reply({
                        content: `Сезон "${seasons[i.values[0]]}" был успешно ${guildData.seasonal[i.values[0]].enabled ? `**АКТИВИРОВАН**` : `**ОТКЛЮЧЁН**`}!
:exclamation: Обратите внимение, что сезонные каналы **не были ${guildData.seasonal[i.values[0]].enabled ? `открыты` : `закрыты`}**! Если необходимо, ${guildData.seasonal[i.values[0]].enabled ? `откройте` : `закройте`} их вручную!`,
                        ephemeral: true
                    })
                }
                    break;
                case `close_dashboard`: {
                    await i.deferUpdate();
                    await interaction.deleteReply();
                    await collector.stop()
                }
                    break;
                case `dashboard_back`: {
                    await interaction.editReply({
                        embeds: [embed],
                        components: [selectMenu, button],
                        fetchReply: true
                    })
                    await i.reply({
                        content: `Вы вернулись в главное меню панели управления`,
                        ephemeral: true
                    })
                }
                    break;
                case `no_license_applications`: {
                    const v = i.values[0];
                    guildData.global_settings.no_license_applications = v;
                    guildData.save()
                    const appChannel = await guild.channels.fetch(ch_list.application)
                    const msg1 = await appChannel.messages.fetch(`1162100209518653641`)
                    const msg2 = await appChannel.messages.fetch(`1162100211318018088`)
                    const items = getApplicationTemplates(client)
                    if (v == `enabled_everyone`) {
                        let it = items[0]
                        await msg1.edit({
                            embeds: [it[0]]
                        })
                        await msg2.edit({
                            embeds: [it[1]],
                            components: [it[2], it[3], it[4]]
                        })
                        await i.reply({
                            content: `Установлен следующий режим подачи заявок для пользователей без лицензионного аккаунта: \`Открытый доступ\``,
                            ephemeral: true
                        })
                    } else if (v == `enabled_members`) {
                        let it = items[2]
                        await msg1.edit({
                            embeds: [it[0]]
                        })
                        await msg2.edit({
                            embeds: [it[1]],
                            components: [it[2], it[3], it[4]]
                        })
                        await i.reply({
                            content: `Установлен следующий режим подачи заявок для пользователей без лицензионного аккаунта: \`Приглашать могут только участники\``,
                            ephemeral: true
                        })
                    } else if (v == `enabled_staff`) {
                        let it = items[1]
                        await msg1.edit({
                            embeds: [it[0]]
                        })
                        await msg2.edit({
                            embeds: [it[1]],
                            components: [it[2], it[3], it[4]]
                        })
                        await i.reply({
                            content: `Установлен следующий режим подачи заявок для пользователей без лицензионного аккаунта: \`Приглашать может только персонал\``,
                            ephemeral: true
                        })
                    } else if (v == `disabled`) {
                        let it = items[0]
                        await msg1.edit({
                            embeds: [it[0]]
                        })
                        await msg2.edit({
                            embeds: [it[1]],
                            components: [it[2], it[3], it[4]]
                        })
                        await i.reply({
                            content: `Установлен следующий режим подачи заявок для пользователей без лицензионного аккаунта: \`Закрытый доступ\``,
                            ephemeral: true
                        })
                    }
                }
                    break;

                case "edit_plugin": {
                    const value = i.values[0]
                    guildData.plugins[value] = !guildData.plugins[value]
                    guildData.save()
                    let p = guildData.plugins
                    let j = 1;
                    const botPluginsEmbed = new EmbedBuilder()
                        .setColor(Number(client.information.bot_color))
                        .setDescription(`## Панель управления системами Starpixel
### Раздел: Управление плагинами
Позволяет включать/отключать плагины, обеспечивающие жизнедеятельность бота гильдии.
    
**Список плагинов**
- **${j++}.** Предметы \`${p.items ? "Включено ✅" : "Отключено ❌"}\`
- **${j++}.** Никнеймы \`${p.nicknames ? "Включено ✅" : "Отключено ❌"}\`
- **${j++}.** Дни рождения \`${p.birthday ? "Включено ✅" : "Отключено ❌"}\`
- **${j++}.** Новые пользователи \`${p.new_users ? "Включено ✅" : "Отключено ❌"}\`
- **${j++}.** Служба поддержки \`${p.tickets ? "Включено ✅" : "Отключено ❌"}\`
- **${j++}.** Журнал аудита \`${p.logs ? "Включено ✅" : "Отключено ❌"}\`
- **${j++}.** Hypixel \`${p.hypixel ? "Включено ✅" : "Отключено ❌"}\`
- **${j++}.** Музыка \`${p.music ? "Включено ✅" : "Отключено ❌"}\`
- **${j++}.** Совместные игры \`${p.guildgames ? "Включено ✅" : "Отключено ❌"}\`
- **${j++}.** Каналы \`${p.channels ? "Включено ✅" : "Отключено ❌"}\`
- **${j++}.** Сезонное \`${p.seasonal ? "Включено ✅" : "Отключено ❌"}\`
- **${j++}.** Административное \`${p.admin ? "Включено ✅" : "Отключено ❌"}\` **НЕВОЗМОЖНО ОТКЛЮЧИТЬ**
- **${j++}.** Разное \`${p.misc ? "Включено ✅" : "Отключено ❌"}\`
    
Чтобы отредактировать плагин, выберите нужный плагин в списке ниже. При выборе автоматически ставится противоположное значение.`)
                    const editPlugin = new ActionRowBuilder()
                        .addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId('edit_plugin')
                                .setPlaceholder(`Выберите плагин`)
                                .setOptions([
                                    {
                                        label: "Предметы",
                                        value: "items",
                                        default: false
                                    },
                                    {
                                        label: "Никнеймы",
                                        value: "nicknames",
                                        default: false
                                    },
                                    {
                                        label: "Дни рождения",
                                        value: "birthday",
                                        default: false
                                    },
                                    {
                                        label: "Новые пользователи",
                                        value: "new_users",
                                        default: false
                                    },
                                    {
                                        label: "Служба поддержки",
                                        value: "tickets",
                                        default: false
                                    },
                                    {
                                        label: "Журнал аудита",
                                        value: "logs",
                                        default: false
                                    },
                                    {
                                        label: "Hypixel",
                                        value: "hypixel",
                                        default: false
                                    },
                                    {
                                        label: "Музыка",
                                        value: "music",
                                        default: false
                                    },
                                    {
                                        label: "Совместные игры",
                                        value: "guildgames",
                                        default: false
                                    },
                                    {
                                        label: "Каналы",
                                        value: "channels",
                                        default: false
                                    },
                                    {
                                        label: "Сезонное",
                                        value: "seasonal",
                                        default: false
                                    },
                                    {
                                        label: "Разное",
                                        value: "misc",
                                        default: false
                                    }
                                ])
                        )
                    await interaction.editReply({
                        embeds: [botPluginsEmbed],
                        components: [editPlugin, back_button]
                    })
                    await i.reply({
                        content: `Установлено новое значени плагина "${getPluginName(value)}": \`${guildData.plugins[value] ? "Включено ✅" : "Отключено ❌"}\``,
                        ephemeral: true
                    })
                }
                    break;
                default:
                    break;
            }
        })
    } catch (e) {
        const admin = await client.users.fetch(`491343958660874242`)
        console.log(e)
        await admin.send({
            content: `-> \`\`\`${e.stack}\`\`\``
        }).catch()
    }


}
module.exports = {
    category: `admin_only`,
    plugin: {
        id: "admin",
        name: "Административное"
    },
    data: new SlashCommandBuilder()
        .setName(`dashboard`)
        .setDescription(`Панель управления`)
        .setDMPermission(false),
    execute
};