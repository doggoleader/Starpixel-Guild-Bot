const { User } = require(`../../schemas/userdata`)
const chalk = require(`chalk`);
const { EmbedBuilder } = require(`discord.js`)
const ch_list = require(`../../discord structure/channels.json`)
const linksInfo = require(`../../discord structure/links.json`)
const { Guild } = require(`../../schemas/guilddata`)
const { checkPlugin } = require("../../functions");
const plugin = {
    id: "items",
    name: "Предметы"
}

module.exports = (client) => {
    client.ResetDailyLimits = async () => {
        try {
            if (!await checkPlugin("320193302844669959", plugin.id)) return;
            const userDatas = await User.find()
            for (let userData of userDatas) {
                userData.daily.purchases = 0
                userData.daily.sells = 0
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