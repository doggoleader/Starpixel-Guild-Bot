const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ActionRow } = require('discord.js');

const { ClientSettings } = require(`../../schemas/client`)
const Nodeactyl = require(`nodeactyl`)

/**
 * 
 * @param {import("discord.js").ChatInputCommandInteraction} interaction Interaction
 * @param {import("../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {

        const nodeactyl = new Nodeactyl.NodeactylClient("https://dash.dscrd.ru", process.env.host);
        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel(`Сервер Discord`)
                    .setStyle(ButtonStyle.Link)
                    .setURL(client.information.guild_discord)
            )
            .addComponents(
                new ButtonBuilder()
                    .setLabel(`Группа VK`)
                    .setStyle(ButtonStyle.Link)
                    .setURL(client.information.guild_vk)
            )
            .addComponents(
                new ButtonBuilder()
                    .setLabel(`Канал YouTube`)
                    .setStyle(ButtonStyle.Link)
                    .setURL(client.information.guild_youtube)
            )

        const buttons2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel(`TikTok`)
                    .setStyle(ButtonStyle.Link)
                    .setURL(client.information.guild_tiktok)
            )
            .addComponents(
                new ButtonBuilder()
                    .setLabel(`Канал Telegram`)
                    .setStyle(ButtonStyle.Link)
                    .setURL(client.information.guild_telegram)
            ).addComponents(
                new ButtonBuilder()
                    .setLabel(`Hypixel`)
                    .setStyle(ButtonStyle.Link)
                    .setURL(client.information.guild_forumpost)
            )
        const allInfo = await nodeactyl.getServerDetails('fa48d9d8')
        const curInfo = await nodeactyl.getServerUsages('fa48d9d8')
        const msg = new EmbedBuilder()
            .setColor(Number(client.information.bot_color))
            .setTitle(`Основная информация о боте Starpixel`)
            .setDescription(`Основная информация о боте:
Профиль бота - <@${client.information.bot_id}>
Разработчик бота - <@${client.information.bot_dev}>
Описание бота - \`${client.information.bot_descr}\`
Версия бота - \`v${client.getVersion()}\`
Если вы нашли какой-либо баг, опишите его в канале <#1036346705827868753>
Если у вас есть какая-либо идея для гильдии или бота, расскажите о ней в канале <#1060946225442074764>

Официальная электронная почта гильдии: \`${client.information.guild_email}\`

Если вы хотите перейти к **социальным сетям** гильдии, используйте кнопки ниже!

**ТЕХНИЧЕСКИЕ ДАННЫЕ**
Статус: \`${curInfo.current_state.toUpperCase()}\`
Время работы: \`${Math.floor(curInfo.resources.uptime / 1000)}\` секунд
CPU: \`${Math.floor(curInfo.resources.cpu_absolute)}% / ${Math.floor(allInfo.limits.cpu)}%\`
RAM: \`${(curInfo.resources.memory_bytes / (1024 * 1024)).toFixed(3)} / ${(allInfo.limits.memory).toFixed(3)}\` MB
SSD: \`${(curInfo.resources.disk_bytes / (1024 * 1024)).toFixed(3)} / ${(allInfo.limits.disk).toFixed(3)}\` MB
Сеть (входящие): \`${(curInfo.resources.network_rx_bytes / (1024 * 1024)).toFixed(3)}\` MB
Сеть (выходящие): \`${(curInfo.resources.network_tx_bytes / (1024 * 1024)).toFixed(3)}\` KB`);
        await interaction.reply({
            embeds: [msg],
            components: [buttons, buttons2]
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
    category: `info`,
    plugin: {
        id: "misc",
        name: "Разное"
    },
    data: new SlashCommandBuilder()
        .setName(`info`)
        .setDescription(`Основные ссылки и информация о гильдии`)
        .setDMPermission(true),

    execute
};