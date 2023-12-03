const { User } = require(`../../schemas/userdata`)
const chalk = require(`chalk`);
const { EmbedBuilder, ChannelType } = require(`discord.js`)
const ch_list = require(`../../discord structure/channels.json`)

const { Guild } = require('../../schemas/guilddata');
const { Apply } = require('../../schemas/applications');
const { monthName } = require('../../functions');
const { checkPlugin } = require("../../functions");


class PersInfo {
    /** @private */
    static id = 'admin';
    /** @private */
    static name = `Административное`;
    /**
     * @param {String} userid Discord User ID
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async PersJoinGuild(userid, client) {
        try {
            const guild = await client.guilds.fetch("320193302844669959")
            if (!await checkPlugin("320193302844669959", this.id)) return;
            const guildData = await Guild.findOne({ id: guild.id })
            const channel = await guild.channels.fetch("1124049794386628721")
            const userData = await User.findOne({ userid: userid });
            const member = await guild.members.fetch(userData.userid)
            if (!userData) return
            if (!userData.pers_info.channel) {
                const thread = await channel.threads.create({
                    name: `Личное дело ${userData.nickname}`,
                    reason: `Создан профиль пользователя ${userData.nickname}`,
                    type: ChannelType.PrivateThread,
                    invitable: false
                })
                if (userData.birthday.day && userData.birthday.month && userData.birthday.year) bday = `${userData.birthday.day}.${userData.birthday.month}.${userData.birthday.year}`
                else bday = `Нет данных.`
                userData.pers_info.channel = thread.id
                let i = guildData.pers_info.numb + 1
                guildData.pers_info.numb = i
                userData.pers_info.numb = i
                const embed = new EmbedBuilder()
                    .setTitle(`ЛИЧНОЕ ДЕЛО УЧАСТНИКА ${userData.nickname} (${member.user.username})`)
                    .setColor(Number(client.information.bot_color))
                    .setAuthor({ name: `Причина: Создание профиля` })
                    .setTimestamp(Date.now())
                    .setFooter({ text: `Личное дело пользователя ${userData.nickname}. Доступно для чтения.` })
                    .setDescription(`## ЛИЧНОЕ ДЕЛО №${i} (${userData.nickname})
                
Реальное имя - \`${userData.displayname.name}\`
Игровой никнейм - \`${userData.nickname}\`
UUID Minecraft - \`${userData.onlinemode ? userData.uuid : null}\`
Дата рождения - \`${bday}\`
Дата вступления - \`${userData.joinedGuild}\`
ID пользователя - \`${userData.userid}\`
Возраст - \`${userData.age}\``)

                const msg = await thread.send({
                    embeds: [embed]
                })
                userData.pers_info.main_msg = msg.id
                userData.save();

                const application = await Apply.findOne({ userid: userData.userid })
                if (application) {
                    let appsChannel = await guild.channels.fetch('921719174819090462')
                    try {
                        let appMsg = await appsChannel.messages.fetch(application.applicationid)
                        if (appMsg) {
                            const embed2 = new EmbedBuilder()
                                .setTitle("Данные о пользователе на время вступления в гильдию")
                                .setColor(Number(client.information.bot_color))
                                .setAuthor({ name: `Причина: Создание профиля` })
                                .setTimestamp(Date.now())
                                .setFooter({ text: `Личное дело пользователя ${userData.nickname}. Доступно для чтения.` })
                                .setDescription(`**Данные на время вступления в гильдию. Заявка пользователя**

Реальное имя - \`${userData.displayname.name}\`
Игровой никнейм - \`${userData.nickname}\`
UUID Minecraft - \`${userData.onlinemode ? userData.uuid : null}\`
Дата рождения - \`${bday}\`
Дата вступления - \`${userData.joinedGuild}\`
ID пользователя - \`${userData.userid}\`
Возраст - \`${userData.age}\`

[Заявка пользователя доступна по ссылке](${appMsg?.url})`)
                            await thread.send({
                                embeds: [embed2]
                            })
                        }
                    } catch (e) {
                        console.log(e)
                    }


                }
                const embed3 = new EmbedBuilder()
                    .setTitle(`Создано личное дело №${i}`)
                    .setColor(Number(client.information.bot_color))
                    .setTimestamp(Date.now())
                    .setDescription(`### Зарегистрировано личное дело пользователя ${member} под номером №${i}.
                    
[Получить доступ к личному делу можно, нажав на ссылку](${thread.url}) **НЕОБХОДИМЫ ПРАВА АДМИНИСТРАТОРА**`)
                await channel.send({
                    embeds: [embed3]
                })
                await channel.send({
                    content: ':black_medium_small_square:'
                })
            }
            guildData.save()


        } catch (e) {
            const admin = await client.users.fetch(`491343958660874242`)
            console.log(e)
            await admin.send({
                content: `-> \`\`\`${e.stack}\`\`\``
            }).catch()
        }
    }

    /**
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async MonthlyGEXPCheck(client) {
        try {
            const guild = await client.guilds.fetch("320193302844669959")
            if (!await checkPlugin("320193302844669959", this.id)) return;
            const channel = await guild.channels.fetch("1124049794386628721")
            const userDatas = await User.find();
            for (const userData of userDatas) {
                const member = await guild.members.fetch(userData.userid)
                const thread = await channel.threads.fetch(userData.pers_info.channel)
                let sort1 = userData.gexp_info.sort((a, b) => {
                    let splA = a.date.split(`-`)
                    let splB = b.date.split(`-`)
                    let yearA = splA[0]
                    let yearB = splB[0]
                    return yearB - yearA
                })
                let sort2 = sort1.sort((a, b) => {
                    let splA = a.date.split(`-`)
                    let splB = b.date.split(`-`)
                    let monthA = splA[1]
                    let monthB = splB[1]
                    return monthB - monthA
                })
                let sort = sort2.sort((a, b) => {
                    let splA = a.date.split(`-`)
                    let splB = b.date.split(`-`)
                    let dayA = splA[2]
                    let dayB = splB[2]
                    return dayB - dayA
                })
                let curDate = new Date()
                let curMonth = curDate.getMonth() + 1
                let totalMonths = (curDate.getFullYear() - 1) * 12 + curMonth
                let n = curDate.getMonth() + 1, m = curDate.getFullYear()
                let filt = sort.filter(a => {
                    let spl = a.date.split('-')
                    let year = spl[0], month = spl[1]
                    let allMonths = (Number(year) - 1) * 12 + Number(month)
                    return totalMonths - 3 >= allMonths
                })
                for (let i = n - 3; i >= 0; i--) {
                    if (i > 0) {
                        let filt2 = filt.filter(s => {
                            let spl = s.date.split(`-`)
                            let month = spl[1], year = spl[0]
                            return month == i && year == m
                        })
                        if (filt2.length > 0) {
                            let monthSum = 0

                            let map = filt2.map(info => {
                                let dates = info.date.split(`-`)
                                let day = dates[2], month = dates[1], year = dates[0]
                                monthSum += info.gexp
                                return `\`${day}.${month}.${year}\` - \`${info.gexp}\` GEXP`
                            })
                            let monthN = await monthName(i);
                            const embed = new EmbedBuilder()
                                .setTitle(`ЛИЧНОЕ ДЕЛО УЧАСТНИКА ${userData.nickname} (${member.user.username})`)
                                .setColor(Number(client.information.bot_color))
                                .setAuthor({ name: `Причина: Сохранение GEXP старше 3-х месяцев` })
                                .setTimestamp(Date.now())
                                .setFooter({ text: `Личное дело пользователя ${userData.nickname}. Доступно для чтения.` })
                                .setDescription(`## Опыт гильдии за ${monthN}, ${m}
                                
${map.join(`\n`)}

**Опыта за месяц**: ${monthSum}`)
                            await thread.send({
                                embeds: [embed]
                            })
                        } else if (filt2.length <= 0) {
                            i = -1
                        }

                    } else if (i == 0) {
                        i = 13
                        m = m - 1
                    } else if (i < 0) {

                    }

                }
                let filt3 = sort.filter(a => {
                    let spl = a.date.split('-')
                    let year = spl[0], month = spl[1]
                    let allMonths = (Number(year) - 1) * 12 + Number(month)
                    return totalMonths - 3 < allMonths
                })
                userData.gexp_info = filt3;
                userData.save()
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
    * @param {String} userid Discord User ID 
    * @param {'guild_leave' | null} reason Reason to update Personal Info
    * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
    */
    static async InfoUpdate(userid, reason, client) {
        try {
            const guild = await client.guilds.fetch("320193302844669959")
            if (!await checkPlugin("320193302844669959", this.id)) return;
            const channel = await guild.channels.fetch("1124049794386628721")
            if (!userid) {
                const userDatas = await User.find();
                for (const userData of userDatas) {
                    const member = await guild.members.fetch(userData.userid)
                    const thread = await channel.threads.fetch(userData.pers_info.channel)
                    if (!thread) throw new Error(`Не найдено личное дело пользователя ${userData.userid}!`)
                    if (thread.archived) await thread.setArchived(false)
                    if (thread.locked) await thread.setLocked(false)

                    if (userData.onlinemode == true) {
                        if (thread.name !== `Личное дело ${userData.nickname}`) {
                            thread.setName(`Личное дело ${userData.nickname}`)
                        }
                    } else {
                        if (thread.name !== `Личное дело ${userData.name} (${userData.userid})`) {
                            thread.setName(`Личное дело ${userData.name} (${userData.userid})`)
                        }
                    }

                    let bday
                    if (userData.birthday.day && userData.birthday.month && userData.birthday.year) bday = `${userData.birthday.day}.${userData.birthday.month}.${userData.birthday.year}`
                    else bday = `Нет данных.`
                    const msg = await thread.messages.fetch(userData.pers_info.main_msg)
                    const embed = new EmbedBuilder()
                        .setTitle(`ЛИЧНОЕ ДЕЛО УЧАСТНИКА ${userData.onlinemode ? userData.nickname : userData.name} (${member.user.username})`)
                        .setColor(Number(client.information.bot_color))
                        .setAuthor({ name: `Причина: Создание профиля` })
                        .setTimestamp(Date.now())
                        .setFooter({ text: `Личное дело пользователя ${userData.onlinemode ? userData.nickname : userData.name}. Доступно для чтения. Последнее изменение:` })
                        .setDescription(`## ЛИЧНОЕ ДЕЛО №${userData.pers_info.numb} (${userData.onlinemode ? userData.nickname : userData.name})
                
Реальное имя - \`${userData.displayname.name}\`
Игровой никнейм - \`${userData.onlinemode ? userData.nickname : null}\`
UUID Minecraft - \`${userData.onlinemode ? userData.uuid : null}\`
Дата рождения - \`${bday}\`
Дата вступления - \`${userData.joinedGuild}\`
ID пользователя - \`${userData.userid}\`
Возраст - \`${userData.age}\``)
                    await msg.edit({
                        embeds: [embed]
                    })
                    userData.save()
                }
            } else {
                if (reason == 'guild_leave') {
                    const userData = await User.findOne({ userid: userid });
                    const thread = await channel.threads.fetch(userData.pers_info.channel)
                    if (!thread) throw new Error(`Не найдено личное дело пользователя ${userData.userid}!`)
                    if (thread.archived) await thread.setArchived(false)
                    if (thread.locked) await thread.setLocked(false)

                    if (userData.onlinemode == true) {
                        if (thread.name !== `Личное дело ${userData.nickname}`) {
                            thread.setName(`Личное дело ${userData.nickname}`)
                        }
                    } else {
                        if (thread.name !== `Личное дело ${userData.name} (${userData.userid})`) {
                            thread.setName(`Личное дело ${userData.name} (${userData.userid})`)
                        }
                    }
                    let bday
                    if (userData.birthday.day && userData.birthday.month && userData.birthday.year) bday = `${userData.birthday.day}.${userData.birthday.month}.${userData.birthday.year}`
                    else bday = `Нет данных.`
                    const msg = await thread.messages.fetch(userData.pers_info.main_msg)
                    const embed = new EmbedBuilder()
                        .setTitle(`ЛИЧНОЕ ДЕЛО УЧАСТНИКА ${userData.onlinemode ? userData.nickname : userData.name} (${userData.name})`)
                        .setColor(Number(client.information.bot_color))
                        .setAuthor({ name: `Причина: Создание профиля` })
                        .setTimestamp(Date.now())
                        .setFooter({ text: `Личное дело пользователя ${userData.onlinemode ? userData.nickname : userData.name}. Доступно для чтения. Последнее изменение:` })
                        .setDescription(`## ЛИЧНОЕ ДЕЛО №${userData.pers_info.numb} (${userData.onlinemode ? userData.nickname : userData.name})
                
Реальное имя - \`${userData.displayname.name}\`
Игровой никнейм - \`${userData.onlinemode ? userData.nickname : null}\`
UUID Minecraft - \`${userData.onlinemode ? userData.uuid : null}\`
Дата рождения - \`${bday}\`
Дата вступления - \`${userData.joinedGuild}\`
ID пользователя - \`${userData.userid}\`
Возраст - \`${userData.age}\`

**ПОЛЬЗОВАТЕЛЬ ПОКИНУЛ ГИЛЬДИЮ**
<t:${Math.floor(new Date().getTime() / 1000)}:f>`)
                    await msg.edit({
                        embeds: [embed]
                    })
                    await thread.send({
                        content: `# Пользователь покинул гильдию Starpixel
Дальнейшее обновление отсутствует! Дата ухода: <t:${Math.floor(new Date().getTime() / 1000)}:f>`
                    })
                    userData.save()
                    return true
                } else {
                    const userData = await User.findOne({ userid: userid });
                    const member = await guild.members.fetch(userData.userid)
                    const thread = await channel.threads.fetch(userData.pers_info.channel)
                    if (!thread) throw new Error(`Не найдено личное дело пользователя ${userData.userid}!`)
                    if (thread.archived) await thread.setArchived(false)
                    if (thread.locked) await thread.setLocked(false)

                    if (userData.onlinemode == true) {
                        if (thread.name !== `Личное дело ${userData.nickname}`) {
                            thread.setName(`Личное дело ${userData.nickname}`)
                        }
                    } else {
                        if (thread.name !== `Личное дело ${userData.name} (${userData.userid})`) {
                            thread.setName(`Личное дело ${userData.name} (${userData.userid})`)
                        }
                    }
                    let bday
                    if (userData.birthday.day && userData.birthday.month && userData.birthday.year) bday = `${userData.birthday.day}.${userData.birthday.month}.${userData.birthday.year}`
                    else bday = `Нет данных.`
                    const msg = await thread.messages.fetch(userData.pers_info.main_msg)
                    const embed = new EmbedBuilder()
                        .setTitle(`ЛИЧНОЕ ДЕЛО УЧАСТНИКА ${userData.onlinemode ? userData.nickname : userData.name} (${member.user.username})`)
                        .setColor(Number(client.information.bot_color))
                        .setAuthor({ name: `Причина: Создание профиля` })
                        .setTimestamp(Date.now())
                        .setFooter({ text: `Личное дело пользователя ${userData.onlinemode ? userData.nickname : userData.name}. Доступно для чтения. Последнее изменение:` })
                        .setDescription(`## ЛИЧНОЕ ДЕЛО №${userData.pers_info.numb} (${userData.onlinemode ? userData.nickname : userData.name})
                
Реальное имя - \`${userData.displayname.name}\`
Игровой никнейм - \`${userData.onlinemode ? userData.nickname : null}\`
UUID Minecraft - \`${userData.onlinemode ? userData.uuid : null}\`
Дата рождения - \`${bday}\`
Дата вступления - \`${userData.joinedGuild}\`
ID пользователя - \`${userData.userid}\`
Возраст - \`${userData.age}\``)
                    await msg.edit({
                        embeds: [embed]
                    })
                    userData.save()
                    return true
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
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async Warnings(client) {
        try {
            const guild = await client.guilds.fetch("320193302844669959")
            if (!await checkPlugin("320193302844669959", this.id)) return;
            const channel = await guild.channels.fetch("1124049794386628721")
            const userDatas = await User.find({ "warn_info.0": { $exists: true } });
            for (const userData of userDatas) {
                const member = await guild.members.fetch(userData.userid)
                const thread = await channel.threads.fetch(userData.pers_info.channel)
                for (const warn of userData.warn_info) {
                    let numb = userData.warns_number + 1
                    userData.warns_number = userData.warns_number + 1
                    let content = ``, attachments = [], msgId = ``, msgUrl = ``
                    if (warn.message.id) {
                        if (warn.message.content) content = warn.message.content
                        if (warn.message.attachments) {
                            let i = 1
                            for (let att of warn.message.attachments) {
                                attachments.push(`[Вложение ${1}](${att.link})`)
                                i++
                            }
                        }
                        if (warn.message.id) msgId = warn.message.id
                        if (warn.message.url) msgUrl = warn.message.url
                    }

                    let alertSystemMessageID = ``, automodRuleName = ``, channelId = ``, messageMatchedContent = ``, messageMatchedKeyword = ``, ruleId = ``
                    if (warn.automodInfo.alertSystemMessageID) {
                        if (warn.automodInfo.alertSystemMessageID) alertSystemMessageID = warn.automodInfo.alertSystemMessageID
                        if (warn.automodInfo.automodRuleName) automodRuleName = warn.automodInfo.automodRuleName
                        if (warn.automodInfo.channelId) channelId = warn.automodInfo.channelId
                        if (warn.automodInfo.messageMatchedContent) messageMatchedContent = warn.automodInfo.messageMatchedContent
                        if (warn.automodInfo.messageMatchedKeyword) messageMatchedKeyword = warn.automodInfo.messageMatchedKeyword
                        if (warn.automodInfo.ruleId) ruleId = warn.automodInfo.ruleId
                    }

                    const embed = new EmbedBuilder()
                        .setTitle(`ЛИЧНОЕ ДЕЛО УЧАСТНИКА ${userData.nickname} (${member.user.username})`)
                        .setColor(Number(client.information.bot_color))
                        .setAuthor({ name: `Причина: Получение предупреждения` })
                        .setTimestamp(Date.now())
                        .setFooter({ text: `Личное дело пользователя ${userData.nickname}. Доступно для чтения.` })
                        .setDescription(`## ПРЕДУПРЕЖДЕНИЕ ID: ${warn.warn_code} №${numb} от ${warn.date}
### Основная информация
**Модератор**: <@${warn.moderator}>
**Причина**: \`${warn.reason}\`

### Сообщение
**Содержимое сообщения**: \`${content ? content : "Содержимого нет"}\`
**ID сообщения**: \`${msgId ? msgId : "ID сообщения нет"}\`
**Вложения**: ${attachments.length > 0 ? attachments.join(`\n`) : "Вложений нет"}
${msgUrl ? `[Ссылка на сообщение](${msgUrl})` : `Ссылки на сообщение нет`}

### Автомодератор
**ID системного сообщения**: \`${alertSystemMessageID ? alertSystemMessageID : "ID нет"}\`
**Название правила автомодератора**: \`${automodRuleName ? automodRuleName : "Названия правила нет"}\`
**Канал**: ${channelId ? `<#${channelId}> (ID: \`${channelId}\`)` : "\`Канала нет\`"}
**Содержимое сообщения**: \`${messageMatchedContent ? messageMatchedContent : "Содержимого нет"}\`
**Ключевое слово**: \`${messageMatchedKeyword ? messageMatchedKeyword : "Ключевого слова нет"}\`
**ID правила**: \`${ruleId ? ruleId : "ID правила нет"}\``)
                    await thread.send({
                        embeds: [embed]
                    })
                }
                userData.warn_info = []

                userData.save()
            }


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
    PersInfo
}