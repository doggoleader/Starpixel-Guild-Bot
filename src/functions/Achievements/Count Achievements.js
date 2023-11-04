const { User } = require(`../../schemas/userdata`)
const chalk = require(`chalk`);
const { EmbedBuilder } = require(`discord.js`)
const ch_list = require(`../../discord structure/channels.json`)
const role_list = require(`../../discord structure/roles.json`)
const linksInfo = require(`../../discord structure/links.json`)
const { Guild } = require(`../../schemas/guilddata`)
const { checkPlugin } = require("../../functions");
const plugin = {
    id: "items",
    name: "Предметы"
}

module.exports = (client) => {
    client.CountAchievements = async () => {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", plugin.id)) return;
            const results = await User.find({ guildid: guild.id })

            for (const result of results) {
                if (result.black_hole.enabled !== true) {
                    const { achievements } = result
                    const member = await guild.members.fetch(result.userid)
                    let n_norm = 0
                    for (let i = 0; i < role_list.achievements_normal.length; i++) {
                        if (member.roles.cache.has(role_list.achievements_normal[i])) {
                            n_norm += 1
                        }

                    }
                    result.achievements.normal = n_norm;

                    if (n_norm == 25 && !result.achievements.rewards.includes(`ALL_NORMAL`)) {
                        await member.roles.add(`740241985155366973`)
                        if (member.roles.cache.has(`781069821953441832`)) {
                            result.stacked_items.push(`781069821953441832`)
                        } else {
                            await member.roles.add(`781069821953441832`)
                        }
                        result.achievements.rewards.push(`ALL_NORMAL`)
                        let ch = await guild.channels.fetch(ch_list.main)
                        const embed = new EmbedBuilder()
                            .setTitle(`Выполнены все стандартные достижения`)
                            .setColor(Number(linksInfo.bot_color))
                            .setThumbnail(member.user.displayAvatarURL())
                            .setTimestamp(Date.now())
                            .setDescription(`${member} выполнил все **обычные достижения**! Поздравляем! Награда была добавлена вам в профиль!`)
                        await ch.send({
                            //content: ``,
                            embeds: [embed],
                            allowedMentions: {
                                parse: ["everyone"]
                            }
                        })

                    }
                    let n_myth = 0
                    for (let i = 0; i < role_list.achievements_myth.length; i++) {
                        if (member.roles.cache.has(role_list.achievements_myth[i])) {
                            n_myth += 1
                        }
                    }

                    if (n_norm + n_myth == 31 && !result.achievements.rewards.includes(`ALL_ACHS`)) {
                        if (member.roles.cache.has(`992820488298578041`)) {
                            result.stacked_items.push(`992820488298578041`)
                        } else {
                            await member.roles.add(`992820488298578041`)
                        }
                        result.achievements.rewards.push(`ALL_ACHS`)
                        let ch = await guild.channels.fetch(ch_list.main)
                        const embed = new EmbedBuilder()
                            .setTitle(`Выполнены все достижения`)
                            .setColor(Number(linksInfo.bot_color))
                            .setThumbnail(member.user.displayAvatarURL())
                            .setTimestamp(Date.now())
                            .setDescription(`${member} выполнил **все достижения** гильдии! Поздравляем!
                    
На такое способен не каждый участник гильдии, ведь многие достижения требуют терпения и желания. Но этот участник смог! И поэтому он получает... **ЗАГАДОЧНУЮ КОРОБКУ**! Поздравляем!`)
                        await ch.send({
                            content: `@everyone`,
                            embeds: [embed],
                            allowedMentions: {
                                parse: ["everyone"]
                            }
                        })

                    }
                    result.achievements.mythical = n_myth;
                    result.save()
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