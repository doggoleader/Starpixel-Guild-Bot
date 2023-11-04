const { Birthday } = require(`../../schemas/birthday`)
const { Temp } = require(`../../schemas/temp_items`)
const { User } = require(`../../schemas/userdata`)
const { Guild } = require(`../../schemas/guilddata`)
const chalk = require(`chalk`)
const cron = require(`node-cron`)
const { EmbedBuilder, PermissionsBitField } = require("discord.js")
const linksInfo = require(`../../discord structure/links.json`)
const ch_list = require(`../../discord structure/channels.json`)
const { checkPlugin } = require("../../functions");
const plugin = {
    id: "seasonal",
    name: "Сезонное"
}

module.exports = (client) => {
    client.SummerStart = async () => {

        cron.schedule(`0 12 1 6 *`, async () => {
            try {
                const g = await client.guilds.fetch(`320193302844669959`)
                if (!await checkPlugin("320193302844669959", plugin.id)) return;
                const guildData = await Guild.findOne({ id: g.id })
                for (let ch of guildData.seasonal.summer.channels) {
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
                        let i = guildData.seasonal.summer.channels.findIndex(chan => chan.id == ch.id)
                        guildData.seasonal.summer.channels.splice(i, 1)
                        guildData.save()
                    }

                }
                guildData.seasonal.summer.enabled = true
                guildData.save();

                const userDatas = await User.find({ guildid: g.id })
                userDatas.forEach(async userData => {
                    let { points, sea_ticket, su_cosm, opened_boxes, quests_completed, quest, achievements, unique_quests, events } = userData.seasonal.summer
                    points = 0
                    sea_ticket = false
                    opened_boxes = 0
                    su_cosm = false
                    quests_completed = 0
                    achievements.num1 = false
                    achievements.num2 = false
                    achievements.num3 = false
                    achievements.num4 = false
                    achievements.num5 = false
                    achievements.num6 = false
                    achievements.num7 = false
                    achievements.num8 = false
                    achievements.num9 = false
                    achievements.num10 = false
                    quest.before = 0
                    quest.id = -1
                    quest.finished = true
                    quest.requirement = Infinity
                    quest.description = `Нет квеста.`
                    quest.type = `Нет квеста.`
                    unique_quests = 0
                    events.events_attended = 0
                    events.last_event_applied = false
                    events.last_event_member = false
                    userData.save()
                })
                const news = await g.channels.fetch(`849313479924252732`)
                const embed = new EmbedBuilder()
                    .setTitle(`Летний сезон`)
                    .setDescription(`Сегодня, <t:${Math.floor(new Date().getTime() / 1000)}:f>, гильдия Starpixel открывает летний сезон.
Смело открывайте канал <#${ch_list.su_main}> и зарабатывайте очки, чтобы стать лучшим игроком летнего сезона!`)
                const msg = await news.send({
                    content: `@everyone`,
                    embeds: [embed],
                    allowedMentions: {
                        parse: ["everyone"]
                    }
                })
                await msg.react(`✅`)
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