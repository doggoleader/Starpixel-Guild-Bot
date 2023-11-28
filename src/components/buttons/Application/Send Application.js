const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } = require('discord.js');

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
        await interaction.deferReply({ ephemeral: true, fetchReply: true })
        let appData = await Apply.findOne({ userid: interaction.user.id, guildid: interaction.guild.id }) || new Apply({ userid: interaction.user.id, guildid: interaction.guild.id })


        if (appData.rules_accepted == false) return interaction.editReply({
            content: `Вы не согласились с правилами в <#${ch_list.rules}>`,
            ephemeral: true
        })
        if (!appData.part1 || !appData.part2) return interaction.editReply({
            content: `Вы не заполнили вашу заявку полностью!`,
            ephemeral: true
        })
        if (appData.applied == true) return interaction.editReply({
            content: `Вы уже подали заявку на вступление в гильдию!`,
            ephemeral: true
        })


        await interaction.editReply({
            content: `**Вы подали вашу заявку на вступление. С этого момента вы не можете редактировать вашу заявку!**
                
Ваша заявка на вступление в гильдию:
1. Имя - \`${appData.que1}\`.
2. Никнейм - \`${appData.que2 ? appData.que2 : "Нет аккаунта"}\`.
3. Возраст - \`${appData.que3}\`.
4. Готовность пойти в голосовой канал - \`${appData.que4}\`.
5. Знакомство с правилами - \`${appData.que5}\`.
            
6. Почему вы желаете вступить именно к нам в гильдию?
\`${appData.que6}\`.
            
7. Как вы узнали о нашей гильдии?
\`${appData.que7}\`.`,
            ephemeral: true
        })
        const ch = await interaction.guild.channels.fetch(ch_list.apply)

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
\`${appData.que7}\`.`)
            .setFooter({ text: `Пожалуйста, при любом решении нажмите на одну из кнопок ниже.` })


        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`app_decline`)
                    .setEmoji(`❌`)
                    .setLabel(`Отклонить заявку`)
                    .setStyle(ButtonStyle.Danger)
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
            )
        const msg = await ch.send({
            content: `${interaction.member}`,
            embeds: [embed],
            components: [buttons]
        })
        appData.applicationid = msg.id
        appData.status = `На рассмотрении`
        appData.applied = true
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
        name: "app_send"
    },
    execute
}