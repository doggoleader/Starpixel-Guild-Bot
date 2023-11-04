const chalk = require(`chalk`);
const { ReactionCollector, ChannelType } = require("discord.js");
const { Guild } = require(`../../../schemas/guilddata`)
const { isURL } = require(`../../../functions`)
const wait = require(`node:timers/promises`).setTimeout
const linksInfo = require(`../../../discord structure/links.json`)
const { checkPlugin } = require("../../../functions");

module.exports = {
    name: 'guildCreate',
    plugin: {
        id: "admin",
        name: "Административное"
    },
    async execute(guild) {
        if (guild.id !== `320193302844669959`) {
            if (!await checkPlugin(guild.id, this.plugin.id)) return
            await guild.leave()
            const date = new Date()
            console.log(chalk.blackBright(`[${new Date()}]`) + chalk.red(` [Бот покинул сервер]`) + chalk.white(`: Бот покинул сервер ${guild.name} (ID: ${guild.id})`))
        }
    }
}