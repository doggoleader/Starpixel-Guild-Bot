const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

const { Apply } = require(`../../../schemas/applications`)
const linksInfo = require(`../../../discord structure/links.json`)
module.exports = {
    plugin: {
        id: "new_users",
        name: "Новые пользователи"
    },
    data: {
        name: "apply1"
    },
    async execute(interaction, client) {
        try {
            let appData = await Apply.findOne({ userid: interaction.user.id, guildid: interaction.guild.id }) || new Apply({ userid: interaction.user.id, guildid: interaction.guild.id })

            let r1 = interaction.fields.getTextInputValue("first")
            if (appData.onlinemode == "yes") {
                let r2 = interaction.fields.getTextInputValue("second")
                appData.que2 = r2
            } else {
                appData.que2 = null
            }
            let r3 = interaction.fields.getTextInputValue("third")
            let r4 = interaction.fields.getTextInputValue("fourth")
            let r5 = interaction.fields.getTextInputValue("fifth")
            appData.status = `На рассмотрении`
            appData.que1 = r1
            appData.que3 = r3
            appData.que4 = r4
            appData.que5 = r5
            appData.part1 = true
            try {
                let age = Number(r3)
                if (age <= 0) {
                    await interaction.reply({
                        content: `Возраст не должен быть отрицательным или нулевым!`,
                        ephemeral: true
                    })
                } else {
                    appData.part1 = true
                    await interaction.reply({
                        content: `Вы заполнили первую часть вашей заявки! Нажмите на кнопку \`Часть 2\`, чтобы заполнить вторую часть заявки.`,
                        ephemeral: true
                    })
                }

                appData.save()
            } catch (e) {
                await interaction.reply({
                    content: `Произошла ошибка при попытке обработать ваш возраст! Ваш возраст должен состоять только из цифр! Например: \`17\`

Примеры **НЕПРАВИЛЬНОГО** написания возраста в заявке:
\`17 лет\`
\`Мне 17 лет\`
\`17 лет, но через 2 недели будет уже 18\`

:warning: Не волнуйтесь, все ваши ответы были сохранены! Вам просто необходимо отредактировать строку с возрастом.`,
                    ephemeral: true
                })
                appData.save()
                return
            }
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