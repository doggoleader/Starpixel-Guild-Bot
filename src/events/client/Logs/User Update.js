const { User } = require(`../../../../src/schemas/userdata`)
const { Guild } = require(`../../../../src/schemas/guilddata`)
const { ChannelType, EmbedBuilder, WebhookClient, AuditLogEvent } = require(`discord.js`)
const ch_list = require(`../../../../src/discord structure/channels.json`)
const chalk = require(`chalk`);
const prettyMilliseconds = require(`pretty-ms`) //ДОБАВИТЬ В ДРУГИЕ
const linksInfo = require(`../../../discord structure/links.json`)
const { checkPlugin } = require("../../../functions");
let plugin = {
    id: "logs",
    name: "Журнал аудита"
}
async function execute(oldM, newM) {
    if (oldM.partial) {
        try {
            await oldM.fetch();
        } catch (error) {
            console.error('Произошла ошибка при обработке участника', error);
            return;
        }
    }
    const client = oldM.client || newM.client
    const guild = oldM.guild || newM.guild
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

    let avatar
    let username
    let discriminator
    let banner
    let changes = []

    if (oldM.avatar !== newM.avatar) {
        avatar = `📷 **Аватарка**: [[Аватарка]](${newM.avatarURL()})`
        changes.push(avatar)
    }

    if (oldM.banner !== newM.banner) {
        banner = `🌃 **Баннер**: [[Баннер]](${newM.bannerURL()})`
        changes.push(banner)
    }

    if (oldM.username !== newM.username) {
        username = `📃 **Имя пользователя**: До \`${oldM.username}\` ➡ После \`${newM.username}\``
        changes.push(username)
    }

    if (oldM.discriminator !== newM.discriminator) {
        discriminator = `🔢 **Дискриминатор**: До \`#${oldM.discriminator}\` ➡ После \`#${newM.discriminator}\``
        changes.push(discriminator)
    }
    const log = new EmbedBuilder()
        .setTitle(`Обновлены данные пользователя`)
        .setDescription(`Пользователь: ${newM}
**Изменения**
${changes.join(`\n`)}`)
        .setColor(Number(linksInfo.bot_color))
        .setTimestamp(Date.now())
        .setThumbnail(newM.displayAvatarURL())

    webhook.send({
        embeds: [log]
    })

}

module.exports = {
    name: 'userUpdate',
    plugin: plugin,
    execute
}