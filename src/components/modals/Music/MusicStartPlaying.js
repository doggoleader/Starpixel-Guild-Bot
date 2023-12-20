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
            await interaction.deferReply({ ephemeral: true, fetchReply: true })
            const vc = await interaction.guild.channels.fetch(interaction.member.voice.channel.id)
            const connection = await client.distube.voices.join(vc).then(async (connection) => {
                await connection.setSelfDeaf(false)
                await connection.setSelfMute(false)
            })


            const embed2 = new EmbedBuilder()
                .setColor(Number(client.information.bot_color))
                .setTitle(`🎶 Музыкальный бот`)
                .setDescription(`Идёт запуск музыки...`)

            let comps = getMusicKeyboard(client, i.guild.id)

            const msg2 = await i.channel.send({
                embeds: [embed2],
                components: comps
            })


            let guildMusicSession = client.musicSession.find(m => m.guildId == interaction.guild.id);

            guildMusicSession.textChannelId = interaction.channel.id;
            guildMusicSession.voiceChannelId = vc.id;
            guildMusicSession.messageId = msg2.id;
            guildMusicSession.enabled = true;

            await client.distube.play(vc, musicString, {
                member: interaction.member,
                textChannel: interaction.channel
            })

            await interaction.deleteReply()

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
                fetchReply: true
            })
            const collector = await msg.createMessageComponentCollector({ componentType: ComponentType.Button })
            collector.on('collect', async (i) => {
                try {
                    await i.deferUpdate();
                    let playSong
                    if (i.customId == `song1`) {
                        playSong = searchR[0].url
                    } else if (i.customId == `song2`) {
                        playSong = searchR[1].url
                    } else if (i.customId == `song3`) {
                        playSong = searchR[2].url
                    } else if (i.customId == `song4`) {
                        playSong = searchR[3].url
                    } else if (i.customId == `song5`) {
                        playSong = searchR[4].url
                    }
                    const vc = await i.guild.channels.fetch(i.member.voice.channel.id)
                    const connection = await client.distube.voices.join(vc)
                    await connection.setSelfDeaf(false)
                    await connection.setSelfMute(false)

                    const embed2 = new EmbedBuilder()
                        .setColor(Number(client.information.bot_color))
                        .setDescription(`## Музыкальный бот
                    
🔍 Загружаем песню \`${playSong}\`...`)

                    let comps = getMusicKeyboard(client, i.guild.id)

                    const msg2 = await i.channel.send({
                        embeds: [embed2],
                        components: comps
                    })


                    let guildMusicSession = client.musicSession.find(m => m.guildId == interaction.guild.id);

                    guildMusicSession.textChannelId = interaction.channel.id;
                    guildMusicSession.voiceChannelId = vc.id;
                    guildMusicSession.messageId = msg2.id;
                    guildMusicSession.enabled = true;

                    await client.distube.play(vc, playSong, {
                        member: interaction.member,
                        textChannel: interaction.channel
                    })
                    await interaction.deleteReply()
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
        name: "music_startmusic"
    },
    execute
}

/**
 * 
 * @param {import("../../../misc_functions/Exporter").StarpixelClient} client Client 
 * @param {String} guildId Guild ID
 */
function getMusicKeyboard(client, guildId) {
    let guildMusicSession = client.musicSession.find(m => m.guildId == guildId);

    const K1 = new ActionRowBuilder()
        .setComponents(
            new ButtonBuilder()
                .setCustomId(`music_first`)
                .setStyle(ButtonStyle.Primary)
                .setEmoji(`⏮`),
            new ButtonBuilder()
                .setCustomId(`music_previous`)
                .setStyle(ButtonStyle.Primary)
                .setEmoji(`⏪`),
            new ButtonBuilder()
                .setCustomId(`music_playpause`)
                .setStyle(ButtonStyle.Primary)
                .setEmoji(`⏸`),
            new ButtonBuilder()
                .setCustomId(`music_next`)
                .setStyle(ButtonStyle.Primary)
                .setEmoji(`⏩`),
            new ButtonBuilder()
                .setCustomId(`music_last`)
                .setStyle(ButtonStyle.Primary)
                .setEmoji(`⏭`)
        )

    const K2 = new ActionRowBuilder()
        .setComponents(
            new ButtonBuilder()
                .setCustomId(`music_minvolume`)
                .setStyle(ButtonStyle.Primary)
                .setEmoji(`🔈`),
            new ButtonBuilder()
                .setCustomId(`music_reducevolume`)
                .setStyle(ButtonStyle.Primary)
                .setEmoji(`➖`),
            new ButtonBuilder()
                .setCustomId(`music_currentvolume`)
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true)
                .setEmoji(`🔉`)
                .setLabel(`${guildMusicSession.volume}`),
            new ButtonBuilder()
                .setCustomId(`music_increasevolume`)
                .setStyle(ButtonStyle.Primary)
                .setEmoji(`➕`),
            new ButtonBuilder()
                .setCustomId(`music_maxvolume`)
                .setStyle(ButtonStyle.Primary)
                .setEmoji(`🔊`),
        )

    const K3 = new ActionRowBuilder()
        .setComponents(
            new ButtonBuilder()
                .setCustomId(`music_shuffle`)
                .setStyle(ButtonStyle.Primary)
                .setEmoji(`🔀`),
            new ButtonBuilder()
                .setCustomId(`music_queue`)
                .setStyle(ButtonStyle.Primary)
                .setEmoji(`📄`),
            new ButtonBuilder()
                .setCustomId(`music_addsong`)
                .setStyle(ButtonStyle.Primary)
                .setEmoji(`🔍`),
            new ButtonBuilder()
                .setCustomId(`music_loop`)
                .setStyle(ButtonStyle.Secondary)
                .setEmoji(`🔁`),
            new ButtonBuilder()
                .setCustomId(`music_autoplay`)
                .setStyle(ButtonStyle.Secondary)
                .setEmoji(`⏯`),
        )
    const K4 = new ActionRowBuilder()
        .setComponents(
            new ButtonBuilder()
                .setCustomId(`music_dev1`)
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true)
                .setEmoji(`➖`),
            new ButtonBuilder()
                .setCustomId(`music_dev2`)
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true)
                .setEmoji(`➖`),
            new ButtonBuilder()
                .setCustomId(`music_stop`)
                .setStyle(ButtonStyle.Danger)
                .setEmoji(`⏹`),
            new ButtonBuilder()
                .setCustomId(`music_dev3`)
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true)
                .setEmoji(`➖`),
            new ButtonBuilder()
                .setCustomId(`music_dev4`)
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true)
                .setEmoji(`➖`),
        )

    return [K1, K2, K3, K4]
}