const chalk = require(`chalk`);
const wait = require("timers/promises").setTimeout;
const { Collection, EmbedBuilder } = require(`discord.js`)
const { Guild } = require(`../../../schemas/guilddata`);
const { mentionCommand } = require("../../../functions");
async function execute(queue, client) {

    try {
        const guild = queue.textChannel.guild
        const guildData = await Guild.findOne({ id: guild.id })
        if (guildData.guildgames.started >= 1) return
        const playing = new EmbedBuilder()
            .setColor(Number(client.information.bot_color))
            .setTitle(`Я отключился 👋`)
            .setTimestamp(Date.now())
            .setDescription(`Я покинул голосовой канал. Чтобы включить музыку, используйте команду ${mentionCommand(client, 'music play')}`)
        await queue.textChannel.send({
            embeds: [playing]
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
    name: 'disconnect',
    execute
}