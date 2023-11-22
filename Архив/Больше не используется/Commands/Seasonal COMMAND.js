const { Birthday } = require(`../../../src/schemas/birthday`)
const { Temp } = require(`../../../src/schemas/temp_items`)
const { User } = require(`../../../src/schemas/userdata`)
const { Guild } = require(`../../../src/schemas/guilddata`)
const chalk = require(`chalk`)
const fetch = require(`node-fetch`)
const cron = require(`node-cron`)
const prettyMilliseconds = require(`pretty-ms`)
const ch_list = require(`../../../src/discord structure/channels.json`)
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js")
const { execute } = require('../../../src/events/client/start_bot/ready');
const { achievementStats, found, getProperty } = require(`../../../src/functions`)
const linksInfo = require(`../../../src/discord structure/links.json`)
const api = process.env.hypixel_apikey

module.exports = {
    category: `seasons`,
    plugin: `info`,
    data: new SlashCommandBuilder()
        .setName(`seasonal`)
        .setDescription(`Команды сезонных мероприятий`)
        .setDMPermission(false)
        .addSubcommandGroup(gr => gr
            .setName(`halloween`)
            .setDescription(`Хэллоуинские мероприятия`)
            .addSubcommand(sb => sb
                .setName(`achievement`)
                .setDescription(`Хэллоуинские достижения`)
                .addStringOption(o => o
                    .setName(`достижение`)
                    .setDescription(`Выберите достижение, которое хотите получить`)
                    .setRequired(true)
                    .setChoices(
                        {
                            name: `№1. Призраки`,
                            value: `№1. Призраки`
                        },
                        {
                            name: `№2. Полтинник`,
                            value: `№2. Полтинник`
                        },
                        {
                            name: `№3. Хэллоуин`,
                            value: `№3. Хэллоуин`
                        },
                        {
                            name: `№4. Жуть`,
                            value: `№4. Жуть`
                        },
                        {
                            name: `№5. Душа`,
                            value: `№5. Душа`
                        },
                        {
                            name: `№6. Задания`,
                            value: `№6. Задания`
                        }
                    )
                )
            )
            .addSubcommand(sb => sb
                .setName(`stats`)
                .setDescription(`Посмотреть хэллоуинскую статистику`)
                .addUserOption(o => o
                    .setName(`пользователь`)
                    .setDescription(`Посмотреть статистику пользователя`))
            )
            .addSubcommand(sb => sb
                .setName(`leaderboards`)
                .setDescription(`Лучшие участники в период Хэллоуина`)
            )
            .addSubcommand(sb => sb
                .setName(`quest`)
                .setDescription(`Получить ежедневный хэллоуинский квест`)
                .addStringOption(o => o
                    .setName(`действие`)
                    .setDescription(`Выберите, что вы хотите сделать с квестом`)
                    .addChoices(
                        {
                            name: `Начать квест`,
                            value: `start`
                        },
                        {
                            name: `Закончить квест`,
                            value: `finish`
                        },

                    )
                    .setRequired(true)
                )
            )
            .addSubcommand(sb => sb
                .setName(`buy`)
                .setDescription(`Приобрести хэллоуинский товар`)
                .addStringOption(o => o
                    .setName(`товар`)
                    .setDescription(`Выберите товар для покупки`)
                    .setRequired(true)
                    .setChoices(
                        {
                            name: `Косметический значок 🎱`,
                            value: `🎱`
                        },
                        {
                            name: `Косметический значок 👹`,
                            value: `👹`
                        },
                        {
                            name: `Косметический значок 🩸`,
                            value: `🩸`
                        },
                        {
                            name: `Косметический значок 🧥`,
                            value: `🧥`
                        },
                        {
                            name: `Косметический значок 💀`,
                            value: `💀`
                        },
                        {
                            name: `Косметический значок 🧛`,
                            value: `🧛`
                        },
                    ))
            )
        )
        .addSubcommandGroup(gr => gr
            .setName(`newyear`)
            .setDescription(`Новогодние мероприятия`)
            .addSubcommand(sb => sb
                .setName(`achievement`)
                .setDescription(`Новогодние достижения`)
                .addStringOption(o => o
                    .setName(`достижение`)
                    .setDescription(`Выберите достижение, которое хотите получить`)
                    .setRequired(true)
                    .setChoices(
                        {
                            name: `№1. Санта`,
                            value: `№1. Санта`
                        },
                        {
                            name: `№2. Подарки`,
                            value: `№2. Подарки`
                        },
                        {
                            name: `№3. Квесты`,
                            value: `№3. Квесты`
                        },
                        {
                            name: `№4. Календарь`,
                            value: `№4. Календарь`
                        },
                        {
                            name: `№5. С Новым Годом!`,
                            value: `№5. С Новым Годом!`
                        },
                        {
                            name: `№6. Потерянный костюм`,
                            value: `№6. Потерянный костюм`
                        },

                    )
                )
            )
            .addSubcommand(sb => sb
                .setName(`stats`)
                .setDescription(`Посмотреть новогоднюю статистику`)
                .addUserOption(o => o
                    .setName(`пользователь`)
                    .setDescription(`Посмотреть статистику пользователя`))
            )
            .addSubcommand(sb => sb
                .setName(`leaderboards`)
                .setDescription(`Лучшие участники в период Нового года`)
            )
            .addSubcommand(sb => sb
                .setName(`quest`)
                .setDescription(`Получить ежедневный новогодний квест`)
                .addStringOption(o => o
                    .setName(`действие`)
                    .setDescription(`Выберите, что вы хотите сделать с квестом`)
                    .addChoices(
                        {
                            name: `Начать квест`,
                            value: `start`
                        },
                        {
                            name: `Закончить квест`,
                            value: `finish`
                        },

                    )
                    .setRequired(true)
                )
            )
            .addSubcommand(sb => sb
                .setName(`buy`)
                .setDescription(`Приобрести новогодний товар`)
                .addStringOption(o => o
                    .setName(`товар`)
                    .setDescription(`Выберите товар для покупки`)
                    .setRequired(true)
                    .setChoices(
                        {
                            name: `Косметический значок 🎄`,
                            value: `🎄`
                        },
                        {
                            name: `Косметический значок ✨`,
                            value: `✨`
                        },
                        {
                            name: `Косметический значок 🎆`,
                            value: `🎆`
                        },
                        {
                            name: `Косметический значок 🎁`,
                            value: `🎁`
                        },
                        {
                            name: `Косметический значок 🎇`,
                            value: `🎇`
                        },
                        {
                            name: `Косметический значок 🎈`,
                            value: `🎈`
                        },
                    )
                )
            )
        ),
    async execute(interaction, client) {
        try {
            const guildData = await Guild.findOne({ id: interaction.guild.id })
            if (guildData.plugins.seasonal === false) return interaction.reply({ content: `Данный плагин отключён! Попробуйте позже!`, ephemeral: true })
            const member = interaction.member

            switch (interaction.options.getSubcommandGroup()) {
                case `halloween`: {
                    if (guildData.seasonal.halloween.enabled === false) return interaction.reply({
                        content: `Сейчас не время для Хэллоуина! Попробуйте ввести эту команду в период **7 октября по 7 ноября**!`,
                        ephemeral: true
                    })

                    switch (interaction.options.getSubcommand()) {
                        case `achievement`: {
                            const userData = await User.findOne({ userid: interaction.user.id, guildid: interaction.guild.id })
                            const achievement = interaction.options.getString(`достижение`)
                            switch (achievement) {
                                case `№1. Призраки`: {
                                    const already_done = new EmbedBuilder()
                                        .setColor(`DarkRed`)
                                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                                        .setAuthor({
                                            name: `❗ Достижение уже выполнено!`
                                        })
                                        .setDescription(`Вы не можете выполнить данное достижение, так как вы уже выполнили его! Найти его вы можете в своем профиле.
    
Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)


                                    if (userData.seasonal.halloween.achievements.num1 === true) return interaction.reply({
                                        embeds: [already_done],
                                        ephemeral: true
                                    })

                                    const no_condition = new EmbedBuilder()
                                        .setColor(`DarkRed`)
                                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                                        .setAuthor({
                                            name: `❗ Вы не соответствуете требованиям!`
                                        })
                                        .setDescription(`Вы не соответствуете требованиям для получения данного достижения! Проверить требования вы можете в канале <#${ch_list.hw_achs}>.
    
Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)
                                        .setTimestamp(Date.now())

                                    if (!member.roles.cache.has(`893927886766096384`)) return interaction.reply({
                                        embeds: [no_condition],
                                        ephemeral: true
                                    })
                                    let reward = `893932177799135253`
                                    const has_reward = new EmbedBuilder()
                                        .setColor(`DarkRed`)
                                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                                        .setAuthor({
                                            name: `❗ Вы имеете награду!`
                                        })
                                        .setDescription(`У вас уже есть награда за данное достижение! Пожалуйста, откройте <@&${reward}>, чтобы выполнить достижение.
    
Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)
                                        .setTimestamp(Date.now())
                                    if (member.roles.cache.has(reward)) return interaction.reply({
                                        embeds: [has_reward],
                                        ephemeral: true
                                    })
                                    userData.seasonal.halloween.achievements.num1 = true
                                    await member.roles.add(reward)
                                    userData.rank += 50
                                    userData.exp += 300;
                                    userData.seasonal.halloween.points += 5
                                    userData.save()
                                    client.ActExp(userData.userid)
                                    const condition_meet = new EmbedBuilder()
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/Xa6HxCU.png`)
                                        .setTitle(`✅ Достижение выполнено!`)
                                        .setTimestamp(Date.now())
                                        .setDescription(`${member} выполнил достижение \`${interaction.options.getString(`достижение`)}\`!
Он уже получил достижение! Хочешь и ты? Тогда тебе в <#1029662737497866300>

Чтобы проверить статистику ваших достижения, используйте команду \`/seasonal halloween stats\`!`)


                                    await interaction.guild.channels.cache.get(ch_list.act).send(
                                        `╒══════════════════╕
${member} +300 🌀
\`Выполнение достижения.\`
╘══════════════════╛`)

                                    await interaction.guild.channels.cache.get(ch_list.rank).send(
                                        `╒══════════════════╕
${member} +50 💠
\`Выполнение достижения.\`
╘══════════════════╛`)
                                    await interaction.reply({
                                        embeds: [condition_meet]
                                    })
                                    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magenta(`[Выполнено достижение]` + chalk.gray(`: ${member.user.username} выполнил достижение ${interaction.options.getString(`достижение`)}!`)))


                                }
                                    break;
                                case `№2. Полтинник`: {
                                    const already_done = new EmbedBuilder()
                                        .setColor(`DarkRed`)
                                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                                        .setAuthor({
                                            name: `❗ Достижение уже выполнено!`
                                        })
                                        .setDescription(`Вы не можете выполнить данное достижение, так как вы уже выполнили его! Найти его вы можете в своем профиле.

Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)


                                    if (userData.seasonal.halloween.achievements.num2 === true) return interaction.reply({
                                        embeds: [already_done],
                                        ephemeral: true
                                    })

                                    const no_condition = new EmbedBuilder()
                                        .setColor(`DarkRed`)
                                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                                        .setAuthor({
                                            name: `❗ Вы не соответствуете требованиям!`
                                        })
                                        .setDescription(`Вы не соответствуете требованиям для получения данного достижения! Проверить требования вы можете в канале <#${ch_list.hw_achs}>.

Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)
                                        .setTimestamp(Date.now())

                                    if (userData.seasonal.halloween.points < 50) return interaction.reply({
                                        embeds: [no_condition],
                                        ephemeral: true
                                    })
                                    let reward = `893932177799135253`
                                    const has_reward = new EmbedBuilder()
                                        .setColor(`DarkRed`)
                                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                                        .setAuthor({
                                            name: `❗ Вы имеете награду!`
                                        })
                                        .setDescription(`У вас уже есть награда за данное достижение! Пожалуйста, откройте <@&${reward}>, чтобы выполнить достижение.

Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)
                                        .setTimestamp(Date.now())
                                    if (member.roles.cache.has(reward)) return interaction.reply({
                                        embeds: [has_reward],
                                        ephemeral: true
                                    })
                                    userData.seasonal.halloween.achievements.num2 = true
                                    await member.roles.add(reward)
                                    userData.rank += 50
                                    userData.exp += 300;
                                    userData.seasonal.halloween.points += 5
                                    userData.save()
                                    client.ActExp(userData.userid)
                                    const condition_meet = new EmbedBuilder()
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/Xa6HxCU.png`)
                                        .setTitle(`✅ Достижение выполнено!`)
                                        .setTimestamp(Date.now())
                                        .setDescription(`${member} выполнил достижение \`${interaction.options.getString(`достижение`)}\`!
Он уже получил достижение! Хочешь и ты? Тогда тебе в <#1029662737497866300>

Чтобы проверить статистику ваших достижения, используйте команду \`/seasonal halloween stats\`!`)


                                    await interaction.guild.channels.cache.get(ch_list.act).send(
                                        `╒══════════════════╕
${member} +300 🌀
\`Выполнение достижения.\`
╘══════════════════╛`)

                                    await interaction.guild.channels.cache.get(ch_list.rank).send(
                                        `╒══════════════════╕
${member} +50 💠
\`Выполнение достижения.\`
╘══════════════════╛`)
                                    await interaction.reply({
                                        embeds: [condition_meet]
                                    })
                                    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magenta(`[Выполнено достижение]` + chalk.gray(`: ${member.user.username} выполнил достижение ${interaction.options.getString(`достижение`)}!`)))
                                }
                                    break;
                                case `№3. Хэллоуин`: {
                                    const already_done = new EmbedBuilder()
                                        .setColor(`DarkRed`)
                                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                                        .setAuthor({
                                            name: `❗ Достижение уже выполнено!`
                                        })
                                        .setDescription(`Вы не можете выполнить данное достижение, так как вы уже выполнили его! Найти его вы можете в своем профиле.

Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)


                                    if (userData.seasonal.halloween.achievements.num3 === true) return interaction.reply({
                                        embeds: [already_done],
                                        ephemeral: true
                                    })
                                    const date = new Date()
                                    const day = date.getDate()
                                    const month = date.getMonth() + 1


                                    const no_condition = new EmbedBuilder()
                                        .setColor(`DarkRed`)
                                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                                        .setAuthor({
                                            name: `❗ Вы не соответствуете требованиям!`
                                        })
                                        .setDescription(`Вы не соответствуете требованиям для получения данного достижения! Проверить требования вы можете в канале <#${ch_list.hw_achs}>.

Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)
                                        .setTimestamp(Date.now())

                                    if (day !== 31 || month !== 10 || userData.seasonal.halloween.hw_msg !== true) return interaction.reply({
                                        embeds: [no_condition],
                                        ephemeral: true
                                    })
                                    let reward = `893932177799135253`
                                    const has_reward = new EmbedBuilder()
                                        .setColor(`DarkRed`)
                                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                                        .setAuthor({
                                            name: `❗ Вы имеете награду!`
                                        })
                                        .setDescription(`У вас уже есть награда за данное достижение! Пожалуйста, откройте <@&${reward}>, чтобы выполнить достижение.

Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)
                                        .setTimestamp(Date.now())
                                    if (member.roles.cache.has(reward)) return interaction.reply({
                                        embeds: [has_reward],
                                        ephemeral: true
                                    })
                                    userData.seasonal.halloween.achievements.num3 = true
                                    await member.roles.add(reward)
                                    userData.rank += 50
                                    userData.exp += 300;
                                    userData.seasonal.halloween.points += 5
                                    userData.save()
                                    client.ActExp(userData.userid)
                                    const condition_meet = new EmbedBuilder()
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/Xa6HxCU.png`)
                                        .setTitle(`✅ Достижение выполнено!`)
                                        .setTimestamp(Date.now())
                                        .setDescription(`${member} выполнил достижение \`${interaction.options.getString(`достижение`)}\`!
Он уже получил достижение! Хочешь и ты? Тогда тебе в <#1029662737497866300>

Чтобы проверить статистику ваших достижения, используйте команду \`/seasonal halloween stats\`!`)


                                    await interaction.guild.channels.cache.get(ch_list.act).send(
                                        `╒══════════════════╕
${member} +300 🌀
\`Выполнение достижения.\`
╘══════════════════╛`)

                                    await interaction.guild.channels.cache.get(ch_list.rank).send(
                                        `╒══════════════════╕
${member} +50 💠
\`Выполнение достижения.\`
╘══════════════════╛`)
                                    await interaction.reply({
                                        embeds: [condition_meet]
                                    })
                                    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magenta(`[Выполнено достижение]` + chalk.gray(`: ${member.user.username} выполнил достижение ${interaction.options.getString(`достижение`)}!`)))
                                }
                                    break;
                                case `№4. Жуть`: {
                                    const already_done = new EmbedBuilder()
                                        .setColor(`DarkRed`)
                                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                                        .setAuthor({
                                            name: `❗ Достижение уже выполнено!`
                                        })
                                        .setDescription(`Вы не можете выполнить данное достижение, так как вы уже выполнили его! Найти его вы можете в своем профиле.

Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)


                                    if (userData.seasonal.halloween.achievements.num4 === true) return interaction.reply({
                                        embeds: [already_done],
                                        ephemeral: true
                                    })

                                    const no_condition = new EmbedBuilder()
                                        .setColor(`DarkRed`)
                                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                                        .setAuthor({
                                            name: `❗ Вы не соответствуете требованиям!`
                                        })
                                        .setDescription(`Вы не соответствуете требованиям для получения данного достижения! Проверить требования вы можете в канале <#${ch_list.hw_achs}>.

Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)
                                        .setTimestamp(Date.now())

                                    if (userData.seasonal.halloween.hw_cosm == false) return interaction.reply({
                                        embeds: [no_condition],
                                        ephemeral: true
                                    })
                                    let reward = `893932177799135253`
                                    const has_reward = new EmbedBuilder()
                                        .setColor(`DarkRed`)
                                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                                        .setAuthor({
                                            name: `❗ Вы имеете награду!`
                                        })
                                        .setDescription(`У вас уже есть награда за данное достижение! Пожалуйста, откройте <@&${reward}>, чтобы выполнить достижение.

Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)
                                        .setTimestamp(Date.now())
                                    if (member.roles.cache.has(reward)) return interaction.reply({
                                        embeds: [has_reward],
                                        ephemeral: true
                                    })
                                    userData.seasonal.halloween.achievements.num4 = true
                                    await member.roles.add(reward)
                                    userData.rank += 50
                                    userData.exp += 300;
                                    userData.seasonal.halloween.points += 5
                                    userData.save()
                                    client.ActExp(userData.userid)
                                    const condition_meet = new EmbedBuilder()
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/Xa6HxCU.png`)
                                        .setTitle(`✅ Достижение выполнено!`)
                                        .setTimestamp(Date.now())
                                        .setDescription(`${member} выполнил достижение \`${interaction.options.getString(`достижение`)}\`!
Он уже получил достижение! Хочешь и ты? Тогда тебе в <#1029662737497866300>

Чтобы проверить статистику ваших достижения, используйте команду \`/seasonal halloween stats\`!`)


                                    await interaction.guild.channels.cache.get(ch_list.act).send(
                                        `╒══════════════════╕
${member} +300 🌀
\`Выполнение достижения.\`
╘══════════════════╛`)

                                    await interaction.guild.channels.cache.get(ch_list.rank).send(
                                        `╒══════════════════╕
${member} +50 💠
\`Выполнение достижения.\`
╘══════════════════╛`)
                                    await interaction.reply({
                                        embeds: [condition_meet]
                                    })
                                    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magenta(`[Выполнено достижение]` + chalk.gray(`: ${member.user.username} выполнил достижение ${interaction.options.getString(`достижение`)}!`)))
                                }
                                    break;
                                case `№5. Душа`: {
                                    const already_done = new EmbedBuilder()
                                        .setColor(`DarkRed`)
                                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                                        .setAuthor({
                                            name: `❗ Достижение уже выполнено!`
                                        })
                                        .setDescription(`Вы не можете выполнить данное достижение, так как вы уже выполнили его! Найти его вы можете в своем профиле.

Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)


                                    if (userData.seasonal.halloween.achievements.num5 === true) return interaction.reply({
                                        embeds: [already_done],
                                        ephemeral: true
                                    })

                                    const no_condition = new EmbedBuilder()
                                        .setColor(`DarkRed`)
                                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                                        .setAuthor({
                                            name: `❗ Вы не соответствуете требованиям!`
                                        })
                                        .setDescription(`Вы не соответствуете требованиям для получения данного достижения! Проверить требования вы можете в канале <#${ch_list.hw_achs}>.

Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)
                                        .setTimestamp(Date.now())

                                    if (userData.seasonal.halloween.hw_soul == false) return interaction.reply({
                                        embeds: [no_condition],
                                        ephemeral: true
                                    })
                                    let reward = `893932177799135253`
                                    const has_reward = new EmbedBuilder()
                                        .setColor(`DarkRed`)
                                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                                        .setAuthor({
                                            name: `❗ Вы имеете награду!`
                                        })
                                        .setDescription(`У вас уже есть награда за данное достижение! Пожалуйста, откройте <@&${reward}>, чтобы выполнить достижение.

Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)
                                        .setTimestamp(Date.now())
                                    if (member.roles.cache.has(reward)) return interaction.reply({
                                        embeds: [has_reward],
                                        ephemeral: true
                                    })
                                    userData.seasonal.halloween.achievements.num5 = true
                                    await member.roles.add(reward)
                                    userData.rank += 50
                                    userData.exp += 300;
                                    userData.seasonal.halloween.points += 5
                                    userData.save()
                                    client.ActExp(userData.userid)
                                    const condition_meet = new EmbedBuilder()
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/Xa6HxCU.png`)
                                        .setTitle(`✅ Достижение выполнено!`)
                                        .setTimestamp(Date.now())
                                        .setDescription(`${member} выполнил достижение \`${interaction.options.getString(`достижение`)}\`!
Он уже получил достижение! Хочешь и ты? Тогда тебе в <#1029662737497866300>

Чтобы проверить статистику ваших достижения, используйте команду \`/seasonal halloween stats\`!`)


                                    await interaction.guild.channels.cache.get(ch_list.act).send(
                                        `╒══════════════════╕
${member} +300 🌀
\`Выполнение достижения.\`
╘══════════════════╛`)

                                    await interaction.guild.channels.cache.get(ch_list.rank).send(
                                        `╒══════════════════╕
${member} +50 💠
\`Выполнение достижения.\`
╘══════════════════╛`)
                                    await interaction.reply({
                                        embeds: [condition_meet]
                                    })
                                    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magenta(`[Выполнено достижение]` + chalk.gray(`: ${member.user.username} выполнил достижение ${interaction.options.getString(`достижение`)}!`)))
                                }
                                    break;
                                case `№6. Задания`: {
                                    const already_done = new EmbedBuilder()
                                        .setColor(`DarkRed`)
                                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                                        .setAuthor({
                                            name: `❗ Достижение уже выполнено!`
                                        })
                                        .setDescription(`Вы не можете выполнить данное достижение, так как вы уже выполнили его! Найти его вы можете в своем профиле.
    
Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)


                                    if (userData.seasonal.halloween.achievements.num6 === true) return interaction.reply({
                                        embeds: [already_done],
                                        ephemeral: true
                                    })

                                    const no_condition = new EmbedBuilder()
                                        .setColor(`DarkRed`)
                                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                                        .setAuthor({
                                            name: `❗ Вы не соответствуете требованиям!`
                                        })
                                        .setDescription(`Вы не соответствуете требованиям для получения данного достижения! Проверить требования вы можете в канале <#${ch_list.hw_achs}>.
    
Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)
                                        .setTimestamp(Date.now())

                                    if (userData.seasonal.halloween.quests_completed < 5) return interaction.reply({
                                        embeds: [no_condition],
                                        ephemeral: true
                                    })
                                    let reward = `893932177799135253`
                                    const has_reward = new EmbedBuilder()
                                        .setColor(`DarkRed`)
                                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                                        .setAuthor({
                                            name: `❗ Вы имеете награду!`
                                        })
                                        .setDescription(`У вас уже есть награда за данное достижение! Пожалуйста, откройте <@&${reward}>, чтобы выполнить достижение.
    
Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)
                                        .setTimestamp(Date.now())
                                    if (member.roles.cache.has(reward)) return interaction.reply({
                                        embeds: [has_reward],
                                        ephemeral: true
                                    })
                                    userData.seasonal.halloween.achievements.num6 = true
                                    await member.roles.add(reward)
                                    userData.rank += 50
                                    userData.exp += 300;
                                    userData.seasonal.halloween.points += 5
                                    userData.save()
                                    client.ActExp(userData.userid)
                                    const condition_meet = new EmbedBuilder()
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/Xa6HxCU.png`)
                                        .setTitle(`✅ Достижение выполнено!`)
                                        .setTimestamp(Date.now())
                                        .setDescription(`${member} выполнил достижение \`${interaction.options.getString(`достижение`)}\`!
Он уже получил достижение! Хочешь и ты? Тогда тебе в <#1029662737497866300>
    
Чтобы проверить статистику ваших достижения, используйте команду \`/seasonal halloween stats\`!`)


                                    await interaction.guild.channels.cache.get(ch_list.act).send(
                                        `╒══════════════════╕
${member} +300 🌀
\`Выполнение достижения.\`
╘══════════════════╛`)

                                    await interaction.guild.channels.cache.get(ch_list.rank).send(
                                        `╒══════════════════╕
${member} +50 💠
\`Выполнение достижения.\`
╘══════════════════╛`)
                                    await interaction.reply({
                                        embeds: [condition_meet]
                                    })
                                    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magenta(`[Выполнено достижение]` + chalk.gray(`: ${member.user.username} выполнил достижение ${interaction.options.getString(`достижение`)}!`)))
                                }
                                    break;

                                default:
                                    break;
                            }
                        }
                            break;
                        case `stats`: {
                            const user = interaction.options.getUser(`пользователь`) || interaction.user
                            if (user.bot) return interaction.reply({
                                content: `${user} является ботом, а значит он не может получать хэллоуинские очки :'(`
                            })
                            const users = await User.find().then(users => {
                                return users.filter(async user => await interaction.guild.members.fetch(user.userid))
                            })
                            const sorts = users.sort((a, b) => {
                                return b.seasonal.halloween.points - a.seasonal.halloween.points
                            })
                            var i = 0
                            while (sorts[i].userid !== user.id) {
                                i++
                            }
                            const userData = await User.findOne({ userid: user.id, guildid: interaction.guild.id })
                            let rank = i + 1
                            const embed = new EmbedBuilder()
                                .setTitle(`Хэллоуинская статистика пользователя ${user.username}`)
                                .setDescription(`**Позиция в топе**: ${rank}
**Очков**: ${userData.seasonal.halloween.points}
**Открыто жутких коробок**: ${userData.seasonal.halloween.opened_scary}
**Хэллоуинская душа**: ${found(userData.seasonal.halloween.hw_soul)}
**Выполнено квестов**: ${userData.seasonal.halloween.quests_completed}

**ДОСТИЖЕНИЯ**
**Достижение №1**: ${achievementStats(userData.seasonal.halloween.achievements.num1)}
**Достижение №2**: ${achievementStats(userData.seasonal.halloween.achievements.num2)}
**Достижение №3**: ${achievementStats(userData.seasonal.halloween.achievements.num3)}
**Достижение №4**: ${achievementStats(userData.seasonal.halloween.achievements.num4)}
**Достижение №5**: ${achievementStats(userData.seasonal.halloween.achievements.num5)}
**Достижение №6**: ${achievementStats(userData.seasonal.halloween.achievements.num6)}

**ТЕКУЩИЙ КВЕСТ**
**Условие**: \`${userData.seasonal.halloween.quest.description}\`
**Количество на начало квеста**: ${userData.seasonal.halloween.quest.before}
**Количество на конец квеста**: ${userData.seasonal.halloween.quest.requirement}
**Статус**: \`${userData.seasonal.halloween.quest.finished ? `Завершено ✅` : `Не завершено ❌`}\``)
                                .setThumbnail(user.displayAvatarURL())
                                .setColor(Number(linksInfo.bot_color))
                                .setTimestamp(Date.now())

                            await interaction.reply({
                                embeds: [embed]
                            })
                        }
                            break;
                        case `leaderboards`: {
                            const users = await User.find({
                                "seasonal.halloween.points": { $gt: 0 }
                            }).then(users => {
                                return users.filter(async user => await interaction.guild.members.fetch(user.userid))
                            })
                            const sort = users.sort((a, b) => {
                                return b.seasonal.halloween.points - a.seasonal.halloween.points
                            }).slice(0, 10)
                            let index = 1
                            const map = sort.map(async (user) => {
                                const tag = await interaction.guild.members.fetch(user.userid)
                                return `**${index++}.** ${tag}: ${user.seasonal.halloween.points} очков`
                            })
                            const mapProm = await Promise.all(map)


                            const embed = new EmbedBuilder()
                                .setColor(Number(linksInfo.bot_color))
                                .setAuthor({
                                    name: `Лучшие пользователи по хэллоуинским очкам`
                                })
                                .setTimestamp(Date.now())
                                .setDescription(`${mapProm.join('\n')}`)

                            await interaction.reply({
                                embeds: [embed]
                            })
                        }
                            break;
                        case `buy`: {
                            const userData = await User.findOne({ userid: interaction.user.id, guildid: interaction.guild.id })
                            const symb = interaction.options.getString(`товар`)
                            let price
                            if (symb == `🎱` || symb == `👹` || symb == `🩸`) {
                                price = 30
                            } else if (symb == `🧥`) {
                                price = 40
                            } else if (symb == `💀` || symb == `🧛`) {
                                price = 50
                            }

                            if (userData.seasonal.halloween.points < price) return interaction.reply({
                                content: `Для покупки \`${symb}\` вам необходимо минимум ${price} очков! У вас на данный момент ${userData.seasonal.halloween.points} очков`
                            })
                            userData.seasonal.halloween.points -= price
                            userData.seasonal.halloween.hw_cosm = true
                            userData.displayname.symbol = symb
                            userData.save()
                            await interaction.reply({
                                content: `Вы приобрели \`${symb}\` за ${price} хэллоуинских очков! В скором времени данный значок появится в вашем никнейме! Если этого не произойдёт в течение 15 минут, обратитесь в вопрос-модерам!`
                            })
                        }
                            break;
                        case `quest`: {
                            const userData = await User.findOne({ userid: interaction.user.id, guildid: interaction.guild.id })
                            if (!userData.uuid) return interaction.reply({
                                content: `По неизвестной причине в вашем профиле не указан ваш игровой UUID. Вы не можете использовать эту команду! Свяжитесь с модерацией гильдии.`,
                                ephemeral: true
                            })
                            const choice = interaction.options.getString(`действие`)
                            if (choice == `start`) {
                                if (userData.cooldowns.hw_quest > Date.now())
                                    return interaction.reply({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor(Number(linksInfo.bot_color))
                                                .setAuthor({
                                                    name: `Вы не можете использовать эту команду`
                                                })
                                                .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${prettyMilliseconds(userData.cooldowns.hw_quest - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}!`)
                                        ],
                                        ephemeral: true
                                    });
                                let response = await fetch(`https://api.hypixel.net/player?key=${process.env.hypixel_apikey}&uuid=${userData.uuid}`)
                                if (response.ok) {

                                    const quests = require(`./Seasonal Data/Halloween Quests.json`)
                                    const r_quest = quests[Math.floor(Math.random() * quests.length)]
                                    try {
                                        let json = await response.json()
                                        const hw = userData.seasonal.halloween
                                        const stats = json.player.stats
                                        if (r_quest.id == 1) {
                                            if (!stats?.MurderMystery?.wins_spooky_mansion) {
                                                hw.quest.before = 0;
                                                hw.quest.requirement = r_quest.req_wins
                                            } else if (stats?.MurderMystery?.wins_spooky_mansion) {
                                                hw.quest.before = stats?.MurderMystery?.wins_spooky_mansion;
                                                hw.quest.requirement = stats?.MurderMystery?.wins_spooky_mansion + r_quest.req_wins
                                            }
                                        } else if (r_quest.id == 2) {
                                            if (!stats?.MurderMystery?.wins_darkfall) {
                                                hw.quest.before = 0;
                                                hw.quest.requirement = r_quest.req_wins
                                            } else if (stats?.MurderMystery?.wins_darkfall) {
                                                hw.quest.before = stats?.MurderMystery?.wins_darkfall;
                                                hw.quest.requirement = stats?.MurderMystery?.wins_darkfall + r_quest.req_wins
                                            }
                                        } else if (r_quest.id == 3) {
                                            if (!stats?.MurderMystery["wins_widow's_den"]) {
                                                hw.quest.before = 0;
                                                hw.quest.requirement = r_quest.req_wins
                                            } else if (stats?.MurderMystery["wins_widow's_den"]) {
                                                hw.quest.before = stats?.MurderMystery["wins_widow's_den"];
                                                hw.quest.requirement = stats?.MurderMystery["wins_widow's_den"] + r_quest.req_wins
                                            }
                                        } else if (r_quest.id == 4) {
                                            if (!stats?.VampireZ?.human_wins) {
                                                hw.quest.before = 0;
                                                hw.quest.requirement = r_quest.req_wins
                                            } else if (stats?.VampireZ?.human_wins) {
                                                hw.quest.before = stats?.VampireZ?.human_wins;
                                                hw.quest.requirement = stats?.VampireZ?.human_wins + r_quest.req_wins
                                            }
                                        } else if (r_quest.id == 5) {
                                            if (!stats?.MurderMystery?.kills_as_murderer) {
                                                hw.quest.before = 0;
                                                hw.quest.requirement = r_quest.req_wins
                                            } else if (stats?.MurderMystery?.kills_as_murderer) {
                                                hw.quest.before = stats?.MurderMystery?.kills_as_murderer;
                                                hw.quest.requirement = stats?.MurderMystery?.kills_as_murderer + r_quest.req_wins
                                            }
                                        } else if (r_quest.id == 6) {
                                            if (!stats?.Arcade?.wins_zombies_deadend) {
                                                hw.quest.before = 0;
                                                hw.quest.requirement = r_quest.req_wins
                                            } else if (stats?.Arcade?.wins_zombies_deadend) {
                                                hw.quest.before = stats?.Arcade?.wins_zombies_deadend;
                                                hw.quest.requirement = stats?.Arcade?.wins_zombies_deadend + r_quest.req_wins
                                            }
                                        } else if (r_quest.id == 7) {
                                            if (!stats?.Arcade?.wins_zombies_badblood) {
                                                hw.quest.before = 0;
                                                hw.quest.requirement = r_quest.req_wins
                                            } else if (stats?.Arcade?.wins_zombies_badblood) {
                                                hw.quest.before = stats?.Arcade?.wins_zombies_badblood;
                                                hw.quest.requirement = stats?.Arcade?.wins_zombies_badblood + r_quest.req_wins
                                            }
                                        } else if (r_quest.id == 8) {
                                            if (!stats?.Arcade?.wins_dayone) {
                                                hw.quest.before = 0;
                                                hw.quest.requirement = r_quest.req_wins
                                            } else if (stats?.Arcade?.wins_dayone) {
                                                hw.quest.before = stats?.Arcade?.wins_dayone;
                                                hw.quest.requirement = stats?.Arcade?.wins_dayone + r_quest.req_wins
                                            }
                                        } else if (r_quest.id == 9) {
                                            if (!stats?.Arcade?.zombie_kills_zombies) {
                                                hw.quest.before = 0;
                                                hw.quest.requirement = r_quest.req_wins
                                            } else if (stats?.Arcade?.zombie_kills_zombies) {
                                                hw.quest.before = stats?.Arcade?.zombie_kills_zombies;
                                                hw.quest.requirement = stats?.Arcade?.zombie_kills_zombies + r_quest.req_wins
                                            }
                                        } else if (r_quest.id == 10) {
                                            if (!stats?.Arcade?.zombie_kills_zombies_deadend) {
                                                hw.quest.before = 0;
                                                hw.quest.requirement = r_quest.req_wins
                                            } else if (stats?.Arcade?.zombie_kills_zombies_deadend) {
                                                hw.quest.before = stats?.Arcade?.zombie_kills_zombies_deadend;
                                                hw.quest.requirement = stats?.Arcade?.zombie_kills_zombies_deadend + r_quest.req_wins
                                            }
                                        } else if (r_quest.id == 11) {
                                            if (!stats?.Arcade?.zombie_kills_zombies_badblood) {
                                                hw.quest.before = 0;
                                                hw.quest.requirement = r_quest.req_wins
                                            } else if (stats?.Arcade?.zombie_kills_zombies_badblood) {
                                                hw.quest.before = stats?.Arcade?.zombie_kills_zombies_badblood;
                                                hw.quest.requirement = stats?.Arcade?.zombie_kills_zombies_badblood + r_quest.req_wins
                                            }
                                        } else if (r_quest.id == 12) {
                                            if (!stats?.MurderMystery?.kills_as_infected) {
                                                hw.quest.before = 0;
                                                hw.quest.requirement = r_quest.req_wins
                                            } else if (stats?.MurderMystery?.kills_as_infected) {
                                                hw.quest.before = stats?.MurderMystery?.kills_as_infected;
                                                hw.quest.requirement = stats?.MurderMystery?.kills_as_infected + r_quest.req_wins
                                            }
                                        } else if (r_quest.id == 13) {
                                            if (!stats?.Arcade?.kills_dayone) {
                                                hw.quest.before = 0;
                                                hw.quest.requirement = r_quest.req_wins
                                            } else if (stats?.Arcade?.kills_dayone) {
                                                hw.quest.before = stats?.Arcade?.kills_dayone;
                                                hw.quest.requirement = stats?.Arcade?.kills_dayone + r_quest.req_wins
                                            }
                                        } else if (r_quest.id == 14) {
                                            if (!stats?.SkyWars?.wins_kit_basic_solo_batguy) {
                                                hw.quest.before = 0;
                                                hw.quest.requirement = r_quest.req_wins
                                            } else if (stats?.SkyWars?.wins_kit_basic_solo_batguy) {
                                                hw.quest.before = stats?.SkyWars?.wins_kit_basic_solo_batguy;
                                                hw.quest.requirement = stats?.SkyWars?.wins_kit_basic_solo_batguy + r_quest.req_wins
                                            }
                                        } else if (r_quest.id == 15) {
                                            if (!stats?.SkyWars?.wins_kit_advanced_solo_magician) {
                                                hw.quest.before = 0;
                                                hw.quest.requirement = r_quest.req_wins
                                            } else if (stats?.SkyWars?.wins_kit_advanced_solo_magician) {
                                                hw.quest.before = stats?.SkyWars?.wins_kit_advanced_solo_magician;
                                                hw.quest.requirement = stats?.SkyWars?.wins_kit_advanced_solo_magician + r_quest.req_wins
                                            }
                                        } else if (r_quest.id == 16) {
                                            if (!stats?.SkyWars?.wins_kit_defending_team_batguy) {
                                                hw.quest.before = 0;
                                                hw.quest.requirement = r_quest.req_wins
                                            } else if (stats?.SkyWars?.wins_kit_defending_team_batguy) {
                                                hw.quest.before = stats?.SkyWars?.wins_kit_defending_team_batguy;
                                                hw.quest.requirement = stats?.SkyWars?.wins_kit_defending_team_batguy + r_quest.req_wins
                                            }
                                        } else if (r_quest.id == 17) {
                                            if (!stats?.SkyWars?.wins_kit_attacking_team_enderman) {
                                                hw.quest.before = 0;
                                                hw.quest.requirement = r_quest.req_wins
                                            } else if (stats?.SkyWars?.wins_kit_attacking_team_enderman) {
                                                hw.quest.before = stats?.SkyWars?.wins_kit_attacking_team_enderman;
                                                hw.quest.requirement = stats?.SkyWars?.wins_kit_attacking_team_enderman + r_quest.req_wins
                                            }
                                        } else if (r_quest.id == 18) {
                                            if (!stats?.Arcade?.candy_found_halloween_simulator) {
                                                hw.quest.before = 0;
                                                hw.quest.requirement = r_quest.req_wins
                                            } else if (stats?.Arcade?.candy_found_halloween_simulator) {
                                                hw.quest.before = stats?.Arcade?.candy_found_halloween_simulator;
                                                hw.quest.requirement = stats?.Arcade?.candy_found_halloween_simulator + r_quest.req_wins
                                            }
                                        } else if (r_quest.id == 19) {
                                            if (!stats?.Arcade?.wins_halloween_simulator) {
                                                hw.quest.before = 0;
                                                hw.quest.requirement = r_quest.req_wins
                                            } else if (stats?.Arcade?.wins_halloween_simulator) {
                                                hw.quest.before = stats?.Arcade?.wins_halloween_simulator;
                                                hw.quest.requirement = stats?.Arcade?.wins_halloween_simulator + r_quest.req_wins
                                            }
                                        } else if (r_quest.id == 20) {
                                            if (!stats?.MurderMystery?.kills_as_infected_hypixel_world_MURDER_INFECTION) {
                                                hw.quest.before = 0;
                                                hw.quest.requirement = r_quest.req_wins
                                            } else if (stats?.MurderMystery?.kills_as_infected_hypixel_world_MURDER_INFECTION) {
                                                hw.quest.before = stats?.MurderMystery?.kills_as_infected_hypixel_world_MURDER_INFECTION;
                                                hw.quest.requirement = stats?.MurderMystery?.kills_as_infected_hypixel_world_MURDER_INFECTION + r_quest.req_wins
                                            }
                                        }
                                    } catch (error) {
                                        return interaction.reply({
                                            content: `Произошла ошибка при создании для вас квеста!`,
                                            ephemeral: true
                                        })
                                    }
                                    userData.seasonal.halloween.quest.description = r_quest.description
                                    userData.seasonal.halloween.quest.id = r_quest.id
                                    userData.seasonal.halloween.quest.finished = false
                                    const questEmbed = new EmbedBuilder()
                                        .setColor(`DarkGold`)
                                        .setTitle(`Хэллоуинский квест для ${interaction.user.username}`)
                                        .setDescription(`${interaction.member} получил хэллоуинское задание:
\`${r_quest.description}\`

За его выполнение вы получите \`❕ 🎃 ЖУТКАЯ /spooky\``)
                                        .setTimestamp(Date.now())
                                        .setThumbnail(interaction.user.displayAvatarURL())
                                    await interaction.reply({
                                        embeds: [questEmbed]
                                    })
                                    userData.cooldowns.hw_quest = Date.now() + (1000 * 60 * 60 * 16)
                                    userData.save()
                                } else return interaction.reply({
                                    content: `Произошла ошибка при создании квеста для вас! Попробуйте позже!`
                                })
                            } else if (choice == `finish`) {
                                const reward = `893932177799135253`
                                const hw = userData.seasonal.halloween
                                if (hw.quest.finished === true) return interaction.reply({
                                    content: `Вы уже завершили задание \`${hw.quest.description}\`! Используйте \`/seasonal halloween quest\`, чтобы начать новый квест!`,
                                    ephemeral: true
                                })
                                let response = await fetch(`https://api.hypixel.net/player?key=${process.env.hypixel_apikey}&uuid=${userData.uuid}`)
                                if (response.ok) {
                                    let json = await response.json()
                                    let stats = json.player.stats
                                    if (hw.quest.id == 1) {
                                        if (stats?.MurderMystery?.wins_spooky_mansion >= hw.quest.requirement) {
                                            hw.quests_completed += 1
                                            userData.quests.seasonal.stats.hw.total += 1
                                            hw.points += 5
                                            hw.quest.finished = true
                                            await member.roles.add(reward)
                                            const done = new EmbedBuilder()
                                                .setColor(`DarkGold`)
                                                .setTitle(`Хэллоуинский квест выполнен`)
                                                .setDescription(`${interaction.member} выполнил хэллоуинское задание \`${hw.quest.description}\`! Он получил свою награду!

**Количество выполненных заданий**: ${hw.quests_completed}`)
                                            await interaction.reply({
                                                embeds: [done]
                                            })
                                        } else return interaction.reply({
                                            content: `Вы не завершили предыдущее задание: \`${userData.seasonal.halloween.quest.description}\`
**Количество на начало квеста**: ${userData.seasonal.halloween.quest.before}
**Количество для конца квеста**: ${userData.seasonal.halloween.quest.requirement}
        
Как только вы выполните квест, попробуйте использовать эту команду снова!`,
                                            ephemeral: true
                                        })
                                    } else if (hw.quest.id == 2) {
                                        if (stats?.MurderMystery?.wins_darkfall >= hw.quest.requirement) {
                                            hw.quests_completed += 1
                                            userData.quests.seasonal.stats.hw.total += 1
                                            hw.points += 5
                                            hw.quest.finished = true
                                            await member.roles.add(reward)
                                            const done = new EmbedBuilder()
                                                .setColor(`DarkGold`)
                                                .setTitle(`Хэллоуинский квест выполнен`)
                                                .setDescription(`${interaction.member} выполнил хэллоуинское задание \`${hw.quest.description}\`! Он получил свою награду!

**Количество выполненных заданий**: ${hw.quests_completed}`)
                                            await interaction.reply({
                                                embeds: [done]
                                            })
                                        } else return interaction.reply({
                                            content: `Вы не завершили предыдущее задание: \`${userData.seasonal.halloween.quest.description}\`
**Количество на начало квеста**: ${userData.seasonal.halloween.quest.before}
**Количество для конца квеста**: ${userData.seasonal.halloween.quest.requirement}
        
Как только вы выполните квест, попробуйте использовать эту команду снова!`,
                                            ephemeral: true
                                        })
                                    } else if (hw.quest.id == 3) {
                                        if (stats?.MurderMystery["wins_widow's_den"] >= hw.quest.requirement) {
                                            hw.quests_completed += 1
                                            userData.quests.seasonal.stats.hw.total += 1
                                            hw.points += 5
                                            hw.quest.finished = true
                                            await member.roles.add(reward)
                                            const done = new EmbedBuilder()
                                                .setColor(`DarkGold`)
                                                .setTitle(`Хэллоуинский квест выполнен`)
                                                .setDescription(`${interaction.member} выполнил хэллоуинское задание \`${hw.quest.description}\`! Он получил свою награду!

**Количество выполненных заданий**: ${hw.quests_completed}`)
                                            await interaction.reply({
                                                embeds: [done]
                                            })
                                        } else return interaction.reply({
                                            content: `Вы не завершили предыдущее задание: \`${userData.seasonal.halloween.quest.description}\`
**Количество на начало квеста**: ${userData.seasonal.halloween.quest.before}
**Количество для конца квеста**: ${userData.seasonal.halloween.quest.requirement}
        
Как только вы выполните квест, попробуйте использовать эту команду снова!`,
                                            ephemeral: true
                                        })
                                    } else if (hw.quest.id == 4) {
                                        if (stats?.VampireZ?.human_wins >= hw.quest.requirement) {
                                            hw.quests_completed += 1
                                            userData.quests.seasonal.stats.hw.total += 1
                                            hw.points += 5
                                            hw.quest.finished = true
                                            await member.roles.add(reward)
                                            const done = new EmbedBuilder()
                                                .setColor(`DarkGold`)
                                                .setTitle(`Хэллоуинский квест выполнен`)
                                                .setDescription(`${interaction.member} выполнил хэллоуинское задание \`${hw.quest.description}\`! Он получил свою награду!

**Количество выполненных заданий**: ${hw.quests_completed}`)
                                            await interaction.reply({
                                                embeds: [done]
                                            })
                                        } else return interaction.reply({
                                            content: `Вы не завершили предыдущее задание: \`${userData.seasonal.halloween.quest.description}\`
**Количество на начало квеста**: ${userData.seasonal.halloween.quest.before}
**Количество для конца квеста**: ${userData.seasonal.halloween.quest.requirement}
        
Как только вы выполните квест, попробуйте использовать эту команду снова!`,
                                            ephemeral: true
                                        })
                                    } else if (hw.quest.id == 5) {
                                        if (stats?.MurderMystery?.kills_as_murderer >= hw.quest.requirement) {
                                            hw.quests_completed += 1
                                            userData.quests.seasonal.stats.hw.total += 1
                                            hw.points += 5
                                            hw.quest.finished = true
                                            await member.roles.add(reward)
                                            const done = new EmbedBuilder()
                                                .setColor(`DarkGold`)
                                                .setTitle(`Хэллоуинский квест выполнен`)
                                                .setDescription(`${interaction.member} выполнил хэллоуинское задание \`${hw.quest.description}\`! Он получил свою награду!

**Количество выполненных заданий**: ${hw.quests_completed}`)
                                            await interaction.reply({
                                                embeds: [done]
                                            })
                                        } else return interaction.reply({
                                            content: `Вы не завершили предыдущее задание: \`${userData.seasonal.halloween.quest.description}\`
**Количество на начало квеста**: ${userData.seasonal.halloween.quest.before}
**Количество для конца квеста**: ${userData.seasonal.halloween.quest.requirement}
        
Как только вы выполните квест, попробуйте использовать эту команду снова!`,
                                            ephemeral: true
                                        })
                                    } else if (hw.quest.id == 6) {
                                        if (stats?.Arcade?.wins_zombies_deadend >= hw.quest.requirement) {
                                            hw.quests_completed += 1
                                            userData.quests.seasonal.stats.hw.total += 1
                                            hw.points += 5
                                            hw.quest.finished = true
                                            await member.roles.add(reward)
                                            const done = new EmbedBuilder()
                                                .setColor(`DarkGold`)
                                                .setTitle(`Хэллоуинский квест выполнен`)
                                                .setDescription(`${interaction.member} выполнил хэллоуинское задание \`${hw.quest.description}\`! Он получил свою награду!

**Количество выполненных заданий**: ${hw.quests_completed}`)
                                            await interaction.reply({
                                                embeds: [done]
                                            })
                                        } else return interaction.reply({
                                            content: `Вы не завершили предыдущее задание: \`${userData.seasonal.halloween.quest.description}\`
**Количество на начало квеста**: ${userData.seasonal.halloween.quest.before}
**Количество для конца квеста**: ${userData.seasonal.halloween.quest.requirement}
        
Как только вы выполните квест, попробуйте использовать эту команду снова!`,
                                            ephemeral: true
                                        })
                                    } else if (hw.quest.id == 7) {
                                        if (stats?.Arcade?.wins_zombies_badblood >= hw.quest.requirement) {
                                            hw.quests_completed += 1
                                            userData.quests.seasonal.stats.hw.total += 1
                                            hw.points += 5
                                            hw.quest.finished = true
                                            await member.roles.add(reward)
                                            const done = new EmbedBuilder()
                                                .setColor(`DarkGold`)
                                                .setTitle(`Хэллоуинский квест выполнен`)
                                                .setDescription(`${interaction.member} выполнил хэллоуинское задание \`${hw.quest.description}\`! Он получил свою награду!

**Количество выполненных заданий**: ${hw.quests_completed}`)
                                            await interaction.reply({
                                                embeds: [done]
                                            })
                                        } else return interaction.reply({
                                            content: `Вы не завершили предыдущее задание: \`${userData.seasonal.halloween.quest.description}\`
**Количество на начало квеста**: ${userData.seasonal.halloween.quest.before}
**Количество для конца квеста**: ${userData.seasonal.halloween.quest.requirement}
        
Как только вы выполните квест, попробуйте использовать эту команду снова!`,
                                            ephemeral: true
                                        })
                                    } else if (hw.quest.id == 8) {
                                        if (stats?.Arcade?.wins_dayone >= hw.quest.requirement) {
                                            hw.quests_completed += 1
                                            userData.quests.seasonal.stats.hw.total += 1
                                            hw.points += 5
                                            hw.quest.finished = true
                                            await member.roles.add(reward)
                                            const done = new EmbedBuilder()
                                                .setColor(`DarkGold`)
                                                .setTitle(`Хэллоуинский квест выполнен`)
                                                .setDescription(`${interaction.member} выполнил хэллоуинское задание \`${hw.quest.description}\`! Он получил свою награду!

**Количество выполненных заданий**: ${hw.quests_completed}`)
                                            await interaction.reply({
                                                embeds: [done]
                                            })
                                        } else return interaction.reply({
                                            content: `Вы не завершили предыдущее задание: \`${userData.seasonal.halloween.quest.description}\`
**Количество на начало квеста**: ${userData.seasonal.halloween.quest.before}
**Количество для конца квеста**: ${userData.seasonal.halloween.quest.requirement}
        
Как только вы выполните квест, попробуйте использовать эту команду снова!`,
                                            ephemeral: true
                                        })
                                    } else if (hw.quest.id == 9) {
                                        if (stats?.Arcade?.zombie_kills_zombies >= hw.quest.requirement) {
                                            hw.quests_completed += 1
                                            userData.quests.seasonal.stats.hw.total += 1
                                            hw.points += 5
                                            hw.quest.finished = true
                                            await member.roles.add(reward)
                                            const done = new EmbedBuilder()
                                                .setColor(`DarkGold`)
                                                .setTitle(`Хэллоуинский квест выполнен`)
                                                .setDescription(`${interaction.member} выполнил хэллоуинское задание \`${hw.quest.description}\`! Он получил свою награду!

**Количество выполненных заданий**: ${hw.quests_completed}`)
                                            await interaction.reply({
                                                embeds: [done]
                                            })
                                        } else return interaction.reply({
                                            content: `Вы не завершили предыдущее задание: \`${userData.seasonal.halloween.quest.description}\`
**Количество на начало квеста**: ${userData.seasonal.halloween.quest.before}
**Количество для конца квеста**: ${userData.seasonal.halloween.quest.requirement}
        
Как только вы выполните квест, попробуйте использовать эту команду снова!`,
                                            ephemeral: true
                                        })
                                    } else if (hw.quest.id == 10) {
                                        if (stats?.Arcade?.zombie_kills_zombies_deadend >= hw.quest.requirement) {
                                            hw.quests_completed += 1
                                            userData.quests.seasonal.stats.hw.total += 1
                                            hw.points += 5
                                            hw.quest.finished = true
                                            await member.roles.add(reward)
                                            const done = new EmbedBuilder()
                                                .setColor(`DarkGold`)
                                                .setTitle(`Хэллоуинский квест выполнен`)
                                                .setDescription(`${interaction.member} выполнил хэллоуинское задание \`${hw.quest.description}\`! Он получил свою награду!

**Количество выполненных заданий**: ${hw.quests_completed}`)
                                            await interaction.reply({
                                                embeds: [done]
                                            })
                                        } else return interaction.reply({
                                            content: `Вы не завершили предыдущее задание: \`${userData.seasonal.halloween.quest.description}\`
**Количество на начало квеста**: ${userData.seasonal.halloween.quest.before}
**Количество для конца квеста**: ${userData.seasonal.halloween.quest.requirement}
        
Как только вы выполните квест, попробуйте использовать эту команду снова!`,
                                            ephemeral: true
                                        })
                                    } else if (hw.quest.id == 11) {
                                        if (stats?.Arcade?.zombie_kills_zombies_badblood >= hw.quest.requirement) {
                                            hw.quests_completed += 1
                                            userData.quests.seasonal.stats.hw.total += 1
                                            hw.points += 5
                                            hw.quest.finished = true
                                            await member.roles.add(reward)
                                            const done = new EmbedBuilder()
                                                .setColor(`DarkGold`)
                                                .setTitle(`Хэллоуинский квест выполнен`)
                                                .setDescription(`${interaction.member} выполнил хэллоуинское задание \`${hw.quest.description}\`! Он получил свою награду!

**Количество выполненных заданий**: ${hw.quests_completed}`)
                                            await interaction.reply({
                                                embeds: [done]
                                            })
                                        } else return interaction.reply({
                                            content: `Вы не завершили предыдущее задание: \`${userData.seasonal.halloween.quest.description}\`
**Количество на начало квеста**: ${userData.seasonal.halloween.quest.before}
**Количество для конца квеста**: ${userData.seasonal.halloween.quest.requirement}
        
Как только вы выполните квест, попробуйте использовать эту команду снова!`,
                                            ephemeral: true
                                        })
                                    } else if (hw.quest.id == 12) {
                                        if (stats?.MurderMystery?.kills_as_infected >= hw.quest.requirement) {
                                            hw.quests_completed += 1
                                            userData.quests.seasonal.stats.hw.total += 1
                                            hw.points += 5
                                            hw.quest.finished = true
                                            await member.roles.add(reward)
                                            const done = new EmbedBuilder()
                                                .setColor(`DarkGold`)
                                                .setTitle(`Хэллоуинский квест выполнен`)
                                                .setDescription(`${interaction.member} выполнил хэллоуинское задание \`${hw.quest.description}\`! Он получил свою награду!

**Количество выполненных заданий**: ${hw.quests_completed}`)
                                            await interaction.reply({
                                                embeds: [done]
                                            })
                                        } else return interaction.reply({
                                            content: `Вы не завершили предыдущее задание: \`${userData.seasonal.halloween.quest.description}\`
**Количество на начало квеста**: ${userData.seasonal.halloween.quest.before}
**Количество для конца квеста**: ${userData.seasonal.halloween.quest.requirement}
        
Как только вы выполните квест, попробуйте использовать эту команду снова!`,
                                            ephemeral: true
                                        })
                                    } else if (hw.quest.id == 13) {
                                        if (stats?.Arcade?.kills_dayone >= hw.quest.requirement) {
                                            hw.quests_completed += 1
                                            userData.quests.seasonal.stats.hw.total += 1
                                            hw.points += 5
                                            hw.quest.finished = true
                                            await member.roles.add(reward)
                                            const done = new EmbedBuilder()
                                                .setColor(`DarkGold`)
                                                .setTitle(`Хэллоуинский квест выполнен`)
                                                .setDescription(`${interaction.member} выполнил хэллоуинское задание \`${hw.quest.description}\`! Он получил свою награду!

**Количество выполненных заданий**: ${hw.quests_completed}`)
                                            await interaction.reply({
                                                embeds: [done]
                                            })
                                        }
                                    } else if (hw.quest.id == 14) {
                                        if (stats?.SkyWars?.wins_kit_basic_solo_batguy >= hw.quest.requirement) {
                                            hw.quests_completed += 1
                                            userData.quests.seasonal.stats.hw.total += 1
                                            hw.points += 5
                                            hw.quest.finished = true
                                            await member.roles.add(reward)
                                            const done = new EmbedBuilder()
                                                .setColor(`DarkGold`)
                                                .setTitle(`Хэллоуинский квест выполнен`)
                                                .setDescription(`${interaction.member} выполнил хэллоуинское задание \`${hw.quest.description}\`! Он получил свою награду!

**Количество выполненных заданий**: ${hw.quests_completed}`)
                                            await interaction.reply({
                                                embeds: [done]
                                            })
                                        } else return interaction.reply({
                                            content: `Вы не завершили предыдущее задание: \`${userData.seasonal.halloween.quest.description}\`
**Количество на начало квеста**: ${userData.seasonal.halloween.quest.before}
**Количество для конца квеста**: ${userData.seasonal.halloween.quest.requirement}
        
Как только вы выполните квест, попробуйте использовать эту команду снова!`,
                                            ephemeral: true
                                        })
                                    } else if (hw.quest.id == 15) {
                                        if (stats?.SkyWars?.wins_kit_advanced_solo_magician >= hw.quest.requirement) {
                                            hw.quests_completed += 1
                                            userData.quests.seasonal.stats.hw.total += 1
                                            hw.points += 5
                                            hw.quest.finished = true
                                            await member.roles.add(reward)
                                            const done = new EmbedBuilder()
                                                .setColor(`DarkGold`)
                                                .setTitle(`Хэллоуинский квест выполнен`)
                                                .setDescription(`${interaction.member} выполнил хэллоуинское задание \`${hw.quest.description}\`! Он получил свою награду!

**Количество выполненных заданий**: ${hw.quests_completed}`)
                                            await interaction.reply({
                                                embeds: [done]
                                            })
                                        } else return interaction.reply({
                                            content: `Вы не завершили предыдущее задание: \`${userData.seasonal.halloween.quest.description}\`
**Количество на начало квеста**: ${userData.seasonal.halloween.quest.before}
**Количество для конца квеста**: ${userData.seasonal.halloween.quest.requirement}
        
Как только вы выполните квест, попробуйте использовать эту команду снова!`,
                                            ephemeral: true
                                        })
                                    } else if (hw.quest.id == 16) {
                                        if (stats?.SkyWars?.wins_kit_defending_team_batguy >= hw.quest.requirement) {
                                            hw.quests_completed += 1
                                            userData.quests.seasonal.stats.hw.total += 1
                                            hw.points += 5
                                            hw.quest.finished = true
                                            await member.roles.add(reward)
                                            const done = new EmbedBuilder()
                                                .setColor(`DarkGold`)
                                                .setTitle(`Хэллоуинский квест выполнен`)
                                                .setDescription(`${interaction.member} выполнил хэллоуинское задание \`${hw.quest.description}\`! Он получил свою награду!

**Количество выполненных заданий**: ${hw.quests_completed}`)
                                            await interaction.reply({
                                                embeds: [done]
                                            })
                                        } else return interaction.reply({
                                            content: `Вы не завершили предыдущее задание: \`${userData.seasonal.halloween.quest.description}\`
**Количество на начало квеста**: ${userData.seasonal.halloween.quest.before}
**Количество для конца квеста**: ${userData.seasonal.halloween.quest.requirement}
        
Как только вы выполните квест, попробуйте использовать эту команду снова!`,
                                            ephemeral: true
                                        })
                                    } else if (hw.quest.id == 17) {
                                        if (stats?.SkyWars?.wins_kit_attacking_team_enderman >= hw.quest.requirement) {
                                            hw.quests_completed += 1
                                            userData.quests.seasonal.stats.hw.total += 1
                                            hw.points += 5
                                            hw.quest.finished = true
                                            await member.roles.add(reward)
                                            const done = new EmbedBuilder()
                                                .setColor(`DarkGold`)
                                                .setTitle(`Хэллоуинский квест выполнен`)
                                                .setDescription(`${interaction.member} выполнил хэллоуинское задание \`${hw.quest.description}\`! Он получил свою награду!

**Количество выполненных заданий**: ${hw.quests_completed}`)
                                            await interaction.reply({
                                                embeds: [done]
                                            })
                                        } else return interaction.reply({
                                            content: `Вы не завершили предыдущее задание: \`${userData.seasonal.halloween.quest.description}\`
**Количество на начало квеста**: ${userData.seasonal.halloween.quest.before}
**Количество для конца квеста**: ${userData.seasonal.halloween.quest.requirement}
        
Как только вы выполните квест, попробуйте использовать эту команду снова!`,
                                            ephemeral: true
                                        })
                                    } else if (hw.quest.id == 18) {
                                        if (stats?.Arcade?.candy_found_halloween_simulator >= hw.quest.requirement) {
                                            hw.quests_completed += 1
                                            userData.quests.seasonal.stats.hw.total += 1
                                            hw.points += 5
                                            hw.quest.finished = true
                                            await member.roles.add(reward)
                                            const done = new EmbedBuilder()
                                                .setColor(`DarkGold`)
                                                .setTitle(`Хэллоуинский квест выполнен`)
                                                .setDescription(`${interaction.member} выполнил хэллоуинское задание \`${hw.quest.description}\`! Он получил свою награду!

**Количество выполненных заданий**: ${hw.quests_completed}`)
                                            await interaction.reply({
                                                embeds: [done]
                                            })
                                        } else return interaction.reply({
                                            content: `Вы не завершили предыдущее задание: \`${userData.seasonal.halloween.quest.description}\`
**Количество на начало квеста**: ${userData.seasonal.halloween.quest.before}
**Количество для конца квеста**: ${userData.seasonal.halloween.quest.requirement}
        
Как только вы выполните квест, попробуйте использовать эту команду снова!`,
                                            ephemeral: true
                                        })
                                    } else if (hw.quest.id == 19) {
                                        if (stats?.Arcade?.wins_halloween_simulator >= hw.quest.requirement) {
                                            hw.quests_completed += 1
                                            userData.quests.seasonal.stats.hw.total += 1
                                            hw.points += 5
                                            hw.quest.finished = true
                                            await member.roles.add(reward)
                                            const done = new EmbedBuilder()
                                                .setColor(`DarkGold`)
                                                .setTitle(`Хэллоуинский квест выполнен`)
                                                .setDescription(`${interaction.member} выполнил хэллоуинское задание \`${hw.quest.description}\`! Он получил свою награду!

**Количество выполненных заданий**: ${hw.quests_completed}`)
                                            await interaction.reply({
                                                embeds: [done]
                                            })
                                        } else return interaction.reply({
                                            content: `Вы не завершили предыдущее задание: \`${userData.seasonal.halloween.quest.description}\`
**Количество на начало квеста**: ${userData.seasonal.halloween.quest.before}
**Количество для конца квеста**: ${userData.seasonal.halloween.quest.requirement}
        
Как только вы выполните квест, попробуйте использовать эту команду снова!`,
                                            ephemeral: true
                                        })
                                    } else if (hw.quest.id == 20) {
                                        if (stats?.MurderMystery?.kills_as_infected_hypixel_world_MURDER_INFECTION >= hw.quest.requirement) {
                                            hw.quests_completed += 1
                                            userData.quests.seasonal.stats.hw.total += 1
                                            hw.points += 5
                                            hw.quest.finished = true
                                            await member.roles.add(reward)
                                            const done = new EmbedBuilder()
                                                .setColor(`DarkGold`)
                                                .setTitle(`Хэллоуинский квест выполнен`)
                                                .setDescription(`${interaction.member} выполнил хэллоуинское задание \`${hw.quest.description}\`! Он получил свою награду!

**Количество выполненных заданий**: ${hw.quests_completed}`)
                                            await interaction.reply({
                                                embeds: [done]
                                            })
                                        } else return interaction.reply({
                                            content: `Вы не завершили предыдущее задание: \`${userData.seasonal.halloween.quest.description}\`
**Количество на начало квеста**: ${userData.seasonal.halloween.quest.before}
**Количество для конца квеста**: ${userData.seasonal.halloween.quest.requirement}
        
Как только вы выполните квест, попробуйте использовать эту команду снова!`,
                                            ephemeral: true
                                        })
                                    }

                                    userData.save()
                                }
                            }
                        }
                            break;
                        default:
                            break;
                    }
                }
                    break;
                case `newyear`: {
                    if (guildData.seasonal.new_year.enabled === false) return interaction.reply({
                        content: `Сейчас не время для Нового года! Попробуйте ввести эту команду в период **1 декабря по 18 января**!`,
                        ephemeral: true
                    })

                    switch (interaction.options.getSubcommand()) {
                        case `achievement`: {
                            const userData = await User.findOne({ userid: interaction.user.id, guildid: interaction.guild.id })
                            const achievement = interaction.options.getString(`достижение`)
                            switch (achievement) {
                                case `№1. Санта`: {
                                    const already_done = new EmbedBuilder()
                                        .setColor(`DarkRed`)
                                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                                        .setAuthor({
                                            name: `❗ Достижение уже выполнено!`
                                        })
                                        .setDescription(`Вы не можете выполнить данное достижение, так как вы уже выполнили его! Найти его вы можете в своем профиле.
    
Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)


                                    if (userData.seasonal.new_year.achievements.num1 === true) return interaction.reply({
                                        embeds: [already_done],
                                        ephemeral: true
                                    })

                                    const no_condition = new EmbedBuilder()
                                        .setColor(`DarkRed`)
                                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                                        .setAuthor({
                                            name: `❗ Вы не соответствуете требованиям!`
                                        })
                                        .setDescription(`Вы не соответствуете требованиям для получения данного достижения! Проверить требования вы можете в канале <#${ch_list.hw_achs}>.
    
Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)
                                        .setTimestamp(Date.now())

                                    if (!member.roles.cache.has(`1046475276080648302`)) return interaction.reply({
                                        embeds: [no_condition],
                                        ephemeral: true
                                    })
                                    let reward = `925799156679856240`
                                    const has_reward = new EmbedBuilder()
                                        .setColor(`DarkRed`)
                                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                                        .setAuthor({
                                            name: `❗ Вы имеете награду!`
                                        })
                                        .setDescription(`У вас уже есть награда за данное достижение! Пожалуйста, откройте <@&${reward}>, чтобы выполнить достижение.
    
Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)
                                        .setTimestamp(Date.now())
                                    if (member.roles.cache.has(reward)) return interaction.reply({
                                        embeds: [has_reward],
                                        ephemeral: true
                                    })
                                    userData.seasonal.new_year.achievements.num1 = true
                                    await member.roles.add(reward)
                                    userData.rank += 50
                                    userData.exp += 300;
                                    userData.seasonal.new_year.points += 5
                                    userData.save()
                                    client.ActExp(userData.userid)
                                    const condition_meet = new EmbedBuilder()
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/Xa6HxCU.png`)
                                        .setTitle(`✅ Достижение выполнено!`)
                                        .setTimestamp(Date.now())
                                        .setDescription(`${member} выполнил достижение \`${interaction.options.getString(`достижение`)}\`!
Он уже получил достижение! Хочешь и ты? Тогда тебе в <#1031224393189302292>

Чтобы проверить статистику ваших достижения, используйте команду \`/seasonal newyear stats\`!`)


                                    await interaction.guild.channels.cache.get(ch_list.act).send(
                                        `╒══════════════════╕
${member} +300 🌀
\`Выполнение достижения.\`
╘══════════════════╛`)

                                    await interaction.guild.channels.cache.get(ch_list.rank).send(
                                        `╒══════════════════╕
${member} +50 💠
\`Выполнение достижения.\`
╘══════════════════╛`)
                                    await interaction.reply({
                                        embeds: [condition_meet]
                                    })
                                    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magenta(`[Выполнено достижение]` + chalk.gray(`: ${member.user.username} выполнил достижение ${interaction.options.getString(`достижение`)}!`)))


                                }
                                    break;
                                case `№2. Подарки`: {
                                    const already_done = new EmbedBuilder()
                                        .setColor(`DarkRed`)
                                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                                        .setAuthor({
                                            name: `❗ Достижение уже выполнено!`
                                        })
                                        .setDescription(`Вы не можете выполнить данное достижение, так как вы уже выполнили его! Найти его вы можете в своем профиле.

Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)


                                    if (userData.seasonal.new_year.achievements.num2 === true) return interaction.reply({
                                        embeds: [already_done],
                                        ephemeral: true
                                    })

                                    const no_condition = new EmbedBuilder()
                                        .setColor(`DarkRed`)
                                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                                        .setAuthor({
                                            name: `❗ Вы не соответствуете требованиям!`
                                        })
                                        .setDescription(`Вы не соответствуете требованиям для получения данного достижения! Проверить требования вы можете в канале <#${ch_list.hw_achs}>.

Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)
                                        .setTimestamp(Date.now())

                                    if (userData.seasonal.new_year.opened_gifts < 10) return interaction.reply({
                                        embeds: [no_condition],
                                        ephemeral: true
                                    })
                                    let reward = `992820494900412456`
                                    const has_reward = new EmbedBuilder()
                                        .setColor(`DarkRed`)
                                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                                        .setAuthor({
                                            name: `❗ Вы имеете награду!`
                                        })
                                        .setDescription(`У вас уже есть награда за данное достижение! Пожалуйста, откройте <@&${reward}>, чтобы выполнить достижение.

Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)
                                        .setTimestamp(Date.now())
                                    if (member.roles.cache.has(reward)) return interaction.reply({
                                        embeds: [has_reward],
                                        ephemeral: true
                                    })
                                    userData.seasonal.new_year.achievements.num2 = true
                                    await member.roles.add(reward)
                                    userData.rank += 50
                                    userData.exp += 300;
                                    userData.seasonal.new_year.points += 5
                                    userData.save()
                                    client.ActExp(userData.userid)
                                    const condition_meet = new EmbedBuilder()
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/Xa6HxCU.png`)
                                        .setTitle(`✅ Достижение выполнено!`)
                                        .setTimestamp(Date.now())
                                        .setDescription(`${member} выполнил достижение \`${interaction.options.getString(`достижение`)}\`!
Он уже получил достижение! Хочешь и ты? Тогда тебе в <#1031224393189302292>

Чтобы проверить статистику ваших достижения, используйте команду \`/seasonal newyear stats\`!`)


                                    await interaction.guild.channels.cache.get(ch_list.act).send(
                                        `╒══════════════════╕
${member} +300 🌀
\`Выполнение достижения.\`
╘══════════════════╛`)

                                    await interaction.guild.channels.cache.get(ch_list.rank).send(
                                        `╒══════════════════╕
${member} +50 💠
\`Выполнение достижения.\`
╘══════════════════╛`)
                                    await interaction.reply({
                                        embeds: [condition_meet]
                                    })
                                    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magenta(`[Выполнено достижение]` + chalk.gray(`: ${member.user.username} выполнил достижение ${interaction.options.getString(`достижение`)}!`)))
                                }
                                    break;
                                case `№3. Квесты`: {
                                    const already_done = new EmbedBuilder()
                                        .setColor(`DarkRed`)
                                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                                        .setAuthor({
                                            name: `❗ Достижение уже выполнено!`
                                        })
                                        .setDescription(`Вы не можете выполнить данное достижение, так как вы уже выполнили его! Найти его вы можете в своем профиле.

Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)


                                    if (userData.seasonal.new_year.achievements.num3 === true) return interaction.reply({
                                        embeds: [already_done],
                                        ephemeral: true
                                    })
                                    const date = new Date()
                                    const day = date.getDate()
                                    const month = date.getMonth() + 1


                                    const no_condition = new EmbedBuilder()
                                        .setColor(`DarkRed`)
                                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                                        .setAuthor({
                                            name: `❗ Вы не соответствуете требованиям!`
                                        })
                                        .setDescription(`Вы не соответствуете требованиям для получения данного достижения! Проверить требования вы можете в канале <#${ch_list.hw_achs}>.

Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)
                                        .setTimestamp(Date.now())

                                    if (userData.seasonal.new_year.quests_completed < 5) return interaction.reply({
                                        embeds: [no_condition],
                                        ephemeral: true
                                    })
                                    let reward = `925799156679856240`
                                    const has_reward = new EmbedBuilder()
                                        .setColor(`DarkRed`)
                                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                                        .setAuthor({
                                            name: `❗ Вы имеете награду!`
                                        })
                                        .setDescription(`У вас уже есть награда за данное достижение! Пожалуйста, откройте <@&${reward}>, чтобы выполнить достижение.

Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)
                                        .setTimestamp(Date.now())
                                    if (member.roles.cache.has(reward)) return interaction.reply({
                                        embeds: [has_reward],
                                        ephemeral: true
                                    })
                                    userData.seasonal.new_year.achievements.num3 = true
                                    await member.roles.add(reward)
                                    userData.rank += 50
                                    userData.exp += 300;
                                    userData.seasonal.new_year.points += 5
                                    userData.save()
                                    client.ActExp(userData.userid)
                                    const condition_meet = new EmbedBuilder()
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/Xa6HxCU.png`)
                                        .setTitle(`✅ Достижение выполнено!`)
                                        .setTimestamp(Date.now())
                                        .setDescription(`${member} выполнил достижение \`${interaction.options.getString(`достижение`)}\`!
Он уже получил достижение! Хочешь и ты? Тогда тебе в <#1031224393189302292>

Чтобы проверить статистику ваших достижения, используйте команду \`/seasonal newyear stats\`!`)


                                    await interaction.guild.channels.cache.get(ch_list.act).send(
                                        `╒══════════════════╕
${member} +300 🌀
\`Выполнение достижения.\`
╘══════════════════╛`)

                                    await interaction.guild.channels.cache.get(ch_list.rank).send(
                                        `╒══════════════════╕
${member} +50 💠
\`Выполнение достижения.\`
╘══════════════════╛`)
                                    await interaction.reply({
                                        embeds: [condition_meet]
                                    })
                                    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magenta(`[Выполнено достижение]` + chalk.gray(`: ${member.user.username} выполнил достижение ${interaction.options.getString(`достижение`)}!`)))
                                }
                                    break;
                                case `№4. Календарь`: {
                                    const already_done = new EmbedBuilder()
                                        .setColor(`DarkRed`)
                                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                                        .setAuthor({
                                            name: `❗ Достижение уже выполнено!`
                                        })
                                        .setDescription(`Вы не можете выполнить данное достижение, так как вы уже выполнили его! Найти его вы можете в своем профиле.

Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)


                                    if (userData.seasonal.new_year.achievements.num4 === true) return interaction.reply({
                                        embeds: [already_done],
                                        ephemeral: true
                                    })

                                    const no_condition = new EmbedBuilder()
                                        .setColor(`DarkRed`)
                                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                                        .setAuthor({
                                            name: `❗ Вы не соответствуете требованиям!`
                                        })
                                        .setDescription(`Вы не соответствуете требованиям для получения данного достижения! Проверить требования вы можете в канале <#${ch_list.hw_achs}>.

Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)
                                        .setTimestamp(Date.now())

                                    if (userData.seasonal.new_year.adventcalendar.length < 25) return interaction.reply({
                                        embeds: [no_condition],
                                        ephemeral: true
                                    })
                                    let reward = `925799156679856240`
                                    const has_reward = new EmbedBuilder()
                                        .setColor(`DarkRed`)
                                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                                        .setAuthor({
                                            name: `❗ Вы имеете награду!`
                                        })
                                        .setDescription(`У вас уже есть награда за данное достижение! Пожалуйста, откройте <@&${reward}>, чтобы выполнить достижение.

Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)
                                        .setTimestamp(Date.now())
                                    if (member.roles.cache.has(reward)) return interaction.reply({
                                        embeds: [has_reward],
                                        ephemeral: true
                                    })
                                    userData.seasonal.new_year.achievements.num4 = true
                                    await member.roles.add(reward)
                                    userData.rank += 50
                                    userData.exp += 300;
                                    userData.seasonal.new_year.points += 5
                                    userData.save()
                                    client.ActExp(userData.userid)
                                    const condition_meet = new EmbedBuilder()
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/Xa6HxCU.png`)
                                        .setTitle(`✅ Достижение выполнено!`)
                                        .setTimestamp(Date.now())
                                        .setDescription(`${member} выполнил достижение \`${interaction.options.getString(`достижение`)}\`!
Он уже получил достижение! Хочешь и ты? Тогда тебе в <#1031224393189302292>

Чтобы проверить статистику ваших достижения, используйте команду \`/seasonal newyear stats\`!`)


                                    await interaction.guild.channels.cache.get(ch_list.act).send(
                                        `╒══════════════════╕
${member} +300 🌀
\`Выполнение достижения.\`
╘══════════════════╛`)

                                    await interaction.guild.channels.cache.get(ch_list.rank).send(
                                        `╒══════════════════╕
${member} +50 💠
\`Выполнение достижения.\`
╘══════════════════╛`)
                                    await interaction.reply({
                                        embeds: [condition_meet]
                                    })
                                    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magenta(`[Выполнено достижение]` + chalk.gray(`: ${member.user.username} выполнил достижение ${interaction.options.getString(`достижение`)}!`)))
                                }
                                    break;
                                case `№5. С Новым Годом!`: {
                                    const already_done = new EmbedBuilder()
                                        .setColor(`DarkRed`)
                                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                                        .setAuthor({
                                            name: `❗ Достижение уже выполнено!`
                                        })
                                        .setDescription(`Вы не можете выполнить данное достижение, так как вы уже выполнили его! Найти его вы можете в своем профиле.

Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)


                                    if (userData.seasonal.new_year.achievements.num5 === true) return interaction.reply({
                                        embeds: [already_done],
                                        ephemeral: true
                                    })
                                    const date = new Date()
                                    const day = date.getDate()
                                    const month = date.getMonth() + 1
                                    const no_condition = new EmbedBuilder()
                                        .setColor(`DarkRed`)
                                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                                        .setAuthor({
                                            name: `❗ Вы не соответствуете требованиям!`
                                        })
                                        .setDescription(`Вы не соответствуете требованиям для получения данного достижения! Проверить требования вы можете в канале <#${ch_list.hw_achs}>.

Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)
                                        .setTimestamp(Date.now())

                                    if ((day !== 31 && month !== 12) && (day !== 1 && month !== 1)) return interaction.reply({
                                        embeds: [no_condition],
                                        ephemeral: true
                                    })
                                    let reward = `595966177969176579`
                                    const has_reward = new EmbedBuilder()
                                        .setColor(`DarkRed`)
                                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                                        .setAuthor({
                                            name: `❗ Вы имеете награду!`
                                        })
                                        .setDescription(`У вас уже есть награда за данное достижение! Пожалуйста, откройте <@&${reward}>, чтобы выполнить достижение.

Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)
                                        .setTimestamp(Date.now())
                                    if (member.roles.cache.has(reward)) return interaction.reply({
                                        embeds: [has_reward],
                                        ephemeral: true
                                    })
                                    userData.seasonal.new_year.achievements.num5 = true
                                    await member.roles.add(reward)
                                    userData.rank += 50
                                    userData.exp += 300;
                                    userData.seasonal.new_year.points += 5
                                    userData.save()
                                    client.ActExp(userData.userid)
                                    const condition_meet = new EmbedBuilder()
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/Xa6HxCU.png`)
                                        .setTitle(`✅ Достижение выполнено!`)
                                        .setTimestamp(Date.now())
                                        .setDescription(`${member} выполнил достижение \`${interaction.options.getString(`достижение`)}\`!
Он уже получил достижение! Хочешь и ты? Тогда тебе в <#1031224393189302292>

Чтобы проверить статистику ваших достижения, используйте команду \`/seasonal newyear stats\`!`)


                                    await interaction.guild.channels.cache.get(ch_list.act).send(
                                        `╒══════════════════╕
${member} +300 🌀
\`Выполнение достижения.\`
╘══════════════════╛`)

                                    await interaction.guild.channels.cache.get(ch_list.rank).send(
                                        `╒══════════════════╕
${member} +50 💠
\`Выполнение достижения.\`
╘══════════════════╛`)
                                    await interaction.reply({
                                        embeds: [condition_meet]
                                    })
                                    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magenta(`[Выполнено достижение]` + chalk.gray(`: ${member.user.username} выполнил достижение ${interaction.options.getString(`достижение`)}!`)))
                                }
                                    break;
                                case `№6. Потерянный костюм`: {
                                    const already_done = new EmbedBuilder()
                                        .setColor(`DarkRed`)
                                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                                        .setAuthor({
                                            name: `❗ Достижение уже выполнено!`
                                        })
                                        .setDescription(`Вы не можете выполнить данное достижение, так как вы уже выполнили его! Найти его вы можете в своем профиле.
    
Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)


                                    if (userData.seasonal.new_year.achievements.num6 === true) return interaction.reply({
                                        embeds: [already_done],
                                        ephemeral: true
                                    })

                                    const no_condition = new EmbedBuilder()
                                        .setColor(`DarkRed`)
                                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                                        .setAuthor({
                                            name: `❗ Вы не соответствуете требованиям!`
                                        })
                                        .setDescription(`Вы не соответствуете требованиям для получения данного достижения! Проверить требования вы можете в канале <#${ch_list.hw_achs}>.
    
Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)
                                        .setTimestamp(Date.now())

                                    if ((userData.seasonal.new_year.santa_suit.bag == false || userData.seasonal.new_year.santa_suit.hat == false || userData.seasonal.new_year.santa_suit.chest == false || userData.seasonal.new_year.santa_suit.gloves == false) && userData.seasonal.new_year.suits_returned <= 0) return interaction.reply({
                                        embeds: [no_condition],
                                        ephemeral: true
                                    })
                                    let reward = `925799156679856240`
                                    const has_reward = new EmbedBuilder()
                                        .setColor(`DarkRed`)
                                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                                        .setAuthor({
                                            name: `❗ Вы имеете награду!`
                                        })
                                        .setDescription(`У вас уже есть награда за данное достижение! Пожалуйста, откройте <@&${reward}>, чтобы выполнить достижение.
    
Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)
                                        .setTimestamp(Date.now())
                                    if (member.roles.cache.has(reward)) return interaction.reply({
                                        embeds: [has_reward],
                                        ephemeral: true
                                    })
                                    userData.seasonal.new_year.achievements.num6 = true
                                    await member.roles.add(reward)
                                    userData.rank += 50
                                    userData.exp += 300;
                                    userData.seasonal.new_year.points += 5
                                    userData.save()
                                    client.ActExp(userData.userid)
                                    const condition_meet = new EmbedBuilder()
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/Xa6HxCU.png`)
                                        .setTitle(`✅ Достижение выполнено!`)
                                        .setTimestamp(Date.now())
                                        .setDescription(`${member} выполнил достижение \`${interaction.options.getString(`достижение`)}\`!
Он уже получил достижение! Хочешь и ты? Тогда тебе в <#1031224393189302292>
    
Чтобы проверить статистику ваших достижения, используйте команду \`/seasonal newyear stats\`!`)


                                    await interaction.guild.channels.cache.get(ch_list.act).send(
                                        `╒══════════════════╕
${member} +300 🌀
\`Выполнение достижения.\`
╘══════════════════╛`)

                                    await interaction.guild.channels.cache.get(ch_list.rank).send(
                                        `╒══════════════════╕
${member} +50 💠
\`Выполнение достижения.\`
╘══════════════════╛`)
                                    await interaction.reply({
                                        embeds: [condition_meet]
                                    })
                                    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magenta(`[Выполнено достижение]` + chalk.gray(`: ${member.user.username} выполнил достижение ${interaction.options.getString(`достижение`)}!`)))
                                }
                                    break;

                                default:
                                    break;
                            }
                        }
                            break;
                        case `buy`: {
                            const userData = await User.findOne({ userid: interaction.user.id, guildid: interaction.guild.id })
                            const symb = interaction.options.getString(`товар`)
                            let price
                            if (symb == `🎄` || symb == `✨` || symb == `🎆`) {
                                price = 30
                            } else if (symb == `🎁`) {
                                price = 40
                            } else if (symb == `🎇` || symb == `🎈`) {
                                price = 50
                            }

                            if (userData.seasonal.new_year.points < price) return interaction.reply({
                                content: `Для покупки \`${symb}\` вам необходимо минимум ${price} очков! У вас на данный момент ${userData.seasonal.new_year.points} очков`
                            })
                            userData.seasonal.new_year.points -= price
                            userData.seasonal.new_year.hw_cosm = true
                            userData.displayname.symbol = symb
                            userData.save()
                            await interaction.reply({
                                content: `Вы приобрели \`${symb}\` за ${price} новогодних очков! В скором времени данный значок появится в вашем никнейме! Если этого не произойдёт в течение 15 минут, обратитесь в вопрос-модерам!`
                            })
                        }
                            break;
                        case `leaderboards`: {
                            const users = await User.find({
                                "seasonal.new_year.points": { $gt: 0 }
                            }).then(users => {
                                return users.filter(async user => await interaction.guild.members.fetch(user.userid))
                            })
                            const sort = users.sort((a, b) => {
                                return b.seasonal.new_year.points - a.seasonal.new_year.points
                            }).slice(0, 10)
                            let index = 1
                            const map = sort.map(async (user) => {
                                const tag = await interaction.guild.members.fetch(user.userid)
                                return `**${index++}.** ${tag}: ${user.seasonal.new_year.points} очков`
                            })
                            const mapProm = await Promise.all(map)


                            const embed = new EmbedBuilder()
                                .setColor(Number(linksInfo.bot_color))
                                .setAuthor({
                                    name: `Лучшие пользователи по новогодним очкам`
                                })
                                .setTimestamp(Date.now())
                                .setDescription(`**Список**:        
${mapProm.join('\n')}`)

                            await interaction.reply({
                                embeds: [embed]
                            })
                        }
                            break;
                        case `quest`: {
                            const quests = require(`./Seasonal Data/New Year Quests.json`)
                            const userData = await User.findOne({ userid: interaction.user.id, guildid: interaction.guild.id })
                            const action = interaction.options.getString(`действие`)
                            const response = await fetch(`https://api.hypixel.net/player?key=${api}&uuid=${userData.uuid}`)
                            let json
                            if (response.ok) {
                                json = await response.json()
                            }
                            if (action == `start`) {

                                if (userData.cooldowns.ny_quest > Date.now())
                                    return interaction.reply({
                                        embeds: [
                                            new EmbedBuilder()
                                                .setColor(Number(linksInfo.bot_color))
                                                .setAuthor({
                                                    name: `Вы не можете использовать эту команду`
                                                })
                                                .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${prettyMilliseconds(userData.cooldowns.ny_quest - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}!`)
                                        ],
                                        ephemeral: true
                                    });
                                const quest = quests[Math.floor(Math.random() * quests.length)]
                                let wins = await getProperty(json.player.stats, quest.code)
                                if (!wins) wins = 0

                                userData.seasonal.new_year.quest.before = wins
                                userData.seasonal.new_year.quest.finished = false
                                userData.seasonal.new_year.quest.id = quest.id
                                userData.seasonal.new_year.quest.requirement = wins + quest.req_wins
                                userData.cooldowns.ny_quest = Date.now() + (1000 * 60 * 60 * 16)
                                userData.save()
                                const questEmbed = new EmbedBuilder()
                                    .setColor(`White`)
                                    .setTitle(`Новогодний квест для ${interaction.user.username}`)
                                    .setDescription(`${interaction.member} получил новогоднее задание:
\`${quest.description}\`

За его выполнение вы получите <@&${quest.reward}>`)
                                    .setTimestamp(Date.now())
                                    .setThumbnail(interaction.user.displayAvatarURL())
                                await interaction.channel.send({
                                    embeds: [questEmbed]
                                })

                            } else if (action == `finish`) {
                                const quest = quests.find(q => q.id == userData.seasonal.new_year.quest.id)
                                if (!quest) return interaction.reply({
                                    content: `Не удалось найти ваш квест!`,
                                    ephemeral: true
                                })
                                if (userData.seasonal.new_year.quest.finished == true) return interaction.reply({
                                    content: `Вы уже выполнили этот квест!`,
                                    ephemeral: true
                                })
                                let wins = await getProperty(json.player.stats, quest.code)
                                if (!wins) wins = 0
                                if (wins < userData.seasonal.new_year.quest.requirement) return interaction.reply({
                                    content: `Вы не выполнили условие этого квеста! Вам нужно \`${quest.description}\`, вы сделали ${wins - userData.seasonal.new_year.quest.before}/${quest.req_wins}!`,
                                    ephemeral: true
                                })
                                if (interaction.member.roles.cache.has(quest.reward)) {
                                    await userData.stacked_items.push(quest.reward)
                                } else {
                                    await interaction.member.roles.add(quest.reward)
                                }
                                userData.quests.seasonal.stats.ny.total += 1
                                userData.seasonal.new_year.quest.finished = true
                                userData.seasonal.new_year.points += 5
                                userData.seasonal.new_year.quests_completed += 1
                                userData.save()

                                const done = new EmbedBuilder()
                                    .setColor(`White`)
                                    .setTitle(`Новогодний квест выполнен`)
                                    .setDescription(`${interaction.member} выполнил новогоднее задание \`${quest.description}\`! Он получил <@&${quest.reward}>!

**Количество выполненных заданий**: ${userData.seasonal.new_year.quests_completed}`)
                                await interaction.channel.send({
                                    embeds: [done]
                                })
                            }
                        }
                            break;
                        case `stats`: {
                            const user = interaction.options.getUser(`пользователь`) || interaction.user
                            const member = interaction.options.getMember(`пользователь`) || interaction.member
                            if (user.bot) return interaction.reply({
                                content: `${user} является ботом, а значит он не может получать новогодние очки :'(`
                            })
                            if (!member || !member.roles.cache.has(`504887113649750016`)) return interaction.reply({
                                content: `${member} не является участником гильдии!`
                            })
                            const users = await User.find().then(users => {
                                return users.filter(async user => await interaction.guild.members.fetch(user.userid))
                            })
                            const sorts = users.sort((a, b) => {
                                return b.seasonal.new_year.points - a.seasonal.new_year.points
                            })
                            var i = 0
                            while (sorts[i].userid !== user.id) {
                                i++
                            }
                            const userData = await User.findOne({ userid: user.id, guildid: interaction.guild.id })
                            let rank = i + 1
                            const response = await fetch(`https://api.hypixel.net/player?key=${api}&uuid=${userData.uuid}`)
                            let json
                            if (response.ok) {
                                json = await response.json()
                            }
                            const quests = require(`./Seasonal Data/New Year Quests.json`)
                            const quest = quests.find(q => q.id == userData.seasonal.new_year.quest.id)
                            let reward = `<@&${quest?.reward}>`
                            if (!quest?.reward) reward = `Нет награды`
                            let wins = await getProperty(json.player.stats, quest?.code)
                            if (!wins) wins = 0
                            const embed = new EmbedBuilder()
                                .setTitle(`Новогодняя статистика пользователя ${user.username}`)
                                .setDescription(`**Позиция в топе**: ${rank}
**Очков**: ${userData.seasonal.new_year.points}
**Открыто подарков**: ${userData.seasonal.new_year.opened_gifts}
**Выполнено квестов**: ${userData.seasonal.new_year.quests_completed}

**ДОСТИЖЕНИЯ**
**Достижение №1**: ${achievementStats(userData.seasonal.new_year.achievements.num1)}
**Достижение №2**: ${achievementStats(userData.seasonal.new_year.achievements.num2)}
**Достижение №3**: ${achievementStats(userData.seasonal.new_year.achievements.num3)}
**Достижение №4**: ${achievementStats(userData.seasonal.new_year.achievements.num4)}
**Достижение №5**: ${achievementStats(userData.seasonal.new_year.achievements.num5)}
**Достижение №6**: ${achievementStats(userData.seasonal.new_year.achievements.num6)}

**ТЕКУЩИЙ КВЕСТ**
**Условие**: \`${quest?.description ? quest.description : `Нет квеста`}\`
**Количество на начало квеста**: ${userData.seasonal.new_year.quest.before}
**Количество на конец квеста**: ${userData.seasonal.new_year.quest.requirement}
**Текущее количество**: ${wins}
**Награда**: ${reward}
**Статус**: \`${userData.seasonal.new_year.quest.finished ? `Завершено ✅` : `Не завершено ❌`}\`

**КОСТЮМ ДЕДА МОРОЗА**
**Шапка**: \`${userData.seasonal.new_year.santa_suit.hat ? `Найдено ✅` : `Не найдено ❌`}\`
**Шуба**: \`${userData.seasonal.new_year.santa_suit.chest ? `Найдено ✅` : `Не найдено ❌`}\`
**Варежки**: \`${userData.seasonal.new_year.santa_suit.gloves ? `Найдено ✅` : `Не найдено ❌`}\`
**Мешок**: \`${userData.seasonal.new_year.santa_suit.bag ? `Найдено ✅` : `Не найдено ❌`}\``)
                                .setThumbnail(user.displayAvatarURL())
                                .setColor(Number(linksInfo.bot_color))
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
};