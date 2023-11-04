const { Birthday } = require(`../../../schemas/birthday`)
const { Temp } = require(`../../../schemas/temp_items`)
const { User } = require(`../../../schemas/userdata`)
const { Guild } = require(`../../../schemas/guilddata`)
const chalk = require(`chalk`)
const fetch = require(`node-fetch`)
const cron = require(`node-cron`)
const prettyMilliseconds = require(`pretty-ms`)
const ch_list = require(`../../../discord structure/channels.json`)
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js")
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
        name: `season_halloween_ach1`
    },
    async execute(interaction, client) {
        try {
            const guildData = await Guild.findOne({ id: interaction.guild.id })
            if (guildData.plugins.seasonal === false) return interaction.reply({ content: `Данный плагин отключён! Попробуйте позже!`, ephemeral: true })
            if (guildData.seasonal.halloween.enabled === false) return interaction.reply({
                content: `Сейчас не время для Хэллоуина! Попробуйте сделать это в период с **7 октября по 7 ноября**!`,
                ephemeral: true
            })
            const userData = await User.findOne({ userid: interaction.user.id })
            const { member, guild, user, channel } = interaction
            const already_done = new EmbedBuilder()
                .setColor(`DarkRed`)
                .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                .setAuthor({
                    name: `❗ Достижение уже выполнено!`
                })
                .setDescription(`Вы не можете выполнить данное достижение, так как вы уже выполнили его! Найти его вы можете в своем профиле.
    
Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)


            if (userData.seasonal.halloween.achievements.num1 === true) return interaction.reply({
                embeds: [already_done],
                ephemeral: true
            })

            const no_condition = new EmbedBuilder()
                .setColor(`DarkRed`)
                .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                .setAuthor({
                    name: `❗ Вы не соответствуете требованиям!`
                })
                .setDescription(`Вы не соответствуете требованиям для получения данного достижения! Проверить требования вы можете в канале <#${ch_list.hw_achs}>.
    
Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)
                .setTimestamp(Date.now())

            if (!member.roles.cache.has(`893927886766096384`)) return interaction.reply({
                embeds: [no_condition],
                ephemeral: true
            })
            let reward = `893932177799135253`
            let name = `Призраки`
            if (member.roles.cache.has(reward)) {
                if (userData.stacked_items.length < userData.upgrades.inventory_size) {
                    await userData.stacked_items.push(reward)
                    await interaction.reply({
                        content: `Награда была добавлена в инвентарь! Чтобы получить награду, откройте коробки и пропишите команду </rewards claim:1055546254240784492>! Для просмотра списка неполученных наград пропишите </rewards unclaimed:1055546254240784492>!`,
                        ephemeral: true
                    })
                } else return interaction.reply({
                    content: `Мы не можем добавить предмет в ваш инвентарь, так как он переполнен. Чтобы увеличить вместительность своего инвентаря, перейдите в канал <#1141026403765211136>!`,
                    ephemeral: true
                })
            } else {
                await member.roles.add(reward)
                await interaction.deferUpdate()
            }
            userData.seasonal.halloween.achievements.num1 = true
            userData.rank += 50
            userData.exp += 300;
            userData.seasonal.halloween.points += 5
            userData.save()
            client.ActExp(userData.userid)
            const condition_meet = new EmbedBuilder()
                .setColor(Number(linksInfo.bot_color))
                .setThumbnail(`https://i.imgur.com/Xa6HxCU.png`)
                .setTitle(`✅ Достижение выполнено!`)
                .setTimestamp(Date.now())
                .setDescription(`${member} выполнил достижение \`${name}\`!
Он уже получил достижение! Хочешь и ты? Тогда тебе в <#1029662737497866300>

Чтобы проверить статистику ваших достижений, используйте меню статистики в канале <#1029662597848498197>!`)


            await interaction.guild.channels.cache.get(ch_list.act).send(
                `╒══════════════════╕
${member} +300 🌀
\`Выполнение достижения.\`
╘══════════════════╛`)

            await interaction.guild.channels.cache.get(ch_list.rank).send(
                `╒══════════════════╕
${member} +50 💠
\`Выполнение достижения.\`
╘══════════════════╛`)
            await interaction.guild.channels.cache.get(ch_list.main).send({
                embeds: [condition_meet]
            })
            console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magenta(`[Выполнено достижение]` + chalk.gray(`: ${member.user.username} выполнил достижение ${name}!`)))

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
