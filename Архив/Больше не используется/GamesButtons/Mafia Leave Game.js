const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } = require('discord.js');
const { Games } = require(`../../../schemas/games`)
const linksInfo = require(`../../../discord structure/links.json`)
const chalk = require(`chalk`)

module.exports = {
    data: {
        name: "mafia_leave"
    },
    async execute(interaction, client) {
        try {
            const gameData = await Games.findOne({ messageid: interaction.message.id })
            if (!gameData) return interaction.message.delete()
            let pl = gameData.mafia.players.find(u => u.userid == interaction.user.id)
            if (!pl) return interaction.reply({
                content: `Вы не состоите в игре!`,
                ephemeral: true
            })
            let i = gameData.mafia.players.findIndex(u => u.userid == interaction.user.id)
            gameData.mafia.players.splice(i, 1)
            gameData.save()
            const players = await gameData.mafia.players.map((pl, i) => {
                return `**${++i}** <@${pl.userid}> 🕑`
            })
            const embed = new EmbedBuilder()
                .setColor(Number(linksInfo.bot_color))
                .setTitle(`Игра в мафию`)
                .setDescription(`<@${gameData.started_by}> создал комнату в игре в Мафию!
**Роли игры**:
__Мирные жители.__ Они, по сути, не выполняют никаких функций. Их основная задача – выяснить, кто же является мафией и убивает ни в чём не повинных горожан.
__Мафия__ – это самые главные злодеи, которые по ночам убивают мирных жителей. Мафиози может быть два, три или даже больше, в зависимости от общего количества игроков.
__Доктор__ может лечить горожан, убитых мафией.
__Любовница__ – персонаж вспомогательный. Этот игрок проводит ночь с одним из участников игры и тем самым спасает его от гибели, если на него будут покушаться мафиози.
__Комиссар__ следит за порядком и может арестовывать подозреваемых в убийствах.
__Маньяк.__ Он может занять сторону как мирных жителей, так и мафии или просто играть за себя и защищать собственные интересы. По ночам он может убивать всех: мирных жителей и мафию.

**Необходимое количество игроков для начала**: 5 игроков

**Игроков**
${players.join(`\n`)}`)
            await interaction.message.edit({
                embeds: [embed]
            })
            await interaction.reply({
                content: `Вы покинули игру в Мафию!`,
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
}
