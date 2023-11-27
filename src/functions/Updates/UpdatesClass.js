
const { User } = require(`../../schemas/userdata`)
const chalk = require(`chalk`)
const { EmbedBuilder, GuildMember } = require("discord.js")
const ch_list = require(`../../discord structure/channels.json`)
const { checkPlugin, mentionCommand } = require("../../functions");
const { Temp } = require(`../../schemas/temp_items`)
const { Guild } = require(`../../schemas/guilddata`)
const { GuildProgress } = require("../../misc_functions/Classes/Profile/progress_class")

class UserUpdates {
    /** @private */
    static id = "items";
    /** @private */
    static name = "Предметы"
    /**
     * 
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async rank_update(client) {
        try {
            if (!await checkPlugin("320193302844669959", this.id)) return;
            const guild = await client.guilds.fetch(`320193302844669959`)
            const guildData = await Guild.findOne({ id: guild.id })
            const results = await User.find({ rank: { $gte: 0 } })
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

            for (let result of results) {
                if (result.black_hole.enabled !== true) {
                    const { userid } = result;
                    const member = await guild.members.fetch(userid)
                    if (member.roles.cache.has(`504887113649750016`)) {
                        if (result.rank >= 0 && result.rank < 50) { //Новичок
                            const oldrank = [sp, pro, mas, champ, star, leg, vlad, lord, imp, pov]
                            const newrank = nov
                            if (!member.roles.cache.has(newrank.id)) {

                                const rank_update = new EmbedBuilder()
                                    .setTitle(`Ранг пользователя повышен!`)
                                    .setColor(Number(client.information.bot_color))
                                    .setThumbnail(member.user.displayAvatarURL())
                                    .setTimestamp(Date.now())
                                    .setDescription(`${member} повысил ранг гильдии! Теперь он ${newrank}!
Проверить количество своего опыта ранга можно, прописав ${mentionCommand(client, 'profile')}!`)

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
                                    .setColor(Number(client.information.bot_color))
                                    .setThumbnail(member.user.displayAvatarURL())
                                    .setTimestamp(Date.now())
                                    .setDescription(`${member} повысил ранг гильдии! Теперь он ${newrank}!
Проверить количество своего опыта ранга можно, прописав ${mentionCommand(client, 'profile')}!`)

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
                                    .setColor(Number(client.information.bot_color))
                                    .setThumbnail(member.user.displayAvatarURL())
                                    .setTimestamp(Date.now())
                                    .setDescription(`${member} повысил ранг гильдии! Теперь он ${newrank}!
Проверить количество своего опыта ранга можно, прописав ${mentionCommand(client, 'profile')}!`)

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
                                    .setColor(Number(client.information.bot_color))
                                    .setThumbnail(member.user.displayAvatarURL())
                                    .setTimestamp(Date.now())
                                    .setDescription(`${member} повысил ранг гильдии! Теперь он ${newrank}!
Проверить количество своего опыта ранга можно, прописав ${mentionCommand(client, 'profile')}!`)

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
                                    .setColor(Number(client.information.bot_color))
                                    .setThumbnail(member.user.displayAvatarURL())
                                    .setTimestamp(Date.now())
                                    .setDescription(`${member} повысил ранг гильдии! Теперь он ${newrank}!
Проверить количество своего опыта ранга можно, прописав ${mentionCommand(client, 'profile')}!`)

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
                                    .setColor(Number(client.information.bot_color))
                                    .setThumbnail(member.user.displayAvatarURL())
                                    .setTimestamp(Date.now())
                                    .setDescription(`${member} повысил ранг гильдии! Теперь он ${newrank}!
Проверить количество своего опыта ранга можно, прописав ${mentionCommand(client, 'profile')}!`)

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
                                    .setColor(Number(client.information.bot_color))
                                    .setThumbnail(member.user.displayAvatarURL())
                                    .setTimestamp(Date.now())
                                    .setDescription(`${member} повысил ранг гильдии! Теперь он ${newrank}!
Проверить количество своего опыта ранга можно, прописав ${mentionCommand(client, 'profile')}!`)

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
                                    .setColor(Number(client.information.bot_color))
                                    .setThumbnail(member.user.displayAvatarURL())
                                    .setTimestamp(Date.now())
                                    .setDescription(`${member} повысил ранг гильдии! Теперь он ${newrank[1]}!
Проверить количество своего опыта ранга можно, прописав ${mentionCommand(client, 'profile')}!`)

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
                                    .setColor(Number(client.information.bot_color))
                                    .setThumbnail(member.user.displayAvatarURL())
                                    .setTimestamp(Date.now())
                                    .setDescription(`${member} повысил ранг гильдии! Теперь он ${newrank}!
Проверить количество своего опыта ранга можно, прописав ${mentionCommand(client, 'profile')}!`)

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
                                    .setColor(Number(client.information.bot_color))
                                    .setThumbnail(member.user.displayAvatarURL())
                                    .setTimestamp(Date.now())
                                    .setDescription(`${member} повысил ранг гильдии! Теперь он ${newrank[1]}!
Проверить количество своего опыта ранга можно, прописав ${mentionCommand(client, 'profile')}!`)

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
                                    .setColor(Number(client.information.bot_color))
                                    .setThumbnail(member.user.displayAvatarURL())
                                    .setTimestamp(Date.now())
                                    .setDescription(`${member} повысил ранг гильдии! Теперь он ${newrank}!
Проверить количество своего опыта ранга можно, прописав ${mentionCommand(client, 'profile')}!`)

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

    /**
    * 
    * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
    */
    static async AutoElements(client) {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", this.id)) return;
            const results = await User.find({ guildid: guild.id })

            for (const result of results) {
                if (result.black_hole.enabled !== true) {
                    const { elements } = result
                    const member = await guild.members.fetch(result.userid)

                    if (elements.diving == 1 && elements.resistance == 1 && elements.respiration == 1 && !member.roles.cache.has(`930169139866259496`)) {
                        const done = new EmbedBuilder()
                            .setTitle(`Выдана стихия`)
                            .setColor(Number(client.information.bot_color))
                            .setThumbnail(member.user.displayAvatarURL())
                            .setTimestamp(Date.now())
                            .setDescription(`${member} получил \`${guild.roles.cache.get(`930169139866259496`).name}\`!`)
                        await member.roles.add(`930169139866259496`)
                        await guild.channels.cache.get(ch_list.main).send({
                            embeds: [done]
                        })
                    }

                    if (elements.eagle_eye == 1 && elements.wind == 1 && elements.flying == 1 && !member.roles.cache.has(`930169145314652170`)) {
                        const done = new EmbedBuilder()
                            .setTitle(`Выдана стихия`)
                            .setColor(Number(client.information.bot_color))
                            .setThumbnail(member.user.displayAvatarURL())
                            .setTimestamp(Date.now())
                            .setDescription(`${member} получил \`${guild.roles.cache.get(`930169145314652170`).name}\`!`)
                        await member.roles.add(`930169145314652170`)
                        await guild.channels.cache.get(ch_list.main).send({
                            embeds: [done]
                        })
                    }

                    if (elements.fast_grow == 1 && elements.mountains == 1 && elements.underground == 1 && !member.roles.cache.has(`930169143347523604`)) {
                        const done = new EmbedBuilder()
                            .setTitle(`Выдана стихия`)
                            .setColor(Number(client.information.bot_color))
                            .setThumbnail(member.user.displayAvatarURL())
                            .setTimestamp(Date.now())
                            .setDescription(`${member} получил \`${guild.roles.cache.get(`930169143347523604`).name}\`!`)
                        await member.roles.add(`930169143347523604`)
                        await guild.channels.cache.get(ch_list.main).send({
                            embeds: [done]
                        })
                    }

                    if (elements.fire_resistance == 1 && elements.flame == 1 && elements.lightning == 1 && !member.roles.cache.has(`930169133671280641`)) {
                        const done = new EmbedBuilder()
                            .setTitle(`Выдана стихия`)
                            .setColor(Number(client.information.bot_color))
                            .setThumbnail(member.user.displayAvatarURL())
                            .setTimestamp(Date.now())
                            .setDescription(`${member} получил \`${guild.roles.cache.get(`930169133671280641`).name}\`!`)
                        await member.roles.add(`930169133671280641`)
                        await guild.channels.cache.get(ch_list.main).send({
                            embeds: [done]
                        })
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

    /**
    * 
    * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
    */
    static async AutoStars(client) {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", this.id)) return;
            const results = await User.find({ guildid: guild.id })

            for (const result of results) {
                if (result.black_hole.enabled !== true) {
                    const member = await guild.members.fetch(result.userid)
                    let a = `553660090184499201`
                    let b = `553660091677540363`
                    let c = `553660093523034112`
                    let d = `553660095259475989`
                    let e = `553660095951667217`
                    let f = `553660097520205824`
                    let g = `572417192755462165`
                    let h = `595962185641885716`
                    let i = `609082751349686282`

                    let aa = `531158683883929602`
                    let ab = `531158275400531988`
                    let ac = `553660120379293696`
                    let ad = `553660121444515842`
                    let ae = `931866162508230696`

                    let ba = `609085186738618395`
                    let bb = `609086542681604142`
                    let bc = `781069819838464022`
                    let bd = `785252400608182282`
                    let be = `781069820053160006`

                    let ca = `784434241613987861`
                    let cb = `784434242083487826`
                    let cc = `781069818525777940`

                    if (member.roles.cache.hasAll(a, b, c, d, e, f, g, h, i)) {

                        if (!member.roles.cache.has(aa)) {
                            await member.roles.remove([a, b, c, d, e, f, g, h, i])
                            await member.roles.add(aa)
                        } else if (!member.roles.cache.has(ab)) {
                            await member.roles.remove([a, b, c, d, e, f, g, h, i])
                            await member.roles.add(ab)
                        } else if (!member.roles.cache.has(ac)) {
                            await member.roles.remove([a, b, c, d, e, f, g, h, i])
                            await member.roles.add(ac)
                        } else if (!member.roles.cache.has(ad)) {
                            await member.roles.remove([a, b, c, d, e, f, g, h, i])
                            await member.roles.add(ad)
                        } else if (!member.roles.cache.has(ae)) {
                            await member.roles.remove([a, b, c, d, e, f, g, h, i])
                            await member.roles.add(ae)
                        }
                    }

                    if (member.roles.cache.hasAll(aa, ab, ac, ad, ae)) {
                        if (!member.roles.cache.has(ba)) {
                            await member.roles.remove([aa, ab, ac, ad, ae])
                            await member.roles.add(ba)
                        } else if (!member.roles.cache.has(bb)) {
                            await member.roles.remove([aa, ab, ac, ad, ae])
                            await member.roles.add(bb)
                        } else if (!member.roles.cache.has(bc)) {
                            await member.roles.remove([aa, ab, ac, ad, ae])
                            await member.roles.add(bc)
                        } else if (!member.roles.cache.has(bd)) {
                            await member.roles.remove([aa, ab, ac, ad, ae])
                            await member.roles.add(bd)
                        } else if (!member.roles.cache.has(be)) {
                            await member.roles.remove([aa, ab, ac, ad, ae])
                            await member.roles.add(be)
                        }
                    }

                    if (member.roles.cache.hasAll(ba, bb, bc, bd, be)) {
                        if (!member.roles.cache.has(ca)) {
                            await member.roles.remove([ba, bb, bc, bd, be])
                            await member.roles.add(ca)
                        } else if (!member.roles.cache.has(cb)) {
                            await member.roles.remove([ba, bb, bc, bd, be])
                            await member.roles.add(cb)
                        } else if (!member.roles.cache.has(cc)) {
                            await member.roles.remove([ba, bb, bc, bd, be])
                            await member.roles.add(cc)
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

    /**
    * 
    * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
    */
    static async Boosters(client) {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", this.id)) return;
            const userDatas = await User.find({ guildid: guild.id })

            for (const userData of userDatas) {
                if (userData.black_hole.enabled !== true) {
                    const member = await guild.members.fetch(userData.userid)
                    let temps = await Temp.find({ userid: userData.userid, guildid: userData.guildid })
                    let temps_act = await temps.filter(t => t.extraInfo == `pers_act_boost`)
                    let act_boost = 1
                    if (temps_act) {
                        for (let temp of temps_act) {
                            if (temp == temps_act[0]) act_boost = act_boost + (temp.number - 1)
                            else act_boost = act_boost + (temp.number)
                        }
                    }
                    let sub_act = 0
                    if (userData.sub_type == 0) sub_act = 0
                    else if (userData.sub_type == 1) sub_act = 0.5
                    else if (userData.sub_type == 2) sub_act = 1
                    else if (userData.sub_type == 3) sub_act = 2
                    else if (userData.sub_type == 4) sub_act = 4
                    else sub_act = 0

                    userData.pers_act_boost = 1 * (act_boost + sub_act)

                    let temps_rank = await temps.filter(t => t.extraInfo == `pers_rank_boost`)
                    let rank_boost = 1
                    if (temps_rank) {
                        for (let temp of temps_rank) {
                            if (temp == temps_rank[0]) rank_boost = rank_boost + (temp.number - 1)
                            else rank_boost = rank_boost + (temp.number)
                        }
                    }

                    let sub_rank = 0
                    if (userData.sub_type == 0) sub_rank = 0
                    else if (userData.sub_type == 1) sub_rank = 0
                    else if (userData.sub_type == 2) sub_rank = 0.5
                    else if (userData.sub_type == 3) sub_rank = 1
                    else if (userData.sub_type == 4) sub_rank = 2
                    else sub_rank = 0

                    userData.pers_rank_boost = 1 * (rank_boost + sub_rank)


                    let temps_rumb = await temps.filter(t => t.extraInfo == `pers_rumb_boost`)
                    let rumb_boost = 1
                    if (temps_rumb) {
                        for (let temp of temps_rumb) {
                            if (temp == temps_rumb[0]) rumb_boost = rumb_boost + (temp.number - 1)
                            else rumb_boost = rumb_boost + (temp.number)
                        }
                    }

                    userData.pers_rumb_boost = 1 * rumb_boost


                    let temps_com = await temps.filter(t => t.extraInfo == `box_chances.common`)
                    let com = 1
                    if (temps_com) {
                        for (let temp of temps_com) {
                            if (temp == temps_com[0]) com = com + (temp.number - 1)
                            else com = com + (temp.number)
                        }
                    }

                    userData.box_chances.common = 1 * com

                    let temps_uncom = await temps.filter(t => t.extraInfo == `box_chances.uncommon`)
                    let uncom = 1
                    if (temps_uncom) {
                        for (let temp of temps_uncom) {
                            if (temp == temps_uncom[0]) uncom = uncom + (temp.number - 1)
                            else uncom = uncom + (temp.number)
                        }
                    }

                    userData.box_chances.uncommon = 1 * uncom

                    let temps_rare = await temps.filter(t => t.extraInfo == `box_chances.rare`)
                    let rare = 1
                    if (temps_rare) {
                        for (let temp of temps_rare) {
                            if (temp == temps_rare[0]) rare = rare + (temp.number - 1)
                            else rare = rare + (temp.number)
                        }
                    }

                    userData.box_chances.rare = 1 * rare

                    let temps_epic = await temps.filter(t => t.extraInfo == `box_chances.epic`)
                    let epic = 1
                    if (temps_epic) {
                        for (let temp of temps_epic) {
                            if (temp == temps_epic[0]) epic = epic + (temp.number - 1)
                            else epic = epic + (temp.number)
                        }
                    }

                    userData.box_chances.epic = 1 * epic

                    let temps_leg = await temps.filter(t => t.extraInfo == `box_chances.legendary`)
                    let leg = 1
                    if (temps_leg) {
                        for (let temp of temps_leg) {
                            if (temp == temps_leg[0]) leg = leg + (temp.number - 1)
                            else leg = leg + (temp.number)
                        }
                    }

                    userData.box_chances.legendary = 1 * leg

                    let temps_myth = await temps.filter(t => t.extraInfo == `box_chances.mythical`)
                    let myth = 1
                    if (temps_myth) {
                        for (let temp of temps_myth) {
                            if (temp == temps_myth[0]) myth = myth + (temp.number - 1)
                            else myth = myth + (temp.number)
                        }
                    }

                    userData.box_chances.mythical = 1 * myth

                    let temps_RNG = await temps.filter(t => t.extraInfo == `box_chances.RNG`)
                    let RNG = 1
                    if (temps_RNG) {
                        for (let temp of temps_RNG) {
                            if (temp == temps_RNG[0]) RNG = RNG + (temp.number - 1)
                            else RNG = RNG + (temp.number)
                        }
                    }

                    userData.box_chances.RNG = 1 * RNG

                    userData.save()
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

    /**
    * 
    * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
    */
    static async checkSubscription(client) {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", this.id)) return;
            const results = await User.find({ guildid: guild.id })

            for (const result of results) {
                if (result.black_hole.enabled !== true) {
                    const { userid, displayname, pers_emoji } = result;
                    const member = await guild.members.fetch(userid)
                    if (member.roles.cache.has(`850336260265476096`)) {
                        displayname.premium = `💳`
                        if (member.roles.cache.has("780487592540897349")) {
                            if (member.roles.cache.has("1007290182883622974")) {
                                result.stacked_items.push("1007290182883622974")
                            } else if (member.roles.cache.has("1007290181847613530")) {
                                result.stacked_items.push("1007290181847613530")
                            } else if (member.roles.cache.has("1007290181038133269")) {
                                result.stacked_items.push("1007290181038133269")
                            }
                        }
                        await member.roles.remove(["1007290182883622974", "1007290181847613530", "1007290181038133269"])
                        result.sub_type = 4
                    } else if (member.roles.cache.has(`1007290182883622974`)) {
                        displayname.premium = ``
                        if (member.roles.cache.has("780487592540897349")) {
                            if (member.roles.cache.has("1007290181847613530")) {
                                result.stacked_items.push("1007290181847613530")
                            } else if (member.roles.cache.has("1007290181038133269")) {
                                result.stacked_items.push("1007290181038133269")
                            }
                        }
                        await member.roles.remove(["1007290181847613530", "1007290181038133269"])
                        result.sub_type = 3
                    } else if (member.roles.cache.has(`1007290181847613530`)) {
                        displayname.premium = ``
                        if (member.roles.cache.has("780487592540897349")) {
                            if (member.roles.cache.has("1007290181038133269")) {
                                result.stacked_items.push("1007290181038133269")
                            }
                        }
                        await member.roles.remove("1007290181038133269")
                        result.sub_type = 2
                    } else if (member.roles.cache.has(`1007290181038133269`)) {
                        displayname.premium = ``
                        result.sub_type = 1
                    } else {
                        displayname.premium = ``
                        result.sub_type = 0
                    }

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

    /**
    * 
    * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
    */
    static async Discounts(client) {
        try {
            if (!await checkPlugin("320193302844669959", this.id)) return;
            const userDatas = await User.find()
            for (const userData of userDatas) {
                if (userData.black_hole.enabled !== true) {
                    let shop = 1
                    let sub_info = 0
                    if (userData.sub_type == 0) sub_info = 0
                    else if (userData.sub_type == 1) sub_info = 0
                    else if (userData.sub_type == 2) sub_info = 0.05
                    else if (userData.sub_type == 3) sub_info = 0.1
                    else if (userData.sub_type == 4) sub_info = 0.2
                    let tempDiscs = await Temp.find({ userid: userData.userid, extraInfo: `shop_costs` })
                    let tempDisc = 0
                    for (let discs of tempDiscs) {
                        if (discs.number < tempDisc) tempDisc = tempDisc
                        else if (discs.number >= tempDisc) tempDisc = discs.number
                    }
                    let shop_perk = userData.perks.shop_discount * 0.05
                    let avDiscs = [sub_info.toFixed(2), tempDisc.toFixed(2), shop_perk.toFixed(2)]
                    shop = 1 - (avDiscs.sort((a, b) => b - a)[0])

                    userData.shop_costs = shop



                    let king_perk = userData.perks.king_discount * 0.05

                    userData.king_costs = 1 - king_perk

                    let act_perk = userData.perks.act_discount * 0.1

                    userData.act_costs = 1 - act_perk

                    userData.save()
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

    /**
    * 
    * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
    */
    static async AutoMythical(client) {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", this.id)) return;
            const results = await User.find({ guildid: guild.id })
            const channel = await guild.channels.cache.get(ch_list.main)

            for (let result of results) {
                if (result.black_hole.enabled !== true) {
                    const member = await guild.members.fetch(result.userid)
                    let mer = `743831211667095592`
                    let ven = `597746062798880778`
                    let mun = `780487592540897349`
                    let mars = `597746057203548160`
                    let jup = `597746054808731648`
                    let sat = `597746059879645185`
                    let ura = `745326453369077841`
                    let nep = `780487592859795456`
                    let plu = `597746051998285834`

                    let SUN = `781069817384927262`
                    let roles = [mer, ven, mun, mars, jup, sat, ura, nep, plu]
                    let check = []

                    for (let role of roles) {
                        if (member.roles.cache.has(role)) {
                            check.push(true)
                        } else {
                            check.push(false)
                        }
                    }

                    if (!check.includes(false) && !member.roles.cache.has(SUN)) {
                        await member.roles.add(SUN)

                        const embed = new EmbedBuilder()
                            .setTitle(`Собраны все мифические роли`)
                            .setColor(Number(client.information.bot_color))
                            .setThumbnail(member.user.displayAvatarURL())
                            .setTimestamp(Date.now())
                            .setDescription(`Поздравляем, ${member}! Вы собрали все мифические награды, и вам была выдана особая мифическая награда - **СОЛНЦЕ**!`)

                        await channel.send({
                            embeds: [embed]
                        })
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


    /**
    * @param {GuildMember} oldMember 
    * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
    */
    static async ProgressUpdate(oldMember, client) {
        try {
            if (!oldMember) {
                const userDatas = await User.find()
                for (const userData of userDatas) {
                    const guild = await client.guilds.cache.get(userData.guildid)
                    const member = await guild.members.fetch(userData.userid)
                    const progress = new GuildProgress(member, client)
                    await progress.getAndUpdateUserPoints()
                }
                console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magenta(`[ОБНОВЛЕНИЕ ПРОГРЕССА]`) + chalk.gray(`: Прогресс развития участников в гильдии был обновлён!`))

            } else {
                const guild = oldMember.guild
                const member = await guild.members.fetch(oldMember.user.id)
                const progress = new GuildProgress(member, client)
                await progress.getAndUpdateUserPoints()
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

    /**
     * 
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async removeNonPremiumColors(client) {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", this.id)) return;
            const results = await User.find({ guildid: guild.id })
            const r1 = `595893144055316490`; //Чёрный
            const r2 = `595892599693246474`; //Лазурный
            const r3 = `595892677451710468`; //Пурпурный
            const r4 = `595892238370996235`; //Сиреневый
            const r5 = `589770984391966760`; //Фламинговый
            const r6 = `595893568485326862`; //Изумрудный 
            const r7 = `630395361508458516`; //Яблочный
            const r8 = `595892930204401665`; //Салатовый
            const r9 = `595889341058777088`; //Песочный
            const r10 = `1024741633947873401`; //Ализариновый
            for (const result of results) {
                if (result.black_hole.enabled !== true) {
                    const { userid, displayname, pers_emoji } = result;
                    const member = await guild.members.fetch(userid)
                    if (
                        !member.roles.cache.has(`850336260265476096`) &&
                        !member.roles.cache.has(`780487593485008946`) &&
                        !member.roles.cache.has(`849695880688173087`) &&
                        !member.roles.cache.has(`992122876394225814`) &&
                        !member.roles.cache.has(`992123014831419472`) &&
                        !member.roles.cache.has(`992123019793276961`) &&
                        (
                            member.roles.cache.has(r1) ||
                            member.roles.cache.has(r2) ||
                            member.roles.cache.has(r3) ||
                            member.roles.cache.has(r4) ||
                            member.roles.cache.has(r5) ||
                            member.roles.cache.has(r6) ||
                            member.roles.cache.has(r7) ||
                            member.roles.cache.has(r8) ||
                            member.roles.cache.has(r9) ||
                            member.roles.cache.has(r10)
                        )
                    ) {
                        await member.roles.remove([r1, r2, r3, r4, r5, r6, r7, r8, r9, r10])
                    }
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

    /**
     * 
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async BankAccountCheck(client) {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", this.id)) return;
            const userDatas = await User.find({ "bank.expire": { $lte: Date.now() }, "bank.opened": true })
            for (let userData of userDatas) {
                const member = await guild.members.fetch(userData.userid)
                const balance = userData.bank.balance
                userData.rumbik += Math.floor(userData.bank.balance * userData.bank.multiplier)
                userData.progress.items.find(it => it.name == 'RUMBIKS_TOTAL').total_items += Math.floor(balance * (userData.bank.multiplier - 1))
                userData.bank.balance = 0
                userData.bank.opened = false
                userData.save()
                await member.send({
                    content: `## Ваш банковский вклад закрыт
Ваш банковский вклад на сумму ${balance}<:Rumbik:883638847056003072> был закрыт.
Ваша прибыль с данного вклада составила ${Math.floor(balance * (userData.bank.multiplier - 1))}<:Rumbik:883638847056003072>
У вас на данный момент ${userData.rumbik}<:Rumbik:883638847056003072>`
                }).catch(async e => {
                    const ch = await guild.channels.fetch(ch_list.main)
                    await ch.send({
                        content: `## Ваш банковский вклад закрыт, ${member}
Ваш банковский вклад на сумму ${balance}<:Rumbik:883638847056003072> был закрыт.
Ваша прибыль с данного вклада составила ${Math.floor(balance * (userData.bank.multiplier - 1))}}<:Rumbik:883638847056003072>
У вас на данный момент ${userData.rumbik}<:Rumbik:883638847056003072>`
                    })
                })
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

    /**
     * 
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async ResetDailyLimits(client) {
        try {
            if (!await checkPlugin("320193302844669959", this.id)) return;
            const userDatas = await User.find()
            for (let userData of userDatas) {
                userData.daily.purchases = 0
                userData.daily.sells = 0
                userData.save()
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

    /**
     * 
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async emojiUpdate(client) {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", this.id)) return;
            let userDatas = await User.find({ guildid: guild.id, onlinemode: true })
            userDatas = await userDatas.filter(userData => userData.uuid !== `bd4988c17cfa4daba1f0a2bce375b291`)
            for (const userData of userDatas) {
                const member = await guild.members.fetch(userData.userid)
                if (member.roles.cache.has(`850336260265476096`)) {
                    if (userData.pers_emoji == false) {
                        let emojiToFind = await guild.emojis.cache.find(emoji => emoji.name == userData.nickname)
                        if (!emojiToFind) emojiToFind = await guild.emojis.cache.find(emoji => emoji.name == userData.oldnickname)
                        if (!emojiToFind) {
                            try {
                                await guild.emojis.create({
                                    attachment: `https://minotar.net/helm/${userData.uuid}.png`,
                                    name: `${userData.nickname}`
                                })
                            } catch (e) {
                                console.log(`Произошла ошибка при создании эмоджи ${userData.uuid}` + e)
                            }

                            userData.pers_emoji = true
                        } else {
                            await emojiToFind.delete()
                            try {
                                await guild.emojis.create({
                                    attachment: `https://minotar.net/helm/${userData.uuid}.png`,
                                    name: `${userData.nickname}`
                                })
                            } catch (e) {
                                console.log(`Произошла ошибка при создании эмоджи ${userData.uuid}` + e)
                            }
                            userData.pers_emoji = true
                        }
                    } else if (userData.pers_emoji == true) {
                        let emojiToFind = await guild.emojis.cache.find(emoji => emoji.name == userData.nickname)
                        if (!emojiToFind) emojiToFind = await guild.emojis.cache.find(emoji => emoji.name == userData.oldnickname)
                        if (!emojiToFind) {
                            try {
                                await guild.emojis.create({
                                    attachment: `https://minotar.net/helm/${userData.uuid}.png`,
                                    name: `${userData.nickname}`
                                })
                            } catch (e) {
                                console.log(`Произошла ошибка при создании эмоджи ${userData.uuid}` + e)
                            }
                        } else {
                            await emojiToFind.delete()
                            try {
                                await guild.emojis.create({
                                    attachment: `https://minotar.net/helm/${userData.uuid}.png`,
                                    name: `${userData.nickname}`
                                })
                            } catch (e) {
                                console.log(`Произошла ошибка при создании эмоджи ${userData.uuid}` + e)
                            }
                        }
                    }
                } else if (!member.roles.cache.has(`850336260265476096`)) {
                    let emojiToFind = await guild.emojis.cache.find(emoji => emoji.name == userData.nickname)
                    if (!emojiToFind) emojiToFind = await guild.emojis.cache.find(emoji => emoji.name == userData.oldnickname)
                    if (emojiToFind) {
                        await emojiToFind.delete()
                    }
                    userData.pers_emoji = false
                }
                userData.save()
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

    /**
     * 
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async DailyEvents(client) {
        try {
            const day = new Date().getDay()
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", this.id)) return;
            const guildData = await Guild.findOne({
                id: guild.id
            })
            const main = await guild.channels.fetch(ch_list.main)
            switch (day) {
                case 0: {
                    guildData.global_settings.shop_prices = 1.25
                    guildData.save()
                    const embed = new EmbedBuilder()
                        .setColor(Number(client.information.bot_color))
                        .setTimestamp(Date.now())
                        .setDescription(`## Событие на сегодня
Все цены в магазинах гильдии повысились на 25%!`)
                    await main.send({
                        embeds: [embed]
                    })
                }
                    break;
                case 1: {
                    guildData.global_settings.shop_prices = 1
                    guildData.save()
                }
                    break;
                case 2: {

                }
                    break;
                case 3: {
                    guildData.global_settings.shop_prices = 0.95
                    guildData.save()
                    const embed = new EmbedBuilder()
                        .setColor(Number(client.information.bot_color))
                        .setTimestamp(Date.now())
                        .setDescription(`## Событие на сегодня
Все цены в магазинах гильдии понизились на 5%!`)
                    await main.send({
                        embeds: [embed]
                    })
                }
                    break;
                case 4: {
                    guildData.global_settings.shop_prices = 1
                    guildData.save()
                }
                    break;
                case 5: {

                }
                    break;
                case 6: {

                }
                    break;

                default:
                    break;
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

    /**
     * @param {String} userid Discord User ID
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async StaffPosUpdate(userid, client) {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", this.id)) return;
            if (!userid) {
                const userDatas = await User.find()

                for (let userData of userDatas) {
                    const member = await guild.members.fetch(userData.userid)
                    if (member.roles.cache.has("567689925143822346")) { //Прав
                        userData.staff_pos = 4
                    } else if (member.roles.cache.has("320880176416161802")) { //Админ
                        userData.staff_pos = 3
                    } else if (member.roles.cache.has("1059732744218882088")) { //Испыт срок
                        userData.staff_pos = 1
                    } else if (member.roles.cache.has("563793535250464809")) { //Офицер
                        userData.staff_pos = 2
                    } else {
                        userData.staff_pos = 0
                    }
                    userData.save()
                }
            } else if (userid) {
                const userData = await User.findOne({ userid: userid })
                if (!userData) return
                const member = await guild.members.fetch(userData.userid)
                if (member.roles.cache.has("567689925143822346")) { //Прав
                    userData.staff_pos = 4
                } else if (member.roles.cache.has("320880176416161802")) { //Админ
                    userData.staff_pos = 3
                } else if (member.roles.cache.has("1059732744218882088")) { //Испыт срок
                    userData.staff_pos = 1
                } else if (member.roles.cache.has("563793535250464809")) { //Офицер
                    userData.staff_pos = 2
                } else {
                    userData.staff_pos = 0
                }
                userData.save()
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


module.exports = {
    UserUpdates
}