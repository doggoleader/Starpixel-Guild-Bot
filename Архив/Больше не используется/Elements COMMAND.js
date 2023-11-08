const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { execute } = require('../../src/events/client/start_bot/ready');
const fetch = require(`node-fetch`);
const api = process.env.hypixel_apikey;
const { User } = require(`../../src/schemas/userdata`)
const chalk = require(`chalk`);
const prettyMilliseconds = require(`pretty-ms`); //ДОБАВИТЬ В ДРУГИЕ
const ch_list = require(`../../src/discord structure/channels.json`)
const linksInfo = require(`../../src/discord structure/links.json`)

module.exports = {
    category: `el`,
    plugin: `info`,
    data: new SlashCommandBuilder()
        .setName(`elements`)
        .setDescription(`Стихии гильдии Starpixel`)
        .setDMPermission(false)
        .addSubcommand(subcommand => subcommand
            .setName(`earth`)
            .setDescription(`Использовать стихию земли`)
        )
        .addSubcommand(subcommand => subcommand
            .setName(`air`)
            .setDescription(`Использовать стихию воздуха`)
        )
        .addSubcommand(subcommand => subcommand
            .setName(`water`)
            .setDescription(`Использовать стихию воды`)
        )
        .addSubcommand(subcommand => subcommand
            .setName(`fire`)
            .setDescription(`Использовать стихию огня`)
        ),

    async execute(interaction, client) {
        try {
            const { Guild } = require(`../../src/schemas/guilddata`)
            const pluginData = await Guild.findOne({ id: interaction.guild.id })
            if (pluginData.plugins.pets === false) return interaction.reply({ content: `Данный плагин отключён! Попробуйте позже!`, ephemeral: true })

            const user = interaction.member
            const userData = await User.findOne({ userid: user.id })
            let role = ``
            switch (interaction.options.getSubcommand()) {
                case `earth`: {
                    role = `930169143347523604`
                    const no_role = new EmbedBuilder()
                        .setAuthor({
                            name: `❗ Отсутствует необходимая роль!`
                        })
                        .setDescription(`Вы не имеете роль \`${interaction.guild.roles.cache.get(role).name}\`!`)
                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                        .setColor(`DarkRed`)
                        .setTimestamp(Date.now())
                    if (!user.roles.cache.has(role)) return interaction.reply({
                        embeds: [no_role],
                        ephemeral: true
                    })

                    const cd = new EmbedBuilder()
                        .setColor(Number(linksInfo.bot_color))
                        .setAuthor({
                            name: `Вы не можете использовать эту команду`
                        })
                        .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${prettyMilliseconds(userData.cooldowns.earth - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}!`)

                    if (userData.cooldowns.earth > Date.now()) return interaction.reply({
                        embeds: [cd],
                        ephemeral: true
                    })

                    try {
                        await interaction.deferReply({ fetchReply: true })
                        await interaction.deleteReply()
                        let pet = [
                            {
                                dropChance: 20,
                                name: "❕ 🎁 МАЛЕНЬКАЯ /small",
                                roleID: `510932601721192458`
                            },
                            {
                                dropChance: 40,
                                name: "❕ 💰 МЕШОЧЕК /bag",
                                roleID: `819930814388240385`
                            },
                            {
                                dropChance: 15,
                                name: "❕ 🎁 БОЛЬШАЯ /big",
                                roleID: `521248091853291540`
                            },
                            {
                                dropChance: 5,
                                name: "❕ 🎁 КОРОЛЕВСКАЯ /king",
                                roleID: `584673040470769667`
                            },


                        ]

                        let sum_act = 0;
                        for (let i_act = 0; i_act < pet.length; i_act++) {
                            sum_act += pet[i_act].dropChance;
                        }
                        let r_act = Math.floor(Math.random() * sum_act);
                        let i_act = 0;
                        for (let s = pet[0].dropChance; s <= r_act; s += pet[i_act].dropChance) {
                            i_act++;
                        }

                        const r_loot_msg = await interaction.guild.channels.cache.get(ch_list.box).send(
                            `:black_medium_small_square:
🌳 ${user} использует силы Стихии Земли:
╭─────✿✿✿─────╮
Он откапывает из-под земли \`${pet[i_act].name}\`
╰─────✿✿✿─────╯
:black_medium_small_square:`
                        );
                        userData.cooldowns.earth = Date.now() + (1000 * 60 * 60 * 24 * 7)
                        userData.save()
                        if (!user.roles.cache.has(pet[i_act].roleID)) {
                            await user.roles.add(pet[i_act].roleID).catch(console.error);
                            await r_loot_msg.react("✅")
                        } else {
                            if (user.roles.cache.has(pet[i_act].roleID)) {
                                await r_loot_msg.react("🚫")
                            }
                        };
                    } catch (error) {
                        console.log(chalk.blackBright(`[${new Date()}]`) + chalk.red(`[Ошибка]`) + chalk.white(`: ${user.user.username} получил ошибку при выдаче ${pet[i_act].name}`))
                    }


                }

                    break;
                case `air`: {
                    role = `930169145314652170`
                    const no_role = new EmbedBuilder()
                        .setAuthor({
                            name: `❗ Отсутствует необходимая роль!`
                        })
                        .setDescription(`Вы не имеете роль \`${interaction.guild.roles.cache.get(role).name}\`!`)
                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                        .setColor(`DarkRed`)
                        .setTimestamp(Date.now())
                    if (!user.roles.cache.has(role)) return interaction.reply({
                        embeds: [no_role],
                        ephemeral: true
                    })

                    const cd = new EmbedBuilder()
                        .setColor(Number(linksInfo.bot_color))
                        .setAuthor({
                            name: `Вы не можете использовать эту команду`
                        })
                        .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${prettyMilliseconds(userData.cooldowns.air - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}!`)

                    if (userData.cooldowns.air > Date.now()) return interaction.reply({
                        embeds: [cd],
                        ephemeral: true
                    })

                    try {
                        await interaction.deferReply({ fetchReply: true })
                        await interaction.deleteReply()
                        let pet = [
                            {
                                dropChance: 10,
                                name: 300
                            },
                            {
                                dropChance: 5,
                                name: 500
                            },
                            {
                                dropChance: 35,
                                name: 400
                            },
                            {
                                dropChance: 50,
                                name: 200
                            },


                        ]

                        let sum_act = 0;
                        for (let i_act = 0; i_act < pet.length; i_act++) {
                            sum_act += pet[i_act].dropChance;
                        }
                        let r_act = Math.floor(Math.random() * sum_act);
                        let i_act = 0;
                        for (let s = pet[0].dropChance; s <= r_act; s += pet[i_act].dropChance) {
                            i_act++;
                        }

                        interaction.guild.channels.cache.get(ch_list.act).send(
                            `:black_medium_small_square:
🌪️ ${user} использует силы Стихии Воздуха:
╭─────↯─────╮
Он получает \`${pet[i_act].name}\`🌀.
╰─────↯─────╯
:black_medium_small_square:`
                        );
                        userData.exp += pet[i_act].name
                        userData.total += pet[i_act].name
                        userData.cooldowns.air = Date.now() + (1000 * 60 * 60 * 24 * 7)
                        userData.save()
                        client.ActExp(userData.userid)


                    } catch (error) {
                        console.log(chalk.blackBright(`[${new Date()}]`) + chalk.red(`[Ошибка]`) + chalk.white(`: ${user.user.username} получил ошибку при выдаче ${pet[i_act].name}`))
                    }


                }

                    break;
                case `water`: {
                    role = `930169139866259496`
                    const no_role = new EmbedBuilder()
                        .setAuthor({
                            name: `❗ Отсутствует необходимая роль!`
                        })
                        .setDescription(`Вы не имеете роль \`${interaction.guild.roles.cache.get(role).name}\`!`)
                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                        .setColor(`DarkRed`)
                        .setTimestamp(Date.now())
                    if (!user.roles.cache.has(role)) return interaction.reply({
                        embeds: [no_role],
                        ephemeral: true
                    })
                    const cd = new EmbedBuilder()
                        .setColor(Number(linksInfo.bot_color))
                        .setAuthor({
                            name: `Вы не можете использовать эту команду`
                        })
                        .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${prettyMilliseconds(userData.cooldowns.water - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}!`)

                    if (userData.cooldowns.water > Date.now()) return interaction.reply({
                        embeds: [cd],
                        ephemeral: true
                    })

                    try {
                        await interaction.deferReply({ fetchReply: true })
                        await interaction.deleteReply()
                        let pet = [
                            {
                                dropChance: 15,
                                name: 35
                            },
                            {
                                dropChance: 5,
                                name: 50
                            },
                            {
                                dropChance: 30,
                                name: 40
                            },
                            {
                                dropChance: 50,
                                name: 30
                            },


                        ]

                        let sum_act = 0;
                        for (let i_act = 0; i_act < pet.length; i_act++) {
                            sum_act += pet[i_act].dropChance;
                        }
                        let r_act = Math.floor(Math.random() * sum_act);
                        let i_act = 0;
                        for (let s = pet[0].dropChance; s <= r_act; s += pet[i_act].dropChance) {
                            i_act++;
                        }

                        interaction.guild.channels.cache.get(ch_list.rank).send(
                            `:black_medium_small_square:
🌊 ${user} использует силы Стихии Воды:
╭─────ஐ─────╮
Он получает \`${pet[i_act].name}\`💠
╰─────ஐ─────╯
:black_medium_small_square:`
                        );
                        userData.rank += pet[i_act].name
                        userData.cooldowns.water = Date.now() + (1000 * 60 * 60 * 24 * 7)
                        userData.save()


                    } catch (error) {
                        console.log(chalk.blackBright(`[${new Date()}]`) + chalk.red(`[Ошибка]`) + chalk.white(`: ${user.user.username} получил ошибку при выдаче ${pet[i_act].name}`))
                    }


                }

                    break;
                case `fire`: {

                    role = `930169133671280641`
                    const no_role = new EmbedBuilder()
                        .setAuthor({
                            name: `❗ Отсутствует необходимая роль!`
                        })
                        .setDescription(`Вы не имеете роль \`${interaction.guild.roles.cache.get(role).name}\`!`)
                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                        .setColor(`DarkRed`)
                        .setTimestamp(Date.now())
                    if (!user.roles.cache.has(role)) return interaction.reply({
                        embeds: [no_role],
                        ephemeral: true
                    })
                    const cd = new EmbedBuilder()
                        .setColor(Number(linksInfo.bot_color))
                        .setAuthor({
                            name: `Вы не можете использовать эту команду`
                        })
                        .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${prettyMilliseconds(userData.cooldowns.fire - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}!`)

                    if (userData.cooldowns.fire > Date.now()) return interaction.reply({
                        embeds: [cd],
                        ephemeral: true
                    })

                    try {
                        await interaction.deferReply({ fetchReply: true })
                        await interaction.deleteReply()
                        let pet = [
                            {
                                dropChance: 50,
                                name: 5
                            },
                            {
                                dropChance: 30,
                                name: 10
                            },
                            {
                                dropChance: 15,
                                name: 15
                            },
                            {
                                dropChance: 5,
                                name: 20
                            },


                        ]

                        let sum_act = 0;
                        for (let i_act = 0; i_act < pet.length; i_act++) {
                            sum_act += pet[i_act].dropChance;
                        }
                        let r_act = Math.floor(Math.random() * sum_act);
                        let i_act = 0;
                        for (let s = pet[0].dropChance; s <= r_act; s += pet[i_act].dropChance) {
                            i_act++;
                        }

                        interaction.guild.channels.cache.get(ch_list.rumb).send(
                            `:black_medium_small_square:
🔥 ${user} использует силы Стихии Огня:
╭─────๑۩۩๑─────╮
Он откапывает из-под земли \`${pet[i_act].name}\`<:Rumbik:883638847056003072>
╰─────๑۩۩๑─────╯
:black_medium_small_square:`
                        );
                        userData.rumbik += pet[i_act].name
                        userData.cooldowns.fire = Date.now() + (1000 * 60 * 60 * 24 * 7)
                        userData.save()


                    } catch (error) {
                        console.log(chalk.blackBright(`[${new Date()}]`) + chalk.red(`[Ошибка]`) + chalk.white(`: ${user.user.username} получил ошибку при выдаче ${pet[i_act].name}`))
                    }


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
};