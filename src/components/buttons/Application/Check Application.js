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
        await interaction.deferReply({ ephemeral: true, fetchReply: true })
        let appData = await Apply.findOne({ userid: interaction.user.id, guildid: interaction.guild.id }) || new Apply({ userid: interaction.user.id, guildid: interaction.guild.id })
        if (appData.rules_accepted == false) return interaction.reply({
            content: `Вы не согласились с правилами в <#${ch_list.rules}>!`,
            ephemeral: true
        })
        if (!appData.part1 || !appData.part2) return interaction.editReply({
            content: `Вы не заполнили вашу заявку полностью!`,
            ephemeral: true
        })
        await interaction.editReply({
            content: `Ваша заявка на вступление в гильдию:
1. Имя - \`${appData.que1 ? appData.que1 : 'Пусто'}\`.
2. Никнейм - \`${appData.que2 ? appData.que2 : 'Пусто'}\`.
3. Возраст - \`${appData.que3 ? appData.que3 : 'Пусто'}\`.
4. Готовность пойти в голосовой канал - \`${appData.que4 ? appData.que4 : 'Пусто'}\`.
5. Знакомство с правилами - \`${appData.que5 ? appData.que5 : 'Пусто'}\`.
            
6. Почему вы желаете вступить именно к нам в гильдию?
\`${appData.que6 ? appData.que6 : 'Пусто'}\`.
            
7. Как вы узнали о нашей гильдии?
\`${appData.que7 ? appData.que7 : 'Пусто'}\`.
            
:arrow_down:    :arrow_down:    :arrow_down: 
            
:exclamation: Пожалуйста, ожидайте в течение 7 дней ответа от администратора. Помните, что вам нужно открыть ваши личные сообщения, чтобы с вами могли связаться.
            
Не забудьте ещё раз ознакомиться с правилами и поставить галочку в канале <#774546154209148928>!

**Для отправки заявки не забудьте нажать на кнопку \`Отправить\`!**`,
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
        id: "new_users",
        name: "Новые пользователи"
    },
    data: {
        name: "app_check"
    },
    execute
}