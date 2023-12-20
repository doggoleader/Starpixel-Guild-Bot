const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, EmbedBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, } = require('discord.js');
const { Apply } = require(`../../../schemas/applications`)
const { User } = require(`../../../schemas/userdata`)
const chalk = require(`chalk`);
const { RepeatMode } = require('distube');
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
            embeds: [no_queue],
            ephemeral: true
        })
        if (queue.repeatMode == RepeatMode.DISABLED) {
            guildMusicSession.loopmode = RepeatMode.QUEUE
            await queue.setRepeatMode(RepeatMode.QUEUE)
            const comp = interaction.component;
            comp.data.style = ButtonStyle.Success
            comp.data.emoji.name = `🔁`
        } else if (queue.repeatMode == RepeatMode.QUEUE) {
            guildMusicSession.loopmode = RepeatMode.SONG
            await queue.setRepeatMode(RepeatMode.SONG)
            const comp = interaction.component;
            comp.data.style = ButtonStyle.Success
            comp.data.emoji.name = `🔂`
        } else if (queue.repeatMode == RepeatMode.SONG) {
            guildMusicSession.loopmode = RepeatMode.DISABLED
            await queue.setRepeatMode(RepeatMode.DISABLED)
            const comp = interaction.component;
            comp.data.style = ButtonStyle.Secondary
            comp.data.emoji.name = `🔁`
        }
        let types = {
            0: "Отключён",
            1: `Текущая песня`,
            2: `Очередь`
        };
        await interaction.reply({
            content: `Установлен режим повтора: ${types[guildMusicSession.loopmode]}`,
            ephemeral: true
        })
        const comps = interaction.message.components

        const ch = await interaction.guild.channels.fetch(guildMusicSession.textChannelId);
        const msg = await ch.messages.fetch(guildMusicSession.messageId);

        await msg.edit({
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
    plugin: {
        id: "music",
        name: "Музыка"
    },
    data: {
        name: "music_loop"
    },
    execute
}
