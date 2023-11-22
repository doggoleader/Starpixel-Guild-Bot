const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const { execute } = require('../../../src/events/client/start_bot/ready');
const fetch = require(`node-fetch`);
const api = process.env.hypixel_apikey;
const { User } = require(`../../../src/schemas/userdata`)
const { Guild } = require(`../../../src/schemas/guilddata`)
const chalk = require(`chalk`);
const prettyMilliseconds = require(`pretty-ms`); //ДОБАВИТЬ В ДРУГИЕ
const linksInfo = require(`../../../src/discord structure/links.json`)

module.exports = {
    category: `prem`,
    plugin: `info`,
    data: new SlashCommandBuilder()
        .setName(`boost`)
        .setDescription(`Забустить участника гильдии`)
        .setDMPermission(false)
        .addUserOption(option => option
            .setName(`пользователь`)
            .setDescription(`Пользователь, которого вы хотите забустить`)
            .setRequired(true)
        ),

    async execute(interaction, client) {
        try {
            const pluginData = await Guild.findOne({ id: interaction.guild.id })
            if (pluginData.plugins.premium === false) return interaction.reply({ content: `Данный плагин отключён! Попробуйте позже!`, ephemeral: true })
            const member = interaction.options.getMember(`пользователь`)
            const user = interaction.member
            const userData = await User.findOne({ userid: user.user.id })

            const embed = new EmbedBuilder()
                .setAuthor({
                    name: `❗ Отсутствует необходимая роль!`
                })
                .setDescription(`Вы должны иметь \`${interaction.guild.roles.cache.get(`1007290182883622974`).name}\` или выше, чтобы использовать эту команду!`)
                .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                .setColor(`DarkRed`)
                .setTimestamp(Date.now())
            if (userData.sub_type < 3) return interaction.reply({
                embeds: [embed],
                ephemeral: true
            })

            const cd = new EmbedBuilder()
                .setColor(Number(linksInfo.bot_color))
                .setAuthor({
                    name: `Вы не можете использовать эту команду`
                })
                .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${prettyMilliseconds(userData.cooldowns.boost - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}!`)
                .setTimestamp(Date.now())
                .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)

            if (userData.cooldowns.boost > Date.now()) return interaction.reply({
                embeds: [cd],
                ephemeral: true
            });

            const wrong_member = new EmbedBuilder()
                .setAuthor({
                    name: `❗ Произошла ошибка!`
                })
                .setColor(`DarkRed`)
                .setDescription(`Вы не можете бустить себя! Повторите попытку ещё раз с другим пользователем!`)
                .setTimestamp(Date.now())
                .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)

            if (member.id === user.user.id) return interaction.reply({
                embeds: [wrong_member],
                ephemeral: true
            })

            const member_bot = new EmbedBuilder()
                .setAuthor({
                    name: `❗ Произошла ошибка!`
                })
                .setColor(`DarkRed`)
                .setDescription(`Вы не можете бустить ботов! Хоть они тоже живые, они отказались от такой ответственности. Выберите другого пользователя!`)
                .setTimestamp(Date.now())
                .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)

            if (member.user.bot) return interaction.reply({
                embeds: [member_bot],
                ephemeral: true
            })

            const member_guest = new EmbedBuilder()
                .setAuthor({
                    name: `❗ Произошла ошибка!`
                })
                .setColor(`DarkRed`)
                .setDescription(`Вы не можете бустить гостей гильдии! Выбранный вами пользователь должен быть участников гильдии Starpixel! Выберите другого пользователя!`)
                .setTimestamp(Date.now())
                .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)

            if (!member.roles.cache.has(`504887113649750016`)) return interaction.reply({
                embeds: [member_guest],
                ephemeral: true
            })
            await interaction.deferReply({ fetchReply: true })
            await interaction.deleteReply()
            
            const loot = [
                {
                    group: 1,
                    name: `Маленькую коробку`,
                    roleID: `510932601721192458`
                },
                {
                    group: 1,
                    name: `Мешочек`,
                    roleID: `819930814388240385`
                },
                {
                    group: 1,
                    name: `Большую коробку`,
                    roleID: `521248091853291540`
                }
            ]

            const r_loot = loot[Math.floor(Math.random() * loot.length)]
            const msg = await interaction.channel.send({
                content: `◾
**БУСТ-БУСТ-БУСТ!**
                
:zap: :credit_card: ${user} **БУСТИТ** участника.
${member} получает \`${r_loot.name}\`.
                
**БУСТ-БУСТ-БУСТ!**
◾`
            })
            if (r_loot.group == 1) {
                if (!member.roles.cache.has(r_loot.roleID)) {
                    member.roles.add(r_loot.roleID)
                    await msg.react(`✅`)
                } else {
                    await msg.react(`🚫`)
                }
            }


            userData.cooldowns.boost = Date.now() + (1000 * 60 * 60 * 24 * 7)
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
**Команда**: \`${interaction.commandName}\`
**Пользователь**: ${interaction.member}
**Канал**: ${interaction.channel}
**Опции**: \`\`\`json
${interaction.options.data.length <= 0 ? `{"status": false}` : options.join(`,\n`)}
\`\`\``)
            await admin.send(`◾`)
        }


    }
};