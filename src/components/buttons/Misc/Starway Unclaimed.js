const { ButtonBuilder, ChannelType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const { Tickets } = require(`../../../schemas/tickets`)
const { TicketsUser } = require(`../../../schemas/ticketUser`)
const { Guild } = require(`../../../schemas/guilddata`)
const { User } = require(`../../../schemas/userdata`)
const api = process.env.hypixel_apikey;
const info = require(`../../../jsons/Marathon.json`);
const fetch = require(`node-fetch`)
const { getProperty } = require("../../../functions");
const { mentionCommand } = require('../../../functions');
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

        if (userData.rank_number < 9) return interaction.reply({
            content: `Вы не достигли минимального ранга для получения коллекции!`,
            ephemeral: true
        })
        if (userData.starway.unclaimed.length <= 0) return interaction.reply({
            content: `У вас нет неполученных коллекций! Если вы считаете, что есть другие неполученные награды, пропишите ${mentionCommand(client, 'inventory')}!`,
            ephemeral: true
        })
        for (let toClaim of userData.starway.unclaimed) {
            await interaction.member.roles.add(toClaim)
            let toSplice = await userData.starway.unclaimed.findIndex(unc => unc == toClaim)
            userData.starway.unclaimed.splice(toSplice, 1)

        }
        userData.save()
        await interaction.reply({
            content: `Вы забрали неполученные коллекции! Теперь при прохождении пути коллекции будут автоматически добавлять в ваш профиль!`,
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
        id: "items",
        name: "Предметы"
    },
    data: {
        name: `starway_claim`
    },
    execute
}
