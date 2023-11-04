const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, AttachmentBuilder, } = require('discord.js');
const { Guild } = require(`../../../schemas/guilddata`)
const linksInfo = require(`../../../discord structure/links.json`)
const chalk = require(`chalk`)

module.exports = {
    plugin: {
        id: "guildgames",
        name: "Совместные игры"
    },
    data: {
        name: "gg_nextgame"
    },
    async execute(interaction, client) {
        try {
            const guildData = await Guild.findOne({ id: interaction.guild.id })
            if (!interaction.member.roles.cache.has(`563793535250464809`) && !interaction.member.roles.cache.has(`523559726219526184`)) return interaction.reply({
                content: `Вы не можете использовать эту кнопку, так как вы не являетесь офицером или ведущим совместных игр!`,
                ephemeral: true
            })
            if (guildData.guildgames.started <= 1) return interaction.reply({
                content: `Совместная игра ещё не началась!`,
                ephemeral: true
            })
            if (interaction.channel.id !== "717019066069418115") {
                const file = new AttachmentBuilder()
                .setFile(`./src/assets/Tutorials/OpenChat.png`)
                .setName(`OpenChat.png`)
                .setDescription(`Открыть чат в голосовом канале "Совместная"`)
                const embed = new EmbedBuilder()
                .setDescription(`Отправка сообщений с выбором игры будут отправляться в чат голосового канала <#717019066069418115>! Перейдите туда, чтобы выбирать и голосовать за мини-игры на совместной игре!`)
                .setColor(Number(linksInfo.bot_color))
                .setImage(`attachment://${file.name}`)
                await interaction.reply({
                    embeds: [embed]
                })
            } else await interaction.deferUpdate()
            const date = new Date()
            const tz = (new Date().getTimezoneOffset() / 60)
            const hour = date.getHours() + (3 + tz)
            const minutes = date.getMinutes()
            if (hour >= guildData.guildgames.gameend_hour) {
                if (minutes >= guildData.guildgames.gameend_min) {
                    client.GameEnd()
                } else if (minutes < guildData.guildgames.gameend_min) {
                    client.randomGame()
                }
            } else if (hour < guildData.guildgames.gameend_hour) {
                client.randomGame()
            }
            const buttonNext = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`gg_nextgame`)
                        .setEmoji(`🎮`)
                        .setLabel(`Выбрать игру`)
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true)
                )

            await interaction.message.edit({
                components: [buttonNext]
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
}
