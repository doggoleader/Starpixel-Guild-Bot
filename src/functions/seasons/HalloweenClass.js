const { Temp } = require(`../../schemas/temp_items`)
const { User } = require(`../../schemas/userdata`)
const { Guild } = require(`../../schemas/guilddata`)
const ch_list = require(`../../discord structure/channels.json`)
const chalk = require(`chalk`)
const cron = require(`node-cron`)
const wait = require(`node:timers/promises`).setTimeout
const { EmbedBuilder, PermissionsBitField } = require("discord.js")
const { checkPlugin } = require("../../functions");

const SeasonChannels = [
    "1029662597848498197",
    "1029662737497866300",
    "1029662887834292284",
]

class Halloween {
    /** @private */
    static id = 'seasonal';
    /** @private */
    static name = 'Сезонное'

    /**
     * 
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async halloweenEnd(client) {

        cron.schedule(`0 18 7 11 *`, async () => {
            try {
                const g = await client.guilds.fetch(`320193302844669959`)
                if (!await checkPlugin("320193302844669959", this.id)) return;
                const guildData = await Guild.findOne({ id: g.id })
                SeasonChannels.forEach(async ch => {

                    const channel = await g.channels.fetch(ch).then(async chan => {
                        await chan.edit({
                            permissionOverwrites: [
                                {
                                    id: `504887113649750016`,
                                    deny: [
                                        PermissionsBitField.Flags.ViewChannel,
                                        PermissionsBitField.Flags.SendMessages
                                    ]
                                },
                                {
                                    id: g.id,
                                    deny: [
                                        PermissionsBitField.Flags.ViewChannel,
                                        PermissionsBitField.Flags.SendMessages
                                    ]
                                },
                            ]
                        })
                    }).catch(async (err) => {
                        console.log(err)
                    })




                })
                guildData.seasonal.halloween.enabled = false
                guildData.save()

                const userDatas = await User.find({
                    "seasonal.halloween.points": { $gt: 0 }
                }).then(users => {
                    return users.filter(async user => await g.members.fetch(user.userid))
                })
                const sort = userDatas.sort((a, b) => {
                    return b.seasonal.halloween.points - a.seasonal.halloween.points
                }).slice(0, 10)
                let index = 1
                const map = sort.map(async (user) => {
                    const tag = await g.members.fetch(user.userid)
                    return `**${index++}.** ${tag} > ${user.seasonal.halloween.points} очков`
                })
                let i = 0
                let bestData = sort[i]
                while (bestData.userid == `491343958660874242`) {
                    i++
                    bestData = sort[i]
                }
                let member1 = await g.members.fetch(bestData.userid)
                while (member1.roles.cache.has(`660236704971489310`)) {
                    i++
                    bestData = sort[i]
                    member1 = await g.members.fetch(bestData.userid)
                }
                const mapProm = await Promise.all(map)

                for (let i = 0; i < sort.length; i++) {
                    let userData = sort[i]
                    userData.exp += userData.seasonal.halloween.points * 100
                    client.ActExp(userData.userid)
                    let member = await g.members.fetch(userData.userid)
                    if (i == 0) {
                        userData.medal_1 += 3
                        userData.progress.items.find(it => it.name == 'MEDALS_1').total_items += 3

                    } else if (i == 1) {
                        userData.medal_2 += 3
                        userData.progress.items.find(it => it.name == 'MEDALS_2').total_items += 3
                    } else if (i == 2) {
                        userData.medal_2 += 2
                        userData.progress.items.find(it => it.name == 'MEDALS_2').total_items += 2
                    } else if (i == 3) {
                        userData.medal_3 += 3
                        userData.progress.items.find(it => it.name == 'MEDALS_3').total_items += 3
                    } else if (i == 4) {
                        userData.medal_3 += 2
                        userData.progress.items.find(it => it.name == 'MEDALS_3').total_items += 2
                    } else {
                        userData.tickets += 5
                        userData.progress.items.find(it => it.name == 'TICKETS_TOTAL').total_items += 5
                    }

                    if (i <= 9) {
                        if (!member.roles.cache.has(`992820494900412456`)) {
                            await member.roles.add(`992820494900412456`)
                        } else {
                            userData.stacked_items.push(`992820494900412456`)
                        }
                    } else {
                        if (!member.roles.cache.has(`521248091853291540`)) {
                            await member.roles.add(`521248091853291540`)
                        } else {
                            userData.stacked_items.push(`521248091853291540`)
                        }
                    }
                    userData.save()
                }

                const embed = new EmbedBuilder()
                    .setColor(Number(client.information.bot_color))
                    .setAuthor({
                        name: `Лучшие пользователи по хэллоуинским очкам`
                    })
                    .setTimestamp(Date.now())
                    .setDescription(`${mapProm.join('\n')}`)

                await g.channels.cache.get(ch_list.main).send({
                    embeds: [embed]
                }).then(async msg => {
                    await msg.react(`🎃`)

                    await msg.react(`👹`)

                    await msg.react(`👻`)
                    await wait(1000)
                })
                await g.channels.cache.get(ch_list.main).send(`Идет финальный подсчёт количества очков... Кто же победит?`)
                await wait(3000)
                await g.channels.cache.get(ch_list.main).send(`Ответ вы узнаете через 3...`)
                await wait(3000)
                await g.channels.cache.get(ch_list.main).send(`Ответ вы узнаете через 2...`)
                await wait(3000)
                await g.channels.cache.get(ch_list.main).send(`Ответ вы узнаете через 1...`)
                await wait(3000)
                await g.channels.cache.get(ch_list.main).send({
                    content: `Поздравляем ${member1} с победой в хэллоуинском мероприятии! Он получает эксклюзивную роль <@&660236704971489310>!  @everyone`,
                    allowedMentions: {
                        parse: ["everyone"]
                    }
                })
                await wait(3000)
                const finalEmbed = new EmbedBuilder()
                    .setTitle(`Награды за призовые места`)
                    .setColor(Number(client.information.bot_color))
                    .setDescription(`Помимо главной награды, награду за призовое место получают все участники с 1 по 5 место в независимости от того, получил ли он главную награду или нет:
1 место - <@${sort[0].userid}>. Награда: \`3x 🥇\`
2 место - <@${sort[1].userid}>. Награда: \`3x 🥈\`
3 место - <@${sort[2].userid}>. Награда: \`2x 🥈\`
4 место - <@${sort[3].userid}>. Награда: \`3x 🥉\`
5 место - <@${sort[4].userid}>. Награда: \`2x 🥉\`
6+ место получают +5 🏷

Все участники получают с 1 по 10 место получают <@&992820494900412456> за участие, все остальные участники получают <@&521248091853291540> за участие.

**Все очки были переведены в опыт активности с соотношение 1:100 (1 хэллоуинское очко = 100 опыта активности)**`)
                await g.channels.cache.get(ch_list.main).send({
                    embeds: [finalEmbed]
                })
                await member1.roles.add(`660236704971489310`)
            } catch (e) {
                const admin = await client.users.fetch(`491343958660874242`)
                console.log(e)
                await admin.send({
                    content: `-> \`\`\`${e.stack}\`\`\``
                }).catch()
            }

        }, {
            scheduled: true,
            timezone: `Europe/Moscow`
        })
    }

    /**
     * 
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async halloweenRewards(client) {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", this.id)) return;
            const guildData = await Guild.findOne({ id: guild.id })
            if (guildData.seasonal.halloween.enabled === false) return
            const results = await User.find({ guildid: guild.id })

            for (const result of results) {
                const { seasonal } = result
                const member = await guild.members.fetch(result.userid)

                if (seasonal.halloween.achievements.num1 == true && seasonal.halloween.achievements.num2 == true && seasonal.halloween.achievements.num3 == true && seasonal.halloween.achievements.num4 == true && seasonal.halloween.achievements.num5 == true && seasonal.halloween.achievements.num6 == true && !member.roles.cache.has(`1030757644320915556`)) {
                    const done = new EmbedBuilder()
                        .setTitle(`Выдана сезонная роль`)
                        .setColor(Number(client.information.bot_color))
                        .setThumbnail(member.user.displayAvatarURL())
                        .setTimestamp(Date.now())
                        .setDescription(`${member} получил \`${guild.roles.cache.get(`1030757644320915556`).name}\`! В течение часа ему станет доступен сезонный цвет!`)
                    await member.roles.add(`1030757644320915556`)
                    await guild.channels.cache.get(ch_list.main).send({
                        embeds: [done]
                    })
                }


            }
        } catch (e) {
            const admin = await client.users.fetch(`491343958660874242`)
            console.log(e)
            await admin.send({
                content: `-> \`\`\`${e.stack}\`\`\``
            }).catch()
        }

    }

    /**
     * 
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async halloweenStart(client) {

        cron.schedule(`7 10 7 10 *`, async () => {
            try {

                const g = await client.guilds.fetch(`320193302844669959`)
                if (!await checkPlugin("320193302844669959", this.id)) return;
                const guildData = await Guild.findOne({ id: g.id })
                SeasonChannels.forEach(async ch => {
                    try {
                        const channel = await g.channels.fetch(ch)
                        await channel.edit({
                            permissionOverwrites: [
                                {
                                    id: `504887113649750016`,
                                    allow: [
                                        PermissionsBitField.Flags.ViewChannel,
                                    ],
                                    deny: [
                                        PermissionsBitField.Flags.SendMessages
                                    ]
                                },
                                {
                                    id: g.id,
                                    deny: [
                                        PermissionsBitField.Flags.ViewChannel,
                                        PermissionsBitField.Flags.SendMessages
                                    ]
                                },
                            ]
                        })
                    } catch (e) {
                        console.log(e)
                    }

                })
                guildData.seasonal.halloween.enabled = true
                guildData.save()

                const userDatas = await User.find({ guildid: g.id })
                userDatas.forEach(async userData => {
                    userData.seasonal.halloween.hw_cosm = false
                    userData.seasonal.halloween.hw_soul = false
                    userData.seasonal.halloween.hw_msg = false
                    userData.seasonal.halloween.opened_scary = 0
                    userData.seasonal.halloween.points = 0
                    userData.seasonal.halloween.achievements.num1 = false
                    userData.seasonal.halloween.achievements.num2 = false
                    userData.seasonal.halloween.achievements.num3 = false
                    userData.seasonal.halloween.achievements.num4 = false
                    userData.seasonal.halloween.achievements.num5 = false
                    userData.seasonal.halloween.achievements.num6 = false
                    userData.seasonal.halloween.quests_completed = 0
                    userData.seasonal.halloween.quest.before = 0
                    userData.seasonal.halloween.quest.id = -1
                    userData.seasonal.halloween.quest.finished = true
                    userData.seasonal.halloween.quest.requirement = Infinity
                    userData.seasonal.halloween.quest.description = `Нет квеста.`

                    userData.save()
                })

                const news = await g.channels.fetch(`849313479924252732`)
                const embed = new EmbedBuilder()
                    .setTitle(`Хэллоуинский сезон`)
                    .setDescription(`Сегодня, <t:${Math.floor(new Date().getTime() / 1000)}:f>, гильдия Starpixel открывает хэллоуинский сезон.
Смело открывайте канал <#${ch_list.hw_main}> и зарабатывайте очки, чтобы стать лучшим игроком хэллоуинского сезона!`)
                const msg = await news.send({
                    content: `@everyone`,
                    embeds: [embed],
                    allowedMentions: {
                        parse: ["everyone"]
                    }
                })
                await msg.react(`✅`)

            } catch (e) {
                const admin = await client.users.fetch(`491343958660874242`)
                console.log(e)
                await admin.send({
                    content: `-> \`\`\`${e.stack}\`\`\``
                }).catch()
            }

        }, {
            scheduled: true,
            timezone: `Europe/Moscow`
        })
    }
}

module.exports = {
    Halloween
}