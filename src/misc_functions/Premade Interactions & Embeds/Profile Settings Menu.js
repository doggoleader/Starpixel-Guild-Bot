const { ActionRowBuilder, StringSelectMenuBuilder } = require(`discord.js`)

const selectmenu = new ActionRowBuilder()
    .addComponents(
        new StringSelectMenuBuilder()
            .setCustomId(`profile_settings`)
            .setPlaceholder(`Настройки профиля`)
            .setOptions(
                {
                    label: `Поздравления с днём рождения`,
                    value: 'birthday_wishes',
                    description: `Изменяет настройку поздравления бота вас с днём рождения.`,
                    emoji: `🎂`
                },
                {
                    label: `Просмотр профиля другими участниками`,
                    value: 'profile_view',
                    description: `Изменяет настройку просмотра профиля другими участниками.`,
                    emoji: `👤`
                },
                {
                    label: `Просмотр значков другими участниками`,
                    value: 'marks_view',
                    description: `Изменяет настройку просмотра значков другими участниками.`,
                    emoji: `🧧`
                },
                {
                    label: `Отображение в списках лидеров`,
                    value: 'is_in_leaderboard',
                    description: `Изменяет настройку отображения в списках лидеров.`,
                    emoji: `🏅`
                },
                {
                    label: `Уведомления об окончании перезарядки предметов`,
                    value: 'cd_notifications',
                    description: `Изменяет настройку уведомлений об окончании перезарядки.`,
                    emoji: `🕒`
                },
                {
                    label: `Посмотреть настройки`,
                    value: 'view_settings',
                    description: `Посмотреть ваши текущие настройки.`,
                    emoji: `👀`
                },
                
            )
    )


module.exports = {
    selectmenu
}