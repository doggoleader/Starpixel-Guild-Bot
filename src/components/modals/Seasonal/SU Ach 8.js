const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, channelLink, ChannelType, EmbedBuilder, } = require('discord.js');
const { Apply } = require(`../../../schemas/applications`)
const linksInfo = require(`../../../discord structure/links.json`)
const ch_list = require(`../../../discord structure/channels.json`);
const { User } = require('../../../schemas/userdata');
const { Guild } = require('../../../schemas/guilddata');
const roles_info = require(`../../../discord structure/roles.json`)
const chalk = require('chalk')
module.exports = {
    plugin: {
        id: "seasonal",
        name: "Сезонное"
    },
    data: {
        name: "modal_seasonal_su_8"
    },
    async execute(interaction, client) {
        try {
            const { guild, member, user } = interaction
            const guildData = await Guild.findOne({ id: guild.id })
            const userData = await User.findOne({ userid: user.id })


            const no_condition = new EmbedBuilder()
                .setColor(`DarkRed`)
                .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                .setAuthor({
                    name: `❗ Неверное слово`
                })
                .setDescription(`Вы не отгадали тайное слово! Повторите попытку ещё раз.`)
                .setTimestamp(Date.now())

            let answer = interaction.fields.getTextInputValue(`word`);
            if (!answer || answer.toLowerCase() !== guildData.seasonal.summer.secret_word) return interaction.reply({
                embeds: [no_condition],
                ephemeral: true
            })
            let reward = `1104095303054934168`
            let name = `Летний сюрприз`
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
            userData.seasonal.summer.achievements.num8 = true

            userData.rank += 50
            userData.exp += 300;
            userData.seasonal.summer.points += 5
            userData.save()
            client.ActExp(userData.userid)
            const condition_meet = new EmbedBuilder()
                .setColor(Number(linksInfo.bot_color))
                .setThumbnail(`https://i.imgur.com/Xa6HxCU.png`)
                .setTitle(`✅ Достижение выполнено!`)
                .setTimestamp(Date.now())
                .setDescription(`${member} выполнил достижение \`${name}\`!
Он уже получил достижение! Хочешь и ты? Тогда тебе в <#${ch_list.su_achs}>

Чтобы проверить статистику ваших достижений, используйте меню статистики в канале <#${ch_list.su_main}>!`)


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