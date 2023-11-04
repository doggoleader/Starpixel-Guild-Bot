const chalk = require(`chalk`);
const wait = require("timers/promises").setTimeout;
const { Collection, EmbedBuilder } = require(`discord.js`)
const { Guild } = require(`../../../schemas/guilddata`)
const linksInfo = require(`../../../discord structure/links.json`)

module.exports = {
    name: 'empty',
    async execute(queue) {


        try {
            const guild = queue.textChannel.guild
            const guildData = await Guild.findOne({ id: guild.id })
            if (guildData.guildgames.started >= 1) return
            const playing = new EmbedBuilder()
                .setColor(Number(linksInfo.bot_color))
                .setTitle(`Не осталось пользователей`)
                .setTimestamp(Date.now())
                .setDescription(`В канале ${queue.voiceChannel} не осталось пользователей, поэтому я должен был покинуть этот канал!`)
            await queue.textChannel.send({
                embeds: [playing]
            })
        } catch (e) {

        }
    }
}