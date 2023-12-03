const { Temp } = require(`../../../schemas/temp_items`)
const { User } = require(`../../../schemas/userdata`)
const { Guild } = require(`../../../schemas/guilddata`)
const chalk = require(`chalk`)
const fetch = require(`node-fetch`)
const cron = require(`node-cron`)
const prettyMilliseconds = require(`pretty-ms`)
const ch_list = require(`../../../discord structure/channels.json`)
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js")

const { achievementStats, found, getProperty } = require(`../../../functions`)
const api = process.env.hypixel_apikey
/**
 * 
 * @param {import("discord.js").ButtonInteraction} interaction Interaction
 * @param {import("../../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        const guildData = await Guild.findOne({ id: interaction.guild.id })
        if (guildData.plugins.seasonal === false) return interaction.reply({ content: `Данный плагин отключён! Попробуйте позже!`, ephemeral: true })
        if (guildData.seasonal.easter.enabled === false) return interaction.reply({
            content: `Сейчас не время для Пасхи! Попробуйте сделать это в период **1 апреля по 10 мая**!`,
            ephemeral: true
        })
        const users = await User.find({
            "seasonal.easter.points": { $gt: 0 }
        }).then(users => {
            return users.filter(async user => await interaction.guild.members.fetch(user.userid))
        })
        const sort = users.sort((a, b) => {
            return b.seasonal.easter.points - a.seasonal.easter.points
        }).slice(0, 10)
        let index = 1
        const map = sort.map(async (user) => {
            const tag = await interaction.guild.members.fetch(user.userid)
            return `**${index++}.** ${tag}: ${user.seasonal.easter.points} очков`
        })
        const mapProm = await Promise.all(map)

        if (map.length < 1) {
            await interaction.reply({
                content: `Пока что никто не заработал ни одного пасхального очка!`,
                ephemeral: true
            })
        } else {

            const embed = new EmbedBuilder()
                .setColor(Number(client.information.bot_color))
                .setAuthor({
                    name: `Лучшие пользователи по пасхальным очкам`
                })
                .setTimestamp(Date.now())
                .setDescription(`${mapProm.join('\n')}`)

            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
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
        id: "seasonal",
        name: "Сезонное"
    },
    data: {
        name: `season_easter_leaderboard`
    },
    execute
}
