const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { execute } = require('../../../events/client/start_bot/ready');
const { ClientSettings } = require(`../../../schemas/client`)
const linksInfo = require(`../../../discord structure/links.json`);
const { User } = require('../../../schemas/userdata');
const ch_list = require(`../../../discord structure/channels.json`)
const fs = require(`fs`)

module.exports = {
    plugin: {
        id: "misc",
        name: "Разное"
    },
    data: {
        name: `tutorial7`
    },
    async execute(interaction, client) {
        try {
            const { user } = interaction
            await interaction.deferUpdate()

            const list = await fs.readdirSync(`./src/components/buttons/Tutorials`).filter(fule => fule.endsWith(`.js`))
            const guild = await client.guilds.cache.get(`320193302844669959`)
            const member = await guild.members.fetch(user.id)
            if (!member || !member.roles.cache.has(`504887113649750016`)) return interaction.reply({
                content: `Вы не являетесь участником гильдии Starpixel! Чтобы использовать эту команду, вступите в гильдию!`,
                ephemeral: true
            })
            const message = interaction.message
            const askChannel = await guild.channels.fetch(ch_list.ask)

            const attach = new AttachmentBuilder()
                .setFile(`./src/assets/Tutorials/RankExp.png`)
                .setName(`RankExp.png`)
            const embed = new EmbedBuilder()
                .setTitle(`Туториал по Discord серверу гильдии`)
                .setDescription(`**Опыт рангов и ранги гильдии**
Открывая коробки, вы также получаете опыт рангов, с помощью которого вы повышаете свой ранг. О количестве необходимого опыта и возможностях каждого ранга вы можете прочитать в <#${ch_list.ranks}>. 

В гильдии есть 11 основных рангов:
• Новичок
• Специалист
• Профессионал
• Мастер
• Чемпион
• Звёздочка
• Легенда
• Владыка
• Лорд\*
• Император\*
• Повелитель\*

\*Эти ранги доступны после того, как вы достигните ранга "Владыка" и начнёте развитие заново.`)
                .setColor(Number(linksInfo.bot_color))
                .setFooter({ text: `Если у вас есть какие-либо вопросы, вы можете задать их в ${askChannel.name}! • Страница 7/${list.length}` })
                .setTimestamp(Date.now())
                .setImage(`attachment://${attach.name}`)

            const buttons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`tutorial6`)
                        .setDisabled(false)
                        .setEmoji(`⬅`)
                        .setStyle(ButtonStyle.Danger)
                        .setLabel(`Предыдущая`)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`tutorial8`)
                        .setDisabled(false)
                        .setEmoji(`➡`)
                        .setStyle(ButtonStyle.Success)
                        .setLabel(`Следующая`)
                )


            await message.edit({
                embeds: [embed],
                components: [buttons],
                files: [attach],
                attachments: []
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
};