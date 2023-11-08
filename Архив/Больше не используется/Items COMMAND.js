const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { execute } = require('../../src/events/client/start_bot/ready');
const { rankName } = require('../../src/functions');
const { User } = require(`../../src/schemas/userdata`)



module.exports = {
    category: ``,
    plugin: `info`,
    data: new SlashCommandBuilder()
        .setName(`items`)
        .setDescription(`Показать предметы пользователя`)
        .setDMPermission(false)
        .addUserOption(option => option
            .setName(`пользователь`)
            .setRequired(false)
            .setDescription(`Введите любого пользователя`)
        ),
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
        const member = interaction.options.getMember(`пользователь`) || interaction.member
                if (!member.roles.cache.has(`504887113649750016`)) return interaction.followUp({
                    content: `Данный участник не находится в гильдии!`,
                    ephemeral: true
                })
        const user = interaction.options.getUser(`пользователь`) || interaction.member.user;
        const userData = await User.findOne({ userid: user.id })
        let colorRole = await interaction.guild.roles.fetch(userData.custom_color?.role ? userData.custom_color.role : `nn`)
        if (!colorRole) colorRole = `Не создана`
        const embed = new EmbedBuilder()
            .setColor(0xA872FF)
            .setAuthor({
                name: `Предметы пользователя ${user.username}`
            })
            .setThumbnail(user.displayAvatarURL())
            .setTimestamp(Date.now())
            .setDescription(
                `**ОСНОВНОЕ**
\`Ранг в гильдии\` - ${rankName(userData.rank_number)}
\`Румбики\` - ${userData.rumbik}<:Rumbik:883638847056003072>
\`Опыт рангов\` - ${userData.rank}💠
\`Посещено совместных игр\` - ${userData.visited_games} игр
\`Билеты\` - ${userData.tickets}🏷
\`Опыт гильдии\` - ${userData.gexp} GEXP
\`Медаль 🥇\` - ${userData.medal_1} шт.
\`Медаль 🥈\` - ${userData.medal_2} шт.
\`Медаль 🥉\` - ${userData.medal_3} шт.

**ПЕРКИ**
\`🔺 Повышение опыта рангов\` - ${userData.perks.rank_boost}/6
\`🔻 Скидка в королевском магазине\` - ${userData.perks.king_discount}/4
\`🔻 Скидка в магазине активности\` - ${userData.perks.act_discount}/3
\`🔻 Скидка в обычном магазине гильдии\` - ${userData.perks.shop_discount}/4
\`🕒 Увеличение времени действия временных предметов\` - ${userData.perks.temp_items}/1
\`💰 Возможность продавать предметы из профиля\` - ${userData.perks.sell_items}/1
\`🏷️ Уменьшение опыта гильдии для получения билета\` - ${userData.perks.ticket_discount}/5
\`✨ Изменение предметов\` - ${userData.perks.change_items}/1

**ПОЛЬЗОВАТЕЛЬСКИЙ ЦВЕТ**
\`Наличие\` - ${userData.custom_color.created ? `Создан` : `Не создан`}
\`Цветовой код\` - ${userData.custom_color?.hex ? userData.custom_color?.hex : `Цветовой код отсутствует`}
\`Роль\` - ${colorRole}`)
            .addFields(
                {
                    name: `НАВЫКИ ПИТОМЦЕВ`,
                    value: `\u200b`,
                    inline: false
                },
                {
                    name: `Земля`,
                    value:
`\`Выращивание горных пород\` - ${userData.elements.mountains}/1
\`Быстрый рост растений\` - ${userData.elements.fast_grow}/1
\`Перемещение под землёй\` - ${userData.elements.underground}/1`,
                    inline: false
                },
                {
                    name: `Вода`,
                    value:
`\`Плавание на глубине\` - ${userData.elements.diving}/1
\`Сопротивление течениям\` - ${userData.elements.resistance}/1
\`Подводное дыхание\` - ${userData.elements.respiration}/1`,
                    inline: false
                },
                {
                    name: `Огонь`,
                    value:
`\`Защита от огня\` - ${userData.elements.fire_resistance}/1
\`Удар молнии\` - ${userData.elements.lightning}/1
\`Управление пламенем\` - ${userData.elements.flame}/1`,
                    inline: false
                },
                {
                    name: `Воздух`,
                    value:
`\`Полёт в небесах\` - ${userData.elements.flying}/1
\`Повеление ветром\` - ${userData.elements.wind}/1
\`Орлиный глаз\` - ${userData.elements.eagle_eye}/1`,
                    inline: false
                },
            )

        await interaction.followUp({
            embeds: [embed]
        })
    }
};