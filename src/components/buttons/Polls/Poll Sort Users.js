const { ButtonBuilder, ChannelType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonStyle, StringSelectMenuBuilder } = require("discord.js");
const { Tickets } = require(`../../../schemas/tickets`)
const { TicketsUser } = require(`../../../schemas/ticketUser`)
const { Polls } = require(`../../../schemas/polls`)
const { User } = require(`../../../schemas/userdata`)
const linksInfo = require(`../../../discord structure/links.json`)

module.exports = {
    plugin: {
        id: "misc",
        name: "Разное"
    },
    data: {
        name: `poll_sort_users`
    },
    async execute(interaction, client) {
        try {
            const pollData = await Polls.findOne({ builder_message: interaction.message.reference.messageId })
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
                        .setDisabled(false)
                        .setEmoji(`📃`)
                        .setLabel(`Результаты`)
                        .setStyle(ButtonStyle.Primary)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`poll_sort_users`)
                        .setDisabled(true)
                        .setEmoji(`👤`)
                        .setLabel(`Пользователи`)
                        .setStyle(ButtonStyle.Primary)
                )
            let sum = 0
            for (let result of pollData.results) {
                sum += result.result
            }
            const guild = await client.guilds.fetch(pollData.guildid)
            let res = pollData.users.map(async (user, i) => {
                const member = await guild.members.fetch(user.userid)
                let map = user.options.map(o => {
                    return `• ${o}`
                })
                return `**${++i}.** ${member} (\`${member.user.username}\`):
${map.join(`\n`)}`
            })
            let results = await Promise.all(res)

            const embed = new EmbedBuilder()
                .setTitle(`Результаты голосования`)
                .setColor(Number(linksInfo.bot_color))
                .setDescription(`**Вопрос**: ${pollData.question}
**Сортировка**: \`По пользователям\`
${results.join(`\n\n`)}

Пользователей проголосовало: ${pollData.users.length}
Голосов получено: ${sum}`)
            await interaction.update({
                embeds: [embed],
                components: [infoMenu, buttons]
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
}
