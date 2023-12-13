const { Temp } = require(`../../../schemas/temp_items`)
const { User } = require(`../../../schemas/userdata`)
const { Guild } = require(`../../../schemas/guilddata`)
const chalk = require(`chalk`)
const fetch = require(`node-fetch`)
const cron = require(`node-cron`)
const ch_list = require(`../../../discord structure/channels.json`)
const { EmbedBuilder, SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js")

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
        const { guild, member, user } = interaction
        const guildData = await Guild.findOne({ id: guild.id })
        const userData = await User.findOne({ userid: user.id })
        const already_done = new EmbedBuilder()
            .setColor(`DarkRed`)
            .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
            .setAuthor({
                name: `❗ Достижение уже выполнено!`
            })
            .setDescription(`Вы не можете выполнить данное достижение, так как вы уже выполнили его! Найти его вы можете в своем профиле.
    
Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)


        if (userData.seasonal.summer.achievements.num8 === true) return interaction.reply({
            embeds: [already_done],
            ephemeral: true
        })

        const guessed = new EmbedBuilder()
            .setColor(`DarkRed`)
            .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
            .setAuthor({
                name: `❗ Слово отгадано`
            })
            .setDescription(`Тайное слово отгадано! Подождите, пока появится новое слово.`)
            .setTimestamp(Date.now())

        if (guildData.seasonal.summer.secret_guessed == true) return interaction.reply({
            embeds: [guessed],
            ephemeral: true
        })
        const modal = new ModalBuilder()
            .setCustomId(`modal_seasonal_su_8`)
            .setTitle(`Тайная команда`)
            .addComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId(`word`)
                            .setLabel(`Тайное слово`)
                            .setRequired(true)
                            .setPlaceholder(`Введите тайное слово`)
                            .setStyle(TextInputStyle.Short)
                    )
            )
        await interaction.showModal(modal)

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
        name: `season_summer_ach8`
    },
    execute
}
