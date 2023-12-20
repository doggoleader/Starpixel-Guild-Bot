const chalk = require(`chalk`);
const wait = require("timers/promises").setTimeout;
const { Collection, EmbedBuilder } = require(`discord.js`)
const { Guild } = require(`../../../schemas/guilddata`);
const { mentionCommand } = require("../../../functions");
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
        for (let comp of comps) {
            for (let but of comp.components) {
                but.data.disabled = true
            }
        }


        const playing = new EmbedBuilder()
            .setColor(Number(client.information.bot_color))
            .setTitle(`Я отключился 👋`)
            .setTimestamp(Date.now())
            .setDescription(`Я покинул голосовой канал. Чтобы включить музыку, используйте команду ${mentionCommand(client, 'music')}`)
        await msg.edit({
            embeds: [playing],
            components: comps
        })
        guildMusicSession = {
            guildId: guild.id,
            voiceChannelId: null,
            textChannelId: null,
            messageId: null,
            enabled: false,
            volume: 50,
            queue: [],
            autoplay: false,
            paused: false,
            loopmode: 0,
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
    name: 'disconnect',
    execute
}