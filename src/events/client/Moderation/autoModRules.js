const chalk = require(`chalk`);
const { User } = require(`../../../schemas/userdata`)
const { ReactionCollector, ChannelType, CategoryChannelChildManager, Collection, PermissionsBitField, AutoModerationRuleTriggerType, AutoModerationActionType } = require("discord.js");
const { Guild } = require(`../../../schemas/guilddata`)
const ch_list = require(`../../../discord structure/channels.json`)
const linksInfo = require(`../../../discord structure/links.json`)
const { checkPlugin } = require("../../../functions");

module.exports = {
    name: 'autoModerationActionExecution',
    plugin: {
        id: "admin",
        name: "Административное"
    },
    async execute(rule, client) {
        if (!await checkPlugin(rule.guild.id, this.plugin.id)) return
        if (rule.action.type == AutoModerationActionType.SendAlertMessage || rule.action.type == AutoModerationActionType.Timeout) return
        const member = await rule.guild.members.fetch(rule.userId)
        if (!member.roles.cache.has(`504887113649750016`)) return
        const userData = await User.findOne({ userid: rule.userId, guildid: rule.guild.id })
        const n1 = [`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`, `N`, `O`, `P`, `Q`, `R`, `S`, `T`, `U`, `V`, `W`, `X`, `Y`, `Z`, `0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`]
        let r1 = n1[Math.floor(Math.random() * n1.length)]
        let r2 = n1[Math.floor(Math.random() * n1.length)]
        let r3 = n1[Math.floor(Math.random() * n1.length)]
        let r4 = n1[Math.floor(Math.random() * n1.length)]
        let r5 = n1[Math.floor(Math.random() * n1.length)]
        let r6 = n1[Math.floor(Math.random() * n1.length)]
        let r7 = n1[Math.floor(Math.random() * n1.length)]
        const date = new Date()
        const warn_code = `${r1}${r2}${r3}${r4}${r5}${r6}${r7}-${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}_${date.getHours()}${date.getMinutes()}${date.getSeconds()}`

        let reason
        if (rule.ruleTriggerType == AutoModerationRuleTriggerType.Keyword) {
            reason = `Использование нецензурной лексики`
        } else if (rule.ruleTriggerType == AutoModerationRuleTriggerType.KeywordPreset) {
            reason = `Использование нецензурной лексики`
        } else if (rule.ruleTriggerType == AutoModerationRuleTriggerType.MentionSpam) {
            reason = `Массовое упоминание пользователей`
        } else if (rule.ruleTriggerType == AutoModerationRuleTriggerType.Spam) {
            reason = `Спам сообщениями`
        } else reason = `Неизвестная причина, свяжитесь с модератором!`

        userData.warn_info.push({
            user: rule.userId,
            moderator: client.user.id,
            reason: reason,
            date: date,
            warn_code: warn_code,
            message: {
                id: rule.messageId,
                content: rule.content,
            },
            automodInfo: {
                alertSystemMessageID: rule.alertSystemMessageId,
                channelId: rule.channelId,
                messageMatchedContent: rule.matchedContent,
                messageMatchedKeyword: rule.matchedKeyword,
                ruleId: rule.ruleId
            }
        })
        userData.save()
        client.Warnings()
        await member.send({
            content: `Вы не можете использовать \`${rule.matchedContent}\` (\`${rule.matchedKeyword}\`) в сообщении!`
        }).catch()
    }
}