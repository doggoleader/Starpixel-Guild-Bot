const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, channelLink, ChannelType, EmbedBuilder, } = require('discord.js');
const { Apply } = require(`../../../schemas/applications`)
const linksInfo = require(`../../../discord structure/links.json`)
const ch_list = require(`../../../discord structure/channels.json`);
const { User } = require('../../../schemas/userdata');
module.exports = {
    data: {
        name: "black_hole_acc"
    },
    async execute(interaction, client) {
        try {
            if (!interaction.member.roles.cache.has(`563793535250464809`)) return interaction.reply({
                content: `Вы не можете использовать эту кнопку!`,
                ephemeral: true
            })
            const userData = await User.findOne({
                "black_hole.info.stage3_thread": interaction.channel.id
            })
            const member = await interaction.guild.members.fetch(userData.userid)
            await interaction.reply({
                content: `Пользователь <@${userData.userid}> прошёл собеседование и вернулся в гильдию!`
            })

            await interaction.channel.setLocked(true)
            await interaction.channel.setArchived(true)
            const channel = await interaction.guild.channels.fetch(ch_list.hypixelThread)
            await channel.send(`/g invite ${userData.nickname}`)
            userData.black_hole.stage = 0
            userData.black_hole.info.stage1_thread = ``
            userData.black_hole.info.stage3_thread = ``
            userData.black_hole.info.next_stage = ``
            userData.black_hole.enabled = false
            await member.roles.set(userData.black_hole.info.roles)
            userData.save()
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