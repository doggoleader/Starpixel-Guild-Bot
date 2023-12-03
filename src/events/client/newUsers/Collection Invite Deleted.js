const { User } = require(`../../../schemas/userdata`)
const { Guild } = require(`../../../schemas/guilddata`)
const { ChannelType } = require(`discord.js`)
const chalk = require(`chalk`);
const prettyMilliseconds = require(`pretty-ms`)
const wait = require('node:timers/promises').setTimeout
const { checkPlugin } = require("../../../functions");
let plugin = {
    id: "new_users",
    name: "Новые пользователи"
}
async function execute(invite, client) {
    try {
        if (!await checkPlugin(invite.guild.id, plugin.id)) return
        const { invites } = client
        await invites.get(invite.guild.id).delete(invite.code);
        await checkIfExist(invite, client)
    } catch (e) {
        const admin = await client.users.fetch(`491343958660874242`)
        console.log(e)
        await admin.send({
            content: `-> \`\`\`${e.stack}\`\`\``
        }).catch()
    }
}

module.exports = {
    name: 'inviteDelete',
    plugin: plugin,
    execute
}

async function checkIfExist(invite, client) {
    await wait(5000)
    const guildData = await Guild.findOne({ id: invite.guild.id });
    if (guildData.invites.bypass_invite_codes.includes(invite.code)) {
        guildData.invites.bypass_invite_codes.splice(guildData.invites.bypass_invite_codes.findIndex(i => i == invite.code), 1);
        guildData.save()
    }
}