const { ContextMenuCommandBuilder, ApplicationCommandType, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, ModalSubmitInteraction, InteractionType, EmbedBuilder, PermissionFlagsBits, ComponentType, SlashCommandBuilder } = require('discord.js');
const { execute } = require('../../events/client/start_bot/ready');
const { User } = require(`../../schemas/userdata`)
const linksInfo = require(`../../discord structure/links.json`)

module.exports = {
    category: `officer`,
    plugin: {
        id: "admin",
        name: "Административное"
    },
    data: new SlashCommandBuilder()
        .setName(`warn`)
        .setDescription(`Выдать предупреждение пользователю`)
        .setDMPermission(false)
        .addUserOption(option => option
            .setName(`пользователь`)
            .setDescription(`Пользователь, которому нужно выдать предупреждение`)
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName(`причина`)
            .setDescription(`Причина предупреждения`)
            .setRequired(true)
            .setChoices(
                {
                    name: `Правило №1`,
                    value: `Правило №1`
                },
                {
                    name: `Правило №2`,
                    value: `Правило №2`
                },
                {
                    name: `Правило №3`,
                    value: `Правило №3`
                },
                {
                    name: `Правило №4`,
                    value: `Правило №4`
                },
                {
                    name: `Правило №5`,
                    value: `Правило №5`
                },
                {
                    name: `Правило №6`,
                    value: `Правило №6`
                },
                {
                    name: `Правило №7`,
                    value: `Правило №7`
                },
                {
                    name: `Правило №8`,
                    value: `Правило №8`
                },
                {
                    name: `Правило №9`,
                    value: `Правило №9`
                },
                {
                    name: `Правило №10`,
                    value: `Правило №10`
                },
                {
                    name: `Правило №11`,
                    value: `Правило №11`
                },
                {
                    name: `Правило №12`,
                    value: `Правило №12`
                },
                
            )
        )
    ,
    async execute(interaction, client) {
        try {
           
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: `❗ Вы не можете использовать это!`
                })
                .setDescription(`Недостаточно прав для использования данной команды`)
                .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                .setColor(`DarkRed`)
                .setTimestamp(Date.now())
            const user = interaction.member
            if (!user.roles.cache.has(`320880176416161802`) && !user.roles.cache.has(`563793535250464809`)) return interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
            const member = interaction.options.getMember(`пользователь`)
            if (member.user.id == user.user.id) return interaction.reply({
                content: `Вы не можете выдать предупреждение самому себе!`,
                ephemeral: true
            })
            if (!member.roles.cache.has(`504887113649750016`)) return interaction.reply({
                content: `Данный участник не находится в гильдии!`,
                ephemeral: true
            })
            const userData = await User.findOne({ userid: member.user.id })
            const reason = interaction.options.getString(`причина`)
            const n1 = [`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`, `N`, `O`, `P`, `Q`, `R`, `S`, `T`, `U`, `V`, `W`, `X`, `Y`, `Z`, `0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`]
            let r1 = n1[Math.floor(Math.random() * n1.length)]
            let r2 = n1[Math.floor(Math.random() * n1.length)]
            let r3 = n1[Math.floor(Math.random() * n1.length)]
            let r4 = n1[Math.floor(Math.random() * n1.length)]
            let r5 = n1[Math.floor(Math.random() * n1.length)]
            let r6 = n1[Math.floor(Math.random() * n1.length)]
            let r7 = n1[Math.floor(Math.random() * n1.length)]
            const date = new Date()
            const warn_code = `${r1}${r2}${r3}${r4}${r5}${r6}${r7}-${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}_${date.getHours()}${date.getMinutes()}${date.getSeconds()}`
            userData.warn_info.push({
                user: member.user.id,
                moderator: user.user.id,
                reason: reason,
                date: date,
                warn_code: warn_code
            })
            userData.save()
            client.Warnings()
            const warning = new EmbedBuilder()
                .setTitle(`Выдано предупреждение`)
                .setColor(Number(linksInfo.bot_color))
                .setThumbnail(member.displayAvatarURL())
                .setTimestamp(Date.now())
                .setDescription(`Вам выдано предупреждение! Причина: \`${reason}\`! Пожалуйста, ознакомьтесь с <#774546154209148928>! 

Модератор: ${user}
Код предупреждения: \`${warn_code}\`

Текущее количество предупреждений: ${userData.warn_info.length}`)

            await interaction.reply({
                content: `${member}`,
                embeds: [warning]
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
**Команда**: \`${interaction.commandName}\`
**Пользователь**: ${interaction.member}
**Канал**: ${interaction.channel}
**Опции**: \`\`\`json
${interaction.options.data.length <= 0 ? `{"status": false}` : options.join(`,\n`)}
\`\`\``)
            await admin.send(`◾`)
        }


    }
}