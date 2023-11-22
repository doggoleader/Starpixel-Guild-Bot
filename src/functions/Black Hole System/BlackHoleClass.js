const { User } = require(`../../schemas/userdata`)
const chalk = require(`chalk`);
const { EmbedBuilder, hyperlink, ChannelType } = require(`discord.js`)
const ch_list = require(`../../discord structure/channels.json`)
const { Guild } = require(`../../schemas/guilddata`)
const { suffix } = require(`../../functions`)
const linksInfo = require(`../../discord structure/links.json`)
const wait = require(`node:timers/promises`).setTimeout
const specialUsers = require(`./JSON/SpecialUsers.json`)
const { monthName } = require(`../../functions`)
const { checkPlugin } = require("../../functions");

class BlackHole {
    id= "admin";
    name= "Административное";

    /**
     * 
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async activate(client) {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", this.id)) return;
            const newsChannel = await guild.channels.fetch(ch_list.news)
            const messages = await newsChannel.messages.fetch()
            const msgs = await messages.filter(msg => msg.createdTimestamp >= Date.now() - (1000 * 60 * 60 * 24 * 60) && msg.createdTimestamp <= Date.now() - (1000 * 60 * 60 * 24 * 7))

            const userDatas = await User.find()
            let importantInfo = []
            for (let userData of userDatas) {
                console.log(userData.nickname + ' ' + userData.userid)
                const member = await guild.members.fetch(userData.userid)
                userData.black_hole.info.missing_news = []
                for (const message of msgs) {
                    const msg = await newsChannel.messages.fetch(message[0])

                    const reaction = await msg.reactions.cache.find(reaction => reaction.emoji.name == `✅`)

                    if (reaction) {
                        const users = await reaction.users.fetch()
                        if (!users.has(member.user.id) && msg.createdTimestamp >= userData.joinedGuild) {
                            await userData.black_hole.info.missing_news.push(reaction.message.url)
                        }

                    }
                }
                if (userData.black_hole.info.stage1_thread) {
                    const channel = await guild.channels.fetch(ch_list.main)
                    const thread = await channel.threads.fetch(userData.black_hole.info.stage1_thread)
                    await thread.setLocked(true)
                    await thread.setArchived(true)
                    userData.black_hole.info.stage1_thread = ``
                }

                if (userData.black_hole.info.missing_news.length > 0) {

                    const mapL = userData.black_hole.info.missing_news.map(async (news, i) => {
                        return `**${++i}.** ${hyperlink(`Новость ${i}`, news, `Непрочитанная новость №${i}! Прочитайте её и нажмите на галочку!`)}`
                    })
                    const map = await Promise.all(mapL)
                    const embed = new EmbedBuilder()
                        .setTitle(`Обратите внимание!`)
                        .setColor(`DarkRed`)
                        .setDescription(`У вас имеются непрочитанные новости в гильдии! Пожалуйста, прочтите их и нажмите на галочку под ними!
${map.join(`\n`)}`)
                    await member.send({
                        content: `${member}`,
                        embeds: [embed]
                    })
                        .catch(async err => {
                            const channel = await guild.channels.fetch(ch_list.main)
                            const thread = await channel.threads.create({
                                name: `Внимание, ${member.user.username}!`,
                                type: ChannelType.PrivateThread,
                                invitable: false
                            })
                            await thread.members.add(member.user.id)

                            await thread.send({
                                content: `${member}`,
                                embeds: [embed]
                            })
                            userData.black_hole.info.stage1_thread = thread.id
                        })
                }
                let gexp = 0
                let gexpInfo = await userData.gexp_info.filter(i => {
                    let m = i.date.split(`-`)[1]
                    return m == new Date().getMonth()
                })
                for (let gxp of gexpInfo) {
                    gexp += gxp.gexp
                }

                let warns = []
                let warnInfo = await userData.warn_info.filter(w => {
                    return w.date.getMonth() == new Date().getMonth()
                })
                for (let w of warnInfo) {
                    warns.push({
                        reason: w.reason,
                        date: w.date,
                        mod: w.moderator
                    })
                }
                importantInfo.push({
                    id: userData.userid, //+
                    missingNews: userData.black_hole.info.missing_news, //+
                    visitedGames: userData.black_hole.info.games_lastMonth, //+
                    GEXP: gexp, //+
                    messages: userData.black_hole.info.messages_lastMonth, //+
                    VoiceMins: userData.black_hole.info.minutesInVoice_lastMonth, //+
                    VoiceTalk: userData.black_hole.info.minutesInVoiceTalking_lastMonth, //+
                    Warnings: warns //+
                })
                userData.black_hole.info.games_lastMonth = 0
                userData.black_hole.info.messages_lastMonth = 0
                userData.black_hole.info.minutesInVoice_lastMonth = 0
                userData.black_hole.info.minutesInVoiceTalking_lastMonth = 0
                userData.save()
                client.Warnings()
            }


            const offChannel = await guild.channels.cache.get(ch_list.staff)
            const date = new Date()
            let m = date.getMonth() + 1
            let mName = await monthName(m)
            const thread = await offChannel.threads.create({
                name: `${mName} ${date.getDate()}, ${date.getFullYear()} - Проверка игроков`,
                type: ChannelType.PublicThread,
                reason: `Система "Чёрная дыра" проверила игроков на неактивность.`
            });

            async function timeToString(secs) {
                let r = ``;
                if (Math.floor(secs / 86400) > 0) {
                    let days = Math.floor(secs / 86400);
                    if (days > 0) r = `${days}дн. `
                    secs -= days * 86400
                }
                if (Math.floor(secs / 3600) > 0) {
                    let hours = Math.floor((secs / 3600) % 24);
                    if (hours > 0) r = r + `${hours}ч. `
                    secs -= hours * 3600
                }
                if (Math.floor(secs / 60) > 0) {
                    let mins = Math.floor(secs / 60);
                    if (mins > 0) r = r + `${mins}мин. `
                    secs -= mins * 60
                }
                r = r + `${secs}сек.`
                return r
            };

            for (let inf of importantInfo) {
                let inVoice = await timeToString(inf.VoiceMins)
                let talking = await timeToString(inf.VoiceTalk)
                const embed = new EmbedBuilder()
                    .setColor(Number(linksInfo.bot_color))
                    .setTitle(`Информация о пользователе`)
                    .setTimestamp(Date.now())
                    .setDescription(`**Пользователь**: <@${inf.id}>
**Непрочитанных новостей**: ${inf.missingNews.length <= 0 ? `${inf.missingNews.length} ✅` : `${inf.missingNews.length} ❌`} шт.
**Посещено совместных игр**: ${inf.visitedGames >= 2 ? `${inf.visitedGames} ✅` : `${inf.visitedGames} ❌`}/2 игр
**Опыта гильдии за месяц**: ${inf.GEXP >= 120000 ? `${inf.GEXP} ✅` : `${inf.GEXP} ❌`}/120000 GEXP
**Сообщений за месяц**: ${inf.messages >= 100 ? `${inf.messages} ✅` : `${inf.messages} ❌`}/100 сообщений (приблизительное мин. количество)

**ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ**
**Времени в голосовых каналах (нахождение)**: ${talking}
**Времени в голосовых каналах (разговор)**: ${inVoice}
**Предупреждений**: ${inf.Warnings.length} шт.`)

                await thread.send({
                    embeds: [embed]
                })

                if (inf.missingNews.length > 0) {
                    let news = inf.missingNews.map((n, i) => {
                        return `**${++i}.** [Новость](${n})`
                    })
                    const newsEmbed = new EmbedBuilder()
                        .setColor(Number(linksInfo.bot_color))
                        .setTitle(`Список непрочитанных новостей`)
                        .setDescription(`**Пользователь**: <@${inf.id}>
**СПИСОК**:
${news.join(`\n`)}`)
                    await thread.send({
                        embeds: [newsEmbed]
                    })
                }

                if (inf.Warnings.length > 0) {
                    let warns = inf.Warnings.map((n, i) => {
                        return `**${++i}.** Дата: ${n.date} = Причина: ${n.reason}`
                    })
                    const warnsEmbed = new EmbedBuilder()
                        .setColor(Number(linksInfo.bot_color))
                        .setTitle(`Список предупреждений`)
                        .setDescription(`**Пользователь**: <@${inf.id}>
**СПИСОК**:
${warns.join(`\n`)}`)
                    await thread.send({
                        embeds: [warnsEmbed]
                    })
                }

                await thread.send({
                    content: `◾`
                })
            }

            await thread.send({
                content: `<@&563793535250464809>`,
                allowedMentions: {
                    roles: ["563793535250464809"]
                }
            })

            client.MonthlyGEXPCheck()

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
module.exports = {
    BlackHole
}
