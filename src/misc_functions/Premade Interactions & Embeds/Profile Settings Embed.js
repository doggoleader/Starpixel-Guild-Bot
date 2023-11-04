const { EmbedBuilder } = require(`discord.js`)
const linksInfo = require(`../../discord structure/links.json`)
let i = 1
const embed = new EmbedBuilder()
    .setTitle(`Персональные настройки профиля`)
    .setColor(Number(Number(linksInfo.bot_color)))
    .setDescription(`Настройте профиль и действия в гильдии, связанные с вами, по своему усмотрению!
**Доступные настройки**:
**${i++}.** 🎂 Поздравления с днём рождения.
**${i++}.** 👤 Просмотр профиля другими участниками.
**${i++}.** 🧧 Просмотр значков другими участниками.
**${i++}.** 🏅 Отображение в списках лидеров`)

module.exports = {
    embed
}