const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, } = require('discord.js');
const { Apply } = require(`../../../schemas/applications`)
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
        const modal = new ModalBuilder()
            .setCustomId(`feedback`)
            .setTitle(`Отзыв о гильдии Starpixel`)
            .addComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId(`f_1`)
                            .setLabel(`Как вы оцениваете совместные игры?`)
                            .setRequired(true)
                            .setStyle(TextInputStyle.Paragraph)
                            .setPlaceholder(`Напишите отзыв по поводу проведения совместных игр, а также дайте им определенную оценку.`)
                    )
            )
            .addComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId(`f_2`)
                            .setLabel(`Как вы оцениваете работу бота?`)
                            .setRequired(true)
                            .setStyle(TextInputStyle.Paragraph)
                            .setPlaceholder(`Напишите отзыв о работе бота, его функционале, и что бы вы изменили в нем.`)
                    )
            )
            .addComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId(`f_3`)
                            .setLabel(`Как вы оцениваете работу персонала гильдии?`)
                            .setRequired(true)
                            .setStyle(TextInputStyle.Paragraph)
                            .setPlaceholder(`Напишите отзыв о работе каждого офицера, а именно, что вас устраивает или не устраивает в их работе.`)
                    )
            )
            .addComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId(`f_4`)
                            .setLabel(`Как вы оцениваете функционал гильдии в целом?`)
                            .setRequired(true)
                            .setStyle(TextInputStyle.Paragraph)
                            .setPlaceholder(`Напишите отзыв о текущих возможностях гильдии и о способах развития в дискорде.`)
                    )
            )
            .addComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId(`f_5`)
                            .setLabel(`Что бы вы хотели изменить в гильдии?`)
                            .setRequired(true)
                            .setStyle(TextInputStyle.Paragraph)
                            .setPlaceholder(`Напишите ваши идеи и предложения, то, чем вы не довольны или хотели бы изменить в гильдии.`)
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
    plugin: {
        id: "misc",
        name: "Разное"
    },
    data: {
        name: "feedback"
    },
    execute
}
