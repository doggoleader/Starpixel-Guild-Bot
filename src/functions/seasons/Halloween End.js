const { Birthday } = require(`../../schemas/birthday`)
const { Temp } = require(`../../schemas/temp_items`)
const { User } = require(`../../schemas/userdata`)
const { Guild } = require(`../../schemas/guilddata`)
const ch_list = require(`../../discord structure/channels.json`)
const chalk = require(`chalk`)
const cron = require(`node-cron`)
const wait = require(`node:timers/promises`).setTimeout
const { EmbedBuilder, PermissionsBitField } = require("discord.js")
const linksInfo = require(`../../discord structure/links.json`)
const { checkPlugin } = require("../../functions");
const plugin = {
    id: "seasonal",
    name: "Сезонное"
}

module.exports = (client) => {
    client.halloweenEnd = async () => {

        cron.schedule(`0 18 7 11 *`, async () => {
            try {
                const g = await client.guilds.fetch(`320193302844669959`)
                if (!await checkPlugin("320193302844669959", plugin.id)) return;
                const guildData = await Guild.findOne({ id: g.id })
                guildData.seasonal.halloween.channels.forEach(async ch => {

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
                        let i = guildData.seasonal.halloween.channels.findIndex(chan => chan.id == ch.id)
                        guildData.seasonal.halloween.channels.splice(i, 1)
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

                    } else if (i == 1) {
                        userData.medal_2 += 3
                    } else if (i == 2) {
                        userData.medal_2 += 2
                    } else if (i == 3) {
                        userData.medal_3 += 3
                    } else if (i == 4) {
                        userData.medal_3 += 2
                    } else {
                        userData.tickets += 5
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
                    .setColor(Number(linksInfo.bot_color))
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