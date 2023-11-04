const chalk = require(`chalk`);
const wait = require("timers/promises").setTimeout;
const { Collection, EmbedBuilder } = require(`discord.js`)
const linksInfo = require(`../../../discord structure/links.json`)

module.exports = {
    name: 'error',
    async execute(channel, e) {
        if (channel) channel.send({
            content: `Во время воспроизведения произошла ошибка! Свяжитесь с администратором гильдии!`
        })
        console.log(chalk.blackBright(`[${new Date()}]`) + e)
    }
}