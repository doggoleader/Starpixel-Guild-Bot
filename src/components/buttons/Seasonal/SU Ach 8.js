const { Birthday } = require(`../../../schemas/birthday`)
const { Temp } = require(`../../../schemas/temp_items`)
const { User } = require(`../../../schemas/userdata`)
const { Guild } = require(`../../../schemas/guilddata`)
const chalk = require(`chalk`)
const fetch = require(`node-fetch`)
const cron = require(`node-cron`)
const prettyMilliseconds = require(`pretty-ms`)
const ch_list = require(`../../../discord structure/channels.json`)
const { EmbedBuilder, SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js")
const { execute } = require('../../../events/client/start_bot/ready');
const { achievementStats, found, getProperty } = require(`../../../functions`)
const linksInfo = require(`../../../discord structure/links.json`)
const api = process.env.hypixel_apikey
module.exports = {
    plugin: {
        id: "seasonal",
        name: "Сезонное"
    },
    data: {
        name: `season_summer_ach8`
    },
    async execute(interaction, client) {
        try {
            const { guild, member, user } = interaction
            const guildData = await Guild.findOne({ id: guild.id })
            const userData = await User.findOne({ userid: user.id })
            const already_done = new EmbedBuilder()
                .setColor(`DarkRed`)
                .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                .setAuthor({
                    name: `❗ Достижение уже выполнено!`
                })
                .setDescription(`Вы не можете выполнить данное достижение, так как вы уже выполнили его! Найти его вы можете в своем профиле.
    
Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)


            if (userData.seasonal.summer.achievements.num8 === true) return interaction.reply({
                embeds: [already_done],
                ephemeral: true
            })

            const guessed = new EmbedBuilder()
                .setColor(`DarkRed`)
                .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                .setAuthor({
                    name: `❗ Слово отгадано`
                })
                .setDescription(`Тайное слово отгадано! Подождите, пока появится новое слово.`)
                .setTimestamp(Date.now())

            if (guildData.seasonal.summer.secret_guessed == true) return interaction.reply({
                embeds: [guessed],
                ephemeral: true
            })
            const modal = new ModalBuilder()
                .setCustomId(`modal_seasonal_su_8`)
                .setTitle(`Тайная команда`)
                .addComponents(
                    new ActionRowBuilder()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId(`word`)
                                .setLabel(`Тайное слово`)
                                .setRequired(true)
                                .setPlaceholder(`Введите тайное слово`)
                                .setStyle(TextInputStyle.Short)
                        )
                )
            await interaction.showModal(modal)

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
