const { Temp } = require(`../../schemas/temp_items`)
const { User } = require(`../../schemas/userdata`)
const { Guild } = require(`../../schemas/guilddata`)
const ch_list = require(`../../discord structure/channels.json`)
const chalk = require(`chalk`)
const cron = require(`node-cron`)
const wait = require(`node:timers/promises`).setTimeout
const linksInfo = require(`../../discord structure/links.json`)
const { EmbedBuilder, PermissionsBitField } = require("discord.js")
const { checkPlugin } = require("../../functions");

class Summer {
    id = 'seasonal';
    name = 'Сезонное'

    /**
     * 
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async SummerEnd(client) {

        cron.schedule(`0 18 31 8 *`, async () => {
            try {
                const g = await client.guilds.fetch(`320193302844669959`)
                if (!await checkPlugin("320193302844669959", this.id)) return;
                const guildData = await Guild.findOne({ id: g.id })
                guildData.seasonal.summer.channels.forEach(async ch => {

                    const channel = await g.channels.fetch(ch.id).then(async chan => {
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
                        let i = guildData.seasonal.summer.channels.findIndex(chan => chan.id == ch.id)
                        guildData.seasonal.summer.channels.splice(i, 1)
                    })




                })
                guildData.seasonal.summer.enabled = false
                guildData.save()

                const userDatas = await User.find({
                    "seasonal.summer.points": { $gt: 0 }
                }).then(users => {
                    return users.filter(async user => await g.members.fetch(user.userid))
                })
                const sort = userDatas.sort((a, b) => {
                    return b.seasonal.summer.points - a.seasonal.summer.points
                }).slice(0, 10)
                let index = 1
                const map = sort.map(async (user) => {
                    const tag = await g.members.fetch(user.userid)
                    return `**${index++}.** ${tag} > ${user.seasonal.summer.points} очков`
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
                    userData.exp += userData.seasonal.summer.points * 100
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
                    .setColor(Number(linksInfo.bot_color))
                    .setAuthor({
                        name: `Лучшие пользователи по летним очкам`
                    })
                    .setTimestamp(Date.now())
                    .setDescription(`${mapProm.join('\n')}`)

                await g.channels.cache.get(ch_list.main).send({
                    embeds: [embed]
                }).then(async msg => {
                    await msg.react(`🌴`)

                    await msg.react(`☀`)

                    await msg.react(`🌾`)
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
                    content: `Поздравляем ${member1} с победой в летнем мероприятии! Он получает эксклюзивную роль <@&660236704971489310>!  @everyone`,
                    allowedMentions: {
                        parse: ["everyone"]
                    }
                })
                await wait(3000)
                const finalEmbed = new EmbedBuilder()
                    .setTitle(`Награды за призовые места`)
                    .setColor(Number(linksInfo.bot_color))
                    .setDescription(`Помимо главной награды, награду за призовое место получают все участники с 1 по 5 место в независимости от того, получил ли он главную награду или нет:
1 место - <@${sort[0].userid}>. Награда: \`3x 🥇\`
2 место - <@${sort[1].userid}>. Награда: \`3x 🥈\`
3 место - <@${sort[2].userid}>. Награда: \`2x 🥈\`
4 место - <@${sort[3].userid}>. Награда: \`3x 🥉\`
5 место - <@${sort[4].userid}>. Награда: \`2x 🥉\`
6+ место получают +5 🏷

Все участники получают с 1 по 10 место получают <@&992820494900412456> за участие, все остальные участники получают <@&521248091853291540> за участие.

**Все очки были переведены в опыт активности с соотношение 1:100 (1 летнее очко = 100 опыта активности)**`)
                await g.channels.cache.get(ch_list.main).send({
                    embeds: [finalEmbed]
                })
                await member1.roles.add(`660236704971489310`)
            } catch (e) {
                const admin = await client.users.fetch(`491343958660874242`)
                console.log(e)
                var path = require('path');
                var scriptName = path.basename(__filename);
                await admin.send(`Произошла ошибка!`)
                await admin.send(`=> ${e}.
    **Файл**: ${scriptName}`)
                await admin.send(`◾`)
            }

        }, {
            scheduled: true,
            timezone: `Europe/Moscow`
        })
    }

    static async SummerRewards(client) {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", this.id)) return;
            const guildData = await Guild.findOne({ id: guild.id })
            if (guildData.seasonal.summer.enabled === false) return
            const results = await User.find({ guildid: guild.id })

            for (const result of results) {
                const { seasonal } = result
                const member = await guild.members.fetch(result.userid)

                if (
                    seasonal.summer.achievements.num1 == true &&
                    seasonal.summer.achievements.num2 == true &&
                    seasonal.summer.achievements.num3 == true &&
                    seasonal.summer.achievements.num4 == true &&
                    seasonal.summer.achievements.num5 == true &&
                    seasonal.summer.achievements.num6 == true &&
                    seasonal.summer.achievements.num7 == true &&
                    seasonal.summer.achievements.num8 == true &&
                    seasonal.summer.achievements.num9 == true &&
                    seasonal.summer.achievements.num10 == true &&
                    !member.roles.cache.has(`1030757074839277608`)) {
                    const done = new EmbedBuilder()
                        .setTitle(`Выдана сезонная роль`)
                        .setColor(Number(linksInfo.bot_color))
                        .setThumbnail(member.user.displayAvatarURL())
                        .setTimestamp(Date.now())
                        .setDescription(`${member} получил \`${guild.roles.cache.get(`1030757074839277608`).name}\`! Теперь он может использовать сезонный цвет!
                        
В качестве бонуса он также получает <@&781069821953441832>!`)
                    await member.roles.add(`1030757074839277608`)
                    if (member.roles.cache.has("781069821953441832")) {
                        await result.stacked_items.push("781069821953441832")
                        await result.save()
                    } else {
                        await member.roles.add("781069821953441832")
                    }
                    await guild.channels.cache.get(ch_list.main).send({
                        embeds: [done]
                    })
                }


            }
        } catch (e) {
            const admin = await client.users.fetch(`491343958660874242`)
            console.log(e)
            var path = require('path');
            var scriptName = path.basename(__filename);
            await admin.send(`Произошла ошибка!`)
            await admin.send(`=> ${e}.
**Файл**: ${scriptName}`)
            await admin.send(`◾`)
        }

    }

    static async SummerStart(client) {

        cron.schedule(`0 12 1 6 *`, async () => {
            try {
                const g = await client.guilds.fetch(`320193302844669959`)
                if (!await checkPlugin("320193302844669959", this.id)) return;
                const guildData = await Guild.findOne({ id: g.id })
                for (let ch of guildData.seasonal.summer.channels) {
                    try {
                        const channel = await g.channels.fetch(ch.id)
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
                        let i = guildData.seasonal.summer.channels.findIndex(chan => chan.id == ch.id)
                        guildData.seasonal.summer.channels.splice(i, 1)
                        guildData.save()
                    }

                }
                guildData.seasonal.summer.enabled = true
                guildData.save();

                const userDatas = await User.find({ guildid: g.id })
                userDatas.forEach(async userData => {
                    let { points, sea_ticket, su_cosm, opened_boxes, quests_completed, quest, achievements, unique_quests, events } = userData.seasonal.summer
                    points = 0
                    sea_ticket = false
                    opened_boxes = 0
                    su_cosm = false
                    quests_completed = 0
                    achievements.num1 = false
                    achievements.num2 = false
                    achievements.num3 = false
                    achievements.num4 = false
                    achievements.num5 = false
                    achievements.num6 = false
                    achievements.num7 = false
                    achievements.num8 = false
                    achievements.num9 = false
                    achievements.num10 = false
                    quest.before = 0
                    quest.id = -1
                    quest.finished = true
                    quest.requirement = Infinity
                    quest.description = `Нет квеста.`
                    quest.type = `Нет квеста.`
                    unique_quests = 0
                    events.events_attended = 0
                    events.last_event_applied = false
                    events.last_event_member = false
                    userData.save()
                })
                const news = await g.channels.fetch(`849313479924252732`)
                const embed = new EmbedBuilder()
                    .setTitle(`Летний сезон`)
                    .setDescription(`Сегодня, <t:${Math.floor(new Date().getTime() / 1000)}:f>, гильдия Starpixel открывает летний сезон.
Смело открывайте канал <#${ch_list.su_main}> и зарабатывайте очки, чтобы стать лучшим игроком летнего сезона!`)
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
                var path = require('path');
                var scriptName = path.basename(__filename);
                await admin.send(`Произошла ошибка!`)
                await admin.send(`=> ${e}.
**Файл**: ${scriptName}`)
                await admin.send(`◾`)
            }

        }, {
            scheduled: true,
            timezone: `Europe/Moscow`
        })
    }
}

module.exports = {
    Summer
}