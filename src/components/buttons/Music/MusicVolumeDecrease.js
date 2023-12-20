const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, EmbedBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, } = require('discord.js');
const { Apply } = require(`../../../schemas/applications`)
const { User } = require(`../../../schemas/userdata`)
const chalk = require(`chalk`)
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
        await interaction.deferUpdate()

        let curVolume = queue.volume;
        let newValue = curVolume - 5
        if (newValue <= 0 ) {
            newValue = 0
        } else if (newValue >= 100) {
            newValue = 100
        }
        await queue.setVolume(newValue);
        const comps = interaction.message.components
        for (let comp of comps) {
            for (let but of comp.components) {
                if (but.data.custom_id == `music_currentvolume`) {
                    let volume = queue.volume
                    but.data.label = `${queue.volume}`
                    if (volume <= 25) {
                        but.data.emoji.name = `🔈`
                    } else if (volume <= 75 && volume > 25) {
                        but.data.emoji.name = `🔉`
                    } else if (volume > 75) {
                        but.data.emoji.name = `🔊`
                    }
                }
            }
        }

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
        name: "music_reducevolume"
    },
    execute
}
