const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, StringSelectMenuBuilder } = require('discord.js');
const { Apply } = require(`../../../schemas/applications`)
const linksInfo = require(`../../../discord structure/links.json`);
const { Polls } = require(`../../../schemas/polls`)
const { User } = require('../../../schemas/userdata');
module.exports = {
    plugin: {
        id: "misc",
        name: "Разное"
    },
    data: {
        name: "create_poll"
    },
    async execute(interaction, client) {
        try {
            await interaction.deferReply({ fetchReply: true, ephemeral: true })
            const userData = await User.findOne({ userid: interaction.user.id, guildid: interaction.guild.id })
            const pollData = new Polls({ userid: interaction.user.id, guildid: interaction.guild.id, channelid: interaction.channel.id })
            let name = interaction.fields.getTextInputValue("poll_name")
            let description = interaction.fields.getTextInputValue("poll_description")
            let min_amount = interaction.fields.getTextInputValue("poll_minamount")
            try {
                Number(min_amount)
            } catch (e) {
                return interaction.editReply({
                    content: `\`${min_amount}\` не является числом! (Минимальное значение)`,
                    ephemeral: true
                })
            }
            if (Number(min_amount) < 1 || Number(min_amount) > 25) return interaction.editReply({
                content: `Количество минимальных опций не должно быть меньше 1 и больше 25!`,
                ephemeral: true
            })
            let max_amount = interaction.fields.getTextInputValue("poll_maxamount")
            try {
                Number(max_amount)
            } catch (e) {
                return interaction.editReply({
                    content: `\`${max_amount}\` не является числом! (Максимальное значение)`,
                    ephemeral: true
                })
            }
            if (Number(max_amount) < 1 || Number(max_amount) > 25 || min_amount > max_amount) return interaction.editReply({
                content: `Количество максимальных опций не должно быть меньше 1 и больше 25, а также должно быть больше, чем минимальное количество опций!`,
                ephemeral: true
            })
            pollData.question = name;
            pollData.min_amount = Number(min_amount)
            pollData.amount = Number(max_amount);
            pollData.description = description
            if (pollData.options.length >= 1) {
                map = pollData.options.map((option, i) => {
                    let emoji
                    if (!option?.emoji) emoji = ` `
                    else emoji = option.emoji

                    return `**№${++i}.** ${emoji} ${option.label} (${option.description})`
                }).join(`\n`)
            } else {
                map = `\`Нет опций.\``
            }

            let expire = pollData.expire_minutes
            const embed = new EmbedBuilder()
                .setColor(Number(linksInfo.bot_color))
                .setTitle(`Настройка опроса`)
                .setDescription(`**ОСНОВНАЯ ИНФОРМАЦИЯ**
**Вопрос**: \`${name}\`
**Минимальное количество вариантов**: \`${pollData.min_amount}\`
**Максимальное количество вариантов**: \`${pollData.amount}\`
**Длительность опроса**: \`${expire} минут\`
**Описание опроса**
${pollData.description}

Это сообщение является основным для создания опроса. Если вы его удалите, создание опроса будет отменено автоматически! Используйте меню ниже, чтобы настроить опрос! После того, как будете готовы, выберите в меню "Опубликовать опрос"!
**Внимание!** Для создания опроса вам нужно __минимум 2 варианта ответа__!

**Варианты**
${map}`)
            const selectMenu = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId(`poll_settings`)
                        .setPlaceholder(`Выберите, что хотите отредактировать в опросе`)
                        .setOptions(
                            {
                                label: `Добавить вариант`,
                                value: `add_option`,
                                description: `Добавить вариант ответа в ваш опрос`,
                                emoji: `1️⃣`
                            },
                            {
                                label: `Удалить вариант`,
                                value: `remove_option`,
                                description: `Удалить вариант ответа из вашего опроса`,
                                emoji: `2️⃣`
                            },

                            {
                                label: `Изменить вопрос`,
                                value: `edit_question`,
                                description: `Изменить вопрос обсуждения опроса`,
                                emoji: `3️⃣`
                            },
                            {
                                label: `Изменить мин. и макс. количество`,
                                value: `edit_amount`,
                                description: `Изменить минимальное максимальное количество опций в опросе`,
                                emoji: `4️⃣`
                            },
                            {
                                label: `Длительность опроса`,
                                value: `edit_time`,
                                description: `Изменить длительность опроса`,
                                emoji: `5️⃣`
                            },
                            {
                                label: `Описание опроса`,
                                value: `edit_description`,
                                description: `Изменить описание опроса`,
                                emoji: `6️⃣`
                            },
                            {
                                label: `Опубликовать опрос`,
                                value: `start_poll`,
                                description: `Изменить максимальное количество опций в опросе`,
                                emoji: `✅`
                            },
                            {
                                label: `Отменить опрос`,
                                value: `remove_poll`,
                                description: `Отменить создание опроса`,
                                emoji: `❌`
                            },

                        )
                )
            try {
                const msg = await interaction.member.send({
                    embeds: [embed],
                    components: [selectMenu]
                })

                pollData.builder_message = msg.id
                pollData.status = `building`
                pollData.save()
                await interaction.deleteReply()
            } catch (err) {
                return interaction.editReply({
                    content: `У вас закрыты личные сообщения! Пожалуйста, откройте их!`,
                    ephemeral: true
                })
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