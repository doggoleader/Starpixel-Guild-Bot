const { Temp } = require(`../../schemas/temp_items`)
const chalk = require(`chalk`)
const { Guild } = require(`../../schemas/guilddata`)
const { User } = require(`../../schemas/userdata`)
const linksInfo = require(`../../discord structure/links.json`)
const { changeProperty } = require(`../../functions`)
const { checkPlugin } = require("../../functions");
const plugin = {
    id: "items",
    name: "Предметы"
}

module.exports = (client) => {
    client.TempItemsHelper = async (userid, guildid, extraInfo) => {
        try {
            if (!await checkPlugin("320193302844669959", plugin.id)) return;
            const result = await Temp.findOne({ userid: userid, guildid: guildid, extraInfo: extraInfo, expire: { $lte: new Date() } })
            const userData = await User.findOne({ userid: userid, guildid: guildid })
            if (userData.black_hole.enabled == true) return
            const newValue = await client.getInfo(userid, guildid, extraInfo)
            if (String(newValue).startsWith(`Не удалось найти опцию`)) return
            await changeProperty(userData, extraInfo, newValue)
            userData.save()
            result.delete()
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