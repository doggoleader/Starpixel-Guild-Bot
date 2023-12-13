const { User } = require(`../../../../src/schemas/userdata`)
const { Guild } = require(`../../../../src/schemas/guilddata`)
const { ChannelType, EmbedBuilder, WebhookClient, AuditLogEvent, AuditLogOptionsType } = require(`discord.js`)
const ch_list = require(`../../../../src/discord structure/channels.json`)
const chalk = require(`chalk`); //ДОБАВИТЬ В ДРУГИЕ
const { checkPlugin } = require("../../../functions");
let plugin = {
    id: "logs",
    name: "Журнал аудита"
}
async function execute(channel, time, client) {
    try {
        if (channel.partial) {
            try {
                await channel.fetch();
            } catch (error) {
                console.error('Произошла ошибка при обработке канала', error);

                return;
            }
        }
        const guild = channel.guild
        if (!await checkPlugin(guild.id, plugin.id)) return
        const log_data = await Guild.findOne({ id: guild.id })
        const log_channel = await guild.channels.cache.get(ch_list.log)
        const webhookF = await log_channel.fetchWebhooks().then(hooks => hooks.find(webhook => webhook.name == `Starpixel Logs`))
        let webhook
        if (!webhookF) {
            await log_channel.createWebhook({
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

        const fetchedLogs = await channel.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MessagePin
        });
        const auditLog = fetchedLogs.entries.first();
        const message = await channel.messages.fetch(auditLog.extra.messageId)
        let log
        if (auditLog.actionType == `Create`) {
            log = new EmbedBuilder()
                .setTitle(`Закреплено сообщение`)
                .setDescription(`Категория: \`${channel.parent.name}\`
Канал: ${channel}
Содержимое: \`${message.content}\`
Автор: ${message.content}

Модератор: ${auditLog.executor}`)
                .setColor(Number(client.information.bot_color))
                .setTimestamp(Date.now())
                .setThumbnail(channel.guild.iconURL())

        } else if (auditLog.actionType == `Delete`) {
            log = new EmbedBuilder()
                .setTitle(`Откреплено сообщение`)
                .setDescription(`Категория: \`${channel.parent.name}\`
Канал: ${channel}
Содержимое: \`${message.content}\`
Автор: ${message.content}

Модератор: ${auditLog.executor}`)
                .setColor(Number(client.information.bot_color))
                .setTimestamp(Date.now())
                .setThumbnail(channel.guild.iconURL())
        }

        webhook.send({
            embeds: [log]
        })
    } catch (e) {
        const admin = await client.users.fetch(`491343958660874242`)
        console.log(e)
        await admin.send({
            content: `-> \`\`\`${e.stack}\`\`\``
        }).catch()
    }

}

module.exports = {
    name: 'channelPinsUpdate',
    plugin: plugin,
    execute
}