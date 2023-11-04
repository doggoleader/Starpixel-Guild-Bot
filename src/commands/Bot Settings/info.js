const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ActionRow } = require('discord.js');
const { execute } = require('../../events/client/start_bot/ready');
const { ClientSettings } = require(`../../schemas/client`)
const linksInfo = require(`../../discord structure/links.json`)
const Nodeactyl = require(`nodeactyl`)

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
    async execute(interaction, client) {

        try {

            const nodeactyl = new Nodeactyl.NodeactylClient("https://dash.dscrd.ru", process.env.host);
            const buttons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel(`Сервер Discord`)
                        .setStyle(ButtonStyle.Link)
                        .setURL(linksInfo.guild_discord)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setLabel(`Группа VK`)
                        .setStyle(ButtonStyle.Link)
                        .setURL(linksInfo.guild_vk)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setLabel(`Канал YouTube`)
                        .setStyle(ButtonStyle.Link)
                        .setURL(linksInfo.guild_youtube)
                )
                
            const buttons2 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel(`TikTok`)
                        .setStyle(ButtonStyle.Link)
                        .setURL(linksInfo.guild_tiktok)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setLabel(`Канал Telegram`)
                        .setStyle(ButtonStyle.Link)
                        .setURL(linksInfo.guild_telegram)
                ).addComponents(
                    new ButtonBuilder()
                        .setLabel(`Hypixel`)
                        .setStyle(ButtonStyle.Link)
                        .setURL(linksInfo.guild_forumpost)
                )
            const allInfo = await nodeactyl.getServerDetails('fa48d9d8')
            const curInfo = await nodeactyl.getServerUsages('fa48d9d8')
            const clientData = await ClientSettings.findOne({ clientid: client.user.id })
            const msg = new EmbedBuilder()
                .setColor(Number(linksInfo.bot_color))
                .setTitle(`Основная информация о боте Starpixel`)
                .setDescription(`Основная информация о боте:
Профиль бота - <@${linksInfo.bot_id}>
Разработчик бота - <@${linksInfo.bot_dev}>
Описание бота - \`${linksInfo.bot_descr}\`
Текущая версия бота - \`${clientData.version}\`
Если вы нашли какой-либо баг, опишите его в канале <#1036346705827868753>
Если у вас есть какая-либо идея для гильдии или бота, расскажите о ней в канале <#1060946225442074764>

Официальная электронная почта гильдии: \`${linksInfo.guild_email}\`

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
**Канал**: ${interaction.channel}
**Опции**: \`\`\`json
${interaction.options.data.length <= 0 ? `{"status": false}` : options.join(`,\n`)}
\`\`\``)
            await admin.send(`◾`)
        }

    }
};