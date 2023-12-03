const { ContextMenuCommandBuilder, ApplicationCommandType, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, ModalSubmitInteraction, InteractionType, EmbedBuilder, PermissionFlagsBits, ComponentType, SlashCommandBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');

const { User } = require(`../../../schemas/userdata`)
const { Guild } = require(`../../../schemas/guilddata`)
const { daysOfWeek, isURL, secondPage } = require(`../../../functions`);
const { Song, SearchResultType } = require('distube');
const wait = require(`node:timers/promises`).setTimeout
const moment = require(`moment`)
const cron = require(`node-cron`)
/**
 * 
 * @param {import("discord.js").ModalSubmitInteraction} interaction Interaction
 * @param {import("../../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        const { member, guild, user, options } = interaction
        const guildData = await Guild.findOne({ id: guild.id })
        const songID = interaction.fields.getTextInputValue(`gg_songnumber`)
        const song = await guildData.guildgames.music[Number(songID - 1)]
        if (!song) return interaction.reply({
            content: `Данная песня не была найдена!`,
            ephemeral: true
        })

        guildData.guildgames.music.splice(Number(songID - 1), 1)
        guildData.save()

        await interaction.reply({
            content: `[Песня](${song.link}) была удалена из плейлиста!`,
            ephemeral: true
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
        id: "guildgames",
        name: "Совместные игры"
    },
    data: {
        name: "gg_removesong"
    },
    execute
}