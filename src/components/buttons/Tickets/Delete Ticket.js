const { ButtonBuilder, ChannelType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const { Tickets } = require(`../../../schemas/tickets`)
const { TicketsUser } = require(`../../../schemas/ticketUser`)
const chalk = require(`chalk`)
/**
 * 
 * @param {import("discord.js").ButtonInteraction} interaction Interaction
 * @param {import("../../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        await interaction.deferUpdate()
        const guild = interaction.guild
        const member = interaction.member
        const channel = interaction.channel
        const tickets = await Tickets.findOne({ guildid: guild.id })
        const anyTickets = await TicketsUser.findOne({ guildid: guild.id, channelid: channel.id })
        if (member.roles.cache.has(`320880176416161802`) || member.user.id === anyTickets.userid) {
            const requester = await guild.members.fetch(anyTickets.userid)
            try {
                await requester.send({
                    content: `Спасибо, что обратились к нам за помощью! Надеюсь, что мы смогли вам как-либо помочь. Если будут вопросы, вы всегда можете спросить в чате или связаться с нами! ❤`
                })
            } catch (error) {
                console.log(chalk.blackBright(`[${new Date()}]`) + `Личные сообщения пользователя ${requester.user.username} закрыты!`)
            }
            anyTickets.delete()
            await channel.setLocked(true) //№${tickets.id}
            await channel.setArchived(true) //№${tickets.id}

        }
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
        id: "tickets",
        name: "Служба поддержки"
    },
    data: {
        name: `delete_ticket`
    },
    execute
}
