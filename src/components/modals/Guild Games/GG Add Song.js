const { ContextMenuCommandBuilder, ApplicationCommandType, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, ModalSubmitInteraction, InteractionType, EmbedBuilder, PermissionFlagsBits, ComponentType, SlashCommandBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');

const { User } = require(`../../../schemas/userdata`)
const { Guild } = require(`../../../schemas/guilddata`)
const { daysOfWeek, isURL, secondPage } = require(`../../../functions`);
const { Song, SearchResultType } = require('distube');
const wait = require(`node:timers/promises`).setTimeout
const moment = require(`moment`)
const cron = require(`node-cron`)
const linksInfo = require(`../../../discord structure/links.json`)
/**
 * 
 * @param {import("discord.js").ModalSubmitInteraction} interaction Interaction
 * @param {import("../../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        const { member, guild, user, options } = interaction
        const guildData = await Guild.findOne({ id: guild.id })
        const songLinkTr = interaction.fields.getTextInputValue(`gg_songlink`)
        const songLink = await songLinkTr.split(`&`)[0]
        const song = await guildData.guildgames.music.find(m => m.link == songLink)
        if (song) return interaction.reply({
            content: `Такая песня уже существует в плейлисте!`,
            ephemeral: true
        })
        if (isURL(songLink) === false) return interaction.reply({
            content: `Песня должна быть ссылкой!`,
            ephemeral: true
        })
        let songDist = await client.distube.search(songLink, {
            limit: 1,
            type: SearchResultType.VIDEO
        })
        if (songDist[0].duration > 600) return interaction.reply({
            content: `[Песня](${songLink}), которую вы попытались добавить, имеет длительность более 5 минут!`,
            ephemeral: true,
            embeds: []
        })
        guildData.guildgames.music.push({
            link: songLink,
            usedTimes: 0,
            sent: client.user.id
        })
        guildData.save()
        await interaction.reply({
            content: `[Песня](${songLink}) была успешно добавлена в плейлист!`,
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
**ID модели**: \`${interaction.customId}\`
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
        name: "gg_addsong"
    },
    execute
}