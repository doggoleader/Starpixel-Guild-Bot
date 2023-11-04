const { User } = require(`../../schemas/userdata`)
const chalk = require(`chalk`);
const { EmbedBuilder } = require(`discord.js`)
const ch_list = require(`../../discord structure/channels.json`)
const { Guild } = require(`../../schemas/guilddata`)
const cron = require(`node-cron`)
const wait = require(`node:timers/promises`).setTimeout
const linksInfo = require(`../../discord structure/links.json`)
const { checkPlugin } = require("../../functions");
const plugin = {
    id: "guildgames",
    name: "Совместные игры"
}

module.exports = (client) => {
    client.SchedulerGuildGamesRem = async () => {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            const guildData = await Guild.findOne({ id: guild.id })

            let startMinPreStart = guildData.guildgames.gamestart_min
            let startHourPreStart = guildData.guildgames.gamestart_hour
            let min_remindPreStart
            let hour_remindPreStart
            if (startMinPreStart - 10 < 0) {
                startMinPreStart = startMinPreStart + 60
                min_remindPreStart = startMinPreStart - 10
                hour_remindPreStart = startHourPreStart - 1
            } else {
                min_remindPreStart = startMinPreStart - 10
                hour_remindPreStart = startHourPreStart
            }
            const weekDaysPreStart = guildData.guildgames.game_days.join(`,`)
            const scheduleStopPreStart = await cron.getTasks().get(`GamePreStart`)
            if (scheduleStopPreStart) {
                await scheduleStopPreStart.stop()
            }
            if (!weekDaysPreStart) return
            cron.schedule(`${min_remindPreStart} ${hour_remindPreStart} * * ${weekDaysPreStart}`, async () => {
                client.GamePreStart()
            }, {
                timezone: `Europe/Moscow`,
                name: `GamePreStart`,
                scheduled: true
            })
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
