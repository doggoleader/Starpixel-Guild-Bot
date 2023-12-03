
const { Guild } = require(`../../schemas/guilddata`)
const chalk = require(`chalk`)
const cron = require(`node-cron`)
const { EmbedBuilder } = require("discord.js")
const { checkPlugin } = require("../../functions");
const { User } = require("../../schemas/userdata")
const fetch = require(`node-fetch`);
const api = process.env.hypixel_apikey;


class ChannelUpdates {
    /** @private */
    static id = "channels";
    /** @private */
    static name = 'Каналы';

    /**
     * 
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async birthdayChannel(client) {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", this.id)) return;
            const b_chan = await guild.channels.cache.get(`931877939325325332`)
            const birthday_jan = await User.find({ guildid: guild.id, "birthday.month": 1 })
            const msg_jan = await b_chan.messages.fetch(`1019171767027249182`)
            if (!birthday_jan[0]) {
                await msg_jan.edit(`\`Праздников нет.\``)
            } else {
                let sort = await birthday_jan.sort((a, b) => a.birthday.day - b.birthday.day)
                const map = sort.map(async (memberdata) => {
                    const user = await guild.members.fetch(memberdata.userid)
                    let zodiak
                    if (memberdata.birthday.day <= 20) {
                        zodiak = `♑`
                    } else if (memberdata.birthday.day >= 21) {
                        zodiak = `♒`
                    }
                    return `${zodiak} ${memberdata.birthday.day} января - ${user}`
                })
                let promise = await Promise.all(map)
                await msg_jan.edit(`${promise.join(`\n`)}`)
            }


            const birthday_feb = await User.find({ guildid: guild.id, "birthday.month": 2 })
            const msg_feb = await b_chan.messages.fetch(`1019171784869814302`)
            if (!birthday_feb[0]) {
                await msg_feb.edit(`\`Праздников нет.\``)
            } else if (birthday_feb) {

                let sort = await birthday_feb.sort((a, b) => a.birthday.day - b.birthday.day)
                const map = sort.map(async (memberdata) => {

                    const user = await guild.members.fetch(memberdata.userid)
                    let zodiak
                    if (memberdata.birthday.day <= 19) {
                        zodiak = `♒`
                    } else if (memberdata.birthday.day >= 20) {
                        zodiak = `♓`
                    }
                    return `${zodiak} ${memberdata.birthday.day} февраля - ${user}`


                })
                let promise = await Promise.all(map)
                await msg_feb.edit(`${promise.join(`\n`)}`)
            }


            const birthday_mar = await User.find({ guildid: guild.id, "birthday.month": 3 })
            const msg_mar = await b_chan.messages.fetch(`1019171787935846461`)
            if (!birthday_mar[0]) {
                await msg_mar.edit(`\`Праздников нет.\``)
            } else {
                let sort = await birthday_mar.sort((a, b) => a.birthday.day - b.birthday.day)
                const map = sort.map(async (memberdata) => {
                    const user = await guild.members.fetch(memberdata.userid)
                    let zodiak
                    if (memberdata.birthday.day <= 20) {
                        zodiak = `♓`
                    } else if (memberdata.birthday.day >= 21) {
                        zodiak = `♈`
                    }
                    return `${zodiak} ${memberdata.birthday.day} марта - ${user}`
                })
                let promise = await Promise.all(map)
                await msg_mar.edit(`${promise.join(`\n`)}`)
            }

            const birthday_apr = await User.find({ guildid: guild.id, "birthday.month": 4 })
            const msg_apr = await b_chan.messages.fetch(`1019171791232569364`)
            if (!birthday_apr[0]) {
                await msg_apr.edit(`\`Праздников нет.\``)
            } else {
                let sort = await birthday_apr.sort((a, b) => a.birthday.day - b.birthday.day)
                const map = sort.map(async (memberdata) => {
                    const user = await guild.members.fetch(memberdata.userid)
                    let zodiak
                    if (memberdata.birthday.day <= 20) {
                        zodiak = `♈`
                    } else if (memberdata.birthday.day >= 21) {
                        zodiak = `♉`
                    }
                    return `${zodiak} ${memberdata.birthday.day} апреля - ${user}`
                })
                let promise = await Promise.all(map)
                await msg_apr.edit(`${promise.join(`\n`)}`)
            }

            const birthday_may = await User.find({ guildid: guild.id, "birthday.month": 5 })
            const msg_may = await b_chan.messages.fetch(`1019171809570066452`)
            if (!birthday_may) {
                await msg_may.edit(`\`Праздников нет.\``)
            } else {
                let sort = await birthday_may.sort((a, b) => a.birthday.day - b.birthday.day)
                const map = sort.map(async (memberdata) => {
                    const user = await guild.members.fetch(memberdata.userid)
                    let zodiak
                    if (memberdata.birthday.day <= 21) {
                        zodiak = `♉`
                    } else if (memberdata.birthday.day >= 22) {
                        zodiak = `♊`
                    }
                    return `${zodiak} ${memberdata.birthday.day} мая - ${user}`
                })
                let promise = await Promise.all(map)
                await msg_may.edit(`${promise.join(`\n`)}`)
            }

            const birthday_jun = await User.find({ guildid: guild.id, "birthday.month": 6 })
            const msg_jun = await b_chan.messages.fetch(`1019171812317351976`)
            if (!birthday_jun[0]) {
                await msg_jun.edit(`\`Праздников нет.\``)
            } else {
                let sort = await birthday_jun.sort((a, b) => a.birthday.day - b.birthday.day)
                const map = sort.map(async (memberdata) => {
                    const user = await guild.members.fetch(memberdata.userid)
                    let zodiak
                    if (memberdata.birthday.day <= 21) {
                        zodiak = `♊`
                    } else if (memberdata.birthday.day >= 22) {
                        zodiak = `♋`
                    }
                    return `${zodiak} ${memberdata.birthday.day} июня - ${user}`
                })
                let promise = await Promise.all(map)
                await msg_jun.edit(`${promise.join(`\n`)}`)
            }

            const birthday_jul = await User.find({ guildid: guild.id, "birthday.month": 7 })
            const msg_jul = await b_chan.messages.fetch(`1019171834274533427`)
            if (!birthday_jul[0]) {
                await msg_jul.edit(`\`Праздников нет.\``)
            } else {
                let sort = await birthday_jul.sort((a, b) => a.birthday.day - b.birthday.day)
                const map = sort.map(async (memberdata) => {
                    const user = await guild.members.fetch(memberdata.userid)
                    let zodiak
                    if (memberdata.birthday.day <= 22) {
                        zodiak = `♋`
                    } else if (memberdata.birthday.day >= 23) {
                        zodiak = `♌`
                    }
                    return `${zodiak} ${memberdata.birthday.day} июля - ${user}`
                })
                let promise = await Promise.all(map)
                await msg_jul.edit(`${promise.join(`\n`)}`)
            }

            const birthday_aug = await User.find({ guildid: guild.id, "birthday.month": 8 })
            const msg_aug = await b_chan.messages.fetch(`1019171837491560468`)
            if (!birthday_aug[0]) {
                await msg_aug.edit(`\`Праздников нет.\``)
            } else {
                let sort = await birthday_aug.sort((a, b) => a.birthday.day - b.birthday.day)
                const map = sort.map(async (memberdata) => {
                    const user = await guild.members.fetch(memberdata.userid)
                    let zodiak
                    if (memberdata.birthday.day <= 21) {
                        zodiak = `♌`
                    } else if (memberdata.birthday.day >= 22) {
                        zodiak = `♍`
                    }
                    return `${zodiak} ${memberdata.birthday.day} августа - ${user}`
                })
                let promise = await Promise.all(map)
                await msg_aug.edit(`${promise.join(`\n`)}`)
            }

            const birthday_sep = await User.find({ guildid: guild.id, "birthday.month": 9 })
            const msg_sep = await b_chan.messages.fetch(`1019171840163319840`)
            if (!birthday_sep[0]) {
                await msg_sep.edit(`\`Праздников нет.\``)
            } else {
                let sort = await birthday_sep.sort((a, b) => a.birthday.day - b.birthday.day)
                const map = sort.map(async (memberdata) => {
                    const user = await guild.members.fetch(memberdata.userid)
                    let zodiak
                    if (memberdata.birthday.day <= 23) {
                        zodiak = `♍`
                    } else if (memberdata.birthday.day >= 24) {
                        zodiak = `♎`
                    }
                    return `${zodiak} ${memberdata.birthday.day} сентября - ${user}`
                })
                let promise = await Promise.all(map)
                await msg_sep.edit(`${promise.join(`\n`)}`)
            }

            const birthday_oct = await User.find({ guildid: guild.id, "birthday.month": 10 })
            const msg_oct = await b_chan.messages.fetch(`1019171854570758175`)
            if (!birthday_oct[0]) {
                await msg_oct.edit(`\`Праздников нет.\``)
            } else {
                let sort = await birthday_oct.sort((a, b) => a.birthday.day - b.birthday.day)
                const map = sort.map(async (memberdata) => {
                    const user = await guild.members.fetch(memberdata.userid)
                    let zodiak
                    if (memberdata.birthday.day <= 23) {
                        zodiak = `♎`
                    } else if (memberdata.birthday.day >= 24) {
                        zodiak = `♏`
                    }
                    return `${zodiak} ${memberdata.birthday.day} октября - ${user}`
                })
                let promise = await Promise.all(map)
                await msg_oct.edit(`${promise.join(`\n`)}`)
            }

            const birthday_nov = await User.find({ guildid: guild.id, "birthday.month": 11 })
            const msg_nov = await b_chan.messages.fetch(`1019171857502572555`)
            if (!birthday_nov[0]) {
                await msg_nov.edit(`\`Праздников нет.\``)
            } else {
                let sort = await birthday_nov.sort((a, b) => a.birthday.day - b.birthday.day)
                const map = sort.map(async (memberdata) => {
                    const user = await guild.members.fetch(memberdata.userid)
                    let zodiak
                    if (memberdata.birthday.day <= 22) {
                        zodiak = `♏`
                    } else if (memberdata.birthday.day >= 23) {
                        zodiak = `♐`
                    }
                    return `${zodiak} ${memberdata.birthday.day} ноября - ${user}`
                })
                let promise = await Promise.all(map)
                await msg_nov.edit(`${promise.join(`\n`)}`)
            }

            const birthday_dec = await User.find({ guildid: guild.id, "birthday.month": 12 })
            const msg_dec = await b_chan.messages.fetch(`1019171876318220328`)
            if (!birthday_dec[0]) {
                await msg_dec.edit(`\`Праздников нет.\``)
            } else {
                let sort = await birthday_dec.sort((a, b) => a.birthday.day - b.birthday.day)
                const map = sort.map(async (memberdata) => {
                    const user = await guild.members.fetch(memberdata.userid)
                    let zodiak
                    if (memberdata.birthday.day <= 22) {
                        zodiak = `♐`
                    } else if (memberdata.birthday.day >= 23) {
                        zodiak = `♑`
                    }
                    return `${zodiak} ${memberdata.birthday.day} декабря - ${user}`
                })
                let promise = await Promise.all(map)
                await msg_dec.edit(`${promise.join(`\n`)}`)
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
    static async update_members(client) {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", this.id)) return;
            const userDatas = await User.find({ guildid: guild.id })
            const channel = await guild.channels.cache.get(`932203255335899177`)
            const adminmsg = await channel.messages.fetch(`1162463340858183681`)
            const premmsg = await channel.messages.fetch(`1162463342171005010`)
            const membmsg1 = await channel.messages.fetch(`1162463343785824397`)
            const membmsg2 = await channel.messages.fetch(`1162463345186717706`)
            const nolicensemsg = await channel.messages.fetch(`1162463366489592040`);
            const members = await guild.members.fetch().then(async members => await members.filter(m => m.roles.cache.has("504887113649750016")))
            let noLicenseUserDatas = []

            const admins = await members.filter(member => member.roles.cache.has(`567689925143822346`))
            await admins.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
            const admin_list = await admins.map(async (admin) => {
                const userData = userDatas.find(ud => ud.userid == admin.user.id)
                if (userData.onlinemode == false) noLicenseUserDatas.push(userData)
                else {
                    let nickname
                    let age
                    if (!userData) {
                        age = `Возраст не указан`
                        nickname = `Никнейм не указан`
                    } else {
                        age = userData.age
                        nickname = userData.nickname
                    }
                    return `${admin} ➖ \`${age} лет\` ➖ \`${nickname}\``
                }

            })
            let adminres = await Promise.all(admin_list)
            if (adminres.length <= 0) adminres = [`\`Нет участников.\``]
            const mainoffs = await members.filter(member => !member.roles.cache.has(`567689925143822346`) && member.roles.cache.has(`320880176416161802`))
            await mainoffs.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
            const mainoff_list = await mainoffs.map(async (mainoff) => {
                const userData = userDatas.find(ud => ud.userid == mainoff.user.id)
                if (userData.onlinemode == false) noLicenseUserDatas.push(userData)
                else {
                    let nickname
                    let age
                    if (!userData) {
                        age = `Возраст не указан`
                        nickname = `Никнейм не указан`
                    } else {
                        age = userData.age
                        nickname = userData.nickname
                    }

                    return `${mainoff} ➖ \`${age} лет\` ➖ \`${nickname}\``
                }
            })
            let mainoffres = await Promise.all(mainoff_list)
            if (mainoffres.length <= 0) mainoffres = [`\`Нет участников.\``]
            const offs = await members.filter(member => !member.roles.cache.has(`567689925143822346`) && !member.roles.cache.has(`320880176416161802`) && (member.roles.cache.has(`563793535250464809`)))
            await offs.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
            const off_list = await offs.map(async (off) => {
                const userData = userDatas.find(ud => ud.userid == off.user.id)
                if (userData.onlinemode == false) noLicenseUserDatas.push(userData)
                else {
                    let nickname
                    let age
                    if (!userData) {
                        age = `Возраст не указан`
                        nickname = `Никнейм не указан`
                    } else {
                        age = userData.age
                        nickname = userData.nickname
                    }

                    return `${off} ➖ \`${age} лет\` ➖ \`${nickname}\``
                }
            })
            let offres = await Promise.all(off_list)
            if (offres.length <= 0) offres = [`\`Нет участников.\``]

            const staff = new EmbedBuilder()
                .setTitle(`ПЕРСОНАЛ ГИЛЬДИИ`)
                .setColor(Number(client.information.bot_color))
                .setDescription(`**Правление гильдии**
${adminres.join('\n')}

**Администраторы гильдии**
${mainoffres.join('\n')}

**Офицеры гильдии**
${offres.join('\n')}`)
            await adminmsg.edit({
                content: ``,
                embeds: [staff]
            })


            const premiums = await members.filter(member => !member.roles.cache.has(`567689925143822346`) && !member.roles.cache.has(`320880176416161802`) && !member.roles.cache.has(`563793535250464809`) && !member.roles.cache.has(`523559726219526184`) && member.roles.cache.has(`850336260265476096`))
            await premiums.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
            const prem_list = await premiums.map(async (premium) => {
                const userData = userDatas.find(ud => ud.userid == premium.user.id)
                if (userData.onlinemode == false) noLicenseUserDatas.push(userData)
                else {
                    let nickname
                    let age
                    if (!userData) {
                        age = `Возраст не указан`
                        nickname = `Никнейм не указан`
                    } else {
                        age = userData.age
                        nickname = userData.nickname
                    }

                    return `${premium} ➖ \`${age} лет\` ➖ \`${nickname}\``
                }
            })
            let premres = await Promise.all(prem_list)
            if (premres.length <= 0) premres = [`\`Нет участников.\``]
            const premmembers = new EmbedBuilder()
                .setTitle(`VIP УЧАСТНИКИ`)
                .setColor(Number(client.information.bot_color))
                .setDescription(`${premres.join('\n')}`)
            await premmsg.edit({
                content: ``,
                embeds: [premmembers]
            })

            const gmembers = await members.filter(member => !member.roles.cache.has(`567689925143822346`) && !member.roles.cache.has(`320880176416161802`) && !member.roles.cache.has(`563793535250464809`) && !member.roles.cache.has(`523559726219526184`) && !member.roles.cache.has(`850336260265476096`) && member.roles.cache.has(`504887113649750016`) && member.user.id !== `` && member.user.id !== ``)
            await gmembers.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp)
            const memb_list = await gmembers.map(async (memb) => {
                const userData = userDatas.find(ud => ud.userid == memb.user.id)
                if (userData.onlinemode == false) noLicenseUserDatas.push(userData)
                else {
                    let nickname
                    let age
                    if (!userData.age) {
                        age = `Возраст не указан`
                    } else {
                        age = userData.age
                    }
                    if (!userData.nickname) {
                        nickname = `Никнейм не указан`
                    } else {
                        nickname = userData.nickname
                    }

                    return `${memb} ➖ \`${age} лет\` ➖ \`${nickname}\``
                }
            })
            let membres = await Promise.all(memb_list)
            if (membres.length <= 0) membres = [`\`Нет участников.\``]
            let ms1 = membres.slice(0, 30)
            let ms2 = membres.slice(30, 60)
            if (ms2.length <= 0) ms2 = [`\`Нет участников на странице 2.\``]
            const memberslist1 = new EmbedBuilder()
                .setTitle(`УЧАСТНИКИ ГИЛЬДИИ ЧАСТЬ 1`)
                .setColor(Number(client.information.bot_color))
                .setDescription(
                    `${await ms1.join('\n')}`
                )
            await membmsg1.edit({
                content: ``,
                embeds: [memberslist1]
            })
            const memberslist2 = new EmbedBuilder()
                .setTitle(`УЧАСТНИКИ ГИЛЬДИИ ЧАСТЬ 2`)
                .setColor(Number(client.information.bot_color))
                .setDescription(
                    `${await ms2.join('\n')}`
                )
            await membmsg2.edit({
                content: ``,
                embeds: [memberslist2]
            })


            let noLicenseMap = await noLicenseUserDatas.map(userData => {
                let age
                if (!userData.age) {
                    age = `Возраст не указан`
                } else {
                    age = userData.age
                }

                return `<@${userData.userid}> ➖ \`${age} лет\``
            })
            if (noLicenseMap.length <= 0) noLicenseMap = [`\`Нет участников.\``]

            const noLicenseList = new EmbedBuilder()
                .setTitle(`УЧАСТНИКИ ГИЛЬДИИ БЕЗ ЛИЦЕНЗИИ MINECRAFT`)
                .setColor(Number(client.information.bot_color))
                .setDescription(
                    `${await noLicenseMap.join('\n')}`
                )
            await nolicensemsg.edit({
                content: ``,
                embeds: [noLicenseList]
            })
            console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magenta(`[ОБНОВЛЁН КАНАЛ УЧАСТНИКИ]`) + chalk.gray(`: Канал участники был обновлен. Добавлены новые пользователи. Изменены позиции текущий участников.`))


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
    static async statsChannel(client) {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", this.id)) return;
            const dis_members = await guild.memberCount
            const role = await guild.roles.fetch(`504887113649750016`)
            const guilddata = await Guild.findOne({ id: guild.id })
            const guild_members = await role.members.size
            let level = 0
            let xpneeded = 0
            let responseA = await fetch(`https://api.hypixel.net/guild?id=5c1902fc77ce84cd430f3959`, {
                headers: {
                    "API-Key": api,
                    "Content-Type": "application/json"
                }
            })
            if (responseA.ok) {
                let json = await responseA.json()
                let hpguild = json.guild

                //Assign a level value based on guild.exp value
                if (hpguild.exp < 100000) level = 0
                else if (hpguild.exp < 250000) level = 1
                else if (hpguild.exp < 500000) level = 2
                else if (hpguild.exp < 1000000) level = 3
                else if (hpguild.exp < 1750000) level = 4
                else if (hpguild.exp < 2750000) level = 5
                else if (hpguild.exp < 4000000) level = 6
                else if (hpguild.exp < 5500000) level = 7
                else if (hpguild.exp < 7500000) level = 8
                else if (hpguild.exp >= 7500000 && hpguild.exp < 20000000) level = Math.floor((hpguild.exp - 7500000) / 2500000) + 9
                else if (hpguild.exp >= 20000000) level = Math.floor((hpguild.exp - 20000000) / 3000000) + 14

                if (hpguild.exp < 100000) xpneeded = 100000 - hpguild.exp
                else if (hpguild.exp < 250000) xpneeded = 250000 - hpguild.exp
                else if (hpguild.exp < 500000) xpneeded = 500000 - hpguild.exp
                else if (hpguild.exp < 1000000) xpneeded = 1000000 - hpguild.exp
                else if (hpguild.exp < 1750000) xpneeded = 1750000 - hpguild.exp
                else if (hpguild.exp < 2750000) xpneeded = 2750000 - hpguild.exp
                else if (hpguild.exp < 4000000) xpneeded = 4000000 - hpguild.exp
                else if (hpguild.exp < 5500000) xpneeded = 5500000 - hpguild.exp
                else if (hpguild.exp < 7500000) xpneeded = 7500000 - hpguild.exp
                else if (hpguild.exp >= 7500001 && hpguild.exp < 20000000) xpneeded = 20000000 - hpguild.exp
                else if (hpguild.exp >= 20000000) xpneeded = ((Math.floor((hpguild.exp - 20000000) / 3000000) + 1) * 3000000) - (hpguild.exp - 20000000)
            }
            const percent = 100 - (Math.round((xpneeded / 3000000) * 100))
            const before = guilddata.hypixel_lvl
            guilddata.hypixel_lvl = level
            guilddata.save()
            if (before < guilddata.hypixel_lvl) {
                const chat = await guild.channels.fetch(ch_list.main)
                await chat.send({
                    content: `**НОВЫЙ УРОВЕНЬ ГИЛЬДИИ** @here

Уровень гильдии на Hypixel повышен!
\`${before}\` ➡ \`${guilddata.hypixel_lvl}\``,
                    allowedMentions: {
                        parse: ["everyone"]
                    }
                })
            }

            const channel_level = await guild.channels.fetch(`1017729617739665408`)
            await channel_level.edit({
                name: `┊📊・Уровень: ${level}`
            })
            const channel_percent = await guild.channels.fetch(`1017757816125136896`)
            await channel_percent.edit({
                name: `┊📊・Прогресс: ${percent}%`
            })
            const channel_disc = await guild.channels.fetch(`1017760339464556605`)
            await channel_disc.edit({
                name: `┊📊・На сервере: ${dis_members}`
            })
            const channel_memb = await guild.channels.fetch(`1017729601813884928`)
            await channel_memb.edit({
                name: `╰📊・В гильдии: ${guild_members}`
            })
        } catch (e) {
            const admin = await client.users.fetch(`491343958660874242`)
            console.log(e)
            await admin.send({
                content: `-> \`\`\`${e.stack}\`\`\``
            }).catch()
        }

    }
}

module.exports = {
    ChannelUpdates
}