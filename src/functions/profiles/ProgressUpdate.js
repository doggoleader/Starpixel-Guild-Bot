const { User } = require(`../../schemas/userdata`)
const chalk = require(`chalk`);
const { Guild } = require(`../../schemas/guilddata`)
const { EmbedBuilder } = require(`discord.js`)
const ch_list = require(`../../discord structure/channels.json`)
const linksInfo = require(`../../discord structure/links.json`)
const { checkPlugin } = require("../../functions");
const { GuildProgress } = require("../../misc_functions/Exporter");
const plugin = {
    id: "misc",
    name: "Разное"
}

module.exports = (client) => {
    client.ProgressUpdate = async () => {
        try {
            const userDatas = await User.find()
            for (const userData of userDatas) {
                const guild = await client.guilds.cache.get(userData.guildid)
                const member = await guild.members.fetch(userData.userid)
                const progress = new GuildProgress(member, client)
                await progress.getAndUpdateUserPoints()
            }

            console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magenta(`[ОБНОВЛЕНИЕ ПРОГРЕССА]`) + chalk.gray(`: Прогресс развития участников в гильдии был обновлён!`))
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