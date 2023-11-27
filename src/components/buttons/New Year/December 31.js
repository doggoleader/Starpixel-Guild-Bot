const { ButtonBuilder, ChannelType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const { Tickets } = require(`../../../schemas/tickets`)
const { TicketsUser } = require(`../../../schemas/ticketUser`)
const { Guild } = require(`../../../schemas/guilddata`)
const { User } = require(`../../../schemas/userdata`)

const { Temp } = require("../../../schemas/temp_items");
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
        const result = await userData.seasonal.new_year.adventcalendar.find(cal => cal.num == 31)
        if (result) return interaction.reply({
            content: `Вы уже получили эту награду!`,
            ephemeral: true
        })
        if (d !== 31 || m !== 12) return interaction.reply({
            content: `Этот день ещё не наступил. Пожалуйста, нажмите на эту кнопку 31-го декабря!`,
            ephemeral: true
        })
        const role = await interaction.guild.roles.fetch(`850336260265476096`)
        const member = interaction.member
        await member.roles.add(role.id)
        let temp = await Temp.findOne({ userid: interaction.user.id, guildid: interaction.guild.id, roleid: role.id })
        if (temp) {
            let time = temp.expire.getTime()
            temp.expire = time + (1000 * 60 * 60 * 24 * 30 * (userData.perks.temp_items + 1))
            temp.save()
        } else {
            let newtemp = new Temp({
                userid: interaction.user.id,
                guildid: interaction.guild.id,
                roleid: role.id,
                expire: Date.now() + (1000 * 60 * 60 * 24 * 30 * (userData.perks.temp_items + 1))
            })
            newtemp.save()
        }
        await userData.seasonal.new_year.adventcalendar.push({
            num: 31
        })
        userData.seasonal.new_year.points += 5
        userData.save()
        await interaction.reply({
            content: `Вы получили свою награду за 31-е декабря: ${role} на ${30 * (userData.perks.temp_items + 1)} дней!`,
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
        name: `december_31`
    },
    execute
}
