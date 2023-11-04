const { Birthday } = require(`../../schemas/birthday`)
const { Temp } = require(`../../schemas/temp_items`)
const { User } = require(`../../schemas/userdata`)
const { Guild } = require(`../../schemas/guilddata`)
const ch_list = require(`../../discord structure/channels.json`)
const chalk = require(`chalk`)
const cron = require(`node-cron`)
const wait = require(`node:timers/promises`).setTimeout
const { EmbedBuilder, PermissionsBitField } = require("discord.js")
const linksInfo = require(`../../discord structure/links.json`)
const { checkPlugin } = require("../../functions");
const plugin = {
    id: "seasonal",
    name: "Сезонное"
}

module.exports = (client) => {
    client.HappyNewYear = async () => {

        cron.schedule(`0 15-23 31 12 *`, async () => {
            try {
                const guild = await client.guilds.fetch(`320193302844669959`)
                if (!await checkPlugin("320193302844669959", plugin.id)) return;
                const channel = await guild.channels.fetch(`1058339159359631391`)
                const date = new Date()
                const tz = (new Date().getTimezoneOffset() / 60)
                let hour = date.getHours() + (3 + tz)
                if (hour >= 24) hour -= 24

                let regions = require(`./JSON/NewYearTimezones.json`)
                let timezone = await regions.timezones.find(i => i.MoscowTime == hour)
                let list = timezone.regions.map((reg, i) => {
                    return `**${++i}.** ${reg}`
                }).join(`\n`)
                const embed = new EmbedBuilder()
                    .setTitle(`С НОВЫМ ГОДОМ! 🎄`)
                    .setColor(Number(linksInfo.bot_color))
                    .setDescription(`От лица администрации поздравляю с **НОВЫМ 2024 ГОДОМ** всех участников гильдии в следующих регионах:

${list}`)
                    .setTimestamp(Date.now())


                await channel.send({
                    content: `@everyone`,
                    embeds: [embed],
                    allowedMentions: {
                        parse: ["everyone"]
                    }
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

        }, {
            scheduled: true,
            timezone: `Europe/Moscow`
        })

        cron.schedule(`0 0,1 1 1 *`, async () => {
            try {
                const guild = await client.guilds.fetch(`320193302844669959`)
                const channel = await guild.channels.fetch(`1058339159359631391`)
                const date = new Date()
                const tz = (new Date().getTimezoneOffset() / 60)
                let hour = date.getHours() + (3 + tz)
                if (hour >= 24) hour -= 24

                let regions = require(`./JSON/NewYearTimezones.json`)
                let timezone = await regions.timezones.find(i => i.MoscowTime == hour)
                let list = timezone.regions.map((reg, i) => {
                    return `**${++i}.** ${reg}`
                }).join(`\n`)
                const embed = new EmbedBuilder()
                    .setTitle(`С НОВЫМ ГОДОМ! 🎄`)
                    .setColor(Number(linksInfo.bot_color))
                    .setDescription(`От лица администрации поздравляю с **НОВЫМ 2023 ГОДОМ** всех участников гильдии в следующих часовых поясах:

${list}`)
                    .setTimestamp(Date.now())


                await channel.send({
                    content: `@everyone`,
                    embeds: [embed],
                    allowedMentions: {
                        parse: ["everyone"]
                    }
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

        }, {
            scheduled: true,
            timezone: `Europe/Moscow`
        })
    }
}