const { User } = require(`../../../schemas/userdata`)
const { Guild } = require(`../../../schemas/guilddata`)
const { ChannelType } = require(`discord.js`)
const chalk = require(`chalk`);
const prettyMilliseconds = require(`pretty-ms`) //ДОБАВИТЬ В ДРУГИЕ
const { Apply } = require(`../../../schemas/applications`)
const { checkPlugin } = require("../../../functions");
let plugin = {
    id: "new_users",
    name: "Новые пользователи"
}
async function execute(oldMember, newMember, client) {
    try {
        if (!await checkPlugin(newMember.guild.id, plugin.id)) return
        if (oldMember.pending === true && newMember.pending === false) {
            const guild = newMember.guild
            const channel = guild.channels.cache.get(`849608079691350078`)
            const appData = await Apply.findOne({ userid: newMember.user.id, guildid: newMember.guild.id }) || new Apply({ userid: newMember.user.id, guildid: newMember.guild.id })
            appData.save()
            await channel.send({
                content: `${newMember} принял правила при входе на сервер!`
            })
        }
    } catch (e) {
        const admin = await client.users.fetch(`491343958660874242`)
        console.log(e)
        await admin.send({
            content: `-> \`\`\`${e.stack}\`\`\``
        }).catch()
    }
}

module.exports = {
    name: 'guildMemberUpdate',
    plugin: plugin,
    execute
}