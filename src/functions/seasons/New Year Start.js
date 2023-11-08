const { Birthday } = require(`../../schemas/birthday`)
const { Temp } = require(`../../schemas/temp_items`)
const { User } = require(`../../schemas/userdata`)
const { Guild } = require(`../../schemas/guilddata`)
const chalk = require(`chalk`)
const cron = require(`node-cron`)
const { EmbedBuilder, PermissionsBitField } = require("discord.js")
const linksInfo = require(`../../discord structure/links.json`)
const bingo = require(`../../jsons/NewYearBingo.json`)
const { checkPlugin, getProperty, createBingoProfile } = require("../../functions");
const fetch = require(`node-fetch`)
const api = process.env.hypixel_apikey
const plugin = {
    id: "seasonal",
    name: "Сезонное"
}

module.exports = (client) => {
    client.newYearStart = async () => {

        cron.schedule(`0 12 1 12 *`, async () => {
            try {
                const g = await client.guilds.fetch(`320193302844669959`)
                if (!await checkPlugin("320193302844669959", plugin.id)) return;
                const guildData = await Guild.findOne({ id: g.id })
                guildData.seasonal.new_year.channels.forEach(async ch => {
                    try {
                        const channel = await g.channels.fetch(ch.id)
                        await channel.edit({
                            permissionOverwrites: [
                                {
                                    id: `504887113649750016`,
                                    allow: [
                                        PermissionsBitField.Flags.ViewChannel,
                                    ],
                                    deny: [
                                        PermissionsBitField.Flags.SendMessages
                                    ]
                                },
                                {
                                    id: g.id,
                                    deny: [
                                        PermissionsBitField.Flags.ViewChannel,
                                        PermissionsBitField.Flags.SendMessages
                                    ]
                                },
                            ]
                        })
                    } catch (e) {
                        let i = guildData.seasonal.new_year.channels.findIndex(chan => chan.id == ch.id)
                        guildData.seasonal.new_year.channels.splice(i, 1)
                        guildData.save()
                    }

                })
                guildData.seasonal.new_year.enabled = true
                guildData.save()
                client.AdvCalendarClear()
                client.NewYearNamesEnable();
                const userDatas = await User.find({ guildid: g.id })
                userDatas.forEach(async userData => {
                    let { points, adventcalendar, santa_suit, opened_gifts, quests_completed, quest, achievements } = userData.seasonal.new_year
                    points = 0
                    adventcalendar = []
                    santa_suit.hat = false
                    santa_suit.chest = false
                    santa_suit.gloves = false
                    santa_suit.bag = false
                    opened_gifts = 0
                    quests_completed = 0
                    achievements.num1 = false
                    achievements.num2 = false
                    achievements.num3 = false
                    achievements.num4 = false
                    achievements.num5 = false
                    achievements.num6 = false
                    quests_completed = 0
                    quest.before = 0
                    quest.id = -1
                    quest.finished = true
                    quest.requirement = Infinity
                    quest.description = `Нет квеста.`
                    userData.seasonal.new_year.bingo_rewards = []
                    userData.seasonal.new_year.bingo = []
                    userData.seasonal.new_year.gifted_packs = 0
                    userData.seasonal.new_year.snowflakes = 0
                    if (userData.onlinemode == true) {
                        await createBingoProfile(userData, "new_year", bingo)
                    }
                    userData.save()
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