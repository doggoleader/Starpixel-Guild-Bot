const chalk = require(`chalk`);
const { User } = require(`../../../schemas/userdata`)
const { ReactionCollector, ChannelType, CategoryChannelChildManager, Collection, PermissionsBitField } = require("discord.js");
const { Guild } = require(`../../../schemas/guilddata`)
const ch_list = require(`../../../discord structure/channels.json`)
const { checkPlugin } = require("../../../functions");
let plugin = {
    id: "guildgames",
    name: "Совместные игры"
}
async function execute(oldState, newState, client) {
    try {
        const guild = oldState.guild || newState.guild
        if (!await checkPlugin(guild.id, plugin.id)) return
        const guildData = await Guild.findOne({ id: guild.id })
        if (guildData.guildgames.status !== `ongoing`) return
        if (oldState.mute === newState.mute) return
        if (!newState?.channelId) return
        const newChannel = newState?.channelId
        if (newChannel !== ch_list.guildGamesVoice) return
        if (guildData.guildgames.started < 0) return
        await newState.setMute(false)
    } catch (e) {
        const admin = await client.users.fetch(`491343958660874242`)
        console.log(e)
        await admin.send({
            content: `-> \`\`\`${e.stack}\`\`\``
        }).catch()
    }
}

module.exports = {
    name: 'voiceStateUpdate',
    plugin: plugin,
    execute
}