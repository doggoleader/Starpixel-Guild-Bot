const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const { execute } = require('../../../src/events/client/start_bot/ready');
const wait = require('node:timers/promises').setTimeout;
const fetch = require(`node-fetch`);
const api = process.env.hypixel_apikey;
const { User } = require(`../../../src/schemas/userdata`)
const { Guild } = require(`../../../src/schemas/guilddata`)
const chalk = require(`chalk`);
const { SettingsPluginsGetID, toggleOnOff, defaultShop, secondPage, changeProperty, getRes } = require(`../../../src/functions`)
const prettyMilliseconds = require(`pretty-ms`); //ДОБАВИТЬ В ДРУГИЕ
const { ClientSettings } = require(`../../../src/schemas/client`)
const linksInfo = require(`../../../src/discord structure/links.json`);
const Nodeactyl = require(`nodeactyl`)
//const { HypixelConnect } = require('../../index');

module.exports = {
    category: `admin_only`,
    plugin: {
        id: "admin",
        name: "Административное"
    },
    data: new SlashCommandBuilder()
        .setName(`settings`)
        .setDescription(`Настройки бота гильдии`)
        .setDefaultMemberPermissions(0)
        .setDMPermission(false)
        .addSubcommandGroup(gr => gr
            .setName(`client`)
            .setDescription(`Технические настройки для бота`)
            .addSubcommand(sb => sb
                .setName(`testmode`)
                .setDescription(`Установить режим технического обслуживания`)
                .addBooleanOption(o => o
                    .setName(`статус`)
                    .setDescription(`Выбрать статус технического обслуживания`)
                    .setRequired(true)
                )
            )
            .addSubcommand(sb => sb
                .setName(`stop`)
                .setDescription(`Остановить бота`)
            )
            .addSubcommand(sb => sb
                .setName(`restart`)
                .setDescription(`Перезапустить бота`)
            )
            .addSubcommand(sb => sb
                .setName(`startfunctions`)
                .setDescription(`Запустить все функции бота, которые должны работать ежедневно`)
            )
            .addSubcommand(sb => sb
                .setName(`setversion`)
                .setDescription(`Установить версию бота`)
                .addStringOption(o => o
                    .setName(`версия`)
                    .setDescription(`Версия бота`)
                    .setRequired(true)
                )
            )
        )
        .addSubcommandGroup(gr => gr
            .setName(`hypixelbot`)
            .setDescription(`Бот на Hypixel`)
            .addSubcommand(sb => sb
                .setName(`getstatus`)
                .setDescription(`Получить информацию о боте`)
            )
            .addSubcommand(sb => sb
                .setName(`rejoin`)
                .setDescription(`Перезапустить бота`)
            )
            .addSubcommand(sb => sb
                .setName(`start`)
                .setDescription(`Запустить бота`)
            )
            .addSubcommand(sb => sb
                .setName(`stop`)
                .setDescription(`Запустить бота`)
            )
        )
        .addSubcommandGroup(gr => gr
            .setName(`plugins`)
            .setDescription(`Настройка плагинов бота`)
            .addSubcommand(sb => sb
                .setName(`toggle`)
                .setDescription(`Включить/отключить плагины бота`)
                .addStringOption(o => o
                    .setName(`выбор`)
                    .setDescription(`Выберите плагин, который необходимо изменить`)
                    .setRequired(true)
                    .setAutocomplete(true)
                )
                .addBooleanOption(o => o
                    .setName(`статус`)
                    .setDescription(`Выберите статус, который включит/выключит данный плагин`)
                    .setRequired(true)
                )
            )
            .addSubcommand(sb => sb
                .setName(`check`)
                .setDescription(`Проверить состояние плагинов`)
            )
        )
        .addSubcommandGroup(gr => gr
            .setName(`shop`)
            .setDescription(`Настройки магазина гильдии`)
            .addSubcommand(sb => sb
                .setName(`addroleitem`)
                .setDescription(`Добавить предмет-роль в магазин`)
                .addStringOption(o => o
                    .setName(`название`)
                    .setDescription(`Название предмета`)
                    .setRequired(true)
                )
                .addStringOption(o => o
                    .setName(`магазин`)
                    .setDescription(`Магазин предмета`)
                    .setRequired(true)
                    .addChoices(
                        {
                            name: `Королевский магазин`,
                            value: `KG`
                        },
                        {
                            name: `Магазин активности`,
                            value: `AC`
                        },
                        {
                            name: `Обычный магазин`,
                            value: `SH`
                        }
                    )
                )
                .addRoleOption(o => o
                    .setName(`роль`)
                    .setDescription(`Роль, которая будет продаваться в магазине`)
                    .setRequired(true)
                )
                .addIntegerOption(o => o
                    .setName(`цена`)
                    .setDescription(`Цена предмета (валюта зависит от кода магазина)`)
                    .setRequired(true)
                )
            )
            .addSubcommand(sb => sb
                .setName(`addstaticitem`)
                .setDescription(`Добавить предмет без роли в магазин`)
                .addStringOption(o => o
                    .setName(`название`)
                    .setDescription(`Название предмета`)
                    .setRequired(true)
                )
                .addStringOption(o => o
                    .setName(`магазин`)
                    .setDescription(`Магазин предмета`)
                    .setRequired(true)
                    .addChoices(
                        {
                            name: `Королевский магазин`,
                            value: `KG`
                        },
                        {
                            name: `Магазин активности`,
                            value: `AC`
                        },
                        {
                            name: `Обычный магазин`,
                            value: `SH`
                        }
                    )
                )
                .addStringOption(o => o
                    .setName(`код`)
                    .setDescription(`Имя предмета в базе данных пользователей (только для разработчиков!)`)
                    .setRequired(true)
                )
                .addStringOption(o => o
                    .setName(`значение`)
                    .setDescription(`Значение товара в магазине`)
                    .setRequired(true)
                )
                .addIntegerOption(o => o
                    .setName(`цена`)
                    .setDescription(`Цена предмета (валюта зависит от кода магазина)`)
                    .setRequired(true)
                )
            )
            .addSubcommand(sb => sb
                .setName(`setprice`)
                .setDescription(`Изменить цену на товар в магазине`)
                .addStringOption(o => o
                    .setName(`код`)
                    .setDescription(`Код товара в магазине`)
                    .setRequired(true)
                )
                .addIntegerOption(o => o
                    .setName(`цена`)
                    .setDescription(`Новая цена на товар в магазине`)
                    .setRequired(true)
                )
            )
            .addSubcommand(sb => sb
                .setName(`additem`)
                .setDescription(`Добавить предмет в товар в магазине`)
                .addStringOption(o => o
                    .setName(`код`)
                    .setDescription(`Код товара, в который нужно добавить предмет`)
                    .setRequired(true)
                )
                .addStringOption(o => o
                    .setName(`тип`)
                    .setDescription(`Тип предмета в магазине`)
                    .setRequired(true)
                    .addChoices(
                        {
                            name: `Role item`,
                            value: `Role`
                        },
                        {
                            name: `Static item`,
                            value: `Static`
                        }
                    )
                )

                .addStringOption(o => o
                    .setName(`предмет`)
                    .setDescription(`ID роли или код предмета в базе данных`)
                    .setRequired(true)
                )
                .addStringOption(o => o
                    .setName(`значение`)
                    .setDescription(`Значение товара в магазине (только для типа Static)`)
                )
            )
            .addSubcommand(sb => sb
                .setName(`removeitemfrom`)
                .setDescription(`Удалить предмет из товара в магазине`)
                .addStringOption(o => o
                    .setName(`код`)
                    .setDescription(`Код товара, из которого нужно удалить предмет`)
                    .setRequired(true)
                )
                .addStringOption(o => o
                    .setName(`тип`)
                    .setDescription(`Тип предмета в магазине`)
                    .setRequired(true)
                    .addChoices(
                        {
                            name: `Role item`,
                            value: `Role`
                        },
                        {
                            name: `Static item`,
                            value: `Static`
                        }
                    )
                )
                .addStringOption(o => o
                    .setName(`id`)
                    .setDescription(`ID роли или код предмета в базе данных`)
                    .setRequired(true)
                )
            )
            .addSubcommand(sb => sb
                .setName(`items`)
                .setDescription(`Посмотреть информацию о каждом предмете`)
                .addStringOption(o => o
                    .setName(`магазин`)
                    .setDescription(`Выберите магазин, предметы которого хотите посмотреть`)
                    .setRequired(true)
                    .addChoices(
                        {
                            name: `Королевский магазин`,
                            value: `KG`
                        },
                        {
                            name: `Магазин активности`,
                            value: `AC`
                        },
                        {
                            name: `Обычный магазин`,
                            value: `SH`
                        }
                    )
                )
            )
            .addSubcommand(sb => sb
                .setName(`removeitem`)
                .setDescription(`Удалить предмет из магазина`)
                .addStringOption(o => o
                    .setName(`код`)
                    .setDescription(`Код предмета, который нужно удалить`)
                    .setRequired(true)
                )
            )
            .addSubcommand(sb => sb
                .setName(`maketemp`)
                .setDescription(`Сделать предмет временным`)
                .addStringOption(o => o
                    .setName(`код`)
                    .setDescription(`Код товара, в котором находится этот предмет`)
                    .setRequired(true)
                )
                .addStringOption(o => o
                    .setName(`id`)
                    .setDescription(`ID роли или код предмета в базе данных`)
                    .setRequired(true)
                )
                .addStringOption(o => o
                    .setName(`время`)
                    .setDescription(`Период, на который данный предмет будет выдан (Пример: 7d 4h 3m 2s)`)
                    .setRequired(true)
                )

            )
        )
        .addSubcommandGroup(gr => gr
            .setName(`seasonal`)
            .setDescription(`Настройки сезонов гильдии`)
            .addSubcommand(sb => sb
                .setName(`hw_channel_add`)
                .setDescription(`Добавить канал для сезона "Хэллоуин"`)
                .addChannelOption(o => o
                    .setName(`канал`)
                    .setDescription(`Канал, который нужно добавить в сезон`)
                    .setRequired(true)
                )
            )
            .addSubcommand(sb => sb
                .setName(`hw_channel_remove`)
                .setDescription(`Удалить канал из сезона "Хэллоуин"`)
                .addStringOption(o => o
                    .setName(`id`)
                    .setDescription(`ID канала, который нужно удалить из сезона`)
                    .setRequired(true)
                )
            )
            .addSubcommand(sb => sb
                .setName(`hw_channel_check`)
                .setDescription(`Проверить каналы для сезона "Хэллоуин"`)
            )
            .addSubcommand(sb => sb
                .setName(`forcestart`)
                .setDescription(`Запустить сезон в гильдии`)
                .addStringOption(o => o
                    .setName(`сезон`)
                    .setDescription(`Сезон, который будет запущен`)
                    .setRequired(true)
                    .addChoices(
                        {
                            name: `Хэллоуин`,
                            value: `Хэллоуин`
                        },
                        {
                            name: `Новый год`,
                            value: `Новый год`
                        },
                        {
                            name: `Пасха`,
                            value: `Пасха`
                        },
                        {
                            name: `Лето`,
                            value: `Лето`
                        },

                    ))
            )
            .addSubcommand(sb => sb
                .setName(`forceend`)
                .setDescription(`Отключить сезон в гильдии`)
                .addStringOption(o => o
                    .setName(`сезон`)
                    .setDescription(`Сезон, который будет отключен`)
                    .setRequired(true)
                    .addChoices(
                        {
                            name: `Хэллоуин`,
                            value: `Хэллоуин`
                        },
                        {
                            name: `Новый год`,
                            value: `Новый год`
                        },
                        {
                            name: `Пасха`,
                            value: `Пасха`
                        },
                        {
                            name: `Лето`,
                            value: `Лето`
                        },

                    )
                )
            )
            .addSubcommand(sb => sb
                .setName(`ny_channel_add`)
                .setDescription(`Добавить канал для сезона "Новый год"`)
                .addChannelOption(o => o
                    .setName(`канал`)
                    .setDescription(`Канал, который нужно добавить в сезон`)
                    .setRequired(true)
                )
            )
            .addSubcommand(sb => sb
                .setName(`ny_channel_remove`)
                .setDescription(`Удалить канал из сезона "Новый год"`)
                .addStringOption(o => o
                    .setName(`id`)
                    .setDescription(`ID канала, который нужно удалить из сезона`)
                    .setRequired(true)
                )
            )
            .addSubcommand(sb => sb
                .setName(`ny_channel_check`)
                .setDescription(`Проверить каналы для сезона "Новый год"`)
            )
            .addSubcommand(sb => sb
                .setName(`ea_channel_add`)
                .setDescription(`Добавить канал для сезона "Пасха"`)
                .addChannelOption(o => o
                    .setName(`канал`)
                    .setDescription(`Канал, который нужно добавить в сезон`)
                    .setRequired(true)
                )
            )
            .addSubcommand(sb => sb
                .setName(`ea_channel_remove`)
                .setDescription(`Удалить канал из сезона "Пасха"`)
                .addStringOption(o => o
                    .setName(`id`)
                    .setDescription(`ID канала, который нужно удалить из сезона`)
                    .setRequired(true)
                )
            )
            .addSubcommand(sb => sb
                .setName(`ea_channel_check`)
                .setDescription(`Проверить каналы для сезона "Пасха"`)
            )
            .addSubcommand(sb => sb
                .setName(`su_channel_add`)
                .setDescription(`Добавить канал для сезона "Лето"`)
                .addChannelOption(o => o
                    .setName(`канал`)
                    .setDescription(`Канал, который нужно добавить в сезон`)
                    .setRequired(true)
                )
            )
            .addSubcommand(sb => sb
                .setName(`su_channel_remove`)
                .setDescription(`Удалить канал из сезона "Лето"`)
                .addStringOption(o => o
                    .setName(`id`)
                    .setDescription(`ID канала, который нужно удалить из сезона`)
                    .setRequired(true)
                )
            )
            .addSubcommand(sb => sb
                .setName(`su_channel_check`)
                .setDescription(`Проверить каналы для сезона "Лето"`)
            )
        )
        .addSubcommandGroup(gr => gr
            .setName(`users`)
            .setDescription(`Настройки пользователей`)
            .addSubcommand(sb => sb
                .setName(`removecolor`)
                .setDescription(`Удалить пользовательский цвет`)
                .addUserOption(o => o
                    .setName(`пользователь`)
                    .setDescription(`Пользователь, цвет которого нужно удалить`)
                    .setRequired(true)
                )
            )
            .addSubcommand(sb => sb
                .setName(`giveall`)
                .setDescription(`Выдать роль всем участникам гильдии`)
                .addRoleOption(o => o
                    .setName(`роль`)
                    .setDescription(`Роль, которую нужно выдать`)
                    .setRequired(true)
                )
            )
            .addSubcommand(sb => sb
                .setName("give_to_stack")
                .setDescription("Выдать предмет пользователю в инвентарь")
                .addUserOption(o => o
                    .setName(`пользователь`)
                    .setDescription(`Пользователб, которому нужно выдать роль`)
                    .setRequired(true)
                )
                .addRoleOption(o => o
                    .setName(`роль`)
                    .setDescription(`Роль, которую нужно выдать`)
                    .setRequired(true)
                )
                .addIntegerOption(o => o
                    .setName(`количество`)
                    .setDescription(`Количество, которое необходимо выдать`)
                    .setRequired(false)
                )
            )
        ),
    async autoComplete(interaction, client) {
        const gr = interaction.options.getSubcommandGroup()
        const sb = interaction.options.getSubcommand()
        switch (gr) {
            case `plugins`: {
                switch (sb) {
                    case `toggle`: {
                        const focusedValue = interaction.options.getFocused();
                        const choices = [
                            'Предметы',
                            'Косметика',
                            'Достижения',
                            'Питомцы',
                            'Система никнеймов',
                            'Премиум',
                            'Новые участники',
                            'Дни рождения',
                            'Служба поддержки',
                            'Модерация',
                            'Безопасность',
                            'Временные каналы',
                            'Личные сообщения бота',
                            'Логи',
                            'Временные роли',
                            'Автороли',
                            'Обновление пользователей',
                            'Обновление каналов',
                            'Опыт гильдии',
                            'Музыка',
                            'Сезонное',
                            'Совместные игры',
                            'Марафоны',
                            'Бот Hypixel'
                        ];
                        const filtered = choices.filter(choice => choice.toLowerCase().includes(focusedValue.toLowerCase())).slice(0, 25);
                        await interaction.respond(
                            filtered.map(choice => ({ name: choice, value: choice })),
                        );
                    }

                        break;

                    default:
                        break;
                }
            }
                break;

            default:
                break;
        }
    },
    async execute(interaction, client) {

        try {
            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) return interaction.reply({
                content: `У вас недостаточно прав, чтобы использовать данную команду!`,
                ephemeral: true
            })
            const { guild, member, user, channel, options } = interaction
            const gr = options.getSubcommandGroup()
            const sb = options.getSubcommand()
            let guildData = await Guild.findOne({ id: guild.id })
            const clientData = await ClientSettings.findOne({ clientid: client.user.id })
            let { plugins } = guildData

            switch (gr) {
                case `client`: {
                    switch (sb) {
                        case `testmode`: {

                            const toggleTo = options.getBoolean(`статус`)
                            clientData.testmode = toggleTo
                            clientData.save()
                            await interaction.reply({
                                content: `Режим технических работ был изменён на: ${toggleOnOff(toggleTo)}`,
                                ephemeral: true
                            })
                        }
                            break;
                        case `stop`: {

                            const nodeactyl = new Nodeactyl.NodeactylClient("https://dash.dscrd.ru", process.env.host);
                            await interaction.reply({
                                content: `Бот останавливается...`,
                                ephemeral: true
                            })
                            await nodeactyl.stopServer("fa48d9d8")
                        }
                            break;
                        case `restart`: {

                            const nodeactyl = new Nodeactyl.NodeactylClient("https://dash.dscrd.ru", process.env.host);
                            await interaction.reply({
                                content: `Бот перезапускается...`,
                                ephemeral: true
                            })
                            await nodeactyl.restartServer("fa48d9d8")
                        }
                            break;
                        case `startfunctions`: {
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
                            client.StopPolls(); //Сброс статистики марафона

                            await interaction.reply({
                                content: `Успешно запущены все функции бота!`,
                                ephemeral: true
                            })
                        }
                            break;
                        case `setversion`: {
                            const newV = options.getString(`версия`)
                            const oldV = clientData.version

                            clientData.version = newV
                            clientData.save()
                            const embed = new EmbedBuilder()
                                .setTitle(`Изменена версия бота`)
                                .setColor(Number(linksInfo.bot_color))
                                .setDescription(`Версия бота была изменена с \`${oldV}\` на \`${newV}\``)
                                .setThumbnail(client.user.displayAvatarURL())
                                .setTimestamp(Date.now())

                            await interaction.reply({
                                embeds: [embed],
                                ephemeral: true
                            })
                        }
                            break;

                        default:
                            break;
                    }
                }
                    break;
                /* case `hypixelbot`: {
                    switch (sb) {
                        case `getstatus`: {
                            const jsonObj = McClient.player
                            console.log(jsonObj)
                            await interaction.reply({
                                content: `Данные о боте были отправлены в консоль!`,
                                ephemeral: true
                            })
                        }
                            break;
                        case `rejoin`: {
                            await McClient.end(`Перезапуск бота...`)
                            await interaction.reply({
                                content: `Бот перезапускается...`,
                                ephemeral: true
                            })
                        }
                            break;
                        case `start`: {
                            await McClient.end(`Запуск бота...`)
                            HypixelConnect()
                            await interaction.reply({
                                content: `Бот запускается...`,
                                ephemeral: true
                            })
                        }
                            break;
                        case `stop`: {
                            if (McClient) await McClient.end(`Остановка бота...`)
                            await interaction.reply({
                                content: `Бот останавливается...`,
                                ephemeral: true
                            })
                        }
                            break;
                        default:
                            break;
                    }
                }
                    break; */
                case `plugins`: {

                    switch (sb) {
                        case `toggle`: {

                            const string = options.getString(`выбор`)
                            const boolean = options.getBoolean(`статус`)
                            const id = SettingsPluginsGetID(string)
                            if (id == 1) guildData.plugins.cosmetics = boolean
                            else if (id == 2) guildData.plugins.achievements = boolean
                            else if (id == 3) guildData.plugins.pets = boolean
                            else if (id == 7) guildData.plugins.nick_system = boolean
                            else if (id == 8) guildData.plugins.premium = boolean
                            else if (id == 9) guildData.plugins.welcome = boolean
                            else if (id == 10) guildData.plugins.birthday = boolean
                            else if (id == 11) guildData.plugins.tickets = boolean
                            else if (id == 12) guildData.plugins.moderation = boolean
                            else if (id == 13) guildData.plugins.security = boolean
                            else if (id == 14) guildData.plugins.temp_channels = boolean
                            else if (id == 15) guildData.plugins.bot_dms = boolean
                            else if (id == 16) guildData.plugins.logs = boolean
                            else if (id == 17) guildData.plugins.temp_roles = boolean
                            else if (id == 18) guildData.plugins.auto_roles = boolean
                            else if (id == 19) guildData.plugins.user_updates = boolean
                            else if (id == 20) guildData.plugins.channels = boolean
                            else if (id == 21) guildData.plugins.gexp = boolean
                            else if (id == 22) guildData.plugins.music = boolean
                            else if (id == 24) guildData.plugins.items = boolean
                            else if (id == 25) guildData.plugins.seasonal = boolean
                            else if (id == 26) guildData.plugins.guildgames = boolean
                            else if (id == 27) guildData.plugins.marathon = boolean
                            else if (id == 28) guildData.plugins.hypixel_bot = boolean
                            else if (id == 9999 || id == 0 || id == 4 || id == 5 || id == 6 || id == 23) return interaction.reply({ content: `Данной опции не существует!`, ephemeral: true })

                            guildData.save()
                            const result = toggleOnOff(boolean)
                            const resultid = String(boolean).toUpperCase()
                            await interaction.reply({
                                content: `Статус плагина \`${string}\` был установлен на ${result}!`
                            })

                        }
                            break;

                        case `check`: {
                            let i = 1
                            let { items, cosmetics, achievements, pets, nick_system, premium, welcome, birthday, tickets, moderation, security, temp_channels, bot_dms, logs, temp_roles, auto_roles, user_updates, channels, gexp, music, seasonal, guildgames, marathon, hypixel_bot } = plugins
                            let result = new EmbedBuilder()
                                .setColor(Number(linksInfo.bot_color))
                                .setTitle(`Статус плагинов гильдии`)
                                .setTimestamp(Date.now())
                                .setDescription(`**${i++}.** \`Предметы\` - Статус: ${toggleOnOff(items)}
**${i++}.** \`Косметика\` - Статус: ${toggleOnOff(cosmetics)}
**${i++}.** \`Достижения\` - Статус: ${toggleOnOff(achievements)}
**${i++}.** \`Питомцы\` - Статус: ${toggleOnOff(pets)}
**${i++}.** \`Система никнеймов\` - Статус: ${toggleOnOff(nick_system)}
**${i++}.** \`Премиум\` - Статус: ${toggleOnOff(premium)}
**${i++}.** \`Новые участники\` - Статус: ${toggleOnOff(welcome)}
**${i++}.** \`Дни рождения\` - Статус: ${toggleOnOff(birthday)}
**${i++}.** \`Служба поддержки\` - Статус: ${toggleOnOff(tickets)}
**${i++}.** \`Модерация\` - Статус: ${toggleOnOff(moderation)}
**${i++}.** \`Безопасность\` - Статус: ${toggleOnOff(security)}
**${i++}.** \`Временные каналы\` - Статус: ${toggleOnOff(temp_channels)}
**${i++}.** \`Личные сообщения бота\` - Статус: ${toggleOnOff(bot_dms)}
**${i++}.** \`Логи\` - Статус: ${toggleOnOff(logs)}
**${i++}.** \`Временные роли\` - Статус: ${toggleOnOff(temp_roles)}
**${i++}.** \`Автороли\` - Статус: ${toggleOnOff(auto_roles)}
**${i++}.** \`Обновление пользователей\` - Статус: ${toggleOnOff(user_updates)}
**${i++}.** \`Обновление каналов\` - Статус: ${toggleOnOff(channels)}
**${i++}.** \`Опыт гильдии\` - Статус: ${toggleOnOff(gexp)}
**${i++}.** \`Музыка\` - Статус: ${toggleOnOff(music)}
**${i++}.** \`Сезонное\` - Статус: ${toggleOnOff(seasonal)}
**${i++}.** \`Совместные игры\` - Статус: ${toggleOnOff(guildgames)}
**${i++}.** \`Марафоны\` - Статус: ${toggleOnOff(marathon)}
**${i++}.** \`Бот Hypixel\` - Статус: ${toggleOnOff(hypixel_bot)}

**РЕЖИМ ТЕХ. РАБОТ**: ${toggleOnOff(clientData.testmode)}`)


                            await interaction.reply({
                                embeds: [result]
                            })

                        }
                            break;
                        default:
                            break;
                    }




                }
                    break;


                case "seasonal": {
                    switch (interaction.options.getSubcommand()) {
                        case `hw_channel_add`: {
                            const channel = interaction.options.getChannel(`канал`)
                            if (guildData.seasonal.halloween.channels.find(ch => ch.id == channel.id)) return interaction.reply({
                                content: `Данный канал уже есть в списке добавленных!`,
                                ephemeral: true
                            })
                            guildData.seasonal.halloween.channels.push({ id: channel.id })
                            guildData.save()
                            await interaction.reply({
                                content: `Канал ${channel} был добавлен в список хэллоуинских!`,
                                ephemeral: true
                            })
                        }
                            break;
                        case `hw_channel_remove`: {
                            const channel = interaction.options.getString(`id`)
                            if (!guildData.seasonal.halloween.channels.find(ch => ch.id == channel)) return interaction.reply({
                                content: `Данного канала нет в списке этого сезона!`,
                                ephemeral: true
                            })
                            let i = guildData.seasonal.halloween.channels.findIndex(ch => ch.id == channel)
                            guildData.seasonal.halloween.channels.splice(i, 1)
                            guildData.save()
                            await interaction.reply({
                                content: `Канал ${channel} был удален из списка хэллоуинских!`,
                                ephemeral: true
                            })

                        }
                            break;
                        case `hw_channel_check`: {
                            let i = 1
                            const listMap = guildData.seasonal.halloween.channels.map(async (channel) => {
                                const ch = await interaction.guild.channels.fetch(channel.id)
                                return `**${i++}.** Канал ${ch}, ID \`${channel.id}\``
                            })
                            const list = await Promise.all(listMap)
                            const embed = new EmbedBuilder()
                                .setTitle(`Список каналов сезона "Хэллоуин"`)
                                .setDescription(`${list.join(`\n`)}`)
                                .setColor(Number(linksInfo.bot_color))
                                .setThumbnail(interaction.guild.iconURL())
                                .setTimestamp(Date.now())

                            await interaction.reply({
                                embeds: [embed]
                            })
                        }
                            break;
                        case `forcestart`: {
                            const season = interaction.options.getString(`сезон`)
                            if (season == `Хэллоуин`) {
                                guildData.seasonal.halloween.enabled = true
                            } else if (season == `Новый год`) {
                                guildData.seasonal.new_year.enabled = true
                            } else if (season == `Пасха`) {
                                guildData.seasonal.easter.enabled = true
                            } else if (season == `Лето`) {
                                guildData.seasonal.summer.enabled = true
                            }

                            guildData.save()
                            await interaction.reply({
                                content: `Сезон \`${season}\` был запущен. Каналы НЕ открыты. Откройте их вручную!`,
                                ephemeral: true
                            })
                        }
                            break;

                        case `forceend`: {
                            const season = interaction.options.getString(`сезон`)
                            if (season == `Хэллоуин`) {
                                guildData.seasonal.halloween.enabled = false
                            } else if (season == `Новый год`) {
                                guildData.seasonal.new_year.enabled = false
                            } else if (season == `Пасха`) {
                                guildData.seasonal.easter.enabled = false
                            } else if (season == `Лето`) {
                                guildData.seasonal.summer.enabled = false
                            }

                            guildData.save()
                            await interaction.reply({
                                content: `Сезон \`${season}\` был отключен. Каналы НЕ были закрыты. Закройте их вручную!`,
                                ephemeral: true
                            })
                        }
                            break;
                        case `ny_channel_add`: {
                            const channel = interaction.options.getChannel(`канал`)
                            if (guildData.seasonal.new_year.channels.find(ch => ch.id == channel.id)) return interaction.reply({
                                content: `Данный канал уже есть в списке добавленных!`,
                                ephemeral: true
                            })
                            guildData.seasonal.new_year.channels.push({ id: channel.id })
                            guildData.save()
                            await interaction.reply({
                                content: `Канал ${channel} был добавлен в список новогодних!`,
                                ephemeral: true
                            })
                        }
                            break;
                        case `ny_channel_remove`: {
                            const channel = interaction.options.getString(`id`)
                            if (!guildData.seasonal.new_year.channels.find(ch => ch.id == channel)) return interaction.reply({
                                content: `Данного канала нет в списке этого сезона!`,
                                ephemeral: true
                            })
                            let i = guildData.seasonal.new_year.channels.findIndex(ch => ch.id == channel)
                            guildData.seasonal.new_year.channels.splice(i, 1)
                            guildData.save()
                            await interaction.reply({
                                content: `Канал ${channel} был удален из списка новогодних!`,
                                ephemeral: true
                            })

                        }
                            break;
                        case `ny_channel_check`: {
                            let i = 1
                            const listMap = guildData.seasonal.new_year.channels.map(async (channel) => {
                                const ch = await interaction.guild.channels.fetch(channel.id)
                                return `**${i++}.** Канал ${ch}, ID \`${channel.id}\``
                            })
                            const list = await Promise.all(listMap)
                            const embed = new EmbedBuilder()
                                .setTitle(`Список каналов сезона "Новый год"`)
                                .setDescription(`${list.join(`\n`)}`)
                                .setColor(Number(linksInfo.bot_color))
                                .setThumbnail(interaction.guild.iconURL())
                                .setTimestamp(Date.now())

                            await interaction.reply({
                                embeds: [embed]
                            })
                        }
                            break;
                        case `ea_channel_add`: {
                            const channel = interaction.options.getChannel(`канал`)
                            if (guildData.seasonal.easter.channels.find(ch => ch.id == channel.id)) return interaction.reply({
                                content: `Данный канал уже есть в списке добавленных!`,
                                ephemeral: true
                            })
                            guildData.seasonal.easter.channels.push({ id: channel.id })
                            guildData.save()
                            await interaction.reply({
                                content: `Канал ${channel} был добавлен в список пасхальных!`,
                                ephemeral: true
                            })
                        }
                            break;
                        case `ea_channel_remove`: {
                            const channel = interaction.options.getString(`id`)
                            if (!guildData.seasonal.easter.channels.find(ch => ch.id == channel)) return interaction.reply({
                                content: `Данного канала нет в списке этого сезона!`,
                                ephemeral: true
                            })
                            let i = guildData.seasonal.easter.channels.findIndex(ch => ch.id == channel)
                            guildData.seasonal.easter.channels.splice(i, 1)
                            guildData.save()
                            await interaction.reply({
                                content: `Канал ${channel} был удален из списка пасхальных!`,
                                ephemeral: true
                            })

                        }
                            break;
                        case `ea_channel_check`: {
                            let i = 1
                            const listMap = guildData.seasonal.easter.channels.map(async (channel) => {
                                const ch = await interaction.guild.channels.fetch(channel.id)
                                return `**${i++}.** Канал ${ch}, ID \`${channel.id}\``
                            })
                            const list = await Promise.all(listMap)
                            const embed = new EmbedBuilder()
                                .setTitle(`Список каналов сезона "Пасха"`)
                                .setDescription(`${list.join(`\n`)}`)
                                .setColor(Number(linksInfo.bot_color))
                                .setThumbnail(interaction.guild.iconURL())
                                .setTimestamp(Date.now())

                            await interaction.reply({
                                embeds: [embed]
                            })
                        }
                            break;
                        case `su_channel_add`: {
                            const channel = interaction.options.getChannel(`канал`)
                            if (guildData.seasonal.summer.channels.find(ch => ch.id == channel.id)) return interaction.reply({
                                content: `Данный канал уже есть в списке добавленных!`,
                                ephemeral: true
                            })
                            guildData.seasonal.summer.channels.push({ id: channel.id })
                            guildData.save()
                            await interaction.reply({
                                content: `Канал ${channel} был добавлен в список летних!`,
                                ephemeral: true
                            })
                        }
                            break;
                        case `su_channel_remove`: {
                            const channel = interaction.options.getString(`id`)
                            if (!guildData.seasonal.summer.channels.find(ch => ch.id == channel)) return interaction.reply({
                                content: `Данного канала нет в списке этого сезона!`,
                                ephemeral: true
                            })
                            let i = guildData.seasonal.summer.channels.findIndex(ch => ch.id == channel)
                            guildData.seasonal.summer.channels.splice(i, 1)
                            guildData.save()
                            await interaction.reply({
                                content: `Канал ${channel} был удален из списка летних!`,
                                ephemeral: true
                            })

                        }
                            break;
                        case `su_channel_check`: {
                            let i = 1
                            const listMap = guildData.seasonal.summer.channels.map(async (channel) => {
                                const ch = await interaction.guild.channels.fetch(channel.id)
                                return `**${i++}.** Канал ${ch}, ID \`${channel.id}\``
                            })
                            const list = await Promise.all(listMap)
                            const embed = new EmbedBuilder()
                                .setTitle(`Список каналов сезона "Лето"`)
                                .setDescription(`${list.join(`\n`)}`)
                                .setColor(Number(linksInfo.bot_color))
                                .setThumbnail(interaction.guild.iconURL())
                                .setTimestamp(Date.now())

                            await interaction.reply({
                                embeds: [embed]
                            })
                        }
                            break;
                        default:
                            break;
                    }
                }
                    break;
                case `users`: {
                    switch (interaction.options.getSubcommand()) {
                        case `removecolor`: {
                            const member = interaction.options.getMember(`пользователь`)
                            const userData = await User.findOne({ userid: member.user.id, guildid: guild.id })
                            if (!userData) return interaction.reply({
                                content: `Данных об этом пользователе нет!`,
                                ephemeral: true
                            })
                            if (userData.custom_color.created === false) return interaction.reply({
                                content: `Пользователь не приобрел свой цвет!`,
                                ephemeral: true
                            })
                            const colorRole = await interaction.guild.roles.fetch(userData.custom_color.role)
                            await colorRole.delete()
                            userData.custom_color.created = false
                            userData.custom_color.hex = ``
                            userData.custom_color.role = ``
                            userData.save()
                            await interaction.reply({
                                content: `Вы успешно удалили пользовательский цвет игрока ${member}!`,
                                ephemeral: true
                            })
                        }
                            break;
                        case `giveall`: {
                            await interaction.deferReply({ fetchReply: true })
                            const role = interaction.options.getRole(`роль`)
                            const userDatas = await User.find()
                            for (let userData of userDatas) {
                                let member = await interaction.guild.members.fetch(userData.userid)
                                if (member.roles.cache.has(role.id)) {
                                    userData.stacked_items.push(role.id)
                                    userData.save()
                                } else {
                                    await member.roles.add(role.id)
                                }
                            }
                            await interaction.editReply({
                                content: `Успешно выдана роль ${role} всем участникам гильдии!`
                            })
                        }
                            break;
                        case `give_to_stack`: {
                            await interaction.deferReply({ fetchReply: true })
                            const member = interaction.options.getMember('пользователь')
                            const role = interaction.options.getRole(`роль`)
                            let amount = interaction.options.getInteger(`количество`);
                            if (!amount) amount = 1
                            const userData = await User.findOne({ userid: member.user.id })
                            for (let i = 0; i < amount; i++) {
                                await userData.stacked_items.push(role.id);
                            }
                            userData.save()
                            await interaction.editReply({
                                content: `Успешно выдана роль ${role} (\`${amount} шт.\` участнику ${member}!`
                            })
                        }
                            break;

                        default:
                            break;
                    }
                }
                    break;

                case 'shop': {
                    switch (sb) {
                        case `addroleitem`: {
                            try {
                                const name = interaction.options.getString(`название`)
                                const price = interaction.options.getInteger(`цена`)
                                const shop = interaction.options.getString(`магазин`)
                                const role = interaction.options.getRole(`роль`)
                                let fullCode
                                for (let i = 0; i < guildData.shop.length; i++) {
                                    let shop = guildData.shop[i]
                                    if (name == shop.name) return interaction.reply({
                                        content: `Предмет с таким названием уже существует!`,
                                        ephemeral: true
                                    })
                                }


                                if (shop == `AC`) {
                                    const AC = guildData.shop.filter(shop => {
                                        return shop.code.startsWith(`AC`)
                                    })
                                    let b = 1
                                    let res = AC.find(a => a.code.endsWith(b))
                                    while (res) {
                                        b++
                                        res = AC.find(a => a.code.endsWith(b))
                                    }
                                    console.log
                                    fullCode = `AC${b}`
                                }

                                else if (shop == `KG`) {
                                    const KG = guildData.shop.filter(shop => {
                                        return shop.code.startsWith(`KG`)
                                    })
                                    let b = 1
                                    let res = KG.find(a => a.code.endsWith(b))
                                    while (res) {
                                        b++
                                        res = KG.find(a => a.code.endsWith(b))
                                    }
                                    fullCode = `KG${b}`
                                }

                                else if (shop == `SH`) {
                                    const SH = guildData.shop.filter(shop => {
                                        return shop.code.startsWith(`SH`)
                                    })
                                    let b = 1
                                    let res = SH.find(a => a.code.endsWith(b))
                                    while (res) {
                                        b++
                                        res = SH.find(a => a.code.endsWith(b))
                                    }
                                    fullCode = `SH${b}`
                                }


                                guildData.shop.push({
                                    name: name,
                                    price: price,
                                    shop_type: shop,
                                    roleid: [{
                                        id: role.id
                                    }],
                                    code: fullCode,
                                    type: `Role`
                                })
                                guildData.save()
                                await interaction.reply({
                                    content: `Предмет **\`${name}\`** (код \`${fullCode}\`) был добавлен и имеет цену в \`${price}\` штук валюты магазина! Роль: ${role}`,
                                    ephemeral: true
                                })
                            } catch (e) {
                                console.log(e)
                            }

                        }
                            break;

                        case `addstaticitem`: {
                            const name = interaction.options.getString(`название`)
                            const price = interaction.options.getInteger(`цена`)
                            const shop = interaction.options.getString(`магазин`)
                            const itemCode = interaction.options.getString(`код`)
                            const value = interaction.options.getString(`значение`)

                            const userData = await User.findOne({ userid: interaction.user.id })
                            let test = await getRes(userData, itemCode)
                            if (test == undefined || test == null) return interaction.reply({
                                content: `Данного предмета в базе данных не существует!`,
                                ephemeral: true
                            })
                            let fullCode
                            for (let i = 0; i < guildData.shop.length; i++) {
                                let shop = guildData.shop[i]
                                if (name == shop.name) return interaction.reply({
                                    content: `Предмет с таким названием уже существует!`,
                                    ephemeral: true
                                })
                            }


                            if (shop == `AC`) {
                                const AC = guildData.shop.filter(shop => {
                                    return shop.code.startsWith(`AC`)
                                })
                                let b = 1
                                let res = AC.find(a => a.code.endsWith(b))
                                while (res) {
                                    b++
                                    res = AC.find(a => a.code.endsWith(b))
                                }
                                console.log
                                fullCode = `AC${b}`
                            }

                            else if (shop == `KG`) {
                                const KG = guildData.shop.filter(shop => {
                                    return shop.code.startsWith(`KG`)
                                })
                                let b = 1
                                let res = KG.find(a => a.code.endsWith(b))
                                while (res) {
                                    b++
                                    res = KG.find(a => a.code.endsWith(b))
                                }
                                fullCode = `KG${b}`
                            }

                            else if (shop == `SH`) {
                                const SH = guildData.shop.filter(shop => {
                                    return shop.code.startsWith(`SH`)
                                })
                                let b = 1
                                let res = SH.find(a => a.code.endsWith(b))
                                while (res) {
                                    b++
                                    res = SH.find(a => a.code.endsWith(b))
                                }
                                fullCode = `SH${b}`
                            }


                            guildData.shop.push({
                                name: name,
                                price: price,
                                shop_type: shop,
                                code: fullCode,
                                type: `Static`,
                                static_items_code: [{
                                    name: itemCode,
                                    value: value
                                }]
                            })
                            guildData.save()

                            await interaction.reply({
                                content: `Предмет **\`${name}\`** (код \`${fullCode}\`) был добавлен и имеет цену в \`${price}\` штук валюты магазина!`,
                                ephemeral: true
                            })
                        }
                            break;
                        case `additem`: {
                            const code = interaction.options.getString(`код`)
                            const item = interaction.options.getString(`предмет`)
                            const type = interaction.options.getString(`тип`)
                            const shop = guildData.shop.find(sh => sh.code == code)
                            if (shop.type !== type) return interaction.reply({
                                content: `Тип предмета и выбранный вам тип магазина должны совпадать!`,
                                ephemeral: true
                            })
                            if (type == `Role`) {
                                const role = await interaction.guild.roles.fetch(item)

                                const i = shop.roleid.find(rid => rid.id == role.id)
                                if (i) return interaction.reply({
                                    content: `Данная роль уже есть в этом товаре!`,
                                    ephemeral: true
                                })
                                shop.roleid.push({
                                    id: role.id
                                })
                                guildData.save()

                                await interaction.reply({
                                    content: `Предмет с кодом \`${code}\` был дополнен ролью ${role}!`,
                                    ephemeral: true
                                })
                            } else if (type == `Static`) {
                                const value = interaction.options.getString(`значение`)
                                if (!value) return interaction.reply({
                                    content: `Для типа Static должно быть указано значение!`,
                                    ephemeral: true
                                })
                                const userData = await User.findOne({ userid: interaction.user.id })
                                let test = await getRes(userData, item)
                                if (test == undefined || test == null) return interaction.reply({
                                    content: `Данного предмета в базе данных не существует!`,
                                    ephemeral: true
                                })
                                const i = shop.static_items_code.find(rid => rid.name == item)
                                if (i) return interaction.reply({
                                    content: `Данный предмет уже есть в этом товаре!`,
                                    ephemeral: true
                                })
                                shop.static_items_code.push({
                                    name: item,
                                    value: value
                                })
                                guildData.save()

                                await interaction.reply({
                                    content: `Предмет с кодом \`${code}\` был дополнен предметом \`${item}\`!`,
                                    ephemeral: true
                                })
                            }

                        }
                            break;

                        case `items`: {
                            let type = interaction.options.getString(`магазин`)

                            let b = 0
                            let shops = guildData.shop.filter(sh => sh.shop_type == type)
                            let mapS = shops.map(async (sh, i) => {
                                let currency
                                if (sh.shop_type == `AC`) currency = `🏷`
                                else if (sh.shop_type == `KG` || sh.shop_type == `SH`) currency = `<:Rumbik:883638847056003072>`
                                if (sh.roleid.length >= 1) {
                                    const rolesM = sh.roleid.map(async (roleid) => {
                                        const role = await guild.roles.fetch(roleid.id)
                                        return role
                                    })
                                    const roles = await Promise.all(rolesM)

                                    return `**${++i}**. Название: \`${sh.name}\`, код: \`${sh.code}\`, цена: \`${sh.price}\`${currency}.
                **Роли:**
                ${roles.join('\n')}\n`
                                } else {
                                    return `**${++i}**. Название: \`${sh.name}\`, код: \`${sh.code}\`, цена: \`${sh.price}\`${currency}.\n`
                                }

                            })

                            let mProm = await Promise.all(mapS)
                            let map = mProm.slice(0 + (b * 10), 10 + (10 * b))
                            let totalPages = Math.ceil(mapS.length / 10)
                            const selectMenu = new ActionRowBuilder()
                                .addComponents(
                                    new StringSelectMenuBuilder()
                                        .setCustomId(`shoptype`)
                                        .setMaxValues(1)
                                        .setMinValues(1)
                                        .setPlaceholder(`Тип магазина гильдии`)
                                        .addOptions(
                                            {
                                                label: `Магазин активности`,
                                                emoji: `🏷`,
                                                description: `Магазин активности гильдии`,
                                                value: `AC`,
                                                default: defaultShop(type, `AC`)
                                            },
                                            {
                                                label: `Королевский магазин`,
                                                emoji: `👑`,
                                                description: `Королевский магазин гильдии`,
                                                value: `KG`,
                                                default: defaultShop(type, `KG`)
                                            },
                                            {
                                                label: `Обычный магазин`,
                                                emoji: `<:Rumbik:883638847056003072>`,
                                                description: `Обычный магазин гильдии`,
                                                value: `SH`,
                                                default: defaultShop(type, `SH`)
                                            }
                                        )
                                )

                            const buttons = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId(`prev`)
                                        .setDisabled(true)
                                        .setLabel(`Предыдущая`)
                                        .setStyle(ButtonStyle.Danger)
                                        .setEmoji(`⬅`)
                                )
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId(`next`)
                                        .setDisabled(secondPage(totalPages))
                                        .setLabel(`Следующая`)
                                        .setStyle(ButtonStyle.Success)
                                        .setEmoji(`➡`)
                                )

                            const embed = new EmbedBuilder()
                                .setTitle(`Список товаров`)
                                .setDescription(`${map.join(`\n`)}`)
                                .setColor(Number(linksInfo.bot_color))
                                .setTimestamp(Date.now())
                                .setFooter({ text: `Страница ${b + 1}/${totalPages}` })

                            const msg = await interaction.reply({
                                embeds: [embed],
                                components: [buttons, selectMenu],
                                fetchReply: true
                            })

                            const collector = msg.createMessageComponentCollector()

                            collector.on('collect', async (i) => {
                                if (i.customId == `prev`) {
                                    b = b - 1
                                    if (b <= 0) {
                                        buttons.components[0].setDisabled(true)
                                        buttons.components[1].setDisabled(false)
                                    } else {
                                        buttons.components[0].setDisabled(false)
                                        buttons.components[1].setDisabled(false)
                                    }
                                    map = mProm.slice(0 + (b * 10), 10 + (b * 10))
                                    embed.setDescription(`${map.join(`\n`)}`).setFooter({
                                        text: `Страница ${b + 1}/${totalPages}`
                                    })
                                    await i.deferUpdate()
                                    await interaction.editReply({
                                        embeds: [embed],
                                        components: [buttons, selectMenu],
                                        fetchReply: true
                                    })
                                } else if (i.customId == `next`) {
                                    b = b + 1
                                    if (b >= totalPages - 1) {
                                        buttons.components[1].setDisabled(true)
                                        buttons.components[0].setDisabled(false)
                                    } else {
                                        buttons.components[1].setDisabled(false)
                                        buttons.components[0].setDisabled(false)
                                    }
                                    map = mProm.slice(0 + (b * 10), 10 + (b * 10))
                                    embed.setDescription(`${map.join(`\n`)}`).setFooter({
                                        text: `Страница ${b + 1}/${totalPages}`
                                    })
                                    await i.deferUpdate()
                                    await interaction.editReply({
                                        embeds: [embed],
                                        components: [buttons, selectMenu],
                                        fetchReply: true
                                    })
                                } else if (i.customId == `shoptype`) {
                                    const value = i.values[0]
                                    let type = value
                                    selectMenu.components[0].setOptions({
                                        label: `Магазин активности`,
                                        emoji: `🏷`,
                                        description: `Магазин активности гильдии`,
                                        value: `AC`,
                                        default: defaultShop(type, `AC`)
                                    },
                                        {
                                            label: `Королевский магазин`,
                                            emoji: `👑`,
                                            description: `Королевский магазин гильдии`,
                                            value: `KG`,
                                            default: defaultShop(type, `KG`)
                                        },
                                        {
                                            label: `Обычный магазин`,
                                            emoji: `<:Rumbik:883638847056003072>`,
                                            description: `Обычный магазин гильдии`,
                                            value: `SH`,
                                            default: defaultShop(type, `SH`)
                                        })
                                    shops = guildData.shop.filter(sh => sh.shop_type == value)
                                    mapS = shops.map(async (sh, i) => {
                                        let currency
                                        if (sh.shop_type == `AC`) currency = `🏷`
                                        else if (sh.shop_type == `KG` || sh.shop_type == `SH`) currency = `<:Rumbik:883638847056003072>`
                                        if (sh.roleid.length >= 1) {
                                            const rolesM = sh.roleid.map(async (roleid) => {
                                                const role = await guild.roles.fetch(roleid.id)
                                                return role
                                            })
                                            const roles = await Promise.all(rolesM)

                                            return `**${++i}**. Название: \`${sh.name}\`, код: \`${sh.code}\`, цена: \`${sh.price}\`${currency}.
                **Роли:**
                ${roles.join('\n')}
                `
                                        } else {
                                            return `**${++i}**. Название: \`${sh.name}\`, код: \`${sh.code}\`, цена: \`${sh.price}\`${currency}.
                `
                                        }
                                    })
                                    mProm = await Promise.all(mapS)
                                    totalPages = Math.ceil(mapS.length / 10)
                                    b = 0
                                    buttons.components[0].setDisabled(true)
                                    buttons.components[1].setDisabled(secondPage(totalPages))
                                    map = mProm.slice(0 + (b * 10), 10 + (b * 10))
                                    embed.setDescription(`${map.join(`\n`)}`).setFooter({
                                        text: `Страница ${b + 1}/${totalPages}`
                                    })
                                    await i.deferUpdate()
                                    await interaction.editReply({
                                        embeds: [embed],
                                        components: [buttons, selectMenu],
                                        fetchReply: true
                                    })
                                }
                            })

                        }
                            break;

                        case `removeitem`: {
                            const code = interaction.options.getString(`код`)
                            const i = guildData.shop.findIndex(sh => sh.code == code)
                            const name = guildData.shop[i].name
                            guildData.shop.splice(i, 1)
                            guildData.save()
                            await interaction.reply({
                                content: `Предмет кодом \`${code}\` и именем \`${name}\` был удален!`,
                                ephemeral: true
                            })
                        }
                            break;

                        case `removeitemfrom`: {
                            const code = interaction.options.getString(`код`)
                            const type = interaction.options.getString(`тип`)
                            const item = interaction.options.getString(`id`)
                            if (type == `Role`) {
                                const shop = guildData.shop.find(sh => sh.code == code)
                                const i = shop.roleid.findIndex(rid => rid.id == item)

                                if (i == -1) return interaction.reply({
                                    content: `Данная роль в этом товаре не найдена!`,
                                    ephemeral: true
                                })

                                shop.roleid.splice(i, 1)
                                guildData.save()

                                await interaction.reply({
                                    content: `У предмета с кодом \`${code}\` была убрана роль <@&${item}>!`,
                                    ephemeral: true
                                })
                                guildData.save()
                            } else if (type == `Static`) {
                                const shop = guildData.shop.find(sh => sh.code == code)
                                const i = shop.static_items_code.findIndex(rid => rid == item)

                                if (i == -1) return interaction.reply({
                                    content: `Данная роль в этом товаре не найдена!`,
                                    ephemeral: true
                                })

                                shop.static_items_code.splice(i, 1)
                                guildData.save()

                                await interaction.reply({
                                    content: `У предмета с кодом \`${code}\` была убрана роль <@&${item}>!`,
                                    ephemeral: true
                                })
                                guildData.save()
                            }

                        }
                            break;
                        case "maketemp": {
                            const code = interaction.options.getString(`код`)
                            const role = interaction.options.getString(`id`)
                            const time = interaction.options.getString(`время`)
                            let newTime = time.split(` `)
                            let d
                            let h
                            let m
                            let s
                            for (let ch of newTime) {
                                if (/^[0-9]{1,10}[d]$/ig.test(ch)) d = ch.match(/\d/g)
                                else if (/^[0-2]{0,1}[0-9]{1}[h]$/ig.test(ch) && ch.match(/\d/g) <= 23) h = ch.match(/\d/g)
                                else if (/^[0-5]{0,1}[0-9]{1}[m]$/ig.test(ch)) m = ch.match(/\d/g)
                                else if (/^[0-5]{0,1}[0-9]{1}[s]$/ig.test(ch)) s = ch.match(/\d/g)
                                else return interaction.reply({
                                    content: `Время было написано неправильно! Проверьте правильность написания значения ${ch}!`
                                })
                            }
                            await wait(1000)
                            let finalTime = 0

                            if (d) {
                                d = d.join(``)
                                finalTime += 1000 * 60 * 60 * 24 * d
                            }
                            if (h) {
                                h = h.join(``)
                                finalTime += 1000 * 60 * 60 * h
                            }

                            if (m) {
                                m = m.join(``)
                                finalTime += 1000 * 60 * m
                            }

                            if (s) {
                                s = s.join(``)
                                finalTime += 1000 * s
                            }
                            const shop = guildData.shop.find(sh => sh.code == code)
                            const userData = await User.findOne({ userid: interaction.user.id, guildid: interaction.guild.id })
                            let type
                            try {
                                let check = await interaction.guild.roles.fetch(role)
                                if (check) type = `Role`
                            } catch (e) {
                                let check = await getRes(userData, role)
                                if (check == undefined) return interaction.reply({
                                    content: `Такого ID не существует (\`${role}\`)!`
                                })
                                type = `Static`
                            }


                            if (type == `Role`) {
                                let item = shop.roleid.find(ro => ro.id == role)
                                if (!item) return interaction.reply({
                                    content: `Роль с таким ID в данном товаре не найдена!`,
                                    ephemeral: true
                                })
                                item.expire = finalTime
                                guildData.save()
                                await interaction.reply({
                                    content: `Успешно установлено время, на которое даётся данный предмет!`
                                })
                            } else if (type == `Static`) {
                                let item = shop.static_items_code.find(ro => ro.name == role)
                                if (!item) return interaction.reply({
                                    content: `Предмет с таким ID в данном товаре не найдена!`,
                                    ephemeral: true
                                })
                                item.expire = finalTime
                                guildData.save()
                                await interaction.reply({
                                    content: `Успешно установлено время, на которое даётся данный предмет!`
                                })
                            }

                        }
                            break;

                        case `setprice`: {
                            const code = interaction.options.getString(`код`)
                            const newPrice = interaction.options.getInteger(`цена`)
                            let item = await guildData.shop.find(i => i.code == code)
                            if (!item) return interaction.reply({
                                content: `Товар с кодом \`${code}\` не найден в магазине!`,
                                ephemeral: true
                            })
                            const oldPrice = item.price
                            item.price = newPrice
                            guildData.save()
                            await interaction.reply({
                                content: `Цена на товар \`${item.name} - ${item.code}\` была установлена на \`${oldPrice} ➡ ${newPrice}\`!`,
                                ephemeral: true
                            })
                        }
                            break;
                        default:
                            break;
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
}