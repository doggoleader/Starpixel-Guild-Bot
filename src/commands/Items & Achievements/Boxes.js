const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { User } = require(`../../schemas/userdata`);
const chalk = require(`chalk`);
const ch_list = require(`../../discord structure/channels.json`);
const { boxesMenu } = require('../../misc_functions/Exporter');

/**
 * 
 * @param {import("discord.js").ChatInputCommandInteraction} interaction Interaction
 * @param {import("../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {

        const selectMenu = boxesMenu
        const getInfoButton = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId(`boxes_getinfo`)
            .setEmoji(`📃`)
            .setLabel(`Получить информацию о коробках`)
            .setStyle(ButtonStyle.Primary)
        )


        const embed = new EmbedBuilder()
            .setColor(Number(client.information.bot_color))
            .setTitle(`Меню коробок`)
            .setDescription(`Открыто меню коробок. Выберите коробку, которую хотите открыть. Желаю вам удачи в луте из коробок!`)
            .setTimestamp(Date.now())

        await interaction.reply({
            embeds: [embed],
            components: [selectMenu, getInfoButton]
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
    category: `box`,
    plugin: {
        id: "items",
        name: "Предметы"
    },
    data: new SlashCommandBuilder()
        .setName(`boxes`)  //Название команды
        .setDescription(`Открыть меню открытия коробок`)
        .setDMPermission(false), //Описание команды
    execute
};