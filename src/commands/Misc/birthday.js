const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ComponentType, ButtonStyle } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const fetch = require(`node-fetch`);
const api = process.env.hypixel_apikey;
const { User } = require(`../../schemas/userdata`)
const { Guild } = require(`../../schemas/guilddata`)
const chalk = require(`chalk`);
const prettyMilliseconds = require(`pretty-ms`); //ДОБАВИТЬ В ДРУГИЕ
const { toOrdinalSuffix } = require(`../../functions`)
const linksInfo = require(`../../discord structure/links.json`)

/**
 * 
 * @param {import("discord.js").ChatInputCommandInteraction} interaction Interaction
 * @param {import("../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {

        switch (interaction.options.getSubcommand()) {
            case `set`: {
                if (!interaction.member.roles.cache.has(`563793535250464809`)) {
                    const embed = new EmbedBuilder()
                        .setAuthor({
                            name: `❗ Отсутствует необходимая роль!`
                        })
                        .setDescription(`Вы не имеете роль \`${interaction.guild.roles.cache.get(`320880176416161802`).name}\`!`)
                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                        .setColor(`DarkRed`)
                        .setTimestamp(Date.now())

                    return interaction.reply({
                        embeds: [embed],
                        ephemeral: true
                    })
                }
                const member = interaction.options.getMember(`пользователь`)
                if (!member.roles.cache.has(`504887113649750016`)) return interaction.reply({
                    content: `Данный участник не находится в гильдии!`,
                    ephemeral: true
                })
                const user = interaction.options.getUser(`пользователь`)
                const date = new Date()
                const currentYear = date.getFullYear()
                const currentMonth = date.getMonth() + 1
                const currentDate = date.getDate()

                let strDate = interaction.options.getString(`дата`)
                let arr = strDate.split(`.`, 3)


                const Day = new Number(arr[0])
                const Month = new Number(arr[1])
                const Year = new Number(arr[2])

                const list = {
                    1: "января",
                    2: "февраля",
                    3: "марта",
                    4: "апреля",
                    5: "мая",
                    6: "июня",
                    7: "июля",
                    8: "августа",
                    9: "сентября",
                    10: "октября",
                    11: "ноября",
                    12: "декабря",

                }
                if (Month == 1 || Month == 3 || Month == 5 || Month == 7 || Month == 8 || Month == 10 || Month == 12) {
                    if (Day > 31 || Day <= 0) return interaction.reply({
                        content: `День должен быть между 1 и 31!`,
                        ephemeral: true
                    })
                } else if (Month == 4 || Month == 6 || Month == 9 || Month == 11) {
                    if (Day > 30 || Day <= 0) return interaction.reply({
                        content: `День должен быть между 1 и 30!`,
                        ephemeral: true
                    })
                } else if (new Date(Year, 1, 29).getDate() === 29) {
                    if (Day > 29 || Day <= 0) return interaction.reply({
                        content: `День должен быть между 1 и 29!`,
                        ephemeral: true
                    })
                } else if (new Date(Year, 1, 29).getDate() !== 29) {
                    if (Day > 28 || Day <= 0) return interaction.reply({
                        content: `День должен быть между 1 и 28!`,
                        ephemeral: true
                    })
                }


                if (Month > 12 || Month <= 0) return interaction.reply({
                    content: `Месяц должен быть между 1 и 12!`,
                    ephemeral: true
                })

                if (Year >= currentYear) return interaction.reply({
                    content: `Текущий год не может быть меньше, чем год рождения участника!`,
                    ephemeral: true
                })
                await interaction.deferReply({ fetchReply: true })
                const oneDay = 1000 * 60 * 60 * 24

                const firstDate = new Date(currentYear, Month, Day)
                const secondDate = new Date(currentYear, currentMonth, currentDate)
                let diffDays = Math.round((firstDate - secondDate) / oneDay)

                let dayCount

                if (new Date(currentYear, 1, 29).getDate() === 29) {
                    dayCount = 366
                } else {
                    dayCount = 365
                }

                let remDays
                let wishYear

                if (diffDays > 0) {
                    remDays = diffDays
                    wishYear = currentYear
                } else {
                    remDays = diffDays + dayCount
                    wishYear = currentYear + 1
                }

                const age = toOrdinalSuffix(wishYear - Year)

                const userData = await User.findOne({ guildid: interaction.guild.id, userid: user.id })

                userData.birthday.day = Day;
                userData.birthday.month = Month;
                userData.birthday.year = Year;
                userData.save()

                const b_embed = new EmbedBuilder()
                    .setTitle(`Установлен день рождения`)
                    .setColor(Number(linksInfo.bot_color))
                    .setThumbnail(user.displayAvatarURL())
                    .setDescription(`🎂 Я поздравлю ${user} с **${age}** днём рождения через ${remDays} дн., **${Day} ${list[Month]}, ${wishYear}**!`)

                await interaction.editReply({
                    embeds: [b_embed]
                })


            }

                break;
            case `remove`: {
                const user = interaction.options.getUser(`пользователь`)
                const userData = await User.findOne({ guildid: interaction.guild.id, userid: user.id })
                if (userData.birthday.day || userData.birthday.month || userData.birthday.year) {
                    userData.birthday.day = null;
                    userData.birthday.month = null;
                    userData.birthday.year = null;
                    userData.save()

                    const b_embed = new EmbedBuilder()
                        .setTitle(`Удалён день рождения`)
                        .setColor(Number(linksInfo.bot_color))
                        .setThumbnail(user.displayAvatarURL())
                        .setDescription(`✅ - Удалён день рождения пользователя ${user}!`)
                    await interaction.reply({
                        embeds: [b_embed],
                        ephemeral: true
                    })

                } else {
                    const b_embed = new EmbedBuilder()
                        .setTitle(`День рождения не установлен`)
                        .setColor(Number(linksInfo.bot_color))
                        .setThumbnail(user.displayAvatarURL())
                        .setDescription(`❌ - День рождения ${user} не был установлен, поэтому я не смог его удалить!`)

                    await interaction.reply({
                        embeds: [b_embed],
                        ephemeral: true
                    })
                }

            }

                break;
            case `list`: {
                const listData = await User.find({ guildid: interaction.guild.id })

                const no_bd = new EmbedBuilder()
                    .setTitle(`Нет дней рождений`)
                    .setColor(Number(linksInfo.bot_color))
                    .setThumbnail(interaction.guild.iconURL())
                    .setDescription(`❌ - На данном сервере нет дней рождений, очень жаль :'(`)
                if (!listData) return interaction.reply({
                    embeds: [no_bd],
                    ephemeral: true
                })


                const date = new Date()
                const currentDate = date.getDate()
                const currentMonth = date.getMonth() + 1
                const currentYear = date.getFullYear()

                let index = 1
                listData.sort((a, b) => new Date(`${a.birthday.month} ${a.birthday.day}`) - new Date(`${b.birthday.month} ${b.birthday.day}`))


                let n = 0
                const birthdayDataS = listData.map((d) => {
                    const firstDate = new Date(currentYear, d.birthday.month, d.birthday.day)
                    const secondDate = new Date(currentYear, currentMonth, currentDate)

                    const oneDay = 1000 * 60 * 60 * 24
                    let diffDays = Math.round((firstDate - secondDate) / oneDay)

                    let wishYear

                    if (diffDays > 0) {
                        wishYear = currentYear
                    } else {
                        wishYear = currentYear + 1
                    }

                    const age = wishYear - d.year
                    return `**${index++}.** \`${d.birthday.day}.${d.birthday.month}.${d.birthday.year}\` - ${client.users.cache.get(d.userid)} (в ${wishYear} исполнится ${age})`
                })

                const totalPages = Math.ceil(listData.length / 10)
                let birthdayData = birthdayDataS.slice(0 + (n * 10), 10 + (n * 10))
                const pages = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`prev`)
                            .setEmoji(`⬅`)
                            .setStyle(ButtonStyle.Danger)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`stop`)
                            .setEmoji(`⏹`)
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(false)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`next`)
                            .setEmoji(`➡`)
                            .setStyle(ButtonStyle.Success)
                            .setDisabled(false)
                    )


                const list = new EmbedBuilder()
                    .setTitle(`Список дней рождений`)
                    .setThumbnail(interaction.guild.iconURL())
                    .setColor(Number(linksInfo.bot_color))
                    .setTimestamp(Date.now())
                    .setDescription(`${birthdayData.join(`\n`)}`)
                    .setFooter({
                        text: `Страница ${n + 1}/${totalPages}`
                    })

                let msg = await interaction.reply({
                    embeds: [list],
                    components: [pages],
                    fetchReply: true
                })

                const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button })
                collector.on('collect', async (i) => {
                    if (i.customId == `prev`) {
                        n = n - 1
                        if (n <= 0) {
                            pages.components[0].setDisabled(true)
                        } else {
                            pages.components[0].setDisabled(false)
                        }
                        pages.components[1].setDisabled(false)
                        pages.components[2].setDisabled(false)
                        birthdayData = birthdayDataS.slice(0 + (n * 10), 10 + (n * 10))
                        list.setTimestamp(Date.now())
                            .setDescription(`${birthdayData.join(`\n`)}`)
                            .setFooter({
                                text: `Страница ${n + 1}/${totalPages}`
                            })
                        await i.deferUpdate()
                        await interaction.editReply({
                            embeds: [list],
                            components: [pages],
                            fetchReply: true
                        })

                    } else if (i.customId == `stop`) {
                        await i.deferUpdate()
                        collector.stop()
                    } else if (i.customId == `next`) {
                        n = n + 1
                        if (n >= totalPages - 1) {
                            pages.components[2].setDisabled(true)
                        } else {
                            pages.components[2].setDisabled(false)
                        }
                        pages.components[1].setDisabled(false)
                        pages.components[0].setDisabled(false)
                        birthdayData = birthdayDataS.slice(0 + (n * 10), 10 + (n * 10))
                        list.setTimestamp(Date.now())
                            .setDescription(`${birthdayData.join(`\n`)}`)
                            .setFooter({
                                text: `Страница ${n + 1}/${totalPages}`
                            })
                        await i.deferUpdate()
                        await interaction.editReply({
                            embeds: [list],
                            components: [pages],
                            fetchReply: true
                        })
                    }
                })

                collector.on('end', async (collected) => {
                    n = n
                    pages.components[0].setDisabled(true)
                    pages.components[1].setDisabled(true)
                    pages.components[2].setDisabled(true)
                    birthdayData = birthdayDataS.slice(0 + (n * 10), 10 + (n * 10))
                    list.setTimestamp(Date.now())
                        .setDescription(`${birthdayData.join(`\n`)}`)
                        .setFooter({
                            text: `Страница ${n + 1}/${totalPages}`
                        })
                    await interaction.editReply({
                        embeds: [list],
                        components: [pages]
                    })
                })
            }

                break;
            case `check`: {
                const user = interaction.options.getUser(`пользователь`)
                const listData = await User.findOne({ guildid: interaction.guild.id, userid: user.id })
                const no_bd = new EmbedBuilder()
                    .setTitle(`Нет дня рождения`)
                    .setColor(Number(linksInfo.bot_color))
                    .setThumbnail(interaction.guild.iconURL())
                    .setDescription(`❌ - У данного пользователя нет дня рождения, очень жаль :'(`)
                if (!listData.birthday.day && !listData.birthday.month && !listData.birthday.year) return interaction.reply({
                    embeds: [no_bd],
                    ephemeral: true
                })

                const list = new EmbedBuilder()
                    .setTitle(`День рождения ${user.username}`)
                    .setThumbnail(user.displayAvatarURL())
                    .setColor(Number(linksInfo.bot_color))
                    .setTimestamp(Date.now())
                    .setDescription(`🎂 - Пользователь ${user} отмечает свой день рождения \`${listData.birthday.day}.${listData.birthday.month}.${listData.birthday.year}\`!`)

                await interaction.reply({
                    embeds: [list]
                })

            }

                break;

            default: {
                await interaction.reply({
                    content: `Данной опции не существует! Выберите одну из предложенных!`,
                    ephemeral: true
                })
            }
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
    category: `birthdays`,
    plugin: {
        id: "birthday",
        name: "Дни рождения"
    },
    data: new SlashCommandBuilder()
        .setName(`birthday`)
        .setDescription(`Дни рождения участников гильдии`)
        .setDMPermission(false)
        .addSubcommand(subcommand => subcommand
            .setName(`set`)
            .setDescription(`Установить день рождения пользователю`)
            .addUserOption(option => option
                .setName(`пользователь`)
                .setDescription(`Пользовать, чей день рождения необходимо установить`)
                .setRequired(true)
            )
            .addStringOption(option => option
                .setName(`дата`)
                .setDescription(`Установить день рождения пользователя. Писать в следующем формате: DD.MM.YYYY`)
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName(`remove`)
            .setDescription(`Удалить день рождения пользователя`)
            .addUserOption(option => option
                .setName(`пользователь`)
                .setDescription(`Пользовать, чей день рождения необходимо удалить`)
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName(`list`)
            .setDescription(`Посмотреть следующие 10 дней рождений`)
        )
        .addSubcommand(subcommand => subcommand
            .setName(`check`)
            .setDescription(`Показать день рождения пользователя`)
            .addUserOption(option => option
                .setName(`пользователь`)
                .setDescription(`Пользовать, чей день рождения хотите проверить`)
                .setRequired(true)
            )
        ),
    execute
};


