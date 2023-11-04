const { Birthday } = require(`../../schemas/birthday`)
const { Temp } = require(`../../schemas/temp_items`)
const { User } = require(`../../schemas/userdata`)
const chalk = require(`chalk`)
const cron = require(`node-cron`)
const { EmbedBuilder } = require("discord.js")
const linksInfo = require(`../../discord structure/links.json`)
const { Guild } = require(`../../schemas/guilddata`)
const { checkPlugin } = require("../../functions");
const plugin = {
    id: "birthdays",
    name: "Дни рождения"
}

module.exports = (client) => {
    client.wish_birthday = async () => {
        try {
            const Guilds = client.guilds.cache


            Guilds.forEach(async g => {
                if (await checkPlugin(g.id, plugin.id)) {
                    const data = await Birthday.find({ guild: g.id }).catch(err => { })
                    if (!data) return

                    data.forEach(async b => {
                        const channel = g.channels.cache.get(`983440987328229446`)
                        if (!channel) return
                        const userData = await User.findOne({ userid: b.userid, guildid: b.guildid })
                        const member = await g.members.fetch(b.userid) || `Неизвестный пользователь#0000`
                        const Day = b.day
                        const Month = b.month
                        const Year = b.year

                        const date = new Date()
                        const currentYear = date.getFullYear()
                        const currentMonth = date.getMonth() + 1
                        const currentDate = date.getDate()

                        const age = currentYear - Year;

                        const happy_birthday = new EmbedBuilder()
                            .setThumbnail(member.user.displayAvatarURL())
                            .setDescription(`🎂 Поздравляем ${member} с ${age}-ым днём рождения! Желаем тебе всего самого наилучшего в этот прекрасный день! 
В качестве подарка от гильдии ты получаешь **КОРОЛЕВСКУЮ** коробку и эксклюзивную роль именинника на весь день!`)
                            .setColor(Number(linksInfo.bot_color))

                        if (Month === currentMonth && Day === currentDate) {
                            if (userData.pers_settings.birthday_wishes == true) {
                                await channel.send({
                                    content: `<@&504887113649750016>`,
                                    embeds: [happy_birthday],
                                    allowedMentiones: {
                                        roles: ["504887113649750016"]
                                    }
                                }).then((m) => {
                                    m.react(`🎂`)
                                })
                            }

                            await member.roles.add(`983441364903665714`).catch()
                            const hpb = new Temp({ userid: member.user.id, guildid: g.id, roleid: `983441364903665714`, expire: Date.now() + (1000 * 60 * 60 * 20) })
                            hpb.save()
                            if (member.roles.cache.has('584673040470769667')) {
                                userData.stacked_items.push('584673040470769667')
                            } else {

                                await member.roles.add(`584673040470769667`).catch()
                            }
                            userData.age += 1
                            b.save()
                            userData.save()
                        }



                    })
                }

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