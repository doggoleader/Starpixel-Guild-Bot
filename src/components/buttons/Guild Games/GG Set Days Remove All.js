const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, StringSelectMenuBuilder, } = require('discord.js');
const { Guild } = require(`../../../schemas/guilddata`)
const chalk = require(`chalk`)
/**
 * 
 * @param {import("discord.js").ButtonInteraction} interaction Interaction
 * @param {import("../../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        const guildData = await Guild.findOne({ id: interaction.guild.id })
        const { guild, member, user } = interaction

        guildData.guildgames.game_days = []
        guildData.guildgames.officers = []
        const selectMenu = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setDisabled(true)
                    .setCustomId(`gg_set_days`)
                    .setMaxValues(7)
                    .setPlaceholder(`Выберите дни, по которым будет проходить совместная игра`)
                    .setOptions(
                        {
                            label: `Понедельник`,
                            value: `1`,
                            emoji: `1️⃣`
                        },
                        {
                            label: `Вторник`,
                            value: `2`,
                            emoji: `2️⃣`
                        },
                        {
                            label: `Среда`,
                            value: `3`,
                            emoji: `3️⃣`
                        },
                        {
                            label: `Четверг`,
                            value: `4`,
                            emoji: `4️⃣`
                        },
                        {
                            label: `Пятница`,
                            value: `5`,
                            emoji: `5️⃣`
                        },
                        {
                            label: `Суббота`,
                            value: `6`,
                            emoji: `6️⃣`
                        },
                        {
                            label: `Воскресенье`,
                            value: `0`,
                            emoji: `7️⃣`
                        }
                    )
            )
        const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`gg_set_days_removeall`)
                    .setEmoji(`❌`)
                    .setLabel(`Отменить совместные`)
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(true)
            )
        guildData.save()
        await interaction.reply({
            content: `Все совместные были отменены!`,
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
        id: "guildgames",
        name: "Совместные игры"
    },
    data: {
        name: "gg_set_days_removeall"
    },
    execute
}
