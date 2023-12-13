const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js")
const options = [
    {
        label: `Большая коробка`,
        emoji: `🎁`,
        description: `Открыть большую коробку`,
        value: `big`
    },
    {
        label: `Ежедневная коробка`,
        emoji: `🕑`,
        description: `Открыть ежедневную коробку`,
        value: `daily`
    },
    {
        label: `Ежемесячная коробка`,
        emoji: `🕑`,
        description: `Открыть ежемесячную коробку`,
        value: `monthly`
    },
    {
        label: `Еженедельная коробка`,
        emoji: `🕑`,
        description: `Открыть еженедельную коробку`,
        value: `weekly`
    },
    {
        label: `Жуткая коробка`,
        emoji: `🎃`,
        description: `Открыть жуткую коробку`,
        value: `spooky`
    },
    {
        label: `Загадочная коробка`,
        emoji: `🎁`,
        description: `Открыть загадочную коробку`,
        value: `mystery`
    },
    {
        label: `Коробка активности`,
        emoji: `🎁`,
        description: `Открыть коробку активности`,
        value: `activity`
    },
    {
        label: `Коробка персонала`,
        emoji: `💼`,
        description: `Открыть коробку персонала`,
        value: `staff`
    },
    {
        label: `Королевская коробка`,
        emoji: `🎁`,
        description: `Открыть королевскую коробку`,
        value: `king`
    },
    {
        label: `Летняя коробка`,
        emoji: `🌞`,
        description: `Открыть летнюю коробку`,
        value: `summer`
    },
    {
        label: `Маленькая коробка`,
        emoji: `🎁`,
        description: `Открыть маленькую коробку`,
        value: `small`
    },
    {
        label: `Мешочек`,
        emoji: `💰`,
        description: `Открыть мешочек`,
        value: `bag`
    },
    {
        label: `Новогодний подарок`,
        emoji: `🎁`,
        description: `Открыть новогодний подарок`,
        value: `present`
    },
    {
        label: `Огромная коробка`,
        emoji: `🎁`,
        description: `Открыть огромную коробку`,
        value: `mega`
    },
    {
        label: `Пасхальное яйцо`,
        emoji: `🥚`,
        description: `Открыть пасхальную коробку`,
        value: `easter`
    },
    {
        label: `Подарок судьбы`,
        emoji: `💼`,
        description: `Открыть подарок судьбы`,
        value: `myth`
    },
    {
        label: `Сезонный победитель`,
        emoji: `🏆`,
        description: `Открыть коробку сезонного победителя`,
        value: `seasonal_winner`
    },
    {
        label: `Сокровище`,
        emoji: `🎁`,
        description: `Открыть сокровище`,
        value: `treasure`
    },
    {
        label: `Талисман счастья`,
        emoji: `🧿`,
        description: `Открыть талисман счастья`,
        value: `prestige`
    }
]

const boxesMenu = new ActionRowBuilder()
    .addComponents(
        new StringSelectMenuBuilder()
            .setCustomId(`boxes_menu`)
            .setPlaceholder(`Выберите коробку`)
            .addOptions(options)
    )

const boxesInfo = new ActionRowBuilder()
    .addComponents(
        new StringSelectMenuBuilder()
            .setCustomId(`boxes_lootinfo`)
            .setPlaceholder(`Выберите коробку`)
            .addOptions(options)
    )
module.exports = {
    boxesMenu, boxesInfo
}