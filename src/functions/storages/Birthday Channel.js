const { Birthday } = require(`../../schemas/birthday`)
const { Guild } = require(`../../schemas/guilddata`)
const chalk = require(`chalk`)
const cron = require(`node-cron`)
const { EmbedBuilder } = require("discord.js")
const linksInfo = require(`../../discord structure/links.json`)
const { checkPlugin } = require("../../functions");
const plugin = {
    id: "channels",
    name: "Каналы"
}

module.exports = (client) => {
    client.birthdayChannel = async () => {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", plugin.id)) return;
            const b_chan = await guild.channels.cache.get(`931877939325325332`)
            const birthday_jan = await Birthday.find({ guildid: guild.id, month: 1 })
            const msg_jan = await b_chan.messages.fetch(`1019171767027249182`)
            if (!birthday_jan[0]) {
                await msg_jan.edit(`\`Праздников нет.\``)
            } else {
                let sort = await birthday_jan.sort((a, b) => a.day - b.day)
                const map = sort.map(async (memberdata) => {
                    const user = await guild.members.fetch(memberdata.userid)
                    let zodiak
                    if (memberdata.day <= 20) {
                        zodiak = `♑`
                    } else if (memberdata.day >= 21) {
                        zodiak = `♒`
                    }
                    return `${zodiak} ${memberdata.day} января - ${user}`
                })
                let promise = await Promise.all(map)
                await msg_jan.edit(`${promise.join(`\n`)}`)
            }


            const birthday_feb = await Birthday.find({ guildid: guild.id, month: 2 })
            const msg_feb = await b_chan.messages.fetch(`1019171784869814302`)
            if (!birthday_feb[0]) {
                await msg_feb.edit(`\`Праздников нет.\``)
            } else if (birthday_feb) {

                let sort = await birthday_feb.sort((a, b) => a.day - b.day)
                const map = sort.map(async (memberdata) => {

                    const user = await guild.members.fetch(memberdata.userid)
                    let zodiak
                    if (memberdata.day <= 19) {
                        zodiak = `♒`
                    } else if (memberdata.day >= 20) {
                        zodiak = `♓`
                    }
                    return `${zodiak} ${memberdata.day} февраля - ${user}`


                })
                let promise = await Promise.all(map)
                await msg_feb.edit(`${promise.join(`\n`)}`)
            }


            const birthday_mar = await Birthday.find({ guildid: guild.id, month: 3 })
            const msg_mar = await b_chan.messages.fetch(`1019171787935846461`)
            if (!birthday_mar[0]) {
                await msg_mar.edit(`\`Праздников нет.\``)
            } else {
                let sort = await birthday_mar.sort((a, b) => a.day - b.day)
                const map = sort.map(async (memberdata) => {
                    const user = await guild.members.fetch(memberdata.userid)
                    let zodiak
                    if (memberdata.day <= 20) {
                        zodiak = `♓`
                    } else if (memberdata.day >= 21) {
                        zodiak = `♈`
                    }
                    return `${zodiak} ${memberdata.day} марта - ${user}`
                })
                let promise = await Promise.all(map)
                await msg_mar.edit(`${promise.join(`\n`)}`)
            }

            const birthday_apr = await Birthday.find({ guildid: guild.id, month: 4 })
            const msg_apr = await b_chan.messages.fetch(`1019171791232569364`)
            if (!birthday_apr[0]) {
                await msg_apr.edit(`\`Праздников нет.\``)
            } else {
                let sort = await birthday_apr.sort((a, b) => a.day - b.day)
                const map = sort.map(async (memberdata) => {
                    const user = await guild.members.fetch(memberdata.userid)
                    let zodiak
                    if (memberdata.day <= 20) {
                        zodiak = `♈`
                    } else if (memberdata.day >= 21) {
                        zodiak = `♉`
                    }
                    return `${zodiak} ${memberdata.day} апреля - ${user}`
                })
                let promise = await Promise.all(map)
                await msg_apr.edit(`${promise.join(`\n`)}`)
            }

            const birthday_may = await Birthday.find({ guildid: guild.id, month: 5 })
            const msg_may = await b_chan.messages.fetch(`1019171809570066452`)
            if (!birthday_may) {
                await msg_may.edit(`\`Праздников нет.\``)
            } else {
                let sort = await birthday_may.sort((a, b) => a.day - b.day)
                const map = sort.map(async (memberdata) => {
                    const user = await guild.members.fetch(memberdata.userid)
                    let zodiak
                    if (memberdata.day <= 21) {
                        zodiak = `♉`
                    } else if (memberdata.day >= 22) {
                        zodiak = `♊`
                    }
                    return `${zodiak} ${memberdata.day} мая - ${user}`
                })
                let promise = await Promise.all(map)
                await msg_may.edit(`${promise.join(`\n`)}`)
            }

            const birthday_jun = await Birthday.find({ guildid: guild.id, month: 6 })
            const msg_jun = await b_chan.messages.fetch(`1019171812317351976`)
            if (!birthday_jun[0]) {
                await msg_jun.edit(`\`Праздников нет.\``)
            } else {
                let sort = await birthday_jun.sort((a, b) => a.day - b.day)
                const map = sort.map(async (memberdata) => {
                    const user = await guild.members.fetch(memberdata.userid)
                    let zodiak
                    if (memberdata.day <= 21) {
                        zodiak = `♊`
                    } else if (memberdata.day >= 22) {
                        zodiak = `♋`
                    }
                    return `${zodiak} ${memberdata.day} июня - ${user}`
                })
                let promise = await Promise.all(map)
                await msg_jun.edit(`${promise.join(`\n`)}`)
            }

            const birthday_jul = await Birthday.find({ guildid: guild.id, month: 7 })
            const msg_jul = await b_chan.messages.fetch(`1019171834274533427`)
            if (!birthday_jul[0]) {
                await msg_jul.edit(`\`Праздников нет.\``)
            } else {
                let sort = await birthday_jul.sort((a, b) => a.day - b.day)
                const map = sort.map(async (memberdata) => {
                    const user = await guild.members.fetch(memberdata.userid)
                    let zodiak
                    if (memberdata.day <= 22) {
                        zodiak = `♋`
                    } else if (memberdata.day >= 23) {
                        zodiak = `♌`
                    }
                    return `${zodiak} ${memberdata.day} июля - ${user}`
                })
                let promise = await Promise.all(map)
                await msg_jul.edit(`${promise.join(`\n`)}`)
            }

            const birthday_aug = await Birthday.find({ guildid: guild.id, month: 8 })
            const msg_aug = await b_chan.messages.fetch(`1019171837491560468`)
            if (!birthday_aug[0]) {
                await msg_aug.edit(`\`Праздников нет.\``)
            } else {
                let sort = await birthday_aug.sort((a, b) => a.day - b.day)
                const map = sort.map(async (memberdata) => {
                    const user = await guild.members.fetch(memberdata.userid)
                    let zodiak
                    if (memberdata.day <= 21) {
                        zodiak = `♌`
                    } else if (memberdata.day >= 22) {
                        zodiak = `♍`
                    }
                    return `${zodiak} ${memberdata.day} августа - ${user}`
                })
                let promise = await Promise.all(map)
                await msg_aug.edit(`${promise.join(`\n`)}`)
            }

            const birthday_sep = await Birthday.find({ guildid: guild.id, month: 9 })
            const msg_sep = await b_chan.messages.fetch(`1019171840163319840`)
            if (!birthday_sep[0]) {
                await msg_sep.edit(`\`Праздников нет.\``)
            } else {
                let sort = await birthday_sep.sort((a, b) => a.day - b.day)
                const map = sort.map(async (memberdata) => {
                    const user = await guild.members.fetch(memberdata.userid)
                    let zodiak
                    if (memberdata.day <= 23) {
                        zodiak = `♍`
                    } else if (memberdata.day >= 24) {
                        zodiak = `♎`
                    }
                    return `${zodiak} ${memberdata.day} сентября - ${user}`
                })
                let promise = await Promise.all(map)
                await msg_sep.edit(`${promise.join(`\n`)}`)
            }

            const birthday_oct = await Birthday.find({ guildid: guild.id, month: 10 })
            const msg_oct = await b_chan.messages.fetch(`1019171854570758175`)
            if (!birthday_oct[0]) {
                await msg_oct.edit(`\`Праздников нет.\``)
            } else {
                let sort = await birthday_oct.sort((a, b) => a.day - b.day)
                const map = sort.map(async (memberdata) => {
                    const user = await guild.members.fetch(memberdata.userid)
                    let zodiak
                    if (memberdata.day <= 23) {
                        zodiak = `♎`
                    } else if (memberdata.day >= 24) {
                        zodiak = `♏`
                    }
                    return `${zodiak} ${memberdata.day} октября - ${user}`
                })
                let promise = await Promise.all(map)
                await msg_oct.edit(`${promise.join(`\n`)}`)
            }

            const birthday_nov = await Birthday.find({ guildid: guild.id, month: 11 })
            const msg_nov = await b_chan.messages.fetch(`1019171857502572555`)
            if (!birthday_nov[0]) {
                await msg_nov.edit(`\`Праздников нет.\``)
            } else {
                let sort = await birthday_nov.sort((a, b) => a.day - b.day)
                const map = sort.map(async (memberdata) => {
                    const user = await guild.members.fetch(memberdata.userid)
                    let zodiak
                    if (memberdata.day <= 22) {
                        zodiak = `♏`
                    } else if (memberdata.day >= 23) {
                        zodiak = `♐`
                    }
                    return `${zodiak} ${memberdata.day} ноября - ${user}`
                })
                let promise = await Promise.all(map)
                await msg_nov.edit(`${promise.join(`\n`)}`)
            }

            const birthday_dec = await Birthday.find({ guildid: guild.id, month: 12 })
            const msg_dec = await b_chan.messages.fetch(`1019171876318220328`)
            if (!birthday_dec[0]) {
                await msg_dec.edit(`\`Праздников нет.\``)
            } else {
                let sort = await birthday_dec.sort((a, b) => a.day - b.day)
                const map = sort.map(async (memberdata) => {
                    const user = await guild.members.fetch(memberdata.userid)
                    let zodiak
                    if (memberdata.day <= 22) {
                        zodiak = `♐`
                    } else if (memberdata.day >= 23) {
                        zodiak = `♑`
                    }
                    return `${zodiak} ${memberdata.day} декабря - ${user}`
                })
                let promise = await Promise.all(map)
                await msg_dec.edit(`${promise.join(`\n`)}`)
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
}