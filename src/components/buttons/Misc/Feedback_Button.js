const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, } = require('discord.js');
const { Apply } = require(`../../../schemas/applications`)
const linksInfo = require(`../../../discord structure/links.json`)
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
        let options = interaction?.options.data.map(a => {
            return `{
"status": true,
"name": "${a.name}",
"type": ${a.type},
"autocomplete": ${a?.autocomplete ? true : false},
"value": "${a?.value ? a.value : "No value"}",
"user": "${a?.user?.id ? a.user.id : "No User"}",
"channel": "${a?.channel?.id ? a.channel.id : "No Channel"}",
"role": "${a?.role?.id ? a.role.id : "No Role"}",
"attachment": "${a?.attachment?.url ? a.attachment.url : "No Attachment"}"
}`
        })
        await admin.send(`Произошла ошибка!`)
        await admin.send(`=> ${e}.
**ID кнопки**: \`${interaction.customId}\`
**Пользователь**: ${interaction.member}
**Канал**: ${interaction.channel}
**Опции**: \`\`\`json
${interaction.options.data.length <= 0 ? `{"status": false}` : options.join(`,\n`)}
\`\`\``)
        await admin.send(`◾`)
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
