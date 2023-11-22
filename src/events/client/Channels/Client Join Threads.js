const chalk = require(`chalk`);
const { ReactionCollector } = require("discord.js");
const { Guild } = require(`../../../schemas/guilddata`)
const { isURL } = require(`../../../functions`)
const linksInfo = require(`../../../discord structure/links.json`)
const { checkPlugin } = require("../../../functions");
let plugin = {
    id: "admin",
    name: "Административное"
}
async function execute(thread, newlyCreated) {
    if (!await checkPlugin(thread.guild.id, plugin.id)) return
    await thread.join()
}

module.exports = {
    name: 'threadCreate',
    plugin: plugin,
    execute
}