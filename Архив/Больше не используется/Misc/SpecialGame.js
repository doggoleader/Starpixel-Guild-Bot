const { User } = require(`../../../src/schemas/userdata`)
const chalk = require(`chalk`);
const { EmbedBuilder } = require(`discord.js`)
const ch_list = require(`../../../src/discord structure/channels.json`)
const { Guild } = require(`../../../src/schemas/guilddata`)
const cron = require(`node-cron`)
const { isURL } = require(`../../../src/functions`)
const wait = require(`node:timers/promises`).setTimeout
const linksInfo = require(`../../../src/discord structure/links.json`)

module.exports = (client) => {
    client.SpecialGame = async () => {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            const guildData = await Guild.findOne({ id: guild.id })
            if (guildData.plugins.guildgames === false) return
            guildData.guildgames.groups = []

            let max_length = 4
            const voiceChannel = await guild.channels.fetch(ch_list.guildGamesVoice)
            const voiceMembers = await voiceChannel.members.filter(member => member.user.bot === false)
            console.log(voiceMembers)
            const groups = await guildData.guildgames.groups
            const memberBelow15 = [];
            const memberAbove15 = [];
            await voiceMembers.forEach(async (member) => {
                const userData = await User.findOne({ userid: member.user.id, guildid: guild.id })
                if (userData.age <= 15) {
                    await memberBelow15.push(member.user.id)
                } else if (userData.age > 15) {
                    await memberAbove15.push(member.user.id)
                }
            })
            await wait(1000)


            //Member Below 15
            if (memberBelow15.length % 4 !== 0) {
                while (memberBelow15.length % 4 !== 0) {
                    let b = Math.floor(Math.random() * memberBelow15.length)
                    let memberBelow15Copy = memberBelow15.slice()
                    let n = 15
                    let userData = await User.find({ userid: memberBelow15Copy[b], guildid: guild.id, age: n })
                    while (!userData) {
                        if (memberBelow15Copy.length == 0) {
                            memberBelow15Copy = memberBelow15.slice()
                            n -= 1
                        } else if (memberBelow15Copy > 0) {
                            memberBelow15Copy.splice(b, 1)
                            b = Math.floor(Math.random() * memberBelow15.length)
                            userData = await User.find({ userid: memberBelow15Copy[b], guildid: guild.id, age: n })
                        }
                    }
                    let toPush = memberBelow15Copy[b]
                    let toSplice = memberBelow15.findIndex(id => id == memberBelow15Copy[b])
                    memberBelow15.splice(toSplice, 1)
                    memberAbove15.push(toPush)
                }
            }
            const spList = []
            memberBelow15.forEach(async memberBel => {
                let userData = await User.findOne({ userid: memberBel })
                spList.push({
                    userid: userData.userid,
                    age: userData.age,
                    specialization: userData.specialization
                })
            })
            await wait(3000)
            let i = 0
            while (spList.length > 0) {
                if (!groups[i]) {
                    groups.push({
                        id: i
                    })
                } else if (groups[i] && groups[i].members.length >= 4) {
                    i++
                } else if (groups[i] && groups[i].members.length < 4) {
                    if (groups[i].members.length == 0) {
                        const memberId = spList[0].userid
                        groups[i].specialization = spList[0].specialization
                        await spList.splice(0, 1)
                        groups[i].members.push(memberId)
                        await wait(500)
                    } else if (groups[i].members.length > 0) {
                        let b = spList.findIndex(list => list.specialization == groups[i].specialization)
                        if (b == -1) b = 0
                        const memberId = spList[b].userid
                        await spList.splice(b, 1)
                        groups[i].members.push(memberId)
                        await wait(500)
                    }
                }
            }





            //Member Above 15
            const left = []
            if (memberAbove15.length % 4 !== 0) {
                while (memberAbove15.length % 4 !== 0) {
                    let b = Math.floor(Math.random() * memberAbove15.length)
                    let memberAbove15Copy = memberAbove15.slice()
                    let n = 15
                    let userData = await User.find({ userid: memberAbove15Copy[b], guildid: guild.id, age: n })
                    while (!userData) {
                        if (memberAbove15Copy.length == 0) {
                            memberAbove15Copy = memberAbove15.slice()
                            n += 1
                        } else if (memberAbove15Copy > 0) {
                            memberAbove15Copy.splice(b, 1)
                            b = Math.floor(Math.random() * memberAbove15.length)
                            userData = await User.find({ userid: memberAbove15Copy[b], guildid: guild.id, age: n })
                        }
                    }
                    let toPush = memberAbove15Copy[b]
                    let toSplice = memberAbove15.findIndex(id => id == memberAbove15Copy[b])
                    await memberAbove15.splice(toSplice, 1)
                    await left.push(toPush)
                }
            }

            const spListUp = []
            await memberAbove15.forEach(async memberBel => {
                let userData = await User.findOne({ userid: memberBel })
                spListUp.push({
                    userid: userData.userid,
                    age: userData.age,
                    specialization: userData.specialization
                })
            })
            await wait(3000)
            let j = 0
            while (spListUp.length > 0) {
                if (!groups[j]) {
                    groups.push({
                        id: j
                    })
                } else if (groups[j] && groups[j].members.length >= 4) {
                    j++
                } else if (groups[j] && groups[j].members.length < 4) {
                    if (groups[j].members.length == 0) {

                        const memberId = spListUp[0].userid
                        groups[j].specialization = spListUp[0].specialization
                        await spListUp.splice(0, 1)
                        groups[j].members.push(memberId)
                    } else if (groups[j].members.length > 0) {

                        let b = spListUp.findIndex(list => list.specialization == groups[j].specialization)
                        if (b == -1) b = 0
                        const memberId = spListUp[b].userid
                        await spListUp.splice(b, 1)
                        groups[j].members.push(memberId)
                    }
                }
            }
            if (left.length > 0) {
                groups.push({
                    id: j + 1,
                    specialization: `None`,
                    members: left
                })
            }
            guildData.save()
            let a = 1
            const sort = await groups.sort((a, b) => a.id - b.id)
            const map = await sort.map(async group => {
                const members = group.members.map(async (member, c) => {
                    const userData = await User.findOne({ userid: member, guildid: guild.id })
                    return `**${++c}**. <@${userData.userid}>, специализация \`${userData.specialization}\``
                })
                const membersPromise = await Promise.all(members)
                return `**ГРУППА №${group.id + 1}**
**Участники**:
${membersPromise.join(`\n`)}`
            })
            const mapPromise = await Promise.all(map)
            const embed = new EmbedBuilder()
                .setTitle(`Группы совместной игры`)
                .setDescription(`Список групп:
${mapPromise.join(`\n\n`)}`)
                .setColor(Number(linksInfo.bot_color))
                .setTimestamp(Date.now())

            const channel = await guild.channels.fetch(ch_list.test)
            await channel.send({
                embeds: [embed]
            })
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
}
