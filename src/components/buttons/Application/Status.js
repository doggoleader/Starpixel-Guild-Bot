const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

const { Apply } = require(`../../../schemas/applications`)
/**
 * 
 * @param {import("discord.js").ButtonInteraction} interaction Interaction
 * @param {import("../../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        await interaction.deferReply({ ephemeral: true, fetchReply: true })
        let appData = await Apply.findOne({ userid: interaction.user.id, guildid: interaction.guild.id }) || new Apply({ userid: interaction.user.id, guildid: interaction.guild.id })

        if (appData.rules_accepted == false) return interaction.editReply({
            content: `Вы не согласились с правилами в <#${ch_list.rules}>`,
            ephemeral: true
        })
        if (appData.applied == false) return interaction.editReply({
            content: `Вы не заполнили заявку на вступление!`,
            ephemeral: true
        })
        await interaction.editReply({
            content: `Статус вашей заявки на вступление: \`${appData.status}\``,
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
        id: "new_users",
        name: "Новые пользователи"
    },
    data: {
        name: "app_status"
    },
    execute
}