const { User } = require(`../../schemas/userdata`)
const chalk = require(`chalk`)
const { Guild } = require(`../../schemas/guilddata`)
const linksInfo = require(`../../discord structure/links.json`)
const { checkPlugin } = require("../../functions");
const plugin = {
    id: "items",
    name: "Предметы"
}

module.exports = (client) => {
    client.checkSubscription = async () => {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", plugin.id)) return;
            const results = await User.find({ guildid: guild.id })

            for (const result of results) {
                if (result.black_hole.enabled !== true) {
                    const { userid, displayname, pers_emoji } = result;
                    const member = await guild.members.fetch(userid)
                    if (member.roles.cache.has(`850336260265476096`)) {
                        displayname.premium = `💳`
                        if (member.roles.cache.has("780487592540897349")) {
                            if (member.roles.cache.has("1007290182883622974")) {
                                result.stacked_items.push("1007290182883622974")
                            } else if (member.roles.cache.has("1007290181847613530")) {
                                result.stacked_items.push("1007290181847613530")
                            } else if (member.roles.cache.has("1007290181038133269")) {
                                result.stacked_items.push("1007290181038133269")
                            }
                        }
                        await member.roles.remove(["1007290182883622974", "1007290181847613530", "1007290181038133269"])
                        result.sub_type = 4
                    } else if (member.roles.cache.has(`1007290182883622974`)) {
                        displayname.premium = ``
                        if (member.roles.cache.has("780487592540897349")) {
                            if (member.roles.cache.has("1007290181847613530")) {
                                result.stacked_items.push("1007290181847613530")
                            } else if (member.roles.cache.has("1007290181038133269")) {
                                result.stacked_items.push("1007290181038133269")
                            }
                        }
                        await member.roles.remove(["1007290181847613530", "1007290181038133269"])
                        result.sub_type = 3
                    } else if (member.roles.cache.has(`1007290181847613530`)) {
                        displayname.premium = ``
                        if (member.roles.cache.has("780487592540897349")) {
                            if (member.roles.cache.has("1007290181038133269")) {
                                result.stacked_items.push("1007290181038133269")
                            }
                        }
                        await member.roles.remove("1007290181038133269")
                        result.sub_type = 2
                    } else if (member.roles.cache.has(`1007290181038133269`)) {
                        displayname.premium = ``
                        result.sub_type = 1
                    } else {
                        displayname.premium = ``
                        result.sub_type = 0
                    }

                    result.save()
                }


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