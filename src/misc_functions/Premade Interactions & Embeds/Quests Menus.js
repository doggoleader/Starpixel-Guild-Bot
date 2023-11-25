const { StringSelectMenuBuilder, ActionRowBuilder, ButtonBuilder } = require(`discord.js`)

const menuCheckMarathon = new ActionRowBuilder()
    .addComponents(
        new StringSelectMenuBuilder()
            .setCustomId(`marathon_check_menu`)
            .setPlaceholder(`Получить информацию или закончить стадию`)
            .setOptions([
                {
                    label: `Получить информацию`,
                    value: `info`,
                    description: `Получить информацию о текущей стадии марафона`,
                    emoji: `📃`
                },
                {
                    label: `Завершить стадию`,
                    value: `end`,
                    description: `Завершить текущую стадию марафона`,
                    emoji: `✅`
                }

            ])
    )

const menuCheckVeterans = new ActionRowBuilder()
    .addComponents(
        new StringSelectMenuBuilder()
            .setCustomId(`veterans_check_menu`)
            .setPlaceholder(`Получить информацию или завершить задание`)
            .setOptions([
                {
                    label: 'Начать задание',
                    value: "start",
                    description: "Начать новое задание для ветеранов",
                    emoji: '🏆'
                },
                {
                    label: `Получить информацию`,
                    value: `info`,
                    description: `Получить информацию о текущем задании`,
                    emoji: `📃`
                },
                {
                    label: `Завершить задание`,
                    value: `end`,
                    description: `Завершить текущее задание`,
                    emoji: `✅`
                },
                {
                    label: "Пропустить задание",
                    value: "skip",
                    description: "Пропустить текущее задание (можно использовать 1 раз в 8 часов)",
                    emoji: "🚫"
                }

            ])
    )


const selectTaskNewStart = new ActionRowBuilder()
    .addComponents(
        new StringSelectMenuBuilder()
            .setCustomId(`newstart`)
            .setMinValues(1)
            .setMaxValues(4)
            .setPlaceholder(`Выберите задания, которые Вы хотите начать. Если Вы повторно выберите задания, Вы сохраните информацию о заданиях!`)
            .addOptions(
                {
                    label: `Задание 1`,
                    value: `задание 1`,
                    emoji: `1️⃣`,
                    description: `Набейте 1.000.000 GXP на Hypixel за неделю.`
                },
                {
                    label: `Задание 2`,
                    value: `задание 2`,
                    emoji: `2️⃣`,
                    description: `Выиграйте в SkyWars 500 раз.`
                },
                {
                    label: `Задание 3`,
                    value: `задание 3`,
                    emoji: `3️⃣`,
                    description: `Выиграйте в The Walls 20 раз.`
                },
                {
                    label: `Задание 4`,
                    value: `задание 4`,
                    emoji: `4️⃣`,
                    description: `Выиграйте в Bed Wars 300 раз.`
                },
            )
    )

const menuCheckNewStart = new ActionRowBuilder()
    .addComponents(
        new StringSelectMenuBuilder()
            .setCustomId(`newstart_check_menu`)
            .setPlaceholder(`Получить информацию или закончить задание`)
            .setOptions([
                {
                    label: `Получить информацию`,
                    value: `info`,
                    description: `Получить информацию о текущих заданиях`,
                    emoji: `📃`
                },
                {
                    label: `Завершить задания`,
                    value: `end`,
                    description: `Завершить текущие задания`,
                    emoji: `✅`
                }

            ])
    )


module.exports = {
    menuCheckMarathon,
    menuCheckNewStart,
    selectTaskNewStart,
    menuCheckVeterans
}