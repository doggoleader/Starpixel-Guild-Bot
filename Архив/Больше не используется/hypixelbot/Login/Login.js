const chalk = require(`chalk`);
const wait = require("timers/promises").setTimeout;
const { Collection, EmbedBuilder } = require(`discord.js`)
const linksInfo = require(`../../../discord structure/links.json`)

module.exports = {
    name: 'login',
    async execute() {
        console.log(chalk.blackBright(`[${new Date()}]`) + chalk.hex(`#FFA500`)(`[HypixelBot]`) + chalk.green(`: Бот успешно зашёл на сервер!`))
    }
}