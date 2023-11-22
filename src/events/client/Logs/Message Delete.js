const { User } = require(`../../../../src/schemas/userdata`)
const { Guild } = require(`../../../../src/schemas/guilddata`)
const { ChannelType, AuditLogEvent, WebhookClient, EmbedBuilder } = require(`discord.js`)
const ch_list = require(`../../../../src/discord structure/channels.json`)
const chalk = require(`chalk`);
const prettyMilliseconds = require(`pretty-ms`) //ДОБАВИТЬ В ДРУГИЕ
const linksInfo = require(`../../../discord structure/links.json`)
const { checkPlugin } = require("../../../functions");
let plugin = {
    id: "logs",
    name: "Журнал аудита"
}
async function execute(message) {
    if (message.channel.type == ChannelType.DM) return
    const guild = message.guild;
    if (!await checkPlugin(guild.id, plugin.id)) return
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


    const fetchedLogs = await message.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MessageDelete,
    });

    const auditLog = fetchedLogs.entries.first();
    if (auditLog.createdTimestamp > Date.now() - 2000) {
        let executor
        if (!auditLog) {
            executor = `Пользователь не найден`
        } else if (auditLog) {
            executor = auditLog.executor
        }

        if (message.content) {
            if (message.author.bot) return
            const created = Math.round(message.createdTimestamp / 1000)
            const log = new EmbedBuilder()
                .setTitle(`Удалено сообщение`)
                .setDescription(`Автор: ${message.author}
Дата отправки сообщения: <t:${created}:f>
Канал: ${message.channel}
Содержимое: \`${message.content}\`

Удалено пользователем: ${executor}`)
                .setColor(Number(linksInfo.bot_color))
                .setTimestamp(Date.now())
                .setThumbnail(message.author.displayAvatarURL())

            webhook.send({
                embeds: [log]
            })
        } else if (!message.content) {
            const created = Math.round(message.createdTimestamp / 1000)
            const log = new EmbedBuilder()
                .setTitle(`Удалено сообщение`)
                .setDescription(`Автор: \`Неизвестно\`
Дата отправки сообщения: <t:${created}:f>
Канал: ${message.channel}
Содержимое: \`Неизвестно\`

Удалено пользователем: ${executor}`)
                .setColor(Number(linksInfo.bot_color))
                .setTimestamp(Date.now())

            webhook.send({
                embeds: [log]
            })
        }
    } else {
        if (message.content) {
            if (message.author.bot) return
            const created = Math.round(message.createdTimestamp / 1000)
            const log = new EmbedBuilder()
                .setTitle(`Удалено сообщение`)
                .setDescription(`Автор: ${message.author}
Дата отправки сообщения: <t:${created}:f>
Канал: ${message.channel}
Содержимое: \`${message.content}\`

Удалено пользователем: \`Неизвестно\``)
                .setColor(Number(linksInfo.bot_color))
                .setTimestamp(Date.now())
                .setThumbnail(message.author.displayAvatarURL())

            webhook.send({
                embeds: [log]
            })
        } else if (!message.content) {
            const created = Math.round(message.createdTimestamp / 1000)
            const log = new EmbedBuilder()
                .setTitle(`Удалено сообщение`)
                .setDescription(`Автор: \`Неизвестно\`
Дата отправки сообщения: <t:${created}:f>
Канал: ${message.channel}
Содержимое: \`Неизвестно\`

Удалено пользователем: \`Неизвестно\``)
                .setColor(Number(linksInfo.bot_color))
                .setTimestamp(Date.now())

            webhook.send({
                embeds: [log]
            })
        }
    }
}

module.exports = {
    name: 'messageDelete',
    plugin: plugin,
    execute
}