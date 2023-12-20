const chalk = require(`chalk`);
const wait = require("timers/promises").setTimeout;
const { Collection, EmbedBuilder } = require(`discord.js`)
const { Guild } = require(`../../../schemas/guilddata`)
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
        if (guildData.guildgames.started >= 1) await guildGames(queue, client)
        else await regularUse(queue, client)

    } catch (e) {
        const admin = await client.users.fetch(`491343958660874242`)
        console.log(e)
        await admin.send({
            content: `-> \`\`\`${e.stack}\`\`\``
        }).catch()
    }
}

module.exports = {
    name: 'finish',
    execute
}

/**
 * 
 * @param {Queue} queue Distube Queue
 * @param {import("../../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
 */
async function guildGames(queue, client) {
    const guild = queue.textChannel.guild
    const guildData = await Guild.findOne({ id: guild.id })
    const mus = guildData.guildgames.music
    let total = 0;
    for (let i = 0; i < mus.length; i++) {
        const formula = Math.floor((1 / (mus.length * ((mus[i].usedTimes ** 2) + 1))) * 100)
        total += formula;
    }
    let r = Math.floor(Math.random() * total);
    let b = 0;
    for (let s = Math.floor((1 / (mus.length * ((mus[0].usedTimes ** 2) + 1))) * 100); s <= r; s += Math.floor((1 / (mus.length * ((mus[b].usedTimes ** 2) + 1))) * 100)) {
        b++;
    }
    const member = await guild.members.fetch(mus[b].sent)
    client.distube.play(queue.voiceChannel, mus[b].link, {
        member: member,
        textChannel: queue.textChannel
    })
    guildData.guildgames.music[b].usedTimes += 1
    guildData.save()
    const song = await client.distube.search(mus[b].link, {
        limit: 1,
        type: SearchResultType.VIDEO
    })
    const playing = new EmbedBuilder()
        .setColor(Number(client.information.bot_color))
        .setTitle(`Добавлена песня... 🎶`)
        .setTimestamp(Date.now())
        .setDescription(`**Название**: \`${song[0].name}\`
**Длительность**: \`${song[0].formattedDuration}\`
**Отправил**: <@${mus[b].sent}>

[Нажмите здесь, чтобы получить ссылку](${song[0].url})`)
    await queue.textChannel.send({
        embeds: [playing]
    })
}

/**
 * 
 * @param {Queue} queue Distube Queue
 * @param {import("../../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
 */
async function regularUse(queue, client) {
    const guild = queue.textChannel.guild
    let guildMusicSession = client.musicSession.find(m => m.guildId == guild.id);
    const ch = await guild.channels.fetch(guildMusicSession.textChannelId);
    const msg = await ch.messages.fetch(guildMusicSession.messageId);

    const comps = msg.components;

    const playing = new EmbedBuilder()
        .setColor(Number(client.information.bot_color))
        .setTitle(`❌ Закончились песни`)
        .setTimestamp(Date.now())
        .setDescription(`В очереди закончились песни! Чтобы добавить ещё, используйте кнопку ниже!`)
    await msg.edit({
        embeds: [playing],
        components: comps
    })
}