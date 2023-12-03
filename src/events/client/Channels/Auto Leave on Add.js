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
async function execute(guild, client) {
    try {
        if (guild.id !== `320193302844669959`) {
            if (!await checkPlugin(guild.id, plugin.id)) return
            await guild.leave()
            const date = new Date()
            console.log(chalk.blackBright(`[${new Date()}]`) + chalk.red(` [Бот покинул сервер]`) + chalk.white(`: Бот покинул сервер ${guild.name} (ID: ${guild.id})`))
        }
    } catch (e) {
        const admin = await client.users.fetch(`491343958660874242`)
        console.log(e)
        await admin.send({
            content: `-> \`\`\`${e.stack}\`\`\``
        }).catch()
    }
}

module.exports = {
    name: 'guildCreate',
    plugin: plugin,
    execute
}