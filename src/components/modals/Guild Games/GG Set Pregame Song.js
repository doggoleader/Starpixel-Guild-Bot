const { ContextMenuCommandBuilder, ApplicationCommandType, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, ModalSubmitInteraction, InteractionType, EmbedBuilder, PermissionFlagsBits, ComponentType, SlashCommandBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const { execute } = require('../../../events/client/start_bot/ready');
const { User } = require(`../../../schemas/userdata`)
const { Guild } = require(`../../../schemas/guilddata`)
const { daysOfWeek, isURL, secondPage } = require(`../../../functions`);
const { Song, SearchResultType } = require('distube');
const wait = require(`node:timers/promises`).setTimeout
const moment = require(`moment`)
const cron = require(`node-cron`)
const linksInfo = require(`../../../discord structure/links.json`)
module.exports = {
    plugin: {
        id: "guildgames",
        name: "Совместные игры"
    },
    data: {
        name: "gg_pregamesong_set"
    },
    async execute(interaction, client) {
        try {
            const { member, guild, user, options } = interaction
            const guildData = await Guild.findOne({ id: guild.id })
            const songTr = interaction.fields.getTextInputValue(`gg_pregamesong`)
            const song = await songTr.split(`&`)[0]
            if (isURL(song) === false) return interaction.reply({
                content: `Песня должна быть ссылкой!`,
                ephemeral: true
            })
            let songDist
            try {
                songDist = await client.distube.search(song, {
                    limit: 1
                })
            }
            catch (e) {
                return interaction.reply({
                    content: `Песня не найдена! Проверьте правильный формат ссылки: \`https://www.youtube.com/watch?v=VIDEO_ID\`. Ничего после \`v=VIDEO_ID\` не должно быть`,
                    ephemeral: true
                })
            }

            if (songDist[0].duration > 600) return interaction.reply({
                content: `[Песня](${song}), которую вы попытались добавить, имеет длительность более 10 минут!`,
                ephemeral: true,
                embeds: []
            })
            guildData.guildgames.pregame_song = song
            guildData.save()
            await interaction.reply({
                content: `[Песня](${song}) была успешно установлена! Вы сможете услышать её за 10 минут до начала совместной игры!`,
                ephemeral: true,
                embeds: []
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
**ID модели**: \`${interaction.customId}\`
**Пользователь**: ${interaction.member}
**Канал**: ${interaction.channel}
**Опции**: \`\`\`json
${interaction.options.data.length <= 0 ? `{"status": false}` : options.join(`,\n`)}
\`\`\``)
            await admin.send(`◾`)
        }

    }
}