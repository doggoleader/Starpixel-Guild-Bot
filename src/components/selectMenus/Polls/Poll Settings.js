const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');
const { Apply } = require(`../../../schemas/applications`)

const ch_list = require(`../../../discord structure/channels.json`);
const { User } = require('../../../schemas/userdata');
const api = process.env.hypixel_apikey
const { tasks } = require(`../../../jsons/New Start.json`);
const fetch = require(`node-fetch`);
const { getProperty } = require('../../../functions');
const { Polls } = require('../../../schemas/polls');
/**
 * 
 * @param {import("discord.js").StringSelectMenuInteraction} interaction Interaction
 * @param {import("../../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        let a = interaction.values[0]
        const pollData = await Polls.findOne({ builder_message: interaction.message.id })
        if (a == `add_option`) {
            if (pollData.options.length >= 25) return interaction.reply({
                content: `Вы достигли максимального количества опций!`,
                ephemeral: true
            })
            const modal = new ModalBuilder()
                .setCustomId(`poll_add_option`)
                .setTitle(`Добавить опцию`)
                .addComponents(
                    new ActionRowBuilder()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId(`label`)
                                .setLabel(`Название варианта`)
                                .setPlaceholder(`Введите название варианта ответа`)
                                .setRequired(true)
                                .setMaxLength(100)
                                .setStyle(TextInputStyle.Short)
                        )
                )
                .addComponents(
                    new ActionRowBuilder()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId(`description`)
                                .setLabel(`Описание варианта`)
                                .setPlaceholder(`Введите описание варианта ответа`)
                                .setRequired(true)
                                .setMaxLength(100)
                                .setStyle(TextInputStyle.Short)
                        )
                )
                .addComponents(
                    new ActionRowBuilder()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId(`emoji`)
                                .setLabel(`Эмоджи варианта`)
                                .setPlaceholder(`Введите эмоджи варианта (необязательно)`)
                                .setRequired(false)
                                .setStyle(TextInputStyle.Short)
                        )
                )

            await interaction.showModal(modal)
        } else if (a == `remove_option`) {
            if (pollData.options.length < 1) return interaction.reply({
                content: `Вы не добавили ни одной опции!`,
                ephemeral: true
            })
            const modal = new ModalBuilder()
                .setCustomId(`poll_remove_option`)
                .setTitle(`Удалить опцию`)
                .addComponents(
                    new ActionRowBuilder()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId(`number`)
                                .setLabel(`Номер варианта`)
                                .setPlaceholder(`Введите номер варианта ответа для удаления`)
                                .setRequired(true)
                                .setMaxLength(2)
                                .setStyle(TextInputStyle.Short)
                        )
                )

            await interaction.showModal(modal)
        } else if (a == `edit_question`) {
            const modal = new ModalBuilder()
                .setCustomId(`poll_edit_question`)
                .setTitle(`Редактировать вопрос`)
                .addComponents(
                    new ActionRowBuilder()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId(`question`)
                                .setLabel(`Новый вопрос, который будет задан в опросе`)
                                .setPlaceholder(`Введите новый вопрос`)
                                .setRequired(true)
                                .setMaxLength(250)
                                .setStyle(TextInputStyle.Short)
                        )
                )

            await interaction.showModal(modal)
        } else if (a == `edit_amount`) {
            const modal = new ModalBuilder()
                .setCustomId(`poll_edit_amount`)
                .setTitle(`Редактировать кол-во вариантов опроса`)
                .addComponents(
                    new ActionRowBuilder()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId(`min_amount`)
                                .setLabel(`Минимальное количество`)
                                .setPlaceholder(`Введите минимальное количество вариантов ответа`)
                                .setRequired(true)
                                .setMaxLength(2)
                                .setStyle(TextInputStyle.Short)
                        )
                )
                .addComponents(
                    new ActionRowBuilder()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId(`max_amount`)
                                .setLabel(`Максимальное количество`)
                                .setPlaceholder(`Введите максимальное количество вариантов ответа`)
                                .setRequired(true)
                                .setMaxLength(2)
                                .setStyle(TextInputStyle.Short)
                        )
                )

            await interaction.showModal(modal)
        } else if (a == `edit_time`) {
            const modal = new ModalBuilder()
                .setCustomId(`poll_edit_time`)
                .setTitle(`Редактировать время`)
                .addComponents(
                    new ActionRowBuilder()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId(`time`)
                                .setLabel(`Новое значение (в минутах)`)
                                .setPlaceholder(`Введите новую длительность опроса (в минутах)`)
                                .setRequired(true)
                                .setStyle(TextInputStyle.Short)
                        )
                )

            await interaction.showModal(modal)
        } else if (a == `edit_description`) {
            const modal = new ModalBuilder()
                .setCustomId(`poll_edit_description`)
                .setTitle(`Редактировать описание`)
                .addComponents(
                    new ActionRowBuilder()
                        .addComponents(
                            new TextInputBuilder()
                                .setCustomId(`description`)
                                .setLabel(`Новое описание опроса`)
                                .setPlaceholder(`Введите новое описание опроса`)
                                .setRequired(true)
                                .setMaxLength(1500)
                                .setStyle(TextInputStyle.Paragraph)
                        )
                )

            await interaction.showModal(modal)
        } else if (a == `start_poll`) {
            if (pollData.options.length < 2) return interaction.reply({
                content: `Для начала опроса необходимо добавить минимум 2 опции!`,
                ephemeral: true
            })
            const msg = await interaction.channel.messages.fetch(pollData.builder_message)
            const selectMenu = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId(`poll_settings`)
                        .setPlaceholder(`Выберите, что хотите отредактировать в опросе`)
                        .setDisabled(true)
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
            const getResults = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`poll_get_results`)
                        .setLabel(`Получить результаты`)
                        .setStyle(ButtonStyle.Primary)
                )
            await interaction.deferUpdate()
            const guild = await client.guilds.fetch(pollData.guildid)
            const channel = await guild.channels.fetch(pollData.channelid)
            let min = Number(pollData.min_amount)
            if (min > pollData.options.length) min = Number(pollData.options.length)
            else min = Number(pollData.min_amount)
            let max = Number(pollData.amount)
            if (max > pollData.options.length) max = Number(pollData.options.length)
            else max = Number(pollData.amount)
            let options = []
            for (let option of pollData.options) {
                options.push({
                    label: option.label,
                    value: option.value,
                    description: option.description,
                    emoji: option.emoji
                })
            }
            const pollSelect = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId(`poll_choice`)
                        .setMinValues(min)
                        .setMaxValues(max)
                        .setOptions(options)
                        .setPlaceholder(`Выберите одну из следующих опций`)
                )
            let expire = Date.now() + (1000 * 60 * pollData.expire_minutes)
            let timestamp = Math.round(expire / 1000)
            const pollEmbed = new EmbedBuilder()
                .setTitle(`${pollData.question}`)
                .setColor(Number(client.information.bot_color))
                .setDescription(`<@${pollData.userid}> создал новый опрос!
                
**ВОПРОС:** \`${pollData.question}\`
**ЗАКАНЧИВАЕТСЯ:** <t:${timestamp}:f>
**ОПИСАНИЕ ОПРОСА**
${pollData.description}

Ждем ваших ответов!`)

            const pollMsg = await channel.send({
                embeds: [pollEmbed],
                components: [pollSelect]
            })
            pollData.messageid = pollMsg.id
            pollData.expire = expire
            pollData.status = `ongoing`
            pollData.save()
            await msg.edit({
                components: [selectMenu, getResults]
            })
        } else if (a == `remove_poll`) {
            const msg = await interaction.channel.messages.fetch(pollData.builder_message)
            const selectMenu = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId(`poll_settings`)
                        .setPlaceholder(`Выберите, что хотите отредактировать в опросе`)
                        .setDisabled(true)
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
            await interaction.deferUpdate()
            await pollData.delete()
            await msg.edit({
                components: [selectMenu]
            })
        }
    } catch (e) {
        const admin = await client.users.fetch(`491343958660874242`)
        console.log(e)
        await admin.send({
            content: `-> \`\`\`${e.stack}\`\`\``
        }).catch()
    }


}
module.exports = {
    plugin: {
        id: "guildgames",
        name: "Совместные игры"
    },
    data: {
        name: "poll_settings"
    },
    execute
}