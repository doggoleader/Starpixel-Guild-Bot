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
        let appData = await Apply.findOne({ userid: interaction.user.id, guildid: interaction.guild.id }) || new Apply({ userid: interaction.user.id, guildid: interaction.guild.id })

        let r1 = interaction.fields.getTextInputValue("first")
        let r2 = interaction.fields.getTextInputValue("second")
        let r3 = interaction.fields.getTextInputValue("third")
        let r4 = interaction.fields.getTextInputValue("fourth")
        let r5 = interaction.fields.getTextInputValue("fifth")
        appData.status = `На рассмотрении`
        appData.que1 = r1
        appData.que2 = r2
        appData.que5 = r3
        appData.que6 = r4
        appData.que7 = r5

        appData.part1 = true
        appData.part2 = true
        appData.save()
        const msg = await interaction.reply({
            content: `Ваша заявка на вступление в гильдию:
1. Имя - \`${appData.que1}\`.
2. Никнейм - \`${appData.que2 ? appData.que2 : "Нет аккаунта"}\`.
3. Знакомство с правилами - \`${appData.que5}\`.
4. Слышали о разработке гильдией своего сервера?
\`${appData.que6}\`.
5. Как вы узнали о нашей гильдии?
\`${appData.que7 ? appData.que7 : "Ответ не дан"}\`.
            
:arrow_down:    :arrow_down:    :arrow_down: 
            
:exclamation: Пожалуйста, ожидайте в течение 7 дней ответа от администратора. Помните, что вам нужно открыть ваши личные сообщения, чтобы с вами могли связаться.
            
Не забудьте ещё раз ознакомиться с правилами и поставить галочку в канале <#774546154209148928>!`,
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
        name: "apply1"
    },
    execute
}