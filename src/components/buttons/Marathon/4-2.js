const { ButtonBuilder, ChannelType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const { Tickets } = require(`../../../schemas/tickets`)
const { TicketsUser } = require(`../../../schemas/ticketUser`)
const { Guild } = require(`../../../schemas/guilddata`)
const { User } = require(`../../../schemas/userdata`)
const api = process.env.hypixel_apikey;
const info = require(`../../../jsons/Marathon.json`);
const fetch = require(`node-fetch`)
const { getProperty } = require("../../../functions");
/**
 * 
 * @param {import("discord.js").ButtonInteraction} interaction Interaction
 * @param {import("../../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {

        const userData = await User.findOne({ userid: interaction.user.id, guildid: interaction.guild.id })
        if (!userData.onlinemode) return interaction.reply({
            content: `Вы не можете участвовать в марафоне, так как у вас нелицензированный аккаунт!`,
            ephemeral: true
        })
        let stage = 4
        let tr1 = userData.quests.marathon.completed.find(com => com == stage - 1)
        if (!tr1) return interaction.reply({
            content: `Вы не выполнили предыдущую стадию марафона!`,
            ephemeral: true
        })
        let tr = userData.quests.marathon.completed.find(com => com == stage)
        if (tr) return interaction.reply({
            content: `Вы уже выполнили эту стадию марафона!`,
            ephemeral: true
        })
        const response = await fetch(`https://api.hypixel.net/player?uuid=${userData.uuid}`, {
            headers: {
                "API-Key": api,
                "Content-Type": "application/json"
            }
        })
        let json
        if (response.ok) {
            json = await response.json()
        }
        let id = 11
        const guildData = await Guild.findOne({ id: interaction.guild.id })
        const type = guildData.marathon.marathon_type;
        const quest = info[type].ids.find(i => i.id == id)
        let cur_wins = await getProperty(json.player.stats, quest.code)
        if (!cur_wins) cur_wins = 0

        userData.quests.marathon.activated.id = quest.id
        userData.quests.marathon.activated.status = false
        userData.quests.marathon.activated.stage = stage
        userData.quests.marathon.activated.required = cur_wins + quest.req
        userData.save()
        await interaction.reply({
            content: `В четвёртом этапе марафона вы выбрали \`${quest.game}\`. Сделайте ${quest.req} побед!`,
            ephemeral: true
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
**ID кнопки**: \`${interaction.customId}\`
**Пользователь**: ${interaction.member}
**Канал**: ${interaction.channel}
**Опции**: \`\`\`json
${interaction.options.data.length <= 0 ? `{"status": false}` : options.join(`,\n`)}
\`\`\``)
        await admin.send(`◾`)
    }

}

module.exports = {
    plugin: {
        id: "hypixel",
        name: "Hypixel"
    },
    data: {
        name: `marathon_4_2`
    },
    execute
}
