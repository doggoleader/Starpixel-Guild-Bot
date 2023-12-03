const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } = require('discord.js');

const { Apply } = require(`../../../schemas/applications`)
const chalk = require(`chalk`)
const ch_list = require(`../../../discord structure/channels.json`)
/**
 * 
 * @param {import("discord.js").ButtonInteraction} interaction Interaction
 * @param {import("../../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {

        const member = interaction.member
        const guild = interaction.guild
        if (member.roles.cache.has(`504887113649750016`)) {
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: `❗ Вы уже в гильдии!`
                })
                .setDescription(`Вы уже состоите в гильдии Starpixel! Зачем вам подавать заявку ещё раз? 😂`)
                .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                .setColor(`DarkRed`)
                .setTimestamp(Date.now())

            return interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
        }

        let appData = await Apply.findOne({ userid: interaction.user.id, guildid: interaction.guild.id }) || new Apply({ userid: interaction.user.id, guildid: interaction.guild.id })
        if (appData.rules_accepted == false) return interaction.reply({
            content: `Вы не согласились с правилами в <#${ch_list.rules}>!`,
            ephemeral: true
        })
        if (appData.applied == true) return interaction.reply({
            content: `Вы уже подали заявку в гильдию!`,
            ephemeral: true
        })
        appData.onlinemode = "no";
        appData.save()

        await interaction.reply({
            content: `Вы установили, что у вас **нет лицензии Minecraft**!`,
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
        name: "account_dont_exist"
    },
    execute
}
