const chalk = require(`chalk`);
const wait = require("timers/promises").setTimeout;
const { Collection, EmbedBuilder } = require(`discord.js`)
const linksInfo = require(`../../../../discord structure/links.json`)

module.exports = {
    name: 'message',
    async execute(jsonMsg, position, sender, verified, client) {

        const guild = await client.guilds.fetch(`320193302844669959`)
        const guildChat = await guild.channels.fetch(`1052865050597150731`)
        const offChat = await guild.channels.fetch(`1052865547563442207`)

        const MsgArray = await client.BotOnHypixelServer(jsonMsg)
        const text = MsgArray.join(``)
        if (text.startsWith(`Guild >`)) {
            await guildChat.send(`**[БОТ HYPIXEL]:** \`\`\`${text}\`\`\``)
        } else if (text.startsWith(`Officer`)) {
            await offChat.send(`**[БОТ HYPIXEL]:** \`\`\`${text}\`\`\``)
        }
    }
}