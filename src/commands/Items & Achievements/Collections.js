const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const { execute } = require('../../events/client/start_bot/ready');
const wait = require('node:timers/promises').setTimeout;
const fetch = require(`node-fetch`);
const api = process.env.hypixel_apikey;
const { User } = require(`../../schemas/userdata`)
const { Guild } = require(`../../schemas/guilddata`)
const chalk = require(`chalk`);
const prettyMilliseconds = require(`pretty-ms`); //ДОБАВИТЬ В ДРУГИЕ
const linksInfo = require(`../../discord structure/links.json`)
const { isOneEmoji } = require(`is-emojis`);
const { rankName } = require('../../functions');
const { Temp } = require('../../schemas/temp_items');

module.exports = {
    category: `coll`,
    plugin: {
        id: "items",
        name: "Предметы"
    },
    data: new SlashCommandBuilder()
        .setName(`collections`)
        .setDescription(`Коллекции гильдии`)
        .setDMPermission(false)
        .addSubcommand(gr => gr
            .setName(`dog`)
            .setDescription(`Использовать коллекцию собаки`)
        )
        .addSubcommand(sb => sb
            .setName(`cat`)
            .setDescription(`Использовать коллекцию кота`)
        )
        .addSubcommand(sb => sb
            .setName(`rabbit`)
            .setDescription(`Использовать коллекцию кролика`)
        )
        .addSubcommand(sb => sb
            .setName(`fox`)
            .setDescription(`Использовать коллекцию лисы`)
        )
        .addSubcommand(sb => sb
            .setName(`lion`)
            .setDescription(`Использовать коллекцию льва`)
        ),
    async execute(interaction, client) {
        try {
            const { member, user, guild } = interaction
            const userData = await User.findOne({ userid: user.id, guildid: guild.id })
            if (userData.rank_number < 9) return interaction.reply({
                content: `Вы не можете использовать эту команду, так как у вас слишком низкий ранг!`,
                ephemeral: true
            })
            switch (interaction.options.getSubcommand()) {
                case `dog`: {

                    let coll = [`1020400007989444678`, `1020400017330163712`, `1020400015300120638`]
                    if (!member.roles.cache.has(coll[0]) || !member.roles.cache.has(coll[1]) || !member.roles.cache.has(coll[2])) return interaction.reply({
                        content: `Вы не собрали полностью коллекцию Собаки, поэтому не можете использовать эту команду!`,
                        ephemeral: true
                    })

                    if (userData.cooldowns.dog > Date.now()) return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(Number(linksInfo.bot_color))
                                .setAuthor({
                                    name: `Вы не можете использовать эту команду`
                                })
                                .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${prettyMilliseconds(userData.cooldowns.dog - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}!`)
                        ],
                        ephemeral: true
                    });

                    let values = [5, 6, 7, 8, 9, 10]
                    let value = values[Math.floor(Math.random() * values.length)]
                    let lasts = [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
                    let last = lasts[Math.floor(Math.random() * lasts.length)]
                    const temp = new Temp({
                        userid: user.id,
                        guildid: guild.id,
                        extraInfo: `pers_act_boost`,
                        number: value,
                        expire: Date.now() + (1000 * 60 * 60 * 24 * last)
                    })
                    temp.save()

                    userData.pers_act_boost += value
                    userData.cooldowns.dog = Date.now() + (1000 * 60 * 60 * 24 * 30)
                    userData.save()
                    const embed = new EmbedBuilder()
                        .setColor(Number(linksInfo.bot_color))
                        .setTitle(`Использована коллекция Собаки`)
                        .setTimestamp(Date.now())
                        .setDescription(`${member} использовал **КОЛЛЕКЦИЮ СОБАКИ**! 
Коллекция Собаки позволяет своему владельцу увеличить множитель опыта активности в несколько раз.

**Награда**:
Множитель опыта активности: \`${value}x на ${last} дн.\``)
                    await interaction.reply({
                        embeds: [embed]
                    })
                }
                    break;
                case `cat`: {
                    let coll = [`1020400022350725122`, `1020400026045915167`, `1020400024397565962`]
                    if (!member.roles.cache.has(coll[0]) || !member.roles.cache.has(coll[1]) || !member.roles.cache.has(coll[2])) return interaction.reply({
                        content: `Вы не собрали полностью коллекцию Кота, поэтому не можете использовать эту команду!`,
                        ephemeral: true
                    })
                    if (userData.cooldowns.cat > Date.now()) return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(Number(linksInfo.bot_color))
                                .setAuthor({
                                    name: `Вы не можете использовать эту команду`
                                })
                                .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${prettyMilliseconds(userData.cooldowns.cat - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}!`)
                        ],
                        ephemeral: true
                    });
                    let values = [4, 5, 6, 7]
                    let value = values[Math.floor(Math.random() * values.length)]
                    let lasts = [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
                    let last = lasts[Math.floor(Math.random() * lasts.length)]
                    const temp1 = new Temp({
                        userid: user.id,
                        guildid: guild.id,
                        extraInfo: `box_chances.legendary`,
                        number: value,
                        expire: Date.now() + (1000 * 60 * 60 * 24 * last)
                    })
                    temp1.save()
                    const temp2 = new Temp({
                        userid: user.id,
                        guildid: guild.id,
                        extraInfo: `box_chances.mythical`,
                        number: value,
                        expire: Date.now() + (1000 * 60 * 60 * 24 * last)
                    })
                    temp2.save()
                    const temp3 = new Temp({
                        userid: user.id,
                        guildid: guild.id,
                        extraInfo: `box_chances.RNG`,
                        number: value,
                        expire: Date.now() + (1000 * 60 * 60 * 24 * last)
                    })
                    temp3.save()

                    userData.box_chances.legendary += value
                    userData.box_chances.mythical += value
                    userData.box_chances.RNG += value

                    userData.cooldowns.cat = Date.now() + (1000 * 60 * 60 * 24 * 30)
                    userData.save()
                    const embed = new EmbedBuilder()
                        .setColor(Number(linksInfo.bot_color))
                        .setTitle(`Использована коллекция Кота`)
                        .setTimestamp(Date.now())
                        .setDescription(`${member} использовал **КОЛЛЕКЦИЮ КОТА**! 
Коллекция Кота позволяет своему владельцу увеличить шансы на выпадение более редких предметов из коробок.

**Награда**:
Шансы на легендарные предметы: \`${value}x на ${last} дн.\`
Шансы на мифические предметы: \`${value}x на ${last} дн.\`
Шансы на ультраредкие предметы: \`${value}x на ${last} дн.\``)
                    await interaction.reply({
                        embeds: [embed]
                    })
                }
                    break;
                case `rabbit`: {
                    let coll = [`1020400030575763587`, `1020400034853957713`, `1020400032651952168`]
                    if (!member.roles.cache.has(coll[0]) || !member.roles.cache.has(coll[1]) || !member.roles.cache.has(coll[2])) return interaction.reply({
                        content: `Вы не собрали полностью коллекцию Кролика, поэтому не можете использовать эту команду!`,
                        ephemeral: true
                    })
                    if (userData.cooldowns.rabbit > Date.now()) return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(Number(linksInfo.bot_color))
                                .setAuthor({
                                    name: `Вы не можете использовать эту команду`
                                })
                                .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${prettyMilliseconds(userData.cooldowns.rabbit - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}!`)
                        ],
                        ephemeral: true
                    });
                    let values = [5, 6, 7, 8, 9, 10, 11]
                    let value = values[Math.floor(Math.random() * values.length)]
                    let lasts = [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
                    let last = lasts[Math.floor(Math.random() * lasts.length)]
                    const temp = new Temp({
                        userid: user.id,
                        guildid: guild.id,
                        extraInfo: `pers_rank_boost`,
                        number: value,
                        expire: Date.now() + (1000 * 60 * 60 * 24 * last)
                    })
                    temp.save()

                    userData.pers_rank_boost += value
                    userData.cooldowns.rabbit = Date.now() + (1000 * 60 * 60 * 24 * 30)
                    userData.save()
                    const embed = new EmbedBuilder()
                        .setColor(Number(linksInfo.bot_color))
                        .setTitle(`Использована коллекция Кролика`)
                        .setTimestamp(Date.now())
                        .setDescription(`${member} использовал **КОЛЛЕКЦИЮ КРОЛИКА**! 
Коллекция Кролика позволяет своему владельцу увеличить множитель опыта рангов в несколько раз.

**Награда**:
Множитель опыта рангов: \`${value}x на ${last} дн.\``)
                    await interaction.reply({
                        embeds: [embed]
                    })
                }
                    break;
                case `fox`: {
                    let coll = [`1020400043154485278`, `1020400047260696647`, `1020400045251633163`]
                    if (!member.roles.cache.has(coll[0]) || !member.roles.cache.has(coll[1]) || !member.roles.cache.has(coll[2])) return interaction.reply({
                        content: `Вы не собрали полностью коллекцию Лисы, поэтому не можете использовать эту команду!`,
                        ephemeral: true
                    })
                    if (userData.cooldowns.fox > Date.now()) return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(Number(linksInfo.bot_color))
                                .setAuthor({
                                    name: `Вы не можете использовать эту команду`
                                })
                                .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${prettyMilliseconds(userData.cooldowns.fox - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}!`)
                        ],
                        ephemeral: true
                    });
                    let values = [50, 75, 90, 100, 150, 180, 200, 210, 230, 250]
                    let value = values[Math.floor(Math.random() * values.length)]

                    userData.tickets += value
                    userData.progress.items.find(it => it.name == 'TICKETS_TOTAL').total_items += value
                    userData.cooldowns.fox = Date.now() + (1000 * 60 * 60 * 24 * 30)
                    userData.save()
                    const embed = new EmbedBuilder()
                        .setColor(Number(linksInfo.bot_color))
                        .setTitle(`Использована коллекция Лисы`)
                        .setTimestamp(Date.now())
                        .setDescription(`${member} использовал **КОЛЛЕКЦИЮ ЛИСЫ**! 
Коллекция Лисы позволяет своему владельцу раз в месяц получать определённое количество билетов.

**Награда**:
Билеты: \`${value}x\``)
                    await interaction.reply({
                        embeds: [embed]
                    })
                }
                    break;
                case `lion`: {
                    let coll = [`1020400055812886529`, `1020400060636344440`, `1020400058543374388`]
                    if (!member.roles.cache.has(coll[0]) || !member.roles.cache.has(coll[1]) || !member.roles.cache.has(coll[2])) return interaction.reply({
                        content: `Вы не собрали полностью коллекцию Льва, поэтому не можете использовать эту команду!`,
                        ephemeral: true
                    })
                    if (userData.cooldowns.lion > Date.now()) return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(Number(linksInfo.bot_color))
                                .setAuthor({
                                    name: `Вы не можете использовать эту команду`
                                })
                                .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${prettyMilliseconds(userData.cooldowns.lion - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}!`)
                        ],
                        ephemeral: true
                    });
                    let values = [5, 7, 8, 10, 11]
                    let value = values[Math.floor(Math.random() * values.length)]
                    let lasts = [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
                    let last = lasts[Math.floor(Math.random() * lasts.length)]
                    const temp = new Temp({
                        userid: user.id,
                        guildid: guild.id,
                        extraInfo: `pers_rumb_boost`,
                        number: value,
                        expire: Date.now() + (1000 * 60 * 60 * 24 * last)
                    })
                    temp.save()

                    userData.pers_rumb_boost += value
                    userData.cooldowns.lion = Date.now() + (1000 * 60 * 60 * 24 * 30)
                    userData.save()
                    const embed = new EmbedBuilder()
                        .setColor(Number(linksInfo.bot_color))
                        .setTitle(`Использована коллекция Льва`)
                        .setTimestamp(Date.now())
                        .setDescription(`${member} использовал **КОЛЛЕКЦИЮ ЛЬВА**! 
Коллекция Льва позволяет своему владельцу увеличить множитель румбиков в несколько раз.

**Награда**:
Множитель румбиков: \`${value}x на ${last} дн.\``)
                    await interaction.reply({
                        embeds: [embed]
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
}