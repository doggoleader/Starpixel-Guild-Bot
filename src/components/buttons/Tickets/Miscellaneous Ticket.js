const { ButtonBuilder, ChannelType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const { Tickets } = require(`../../../schemas/tickets`)
const { TicketsUser } = require(`../../../schemas/ticketUser`)
/**
 * 
 * @param {import("discord.js").ButtonInteraction} interaction Interaction
 * @param {import("../../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        await interaction.deferReply({
            fetchReply: true,
            ephemeral: true
        })
        const guild = interaction.guild
        const user = interaction.user

        const tickets = await Tickets.findOne({ guildid: guild.id }) || new Tickets({ guildid: guild.id, support: `320880176416161802` })
        const anyTickets = await TicketsUser.findOne({ userid: user.id, guildid: guild.id })
        if (anyTickets) return interaction.editReply({
            content: `Вы не можете создать более одного обращения! Проверьте канал <#${anyTickets.channelid}>`,
            ephemeral: true
        })
        tickets.id += 1
        const support = await interaction.channel.threads.create({
            name: `Обращение №${tickets.id}`,
            type: ChannelType.PrivateThread,
            invitable: false

        })
        const ticketuser = new TicketsUser({ userid: user.id, guildid: guild.id, channelid: support.id, opened: true });
        await interaction.guild.members.fetch().then(async membs => {
            const membFil = await membs.filter(memb => memb.roles.cache.has(`320880176416161802`))
            membFil.forEach(async memb => await support.members.add(memb.user.id))
        })
        await support.members.add(user.id)

        const delete_button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`delete_ticket`)
                    .setEmoji(`🔒`)
                    .setLabel(`Закрыть обращение`)
                    .setStyle(ButtonStyle.Danger)
            )

        const delete_embed = new EmbedBuilder()
            .setTitle(`Вы открыли обращение к администрации!`)
            .setColor(Number(client.information.bot_color))
            .setDescription(`Вы открыли обращение по теме "Прочий вопрос". Пожалуйста, задайте свой вопрос ниже.
        
Если вы хотите закрыть данное обращение, вы можете нажать на кнопочку ниже. Неактивные обращения удаляются модератором спустя 2 дня.`)
            .setThumbnail(user.displayAvatarURL())
            .setTimestamp(Date.now())
        await interaction.editReply({
            content: `Вы открыли <#${support.id}>! Пожалуйста, перейдите в данный канал, чтобы задать свой вопрос!`,
            ephemeral: true
        })
        await support.send({
            embeds: [delete_embed],
            components: [delete_button]
        })
        tickets.save()
        ticketuser.save()
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
**ID кнопки**: \`${interaction.customId}\`
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
        id: "tickets",
        name: "Служба поддержки"
    },
    data: {
        name: `misc_ticket`
    },
    execute
}
