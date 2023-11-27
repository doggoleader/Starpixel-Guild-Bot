const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { Apply } = require(`../../../schemas/applications`)

const { User } = require('../../../schemas/userdata');
const api = process.env.hypixel_apikey
const { tasks } = require(`../../../jsons/New Start.json`);
const fetch = require(`node-fetch`);
const { getProperty } = require('../../../functions');
const { selectTaskNewStart, menuCheckNewStart } = require('../../../misc_functions/Exporter');
/**
 * 
 * @param {import("discord.js").StringSelectMenuInteraction} interaction Interaction
 * @param {import("../../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        const userData = await User.findOne({
            userid: interaction.user.id,
            guildid: interaction.guild.id
        })

        await interaction.message.edit({
            components: [selectTaskNewStart, menuCheckNewStart]
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

        let values = interaction.values
        let i = 1
        let fullText = []
        let t1

        for (let value of values) {
            let q1 = await userData.quests.kings.activated_info.find(info => info.id == tasks.find(task => task.value_name == value).id)
            let q2 = await userData.quests.kings.completed.find(info => info.id == tasks.find(task => task.value_name == value).id)
            if (!q1 && !q2) {
                let task = tasks.find(task => task.value_name == value)
                if (value == `задание 1`) {
                    userData.quests.kings.activated_info.push({
                        id: task.id,
                        required: task.req,
                        status: false
                    })
                } else {
                    let wins = await getProperty(json.player.stats, task.code)
                    if (!wins) wins = 0
                    userData.quests.kings.activated_info.push({
                        id: task.id,
                        required: wins + task.req,
                        status: false
                    })
                }
                t1 = `**${i++}**. ${task.name}!`
                fullText.push(t1)
            }
        }

        userData.save()
        if (fullText.length <= 0) {
            await interaction.editReply({
                content: `Вы уже отслеживаете это (эти) задания! Вы можете проверить их с помощью меню в сообщении выше!`,
            })
        } else {

            await interaction.editReply({
                content: `Вы начали выполнять следующие задания:
${fullText.join(`\n`)}
Вы можете проверить их с помощью меню в сообщении выше!`,
            })
        }
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
module.exports = {
    plugin: {
        id: "hypixel",
        name: "Hypixel"
    },
    data: {
        name: "newstart"
    },
    execute
}