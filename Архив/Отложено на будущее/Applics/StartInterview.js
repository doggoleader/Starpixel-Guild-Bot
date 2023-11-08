const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

const { Apply } = require(`../../../src/schemas/applications`)
const linksInfo = require(`../../../src/discord structure/links.json`)

module.exports = {
    data: {
        name: "app_int_start"
    },
    async execute(interaction, client) {
        try {
            await interaction.deferReply({ fetchReply: true, ephemeral: true })
            let appData = await Apply.findOne({ threadid: interaction.channel.id })
            if (interaction.user.id !== appData.officer) return interaction.editReply({
                content: `Вы не можете самостоятельно начать интервью! Подождите, пока это сделает офицер`
            })
            if (appData.status == `Принята`) return interaction.editReply({
                content: `Заявка пользователя уже была принята!`,
                ephemeral: true
            })
            const buttonLock = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`app_int_decline`)
                        .setEmoji(`❌`)
                        .setLabel(`Отклонить участника`)
                        .setStyle(ButtonStyle.Danger)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`app_int_accept`)
                        .setEmoji(`✅`)
                        .setLabel(`Принять участника`)
                        .setStyle(ButtonStyle.Success)
                )

            client.RecordingVoiceInterview(interaction, true)
            await interaction.editReply({
                content: `Интервью было начато! Чтобы закончить интервью, нажмите на одну из кнопок ниже!`,
                components: [buttonLock]
            })
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
**ID модели**: \`${interaction.customId}\`
**Пользователь**: ${interaction.member}
**Канал**: ${interaction.channel}
**Опции**: \`\`\`json
${interaction.options.data.length <= 0 ? `{"status": false}` : options.join(`,\n`)}
\`\`\``)
            await admin.send(`◾`)
        }

    }
}