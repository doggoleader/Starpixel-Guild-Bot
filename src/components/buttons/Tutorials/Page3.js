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
        name: `tutorial3`
    },
    async execute(interaction, client) {
        try {
            const { user } = interaction
            await interaction.deferUpdate({ fetchReply: true })

            const list = await fs.readdirSync(`./src/components/buttons/Tutorials`).filter(fule => fule.endsWith(`.js`))
            const guild = await client.guilds.cache.get(`320193302844669959`)
            const member = await guild.members.fetch(user.id)
            if (!member || !member.roles.cache.has(`504887113649750016`)) return interaction.reply({
                content: `Вы не являетесь участником гильдии Starpixel! Чтобы использовать эту команду, вступите в гильдию!`,
                ephemeral: true
            })
            const message = interaction.message
            const askChannel = await guild.channels.fetch(ch_list.ask)
            const embed = new EmbedBuilder()
                .setTitle(`Туториал по Discord серверу гильдии`)
                .setDescription(`**Начало развития**
Помимо того, что при создании профиля вы получите доступ к основным функциям сервера, вы также сможете начать своё развитие на сервере. На протяжении всего вашего пути вы будете использовать такие каналы, как:
<#${ch_list.box}> - вы можете открывать коробки гильдии в данном канале. Чтобы узнать, какие коробки у вас имеются - откройте свой профиль. Подробнее о коробках вы узнаете позже.

<#${ch_list.achs}> - на нашем сервере вы можете выполнять различные достижения и получать за них награды. Подробнее о них вы узнаете позже.

<#${ch_list.rewards}> - посещая совместные игры, находясь в гильдии продолжительное время и набивая GXP, вы можете получить награды. Подробнее о них вы узнаете позже.

<#${ch_list.lvls}> - общайтесь в чате гильдии, открывайте коробки и проявляйте какую-либо активность, чтобы повышать ваш уровень. Подробнее о них вы узнаете позже.

<#${ch_list.pets}> - открывая коробки, вы можете получить питомца. Приходите на занятия к вашему питомцу и обучайтесь новым навыкам! Подробнее о питомцах вы также узнаете позже.

<#${ch_list.ranks}> - чтобы открыть новые возможности в гильдии, вы можете повышать ваш ранг. Чем выше ваш ранг, тем больше вы откроете для себя нового! Подробнее о них вы узнаете позже.`)
                .setColor(Number(linksInfo.bot_color))
                .setFooter({ text: `Если у вас есть какие-либо вопросы, вы можете задать их в ${askChannel.name}! • Страница 3/${list.length}` })
                .setTimestamp(Date.now())

            const buttons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`tutorial2`)
                        .setDisabled(false)
                        .setEmoji(`⬅`)
                        .setStyle(ButtonStyle.Danger)
                        .setLabel(`Предыдущая`)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`tutorial4`)
                        .setDisabled(false)
                        .setEmoji(`➡`)
                        .setStyle(ButtonStyle.Success)
                        .setLabel(`Следующая`)
                )


            await message.edit({
                embeds: [embed],
                components: [buttons],
                files: [],
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