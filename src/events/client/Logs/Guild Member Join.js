const { User } = require(`../../../schemas/userdata`)
const { Guild } = require(`../../../schemas/guilddata`)
const { ChannelType, AuditLogEvent, WebhookClient, EmbedBuilder } = require(`discord.js`)
const ch_list = require(`../../../discord structure/channels.json`)
const chalk = require(`chalk`); //ДОБАВИТЬ В ДРУГИЕ
const { checkPlugin } = require("../../../functions");
let plugin = {
    id: "logs",
    name: "Журнал аудита"
}
async function execute(member, client) {
    try {
        const guild = member.guild;
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

        const { invites } = client
        const newInvites = await guild.invites.fetch()
        const oldInvites = await invites.get(member.guild.id);
        const invite = await newInvites.find(i => i.uses > oldInvites.get(i.code));
        const inviter = invite?.inviter?.id ? await client.users.fetch(invite?.inviter?.id) : "Неизвестно"

        const created = Math.round(member.user.createdTimestamp / 1000)
        const joined = Math.round(member.joinedTimestamp / 1000)

        const log = new EmbedBuilder()
            .setTitle(`Участник присоединился к серверу`)
            .setDescription(`Пользователь: \`${member}\`
Дата создания аккаунта: <t:${created}:f>
Дата вступления: <t:${joined}:f>

Пригласил: ${inviter}`)
            .setColor(Number(client.information.bot_color))
            .setTimestamp(Date.now())
            .setThumbnail(member.user.displayAvatarURL())

        await webhook.send({
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
    name: 'guildMemberAdd',
    plugin: plugin,
    execute
}