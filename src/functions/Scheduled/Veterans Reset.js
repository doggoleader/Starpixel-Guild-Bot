const { User } = require(`../../schemas/userdata`)
const chalk = require(`chalk`)
const cron = require(`node-cron`)
const wait = require('node:timers/promises').setTimeout;
const linksInfo = require(`../../discord structure/links.json`)
const { checkPlugin } = require("../../functions");
const plugin = {
    id: "hypixel",
    name: "Hypixel"
}

module.exports = (client) => {
    client.resetVeterans = async () => {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", plugin.id)) return;
            let userDatas = await User.find({ guildid: guild.id })
            for (const userData of userDatas) {
                userData.quests.veterans.completed = []
                userData.quests.veterans.activated.id = -1
                userData.quests.veterans.activated.required = Infinity
                userData.quests.veterans.activated.status = true
                userData.save()
            }
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