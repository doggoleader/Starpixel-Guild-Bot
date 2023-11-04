const { ActionRowBuilder, ButtonBuilder, ButtonStyle, UserSelectMenuBuilder, StringSelectMenuBuilder } = require(`discord.js`)

const lb_newyear = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId(`season_newyear_leaderboard`)
            .setEmoji(`🏅`)
            .setStyle(ButtonStyle.Primary)
            .setLabel(`Таблица лидеров`)
    )
const stats_newyear = new ActionRowBuilder()
    .addComponents(
        new UserSelectMenuBuilder()
            .setCustomId(`season_newyear_stats`)
            .setMaxValues(1)
            .setPlaceholder(`Посмотреть новогоднюю статистику`)
    )
const gift_newyear = new ActionRowBuilder()
    .addComponents(
        new UserSelectMenuBuilder()
            .setCustomId(`season_newyear_gift`)
            .setMaxValues(1)
            .setPlaceholder(`Сделать подарок пользователю`)
    )
const quests_newyear = new ActionRowBuilder()
    .addComponents(
        new StringSelectMenuBuilder()
            .setCustomId(`season_newyear_quests`)
            .setPlaceholder(`Новогодние квесты`)
            .setOptions(
                {
                    label: `Начать квест`,
                    value: `start_quest`
                },
                {
                    label: `Получить информацию о квесте`,
                    value: `quest_info`
                },
                {
                    label: `Закончить квест`,
                    value: `end_quest`
                },
                {
                    label: `Новогодний Бинго-марафон`,
                    value: `bingo`
                }
            )
    )


const stats_halloween = new ActionRowBuilder()
    .addComponents(
        new UserSelectMenuBuilder()
            .setCustomId(`season_halloween_stats`)
            .setMaxValues(1)
            .setPlaceholder(`Посмотреть хэллоуинскую статистику`)
    )
const quests_halloween = new ActionRowBuilder()
    .addComponents(
        new StringSelectMenuBuilder()
            .setCustomId(`season_halloween_quests`)
            .setPlaceholder(`Хэллоуинские квесты`)
            .setOptions(
                {
                    label: `Начать квест`,
                    value: `start_quest`
                },
                {
                    label: `Получить информацию о квесте`,
                    value: `quest_info`
                },
                {
                    label: `Закончить квест`,
                    value: `end_quest`
                },

            )
    )
const lb_halloween = new ActionRowBuilder()
    .setComponents(
        new ButtonBuilder()
            .setCustomId(`season_halloween_leaderboard`)
            .setEmoji(`🏅`)
            .setLabel(`Таблица лидеров`)
            .setStyle(ButtonStyle.Primary)
    )


const stats_easter = new ActionRowBuilder()
    .addComponents(
        new UserSelectMenuBuilder()
            .setCustomId(`season_easter_stats`)
            .setMaxValues(1)
            .setPlaceholder(`Посмотреть пасхальную статистику`)
    )
const quests_easter = new ActionRowBuilder()
    .addComponents(
        new StringSelectMenuBuilder()
            .setCustomId(`season_easter_quests`)
            .setPlaceholder(`Пасхальные квесты`)
            .setOptions(
                {
                    label: `Начать квест`,
                    value: `start_quest`
                },
                {
                    label: `Получить информацию о квесте`,
                    value: `quest_info`
                },
                {
                    label: `Закончить квест`,
                    value: `end_quest`
                },

            )
    )
const lb_easter = new ActionRowBuilder()
    .setComponents(
        new ButtonBuilder()
            .setCustomId(`season_easter_leaderboard`)
            .setEmoji(`🏅`)
            .setLabel(`Таблица лидеров`)
            .setStyle(ButtonStyle.Primary)
    )


const lb_summer = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId(`season_summer_leaderboard`)
            .setEmoji(`🏅`)
            .setLabel("Таблица лидеров")
            .setStyle(ButtonStyle.Primary)
    )
const quests_summer = new ActionRowBuilder()
    .addComponents(
        new StringSelectMenuBuilder()
            .setCustomId(`season_summer_quests`)
            .setPlaceholder("Летние квесты")
            .setOptions(
                {
                    label: `Начать квест`,
                    value: `start_quest`
                },
                {
                    label: `Получить информацию о квесте`,
                    value: `quest_info`
                },
                {
                    label: `Закончить квест`,
                    value: `end_quest`
                }
            )
    )
const stats_summer = new ActionRowBuilder()
    .addComponents(
        new UserSelectMenuBuilder()
            .setCustomId(`season_summer_stats`)
            .setPlaceholder("Посмотреть летнюю статистику")
    )


module.exports = {
    lb_newyear,
    stats_newyear,
    quests_newyear,
    gift_newyear,
    lb_halloween,
    stats_halloween,
    quests_halloween,
    lb_easter,
    stats_easter,
    quests_easter,
    lb_summer,
    stats_summer,
    quests_summer,
}