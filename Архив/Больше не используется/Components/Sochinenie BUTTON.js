const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const apply = require('../../src/commands/Misc/apply');
const { Apply } = require(`../../../src/schemas/applications`)
module.exports = {
    data: {
        name: "sochi"
    },
    async execute(interaction, client) {
        try {

        } catch (e) {
            const admin = await client.users.fetch(`491343958660874242`)
            console.log(e)
            let options = interaction?.options.data.map(a => {
                return `{
"status": true,
"name": "${a.name}",
"type": ${a.type},
"autocomplete": ${a?.autocomplete ? true : false },
"value": "${a?.value ? a.value : "No value"}",
"user": "${a?.user?.id ? a.user.id : "No User"}",
"channel": "${a?.channel?.id ? a.channel.id : "No Channel"}",
"role": "${a?.role?.id ? a.role.id : "No Role"}",
"attachment": "${a?.attachment?.url ? a.attachment.url : "No Attachment"}"
}`
            })
            await admin.send(`Произошла ошибка!`)
            await admin.send(`=> ${e}.
**Команда**: \`${interaction.commandName}\`
**Пользователь**: ${interaction.member}
**Канал**: ${interaction.channel}
**Опции**: \`\`\`json
${interaction.options.data.length <= 0 ? `{"status": false}` : options.join(`,\n`)}
\`\`\``)
            await admin.send(`◾`)
        }
        const modal = new ModalBuilder()
            .setCustomId(`sochinenie`)
            .setTitle(`Сочинение для Дмитрия`)
            .addComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId(`p1`)
                            .setLabel(`Сочинение`)
                            .setPlaceholder(`Напишите сочинение`)
                            .setRequired(true)
                            .setStyle(TextInputStyle.Paragraph)
                    ),
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId(`p2`)
                            .setLabel(`Сочинение`)
                            .setPlaceholder(`Напишите сочинение`)
                            .setStyle(TextInputStyle.Paragraph)
                    ),
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId(`p3`)
                            .setLabel(`Сочинение`)
                            .setPlaceholder(`Напишите сочинение`)
                            .setStyle(TextInputStyle.Paragraph)
                    ),
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId(`p4`)
                            .setLabel(`Сочинение`)
                            .setPlaceholder(`Напишите сочинение`)
                            .setStyle(TextInputStyle.Paragraph)
                    ),
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId(`p5`)
                            .setLabel(`Сочинение`)
                            .setPlaceholder(`Напишите сочинение`)
                            .setStyle(TextInputStyle.Paragraph)
                    ),
        )

        await interaction.showModal(modal)
    }
}