const { Guild } = require(`../../../schemas/guilddata`)
const chalk = require(`chalk`);
const wait = require("timers/promises").setTimeout;
const { Collection, EmbedBuilder } = require(`discord.js`);
const { SearchResultType } = require("distube");
async function execute(queue, client) {
    try {
        const guild = queue.textChannel.guild
        const guildData = await Guild.findOne({ id: guild.id })
        if (guildData.guildgames.started < 1) return
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