const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { execute } = require('../../events/client/start_bot/ready');
const { ClientSettings } = require(`../../schemas/client`)
const linksInfo = require(`../../discord structure/links.json`);
const { User } = require('../../schemas/userdata');

module.exports = {
    category: `share`,
    plugin: {
        id: "items",
        name: "Предметы"
    },
    data: new SlashCommandBuilder()
        .setName(`share`)
        .setDescription(`Поделиться предметом с участником`)
        .addUserOption(o => o
            .setName(`пользователь`)
            .setDescription(`Пользователь, которому вы хотите отдать предмет`)
            .setRequired(true)
        )
        .addRoleOption(o => o
            .setName(`роль`)
            .setDescription(`Роль, которой вы хотите поделиться`)
            .setRequired(true)
        )
        .setDMPermission(true),
    async execute(interaction, client) {
        try {
            const { guild, user, member } = interaction
            const userData = await User.findOne({ userid: user.id, guildid: guild.id })
            const role = interaction.options.getRole(`роль`)
            const memberTo = interaction.options.getMember(`пользователь`)
            let { blacklisted } = require(`../../discord structure/blackListedRoles.json`)
            if (userData.rank_number < 10) return interaction.reply({
                content: `Вы должны иметь ранг "Повелитель гильдии" или выше, чтобы использовать эту команду!`,
                ephemeral: true
            })
            if (blacklisted.includes(role.id)) return interaction.reply({
                content: `Вы не можете передать эту роль другому пользователю!`,
                ephemeral: true
            })
            if (!member.roles.cache.has(role.id)) return interaction.reply({
                content: `Вы не можете передать эту роль, так как у вас её нет!`,
                ephemeral: true
            })
            if (memberTo.user.bot == true) return interaction.reply({
                content: `Вы не можете отдавать предметы ботам!`,
                ephemeral: true
            })
            if (!memberTo.roles.cache.has(`504887113649750016`)) return interaction.reply({
                content: `Вы не можете отдавать предметы гостям сервера!`,
                ephemeral: true
            })
            if (memberTo.user.id == user.id) return interaction.reply({
                content: `Вы собираетесь поделиться предметом с самим собой! Но зачем? 😂`,
                ephemeral: true
            })
            if (memberTo.roles.cache.has(role.id)) return interaction.reply({
                content: `У пользователя ${memberTo} уже есть эта роль!`,
                ephemeral: true
            })
            await member.roles.remove(role.id)
            await memberTo.roles.add(role.id)
            const embed = new EmbedBuilder()
                .setTitle(`Успешно передана роль`)
                .setThumbnail(memberTo.user.displayAvatarURL())
                .setColor(Number(linksInfo.bot_color))
                .setTimestamp(Date.now())
                .setDescription(`Роль ${role} была успешно передана ${member} \`➡\` ${memberTo}! Помните, что вы **НЕ СМОЖЕТЕ** вернуть эту роль!`)
            await interaction.reply({
                embeds: [embed]
            })
            /* 
            await interaction.followUp({
                content: `${memberTo}, вы получили роль \`${role.name}\` от пользователя ${member}!`
            }) */
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