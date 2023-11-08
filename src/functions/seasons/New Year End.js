const { Birthday } = require(`../../schemas/birthday`)
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
const plugin = {
    id: "seasonal",
    name: "Сезонное"
}

module.exports = (client) => {
    client.newYearEnd = async () => {

        cron.schedule(`0 18 18 1 *`, async () => {
            try {
                const g = await client.guilds.fetch(`320193302844669959`)
                if (!await checkPlugin("320193302844669959", plugin.id)) return;
                const guildData = await Guild.findOne({ id: g.id })
                guildData.seasonal.new_year.channels.forEach(async ch => {

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
                        let i = guildData.seasonal.new_year.channels.findIndex(chan => chan.id == ch.id)
                        guildData.seasonal.new_year.channels.splice(i, 1)
                    })




                })

                client.NewYearNamesDisable();
                guildData.seasonal.new_year.enabled = false
                guildData.save()

                const userDatas = await User.find({
                    "seasonal.new_year.points": { $gt: 0 }
                }).then(users => {
                    return users.filter(async user => await g.members.fetch(user.userid))
                })
                const sort = userDatas.sort((a, b) => {
                    return b.seasonal.new_year.points - a.seasonal.new_year.points
                }).slice(0, 10)
                let index = 1
                const map = sort.map(async (user) => {
                    const tag = await g.members.fetch(user.userid)
                    return `**${index++}.** ${tag} > ${user.seasonal.new_year.points} очков`
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
                    userData.exp += userData.seasonal.new_year.points * 10
                    userData.rumbik += Math.round(userData.seasonal.new_year.snowflakes * 1.5)
                    userData.progress.items.find(it => it.name == 'RUMBIKS_TOTAL').total_items += Math.round(userData.seasonal.new_year.snowflakes * 1.5)
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
                        name: `Лучшие пользователи по новогодним очкам`
                    })
                    .setTimestamp(Date.now())
                    .setDescription(`${mapProm.join('\n')}`)

                await g.channels.cache.get(ch_list.main).send({
                    embeds: [embed]
                }).then(async msg => {
                    await msg.react(`🎄`)
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
                    content: `Поздравляем ${member1} с победой в новогоднем мероприятии! Он получает эксклюзивную роль <@&660236704971489310>!  @everyone`,
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

**Все очки были переведены в опыт активности в соотношении 1:10 (1 новогоднее очко = 10 опыта активности)**
**Все снежинки были переведены в румбики в соотношении 1:1.5 (1 снежинка = 1.5 румбика с учётом правил математического округления)**`)
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