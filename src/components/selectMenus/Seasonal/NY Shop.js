const { Temp } = require(`../../../schemas/temp_items`)
const { User } = require(`../../../schemas/userdata`)
const { Guild } = require(`../../../schemas/guilddata`)
const chalk = require(`chalk`)
const fetch = require(`node-fetch`)
const cron = require(`node-cron`)
const ch_list = require(`../../../discord structure/channels.json`)
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js")

const { achievementStats, found, getProperty } = require(`../../../functions`)
const api = process.env.hypixel_apikey
/**
 * 
 * @param {import("discord.js").StringSelectMenuInteraction} interaction Interaction
 * @param {import("../../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        const guildData = await Guild.findOne({ id: interaction.guild.id })
        if (guildData.plugins.seasonal === false) return interaction.reply({ content: `Данный плагин отключён! Попробуйте позже!`, ephemeral: true })
        if (guildData.seasonal.new_year.enabled === false) return interaction.reply({
            content: `Сейчас не время для Нового года! Попробуйте сделать это в период **1 декабря по 18 января**!`,
            ephemeral: true
        })
        const userData = await User.findOne({ userid: interaction.user.id, guildid: interaction.guild.id })
        const symb = interaction.values[0]
        let price
        if (symb == `🎄` || symb == `✨` || symb == `🎆`) {
            price = 30
        } else if (symb == `🎁`) {
            price = 40
        } else if (symb == `🎇` || symb == `🎈`) {
            price = 50
        }

        if (userData.seasonal.new_year.points < price) return interaction.reply({
            content: `Для покупки \`${symb}\` вам необходимо минимум ${price} очков! У вас на данный момент ${userData.seasonal.new_year.points} очков.`,
            ephemeral: true
        })
        userData.seasonal.new_year.points -= price
        userData.displayname.symbol = symb
        if (!userData.cosmetics_storage.symbols.includes(symb)) {
            userData.cosmetics_storage.symbols.push(symb)
        }
        userData.save()
        await interaction.reply({
            content: `Вы приобрели \`${symb}\` за ${price} новогодний очков! В скором времени данный значок появится в вашем никнейме! Если этого не произойдёт в течение 15 минут, обратитесь в вопрос-модерам!`,
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
        name: `season_newyear_shop`
    },
    execute
}
