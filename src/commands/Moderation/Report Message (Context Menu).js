const { ContextMenuCommandBuilder, ApplicationCommandType, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, ModalSubmitInteraction, InteractionType, EmbedBuilder } = require('discord.js');

const ch_list = require(`../../discord structure/channels.json`)
const linksInfo = require(`../../discord structure/links.json`)

/**
 * 
 * @param {import("discord.js").ChatInputCommandInteraction} interaction Interaction
 * @param {import("../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {

        const response = new EmbedBuilder()
            .setColor(Number(linksInfo.bot_color))
            .setThumbnail(interaction.targetMessage.author.displayAvatarURL())
            .setTimestamp(Date.now())
            .setTitle(`Жалоба была отправлена!`)
            .setDescription(`Ваша жалоба на [сообщение](${interaction.targetMessage.url}) была отправлена!`)

        await interaction.reply({
            embeds: [response],
            ephemeral: true
        })
        await interaction.targetMessage.react(`⚒`)

        const report = new EmbedBuilder()
            .setColor(Number(linksInfo.bot_color))
            .setThumbnail(interaction.targetMessage.author.displayAvatarURL())
            .setTimestamp(Date.now())
            .setTitle(`НОВАЯ ЖАЛОБА НА СООБЩЕНИЕ!`)
            .setDescription(`**Отправитель**: ${interaction.member}
**Автор сообщения**: ${interaction.targetMessage.author}
**Содержимое**: ${interaction.targetMessage.content}
**Канал**: ${interaction.targetMessage.channel}

[[Показать сообщение](${interaction.targetMessage.url})]`)


        await interaction.guild.channels.cache.get(ch_list.staff).send({
            embeds: [report],
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
**Команда**: \`${interaction.commandName}\`
**Пользователь**: ${interaction.member}
**Ссылка на сообщение**: ${interaction.targetMessage.url}
**Содержимое сообщения**: \`${interaction.targetMessage.content}\`
**Автор сообщения**: \`${interaction.targetMessage.author.id}\`
**Канал**: ${interaction.channel}
**Опции**: \`\`\`json
${interaction.options.data.length <= 0 ? `{"status": false}` : options.join(`,\n`)}
\`\`\``)
        await admin.send(`◾`)
    }

}
module.exports = {
    category: `admin_only`,
    plugin: {
        id: "misc",
        name: "Разное"
    },
    data: new ContextMenuCommandBuilder()
        .setName(`Пожаловаться`)
        .setType(ApplicationCommandType.Message)
        .setDMPermission(false),
    execute
}