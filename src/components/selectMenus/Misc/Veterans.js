const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { Apply } = require(`../../../schemas/applications`)
const linksInfo = require(`../../../discord structure/links.json`);
const { User } = require('../../../schemas/userdata');
const api = process.env.hypixel_apikey
const { veterans } = require(`../../../miscellaneous/Veterans.json`);
const fetch = require(`node-fetch`);
const { getProperty } = require('../../../functions');
module.exports = {
    plugin: {
        id: "hypixel",
        name: "Hypixel"
    },
    data: {
        name: "veterans"
    },
    async execute(interaction, client) {
        try {
            const userData = await User.findOne({
                userid: interaction.user.id,
                guildid: interaction.guild.id
            })
            if (!userData.onlinemode) return interaction.reply({
                content: `Вы не можете выполнить брать квесты, так как у вас нелицензированный аккаунт!`,
                ephemeral: true
            })
            const response = await fetch(`https://api.hypixel.net/player?uuid=${userData.uuid}`, {
                headers: {
                    "API-Key": api,
                    "Content-Type": "application/json"
                }
            })
            await interaction.deferReply({ fetchReply: true, ephemeral: true })
            let json = await response.json()

            let value = interaction.values[0]
            let quest = await veterans.find(q => q.id == Number(value))
            if (!quest) return interaction.editReply({
                content: `Не удалось начать данное задание!`,
                ephemeral: true
            })
            if (userData.quests.veterans.completed.includes(quest.id)) return interaction.editReply({
                content: `Вы уже выполнили это задание!`,
                ephemeral: true
            })
            if (userData.quests.veterans.activated.id == quest.id) return interaction.editReply({
                content: `Вы уже начали выполнять это задание!`,
                ephemeral: true
            })

            let wins = await getProperty(json.player.stats, quest.code)
            if (!wins) wins = 0

            let vetQuest = userData.quests.veterans.activated
            vetQuest.id = quest.id
            vetQuest.required = wins + quest.req
            vetQuest.status = false


            userData.save()

            await interaction.editReply({
                content: `Вы начали выполнять задание "${quest.name}"!
Вы можете проверить его с помощью \`/quests veterans\`!`,
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
**ID меню**: \`${interaction.customId}\`
**Пользователь**: ${interaction.member}
**Канал**: ${interaction.channel}
**Опции**: \`\`\`json
${interaction.options.data.length <= 0 ? `{"status": false}` : options.join(`,\n`)}
\`\`\``)
            await admin.send(`◾`)
        }


    }
}