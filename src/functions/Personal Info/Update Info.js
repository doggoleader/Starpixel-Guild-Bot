const { User } = require(`../../schemas/userdata`)
const { Birthday } = require(`../../schemas/birthday`)
const chalk = require(`chalk`);
const { EmbedBuilder, ChannelType } = require(`discord.js`)
const ch_list = require(`../../discord structure/channels.json`)
const linksInfo = require(`../../discord structure/links.json`);
const { Guild } = require('../../schemas/guilddata');
const { Apply } = require('../../schemas/applications');
const { monthName } = require('../../functions');
const { checkPlugin } = require("../../functions");
const plugin = {
    id: "admin",
    name: "Административное"
}

module.exports = (client) => {
    client.InfoUpdate = async (userid, reason) => {
        try {
            const guild = await client.guilds.fetch("320193302844669959")
            if (!await checkPlugin("320193302844669959", plugin.id)) return;
            const channel = await guild.channels.fetch("1124049794386628721")
            if (!userid) {
                const userDatas = await User.find();
                for (const userData of userDatas) {
                    const member = await guild.members.fetch(userData.userid)
                    const thread = await channel.threads.fetch(userData.pers_info.channel)
                    if (thread.archived) await thread.setArchived(false)
                    if (thread.locked) await thread.setLocked(false)
                    const birthday = await Birthday.findOne({ userid: userData.userid })
                    let bday
                    if (birthday) bday = `${birthday.day}.${birthday.month}.${birthday.year}`
                    else bday = `Нет данных.`
                    const msg = await thread.messages.fetch(userData.pers_info.main_msg)
                    const embed = new EmbedBuilder()
                        .setTitle(`ЛИЧНОЕ ДЕЛО УЧАСТНИКА ${userData.nickname} (${member.user.username})`)
                        .setColor(Number(linksInfo.bot_color))
                        .setAuthor({ name: `Причина: Создание профиля` })
                        .setTimestamp(Date.now())
                        .setFooter({ text: `Личное дело пользователя ${userData.nickname}. Доступно для чтения. Последнее изменение:` })
                        .setDescription(`## ЛИЧНОЕ ДЕЛО №${userData.pers_info.numb} (${userData.nickname})
                
Реальное имя - \`${userData.displayname.name}\`
Игровой никнейм - \`${userData.nickname}\`
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
                    if (thread.archived) await thread.setArchived(false)
                    if (thread.locked) await thread.setLocked(false)
                    const birthday = await Birthday.findOne({ userid: userData.userid })
                    let bday
                    if (birthday) bday = `${birthday.day}.${birthday.month}.${birthday.year}`
                    else bday = `Нет данных.`
                    const msg = await thread.messages.fetch(userData.pers_info.main_msg)
                    const embed = new EmbedBuilder()
                        .setTitle(`ЛИЧНОЕ ДЕЛО УЧАСТНИКА ${userData.nickname} (${userData.name})`)
                        .setColor(Number(linksInfo.bot_color))
                        .setAuthor({ name: `Причина: Создание профиля` })
                        .setTimestamp(Date.now())
                        .setFooter({ text: `Личное дело пользователя ${userData.nickname}. Доступно для чтения. Последнее изменение:` })
                        .setDescription(`## ЛИЧНОЕ ДЕЛО №${userData.pers_info.numb} (${userData.nickname})
                
Реальное имя - \`${userData.displayname.name}\`
Игровой никнейм - \`${userData.nickname}\`
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
                    if (thread.archived) await thread.setArchived(false)
                    if (thread.locked) await thread.setLocked(false)
                    const birthday = await Birthday.findOne({ userid: userData.userid })
                    let bday
                    if (birthday) bday = `${birthday.day}.${birthday.month}.${birthday.year}`
                    else bday = `Нет данных.`
                    const msg = await thread.messages.fetch(userData.pers_info.main_msg)
                    const embed = new EmbedBuilder()
                        .setTitle(`ЛИЧНОЕ ДЕЛО УЧАСТНИКА ${userData.nickname} (${member.user.username})`)
                        .setColor(Number(linksInfo.bot_color))
                        .setAuthor({ name: `Причина: Создание профиля` })
                        .setTimestamp(Date.now())
                        .setFooter({ text: `Личное дело пользователя ${userData.nickname}. Доступно для чтения. Последнее изменение:` })
                        .setDescription(`## ЛИЧНОЕ ДЕЛО №${userData.pers_info.numb} (${userData.nickname})
                
Реальное имя - \`${userData.displayname.name}\`
Игровой никнейм - \`${userData.nickname}\`
UUID Minecraft - \`${userData.uuid}\`
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
            var path = require('path');
            var scriptName = path.basename(__filename);
            await admin.send(`Произошла ошибка!`)
            await admin.send(`=> ${e}.
**Файл**: ${scriptName}`)
            await admin.send(`◾`)
        }
    }
}
