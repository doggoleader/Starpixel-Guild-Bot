const { ButtonBuilder, ChannelType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonStyle, StringSelectMenuBuilder } = require("discord.js");
const { Tickets } = require(`../../../schemas/tickets`)
const { TicketsUser } = require(`../../../schemas/ticketUser`)
const { Polls } = require(`../../../schemas/polls`)
const { User } = require(`../../../schemas/userdata`)
/**
 * 
 * @param {import("discord.js").ButtonInteraction} interaction Interaction
 * @param {import("../../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        const pollData = await Polls.findOne({ builder_message: interaction.message.id })
        const infoMenu = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(`poll_res_infomenu`)
                    .setDisabled(true)
                    .setPlaceholder(`⬇ Режим сортировки`)
                    .setOptions({
                        label: `test`,
                        value: `test`
                    })
            )
        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`poll_sort_results`)
                    .setDisabled(true)
                    .setEmoji(`📃`)
                    .setLabel(`Результаты`)
                    .setStyle(ButtonStyle.Primary)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`poll_sort_users`)
                    .setDisabled(false)
                    .setEmoji(`👤`)
                    .setLabel(`Пользователи`)
                    .setStyle(ButtonStyle.Primary)
            )
        let sort = await pollData.results.sort((a, b) => b.result - a.result)
        let sum = 0
        let results = sort.map((result, i) => {
            sum += result.result
            let percent = ((result.result / pollData.users.length) * 100).toFixed(1)
            return `**${++i}.** \`${result.option}\` - ${percent}%`
        })

        const embed = new EmbedBuilder()
            .setTitle(`Результаты голосования`)
            .setColor(Number(client.information.bot_color))
            .setDescription(`**Вопрос**: ${pollData.question}
**Сортировка**: \`По результатам\`
${results.join(`\n`)}

Пользователей проголосовало: ${pollData.users.length}
Голосов получено: ${sum}`)
        await interaction.reply({
            embeds: [embed],
            components: [infoMenu, buttons],
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
        name: `poll_get_results`
    },
    execute
}
