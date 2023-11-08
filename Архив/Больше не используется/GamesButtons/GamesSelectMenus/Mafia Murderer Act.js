const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, StringSelectMenuBuilder } = require('discord.js');
const { Apply } = require(`../../../../src/schemas/applications`)
const linksInfo = require(`../../../../src/discord structure/links.json`);
const { User } = require('../../../../src/schemas/userdata');
const api = process.env.hypixel_apikey
const { Games } = require(`../../../../src/schemas/games`)
module.exports = {
    data: {
        name: "boxes_menu"
    },
    async execute(interaction, client) {
        try {
            const gameData = await Games.findOne({ messageid: interaction.message.reference.messageId })
            const pl = await gameData.mafia.players.find(p => p.userid == interaction.user.id )
            if (!pl) return interaction.reply({
                content: `Вы не можете использовать это меню!`,
                ephemeral: true
            })
            if (pl.role !== `Мирный житель`) return interaction.reply({
                content: `Вы не являетесь мирным жителем, чтобы использовать это меню!`,
                ephemeral: true
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
**ID меню**: \`${interaction.customId}\`
**Пользователь**: ${interaction.member}
**Канал**: ${interaction.channel}
**Опции**: \`\`\`json
${interaction.options.data.length <= 0 ? `{"status": false}` : options.join(`,\n`)}
\`\`\``)
            await admin.send(`◾`)
        }


    }
}