const { ButtonBuilder, ChannelType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const { Tickets } = require(`../../../schemas/tickets`)
const { TicketsUser } = require(`../../../schemas/ticketUser`)
const { Guild } = require(`../../../schemas/guilddata`)
const { User } = require(`../../../schemas/userdata`)
const { mentionCommand } = require('../../../functions');

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
        const { hat, chest, bag, gloves } = userData.seasonal.new_year.santa_suit
        if (hat !== true || chest !== true || bag !== true || gloves !== true) return interaction.reply({
            content: `Вы собрали **не все** части костюма Деда Мороза`,
            ephemeral: true
        })
        let rew = `925799156679856240`

        if (interaction.member.roles.cache.has(rew)) {
            if (userData.stacked_items.length < userData.upgrades.inventory_size) {
                await userData.stacked_items.push(rew)
                await interaction.reply({
                    content: `Награда была добавлена в инвентарь! Чтобы получить награду, откройте коробки и пропишите команду ${mentionCommand(client, 'inventory')}! Для просмотра списка неполученных наград пропишите ${mentionCommand(client, 'inventory')}!`,
                    ephemeral: true
                })
            } else return interaction.reply({
                content: `Мы не можем добавить предмет в ваш инвентарь, так как он переполнен. Чтобы увеличить вместительность своего инвентаря, перейдите в канал <#1141026403765211136>!`,
                ephemeral: true
            })
        } else {
            await interaction.member.roles.add(rew)
        }
        userData.seasonal.new_year.suits_returned += 1
        userData.seasonal.new_year.santa_suit.hat = false
        userData.seasonal.new_year.santa_suit.chest = false
        userData.seasonal.new_year.santa_suit.bag = false
        userData.seasonal.new_year.santa_suit.gloves = false
        userData.seasonal.new_year.points += 10
        userData.save()
        await interaction.reply({
            content: `Вы собрали костюм Деда Мороза! Он подарил вам <@&${rew}>!`,
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
        name: `return_suit`
    },
    execute
}
