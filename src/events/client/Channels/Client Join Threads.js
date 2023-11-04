const chalk = require(`chalk`);
const { ReactionCollector } = require("discord.js");
const { Guild } = require(`../../../schemas/guilddata`)
const { isURL } = require(`../../../functions`)
const linksInfo = require(`../../../discord structure/links.json`)
const { checkPlugin } = require("../../../functions");

module.exports = {
    name: 'threadCreate',
    plugin: {
        id: "admin",
        name: "Административное"
    },
    async execute(thread, newlyCreated) {
        if (!await checkPlugin(thread.guild.id, this.plugin.id)) return
        await thread.join()
    }
}