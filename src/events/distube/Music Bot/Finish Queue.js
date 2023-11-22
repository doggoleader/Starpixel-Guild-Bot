const chalk = require(`chalk`);
const wait = require("timers/promises").setTimeout;
const { Collection, EmbedBuilder } = require(`discord.js`)
const { Guild } = require(`../../../schemas/guilddata`)
const linksInfo = require(`../../../discord structure/links.json`)
async function execute(queue) {

    try {
        const guild = queue.textChannel.guild
        const guildData = await Guild.findOne({ id: guild.id })
        if (guildData.guildgames.started >= 1) return
        const playing = new EmbedBuilder()
            .setColor(Number(linksInfo.bot_color))
            .setTitle(`❌ Закончились песни`)
            .setTimestamp(Date.now())
            .setDescription(`В очереди закончились песни! Чтобы добавить ещё, используйте команду \`/music play\`!`)
        await queue.textChannel.send({
            embeds: [playing]
        })
    } catch (e) {

    }
}

module.exports = {
    name: 'finish',
    execute
}