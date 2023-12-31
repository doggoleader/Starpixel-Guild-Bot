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
        await interaction.deferReply({ fetchReply: true, ephemeral: true })
        let appData = await Apply.findOne({ threadid: interaction.channel.id })
        if (interaction.user.id !== appData.officer) return interaction.editReply({
            content: `Вы не можете самостоятельно отклонить свою заявку! Если вы передумали вступать в гильдию, напишите в этот чат или удалите свою заявку!`
        })
        if (appData.status == `Принята`) return interaction.editReply({
            content: `Заявка пользователя уже была принята!`,
            ephemeral: true
        })
        appData.status = `Отклонена`
        const buttonLock = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`app_int_decline`)
                    .setEmoji(`❌`)
                    .setLabel(`Отклонить`)
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(true)
            )
        await interaction.message.edit({
            components: [buttonLock]
        })
        const thread = await interaction.guild.channels.fetch(appData.threadid)
        await thread.setLocked(true).catch()
        await thread.setArchived(true).catch()
        appData.threadid = ``
        await interaction.deleteReply()
        appData.save()
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
        name: "app_int_decline"
    },
    execute
}