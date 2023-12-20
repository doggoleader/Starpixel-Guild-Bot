const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder, WebhookClient, PermissionsBitField, PermissionFlagsBits, ComponentType } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const fetch = require(`node-fetch`);
const { User } = require(`../../../schemas/userdata`)
const { Guild } = require(`../../../schemas/guilddata`)
const chalk = require(`chalk`);
const ch_list = require(`../../../discord structure/channels.json`)
const { gameConstructor, calcActLevel, getLevel, isURL, secondPage, mentionCommand } = require(`../../../functions`);
const { SearchResultType, DisTubeVoice, Song, Playlist } = require('distube');

/**
 * 
 * @param {import("discord.js").ModalSubmitInteraction} interaction Interaction
 * @param {import("../../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        const musicString = interaction.fields.getTextInputValue('music_musicname')
        const url = isURL(musicString)
        if (url === true) {
            let received
            received = new EmbedBuilder()
                .setTitle(`Запрос получен...`)
                .setColor(Number(client.information.bot_color))
                .setDescription(`🔍 Загружаем ваш запрос: \`${musicString}\`...`)
                .setTimestamp(Date.now())


            await interaction.reply({
                embeds: [received],
                fetchReply: true,
                ephemeral: true
            })
            const vc = await interaction.guild.channels.fetch(interaction.member.voice.channel.id)
            const connection = await client.distube.voices.join(vc).then(async (connection) => {
                await connection.setSelfDeaf(false)
                await connection.setSelfMute(false)
            })

            await client.distube.play(vc, musicString, {
                member: interaction.member,
                textChannel: interaction.channel
            }).then(async () => {
                const queue = await client.distube.getQueue(interaction.guild);
                const song = queue.songs.find(s => s.url == musicString)
                const err = new EmbedBuilder()
                    .setColor(Number(client.information.bot_color))
                    .setTitle(`Произошла ошибка... ❌`)
                    .setTimestamp(Date.now())
                    .setDescription(`Произошла ошибка при добавлении данной песни в очередь!`)

                if (!song) return interaction.editReply({
                    embeds: [err]
                })
                received = new EmbedBuilder()
                    .setColor(Number(client.information.bot_color))
                    .setTitle(`Добавлена песня... 🎶`)
                    .setTimestamp(Date.now())
                    .setDescription(`**Название**: \`${song.name}\`
**Запросил**: ${song.user}
**Длительность**: \`${song.formattedDuration}\`

[Нажмите здесь, чтобы открыть видео](${song.url})`)
                await interaction.editReply({
                    embeds: [received]
                })
            })

        } else if (url === false) {

            const searchR = await client.distube.search(musicString, {
                limit: 5,
                type: SearchResultType.VIDEO
            })
            let i = 1
            const search = searchR.map(result => {
                return `**${i++}.** ${result.name} - ${result.formattedDuration} \`(${result.views} просмотров)\``

            })

            const results = new EmbedBuilder()
                .setTitle(`🔍 Результаты поиска...`)
                .setColor(Number(client.information.bot_color))
                .setDescription(`${search.join(`\n`)}`)
                .setTimestamp(Date.now())

            const choices = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`song1`)
                        .setEmoji(`1️⃣`)
                        .setLabel(`Песня 1`)
                        .setStyle(ButtonStyle.Primary)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`song2`)
                        .setEmoji(`2️⃣`)
                        .setLabel(`Песня 2`)
                        .setStyle(ButtonStyle.Primary)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`song3`)
                        .setEmoji(`3️⃣`)
                        .setLabel(`Песня 3`)
                        .setStyle(ButtonStyle.Primary)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`song4`)
                        .setEmoji(`4️⃣`)
                        .setLabel(`Песня 4`)
                        .setStyle(ButtonStyle.Primary)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`song5`)
                        .setEmoji(`5️⃣`)
                        .setLabel(`Песня 5`)
                        .setStyle(ButtonStyle.Primary)
                )


            const msg = await interaction.reply({
                embeds: [results],
                components: [choices],
                fetchReply: true,
                ephemeral: true
            })
            const collector = await msg.createMessageComponentCollector()
            collector.on('collect', async (i) => {
                try {
                    let playSong
                    if (i.customId == `song1`) {
                        playSong = searchR[0]
                    } else if (i.customId == `song2`) {
                        playSong = searchR[1]
                    } else if (i.customId == `song3`) {
                        playSong = searchR[2]
                    } else if (i.customId == `song4`) {
                        playSong = searchR[3]
                    } else if (i.customId == `song5`) {
                        playSong = searchR[4]
                    }
                    const vc = await i.guild.channels.fetch(i.member.voice.channel.id)
                    const connection = await client.distube.voices.join(vc)
                    await connection.setSelfDeaf(false)
                    await connection.setSelfMute(false)

                    let received = new EmbedBuilder()
                        .setTitle(`Запрос получен...`)
                        .setColor(Number(client.information.bot_color))
                        .setDescription(`🔍 Загружаем песню \`${playSong.url}\`...`)
                        .setTimestamp(Date.now())

                    const msg3 = await i.reply({
                        embeds: [received],
                        ephemeral: true,
                        fetchReply: true
                    })

                    await client.distube.play(vc, playSong.url, {
                        member: interaction.member,
                        textChannel: i.channel
                    }).then(async () => {
                        const queue = await client.distube.getQueue(i.guild);
                        const song = queue.songs.find(s => s.url == playSong.url)
                        const err = new EmbedBuilder()
                            .setColor(Number(client.information.bot_color))
                            .setTitle(`Произошла ошибка... ❌`)
                            .setTimestamp(Date.now())
                            .setDescription(`Произошла ошибка при добавлении данной песни в очередь!`)

                        if (!song) return i.editReply({
                            embeds: [err]
                        })
                        received = new EmbedBuilder()
                            .setColor(Number(client.information.bot_color))
                            .setTitle(`Добавлена песня... 🎶`)
                            .setTimestamp(Date.now())
                            .setDescription(`**Название**: \`${song.name}\`
**Запросил**: ${song.user}
**Длительность**: \`${song.formattedDuration}\`

[Нажмите здесь, чтобы открыть видео](${song.url})`)
                        await i.editReply({
                            embeds: [received]
                        })
                    })


                    await collector.stop()
                } catch (e) {
                    console.log(e)
                    const error = new EmbedBuilder()
                        .setTitle(`🔍 Результаты поиска...`)
                        .setColor(Number(client.information.bot_color))
                        .setDescription(`Во время установки песни произошла непредвиденная ошибка! Повторите попытку позже!`)
                        .setTimestamp(Date.now())
                    await interaction.editReply({
                        embeds: [error],
                        components: []
                    })
                    await collector.stop()
                }

            })

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
    plugin: {
        id: "music",
        name: "Музыка"
    },
    data: {
        name: "music_addsong"
    },
    execute
}
