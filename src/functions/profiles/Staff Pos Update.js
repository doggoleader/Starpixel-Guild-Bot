const { User } = require(`../../schemas/userdata`)
const chalk = require(`chalk`);
const { Guild } = require(`../../schemas/guilddata`)
const { EmbedBuilder } = require(`discord.js`)
const ch_list = require(`../../discord structure/channels.json`)
const linksInfo = require(`../../discord structure/links.json`)
const { checkPlugin } = require("../../functions");
const plugin = {
    id: "misc",
    name: "Разное"
}

module.exports = (client) => {
    client.StaffPosUpdate = async (userid) => {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", plugin.id)) return;
            if (!userid) {
                const userDatas = await User.find()

                for (let userData of userDatas) {
                    const member = await guild.members.fetch(userData.userid)
                    if (member.roles.cache.has("567689925143822346")) { //Прав
                        userData.staff_pos = 4
                    } else if (member.roles.cache.has("320880176416161802")) { //Админ
                        userData.staff_pos = 3
                    } else if (member.roles.cache.has("1059732744218882088")) { //Испыт срок
                        userData.staff_pos = 1
                    } else if (member.roles.cache.has("563793535250464809")) { //Офицер
                        userData.staff_pos = 2
                    } else {
                        userData.staff_pos = 0
                    }
                    userData.save()
                }
            } else if (userid) {
                const userData = await User.findOne({ userid: userid })
                if (!userData) return
                const member = await guild.members.fetch(userData.userid)
                if (member.roles.cache.has("567689925143822346")) { //Прав
                    userData.staff_pos = 4
                } else if (member.roles.cache.has("320880176416161802")) { //Админ
                    userData.staff_pos = 3
                } else if (member.roles.cache.has("1059732744218882088")) { //Испыт срок
                    userData.staff_pos = 1
                } else if (member.roles.cache.has("563793535250464809")) { //Офицер
                    userData.staff_pos = 2
                } else {
                    userData.staff_pos = 0
                }
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