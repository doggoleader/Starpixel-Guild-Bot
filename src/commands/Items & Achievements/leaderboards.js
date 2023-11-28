const { SlashCommandBuilder, Attachment, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { Guild } = require(`../../schemas/guilddata`)
const { User } = require(`../../schemas/userdata`);

const { GuildProgress } = require('../../misc_functions/Exporter');


/**
 * 
 * @param {import("discord.js").ChatInputCommandInteraction} interaction Interaction
 * @param {import("../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {

        await interaction.deferReply({
            fetchReply: true
        })

        const users = await User.find().then(users => {
            return users.filter(async user => await interaction.guild.members.fetch(user.userid))
        })
        let sort1 = users.sort((a, b) => {
            return b.exp - a.exp
        })
        let sort = sort1.sort((a, b) => {
            return b.level - a.level
        })
        let index = 1
        let i = 0
        let map = []
        for (let user of sort) {
            if (map.length < 10) {
                if (user.pers_settings.is_in_leaderboard == true) {
                    const tag = await interaction.guild.members.fetch(user.userid)
                    map.push(`**${index++}.** ${tag} > ${user.level} уровень & ${user.exp}🌀`)
                } else {
                    i++
                }

            }
        }


        let embed = new EmbedBuilder()
            .setColor(Number(client.information.bot_color))
            .setTitle(`Лучшие пользователи по опыту активности`)
            .setTimestamp(Date.now())
            .setDescription(`${map.slice(0, 10).join('\n')}
                
\* *Исключено из списка ${i} человек(а) из-за их настроек приватности.*`)

        let selectMenu = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(`select`)
                    .setPlaceholder(`Виды таблиц лидеров`)
                    .addOptions(
                        {
                            label: `Опыт активности`,
                            description: `Таблица лидеров по опыту активности`,
                            value: `act`,
                            emoji: `🌀`,
                            default: true
                        },
                        {
                            label: `Опыт рангов`,
                            description: `Таблица лидеров по опыту рангов`,
                            value: `rank`,
                            emoji: `💠`,
                            default: false
                        },
                        {
                            label: `Румбики`,
                            description: `Таблица лидеров по количеству румбиков`,
                            value: `rumbik`,
                            emoji: `<:Rumbik:883638847056003072>`,
                            default: false
                        },
                        {
                            label: `Совместные игры`,
                            description: `Таблица лидеров по кол-ву посещённых совместных`,
                            value: `guild_games`,
                            emoji: `🎲`,
                            default: false
                        },
                        {
                            label: `Билеты`,
                            description: `Таблица лидеров по количеству билетов`,
                            value: `tickets`,
                            emoji: `🏷`,
                            default: false
                        },
                        {
                            label: `Прогресс в гильдии`,
                            description: `Таблица лидеров по уровню прогресса в гильдии`,
                            value: `progress`,
                            emoji: `🌠`,
                            default: false
                        },
                    )
                    .setMinValues(1)
                    .setMaxValues(1)
            )
        const msg = await interaction.editReply({
            embeds: [embed],
            components: [selectMenu],
            fetchReply: true
        })

        const collector = msg.createMessageComponentCollector()

        collector.on('collect', async (int) => {
            const value = int.values[0]
            if (interaction.user.id === int.user.id) {
                await selectMenu.components[0].options.forEach(option => {
                    if (option.data.value == value) {
                        option.data.default = true
                    } else option.data.default = false
                })
                if (value == `act`) {
                    await int.deferUpdate()
                    sort1 = users.sort((a, b) => {
                        return b.exp - a.exp
                    })
                    sort = sort1.sort((a, b) => {
                        return b.level - a.level
                    })
                    index = 1
                    i = 0
                    map = []
                    for (let user of sort) {
                        if (map.length < 10) {
                            if (user.pers_settings.is_in_leaderboard == true) {
                                const tag = await interaction.guild.members.fetch(user.userid)
                                map.push(`**${index++}.** ${tag} > ${user.level} уровень & ${user.exp}🌀`)
                            } else {
                                i++
                            }

                        }
                    }
                    embed.setTitle(`Лучшие пользователи по опыту активности`)
                        .setTimestamp(Date.now())
                        .setDescription(`${map.slice(0, 10).join('\n')}
                
\* *Исключено из списка ${i} человек(а) из-за их настроек приватности.*`)

                    await interaction.editReply({
                        embeds: [embed],
                        components: [selectMenu],
                        fetchReply: true
                    })
                } else if (value == `rank`) {
                    await int.deferUpdate()
                    sort = users.sort((a, b) => {
                        return b.rank - a.rank
                    })
                    index = 1
                    i = 0
                    map = []
                    for (let user of sort) {
                        if (map.length < 10) {
                            if (user.pers_settings.is_in_leaderboard == true) {
                                const tag = await interaction.guild.members.fetch(user.userid)
                                map.push(`**${index++}.** ${tag} >> ${user.rank}💠`)
                            } else {
                                i++
                            }

                        }
                    }

                    embed.setTitle(`Лучшие пользователи по опыту рангов`)
                        .setTimestamp(Date.now())
                        .setDescription(`${map.slice(0, 10).join('\n')}
                
\* *Исключено из списка ${i} человек(а) из-за их настроек приватности.*`)


                    await interaction.editReply({
                        embeds: [embed],
                        components: [selectMenu],
                        fetchReply: true
                    })
                } else if (value == `rumbik`) {
                    await int.deferUpdate()
                    sort = users.sort((a, b) => {
                        return b.rumbik - a.rumbik
                    })
                    index = 1
                    i = 0
                    map = []
                    for (let user of sort) {
                        if (map.length < 10) {
                            if (user.pers_settings.is_in_leaderboard == true) {
                                const tag = await interaction.guild.members.fetch(user.userid)
                                map.push(`**${index++}.** ${tag} >> ${user.rumbik}<:Rumbik:883638847056003072>`)
                            } else {
                                i++
                            }

                        }
                    }

                    embed.setTitle(`Лучшие пользователи по количеству румбиков`)
                        .setTimestamp(Date.now())
                        .setDescription(`${map.slice(0, 10).join('\n')}
                
\* *Исключено из списка ${i} человек(а) из-за их настроек приватности.*`)

                    await interaction.editReply({
                        embeds: [embed],
                        components: [selectMenu],
                        fetchReply: true
                    })
                } else if (value == `guild_games`) {
                    await int.deferUpdate()
                    sort = users.sort((a, b) => {
                        return b.visited_games - a.visited_games
                    })
                    index = 1
                    i = 0
                    map = []
                    for (let user of sort) {
                        if (map.length < 10) {
                            if (user.pers_settings.is_in_leaderboard == true) {
                                const tag = await interaction.guild.members.fetch(user.userid)
                                map.push(`**${index++}.** ${tag} >> ${user.visited_games}🎲`)
                            } else {
                                i++
                            }

                        }
                    }

                    embed.setTitle(`Лучшие пользователи по количеству посещённых совместных игр`)
                        .setTimestamp(Date.now())
                        .setDescription(`${map.slice(0, 10).join('\n')}
                
\* *Исключено из списка ${i} человек(а) из-за их настроек приватности.*`)

                    await interaction.editReply({
                        embeds: [embed],
                        components: [selectMenu],
                        fetchReply: true
                    })
                } else if (value == `tickets`) {
                    await int.deferUpdate()
                    sort = users.sort((a, b) => {
                        return b.tickets - a.tickets
                    })
                    index = 1
                    i = 0
                    map = []
                    for (let user of sort) {
                        if (map.length < 10) {
                            if (user.pers_settings.is_in_leaderboard == true) {
                                const tag = await interaction.guild.members.fetch(user.userid)
                                map.push(`**${index++}.** ${tag} >> ${user.tickets}🏷`)
                            } else {
                                i++
                            }

                        }
                    }

                    embed.setTitle(`Лучшие пользователи по количеству билетов`)
                        .setTimestamp(Date.now())
                        .setDescription(`${map.slice(0, 10).join('\n')}
                
\* *Исключено из списка ${i} человек(а) из-за их настроек приватности.*`)

                    await interaction.editReply({
                        embeds: [embed],
                        components: [selectMenu],
                        fetchReply: true
                    })
                } else if (value == `progress`) {
                    await int.deferUpdate()
                    sort = users.sort((a, b) => {
                        return b.progress.points - a.progress.points
                    })
                    const progress = new GuildProgress(i.member, client)
                    let total = await progress.getMaxPoints();
                    index = 1
                    i = 0
                    map = []
                    for (let user of sort) {
                        if (map.length < 10) {
                            if (user.pers_settings.is_in_leaderboard == true) {
                                const tag = await interaction.guild.members.fetch(user.userid)
                                let sum = Math.round(1000 * (user.progress.points / total)) / 10
                                map.push(`**${index++}.** ${tag} >> ${user.progress.points}/${total} (${sum}% завершено)`)
                            } else {
                                i++
                            }

                        }
                    }

                    embed.setTitle(`Лучшие пользователи по уровеню развития в гильдии`)
                        .setTimestamp(Date.now())
                        .setDescription(`${map.slice(0, 10).join('\n')}
                
\* *Исключено из списка ${i} человек(а) из-за их настроек приватности.*`)

                    await interaction.editReply({
                        embeds: [embed],
                        components: [selectMenu],
                        fetchReply: true
                    })
                }
            } else {
                if (value == `act`) {
                    await int.deferReply({ fetchReply: true, ephemeral: true })
                    sort1 = users.sort((a, b) => {
                        return b.exp - a.exp
                    })
                    sort = sort1.sort((a, b) => {
                        return b.level - a.level
                    })
                    index = 1
                    i = 0
                    map = []
                    for (let user of sort) {
                        if (map.length < 10) {
                            if (user.pers_settings.is_in_leaderboard == true) {
                                const tag = await interaction.guild.members.fetch(user.userid)
                                map.push(`**${index++}.** ${tag} > ${user.level} уровень & ${user.exp}🌀`)
                            } else {
                                i++
                            }

                        }
                    }

                    embed.setTitle(`Лучшие пользователи по опыту активности`)
                        .setTimestamp(Date.now())
                        .setDescription(`${map.slice(0, 10).join('\n')}
                
\* *Исключено из списка ${i} человек(а) из-за их настроек приватности.*`)

                    await int.editReply({
                        embeds: [embed]
                    })
                } else if (value == `rank`) {
                    await int.deferReply({ fetchReply: true, ephemeral: true })
                    sort = users.sort((a, b) => {
                        return b.rank - a.rank
                    })
                    index = 1
                    i = 0
                    map = []
                    for (let user of sort) {
                        if (map.length < 10) {
                            if (user.pers_settings.is_in_leaderboard == true) {
                                const tag = await interaction.guild.members.fetch(user.userid)
                                map.push(`**${index++}.** ${tag} >> ${user.rank}💠`)
                            } else {
                                i++
                            }

                        }
                    }

                    embed.setTitle(`Лучшие пользователи по опыту рангов`)
                        .setTimestamp(Date.now())
                        .setDescription(`${map.slice(0, 10).join('\n')}
                
\* *Исключено из списка ${i} человек(а) из-за их настроек приватности.*`)

                    await int.editReply({
                        embeds: [embed]
                    })
                } else if (value == `rumbik`) {
                    await int.deferReply({ fetchReply: true, ephemeral: true })
                    sort = users.sort((a, b) => {
                        return b.rumbik - a.rumbik
                    })
                    index = 1
                    i = 0
                    map = []
                    for (let user of sort) {
                        if (map.length < 10) {
                            if (user.pers_settings.is_in_leaderboard == true) {
                                const tag = await interaction.guild.members.fetch(user.userid)
                                map.push(`**${index++}.** ${tag} >> ${user.rumbik}<:Rumbik:883638847056003072>`)
                            } else {
                                i++
                            }

                        }
                    }

                    embed.setTitle(`Лучшие пользователи по количеству румбиков`)
                        .setTimestamp(Date.now())
                        .setDescription(`${map.slice(0, 10).join('\n')}
                
\* *Исключено из списка ${i} человек(а) из-за их настроек приватности.*`)

                    await int.editReply({
                        embeds: [embed]
                    })
                } else if (value == `guild_games`) {
                    await int.deferReply({ fetchReply: true, ephemeral: true })
                    sort = users.sort((a, b) => {
                        return b.visited_games - a.visited_games
                    })
                    index = 1
                    i = 0
                    map = []
                    for (let user of sort) {
                        if (map.length < 10) {
                            if (user.pers_settings.is_in_leaderboard == true) {
                                const tag = await interaction.guild.members.fetch(user.userid)
                                map.push(`**${index++}.** ${tag} >> ${user.visited_games}🎲`)
                            } else {
                                i++
                            }

                        }
                    }

                    await int.editReply({
                        embeds: [embed]
                    })
                } else if (value == `tickets`) {
                    await int.deferReply({ fetchReply: true, ephemeral: true })
                    sort = users.sort((a, b) => {
                        return b.tickets - a.tickets
                    })
                    index = 1
                    i = 0
                    map = []
                    for (let user of sort) {
                        if (map.length < 10) {
                            if (user.pers_settings.is_in_leaderboard == true) {
                                const tag = await interaction.guild.members.fetch(user.userid)
                                map.push(`**${index++}.** ${tag} >> ${user.tickets}🏷`)
                            } else {
                                i++
                            }

                        }
                    }

                    embed.setTitle(`Лучшие пользователи по количеству билетов`)
                        .setTimestamp(Date.now())
                        .setDescription(`${map.slice(0, 10).join('\n')}
                
\* *Исключено из списка ${i} человек(а) из-за их настроек приватности.*`)

                    await int.editReply({
                        embeds: [embed]
                    })
                } else if (value == `progress`) {
                    await int.deferUpdate()
                    sort = users.sort((a, b) => {
                        return b.progress.points - a.progress.points
                    })
                    const progress = new GuildProgress(i.member, client)
                    let total = await progress.getMaxPoints();
                    index = 1
                    i = 0
                    map = []
                    for (let user of sort) {
                        if (map.length < 10) {
                            if (user.pers_settings.is_in_leaderboard == true) {
                                const tag = await interaction.guild.members.fetch(user.userid)
                                let sum = Math.round(1000 * (user.progress.points / total)) / 10
                                map.push(`**${index++}.** ${tag} >> ${user.progress.points}/${total} (${sum}% завершено)`)
                            } else {
                                i++
                            }

                        }
                    }

                    embed.setTitle(`Лучшие пользователи по уровеню развития в гильдии`)
                        .setTimestamp(Date.now())
                        .setDescription(`${map.slice(0, 10).join('\n')}
                
\* *Исключено из списка ${i} человек(а) из-за их настроек приватности.*`)

                    await int.editReply({
                        embeds: [embed],
                        fetchReply: true
                    })
                }
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
    category: `items`,
    plugin: {
        id: "items",
        name: "Предметы"
    },
    data: new SlashCommandBuilder()
        .setName(`leaderboard`)
        .setDescription(`Лучшие пользователи по различным предметам`)
        .setDMPermission(false),
    execute
};