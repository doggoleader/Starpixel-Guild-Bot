const { User } = require(`../../schemas/userdata`)
const chalk = require(`chalk`);
const { EmbedBuilder, hyperlink, ChannelType } = require(`discord.js`)
const ch_list = require(`../../discord structure/channels.json`)
const { Guild } = require(`../../schemas/guilddata`)
const { suffix } = require(`../../functions`)
const linksInfo = require(`../../discord structure/links.json`)
const wait = require(`node:timers/promises`).setTimeout
const { checkPlugin } = require("../../functions");
const plugin = {
    id: "items",
    name: "Предметы"
}

module.exports = (client) => {
    client.AchMyth6 = async () => {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", plugin.id)) return;
            const userDatas = await User.find({
                "achievements.myth_6_remove": {
                    $lte: Date.now()
                },
                "achievements.myth_6_clicked": {
                    $gt: 0
                }
            })
            for (let userData of userDatas) {
                userData.achievements.myth_6_clicked = 0
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
