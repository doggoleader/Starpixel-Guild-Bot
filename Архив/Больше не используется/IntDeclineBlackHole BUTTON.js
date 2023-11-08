const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, channelLink, ChannelType, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { Apply } = require(`../../../schemas/applications`)
const linksInfo = require(`../../../discord structure/links.json`)
const ch_list = require(`../../../discord structure/channels.json`);
const { User } = require('../../../schemas/userdata');
const fs = require(`fs`)
module.exports = {
    data: {
        name: "black_hole_dec"
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
            let stream = await fs.createWriteStream(`./src/components/buttons/Black Hole/UserDatas/userData-${userData.nickname}.json`)
            let json = JSON.stringify(userData, (_, v) => typeof v === 'bigint' ? v.toString() : v)
            stream.once('open', function (fd) {
                stream.write(json);
                stream.end();
            });
            const channel = await interaction.guild.channels.fetch(ch_list.hypixelThread)
            await channel.send(`/g kick ${userData.nickname} СИСТЕМА "ЧЁРНАЯ ДЫРА": При прохождении собеседования о вашей неактивности было вынесено отрицательное решение.`)

            const file = new AttachmentBuilder()
                .setFile(`./src/components/buttons/Black Hole/UserDatas/userData-${userData.nickname}.json`)
                .setName(`userData-${userData.nickname}.json`)
            await interaction.reply({
                content: `К сожалению, пользователь <@${userData.userid}> не прошел собеседование и был исключён из гильдии окончательно!`,
                files: [file]
            })

            await interaction.channel.setLocked(true)
            await interaction.channel.setArchived(true)

            await member.roles.set([])
            let stream2 = await fs.createWriteStream(`./src/files/Database/Profile.json`)
            let json2 = JSON.stringify(userData, (_, v) => typeof v === 'bigint' ? v.toString() : v)
            stream2.once('open', function (fd) {
                stream2.write(json2);
                stream2.end();
            });

            let interactionChannel = await interaction.guild.channels.fetch(`1114239308853936240`)
            let attach = new AttachmentBuilder()
                .setFile(`./src/files/Database/Profile.json`)
                .setName(`Profile.json`)

            await interactionChannel.send({
                content: `**Имя пользователя**: \`${userData.displayname.name}\`
**ID Discord**: \`${userData.userid}\`
**Никнейм**: \`${userData.nickname}\`
**UUID**: \`${userData.uuid}\``,
                files: [attach]
            })
            userData.delete()
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