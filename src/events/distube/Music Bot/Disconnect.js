const chalk = require(`chalk`);
const wait = require("timers/promises").setTimeout;
const { Collection, EmbedBuilder } = require(`discord.js`)
const linksInfo = require(`../../../discord structure/links.json`)
const { Guild } = require(`../../../schemas/guilddata`)

module.exports = {
    name: 'disconnect',
    async execute(queue) {

        try {
            const guild = queue.textChannel.guild
            const guildData = await Guild.findOne({ id: guild.id })
            if (guildData.guildgames.started >= 1) return
            const playing = new EmbedBuilder()
                .setColor(Number(linksInfo.bot_color))
                .setTitle(`Я отключился 👋`)
                .setTimestamp(Date.now())
                .setDescription(`Я покинул голосовой канал. Чтобы включить музыку, используйте команду \`/music play\``)
            await queue.textChannel.send({
                embeds: [playing]
            })
        } catch (e) {

        }
    }
}