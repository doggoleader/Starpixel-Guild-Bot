const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

const { Apply } = require(`../../../schemas/applications`)
/**
 * 
 * @param {import("discord.js").ModalSubmitInteraction} interaction Interaction
 * @param {import("../../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        let appData = await Apply.findOne({ userid: interaction.user.id, guildid: interaction.guild.id })
        let r6 = interaction.fields.getTextInputValue("sixth")
        let r7 = interaction.fields.getTextInputValue("seventh")
        appData.que6 = r6
        appData.que7 = r7
        appData.part2 = true
        const msg = await interaction.reply({
            content: `Ваша заявка на вступление в гильдию:
1. Имя - \`${appData.que1}\`.
2. Никнейм - \`${appData.que2}\`.
3. Возраст - \`${appData.que3}\`.
4. Готовность пойти в голосовой канал - \`${appData.que4}\`.
5. Знакомство с правилами - \`${appData.que5}\`.
            
6. Почему вы желаете вступить именно к нам в гильдию?
\`${appData.que6}\`.
            
7. Как вы узнали о нашей гильдии?
\`${appData.que7}\`.
            
:arrow_down:    :arrow_down:    :arrow_down: 
            
:exclamation: Пожалуйста, ожидайте в течение 7 дней ответа от администратора. Помните, что вам нужно открыть ваши личные сообщения, чтобы с вами могли связаться.
            
Не забудьте ещё раз ознакомиться с правилами и поставить галочку в канале <#774546154209148928>!`,
            ephemeral: true
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
        name: "apply2"
    },
    execute
}