const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, } = require('discord.js');
const { Apply } = require(`../../../schemas/applications`)
const linksInfo = require(`../../../discord structure/links.json`)
const chalk = require(`chalk`)

module.exports = {
    data: {
        name: "black_hole_form"
    },
    async execute(interaction, client) {
        try {
            if (!interaction.member.roles.cache.has(`1061343123357310996`)) return interaction.reply({
                content: `Вы не являетесь объектом воздействия Чёрной дыры!`,
                ephemeral: true
            })
            const modal = new ModalBuilder()
                .setCustomId(`black_hole_form`)
                .setTitle(`Неактивность в гильдии`)
                .addComponents(
                    new ActionRowBuilder()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId(`bh_1`)
                                .setLabel(`Почему вы перестали проявлять активность?`)
                                .setRequired(true)
                                .setStyle(TextInputStyle.Paragraph)
                        )
                )
                .addComponents(
                    new ActionRowBuilder()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId(`bh_2`)
                                .setLabel(`Почему вы решили вступить к нам в гильдию?`)
                                .setRequired(true)
                                .setStyle(TextInputStyle.Paragraph)
                        )
                )
                .addComponents(
                    new ActionRowBuilder()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId(`bh_3`)
                                .setLabel(`Ознакомились ли вы повторно с Соглашением?`)
                                .setRequired(true)
                                .setStyle(TextInputStyle.Short)
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
}
