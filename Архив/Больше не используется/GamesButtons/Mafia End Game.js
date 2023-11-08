const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } = require('discord.js');
const { Games } = require(`../../../schemas/games`)
const linksInfo = require(`../../../discord structure/links.json`)
const chalk = require(`chalk`)

module.exports = {
    data: {
        name: "mafia_end"
    },
    async execute(interaction, client) {
        try {
            const gameData = await Games.findOne({ messageid: interaction.message.id })
            if (!gameData) return interaction.message.delete()
            if (gameData.started_by !== interaction.user.id) return interaction.reply({
                content: `Вы не можете закончить игру, так как не вы начали её!`,
                ephemeral: true
            })
            await gameData.delete()
            await interaction.reply({
                content: `Игра в Мафию была закончена!`
            })
            await interaction.message.delete()
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
