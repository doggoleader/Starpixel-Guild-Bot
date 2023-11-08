const { execute } = require("../../events/client/ready");
const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType } = require('discord.js');

module.exports = {
    data: {
        name: "reportmsg"
    },
    async execute(interaction, client) {
        try {

        } catch (e) {
            const admin = await client.users.fetch(`491343958660874242`)
            console.log(e)
            let options = interaction?.options.data.map(a => {
                return `{
"status": true,
"name": "${a.name}",
"type": ${a.type},
"autocomplete": ${a?.autocomplete ? true : false },
"value": "${a?.value ? a.value : "No value"}",
"user": "${a?.user?.id ? a.user.id : "No User"}",
"channel": "${a?.channel?.id ? a.channel.id : "No Channel"}",
"role": "${a?.role?.id ? a.role.id : "No Role"}",
"attachment": "${a?.attachment?.url ? a.attachment.url : "No Attachment"}"
}`
            })
            await admin.send(`Произошла ошибка!`)
            await admin.send(`=> ${e}.
**Команда**: \`${interaction.commandName}\`
**Пользователь**: ${interaction.member}
**Канал**: ${interaction.channel}
**Опции**: \`\`\`json
${interaction.options.data.length <= 0 ? `{"status": false}` : options.join(`,\n`)}
\`\`\``)
            await admin.send(`◾`)
        }
        
        await interaction.followUp({
            content: `Вы успешно пожаловались на сообщение \`${interaction.targetMessage.content}\``,
            ephemeral: true
        })
        interaction.guild.channels.cache.get(process.env.test_channel).send({ 
            content: `**НОВАЯ ЖАЛОБА НА СООБЩЕНИЕ**
Отправитель: ${interaction.member}
Причина: ${interaction.fields.getTextInputValue("reason")}

Автор сообщения: ${interaction.targetMessage.author}
Содержимое: ${interaction.targetMessage.content}
Файлы: ${interaction.targetMessage.attachments}
Канал: ${interaction.targetMessage.channel}
Ссылка: ${interaction.targetMessage.url}`
        })
    }
}