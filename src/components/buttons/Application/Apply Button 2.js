const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } = require('discord.js');
const ch_list = require(`../../../discord structure/channels.json`)
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

        let apply2
        let appData = await Apply.findOne({ userid: interaction.user.id, guildid: interaction.guild.id }) || new Apply({ userid: interaction.user.id, guildid: interaction.guild.id })
        if (appData.rules_accepted == false) return interaction.reply({
            content: `Вы не согласились с правилами в <#${ch_list.rules}>!`,
            ephemeral: true
        })
        if (appData.applied == true) return interaction.reply({
            content: `Вы уже подали заявку в гильдию!`,
            ephemeral: true
        })
        if (appData.part1 == false) return interaction.reply({
            content: `Вы не заполнили первую часть заявки на вступление!`,
            ephemeral: true
        })
        if (!appData.que6 && !appData.que7) {
            apply2 = new ModalBuilder()
                .setCustomId(`apply2`)
                .setTitle(`Заявка на вступление (2/2)`)
                .addComponents(
                    new ActionRowBuilder()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId(`sixth`)
                                .setLabel(`Почему вы хотите вступить к нам в гильдию?`)
                                .setPlaceholder(`Расскажите нам, почему вы выбрали именно нам.`)
                                .setRequired(true)
                                .setStyle(TextInputStyle.Paragraph)
                        ),
                    new ActionRowBuilder()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId(`seventh`)
                                .setLabel(`Как вы узнали о нашей гильдии?`)
                                .setPlaceholder(`Напишите, где и как вы узнали о нашей гильдии.`)
                                .setRequired(true)
                                .setStyle(TextInputStyle.Paragraph)
                        )
                )
        } else if (!appData.que6 && appData.que7) {
            apply2 = new ModalBuilder()
                .setCustomId(`apply2`)
                .setTitle(`Заявка на вступление (2/2)`)
                .addComponents(
                    new ActionRowBuilder()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId(`sixth`)
                                .setLabel(`Почему вы хотите вступить к нам в гильдию?`)
                                .setPlaceholder(`Расскажите нам, почему вы выбрали именно нам.`)
                                .setRequired(true)
                                .setStyle(TextInputStyle.Paragraph)
                        ),
                    new ActionRowBuilder()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId(`seventh`)
                                .setLabel(`Как вы узнали о нашей гильдии?`)
                                .setPlaceholder(`Напишите, где и как вы узнали о нашей гильдии.`)
                                .setRequired(true)
                                .setStyle(TextInputStyle.Paragraph)
                                .setValue(appData.que7)
                        )
                )
        } else if (appData.que6 && !appData.que7) {
            apply2 = new ModalBuilder()
                .setCustomId(`apply2`)
                .setTitle(`Заявка на вступление (2/2)`)
                .addComponents(
                    new ActionRowBuilder()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId(`sixth`)
                                .setLabel(`Почему вы хотите вступить к нам в гильдию?`)
                                .setPlaceholder(`Расскажите нам, почему вы выбрали именно нам.`)
                                .setRequired(true)
                                .setStyle(TextInputStyle.Paragraph)
                                .setValue(appData.que6)
                        ),
                    new ActionRowBuilder()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId(`seventh`)
                                .setLabel(`Как вы узнали о нашей гильдии?`)
                                .setPlaceholder(`Напишите, где и как вы узнали о нашей гильдии.`)
                                .setRequired(true)
                                .setStyle(TextInputStyle.Paragraph)
                        )
                )
        } else if (appData.que6 && appData.que7) {
            apply2 = new ModalBuilder()
                .setCustomId(`apply2`)
                .setTitle(`Заявка на вступление (2/2)`)
                .addComponents(
                    new ActionRowBuilder()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId(`sixth`)
                                .setLabel(`Почему вы хотите вступить к нам в гильдию?`)
                                .setPlaceholder(`Расскажите нам, почему вы выбрали именно нам.`)
                                .setRequired(true)
                                .setStyle(TextInputStyle.Paragraph)
                                .setValue(appData.que6)
                        ),
                    new ActionRowBuilder()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId(`seventh`)
                                .setLabel(`Как вы узнали о нашей гильдии?`)
                                .setPlaceholder(`Напишите, где и как вы узнали о нашей гильдии.`)
                                .setRequired(true)
                                .setStyle(TextInputStyle.Paragraph)
                                .setValue(appData.que7)
                        )
                )
        }
        await interaction.showModal(apply2)




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
        name: "apply2"
    },
    execute
}
