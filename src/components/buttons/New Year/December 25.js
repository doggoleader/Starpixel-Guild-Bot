const { ButtonBuilder, ChannelType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const { Tickets } = require(`../../../schemas/tickets`)
const { TicketsUser } = require(`../../../schemas/ticketUser`)
const { Guild } = require(`../../../schemas/guilddata`)
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
        const userData = await User.findOne({ userid: interaction.user.id, guildid: interaction.guild.id })
        const date = new Date()
        const d = date.getDate()
        const m = date.getMonth() + 1
        const result = await userData.seasonal.new_year.adventcalendar.find(cal => cal.num == 25)
        if (result) return interaction.reply({
            content: `Вы уже получили эту награду!`,
            ephemeral: true
        })
        if (d !== 25 || m !== 12) return interaction.reply({
            content: `Этот день ещё не наступил. Пожалуйста, нажмите на эту кнопку 25-го декабря!`,
            ephemeral: true
        })
        userData.rumbik += 60
        userData.progress.items.find(it => it.name == 'RUMBIKS_TOTAL').total_items += 60
        await userData.seasonal.new_year.adventcalendar.push({
            num: 25
        })
        userData.seasonal.new_year.points += 5
        userData.save()
        await interaction.reply({
            content: `Вы получили свою награду за 25-е декабря: \`60\`<:Rumbik:883638847056003072>!`,
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
        id: "seasonal",
        name: "Сезонное"
    },
    data: {
        name: `december_25`
    },
    execute
}
