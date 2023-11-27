const { ContextMenuCommandBuilder, ApplicationCommandType, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, ModalSubmitInteraction, InteractionType, EmbedBuilder } = require('discord.js');

const ch_list = require(`../../discord structure/channels.json`)

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
            .setColor(Number(client.information.bot_color))
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
            .setColor(Number(client.information.bot_color))
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
        await admin.send({
            content: `-> \`\`\`${e.stack}\`\`\``
        }).catch()
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