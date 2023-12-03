const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, AttachmentBuilder, } = require('discord.js');
const { Guild } = require(`../../../schemas/guilddata`)
const chalk = require(`chalk`);
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
        if (!interaction.member.roles.cache.has(`563793535250464809`) && !interaction.member.roles.cache.has(`523559726219526184`)) return interaction.reply({
            content: `Вы не можете использовать эту кнопку, так как вы не являетесь офицером или ведущим совместных игр!`,
            ephemeral: true
        })
        if (guildData.guildgames.started <= 1) return interaction.reply({
            content: `Совместная игра ещё не началась!`,
            ephemeral: true
        })
        if (interaction.channel.id !== "717019066069418115") {
            const file = new AttachmentBuilder()
                .setFile(`./src/assets/Tutorials/OpenChat.png`)
                .setName(`OpenChat.png`)
                .setDescription(`Открыть чат в голосовом канале "Совместная"`)
            const embed = new EmbedBuilder()
                .setDescription(`Отправка сообщений с выбором игры будут отправляться в чат голосового канала <#717019066069418115>! Перейдите туда, чтобы выбирать и голосовать за мини-игры на совместной игре!`)
                .setColor(Number(client.information.bot_color))
                .setImage(`attachment://${file.name}`)
            await interaction.reply({
                embeds: [embed]
            })
        } else await interaction.deferUpdate()
        const date = new Date()
        const tz = (new Date().getTimezoneOffset() / 60)
        const hour = date.getHours() + (3 + tz)
        const minutes = date.getMinutes()
        if (hour >= guildData.guildgames.gameend_hour) {
            if (minutes >= guildData.guildgames.gameend_min) {
                client.GameEnd()
            } else if (minutes < guildData.guildgames.gameend_min) {
                client.randomGame()
            }
        } else if (hour < guildData.guildgames.gameend_hour) {
            client.randomGame()
        }
        const buttonNext = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`gg_nextgame`)
                    .setEmoji(`🎮`)
                    .setLabel(`Выбрать игру`)
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true)
            )

        await interaction.message.edit({
            components: [buttonNext]
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
        id: "guildgames",
        name: "Совместные игры"
    },
    data: {
        name: "gg_nextgame"
    },
    execute
}
