const chalk = require(`chalk`);
const wait = require("timers/promises").setTimeout;
const { Collection, EmbedBuilder } = require(`discord.js`)
const { Guild } = require(`../../../schemas/guilddata`)
const { Queue } = require("distube");
/**
 * 
 * @param {Queue} queue Distube Queue
 * @param {import("../../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
 */
async function execute(queue, client) {


    try {
        const guild = queue.textChannel.guild
        const guildData = await Guild.findOne({ id: guild.id })
        let guildMusicSession = client.musicSession.find(m => m.guildId == guild.id);
        if (guildData.guildgames.started >= 1) return

        const ch = await guild.channels.fetch(guildMusicSession.textChannelId);
        const msg = await ch.messages.fetch(guildMusicSession.messageId);

        const comps = msg.components;
        const playing = new EmbedBuilder()
            .setColor(Number(client.information.bot_color))
            .setTitle(`Не осталось пользователей`)
            .setTimestamp(Date.now())
            .setDescription(`В канале ${queue.voiceChannel} не осталось пользователей, поэтому я должен был покинуть этот канал!`)
        await msg.edit({
            embeds: [playing],
            components: comps
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
    name: 'empty',
    execute
}