const chalk = require(`chalk`);
const wait = require("timers/promises").setTimeout;
const { Collection, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require(`discord.js`)
const { Guild } = require(`../../../schemas/guilddata`)
const linksInfo = require(`../../../discord structure/links.json`)
async function execute(queue, song) {
    try {
        const guild = queue.textChannel.guild
        const guildData = await Guild.findOne({ id: guild.id })
        if (guildData.guildgames.started >= 1) return
        const playing = new EmbedBuilder()
            .setColor(Number(linksInfo.bot_color))
            .setTitle(`Сейчас играет... 🎶`)
            .setTimestamp(Date.now())
            .setDescription(`**Название**: \`${song.name}\`
**Запросил**: ${song.user}
**Длительность**: \`${song.formattedDuration}\`

**Лайков**: ${song.likes}👍
**Дизлайков**: ${song.dislikes}👎

[Нажмите здесь, чтобы получить ссылку](${song.url})`)
        const prevnext = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`prevsong`)
                    .setLabel(`Предыдущая песня`)
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji(`⏮`)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`nextsong`)
                    .setLabel(`Следующая песня`)
                    .setStyle(ButtonStyle.Success)
                    .setEmoji(`⏭`)
            )

        const msg = await queue.textChannel.send({
            embeds: [playing],
            components: [prevnext],
            fetchReply: true
        })
        const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: song.duration * 1000 })
        let songR = song
        collector.on('collect', async (i) => {
            await i.deferReply({
                fetchReply: true
            })
            if (i.customId == `prevsong`) {
                try {
                    songR = await queue.previous()
                    const result = new EmbedBuilder()
                        .setTitle(`Переключено на предыдущую песню... ✅`)
                        .setColor(Number(linksInfo.bot_color))
                        .setTimestamp(Date.now())
                        .setDescription(`Вы снова включили \`${songR.name}\`!`)

                    await i.editReply({
                        embeds: [result]
                    })
                } catch (e) {
                    await i.editReply({
                        content: `Вы уже включили самую первую песню в очереди!`
                    })
                    console.log(chalk.blackBright(`[${new Date()}]`) + e)
                }

                collector.stop()
            } else if (i.customId == `nextsong`) {
                try {
                    const result = new EmbedBuilder()
                        .setTitle(`Песня пропущена... ✅`)
                        .setColor(Number(linksInfo.bot_color))
                        .setTimestamp(Date.now())
                        .setDescription(`Текущая песня \`${queue.songs[0].name}\` была пропущена!`)
                    songR = await queue.skip()

                    await i.editReply({
                        embeds: [result]
                    })
                } catch (e) {
                    await i.editReply({
                        content: `В очереди больше нет песен для пропуска!`
                    })
                    console.log(chalk.blackBright(`[${new Date()}]`) + e)
                }
                collector.stop()
            }
        })
        collector.on('end', async (collected) => {
            prevnext.components[0].setDisabled(true)
            prevnext.components[1].setDisabled(true)
            playing.setDescription(`**Название**: \`${songR.name}\`
**Запросил**: ${songR.user}
**Длительность**: \`${queue.formattedCurrentTime}\`/\`${songR.formattedDuration}\`

**Лайков**: ${songR.likes}👍
**Дизлайков**: ${songR.dislikes}👎

[Нажмите здесь, чтобы получить ссылку](${songR.url})`)
            await msg.edit({
                embeds: [playing],
                components: [prevnext]
            })
        })
    } catch (e) {
        console.log(e)
    }

}

module.exports = {
    name: 'playSong',
    execute
}