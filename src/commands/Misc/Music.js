const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder, WebhookClient, PermissionsBitField, PermissionFlagsBits, ComponentType, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const fetch = require(`node-fetch`);
const api = process.env.hypixel_apikey;
const { User } = require(`../../schemas/userdata`)
const { Guild } = require(`../../schemas/guilddata`)
const chalk = require(`chalk`);
const ch_list = require(`../../discord structure/channels.json`)
const { gameConstructor, calcActLevel, getLevel, isURL, secondPage, mentionCommand } = require(`../../functions`);
const { SearchResultType, DisTubeVoice, Song, Playlist } = require('distube');

/**
 * 
 * @param {import("discord.js").ChatInputCommandInteraction} interaction Interaction
 * @param {import("../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        const { member, user, guild, channel } = interaction
        const guildData = await Guild.findOne({ id: guild.id })

        const music_channel = await guild.channels.fetch(ch_list.music)
        if (guildData.guildgames.started >= 1 && !member.roles.cache.has(`523559726219526184`) && !member.roles.cache.has(`563793535250464809`) && !member.roles.cache.has(`320880176416161802`)) return interaction.reply({
            content: `Вы не можете использовать музыкального бота, пока в гильдии проходит совместная игра!`,
            ephemeral: true
        })
        if (interaction.channel.id !== music_channel.id && !interaction.member.roles.cache.has(`563793535250464809`)) return interaction.reply({
            content: `Чтобы использовать музыкального бота, перейдите в канал ${music_channel}!`,
            ephemeral: true
        })
        if (!member.voice) return interaction.reply({
            content: `Вы должны быть в голосовом канале, чтобы использовать музыкального бота!`,
            ephemeral: true
        })

        let guildMusicSession = client.musicSession.find(m => m.guildId == guild.id);

        const modal = new ModalBuilder()
        .setTitle(`Запустить музыкального бота`)
        .setCustomId(`music_startmusic`)
        .setComponents(
            new ActionRowBuilder()
            .setComponents(
                new TextInputBuilder()
                .setCustomId(`music_musicname`)
                .setLabel(`Ссылка или название песни`)
                .setPlaceholder(`Введите ссылку или название песни`)
                .setStyle(TextInputStyle.Short)
            )
        )

        await interaction.showModal(modal)
    } catch (e) {
        const admin = await client.users.fetch(`491343958660874242`)
        console.log(e)
        await admin.send({
            content: `-> \`\`\`${e.stack}\`\`\``
        }).catch()
    }

}
module.exports = {
    category: `music`,
    plugin: {
        id: "music",
        name: "Музыка"
    },
    data: new SlashCommandBuilder()
        .setName(`music`)
        .setDescription(`Запустить музыкального бота`)
        .setDMPermission(false),
    execute
};