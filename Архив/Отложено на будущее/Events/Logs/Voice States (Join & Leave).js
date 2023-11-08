const { User } = require(`../../../../src/schemas/userdata`)
const { Guild } = require(`../../../../src/schemas/guilddata`)
const { ChannelType, EmbedBuilder, WebhookClient, AuditLogEvent } = require(`discord.js`)
const ch_list = require(`../../../../src/discord structure/channels.json`)
const chalk = require(`chalk`);
const prettyMilliseconds = require(`pretty-ms`) //ДОБАВИТЬ В ДРУГИЕ
const linksInfo = require(`../../../../src/discord structure/links.json`)

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldM, newM) {
        const client = oldM.client || newM.client
        const guild = oldM.guild || newM.guild
        const pluginData = await Guild.findOne({ id: guild.id })
        if (pluginData.plugins.logs === false) return

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
        if (auditLog.createdTimestamp > Date.now() - 2000) {
            switch (auditLog.action) {
                case 26: {
                    let executor = auditLog.executor
                    const log = new EmbedBuilder()
                        .setTitle(`➡ Пользователь перемещён в другой канал`)
                        .setDescription(`Пользователь: ${newM.member}
Старый канал: \`${oldM?.channel?.name}\`
Новый канал: \`${newM?.channel?.name}\`

Переместил: ${executor}`)
                        .setColor(Number(linksInfo.bot_color))
                        .setTimestamp(Date.now())
                        .setThumbnail(newM.member.user.displayAvatarURL())

                    webhook.send({
                        embeds: [log]
                    })
                }
                    break;

                case 27: {
                    let executor = auditLog.executor
                    const log = new EmbedBuilder()
                        .setTitle(`❌ Пользователь был отключён`)
                        .setDescription(`Пользователь: ${newM.member}
Канал: \`${oldM?.channel?.name}\`

Отключил: ${executor}`)
                        .setColor(Number(linksInfo.bot_color))
                        .setTimestamp(Date.now())
                        .setThumbnail(newM.member.user.displayAvatarURL())

                    webhook.send({
                        embeds: [log]
                    })
                }
                    break;

                default:
                    break;
            }
        } else {
            if (!oldM?.channel && newM?.channel) {
                const log = new EmbedBuilder()
                    .setTitle(`✅ Пользователь подключился к голосовому каналу`)
                    .setDescription(`Пользователь: ${newM.member}
Канал: \`${newM?.channel?.name}\``)
                    .setColor(Number(linksInfo.bot_color))
                    .setTimestamp(Date.now())
                    .setThumbnail(newM.member.user.displayAvatarURL())

                webhook.send({
                    embeds: [log]
                })
            } else if (oldM?.channel && !newM?.channel) {
                const log = new EmbedBuilder()
                    .setTitle(`❌ Пользователь отключился от голосового канала`)
                    .setDescription(`Пользователь: ${newM.member}
Канал: \`${oldM?.channel?.name}\``)
                    .setColor(Number(linksInfo.bot_color))
                    .setTimestamp(Date.now())
                    .setThumbnail(newM.member.user.displayAvatarURL())

                webhook.send({
                    embeds: [log]
                })
            } else if (oldM?.channel !== newM?.channel) {
                const log = new EmbedBuilder()
                    .setTitle(`➡ Пользователь переместился в другой голосовой канал`)
                    .setDescription(`Пользователь: ${newM.member}
Старый канал: \`${oldM?.channel?.name}\`
Новый канал: \`${newM?.channel?.name}\``)
                    .setColor(Number(linksInfo.bot_color))
                    .setTimestamp(Date.now())
                    .setThumbnail(newM.member.user.displayAvatarURL())

                webhook.send({
                    embeds: [log]
                })
            }
        }

    }
}