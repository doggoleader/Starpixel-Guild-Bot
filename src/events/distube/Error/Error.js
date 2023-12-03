const chalk = require(`chalk`);
const wait = require("timers/promises").setTimeout;
const { Collection, EmbedBuilder } = require(`discord.js`)
async function execute(channel, err, client) {
    try {
        if (channel) channel.send({
            content: `Во время воспроизведения произошла ошибка! Свяжитесь с администратором гильдии!`
        })
        console.log(err)
    } catch (e) {
        const admin = await client.users.fetch(`491343958660874242`)
        console.log(e)
        await admin.send({
            content: `-> \`\`\`${e.stack}\`\`\``
        }).catch()
    }
}

module.exports = {
    name: 'error',
    execute
}