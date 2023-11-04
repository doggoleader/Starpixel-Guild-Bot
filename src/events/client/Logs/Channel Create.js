const { User } = require(`../../../../src/schemas/userdata`)
const { Guild } = require(`../../../../src/schemas/guilddata`)
const { ChannelType, EmbedBuilder, WebhookClient, AuditLogEvent } = require(`discord.js`)
const ch_list = require(`../../../../src/discord structure/channels.json`)
const chalk = require(`chalk`);
const prettyMilliseconds = require(`pretty-ms`) //ДОБАВИТЬ В ДРУГИЕ
const linksInfo = require(`../../../discord structure/links.json`)
const { checkPlugin } = require("../../../functions");

module.exports = {
    name: 'channelCreate',
    plugin: {
        id: "logs",
        name: "Журнал аудита"
    },
    async execute(channel) {
        const client = channel.client
        const guild = channel.guild
        if (!await checkPlugin(guild.id, this.plugin.id)) return
        if (channel.partial) {
            try {
                await channel.fetch();
            } catch (error) {
                console.error('Произошла ошибка при обработке канала', error);

                return;
            }
        }
        const log_data = await Guild.findOne({ id: guild.id })
        const log_channel = await guild.channels.fetch(ch_list.log)
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
            type: AuditLogEvent.ChannelCreate
        });
        const auditLog = fetchedLogs.entries.first();
        let log
        let type
        switch (channel.type) {
            case 0: type = `Текстовый канал`

                break;
            case 4: type = `Категория`

                break;
            case 5: type = `Канал с объявлениями`

                break;
            case 15: type = `Форум`

                break;
            case 13: type = `Трибуна`

                break;
            case 2: type = `Голосовой канал`

                break;
            default: type = `Неизвестно`
                break;
        }

        if (channel.type == ChannelType.GuildAnnouncement || channel.type == ChannelType.GuildText) {
            log = new EmbedBuilder()
                .setTitle(`Создан канал`)
                .setDescription(`Категория: \`${channel.parent.name}\`
Канал: ${channel}
Тип канала: ${type}
Тема канала: ${channel.topic || `Не указана`}

Модератор: ${auditLog.executor}`)
                .setColor(Number(linksInfo.bot_color))
                .setTimestamp(Date.now())
                .setThumbnail(channel.guild.iconURL())
        } else if (channel.type == ChannelType.GuildCategory) {
            log = new EmbedBuilder()
                .setTitle(`Создана категория`)
                .setDescription(`Категория: \`${channel.name}\`
Тип канала: ${type}

Модератор: ${auditLog.executor}`)
                .setColor(Number(linksInfo.bot_color))
                .setTimestamp(Date.now())
                .setThumbnail(channel.guild.iconURL())
        } else if (channel.type == ChannelType.GuildForum) {
            log = new EmbedBuilder()
                .setTitle(`Создан канал`)
                .setDescription(`Категория: \`${channel.parent.name}\`
Канал: ${channel}
Тип канала: ${type}

Модератор: ${auditLog.executor}`)
                .setColor(Number(linksInfo.bot_color))
                .setTimestamp(Date.now())
                .setThumbnail(channel.guild.iconURL())
        } else if (channel.type == ChannelType.GuildVoice || channel.type == ChannelType.GuildStageVoice) {
            log = new EmbedBuilder()
                .setTitle(`Создан канал`)
                .setDescription(`Категория: \`${channel.parent.name}\`
Канал: ${channel}
Тип канала: ${type}

Модератор: ${auditLog.executor}`)
                .setColor(Number(linksInfo.bot_color))
                .setTimestamp(Date.now())
                .setThumbnail(channel.guild.iconURL())
        }

        webhook.send({
            embeds: [log]
        })

    }
}