const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType, StringSelectMenuBuilder, ChannelType, UserSelectMenuBuilder, AttachmentBuilder, ApplicationFlagsBitField } = require('discord.js');
const fetch = require(`node-fetch`);
const wait = require(`node:timers/promises`).setTimeout
const api = process.env.hypixel_apikey;
const { User } = require(`../../schemas/userdata`)
const { Guild } = require(`../../schemas/guilddata`)
const { Apply } = require(`../../schemas/applications`)
const chalk = require(`chalk`);
const prettyMilliseconds = require(`pretty-ms`); //ДОБАВИТЬ В ДРУГИЕ
const ch_list = require(`../../discord structure/channels.json`);
const { calcActLevel, getLevel, rankName, monthName, convertToRoman } = require(`../../functions`);
const linksInfo = require(`../../discord structure/links.json`)
const fs = require(`fs`)
const rolesInfo = require(`../../discord structure/roles.json`);
const { UserProfile, GuildProgress } = require(`../../misc_functions/Exporter`)

/**
 * 
 * @param {import("discord.js").ChatInputCommandInteraction} interaction Interaction
 * @param {import("../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {

        let options = [
            {
                label: `Информация о профиле`,
                value: `info`,
                emoji: `📃`,
                description: `Получить основную информацию о профиле`
            },
            {
                label: `Обновить профиль`,
                value: `update`,
                emoji: `🔄`,
                description: `Обновить профиль пользователя`
            },
            {
                label: `Посмотреть временные предметы`,
                value: `view_temp_items`,
                emoji: `🕒`,
                description: `Посмотреть дату окончания действия временных предметов`
            },
            {
                label: `Сбросить профиль`,
                value: `reset`,
                emoji: `♻`,
                description: `Сбросить профиль`
            },
            {
                label: `Настройки профиля`,
                value: `settings`,
                emoji: `⚙`,
                description: `Получить основную информацию о профиле`
            },
            {
                label: `Получить профиль`,
                value: `getprofile`,
                emoji: `📑`,
                description: `Получить основную информацию о профиле`
            }
        ]
        if (interaction.member.roles.cache.has(`563793535250464809`)) {
            await options.push(
                {
                    label: `Создать профиль пользователя`,
                    value: `create`,
                    emoji: `✅`,
                    description: `Создать профиль для нового участника гильдии`
                }
            )
            await options.push(
                {
                    label: `Опыт гильдии`,
                    value: `getgexp`,
                    emoji: `🔰`,
                    description: `Получить опыт гильдии участника`
                }
            )
            await options.push(
                {
                    label: `Обновить все профили`,
                    value: `updateall`,
                    emoji: `♻`,
                    description: `Обновить профили всех участников`
                }
            )

            if (interaction.member.roles.cache.has(`320880176416161802`)) {
                await options.push(
                    {
                        label: `Удалить профиль`,
                        value: `delete`,
                        emoji: `❌`,
                        description: `Удалить профиль участника`
                    }
                )
                await options.push(
                    {
                        label: `Добавить в инвентарь`,
                        value: `addtoinventory`,
                        emoji: `📦`,
                        description: `Добавить предмет в инвентарь пользователя`
                    }
                )
                await options.push(
                    {
                        label: `Удалить пользовательский цвет`,
                        value: `removecolor`,
                        emoji: `🟣`,
                        description: `Удалить пользовательский цвет у игрока`
                    }
                )
            }
        }

        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(`profile`)
                    .setPlaceholder(`Выберите действие`)
                    .setOptions(options)
            )

        const embed = new EmbedBuilder()
        .setColor(Number(linksInfo.bot_color))
        .setDescription(`## Профиль участника
Выберите необходимую для вас опцию в меню ниже`)



        await interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: true,
            fetchReply: true
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
module.exports = {
    category: `items`,
    plugin: {
        id: "items",
        name: "Предметы"
    },
    data: new SlashCommandBuilder()
        .setName(`profile`)
        .setDescription(`Профиль игрока`)
        .setDMPermission(false),        
    execute
};