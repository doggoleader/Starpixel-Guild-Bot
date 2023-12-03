const chalk = require(`chalk`);
const { ReactionCollector } = require("discord.js");
const { Guild } = require(`../../../schemas/guilddata`)
const { isURL } = require(`../../../functions`)
const { checkPlugin } = require("../../../functions");
let plugin = {
    id: "admin",
    name: "Административное"
}
async function execute(thread, newlyCreated, client) {
    try {
        if (!await checkPlugin(thread.guild.id, plugin.id)) return
        await thread.join()
    } catch (e) {
        const admin = await client.users.fetch(`491343958660874242`)
        console.log(e)
        await admin.send({
            content: `-> \`\`\`${e.stack}\`\`\``
        }).catch()
    }
}

module.exports = {
    name: 'threadCreate',
    plugin: plugin,
    execute
}