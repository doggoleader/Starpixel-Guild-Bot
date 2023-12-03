const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, StringSelectMenuBuilder } = require('discord.js');
const { Apply } = require(`../../../schemas/applications`)

const { Polls } = require(`../../../schemas/polls`)
const { User } = require('../../../schemas/userdata');
/**
 * 
 * @param {import("discord.js").ModalSubmitInteraction} interaction Interaction
 * @param {import("../../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        await interaction.deferReply({ fetchReply: true, ephemeral: true })
        const userData = await User.findOne({ userid: interaction.user.id })
        const pollData = await Polls.findOne({ userid: interaction.user.id, builder_message: interaction.message.id })
        let description = interaction.fields.getTextInputValue("description")


        pollData.description = description;
        pollData.save()
        let map
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
        const embed = new EmbedBuilder()
            .setColor(Number(client.information.bot_color))
            .setTitle(`Настройка опроса`)
            .setDescription(`**ОСНОВНАЯ ИНФОРМАЦИЯ**
**Вопрос**: \`${pollData.question}\`
**Минимальное количество вариантов**: \`${pollData.min_amount}\`
**Максимальное количество вариантов**: \`${pollData.amount}\`
**Длительность опроса**: \`${pollData.expire_minutes} минут\`
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
        const msg = await interaction.channel.messages.fetch(pollData.builder_message)
        await msg.edit({
            embeds: [embed],
            components: [selectMenu]
        })
        await interaction.deleteReply()


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
        id: "misc",
        name: "Разное"
    },
    data: {
        name: "poll_edit_description"
    },
    execute
}