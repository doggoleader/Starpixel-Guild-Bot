const chalk = require(`chalk`);
const wait = require("timers/promises").setTimeout;
const { Collection, EmbedBuilder } = require(`discord.js`)
const linksInfo = require(`../../../discord structure/links.json`)

module.exports = {
    name: 'spawn',
    async execute(client) {
        console.log(chalk.hex(`#FFA500`)(`[HypixelBot]`), chalk.green(`: Бот изменил или появился в лобби!`))
        let botServer = `---`
        setTimeout(async () => {
            botServer = await client.getServer()
        }, 300)

        setTimeout(async () => {
            if (botServer == "limbo") {
                McClient.chat(`/lobby main`)
            }
        }, 700)
    }
}