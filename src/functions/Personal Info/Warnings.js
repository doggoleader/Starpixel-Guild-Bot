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
    client.Warnings = async () => {
        try {
            const guild = await client.guilds.fetch("320193302844669959")
            if (!await checkPlugin("320193302844669959", plugin.id)) return;
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
                        .setColor(Number(linksInfo.bot_color))
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
            var path = require('path');
            var scriptName = path.basename(__filename);
            await admin.send(`Произошла ошибка!`)
            await admin.send(`=> ${e}.
**Файл**: ${scriptName}`)
            await admin.send(`◾`)
        }
    }
}
