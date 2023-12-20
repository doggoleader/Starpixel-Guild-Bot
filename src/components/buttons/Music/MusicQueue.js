const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, EmbedBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, } = require('discord.js');
const { Apply } = require(`../../../schemas/applications`)
const { User } = require(`../../../schemas/userdata`)
const chalk = require(`chalk`);
const { divideOnPages, secondPage } = require('../../../functions');
/**
 * 
 * @param {import("discord.js").ButtonInteraction} interaction Interaction
 * @param {import("../../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        let guildMusicSession = client.musicSession.find(m => m.guildId == interaction.guild.id);
        const no_queue = new EmbedBuilder()
            .setTitle(`❗ Нет песен в очереди!`)
            .setDescription(`В очереди нет песен! Используйте кнопку ниже, чтобы добавить песню в очередь!`)
            .setColor(`DarkRed`)
            .setTimestamp(Date.now())
            .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
        const queue = client.distube.getQueue(interaction.guild)
        if (!queue) return interaction.reply({
            embeds: [no_queue]
        })
        let n = 0
        let listS = queue.songs.map((song, id) => {
            if (queue.songs[0] == song) {
                return `▶ **${id + 1}**. [${song.name}](${song.url}) - \`${song.formattedDuration}\` ◀`
            } else {
                return `**${id + 1}**. [${song.name}](${song.url}) - \`${song.formattedDuration}\``
            }
        })
        
        let itemOnPage = 10;
        let curPage = 1

        let list = await divideOnPages(listS, itemOnPage, curPage)

        const totalPages = Math.ceil(queue.songs.length / itemOnPage)

        const queueList = new EmbedBuilder()
            .setTitle(`Очередь песен`)
            .setDescription(`${list.join(`\n`)}`)
            .setTimestamp(Date.now())
            .setColor(Number(client.information.bot_color))
            .setThumbnail(interaction.guild.iconURL())
            .setFooter({
                text: `Страница ${curPage}/${totalPages} | ${queue.songs.length} треков в очереди`
            })

        const pages = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`first`)
                    .setEmoji(`⏪`)
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(true)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`prev`)
                    .setEmoji(`⬅`)
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(true)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`stop`)
                    .setEmoji(`⏹`)
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(false)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`next`)
                    .setEmoji(`➡`)
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(secondPage(totalPages))
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`last`)
                    .setEmoji(`⏩`)
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(secondPage(totalPages))
            )

        let msg = await interaction.reply({
            embeds: [queueList],
            components: [pages],
            fetchReply: true,
            ephemeral: true
        })

        const collector = msg.createMessageComponentCollector()
        collector.on(`collect`, async (i) => {
            if (i.user.id === interaction.user.id) {
                if (i.customId == `first`) {
                    curPage = 1
                    list = await divideOnPages(listS, itemOnPage, curPage)
                    queueList.setDescription(`${list.join(`\n`)}`).setFooter({
                        text: `Страница ${curPage}/${totalPages} | ${queue.songs.length} треков в очереди`
                    })
                    pages.components[0].setDisabled(true)
                    pages.components[1].setDisabled(true)
                    pages.components[2].setDisabled(false)
                    pages.components[3].setDisabled(false)
                    pages.components[4].setDisabled(false)
                    await i.deferUpdate()
                    await interaction.editReply({
                        embeds: [queueList],
                        components: [pages],
                        fetchReply: true
                    })
                } else if (i.customId == `prev`) {
                    curPage -= 1
                    if (curPage <= 1) {
                        pages.components[0].setDisabled(true)
                        pages.components[1].setDisabled(true)
                    } else {
                        pages.components[0].setDisabled(false)
                        pages.components[1].setDisabled(false)
                    }
                    list = await divideOnPages(listS, itemOnPage, curPage)
                    queueList.setDescription(`${list.join(`\n`)}`).setFooter({
                        text: `Страница ${curPage}/${totalPages} | ${queue.songs.length} треков в очереди`
                    })
                    pages.components[2].setDisabled(false)
                    pages.components[3].setDisabled(false)
                    pages.components[4].setDisabled(false)
                    await i.deferUpdate()
                    await interaction.editReply({
                        embeds: [queueList],
                        components: [pages],
                        fetchReply: true
                    })
                } else if (i.customId == `stop`) {
                    i.deferUpdate()
                    collector.stop()
                } else if (i.customId == `next`) {
                    curPage += 1
                    if (n >= totalPages) {
                        pages.components[3].setDisabled(true)
                        pages.components[4].setDisabled(true)
                    } else {
                        pages.components[3].setDisabled(false)
                        pages.components[4].setDisabled(false)
                    }
                    list = await divideOnPages(listS, itemOnPage, curPage)
                    queueList.setDescription(`${list.join(`\n`)}`).setFooter({
                        text: `Страница ${curPage}/${totalPages} | ${queue.songs.length} треков в очереди`
                    })
                    pages.components[0].setDisabled(false)
                    pages.components[1].setDisabled(false)
                    pages.components[2].setDisabled(false)
                    await i.deferUpdate()
                    await interaction.editReply({
                        embeds: [queueList],
                        components: [pages],
                        fetchReply: true
                    })
                } else if (i.customId == `last`) {
                    curPage = totalPages
                    list = await divideOnPages(listS, itemOnPage, curPage)
                    queueList.setDescription(`${list.join(`\n`)}`).setFooter({
                        text: `Страница ${curPage}/${totalPages} | ${queue.songs.length} треков в очереди`
                    })
                    pages.components[0].setDisabled(false)
                    pages.components[1].setDisabled(false)
                    pages.components[2].setDisabled(false)
                    pages.components[3].setDisabled(true)
                    pages.components[4].setDisabled(true)
                    await i.deferUpdate()
                    await interaction.editReply({
                        embeds: [queueList],
                        components: [pages],
                        fetchReply: true
                    })
                }
            }
        })
        collector.on(`end`, async (collected) => {
            curPage = curPage
            list = await divideOnPages(listS, itemOnPage, curPage)
            queueList.setDescription(`${list.join(`\n`)}`).setFooter({
                text: `Страница ${curPage}/${totalPages} | ${queue.songs.length} треков в очереди`
            })
            pages.components[0].setDisabled(true)
            pages.components[1].setDisabled(true)
            pages.components[2].setDisabled(true)
            pages.components[3].setDisabled(true)
            pages.components[4].setDisabled(true)
            await interaction.editReply({
                embeds: [queueList],
                components: [pages]
            })
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
    plugin: {
        id: "music",
        name: "Музыка"
    },
    data: {
        name: "music_queue"
    },
    execute
}
