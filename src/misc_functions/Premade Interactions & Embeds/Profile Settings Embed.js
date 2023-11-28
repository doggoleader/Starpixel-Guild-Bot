const { EmbedBuilder } = require(`discord.js`)
let i = 1
const embed = new EmbedBuilder()
    .setTitle(`Персональные настройки профиля`)
    .setColor(0x5700FC)
    .setDescription(`Настройте профиль и действия в гильдии, связанные с вами, по своему усмотрению!
**Доступные настройки**:
**${i++}.** 🎂 Поздравления с днём рождения.
**${i++}.** 👤 Просмотр профиля другими участниками.
**${i++}.** 🧧 Просмотр значков другими участниками.
**${i++}.** 🏅 Отображение в списках лидеров.
**${i++}.** 🕒 Уведомления об окончании перезарядки предметов.`)

module.exports = {
    embed
}