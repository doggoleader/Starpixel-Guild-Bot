const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ComponentType, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const fetch = require(`node-fetch`)
const { joinVoiceChannel } = require('@discordjs/voice');
const { execute } = require('../../src/events/client/start_bot/ready');
const wait = require(`node:timers/promises`).setTimeout
const api = process.env.hypixel_apikey;
const { Temp } = require(`../../src/schemas/temp_items`);
const { User } = require(`../../src/schemas/userdata`)
const { Guild } = require(`../../src/schemas/guilddata`)
const chalk = require(`chalk`);
const prettyMilliseconds = require(`pretty-ms`); //ДОБАВИТЬ В ДРУГИЕ
const linksInfo = require(`../../src/discord structure/links.json`)
const ch_list = require(`../../src/discord structure/channels.json`)
const { isOneEmoji } = require(`is-emojis`)
module.exports = {
    data: {
        name: "event_applications"
    },
    async execute(interaction, client) {
        try {
            const { guild, member, user } = interaction
            const userData = await User.findOne({ userid: user.id })
            let r1 = interaction.fields.getTextInputValue("f_1")
            let r2 = interaction.fields.getTextInputValue("f_2")
            let r3 = interaction.fields.getTextInputValue("f_3")

            const embed = new EmbedBuilder()
            .setColor(Number(linksInfo.bot_color))
            .setDescription(`# Заявка на участие в событии
Пользователь: ${member}

Ваше имя: \`${r1}\`
Ваш никнейм: \`${r2}\`
Почему вы хотите поучаствовать в событии? \`${r3}\``)
            .setTimestamp(Date.now())
        
            userData.seasonal.summer.events.last_event_applied = true
            userData.save()
            
            const ch = await guild.channels.fetch(`1142817710489743480`)
            await ch.send({
                embeds: [embed]
            })

            await interaction.reply({
                content: `Спасибо`
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