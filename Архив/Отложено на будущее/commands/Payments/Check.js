const { ButtonBuilder, ChannelType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const { Tickets } = require(`../../../../src/schemas/tickets`)
const { TicketsUser } = require(`../../../../src/schemas/ticketUser`)
const { Guild } = require(`../../../../src/schemas/guilddata`)
const { User } = require(`../../../../src/schemas/userdata`)
const linksInfo = require(`../../../../src/discord structure/links.json`)
const api = process.env.hypixel_apikey;
const info = require(`../../../../src/miscellaneous/Marathon.json`);
const fetch = require(`node-fetch`)
const { getProperty } = require("../../../../src/functions");

module.exports = {
    data: {
        name: `qiwi_bill_check`
    },
    async execute(interaction, client) {
        try {
            const userData = await User.findOne({ userid: interaction.user.id})
            const billid = userData.payments.qiwi.find(i => i.messageid == interaction.message.id).billid
            const response = await fetch(`https://api.qiwi.com/partner/bill/v1/bills/${billid}`, {
                method: `GET`,
                headers: {
                    Accept: `application/json`,
                    Authorization: `Bearer ${process.env.QIWI_P2P_PRIVATE}`
                }
            })

            const json = await response.json()
            console.log(json)
            
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
}
