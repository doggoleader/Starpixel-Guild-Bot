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
        const result = await userData.seasonal.new_year.adventcalendar.find(cal => cal.num == 8)
        if (result) return interaction.reply({
            content: `Вы уже получили эту награду!`,
            ephemeral: true
        })
        if (d !== 8 || m !== 12) return interaction.reply({
            content: `Этот день ещё не наступил. Пожалуйста, нажмите на эту кнопку 8-го декабря!`,
            ephemeral: true
        })
        userData.exp += 300
        await userData.seasonal.new_year.adventcalendar.push({
            num: 8
        })
        userData.seasonal.new_year.points += 5
        userData.save()
        client.ActExp(userData.userid)
        await interaction.reply({
            content: `Вы получили свою награду за 8-е декабря: \`300\`🌀!`,
            ephemeral: true
        })
    } catch (e) {
        const admin = await client.users.fetch(`491343958660874242`)
        console.log(e)
        await admin.send({
            content: `-> \`\`\`${e.stack}\`\`\``
        }).catch()
    }


}

module.exports = {
    plugin: {
        id: "seasonal",
        name: "Сезонное"
    },
    data: {
        name: `december_8`
    },
    execute
}
