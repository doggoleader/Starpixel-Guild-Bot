const { User } = require(`../../schemas/userdata`)
const chalk = require(`chalk`);
const { EmbedBuilder } = require(`discord.js`)
const ch_list = require(`../../discord structure/channels.json`)
const { Guild } = require(`../../schemas/guilddata`)
const cron = require(`node-cron`)
const wait = require(`node:timers/promises`).setTimeout
const linksInfo = require(`../../discord structure/links.json`)
const { checkPlugin } = require("../../functions");
const plugin = {
    id: "guildgames",
    name: "Совместные игры"
}

module.exports = (client) => {
    client.GGResetStatus = async () => {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            const guildData = await Guild.findOne({ id: guild.id })

            cron.schedule(`0 0 * * *`, async () => {
                guildData.guildgames.status = `waiting`
                guildData.save()
            }, {
                timezone: `Europe/Moscow`,
                name: `ResetStatus`,
                scheduled: true
            })
        } catch (e) {
            const admin = await client.users.fetch(`491343958660874242`)
            console.log(e)
            var path = require('path');
            var scriptName = path.basename(__filename);
            await admin.send(`Произошла ошибка!`)
            await admin.send(`=> ${e}.
**Файл**: ${scriptName}`)
            await admin.send(`◾`)
        }

    }
}
