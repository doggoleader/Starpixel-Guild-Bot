const { User } = require(`../../schemas/userdata`)
const chalk = require(`chalk`);
const fetch = require(`node-fetch`)
const upd_nick_api = process.env.hypixel_apikey
const linksInfo = require(`../../discord structure/links.json`)
const { Guild } = require(`../../schemas/guilddata`)
const { checkPlugin } = require("../../functions");
const plugin = {
    id: "hypixel",
    name: "Hypixel"
}

module.exports = (client) => {
    client.UpdateNicknames = async () => {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", plugin.id)) return;
            const results = await User.find({ guildid: guild.id, onlinemode: true })

            for (const result of results) {

                let response = await fetch(`https://api.hypixel.net/player?uuid=${result.uuid}`, {
                    headers: {
                        "API-Key": upd_nick_api,
                        "Content-Type": "application/json"
                    }
                })
                if (response.ok) {
                    try {
                        const oldnick = result.nickname
                        let json = await response.json()
                        if (oldnick !== json.player.displayname) {
                            result.oldnickname = oldnick
                        }
                        result.nickname = json.player.displayname;
                        result.save()
                    } catch (error) {
                        console.log(chalk.blackBright(`[${new Date()}]`) + chalk.hex(`#FFA500`)(`[HypixelAPI]`) + chalk.red(`: UUID не найден ИЛИ игрок не найден ИЛИ произошла другая ошибка!` + error))
                    }
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