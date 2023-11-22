const { ContextMenuCommandBuilder, ApplicationCommandType, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, ModalSubmitInteraction, InteractionType, EmbedBuilder, SlashCommandBuilder, ButtonBuilder, ButtonStyle, ComponentType, StringSelectMenuBuilder, ChannelType, UserSelectMenuBuilder } = require('discord.js');
const fetch = require(`node-fetch`);
const wait = require(`node:timers/promises`).setTimeout
const api = process.env.hypixel_apikey;
const { User } = require(`../../schemas/userdata`)
const { Guild } = require(`../../schemas/guilddata`)
const { Apply } = require(`../../schemas/applications`)
const { Birthday } = require(`../../schemas/birthday`)
const chalk = require(`chalk`);
const prettyMilliseconds = require(`pretty-ms`); //ДОБАВИТЬ В ДРУГИЕ
const ch_list = require(`../../discord structure/channels.json`);
const { calcActLevel, getLevel, rankName, monthName } = require(`../../functions`);
const linksInfo = require(`../../discord structure/links.json`)
const rolesInfo = require(`../../discord structure/roles.json`);
const { Channel } = require('node:diagnostics_channel');

module.exports = {
    category: `admin_only`,
    data: new ContextMenuCommandBuilder()
        .setName(`Информация о профиле`)
        .setType(ApplicationCommandType.User)
        .setDMPermission(false),
    async execute(interaction, client) {
        try {
            await interaction.deferReply({ fetchReply: true })
            let user = interaction.targetUser
            const guild = await client.guilds.fetch(`320193302844669959`)
            let intMember = await guild.members.fetch(interaction.user.id)
            let member = interaction.targetMember
            if (!intMember || !intMember.roles.cache.has(`504887113649750016`)) {
                await interaction.editReply({
                    content: `Вы не можете использовать эту команду, так как вы не являетесь участником гильдии!`,
                    fetchReply: true
                })
                await wait(10000)
                await interaction.deleteReply()
                return
            }
            if (user.bot) {
                await interaction.editReply({
                    content: `${user} является ботом, а значит у него нет профиля :'(`,
                    fetchReply: true
                })
                await wait(10000)
                await interaction.deleteReply()
                return
            }
            if (!member.roles.cache.has(`504887113649750016`) || !member) {
                await interaction.editReply({
                    content: `Данный участник не находится в гильдии!`,
                    fetchReply: true
                })
                await wait(10000)
                await interaction.deleteReply()
                return
            }

            let users = await User.find().then(users => {
                return users.filter(async user => await guild.members.fetch(user.userid))
            })
            let sort1 = users.sort((a, b) => {
                return b.exp - a.exp
            })
            let sorts = sort1.sort((a, b) => {
                return b.level - a.level
            })
            var i = 0
            while (sorts[i].userid !== user.id) {
                i++
            }
            let userData = sorts[i]
            if (!userData) {
                await interaction.editReply({
                    content: `Не удалось найти информацию о данном пользователе!`,
                    fetchReply: true
                })
                await wait(10000)
                await interaction.deleteReply()
                return
            }
            let rank = i + 1
            let neededXP = 5 * (Math.pow(userData.level, 2)) + (50 * userData.level) + 100;
            let part1
            let part2
            if (userData.exp >= 1000) {
                part1 = (userData.exp / 1000).toFixed(1) + `k`
            } else part1 = userData.exp
            if (neededXP >= 1000) {
                part2 = (neededXP / 1000).toFixed(1) + `k`
            } else part2 = neededXP
            let colorRole = await guild.roles.fetch(userData.custom_color?.role ? userData.custom_color.role : `nn`)
            if (!colorRole) colorRole = `Не создана`



            const main = new EmbedBuilder()
                .setColor(Number(linksInfo.bot_color))
                .setTitle(`Профиль пользователя ${user.username}`)
                .setThumbnail(user.displayAvatarURL())
                .setTimestamp(Date.now())
                .setDescription(
                    `**ОСНОВНОЕ**
\`Ранг в гильдии\` - ${rankName(userData.rank_number)}
\`Румбики\` - ${userData.rumbik}<:Rumbik:883638847056003072>
\`Опыт рангов\` - ${userData.rank}💠
\`Посещено совместных игр\` - ${userData.visited_games} игр
\`Билеты\` - ${userData.tickets}🏷
\`Опыта гильдии сохранено\` - ${userData.gexp} GEXP
\`Медаль 🥇\` - ${userData.medal_1} шт.
\`Медаль 🥈\` - ${userData.medal_2} шт.
\`Медаль 🥉\` - ${userData.medal_3} шт.
\`Собрано звёздных комплектов\` - ${userData.starway.current} ✨
\`Неполученных предметов\` - ${userData.stacked_items.length}
\`Сброшен профиль\` - ${userData.times_reset} раз`)

            const selectMenu = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId(`profilemenu`)
                        .setPlaceholder(`Выберите меню, которое хотите увидеть`)
                        .addOptions(
                            {
                                label: `Основное`,
                                description: `Основная информация о вашем профиле`,
                                emoji: `📃`,
                                default: true,
                                value: `main`
                            },
                            {
                                label: `Уровень активности`,
                                description: `Информация о вашем уровне активности`,
                                emoji: `🌀`,
                                default: false,
                                value: `act`
                            },
                            {
                                label: `Стихии`,
                                description: `Информация о ваших навыках в стихиях`,
                                emoji: `🌊`,
                                default: false,
                                value: `elem`
                            },
                            {
                                label: `Достижения гильдии`,
                                description: `Информация о ваших достижениях`,
                                emoji: `🏅`,
                                default: false,
                                value: `achievements`
                            },
                            {
                                label: `Перки`,
                                description: `Информация о ваших перках в гильдии`,
                                emoji: `📍`,
                                default: false,
                                value: `perks`
                            },
                            {
                                label: `Опыт гильдии`,
                                description: `Ваш опыт гильдии за последние 7 дней`,
                                emoji: `🔰`,
                                default: false,
                                value: `gexp`
                            },
                            {
                                label: `Квесты и марафон`,
                                description: `Статистика ваших квестов/заданий/этапов марафона`,
                                emoji: `💪`,
                                default: false,
                                value: `quests`
                            },
                            {
                                label: `Магазины гильдии`,
                                description: `Статистика покупок/продаж в магазинах`,
                                emoji: `💰`,
                                default: false,
                                value: `shops`
                            },
                            {
                                label: `Множители`,
                                description: `Информация о ваших множителях`,
                                emoji: `🔺`,
                                default: false,
                                value: `boosters`
                            },
                            {
                                label: `Пользовательский цвет`,
                                description: `Информация о вашем пользовательском цвете`,
                                emoji: `🟣`,
                                default: false,
                                value: `colors`
                            },
                            {
                                label: `Шансы на редкости`,
                                description: `Ваши шансы на определённую редкость в коробках`,
                                emoji: `🎱`,
                                default: false,
                                value: `chances`
                            },
                            {
                                label: `Об участнике`,
                                description: `Основная информация об участнике гильдии`,
                                emoji: `❔`,
                                default: false,
                                value: `about`
                            },
                        )
                )

            const userMenu = new ActionRowBuilder()
                .addComponents(
                    new UserSelectMenuBuilder()
                        .setCustomId(`usermenu`)
                        .setMaxValues(1)
                        .setPlaceholder(`Пользователь, которого хотите посмотреть`)
                )



            const msg = await interaction.editReply({
                embeds: [main],
                components: [selectMenu, userMenu],
                fetchReply: true
            })

            const collector = msg.createMessageComponentCollector()

            collector.on(`collect`, async (i) => {
                if (i.customId == `profilemenu`) {
                    const value = i.values[0]
                    if (i.user.id == interaction.user.id) {

                        if (value == `main`) {
                            await selectMenu.components[0].options.forEach(option => {
                                if (option.data.value == value) {
                                    option.data.default = true
                                } else option.data.default = false
                            })
                            await i.update({
                                embeds: [main],
                                components: [selectMenu, userMenu]
                            })
                        } else if (value == `act`) {
                            const act = new EmbedBuilder()
                                .setColor(Number(linksInfo.bot_color))
                                .setTitle(`Профиль пользователя ${user.username}`)
                                .setThumbnail(user.displayAvatarURL())
                                .setTimestamp(Date.now())
                                .setDescription(`**УРОВЕНЬ АКТИВНОСТИ**
\`Прогресс\` - ${part1}/${part2}🌀
\`Уровень\` - ${userData.level}
\`Всего опыта\` - ${calcActLevel(0, userData.level, userData.exp)}🌀
\`Позиция\` - #${rank}`)
                            await selectMenu.components[0].options.forEach(option => {
                                if (option.data.value == value) {
                                    option.data.default = true
                                } else option.data.default = false
                            })
                            await i.update({
                                embeds: [act],
                                components: [selectMenu, userMenu]
                            })
                        } else if (value == `elem`) {
                            const elem = new EmbedBuilder()
                                .setColor(Number(linksInfo.bot_color))
                                .setTitle(`Профиль пользователя ${user.username}`)
                                .setThumbnail(user.displayAvatarURL())
                                .setTimestamp(Date.now())
                                .setDescription(`**НАВЫКИ ПИТОМЦЕВ**
            
__**Земля**__
\`Выращивание горных пород\` - ${userData.elements.mountains}/1
\`Быстрый рост растений\` - ${userData.elements.fast_grow}/1
\`Перемещение под землёй\` - ${userData.elements.underground}/1

__**Вода**__
\`Плавание на глубине\` - ${userData.elements.diving}/1
\`Сопротивление течениям\` - ${userData.elements.resistance}/1
\`Подводное дыхание\` - ${userData.elements.respiration}/1

__**Огонь**__
\`Защита от огня\` - ${userData.elements.fire_resistance}/1
\`Удар молнии\` - ${userData.elements.lightning}/1
\`Управление пламенем\` - ${userData.elements.flame}/1

__**Воздух**__
\`Полёт в небесах\` - ${userData.elements.flying}/1
\`Повеление ветром\` - ${userData.elements.wind}/1
\`Орлиный глаз\` - ${userData.elements.eagle_eye}/1`)
                            await selectMenu.components[0].options.forEach(option => {
                                if (option.data.value == value) {
                                    option.data.default = true
                                } else option.data.default = false
                            })
                            await i.update({
                                embeds: [elem],
                                components: [selectMenu, userMenu]
                            })
                        } else if (value == `achievements`) {

                            let n_unclaimed = []

                            for (let norm of rolesInfo.achievements_normal) {
                                if (!member.roles.cache.has(norm)) {
                                    n_unclaimed.push(norm)
                                }
                            }

                            let m_unclaimed = []

                            for (let myth of rolesInfo.achievements_myth) {
                                if (!member.roles.cache.has(myth)) {
                                    m_unclaimed.push(myth)
                                }
                            }

                            let n_map


                            if (n_unclaimed.length <= 0) {
                                n_map = `🎉 Вы выполнили все обычные достижения! Поздравляем! ✨`
                            } else {
                                n_map = n_unclaimed.map((norm, i) => {
                                    return `**${++i}.** <@&${norm}>`
                                }).join(`\n`)
                            }
                            let m_map
                            if (m_unclaimed.length <= 0) {
                                m_map = `🎉 Вы выполнили все мифические достижения! Поздравляем! ✨`
                            } else {
                                m_map = m_unclaimed.map((myth, i) => {
                                    return `**${++i}.** <@&${myth}>`
                                }).join(`\n`)
                            }
                            const achievements = new EmbedBuilder()
                                .setColor(Number(linksInfo.bot_color))
                                .setTitle(`Профиль пользователя ${user.username}`)
                                .setThumbnail(user.displayAvatarURL())
                                .setTimestamp(Date.now())
                                .setDescription(`**ДОСТИЖЕНИЯ ГИЛЬДИИ**
__**Общая информация**__
\`Обычные достижения\` - ${userData.achievements.normal}/${rolesInfo.achievements_normal.length}
\`Мифические достижения\` - ${userData.achievements.mythical}/${rolesInfo.achievements_myth.length}

__**Неполученные достижения**__
__Обычные достижения__
${n_map}

__Мифические достижения__
${m_map}`)
                            await selectMenu.components[0].options.forEach(option => {
                                if (option.data.value == value) {
                                    option.data.default = true
                                } else option.data.default = false
                            })
                            await i.update({
                                embeds: [achievements],
                                components: [selectMenu, userMenu]
                            })
                        } else if (value == `perks`) {
                            const perks = new EmbedBuilder()
                                .setColor(Number(linksInfo.bot_color))
                                .setTitle(`Профиль пользователя ${user.username}`)
                                .setThumbnail(user.displayAvatarURL())
                                .setTimestamp(Date.now())
                                .setDescription(`**ПЕРКИ**
\`🔺 Повышение опыта рангов\` - ${userData.perks.rank_boost}/6
\`🔻 Скидка в королевском магазине\` - ${userData.perks.king_discount}/4
\`🔻 Скидка в магазине активности\` - ${userData.perks.act_discount}/3
\`🔻 Скидка в обычном магазине гильдии\` - ${userData.perks.shop_discount}/4
\`🕒 Увеличение времени действия временных предметов\` - ${userData.perks.temp_items}/1
\`💰 Возможность продавать предметы из профиля\` - ${userData.perks.sell_items}/1
\`🏷️ Уменьшение опыта гильдии для получения билета\` - ${userData.perks.ticket_discount}/5
\`✨ Изменение предметов\` - ${userData.perks.change_items}/1`)
                            await selectMenu.components[0].options.forEach(option => {
                                if (option.data.value == value) {
                                    option.data.default = true
                                } else option.data.default = false
                            })
                            await i.update({
                                embeds: [perks],
                                components: [selectMenu, userMenu]
                            })
                        } else if (value == `shops`) {
                            const shops = new EmbedBuilder()
                                .setColor(Number(linksInfo.bot_color))
                                .setTitle(`Профиль пользователя ${user.username}`)
                                .setThumbnail(user.displayAvatarURL())
                                .setTimestamp(Date.now())
                                .setDescription(`**СТАТИСТИКА МАГАЗИНА ГИЛЬДИИ**
\`Куплено предметов\` - ${userData.buys.normal + userData.buys.king + userData.buys.activity} шт.
\`Куплено предметов в обычном магазине\` - ${userData.buys.normal} шт.
\`Куплено предметов в королевском магазине\` - ${userData.buys.king} шт.
\`Куплено предметов в магазине активности\` - ${userData.buys.activity} шт.
\`Потрачено румбиков\` - ${userData.buys.total_sum} <:Rumbik:883638847056003072>
\`Потрачено билетов\` - ${userData.buys.total_tickets} 🏷

\`Всего продано предметов\` - ${userData.sell.constellation + userData.sell.comet + userData.sell.other} шт.
\`Продано созвездий\` - ${userData.sell.constellation} шт.
\`Продано комет\` - ${userData.sell.comet} шт.
\`Продано других предметов\` - ${userData.sell.other} шт.
\`Продано предметов на сумму\` - ${userData.sell.total_sum} <:Rumbik:883638847056003072>`)
                            await selectMenu.components[0].options.forEach(option => {
                                if (option.data.value == value) {
                                    option.data.default = true
                                } else option.data.default = false
                            })
                            await i.update({
                                embeds: [shops],
                                components: [selectMenu, userMenu]
                            })
                        } else if (value == `gexp`) {
                            await i.deferUpdate()
                            const response = await fetch(`https://api.hypixel.net/guild?id=5c1902fc77ce84cd430f3959`, {
                                headers: {
                                    "API-Key": api,
                                    "Content-Type": "application/json"
                                }
                            })
                            let json
                            if (response.ok) json = await response.json()
                            let gexp_nums
                            let sum
                            let map
                            let player = await json.guild.members.find(member => member.uuid == userData.uuid)
                            if (!player) {
                                map = `Не удалось найти пользователя в гильдии!`
                                sum = 0
                            } else {
                                gexp_nums = Object.entries(player.expHistory)
                                sum = 0
                                map = gexp_nums.map(([key, value]) => {
                                    sum += value
                                    let sp = key.split(`-`)
                                    let date = `${sp[2]}.${sp[1]}.${sp[0]}`
                                    return `• \`${date}\` - ${value} GEXP`
                                }).join(`\n`)
                            }



                            const gexp = new EmbedBuilder()
                                .setColor(Number(linksInfo.bot_color))
                                .setTitle(`Профиль пользователя ${user.username}`)
                                .setThumbnail(user.displayAvatarURL())
                                .setTimestamp(Date.now())
                                .setDescription(`**ОПЫТ ГИЛЬДИИ УЧАСТНИКА**
Никнейм: \`${userData.nickname}\`
__**Опыт гильдии**__:
${map}

**Опыта гильдии за последние 7 дней**: ${sum} GEXP`)
                            await selectMenu.components[0].options.forEach(option => {
                                if (option.data.value == value) {
                                    option.data.default = true
                                } else option.data.default = false
                            })
                            await interaction.editReply({
                                embeds: [gexp],
                                components: [selectMenu, userMenu],
                                fetchReply: true
                            })
                        } else if (value == `quests`) {
                            let total = userData.quests.seasonal.stats.hw.total + userData.quests.seasonal.stats.ny.total + userData.quests.seasonal.stats.ea.total + userData.quests.seasonal.stats.su.total
                            const quests = new EmbedBuilder()
                                .setColor(Number(linksInfo.bot_color))
                                .setTitle(`Профиль пользователя ${user.username}`)
                                .setThumbnail(user.displayAvatarURL())
                                .setTimestamp(Date.now())
                                .setDescription(`**СТАТИСТИКА КВЕСТОВ И МАРАФОНА**
__**Марафон**__
\`Выполнено стадий\` - ${userData.quests.marathon.stats.total_stages}
\`Пройдено раз\` - ${userData.quests.marathon.stats.total_mar}

__**Задания для ветеранов**__
\`Выполнено заданий\` - ${userData.quests.veterans.stats.total}

__**Квесты "Новое начало"**__
\`Выполнено заданий\` - ${userData.quests.kings.stats.total}/4\\*
\\*Задание с достижениями не учитывается

__**Задания Марса**__
\`Выполнено заданий\` - ${userData.quests.mars.stats.total}

__**Сезонное**__
\`Хэллоуинские квесты\` - ${userData.quests.seasonal.stats.hw.total}
\`Новогодние квесты\` - ${userData.quests.seasonal.stats.ny.total}
\`Пасхальные квесты\` - ${userData.quests.seasonal.stats.ea.total}
\`Летние квесты\` - ${userData.quests.seasonal.stats.su.total}
__**\`Всего\`**__ - ${total}`)
                            await selectMenu.components[0].options.forEach(option => {
                                if (option.data.value == value) {
                                    option.data.default = true
                                } else option.data.default = false
                            })
                            await i.update({
                                embeds: [quests],
                                components: [selectMenu, userMenu]
                            })
                        } else if (value == `boosters`) {
                            const boosters = new EmbedBuilder()
                                .setColor(Number(linksInfo.bot_color))
                                .setTitle(`Профиль пользователя ${user.username}`)
                                .setThumbnail(user.displayAvatarURL())
                                .setTimestamp(Date.now())
                                .setDescription(`**МНОЖИТЕЛИ**
\`Множитель опыта активности\` - ${userData.pers_act_boost}x
\`Множитель опыта рангов\` - ${userData.pers_rank_boost}x
\`Множитель румбиков\` - ${userData.pers_rumb_boost}x
\`Множитель цен товаров в стандартном магазине\` - ${userData.shop_costs}x
\`Множитель цен товаров в магазине активности\` - ${userData.act_costs}x
\`Множитель цен товаров в королевском магазине\` - ${userData.king_costs}x`)
                            await selectMenu.components[0].options.forEach(option => {
                                if (option.data.value == value) {
                                    option.data.default = true
                                } else option.data.default = false
                            })
                            await i.update({
                                embeds: [boosters],
                                components: [selectMenu, userMenu]
                            })
                        } else if (value == `colors`) {
                            const colors = new EmbedBuilder()
                                .setColor(Number(linksInfo.bot_color))
                                .setTitle(`Профиль пользователя ${user.username}`)
                                .setThumbnail(user.displayAvatarURL())
                                .setTimestamp(Date.now())
                                .setDescription(`**ПОЛЬЗОВАТЕЛЬСКИЙ ЦВЕТ**
\`Наличие\` - ${userData.custom_color.created ? `Создан` : `Не создан`}
\`Цветовой код\` - ${userData.custom_color?.hex ? userData.custom_color?.hex : `Цветовой код отсутствует`}
\`Имя роли\` - ${userData.custom_color?.custom_name ? userData.custom_color?.custom_name : `ЛИЧНЫЙ ЦВЕТ`} 
\`Роль\` - ${colorRole}`)
                            await selectMenu.components[0].options.forEach(option => {
                                if (option.data.value == value) {
                                    option.data.default = true
                                } else option.data.default = false
                            })
                            await i.update({
                                embeds: [colors],
                                components: [selectMenu, userMenu]
                            })
                        } else if (value == `chances`) {
                            const chances = new EmbedBuilder()
                                .setColor(Number(linksInfo.bot_color))
                                .setTitle(`Профиль пользователя ${user.username}`)
                                .setThumbnail(user.displayAvatarURL())
                                .setTimestamp(Date.now())
                                .setDescription(`**ШАНСЫ НА РЕДКОСТИ**
\`Обычные предметы\` - ${userData.box_chances.common}x
\`Необычные предметы\` - ${userData.box_chances.uncommon}x
\`Редкие предметы\` - ${userData.box_chances.rare}x
\`Эпические предметы\` - ${userData.box_chances.epic}x
\`Легендарные предметы\` - ${userData.box_chances.legendary}x
\`Мифические предметы\` - ${userData.box_chances.mythical}x
\`Ультраредкие предметы\` - ${userData.box_chances.RNG}x`)
                            await selectMenu.components[0].options.forEach(option => {
                                if (option.data.value == value) {
                                    option.data.default = true
                                } else option.data.default = false
                            })
                            await i.update({
                                embeds: [chances],
                                components: [selectMenu, userMenu]
                            })
                        } else if (value == `about`) {
                            const bdata = await Birthday.findOne({ userid: user.id, guildid: guild.id })
                            let day
                            let month
                            if (bdata.day < 10) day = `0${bdata.day}`
                            else day = `${bdata.day}`

                            if (bdata.month == 1) month = `января`
                            else if (bdata.month == 2) month = `февраля`
                            else if (bdata.month == 3) month = `марта`
                            else if (bdata.month == 4) month = `апреля`
                            else if (bdata.month == 5) month = `мая`
                            else if (bdata.month == 6) month = `июня`
                            else if (bdata.month == 7) month = `июля`
                            else if (bdata.month == 8) month = `августа`
                            else if (bdata.month == 9) month = `сентября`
                            else if (bdata.month == 10) month = `октября`
                            else if (bdata.month == 11) month = `ноября`
                            else if (bdata.month == 12) month = `декабря`

                            let bday = `${day} ${month} ${bdata.year}`

                            const response = await fetch(`https://api.hypixel.net/guild?id=5c1902fc77ce84cd430f3959`, {
                                headers: {
                                    "API-Key": api,
                                    "Content-Type": "application/json"
                                }
                            })
                            let json
                            if (response.ok) json = await response.json()

                            let timestamp
                            let player = await json.guild.members.find(member => member.uuid == userData.uuid)
                            if (!player) timestamp = `\`Игрок не найден в гильдии\``
                            else timestamp = `<t:${Math.round(userData.joinedGuild / 1000)}:f>`
                            const about = new EmbedBuilder()
                                .setColor(Number(linksInfo.bot_color))
                                .setTitle(`Профиль пользователя ${user.username}`)
                                .setThumbnail(user.displayAvatarURL())
                                .setTimestamp(Date.now())
                                .setDescription(`**ИНФОРМАЦИЯ ОБ УЧАСТНИКЕ**
\`Имя\` - ${userData.displayname.name}
\`Возраст\` - ${userData.age} лет
\`Minecraft Nickname\` - \`${userData.nickname}\`
\`Дата вступления\` - ${timestamp}
\`День рождения\` - ${bday}`)
                            await selectMenu.components[0].options.forEach(option => {
                                if (option.data.value == value) {
                                    option.data.default = true
                                } else option.data.default = false
                            })
                            await i.update({
                                embeds: [about],
                                components: [selectMenu, userMenu]
                            })
                        }
                    }
                    else if (i.user.id !== interaction.user.id) {
                        await i.deferReply({ ephemeral: true, fetchReply: true })

                        if (value == `main`) {
                            await i.editReply({
                                embeds: [main]
                            })
                        } else if (value == `act`) {
                            const act = new EmbedBuilder()
                                .setColor(Number(linksInfo.bot_color))
                                .setTitle(`Профиль пользователя ${user.username}`)
                                .setThumbnail(user.displayAvatarURL())
                                .setTimestamp(Date.now())
                                .setDescription(`**УРОВЕНЬ АКТИВНОСТИ**
\`Прогресс\` - ${part1}/${part2}🌀
\`Уровень\` - ${userData.level}
\`Всего опыта\` - ${calcActLevel(0, userData.level, userData.exp)}🌀
\`Позиция\` - #${rank}`)
                            await i.editReply({
                                embeds: [act]
                            })
                        } else if (value == `elem`) {
                            const elem = new EmbedBuilder()
                                .setColor(Number(linksInfo.bot_color))
                                .setTitle(`Профиль пользователя ${user.username}`)
                                .setThumbnail(user.displayAvatarURL())
                                .setTimestamp(Date.now())
                                .setDescription(`**НАВЫКИ ПИТОМЦЕВ**
            
__**Земля**__
\`Выращивание горных пород\` - ${userData.elements.mountains}/1
\`Быстрый рост растений\` - ${userData.elements.fast_grow}/1
\`Перемещение под землёй\` - ${userData.elements.underground}/1

__**Вода**__
\`Плавание на глубине\` - ${userData.elements.diving}/1
\`Сопротивление течениям\` - ${userData.elements.resistance}/1
\`Подводное дыхание\` - ${userData.elements.respiration}/1

__**Огонь**__
\`Защита от огня\` - ${userData.elements.fire_resistance}/1
\`Удар молнии\` - ${userData.elements.lightning}/1
\`Управление пламенем\` - ${userData.elements.flame}/1

__**Воздух**__
\`Полёт в небесах\` - ${userData.elements.flying}/1
\`Повеление ветром\` - ${userData.elements.wind}/1
\`Орлиный глаз\` - ${userData.elements.eagle_eye}/1`)
                            await i.editReply({
                                embeds: [elem]
                            })
                        } else if (value == `perks`) {
                            const perks = new EmbedBuilder()
                                .setColor(Number(linksInfo.bot_color))
                                .setTitle(`Профиль пользователя ${user.username}`)
                                .setThumbnail(user.displayAvatarURL())
                                .setTimestamp(Date.now())
                                .setDescription(`**ПЕРКИ**
\`🔺 Повышение опыта рангов\` - ${userData.perks.rank_boost}/6
\`🔻 Скидка в королевском магазине\` - ${userData.perks.king_discount}/4
\`🔻 Скидка в магазине активности\` - ${userData.perks.act_discount}/3
\`🔻 Скидка в обычном магазине гильдии\` - ${userData.perks.shop_discount}/4
\`🕒 Увеличение времени действия временных предметов\` - ${userData.perks.temp_items}/1
\`💰 Возможность продавать предметы из профиля\` - ${userData.perks.sell_items}/1
\`🏷️ Уменьшение опыта гильдии для получения билета\` - ${userData.perks.ticket_discount}/5
\`✨ Изменение предметов\` - ${userData.perks.change_items}/1`)
                            await i.editReply({
                                embeds: [perks]
                            })
                        } else if (value == `shops`) {
                            const shops = new EmbedBuilder()
                                .setColor(Number(linksInfo.bot_color))
                                .setTitle(`Профиль пользователя ${user.username}`)
                                .setThumbnail(user.displayAvatarURL())
                                .setTimestamp(Date.now())
                                .setDescription(`**СТАТИСТИКА МАГАЗИНА ГИЛЬДИИ**
\`Куплено предметов\` - ${userData.buys.normal + userData.buys.king + userData.buys.activity} шт.
\`Куплено предметов в обычном магазине\` - ${userData.buys.normal} шт.
\`Куплено предметов в королевском магазине\` - ${userData.buys.king} шт.
\`Куплено предметов в магазине активности\` - ${userData.buys.activity} шт.
\`Потрачено румбиков\` - ${userData.buys.total_sum} <:Rumbik:883638847056003072>
\`Потрачено билетов\` - ${userData.buys.total_tickets} 🏷

\`Всего продано предметов\` - ${userData.sell.constellation + userData.sell.comet + userData.sell.other} шт.
\`Продано созвездий\` - ${userData.sell.constellation} шт.
\`Продано комет\` - ${userData.sell.comet} шт.
\`Продано других предметов\` - ${userData.sell.other} шт.
\`Продано предметов на сумму\` - ${userData.sell.total_sum} <:Rumbik:883638847056003072>`)
                            await i.editReply({
                                embeds: [shops]
                            })
                        } else if (value == `gexp`) {
                            const response = await fetch(`https://api.hypixel.net/guild?id=5c1902fc77ce84cd430f3959`, {
                                headers: {
                                    "API-Key": api,
                                    "Content-Type": "application/json"
                                }
                            })
                            let json
                            if (response.ok) json = await response.json()
                            let gexp_nums
                            let sum
                            let map
                            let player = await json.guild.members.find(member => member.uuid == userData.uuid)
                            if (!player) {
                                map = `Не удалось найти пользователя в гильдии!`
                                sum = 0
                            } else {
                                gexp_nums = Object.entries(player.expHistory)
                                sum = 0
                                map = gexp_nums.map(([key, value]) => {
                                    sum += value
                                    let sp = key.split(`-`)
                                    let date = `${sp[2]}.${sp[1]}.${sp[0]}`
                                    return `• \`${date}\` - ${value} GEXP`
                                }).join(`\n`)
                            }



                            const gexp = new EmbedBuilder()
                                .setColor(Number(linksInfo.bot_color))
                                .setTitle(`Профиль пользователя ${user.username}`)
                                .setThumbnail(user.displayAvatarURL())
                                .setTimestamp(Date.now())
                                .setDescription(`**ОПЫТ ГИЛЬДИИ УЧАСТНИКА**
Никнейм: \`${userData.nickname}\`
__**Опыт гильдии**__:
${map}

**Опыта гильдии за последние 7 дней**: ${sum} GEXP`)
                            await i.editReply({
                                embeds: [gexp]
                            })
                        } else if (value == `achievements`) {

                            let n_unclaimed = []

                            for (let norm of rolesInfo.achievements_normal) {
                                if (!member.roles.cache.has(norm)) {
                                    n_unclaimed.push(norm)
                                }
                            }

                            let m_unclaimed = []

                            for (let myth of rolesInfo.achievements_myth) {
                                if (!member.roles.cache.has(myth)) {
                                    m_unclaimed.push(myth)
                                }
                            }

                            let n_map


                            if (n_unclaimed.length <= 0) {
                                n_map = `🎉 Вы выполнили все обычные достижения! Поздравляем! ✨`
                            } else {
                                n_map = n_unclaimed.map((norm, i) => {
                                    return `**${++i}.** <@&${norm}>`
                                }).join(`\n`)
                            }
                            let m_map
                            if (m_unclaimed.length <= 0) {
                                m_map = `🎉 Вы выполнили все мифические достижения! Поздравляем! ✨`
                            } else {
                                m_map = m_unclaimed.map((myth, i) => {
                                    return `**${++i}.** <@&${myth}>`
                                }).join(`\n`)
                            }
                            const achievements = new EmbedBuilder()
                                .setColor(Number(linksInfo.bot_color))
                                .setTitle(`Профиль пользователя ${user.username}`)
                                .setThumbnail(user.displayAvatarURL())
                                .setTimestamp(Date.now())
                                .setDescription(`**ДОСТИЖЕНИЯ ГИЛЬДИИ**
__**Общая информация**__
\`Обычные достижения\` - ${userData.achievements.normal}/${rolesInfo.achievements_normal.length}
\`Мифические достижения\` - ${userData.achievements.mythical}/${rolesInfo.achievements_myth.length}

__**Неполученные достижения**__
__Обычные достижения__
${n_map}

__Мифические достижения__
${m_map}`)
                            await i.editReply({
                                embeds: [achievements]
                            })
                        } else if (value == `quests`) {
                            let total = userData.quests.seasonal.stats.hw.total + userData.quests.seasonal.stats.ny.total + userData.quests.seasonal.stats.ea.total + userData.quests.seasonal.stats.su.total
                            const quests = new EmbedBuilder()
                                .setColor(Number(linksInfo.bot_color))
                                .setTitle(`Профиль пользователя ${user.username}`)
                                .setThumbnail(user.displayAvatarURL())
                                .setTimestamp(Date.now())
                                .setDescription(`**СТАТИСТИКА КВЕСТОВ И МАРАФОНА**
__**Марафон**__
\`Выполнено стадий\` - ${userData.quests.marathon.stats.total_stages}
\`Пройдено раз\` - ${userData.quests.marathon.stats.total_mar}

__**Задания для ветеранов**__
\`Выполнено заданий\` - ${userData.quests.veterans.stats.total}

__**Квесты "Новое начало"**__
\`Выполнено заданий\` - ${userData.quests.kings.stats.total}/4\\*
\\*Задание с достижениями не учитывается

__**Задания Марса**__
\`Выполнено заданий\` - ${userData.quests.mars.stats.total}

__**Сезонное**__
\`Хэллоуинские квесты\` - ${userData.quests.seasonal.stats.hw.total}
\`Новогодние квесты\` - ${userData.quests.seasonal.stats.ny.total}
\`Пасхальные квесты\` - ${userData.quests.seasonal.stats.ea.total}
\`Летние квесты\` - ${userData.quests.seasonal.stats.su.total}
__**\`Всего\`**__ - ${total}`)
                            await i.editReply({
                                embeds: [quests]
                            })
                        } else if (value == `boosters`) {
                            const boosters = new EmbedBuilder()
                                .setColor(Number(linksInfo.bot_color))
                                .setTitle(`Профиль пользователя ${user.username}`)
                                .setThumbnail(user.displayAvatarURL())
                                .setTimestamp(Date.now())
                                .setDescription(`**МНОЖИТЕЛИ**
\`Множитель опыта активности\` - ${userData.pers_act_boost}x
\`Множитель опыта рангов\` - ${userData.pers_rank_boost}x
\`Множитель румбиков\` - ${userData.pers_rumb_boost}x
\`Множитель цен товаров в стандартном магазине\` - ${userData.shop_costs}x
\`Множитель цен товаров в магазине активности\` - ${userData.act_costs}x
\`Множитель цен товаров в королевском магазине\` - ${userData.king_costs}x`)
                            await i.editReply({
                                embeds: [boosters]
                            })
                        } else if (value == `colors`) {
                            const colors = new EmbedBuilder()
                                .setColor(Number(linksInfo.bot_color))
                                .setTitle(`Профиль пользователя ${user.username}`)
                                .setThumbnail(user.displayAvatarURL())
                                .setTimestamp(Date.now())
                                .setDescription(`**ПОЛЬЗОВАТЕЛЬСКИЙ ЦВЕТ**
\`Наличие\` - ${userData.custom_color.created ? `Создан` : `Не создан`}
\`Цветовой код\` - ${userData.custom_color?.hex ? userData.custom_color?.hex : `Цветовой код отсутствует`}
\`Имя роли\` - ${userData.custom_color?.custom_name ? userData.custom_color?.custom_name : `ЛИЧНЫЙ ЦВЕТ`} 
\`Роль\` - ${colorRole}`)
                            await i.editReply({
                                embeds: [colors]
                            })
                        } else if (value == `chances`) {
                            const chances = new EmbedBuilder()
                                .setColor(Number(linksInfo.bot_color))
                                .setTitle(`Профиль пользователя ${user.username}`)
                                .setThumbnail(user.displayAvatarURL())
                                .setTimestamp(Date.now())
                                .setDescription(`**ШАНСЫ НА РЕДКОСТИ**
\`Обычные предметы\` - ${userData.box_chances.common}x
\`Необычные предметы\` - ${userData.box_chances.uncommon}x
\`Редкие предметы\` - ${userData.box_chances.rare}x
\`Эпические предметы\` - ${userData.box_chances.epic}x
\`Легендарные предметы\` - ${userData.box_chances.legendary}x
\`Мифические предметы\` - ${userData.box_chances.mythical}x
\`Ультраредкие предметы\` - ${userData.box_chances.RNG}x`)

                            await i.editReply({
                                embeds: [chances],
                            })
                        } else if (value == `about`) {
                            const bdata = await Birthday.findOne({ userid: user.id, guildid: guild.id })
                            let day
                            let month
                            if (bdata.day < 10) day = `0${bdata.day}`
                            else day = `${bdata.day}`

                            if (bdata.month == 1) month = `января`
                            else if (bdata.month == 2) month = `февраля`
                            else if (bdata.month == 3) month = `марта`
                            else if (bdata.month == 4) month = `апреля`
                            else if (bdata.month == 5) month = `мая`
                            else if (bdata.month == 6) month = `июня`
                            else if (bdata.month == 7) month = `июля`
                            else if (bdata.month == 8) month = `августа`
                            else if (bdata.month == 9) month = `сентября`
                            else if (bdata.month == 10) month = `октября`
                            else if (bdata.month == 11) month = `ноября`
                            else if (bdata.month == 12) month = `декабря`

                            let bday = `${day} ${month} ${bdata.year}`
                            const response = await fetch(`https://api.hypixel.net/guild?id=5c1902fc77ce84cd430f3959`, {
                                headers: {
                                    "API-Key": api,
                                    "Content-Type": "application/json"
                                }
                            })
                            let json
                            if (response.ok) json = await response.json()
                            let timestamp
                            let player = await json.guild.members.find(member => member.uuid == userData.uuid)
                            if (!player) timestamp = `\`Игрок не найден в гильдии\``
                            else timestamp = `<t:${Math.round(userData.joinedGuild / 1000)}:f>`
                            const about = new EmbedBuilder()
                                .setColor(Number(linksInfo.bot_color))
                                .setTitle(`Профиль пользователя ${user.username}`)
                                .setThumbnail(user.displayAvatarURL())
                                .setTimestamp(Date.now())
                                .setDescription(`**ИНФОРМАЦИЯ ОБ УЧАСТНИКЕ**
\`Имя\` - ${userData.displayname.name}
\`Возраст\` - ${userData.age} лет
\`Minecraft Nickname\` - \`${userData.nickname}\`
\`Дата вступления\` - ${timestamp}
\`День рождения\` - ${bday}`)

                            await i.editReply({
                                embeds: [about]
                            })
                        }
                    }
                } else if (i.customId == `usermenu`) {
                    await i.deferReply({ fetchReply: true })

                    if (interaction.user.id == i.user.id) {
                        const us = await guild.members.fetch(i.values[0])
                        user = us.user
                        member = us
                        users = await User.find().then(users => {
                            return users.filter(async user => await guild.members.fetch(user.userid))
                        })
                        sort1 = users.sort((a, b) => {
                            return b.exp - a.exp
                        })
                        sorts = sort1.sort((a, b) => {
                            return b.level - a.level
                        })
                        let iT = 0
                        while (sorts[iT].userid !== user.id) {
                            iT++
                        }
                        userData = sorts[iT]
                        if (!userData) {
                            await i.editReply({
                                content: `Не удалось найти информацию о данном пользователе!`,
                                fetchReply: true
                            })
                            await wait(10000)
                            await i.deleteReply()
                            return
                        }
                        await i.deleteReply()
                        rank = iT + 1
                        neededXP = 5 * (Math.pow(userData.level, 2)) + (50 * userData.level) + 100;
                        part1
                        part2
                        if (userData.exp >= 1000) {
                            part1 = (userData.exp / 1000).toFixed(1) + `k`
                        } else part1 = userData.exp
                        if (neededXP >= 1000) {
                            part2 = (neededXP / 1000).toFixed(1) + `k`
                        } else part2 = neededXP
                        colorRole = await guild.roles.fetch(userData.custom_color?.role ? userData.custom_color.role : `nn`)
                        if (!colorRole) colorRole = `Не создана`
                        let def = `main`
                        main.setColor(Number(linksInfo.bot_color))
                            .setTitle(`Профиль пользователя ${user.username}`)
                            .setThumbnail(user.displayAvatarURL())
                            .setTimestamp(Date.now())
                            .setDescription(
                                `**ОСНОВНОЕ**
\`Ранг в гильдии\` - ${rankName(userData.rank_number)}
\`Румбики\` - ${userData.rumbik}<:Rumbik:883638847056003072>
\`Опыт рангов\` - ${userData.rank}💠
\`Посещено совместных игр\` - ${userData.visited_games} игр
\`Билеты\` - ${userData.tickets}🏷
\`Опыта гильдии сохранено\` - ${userData.gexp} GEXP
\`Медаль 🥇\` - ${userData.medal_1} шт.
\`Медаль 🥈\` - ${userData.medal_2} шт.
\`Медаль 🥉\` - ${userData.medal_3} шт.
\`Собрано звёздных комплектов\` - ${userData.starway.current} ✨
\`Неполученных предметов\` - ${userData.stacked_items.length}
\`Сброшен профиль\` - ${userData.times_reset} раз`)

                        await selectMenu.components[0].options.forEach(option => {
                            if (option.data.value == def) {
                                option.data.default = true
                            } else option.data.default = false
                        })
                        await interaction.editReply({
                            embeds: [main],
                            components: [selectMenu, userMenu],
                            fetchReply: true
                        })
                    } else if (interaction.user.id !== i.user.id) {

                        const us = await guild.members.fetch(i.values[0])

                        let userT = us.user
                        let memberT = us
                        let usersT = await User.find().then(users => {
                            return users.filter(async user => await guild.members.fetch(user.userid))
                        })
                        let sort1T = usersT.sort((a, b) => {
                            return b.exp - a.exp
                        })
                        let sortsT = sort1T.sort((a, b) => {
                            return b.level - a.level
                        })
                        let iT = 0
                        while (sortsT[iT].userid !== user.id) {
                            iT++
                        }
                        let userDataT = sortsT[iT]
                        if (!userDataT) {
                            await i.editReply({
                                content: `Не удалось найти информацию о данном пользователе!`,
                                fetchReply: true
                            })
                            await wait(10000)
                            await i.deleteReply()
                            return
                        }
                        let rankT = iT + 1
                        let neededXPT = 5 * (Math.pow(userDataT.level, 2)) + (50 * userDataT.level) + 100;
                        let part1T
                        let part2T
                        if (userDataT.exp >= 1000) {
                            part1T = (userDataT.exp / 1000).toFixed(1) + `k`
                        } else part1T = userDataT.exp
                        if (neededXPT >= 1000) {
                            part2T = (neededXPT / 1000).toFixed(1) + `k`
                        } else part2T = neededXPT
                        let colorRoleT = await guild.roles.fetch(userDataT.custom_color?.role ? userDataT.custom_color.role : `nn`)
                        if (!colorRoleT) colorRoleT = `Не создана`
                        const mainT = new EmbedBuilder()
                            .setColor(Number(linksInfo.bot_color))
                            .setTitle(`Профиль пользователя ${userT.username}`)
                            .setThumbnail(userT.displayAvatarURL())
                            .setTimestamp(Date.now())
                            .setDescription(
                                `**ОСНОВНОЕ**
\`Ранг в гильдии\` - ${rankName(userDataT.rank_number)}
\`Румбики\` - ${userDataT.rumbik}<:Rumbik:883638847056003072>
\`Опыт рангов\` - ${userDataT.rank}💠
\`Посещено совместных игр\` - ${userDataT.visited_games} игр
\`Билеты\` - ${userDataT.tickets}🏷
\`Опыта гильдии сохранено\` - ${userDataT.gexp} GEXP
\`Медаль 🥇\` - ${userDataT.medal_1} шт.
\`Медаль 🥈\` - ${userDataT.medal_2} шт.
\`Медаль 🥉\` - ${userDataT.medal_3} шт.
\`Собрано звёздных комплектов\` - ${userDataT.starway.current} ✨
\`Неполученных предметов\` - ${userDataT.stacked_items.length}
\`Сброшен профиль\` - ${userDataT.times_reset} раз`)


                        await i.editReply({
                            embeds: [mainT],
                            ephemeral: true
                        })
                    }

                }
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
**Команда**: \`${interaction.commandName}\`
**Пользователь**: ${interaction.member}
**Использовано на пользователе**: ${interaction.targetUser.id}
**Опции**: \`\`\`json
${interaction.options.data.length <= 0 ? `{"status": false}` : options.join(`,\n`)}
\`\`\``)
            await admin.send(`◾`)
        }

    }
}