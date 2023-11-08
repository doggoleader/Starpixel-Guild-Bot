const chalk = require(`chalk`);
const wait = require("timers/promises").setTimeout;
const { Collection, EmbedBuilder } = require(`discord.js`)
const linksInfo = require(`../../../discord structure/links.json`)
/* const mineflayer = require(`mineflayer`)
const { promisify } = require(`util`)
const colors = require(`colors`)
const { mineflayer: mineflayerViewer } = require(`prismarine-viewer`); */

module.exports = {
    name: 'end',
    async execute(reason, client) {
        console.log(chalk.blackBright(`[${new Date()}]`) + chalk.hex(`#FFA500`)(`[HypixelBot]`) + chalk.red(`: Бот покинул сервер! Причина: ${reason}`))
    }
}