const chalk = require(`chalk`);
const { ReactionCollector, ChannelType } = require("discord.js");
const { Guild } = require(`../../../schemas/guilddata`)
const { isURL } = require(`../../../functions`)
const wait = require(`node:timers/promises`).setTimeout
const { checkPlugin } = require("../../../functions");
let plugin = {
    id: "admin",
    name: "Административное"
}
async function execute(guild) {
    if (guild.id !== `320193302844669959`) {
        if (!await checkPlugin(guild.id, plugin.id)) return
        await guild.leave()
        const date = new Date()
        console.log(chalk.blackBright(`[${new Date()}]`) + chalk.red(` [Бот покинул сервер]`) + chalk.white(`: Бот покинул сервер ${guild.name} (ID: ${guild.id})`))
    }
}

module.exports = {
    name: 'guildCreate',
    plugin: plugin,
    execute
}