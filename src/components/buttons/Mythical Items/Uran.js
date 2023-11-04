const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ComponentType, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const fetch = require(`node-fetch`)
const { joinVoiceChannel } = require('@discordjs/voice');
const { execute } = require('../../../events/client/start_bot/ready');
const wait = require(`node:timers/promises`).setTimeout
const api = process.env.hypixel_apikey;
const { Temp } = require(`../../../schemas/temp_items`);
const { User } = require(`../../../schemas/userdata`)
const { Guild } = require(`../../../schemas/guilddata`)
const chalk = require(`chalk`);
const prettyMilliseconds = require(`pretty-ms`); //ДОБАВИТЬ В ДРУГИЕ
const linksInfo = require(`../../../discord structure/links.json`)
const ch_list = require(`../../../discord structure/channels.json`)
const { isOneEmoji } = require(`is-emojis`)
module.exports = {
    plugin: {
        id: "items",
        name: "Предметы"
    },
    data: {
        name: "myth_uran"
    },
    async execute(interaction, client) {
        try {
            const { guild, member, user } = interaction
            const guildData = await Guild.findOne({ id: guild.id })
            const userData = await User.findOne({ userid: user.id })
            let role = `745326453369077841`
            const no_role = new EmbedBuilder()
                .setAuthor({
                    name: `❗ Отсутствует необходимая роль!`
                })
                .setDescription(`Вы должны иметь роль \`${interaction.guild.roles.cache.get(role).name}\`, чтобы использовать данную команду!`)
                .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                .setColor(`DarkRed`)
                .setTimestamp(Date.now())

            if (!member.roles.cache.has(role)) return interaction.reply({
                embeds: [no_role],
                ephemeral: true
            })

            const modal = new ModalBuilder()
            .setCustomId(`myth_changeemoji`)
            .setTitle(`Изменить эмоджи`)
            .addComponents(
                new ActionRowBuilder()
                .addComponents(
                    new TextInputBuilder()
                    .setCustomId(`myth_emoji`)
                    .setLabel(`Новый эмоджи`)
                    .setPlaceholder(`Введите один эмоджи`)
                    .setRequired(true)
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