const { User } = require(`../../schemas/userdata`)
const chalk = require(`chalk`)
const wait = require(`node:timers/promises`).setTimeout
const cron = require(`node-cron`)
const { Guild } = require(`../../schemas/guilddata`)
const linksInfo = require(`../../discord structure/links.json`)
const { checkPlugin } = require("../../functions");
const plugin = {
    id: "nicknames",
    name: "Никнеймы"
}

module.exports = (client) => {
    client.updatenicks = async () => {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", plugin.id)) return;
            const results = await User.find({ guildid: `320193302844669959` })
            let i = 0
            for (const result of results) {
                if (result.black_hole.enabled !== true) {
                    if (result.userid !== `491343958660874242`) {
                        const { userid, displayname } = result;
                        const { rank, ramka1, name, ramka2, suffix, symbol, premium } = displayname;
                        const member = await guild.members.fetch(userid)
                        await member.setNickname(`「${rank}」${ramka1}${name}${ramka2}${suffix} ${symbol}┇${premium}`)
                    }
                }

            }

            console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magenta(`[ИЗМЕНЕНИЕ НИКНЕЙМОВ]`) + chalk.gray(`: Никнеймы всех участников были обновлены!`))

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