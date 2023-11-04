const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

const { Apply } = require(`../../../schemas/applications`)
const linksInfo = require(`../../../discord structure/links.json`)
module.exports = {
    plugin: {
        id: "new_users",
        name: "Новые пользователи"
    },
    data: {
        name: "app_check"
    },
    async execute(interaction, client) {
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
}