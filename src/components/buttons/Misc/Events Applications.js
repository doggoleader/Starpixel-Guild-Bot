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
        /* const modal = new ModalBuilder()
            .setCustomId(`event_applications`)
            .setTitle(`Заявка на участие в событии`)
            .addComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId(`f_1`)
                            .setLabel(`Ваше имя`)
                            .setRequired(true)
                            .setStyle(TextInputStyle.Short)
                            .setPlaceholder(`Напишите ваше имя для участия в событии`)
                    )
            )
            .addComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId(`f_2`)
                            .setLabel(`Ваш никнейм`)
                            .setRequired(true)
                            .setStyle(TextInputStyle.Short)
                            .setPlaceholder(`Напишите ваш игровой никнейм для участия в событии`)
                    )
            )
            .addComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId(`f_3`)
                            .setLabel(`Почему вы хотите поучаствовать в событии?`)
                            .setRequired(true)
                            .setStyle(TextInputStyle.Paragraph)
                            .setPlaceholder(`Напишите причины, почему вы хотели бы принять участие в данном событии`)
                    )
            )
        
        await interaction.showModal(modal) */
        const userData = await User.findOne({
            userid: interaction.user.id
        })
        const embed = new EmbedBuilder()
            .setColor(Number(client.information.bot_color))
            .setDescription(`# Заявка на участие в событии
Пользователь: ${interaction.member}

Имя: \`${userData.displayname.name}\`
Никнейм: \`${userData.nickname}\``)
            .setTimestamp(Date.now())

        userData.seasonal.summer.events.last_event_applied = true
        userData.save()

        const ch = await interaction.guild.channels.fetch(`1142817710489743480`)
        await ch.send({
            embeds: [embed]
        })

        await interaction.reply({
            content: `Спасибо за то, что подали заявку! Теперь вы можете выполнить летнее достижение №10!
**Ждем вас на мероприятии!**`,
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
        id: "misc",
        name: "Разное"
    },
    data: {
        name: "event_applications"
    },
    execute
}
