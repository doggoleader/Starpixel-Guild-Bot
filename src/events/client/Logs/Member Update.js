const { User } = require(`../../../../src/schemas/userdata`)
const { Guild } = require(`../../../../src/schemas/guilddata`)
const { ChannelType, EmbedBuilder, WebhookClient, AuditLogEvent } = require(`discord.js`)
const ch_list = require(`../../../../src/discord structure/channels.json`)
const chalk = require(`chalk`);
const prettyMilliseconds = require(`pretty-ms`) //ДОБАВИТЬ В ДРУГИЕ
const linksInfo = require(`../../../discord structure/links.json`)
const { checkPlugin } = require("../../../functions");

module.exports = {
    name: 'guildMemberUpdate',
    plugin: {
        id: "logs",
        name: "Журнал аудита"
    },
    async execute(oldM, newM) {
        const client = oldM.client || newM.client
        const guild = oldM.guild || newM.guild
        if (!await checkPlugin(guild.id, this.plugin.id)) return
        const log_data = await Guild.findOne({ id: guild.id })
        const channel = await guild.channels.cache.get(ch_list.log)
        const webhookF = await channel.fetchWebhooks().then(hooks => hooks.find(webhook => webhook.name == `Starpixel Logs`))
        let webhook
        if (!webhookF) {
            await channel.createWebhook({
                name: `Starpixel Logs`,
                avatar: guild.iconURL(),
                reason: `Не было вебхука для использования логов!`
            }).then(hook => {
                log_data.logs.webhook_id = hook.id
                log_data.logs.webhook_token = hook.token
                log_data.logs.webhook_url = hook.url
                log_data.save()
            })
            webhook = new WebhookClient({ id: log_data.logs.webhook_id, token: log_data.logs.webhook_token })
        } else if (webhookF) {
            webhook = new WebhookClient({ id: log_data.logs.webhook_id, token: log_data.logs.webhook_token })
        }

        const fetchedLogs = await newM.guild.fetchAuditLogs({
            limit: 1,
        });
        const auditLog = fetchedLogs.entries.first();
        switch (auditLog.action) {
            case 25: {
                if (auditLog.changes[0].key == `$remove`) {
                    const log = new EmbedBuilder()
                        .setTitle(`Убрана роль у пользователя`)
                        .setDescription(`Пользователь: ${newM}
Убранная роль: ❌ \`${auditLog.changes[0].new[0].name}\`

Убрал роль: ${auditLog.executor}`)
                        .setColor(Number(linksInfo.bot_color))
                        .setTimestamp(Date.now())
                        .setThumbnail(newM.user.displayAvatarURL())

                    webhook.send({
                        embeds: [log]
                    })
                } else if (auditLog.changes[0].key == `$add`) {
                    const log = new EmbedBuilder()
                        .setTitle(`Добавлена роль пользователю`)
                        .setDescription(`Пользователь: ${newM}
Добавленная роль: ✅ \`${auditLog.changes[0].new[0].name}\`

Добавил роль: ${auditLog.executor}`)
                        .setColor(Number(linksInfo.bot_color))
                        .setTimestamp(Date.now())
                        .setThumbnail(newM.user.displayAvatarURL())

                    webhook.send({
                        embeds: [log]
                    })
                }
            }

                break;
            case 24: {
                if (auditLog.changes[0].key == `nick`) {
                    const log = new EmbedBuilder()
                        .setTitle(`Изменён никнейм пользователя`)
                        .setDescription(`Пользователь: ${newM}
Старый никнейм: \`${auditLog.changes[0].old}\`
Новый никнейм: \`${auditLog.changes[0].new}\`

Изменил никнейм: ${auditLog.executor}`)
                        .setColor(Number(linksInfo.bot_color))
                        .setTimestamp(Date.now())
                        .setThumbnail(newM.user.displayAvatarURL())

                    webhook.send({
                        embeds: [log]
                    })
                }
            }

                break;
            default:
                break;
        }
    }
}