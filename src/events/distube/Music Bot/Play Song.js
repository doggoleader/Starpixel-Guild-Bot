const chalk = require(`chalk`);
const wait = require("timers/promises").setTimeout;
const { Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require(`discord.js`)
const { Guild } = require(`../../../schemas/guilddata`);
const { Queue, Song } = require("distube");

/**
 * 
 * @param {Queue} queue Distube Queue
 * @param {Song} song Distube Song
 * @param {import("../../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
 */
async function execute(queue, song, client) {
    try {
        const guild = queue.textChannel.guild
        const guildData = await Guild.findOne({ id: guild.id })
        if (guildData.guildgames.started >= 1) return
        await regularUse(queue, song, client)

    } catch (e) {
        const admin = await client.users.fetch(`491343958660874242`)
        console.log(e)
        await admin.send({
            content: `-> \`\`\`${e.stack}\`\`\``
        }).catch()
    }

}

/**
 * 
 * @param {Queue} queue Distube Queue
 * @param {Song} song Distube Song
 * @param {import("../../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
 */
async function regularUse(queue, song, client) {
    try {
        const guild = queue.textChannel.guild
        const musicSession = client.musicSession.find(s => s.guildId == guild.id);
        const ch = await guild.channels.fetch(musicSession.textChannelId);
        const msg = await ch.messages.fetch(musicSession.messageId);

        const playing = new EmbedBuilder()
            .setColor(Number(client.information.bot_color))
            .setTitle(`Сейчас играет... 🎶`)
            .setTimestamp(Date.now())
            .setDescription(`**Название**: \`${song.name}\`
**Запросил**: ${song.user}
**Длительность**: \`${song.formattedDuration}\`

[Нажмите здесь, чтобы получить ссылку](${song.url})`)

        await msg.edit({
            embeds: [playing]
        })
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    name: 'playSong',
    execute
}