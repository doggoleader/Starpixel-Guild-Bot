const { Birthday } = require(`../../schemas/birthday`)
const { Temp } = require(`../../schemas/temp_items`)
const { User } = require(`../../schemas/userdata`)
const { Guild } = require(`../../schemas/guilddata`)
const chalk = require(`chalk`)
const cron = require(`node-cron`)
const { EmbedBuilder, PermissionsBitField } = require("discord.js")
const linksInfo = require(`../../discord structure/links.json`)
const { checkPlugin } = require("../../functions");
const plugin = {
    id: "seasonal",
    name: "Сезонное"
}

module.exports = (client) => {
    client.EasterStart = async () => {

        cron.schedule(`0 12 1 4 *`, async () => {
            try {
                const g = await client.guilds.fetch(`320193302844669959`)
                if (!await checkPlugin("320193302844669959", plugin.id)) return;
                const guildData = await Guild.findOne({ id: g.id })
                for (let ch of guildData.seasonal.easter.channels) {
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
                        let i = guildData.seasonal.easter.channels.findIndex(chan => chan.id == ch.id)
                        guildData.seasonal.easter.channels.splice(i, 1)
                        guildData.save()
                    }

                }
                guildData.seasonal.easter.enabled = true
                guildData.save();

                const userDatas = await User.find({ guildid: g.id })
                userDatas.forEach(async userData => {
                    let { points, rabbit, ea_cosm, opened_eggs, quests_completed, quest, achievements } = userData.seasonal.easter
                    points = 0
                    rabbit = false
                    opened_eggs = 0
                    quests_completed = 0
                    achievements.num1 = false
                    achievements.num2 = false
                    achievements.num3 = false
                    achievements.num4 = false
                    achievements.num5 = false
                    ea_cosm = false
                    quest.before = 0
                    quest.id = -1
                    quest.finished = true
                    quest.requirement = Infinity
                    quest.description = `Нет квеста.`
                    userData.save()
                })
                const news = await g.channels.fetch(`849313479924252732`)
                const embed = new EmbedBuilder()
                    .setTitle(`Пасхальный сезон`)
                    .setDescription(`Сегодня, <t:${Math.floor(new Date().getTime() / 1000)}:f>, гильдия Starpixel открывает пасхальный сезон.
Смело открывайте канал <#1031224458855321720> и зарабатывайте очки, чтобы стать лучшим игроком пасхального сезона!`)
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