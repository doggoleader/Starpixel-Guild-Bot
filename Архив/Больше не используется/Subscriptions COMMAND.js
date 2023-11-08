const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const { execute } = require('../../src/events/client/start_bot/ready');
const fetch = require(`node-fetch`);
const api = process.env.hypixel_apikey;
const { User } = require(`../../src/schemas/userdata`)
const { Guild } = require(`../../src/schemas/guilddata`)
const chalk = require(`chalk`);
const prettyMilliseconds = require(`pretty-ms`); //ДОБАВИТЬ В ДРУГИЕ
const ch_list = require(`../../src/discord structure/channels.json`)
const linksInfo = require(`../../src/discord structure/links.json`)

module.exports = {
    category: `prem`,
    plugin: `info`,
    data: new SlashCommandBuilder()
        .setName(`subscription`)
        .setDescription(`Коробки для участников с подпиской`)
        .addSubcommand(sb => sb
            .setName(`first`)
            .setDescription(`Коробка для подписчиков I уровня`)
        )
        .addSubcommand(sb => sb
            .setName(`second`)
            .setDescription(`Коробка для подписчиков II уровня`)
        )
        .addSubcommand(sb => sb
            .setName(`third`)
            .setDescription(`Коробка для подписчиков III уровня`)
        )
        .addSubcommand(sb => sb
            .setName(`premium`)
            .setDescription(`Коробка для Premium подписчиков`)
        )

        .setDMPermission(false),

    async execute(interaction, client) {
        try {
            const pluginData = await Guild.findOne({ id: interaction.guild.id })
            if (pluginData.plugins.premium === false) return interaction.reply({ content: `Данный плагин отключён! Попробуйте позже!`, ephemeral: true })
            const user = interaction.member
            const userData = await User.findOne({ userid: user.user.id })

            switch (interaction.options.getSubcommand()) {
                case `first`: {
                    const embed = new EmbedBuilder()
                        .setAuthor({
                            name: `❗ Отсутствует необходимая роль!`
                        })
                        .setDescription(`Вы не имеете роль \`${interaction.guild.roles.cache.get(`1007290181038133269`).name}\`!`)
                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                        .setColor(`DarkRed`)
                        .setTimestamp(Date.now())
                    if (!user.roles.cache.has(`1007290181038133269`)) return interaction.reply({
                        embeds: [embed],
                        ephemeral: true
                    })

                    const cd = new EmbedBuilder()
                        .setColor(Number(linksInfo.bot_color))
                        .setAuthor({
                            name: `Вы не можете использовать эту команду`
                        })
                        .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${prettyMilliseconds(userData.cooldowns.sub_1 - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}!`)
                        .setTimestamp(Date.now())
                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)

                    if (userData.cooldowns.sub_1 > Date.now()) return interaction.reply({
                        embeds: [cd],
                        ephemeral: true
                    });

                    const loot = [
                        {
                            group: 1,
                            name: `Маленькую коробку`,
                            roleID: `510932601721192458`,
                            chance: 35
                        },
                        {
                            group: 1,
                            name: `Мешочек`,
                            roleID: `819930814388240385`,
                            chance: 40
                        },
                        {
                            group: 1,
                            name: `Большую коробку`,
                            roleID: `521248091853291540`,
                            chance: 25
                        }
                    ]
                    let sum_loot = 0;
                    for (let i_loot = 0; i_loot < loot.length; i_loot++) {
                        sum_loot += loot[i_loot].chance * 1
                    }
                    let r_loot = Math.floor(Math.random() * sum_loot);
                    let i_loot = 0;
                    for (let s = loot[0].chance; s <= r_loot; s += loot[i_loot].chance) {
                        i_loot++;
                    }
                    const msg = await interaction.guild.channels.cache.get(ch_list.box).send({
                        content: `◾
${user} открывает коробку подписчика I уровня...
|————————۞————————|
\`${loot[i_loot].name}.\`
Открой, чтобы получить награды.
|————————۞————————|
◾`
                    })
                    if (loot[i_loot].group == 1) {
                        if (!user.roles.cache.has(loot[i_loot].roleID)) {
                            user.roles.add(loot[i_loot].roleID)
                            await msg.react(`✅`)
                        } else {
                            await msg.react(`🚫`)
                        }
                    }



                    userData.cooldowns.sub_1 = Date.now() + (1000 * 60 * 60 * 24 * 7)
                    userData.save()
                }
                    break;
                case `second`: {
                    const embed = new EmbedBuilder()
                        .setAuthor({
                            name: `❗ Отсутствует необходимая роль!`
                        })
                        .setDescription(`Вы не имеете роль \`${interaction.guild.roles.cache.get(`1007290181847613530`).name}\`!`)
                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                        .setColor(`DarkRed`)
                        .setTimestamp(Date.now())
                    if (!user.roles.cache.has(`1007290181847613530`)) return interaction.reply({
                        embeds: [embed],
                        ephemeral: true
                    })

                    const cd = new EmbedBuilder()
                        .setColor(Number(linksInfo.bot_color))
                        .setAuthor({
                            name: `Вы не можете использовать эту команду`
                        })
                        .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${prettyMilliseconds(userData.cooldowns.sub_2 - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}!`)
                        .setTimestamp(Date.now())
                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)

                    if (userData.cooldowns.sub_2 > Date.now()) return interaction.reply({
                        embeds: [cd],
                        ephemeral: true
                    });


                    const loot = [
                        {
                            group: 1,
                            name: `Маленькую коробку`,
                            roleID: `510932601721192458`,
                            chance: 35
                        },
                        {
                            group: 1,
                            name: `Мешочек`,
                            roleID: `819930814388240385`,
                            chance: 40
                        },
                        {
                            group: 1,
                            name: `Большую коробку`,
                            roleID: `521248091853291540`,
                            chance: 25
                        },
                        {
                            group: 1,
                            name: `Огромную коробку`,
                            roleID: `992820494900412456`,
                            chance: 10
                        },
                        {
                            group: 1,
                            name: `Королевскую коробку`,
                            roleID: `584673040470769667`,
                            chance: 7
                        }
                    ]
                    let sum_loot = 0;
                    for (let i_loot = 0; i_loot < loot.length; i_loot++) {
                        sum_loot += loot[i_loot].chance * 1
                    }
                    let r_loot = Math.floor(Math.random() * sum_loot);
                    let i_loot = 0;
                    for (let s = loot[0].chance; s <= r_loot; s += loot[i_loot].chance) {
                        i_loot++;
                    }
                    const msg = await interaction.guild.channels.cache.get(ch_list.box).send({
                        content: `◾
${user} открывает коробку подписчика II уровня...
|———————~۞~———————|
\`${loot[i_loot].name}.\`
Открой, чтобы получить награды.
|———————~۞~———————|
◾`
                    })
                    if (loot[i_loot].group == 1) {
                        if (!user.roles.cache.has(loot[i_loot].roleID)) {
                            user.roles.add(loot[i_loot].roleID)
                            await msg.react(`✅`)
                        } else {
                            await msg.react(`🚫`)
                        }
                    }



                    userData.cooldowns.sub_2 = Date.now() + (1000 * 60 * 60 * 24 * 7)
                    userData.save()
                }
                    break;
                case `third`: {
                    const embed = new EmbedBuilder()
                        .setAuthor({
                            name: `❗ Отсутствует необходимая роль!`
                        })
                        .setDescription(`Вы не имеете роль \`${interaction.guild.roles.cache.get(`1007290182883622974`).name}\`!`)
                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                        .setColor(`DarkRed`)
                        .setTimestamp(Date.now())
                    if (!user.roles.cache.has(`1007290182883622974`)) return interaction.reply({
                        embeds: [embed],
                        ephemeral: true
                    })

                    const cd = new EmbedBuilder()
                        .setColor(Number(linksInfo.bot_color))
                        .setAuthor({
                            name: `Вы не можете использовать эту команду`
                        })
                        .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${prettyMilliseconds(userData.cooldowns.sub_3 - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}!`)
                        .setTimestamp(Date.now())
                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)

                    if (userData.cooldowns.sub_3 > Date.now()) return interaction.reply({
                        embeds: [cd],
                        ephemeral: true
                    });


                    const loot = [
                        {
                            group: 1,
                            name: `Маленькую коробку`,
                            roleID: `510932601721192458`,
                            chance: 350
                        },
                        {
                            group: 1,
                            name: `Мешочек`,
                            roleID: `819930814388240385`,
                            chance: 400
                        },
                        {
                            group: 1,
                            name: `Большую коробку`,
                            roleID: `521248091853291540`,
                            chance: 250
                        },
                        {
                            group: 1,
                            name: `Огромную коробку`,
                            roleID: `992820494900412456`,
                            chance: 100
                        },
                        {
                            group: 1,
                            name: `Королевскую коробку`,
                            roleID: `584673040470769667`,
                            chance: 70
                        },
                        {
                            group: 1,
                            name: `Сокровища`,
                            roleID: `595966177969176579`,
                            chance: 30
                        },
                        {
                            group: 1,
                            name: `Подарок судьбы`,
                            roleID: `781069821953441832`,
                            chance: 10
                        }
                    ]
                    let sum_loot = 0;
                    for (let i_loot = 0; i_loot < loot.length; i_loot++) {
                        sum_loot += loot[i_loot].chance * 1
                    }
                    let r_loot = Math.floor(Math.random() * sum_loot);
                    let i_loot = 0;
                    for (let s = loot[0].chance; s <= r_loot; s += loot[i_loot].chance) {
                        i_loot++;
                    }
                    const msg = await interaction.guild.channels.cache.get(ch_list.box).send({
                        content: `◾
${user} открывает коробку подписчика III уровня...
|———————~ஜ۞ஜ~———————|
\`${loot[i_loot].name}.\`
Открой, чтобы получить награды.
|———————~ஜ۞ஜ~———————|
◾`
                    })
                    if (loot[i_loot].group == 1) {
                        if (!user.roles.cache.has(loot[i_loot].roleID)) {
                            user.roles.add(loot[i_loot].roleID)
                            await msg.react(`✅`)
                        } else {
                            await msg.react(`🚫`)
                        }
                    }
                    let rumbik = [
                        {
                            rumb_amount: 20,
                            dropChanceRUMB: 49
                        },
                        {
                            rumb_amount: 30,
                            dropChanceRUMB: 33
                        },
                        {
                            rumb_amount: 40,
                            dropChanceRUMB: 17
                        },
                        {
                            rumb_amount: 50,
                            dropChanceRUMB: 1
                        },

                    ]

                    //Рандом - румбики
                    let sum_rumb = 0;
                    for (let i_rumb = 0; i_rumb < rumbik.length; i_rumb++) {
                        sum_rumb += rumbik[i_rumb].dropChanceRUMB;
                    }
                    let r_rumbik = Math.floor(Math.random() * sum_rumb);
                    let i_rumb = 0;
                    for (let s = rumbik[0].dropChanceRUMB; s <= r_rumbik; s += rumbik[i_rumb].dropChanceRUMB) {
                        i_rumb++;
                    }

                    //Сообщение - румбики 
                    let rumb_amount = rumbik[i_rumb].rumb_amount * userData.pers_rumb_boost
                    interaction.guild.channels.cache.get(ch_list.rumb).send(
                        `╔═════════♡════════╗
${user} +${rumb_amount}<:Rumbik:883638847056003072>
\`Получено из коробки подписчика III.\`
╚═════════♡════════╝`
                    );
                    if (userData.rank_number >= 3) {
                        userData.rumbik += rumb_amount
                    } else {
                        userData.rumbik += 0
                    }



                    userData.cooldowns.sub_3 = Date.now() + (1000 * 60 * 60 * 24 * 7)
                    userData.save()
                }
                    break;
                case `premium`: {
                    const embed = new EmbedBuilder()
                        .setAuthor({
                            name: `❗ Отсутствует необходимая роль!`
                        })
                        .setDescription(`Вы не имеете роль \`${interaction.guild.roles.cache.get(`850336260265476096`).name}\`!`)
                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                        .setColor(`DarkRed`)
                        .setTimestamp(Date.now())
                    if (!user.roles.cache.has(`850336260265476096`)) return interaction.reply({
                        embeds: [embed],
                        ephemeral: true
                    })

                    const cd = new EmbedBuilder()
                        .setColor(Number(linksInfo.bot_color))
                        .setAuthor({
                            name: `Вы не можете использовать эту команду`
                        })
                        .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${prettyMilliseconds(userData.cooldowns.premium - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}!`)
                        .setTimestamp(Date.now())
                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)

                    if (userData.cooldowns.premium > Date.now()) return interaction.reply({
                        embeds: [cd],
                        ephemeral: true
                    });

                    const loot = [
                        {
                            group: 1,
                            name: `Жуткая коробка`,
                            roleID: `893932177799135253`,
                            chance: 200
                        },
                        {
                            group: 1,
                            name: `Новогодний подарок`,
                            roleID: `925799156679856240`,
                            chance: 200
                        },
                        {
                            group: 1,
                            name: `Пасхальное яйцо`,
                            roleID: `1007718117809606736`,
                            chance: 200
                        },
                        {
                            group: 1,
                            name: `Большая коробка`,
                            roleID: `521248091853291540`,
                            chance: 400
                        },
                        {
                            group: 1,
                            name: `Коробка активности`,
                            roleID: `983435186920366100`,
                            chance: 250
                        },
                        {
                            group: 1,
                            name: `Огромная коробка`,
                            roleID: `992820494900412456`,
                            chance: 100
                        },
                        {
                            group: 1,
                            name: `Королевская коробка`,
                            roleID: `584673040470769667`,
                            chance: 70
                        },
                        {
                            group: 1,
                            name: `Сокровища`,
                            roleID: `595966177969176579`,
                            chance: 30
                        },
                        {
                            group: 1,
                            name: `Подарок судьбы`,
                            roleID: `781069821953441832`,
                            chance: 10
                        },
                        {
                            group: 1,
                            name: `Загадочная коробка`,
                            roleID: `992820488298578041`,
                            chance: 1
                        }
                    ]
                    let sum_loot = 0;
                    for (let i_loot = 0; i_loot < loot.length; i_loot++) {
                        sum_loot += loot[i_loot].chance * 1
                    }
                    let r_loot = Math.floor(Math.random() * sum_loot);
                    let i_loot = 0;
                    for (let s = loot[0].chance; s <= r_loot; s += loot[i_loot].chance) {
                        i_loot++;
                    }
                    const msg = await interaction.guild.channels.cache.get(ch_list.box).send({
                        content: `◾:star:◾
${user} открывает премиум коробку...
|—————~ஜ۩۞۩ஜ~—————|
\`${loot[i_loot].name}.\`
Открой, чтобы получить награды.
|—————~ஜ۩۞۩ஜ~—————|
◾:star:◾`
                    })
                    if (loot[i_loot].group == 1) {
                        if (!user.roles.cache.has(loot[i_loot].roleID)) {
                            await user.roles.add(loot[i_loot].roleID)
                            await msg.react(`✅`)
                        } else {
                            await msg.react(`🚫`)
                        }
                    }

                    let rumbik = [
                        {
                            rumb_amount: 40,
                            dropChanceRUMB: 49
                        },
                        {
                            rumb_amount: 50,
                            dropChanceRUMB: 33
                        },
                        {
                            rumb_amount: 60,
                            dropChanceRUMB: 17
                        },
                        {
                            rumb_amount: 70,
                            dropChanceRUMB: 1
                        },

                    ]

                    //Рандом - румбики
                    let sum_rumb = 0;
                    for (let i_rumb = 0; i_rumb < rumbik.length; i_rumb++) {
                        sum_rumb += rumbik[i_rumb].dropChanceRUMB;
                    }
                    let r_rumbik = Math.floor(Math.random() * sum_rumb);
                    let i_rumb = 0;
                    for (let s = rumbik[0].dropChanceRUMB; s <= r_rumbik; s += rumbik[i_rumb].dropChanceRUMB) {
                        i_rumb++;
                    }

                    //Сообщение - румбики 
                    let rumb_amount = rumbik[i_rumb].rumb_amount * userData.pers_rumb_boost
                    interaction.guild.channels.cache.get(ch_list.rumb).send(
                        `╔═════════♡════════╗
${user} +${rumb_amount}<:Rumbik:883638847056003072>
\`Получено из премиум-коробки.\`
╚═════════♡════════╝`
                    );
                    if (userData.rank_number >= 3) {
                        userData.rumbik += rumb_amount
                    } else {
                        userData.rumbik += 0
                    }


                    userData.cooldowns.premium = Date.now() + (1000 * 60 * 60 * 24 * 7)
                    userData.save()
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