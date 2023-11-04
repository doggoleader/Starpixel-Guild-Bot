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
    client.halloweenStart = async () => {

        cron.schedule(`7 10 7 10 *`, async () => {
            try {

                const g = await client.guilds.fetch(`320193302844669959`)
                if (!await checkPlugin("320193302844669959", plugin.id)) return;
                const guildData = await Guild.findOne({ id: g.id })
                guildData.seasonal.halloween.channels.forEach(async ch => {
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
                        let i = guildData.seasonal.halloween.channels.findIndex(chan => chan.id == ch.id)
                        guildData.seasonal.halloween.channels.splice(i, 1)
                        guildData.save()
                    }

                })
                guildData.seasonal.halloween.enabled = true
                guildData.save()

                const userDatas = await User.find({ guildid: g.id })
                userDatas.forEach(async userData => {
                    userData.seasonal.halloween.hw_cosm = false
                    userData.seasonal.halloween.hw_soul = false
                    userData.seasonal.halloween.hw_msg = false
                    userData.seasonal.halloween.opened_scary = 0
                    userData.seasonal.halloween.points = 0
                    userData.seasonal.halloween.achievements.num1 = false
                    userData.seasonal.halloween.achievements.num2 = false
                    userData.seasonal.halloween.achievements.num3 = false
                    userData.seasonal.halloween.achievements.num4 = false
                    userData.seasonal.halloween.achievements.num5 = false
                    userData.seasonal.halloween.achievements.num6 = false
                    userData.seasonal.halloween.quests_completed = 0
                    userData.seasonal.halloween.quest.before = 0
                    userData.seasonal.halloween.quest.id = -1
                    userData.seasonal.halloween.quest.finished = true
                    userData.seasonal.halloween.quest.requirement = Infinity
                    userData.seasonal.halloween.quest.description = `Нет квеста.`

                    userData.save()
                })

                const news = await g.channels.fetch(`849313479924252732`)
                const embed = new EmbedBuilder()
                    .setTitle(`Хэллоуинский сезон`)
                    .setDescription(`Сегодня, <t:${Math.floor(new Date().getTime() / 1000)}:f>, гильдия Starpixel открывает хэллоуинский сезон.
Смело открывайте канал <#${ch_list.hw_main}> и зарабатывайте очки, чтобы стать лучшим игроком хэллоуинского сезона!`)
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