const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ComponentType, ButtonStyle } = require('discord.js');
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
        name: "myth_mars"
    },
    async execute(interaction, client) {
        try {
            const { guild, member, user } = interaction
            const guildData = await Guild.findOne({ id: guild.id })
            const userData = await User.findOne({ userid: user.id })
            if (!userData.onlinemode) return interaction.reply({
                content: `Вы не можете использовать Марс, так как у вас нелицензированный аккаунт!`,
                ephemeral: true
            })
            let role = `597746057203548160`
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

            const cd = new EmbedBuilder()
                .setColor(Number(linksInfo.bot_color))
                .setAuthor({
                    name: `Вы не можете использовать эту команду`
                })
                .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${prettyMilliseconds(userData.cooldowns.mars - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}!`)

            if (userData.cooldowns.mars > Date.now()) return interaction.reply({
                embeds: [cd],
                ephemeral: true
            })

            const quests = require(`../../../jsons/Quests.json`)

            const quest = quests.mars[Math.floor(Math.random() * quests.mars.length)]

            const ids = quest.quest_code.split(`.`)
            if (quest.id !== 2) {
                const response = await fetch(`https://api.hypixel.net/player?uuid=${userData.uuid}`, {
                    headers: {
                        "API-Key": api,
                        "Content-Type": "application/json"
                    }
                })
                if (response.ok) {
                    let json = await response.json()
                    let gameInfo = json.player.stats[ids[0]][ids[1]]
                    if (!gameInfo) gameInfo = 0
                    userData.quests.mars.activated.status = false
                    userData.quests.mars.activated.id = quest.id
                    userData.quests.mars.activated.required = quest.require + gameInfo
                }
            } else if (quest.id == 2) {
                const response = await fetch(`https://api.hypixel.net/guild?player=${userData.uuid}`, {
                    headers: {
                        "API-Key": api,
                        "Content-Type": "application/json"
                    }
                })
                if (response.ok) {
                    let json = await response.json()
                    let gMember = json.guild.members.find(member => member.uuid == userData.uuid)
                    if (!gMember) return interaction.reply({
                        content: `По какой-то причине вас не удалось найти в гильдии на Hypixel! Пожалуйста, попробуйте ещё раз и, если ошибка повторится, свяжитесь с администрацией гильдии, указав ваш никнейм!`,
                        ephemeral: true
                    })
                    userData.quests.mars.activated.status = false
                    userData.quests.mars.activated.id = quest.id
                    userData.quests.mars.activated.required = quest.require
                }
            }
            await interaction.reply({
                content: `:older_woman: ${user} просит помощи у Марса!

:scroll: Для это ему необходимо пройти испытание:
\`${quest.quest}\`
:crown: В качестве награды он получит ${quest.reward}!
💒 Чтобы посмотреть информацию о вашем текущем квесте или закончить его, пропишите команду \`/quests mars\`!

Повторно попросить помощь у Марса можно через 2 недели!`,
                ephemeral: true
            })
            userData.cooldowns.mars = Date.now() + (1000 * 60 * 60 * 24 * 14)
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