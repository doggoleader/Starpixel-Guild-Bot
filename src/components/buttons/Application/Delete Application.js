const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

const { Apply } = require(`../../../schemas/applications`)
const ch_list = require(`../../../discord structure/channels.json`)
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
        let appData = await Apply.findOne({ userid: interaction.user.id, guildid: interaction.guild.id })
        if (appData.rules_accepted == false) return interaction.editReply({
            content: `Вы не согласились с правилами в <#${ch_list.rules}>`,
            ephemeral: true
        })
        if (appData.applied == false) return interaction.editReply({
            content: `Вы не отправили заявку на вступление!`,
            ephemeral: true
        })
        if (appData.status == `Принята`) return interaction.editReply({
            content: `Вы уже приняты в гильдию!`,
            ephemeral: true
        })
        if (appData.status == `Удалена`) return interaction.editReply({
            content: `Вы уже удалили свою заявку!`,
            ephemeral: true
        })
        appData.status = `Удалена`
        appData.applied = false
        if (appData.threadid) {
            const thread = await interaction.guild.channels.fetch(appData.threadid)
            await thread.setLocked(true).catch()
            await thread.setArchived(true).catch()
            appData.threadid = ``
        }
        const channel = await interaction.guild.channels.fetch(ch_list.apply)
        const msg = await channel.messages.fetch(appData.applicationid)
        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`app_decline`)
                    .setEmoji(`❌`)
                    .setLabel(`Отклонить заявку`)
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(true)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`app_waiting`)
                    .setEmoji(`🕑`)
                    .setLabel(`На рассмотрение`)
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`app_accept`)
                    .setEmoji(`✅`)
                    .setLabel(`Принять заявку`)
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(true)
            )
        await msg.edit({
            components: [buttons]
        })

        await msg.reply({
            content: `Заявка была удалена пользователем!`
        })

        await interaction.editReply({
            content: `Вы успешно удалили свою заявку!`
        })
        appData.save()
    } catch (e) {
        const admin = await client.users.fetch(`491343958660874242`)
        console.log(e)
        let options = interaction?.options.data.map(a => {
            return `{
"status": true,
"name": "${a.name}",
"type": ${a.type},
"autocomplete": ${a?.autocomplete ? true : false},
"value": "${a?.value ? a.value : "No value"}",
"user": "${a?.user?.id ? a.user.id : "No User"}",
"channel": "${a?.channel?.id ? a.channel.id : "No Channel"}",
"role": "${a?.role?.id ? a.role.id : "No Role"}",
"attachment": "${a?.attachment?.url ? a.attachment.url : "No Attachment"}"
}`
        })
        await admin.send(`Произошла ошибка!`)
        await admin.send(`=> ${e}.
**ID модели**: \`${interaction.customId}\`
**Пользователь**: ${interaction.member}
**Канал**: ${interaction.channel}
**Опции**: \`\`\`json
${interaction.options.data.length <= 0 ? `{"status": false}` : options.join(`,\n`)}
\`\`\``)
        await admin.send(`◾`)
    }

}
module.exports = {
    plugin: {
        id: "new_users",
        name: "Новые пользователи"
    },
    data: {
        name: "app_delete"
    },
    execute
}