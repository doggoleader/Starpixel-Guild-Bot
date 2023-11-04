const { User } = require(`../../schemas/userdata`)
const chalk = require(`chalk`)
const cron = require(`node-cron`)
const wait = require('node:timers/promises').setTimeout;
const linksInfo = require(`../../discord structure/links.json`)
const { checkPlugin } = require("../../functions");
const plugin = {
    id: "misc",
    name: "Разное"
}

module.exports = (client) => {
    client.emojiUpdate = async () => {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", plugin.id)) return;
            let userDatas = await User.find({ guildid: guild.id, onlinemode: true })
            userDatas = await userDatas.filter(userData => userData.uuid !== `bd4988c17cfa4daba1f0a2bce375b291`)
            for (const userData of userDatas) {
                const member = await guild.members.fetch(userData.userid)
                if (member.roles.cache.has(`850336260265476096`)) {
                    if (userData.pers_emoji == false) {
                        let emojiToFind = await guild.emojis.cache.find(emoji => emoji.name == userData.nickname)
                        if (!emojiToFind) emojiToFind = await guild.emojis.cache.find(emoji => emoji.name == userData.oldnickname)
                        if (!emojiToFind) {
                            try {
                                await guild.emojis.create({
                                    attachment: `https://minotar.net/helm/${userData.uuid}.png`,
                                    name: `${userData.nickname}`
                                })
                            } catch (e) {
                                console.log(`Произошла ошибка при создании эмоджи ${userData.uuid}` + e)
                            }

                            userData.pers_emoji = true
                        } else {
                            await emojiToFind.delete()
                            try {
                                await guild.emojis.create({
                                    attachment: `https://minotar.net/helm/${userData.uuid}.png`,
                                    name: `${userData.nickname}`
                                })
                            } catch (e) {
                                console.log(`Произошла ошибка при создании эмоджи ${userData.uuid}` + e)
                            }
                            userData.pers_emoji = true
                        }
                    } else if (userData.pers_emoji == true) {
                        let emojiToFind = await guild.emojis.cache.find(emoji => emoji.name == userData.nickname)
                        if (!emojiToFind) emojiToFind = await guild.emojis.cache.find(emoji => emoji.name == userData.oldnickname)
                        if (!emojiToFind) {
                            try {
                                await guild.emojis.create({
                                    attachment: `https://minotar.net/helm/${userData.uuid}.png`,
                                    name: `${userData.nickname}`
                                })
                            } catch (e) {
                                console.log(`Произошла ошибка при создании эмоджи ${userData.uuid}` + e)
                            }
                        } else {
                            await emojiToFind.delete()
                            try {
                                await guild.emojis.create({
                                    attachment: `https://minotar.net/helm/${userData.uuid}.png`,
                                    name: `${userData.nickname}`
                                })
                            } catch (e) {
                                console.log(`Произошла ошибка при создании эмоджи ${userData.uuid}` + e)
                            }
                        }
                    }
                } else if (!member.roles.cache.has(`850336260265476096`)) {
                    let emojiToFind = await guild.emojis.cache.find(emoji => emoji.name == userData.nickname)
                    if (!emojiToFind) emojiToFind = await guild.emojis.cache.find(emoji => emoji.name == userData.oldnickname)
                    if (emojiToFind) {
                        await emojiToFind.delete()
                    }
                    userData.pers_emoji = false
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