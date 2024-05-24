const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, channelLink, ChannelType, EmbedBuilder, } = require('discord.js');
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
        let appData = await Apply.findOne({ applicationid: interaction.message.id })
        const member = await interaction.guild.members.fetch(appData.userid)
        const ch = await interaction.guild.channels.fetch(ch_list.application).then(async channel => {
            const thread = await channel.threads.create({
                name: `Заявка - ${appData.que2 ? appData.que2 : member.user.displayName}`,
                type: ChannelType.PrivateThread,
                reason: `Первый этап вступления пройден`,
                invitable: false
            })
            await thread.members.add(interaction.user.id)
            await thread.members.add(appData.userid)
            const buttonLock = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`app_int_decline`)
                        .setEmoji(`❌`)
                        .setLabel(`Отклонить`)
                        .setStyle(ButtonStyle.Danger)
                )
            /* .addComponents(
                new ButtonBuilder()
                .setCustomId(`app_int_start`)
                .setEmoji(`🎤`)
                .setLabel(`Начать интервью`)
                .setStyle(ButtonStyle.Primary)
            ) */
            await thread.send({
                content: `<@${appData.userid}>, первая часть вашей заявки была принята. Теперь в данном канале вы можете связаться с администратором, который рассматривает вашу заявку, и договориться с ним о дате и времени проведения интервью.
                    
Желаю вам удачи!`,
                components: [buttonLock]
            })
            appData.threadid = thread.id
        })
        appData.officer = interaction.user.id
        appData.status = `Принята на интервью`
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
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`app_accept`)
                    .setEmoji(`✅`)
                    .setLabel(`Принять заявку`)
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(true)
            )
        const embed = new EmbedBuilder()
            .setTitle(`Заявка на вступление пользователя ${interaction.user.username}`)
            .setColor(Number(client.information.bot_color))
            .setDescription(`**ЗАЯВКА**
1. Имя - \`${appData.que1}\`.
2. Никнейм - \`${appData.que2 ? appData.que2 : "Нет аккаунта"}\`.
3. Знакомство с правилами - \`${appData.que5}\`.
4. Слышали о разработке гильдией своего сервера?
\`${appData.que6}\`.
5. Как вы узнали о нашей гильдии?
\`${appData.que7 ? appData.que7 : "Ответ не дан"}\`.
    
**Заявка обработана офицером ${interaction.member}**
**Статус заявки**: ${appData.status}`)
            .setFooter({ text: `Пожалуйста, при любом решении нажмите на одну из кнопок ниже.` })
        await interaction.message.edit({
            embeds: [embed],
            components: [buttons]
        })

        await interaction.editReply({
            content: `Заявка <@${appData.userid}> была принята на интервью!`
        })
        appData.save()
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
        name: "app_accept"
    },
    execute
}