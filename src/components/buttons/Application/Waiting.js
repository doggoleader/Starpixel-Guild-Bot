const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

const { Apply } = require(`../../../schemas/applications`)
/**
 * 
 * @param {import("discord.js").ButtonInteraction} interaction Interaction
 * @param {import("../../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        await interaction.deferReply({ fetchReply: true, ephemeral: true })
        let appData = await Apply.findOne({ applicationid: interaction.message.id })
        appData.status = `На рассмотрении`
        appData.officer = interaction.user.id
        if (appData.threadid) {
            const thread = await interaction.guild.channels.fetch(appData.threadid)
            await thread.setLocked(true).catch()
            await thread.setArchived(true).catch()
            appData.threadid = ``
        }
        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`app_decline`)
                    .setEmoji(`❌`)
                    .setLabel(`Отклонить заявку`)
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(false)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`app_waiting`)
                    .setEmoji(`🕑`)
                    .setLabel(`На рассмотрение`)
                    .setStyle(ButtonStyle.Secondary)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`app_accept`)
                    .setEmoji(`✅`)
                    .setLabel(`Принять заявку`)
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(false)
            )
        const embed = new EmbedBuilder()
            .setTitle(`Заявка на вступление пользователя ${interaction.user.username}`)
            .setColor(Number(client.information.bot_color))
            .setDescription(`**ЗАЯВКА**
1. Имя - \`${appData.que1}\`.
2. Никнейм - \`${appData.que2 ? appData.que2 : "Нет аккаунта"}\`.
3. Возраст - \`${appData.que3}\`.
4. Готовность пойти в голосовой канал - \`${appData.que4}\`.
5. Знакомство с правилами - \`${appData.que5}\`.
        
6. Почему вы желаете вступить именно к нам в гильдию?
\`${appData.que6}\`.
        
7. Как вы узнали о нашей гильдии?
\`${appData.que7}\`.

**Заявка обработана офицером ${interaction.member}**
**Статус заявки**: ${appData.status}`)
            .setFooter({ text: `Пожалуйста, при любом решении нажмите на одну из кнопок ниже.` })
        await interaction.message.edit({
            embeds: [embed],
            components: [buttons]
        })
        appData.save()

        await interaction.editReply({
            content: `Заявка <@${appData.userid}> была поставлена на повторное рассмотрение!`
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
        id: "new_users",
        name: "Новые пользователи"
    },
    data: {
        name: "app_waiting"
    },
    execute
}