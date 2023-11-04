const { User } = require(`../../schemas/userdata`)
const chalk = require(`chalk`)
const { EmbedBuilder } = require("discord.js")
const ch_list = require(`../../discord structure/channels.json`)
const linksInfo = require(`../../discord structure/links.json`)
const { checkPlugin } = require("../../functions");
const { Guild } = require(`../../schemas/guilddata`)
const plugin = {
    id: "items",
    name: "Предметы"
}

module.exports = (client) => {
    client.rank_update = async () => {
        try {
            if (!await checkPlugin("320193302844669959", plugin.id)) return;
            const guild = await client.guilds.fetch(`320193302844669959`)
            const guildData = await Guild.findOne({ id: guild.id })
            const results = await User.find({ rank: { $gte: 0 } })

            for (let result of results) {
                if (result.black_hole.enabled !== true) {
                    const { userid } = result;
                    let nov = await guild.roles.fetch(`553593731953983498`) //Новичок 0
                    let sp = await guild.roles.fetch(`553593734479216661`) //Специалист 1
                    let pro = await guild.roles.fetch(`553593136895623208`) //Профессионал 2
                    let mas = await guild.roles.fetch(`553593133884112900`) //Мастер 3
                    let champ = await guild.roles.fetch(`553593136027533313`) //Чемпион 4
                    let star = await guild.roles.fetch(`553593976037310489`) //Звездочка 5
                    let leg = await guild.roles.fetch(`780487593485008946`) //Легенда 6
                    let vlad = await guild.roles.fetch(`849695880688173087`) //Владыка 7
                    let lord = await guild.roles.fetch(`992122876394225814`) //Лорд 8 
                    let imp = await guild.roles.fetch(`992123014831419472`) //Император 9
                    let pov = await guild.roles.fetch(`992123019793276961`) //Повелитель 10
                    const member = await guild.members.fetch(userid)
                    if (member.roles.cache.has(`504887113649750016`)) {
                        if (result.rank >= 0 && result.rank < 50) { //Новичок
                            const oldrank = [sp, pro, mas, champ, star, leg, vlad, lord, imp, pov]
                            const newrank = nov
                            if (!member.roles.cache.has(newrank.id)) {

                                const rank_update = new EmbedBuilder()
                                    .setTitle(`Ранг пользователя повышен!`)
                                    .setColor(Number(linksInfo.bot_color))
                                    .setThumbnail(member.user.displayAvatarURL())
                                    .setTimestamp(Date.now())
                                    .setDescription(`${member} повысил ранг гильдии! Теперь он ${newrank.name}!
Проверить количество своего опыта ранга можно, прописав \`/profile info\`!`)

                                await member.roles.remove(oldrank).catch()
                                await member.roles.add(newrank).catch()

                                if (result.displayname.custom_rank === false && guildData.seasonal.new_year.enabled == false) {
                                    result.displayname.rank = `🦋`
                                } else if (result.displayname.custom_rank === false && guildData.seasonal.new_year.enabled == true) {
                                    result.displayname.rank = `🎏`
                                }
                                result.rank_number = 0
                                result.save()


                                await guild.channels.cache.get(ch_list.main).send({
                                    embeds: [rank_update]
                                })
                                console.log(chalk.blackBright(`[${new Date()}]`) + chalk.green(`[${member.user.username} повысил ранг]`) + chalk.gray(`: Теперь он ${newrank.name}.`))
                            }
                        }


                        else if (result.rank >= 50 && result.rank < 150) { //Специалист
                            const oldrank = [nov, pro, mas, champ, star, leg, vlad, lord, imp, pov]
                            const newrank = sp
                            if (!member.roles.cache.has(newrank.id)) {
                                const rank_update = new EmbedBuilder()
                                    .setTitle(`Ранг пользователя повышен!`)
                                    .setColor(Number(linksInfo.bot_color))
                                    .setThumbnail(member.user.displayAvatarURL())
                                    .setTimestamp(Date.now())
                                    .setDescription(`${member} повысил ранг гильдии! Теперь он ${newrank.name}!
Проверить количество своего опыта ранга можно, прописав \`/profile info\`!`)

                                await member.roles.remove(oldrank).catch()
                                await member.roles.add(newrank).catch()
                                if (result.displayname.custom_rank === false && guildData.seasonal.new_year.enabled == false) {
                                    result.displayname.rank = `🥥`
                                } else if (result.displayname.custom_rank === false && guildData.seasonal.new_year.enabled == true) {
                                    result.displayname.rank = `🎈`
                                }
                                result.rank_number = 1
                                result.save()


                                await guild.channels.cache.get(ch_list.main).send({
                                    embeds: [rank_update]
                                })
                                console.log(chalk.blackBright(`[${new Date()}]`) + chalk.green(`[${member.user.username} повысил ранг]`) + chalk.gray(`: Теперь он ${newrank.name}.`))
                            }

                        }

                        else if (result.rank >= 150 && result.rank < 500) { //Профессионал
                            const oldrank = [nov, sp, mas, champ, star, leg, vlad, lord, imp, pov]
                            const newrank = pro
                            if (!member.roles.cache.has(newrank.id)) {
                                const rank_update = new EmbedBuilder()
                                    .setTitle(`Ранг пользователя повышен!`)
                                    .setColor(Number(linksInfo.bot_color))
                                    .setThumbnail(member.user.displayAvatarURL())
                                    .setTimestamp(Date.now())
                                    .setDescription(`${member} повысил ранг гильдии! Теперь он ${newrank.name}!
Проверить количество своего опыта ранга можно, прописав \`/profile info\`!`)

                                await member.roles.remove(oldrank).catch()
                                await member.roles.add(newrank).catch()
                                if (result.displayname.custom_rank === false && guildData.seasonal.new_year.enabled == false) {
                                    result.displayname.rank = `🍕`

                                } else if (result.displayname.custom_rank === false && guildData.seasonal.new_year.enabled == true) {
                                    result.displayname.rank = `🎁`
                                }
                                result.rank_number = 2
                                result.save()

                                await guild.channels.cache.get(ch_list.main).send({
                                    embeds: [rank_update]
                                })
                                console.log(chalk.blackBright(`[${new Date()}]`) + chalk.green(`[${member.user.username} повысил ранг]`) + chalk.gray(`: Теперь он ${newrank.name}.`))
                            }
                        }

                        else if (result.rank >= 500 && result.rank < 1000) { //Мастер
                            const oldrank = [nov, sp, pro, champ, star, leg, vlad, lord, imp, pov]
                            const newrank = mas
                            if (!member.roles.cache.has(newrank.id)) {
                                const rank_update = new EmbedBuilder()
                                    .setTitle(`Ранг пользователя повышен!`)
                                    .setColor(Number(linksInfo.bot_color))
                                    .setThumbnail(member.user.displayAvatarURL())
                                    .setTimestamp(Date.now())
                                    .setDescription(`${member} повысил ранг гильдии! Теперь он ${newrank.name}!
Проверить количество своего опыта ранга можно, прописав \`/profile info\`!`)

                                await member.roles.remove(oldrank).catch()
                                await member.roles.add(newrank).catch()
                                if (result.displayname.custom_rank === false && guildData.seasonal.new_year.enabled == false) {
                                    result.displayname.rank = `🍂`

                                } else if (result.displayname.custom_rank === false && guildData.seasonal.new_year.enabled == true) {
                                    result.displayname.rank = `🎀`
                                }
                                result.rank_number = 3
                                result.save()


                                await guild.channels.cache.get(ch_list.main).send({
                                    embeds: [rank_update]
                                })
                                console.log(chalk.blackBright(`[${new Date()}]`) + chalk.green(`[${member.user.username} повысил ранг]`) + chalk.gray(`: Теперь он ${newrank.name}.`))
                            }

                        }

                        else if (result.rank >= 1000 && result.rank < 1500) { //Чемпион
                            const oldrank = [nov, sp, pro, mas, star, leg, vlad, lord, imp, pov]
                            const newrank = champ
                            if (!member.roles.cache.has(newrank.id)) {
                                const rank_update = new EmbedBuilder()
                                    .setTitle(`Ранг пользователя повышен!`)
                                    .setColor(Number(linksInfo.bot_color))
                                    .setThumbnail(member.user.displayAvatarURL())
                                    .setTimestamp(Date.now())
                                    .setDescription(`${member} повысил ранг гильдии! Теперь он ${newrank.name}!
Проверить количество своего опыта ранга можно, прописав \`/profile info\`!`)

                                await member.roles.remove(oldrank).catch()
                                await member.roles.add(newrank).catch()
                                if (result.displayname.custom_rank === false && guildData.seasonal.new_year.enabled == false) {
                                    result.displayname.rank = `🍁`

                                } else if (result.displayname.custom_rank === false && guildData.seasonal.new_year.enabled == true) {
                                    result.displayname.rank = `🍊`
                                }
                                result.rank_number = 4
                                result.save()


                                await guild.channels.cache.get(ch_list.main).send({
                                    embeds: [rank_update]
                                })
                                console.log(chalk.blackBright(`[${new Date()}]`) + chalk.green(`[${member.user.username} повысил ранг]`) + chalk.gray(`: Теперь он ${newrank.name}.`))
                            }

                        }

                        else if (result.rank >= 1500 && result.rank < 2500) { //Звездочка
                            const oldrank = [nov, sp, pro, mas, champ, leg, vlad, lord, imp, pov]
                            const newrank = star
                            if (!member.roles.cache.has(newrank.id)) {
                                const rank_update = new EmbedBuilder()
                                    .setTitle(`Ранг пользователя повышен!`)
                                    .setColor(Number(linksInfo.bot_color))
                                    .setThumbnail(member.user.displayAvatarURL())
                                    .setTimestamp(Date.now())
                                    .setDescription(`${member} повысил ранг гильдии! Теперь он ${newrank.name}!
Проверить количество своего опыта ранга можно, прописав \`/profile info\`!`)

                                await member.roles.remove(oldrank).catch()
                                await member.roles.add(newrank).catch()
                                if (result.displayname.custom_rank === false && guildData.seasonal.new_year.enabled == false) {
                                    result.displayname.rank = `⭐`

                                } else if (result.displayname.custom_rank === false && guildData.seasonal.new_year.enabled == true) {
                                    result.displayname.rank = `⛄`
                                }
                                result.rank_number = 5
                                result.save()


                                await guild.channels.cache.get(ch_list.main).send({
                                    embeds: [rank_update]
                                })
                                console.log(chalk.blackBright(`[${new Date()}]`) + chalk.green(`[${member.user.username} повысил ранг]`) + chalk.gray(`: Теперь он ${newrank.name}.`))
                            }

                        }

                        else if (result.rank >= 2500 && result.rank < 5000) { //Легенда
                            const oldrank = [nov, sp, pro, mas, champ, star, vlad, lord, imp, pov]
                            const newrank = leg
                            if (!member.roles.cache.has(newrank.id)) {
                                const rank_update = new EmbedBuilder()
                                    .setTitle(`Ранг пользователя повышен!`)
                                    .setColor(Number(linksInfo.bot_color))
                                    .setThumbnail(member.user.displayAvatarURL())
                                    .setTimestamp(Date.now())
                                    .setDescription(`${member} повысил ранг гильдии! Теперь он ${newrank.name}!
Проверить количество своего опыта ранга можно, прописав \`/profile info\`!`)

                                await member.roles.remove(oldrank).catch()
                                await member.roles.add(newrank).catch()
                                if (result.displayname.custom_rank === false && guildData.seasonal.new_year.enabled == false) {
                                    result.displayname.rank = `🏅`

                                } else if (result.displayname.custom_rank === false && guildData.seasonal.new_year.enabled == true) {
                                    result.displayname.rank = `🎄`
                                }
                                result.rank_number = 6
                                result.save()


                                await guild.channels.cache.get(ch_list.main).send({
                                    embeds: [rank_update]
                                })
                                console.log(chalk.blackBright(`[${new Date()}]`) + chalk.green(`[${member.user.username} повысил ранг]`) + chalk.gray(`: Теперь он ${newrank.name}.`))
                            }

                        }

                        else if (result.rank >= 5000 && result.rank < 10000) {//Владыка

                            const oldrank = [nov, sp, pro, mas, champ, star, lord, imp, pov]
                            const newrank = [leg, vlad]
                            if (!member.roles.cache.has(newrank[0].id) || !member.roles.cache.has(newrank[1].id)) {
                                const rank_update = new EmbedBuilder()
                                    .setTitle(`Ранг пользователя повышен!`)
                                    .setColor(Number(linksInfo.bot_color))
                                    .setThumbnail(member.user.displayAvatarURL())
                                    .setTimestamp(Date.now())
                                    .setDescription(`${member} повысил ранг гильдии! Теперь он ${newrank[1].name}!
Проверить количество своего опыта ранга можно, прописав \`/profile info\`!`)

                                await member.roles.remove(oldrank).catch()
                                await member.roles.add(newrank).catch()
                                if (result.displayname.custom_rank === false && guildData.seasonal.new_year.enabled == false) {
                                    result.displayname.rank = `🍓`

                                } else if (result.displayname.custom_rank === false && guildData.seasonal.new_year.enabled == true) {
                                    result.displayname.rank = `🍷`
                                }
                                result.rank_number = 7
                                result.save()


                                await guild.channels.cache.get(ch_list.main).send({
                                    embeds: [rank_update]
                                })
                                console.log(chalk.blackBright(`[${new Date()}]`) + chalk.green(`[${member.user.username} повысил ранг]`) + chalk.gray(`: Теперь он ${newrank[0].name} & ${newrank[1].name}`))
                            }

                        }

                        else if (result.rank >= 10000 && result.rank < 25000 && member.roles.cache.has(`930520087797051452`)) { //Лорд
                            const oldrank = [nov, sp, pro, mas, champ, star, vlad, leg, imp, pov]
                            const newrank = lord
                            if (!member.roles.cache.has(newrank.id)) {
                                const rank_update = new EmbedBuilder()
                                    .setTitle(`Ранг пользователя повышен!`)
                                    .setColor(Number(linksInfo.bot_color))
                                    .setThumbnail(member.user.displayAvatarURL())
                                    .setTimestamp(Date.now())
                                    .setDescription(`${member} повысил ранг гильдии! Теперь он ${newrank.name}!
Проверить количество своего опыта ранга можно, прописав \`/profile info\`!`)

                                await member.roles.remove(oldrank).catch()
                                await member.roles.add(newrank).catch()
                                if (result.displayname.custom_rank === false && guildData.seasonal.new_year.enabled == false) {
                                    result.displayname.rank = `🧨`

                                } else if (result.displayname.custom_rank === false && guildData.seasonal.new_year.enabled == true) {
                                    result.displayname.rank = `🧁`
                                }
                                result.rank_number = 8
                                result.save()


                                await guild.channels.cache.get(ch_list.main).send({
                                    embeds: [rank_update]
                                })
                                console.log(chalk.blackBright(`[${new Date()}]`) + chalk.green(`[${member.user.username} повысил ранг]`) + chalk.gray(`: Теперь он ${newrank.name}.`))
                            }

                        }

                        else if (result.rank >= 25000 && result.rank < 50000 && member.roles.cache.has(`930520087797051452`)) { //Император
                            const oldrank = [nov, sp, pro, mas, champ, star, vlad, leg, pov]
                            const newrank = [lord, imp]
                            if (!member.roles.cache.has(newrank[0].id) || !member.roles.cache.has(newrank[1].id)) {
                                const rank_update = new EmbedBuilder()
                                    .setTitle(`Ранг пользователя повышен!`)
                                    .setColor(Number(linksInfo.bot_color))
                                    .setThumbnail(member.user.displayAvatarURL())
                                    .setTimestamp(Date.now())
                                    .setDescription(`${member} повысил ранг гильдии! Теперь он ${newrank[1].name}!
Проверить количество своего опыта ранга можно, прописав \`/profile info\`!`)

                                await member.roles.remove(oldrank).catch()
                                await member.roles.add(newrank).catch()
                                if (result.displayname.custom_rank === false && guildData.seasonal.new_year.enabled == false) {
                                    result.displayname.rank = `💎`

                                } else if (result.displayname.custom_rank === false && guildData.seasonal.new_year.enabled == true) {
                                    result.displayname.rank = `🍧`
                                }
                                result.rank_number = 9
                                result.save()


                                await guild.channels.cache.get(ch_list.main).send({
                                    embeds: [rank_update]
                                })
                                console.log(chalk.blackBright(`[${new Date()}]`) + chalk.green(`[${member.user.username} повысил ранг]`) + chalk.gray(`: Теперь он ${newrank[0].name} & ${newrank[1].name}`))
                            }

                        }

                        else if (result.rank >= 50000 && member.roles.cache.has(`930520087797051452`)) { //Повелитель
                            const oldrank = [nov, sp, pro, mas, champ, star, vlad, leg, imp, lord]
                            const newrank = pov
                            if (!member.roles.cache.has(newrank.id)) {
                                const rank_update = new EmbedBuilder()
                                    .setTitle(`Ранг пользователя повышен!`)
                                    .setColor(Number(linksInfo.bot_color))
                                    .setThumbnail(member.user.displayAvatarURL())
                                    .setTimestamp(Date.now())
                                    .setDescription(`${member} повысил ранг гильдии! Теперь он ${newrank.name}!
Проверить количество своего опыта ранга можно, прописав \`/profile info\`!`)

                                await member.roles.remove(oldrank).catch()
                                await member.roles.add(newrank).catch()
                                if (result.displayname.custom_rank === false && guildData.seasonal.new_year.enabled == false) {
                                    result.displayname.rank = `🍇`

                                } else if (result.displayname.custom_rank === false && guildData.seasonal.new_year.enabled == true) {
                                    result.displayname.rank = `🍾`
                                }
                                result.rank_number = 10
                                result.save()


                                await guild.channels.cache.get(ch_list.main).send({
                                    embeds: [rank_update]
                                })
                                console.log(chalk.blackBright(`[${new Date()}]`) + chalk.green(`[${member.user.username} повысил ранг]`) + chalk.gray(`: Теперь он ${newrank.name}`))
                            }
                        }
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