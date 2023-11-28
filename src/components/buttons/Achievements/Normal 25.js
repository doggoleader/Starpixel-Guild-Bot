const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, channelLink, ChannelType, EmbedBuilder, } = require('discord.js');
const { Apply } = require(`../../../schemas/applications`)
const ch_list = require(`../../../discord structure/channels.json`);
const { User } = require('../../../schemas/userdata');
const { Guild } = require('../../../schemas/guilddata');
const roles_info = require(`../../../discord structure/roles.json`)
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

        let role = `694914072960958555`
        let name = `№25. Тайная команда`
        const already_done = new EmbedBuilder()
            .setColor(`DarkRed`)
            .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
            .setAuthor({
                name: `❗ Достижение уже выполнено!`
            })
            .setDescription(`Вы не можете выполнить данное достижение, так как вы уже выполнили его! Найти его вы можете в своем профиле.
    
    Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)


        if (member.roles.cache.has(role)) return interaction.reply({
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

        if (guildData.secret_word.guessed == true) return interaction.reply({
            embeds: [guessed],
            ephemeral: true
        })
        const modal = new ModalBuilder()
            .setCustomId(`modal_ach_norm_25`)
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
        id: "items",
        name: "Предметы"
    },
    data: {
        name: "ach_norm_25"
    },
    execute
}