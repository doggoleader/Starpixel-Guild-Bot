const { Guild } = require(`../../schemas/guilddata`)
const { User } = require(`../../schemas/userdata`)
const chalk = require(`chalk`)
const { EmbedBuilder } = require("discord.js")
const ch_list = require(`../../discord structure/channels.json`)
const linksInfo = require(`../../discord structure/links.json`)
const wait = require('node:timers/promises').setTimeout
const { checkPlugin } = require("../../functions");
const plugin = {
    id: "channels",
    name: "Каналы"
}

module.exports = (client) => {
    client.update_members = async () => {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", plugin.id)) return;
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
                .setColor(Number(linksInfo.bot_color))
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
                .setColor(Number(linksInfo.bot_color))
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
                .setColor(Number(linksInfo.bot_color))
                .setDescription(
                    `${await ms1.join('\n')}`
                )
            await membmsg1.edit({
                content: ``,
                embeds: [memberslist1]
            })
            const memberslist2 = new EmbedBuilder()
                .setTitle(`УЧАСТНИКИ ГИЛЬДИИ ЧАСТЬ 2`)
                .setColor(Number(linksInfo.bot_color))
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
                .setColor(Number(linksInfo.bot_color))
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
            var path = require('path');
            var scriptName = path.basename(__filename);
            await admin.send(`Произошла ошибка!`)
            await admin.send(`=> ${e}.
**Файл**: ${scriptName}`)
            await admin.send(`◾`)
        }

    }
}