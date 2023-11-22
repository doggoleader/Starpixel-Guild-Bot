
const { User } = require(`../../schemas/userdata`)
const chalk = require(`chalk`);
const fetch = require(`node-fetch`)
const upd_nick_api = process.env.hypixel_apikey, api = process.env.hypixel_apikey
const linksInfo = require(`../../discord structure/links.json`)
const { Guild } = require(`../../schemas/guilddata`)
const { checkPlugin } = require("../../functions");
const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } = require('discord.js');


class MCUpdates {
    id = 'hypixel';
    name = 'Hypixel'
    /**
     * 
     * @param {import("../../misc_functions/Classes/System/import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient").import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async UpdateNicknames(client) {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", this.id)) return;
            const results = await User.find({ guildid: guild.id, onlinemode: true })

            for (const result of results) {

                let response = await fetch(`https://api.hypixel.net/player?uuid=${result.uuid}`, {
                    headers: {
                        "API-Key": upd_nick_api,
                        "Content-Type": "application/json"
                    }
                })
                if (response.ok) {
                    try {
                        const oldnick = result.nickname
                        let json = await response.json()
                        if (oldnick !== json.player.displayname) {
                            result.oldnickname = oldnick
                        }
                        result.nickname = json.player.displayname;
                        result.save()
                    } catch (error) {
                        console.log(chalk.blackBright(`[${new Date()}]`) + chalk.hex(`#FFA500`)(`[HypixelAPI]`) + chalk.red(`: UUID не найден ИЛИ игрок не найден ИЛИ произошла другая ошибка!` + error))
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
    static async GEXP_PROFILES(client) {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", this.id)) return;



            let userDatas = await User.find({ guildid: guild.id, onlinemode: true })

            for (let userData of userDatas) {
                const member = await guild.members.fetch(userData.userid)
                let responseA = await fetch(`https://api.hypixel.net/guild?player=${userData.uuid}`, {
                    headers: {
                        "API-Key": api,
                        "Content-Type": "application/json"
                    }
                })
                if (responseA.ok) {

                    let json = await responseA.json()
                    if (json.guild !== null) {


                        if (json.guild._id == `5c1902fc77ce84cd430f3959`) {
                            try {
                                let player = await json.guild.members.find(member => member.uuid == userData.uuid)
                                let gexpObj = player.expHistory
                                let gexpArray = Object.entries(gexpObj)
                                let info_date = gexpArray[1][0]
                                let info_value = gexpArray[1][1]
                                let tr = await userData.gexp_info.find(i => i.date == info_date)
                                if (!tr) {
                                    if (userData.rank_number >= 5) {
                                        userData.gexp += info_value
                                        while (userData.gexp >= 50000 - (50000 * 0.10 * userData.perks.ticket_discount)) {
                                            userData.gexp -= 50000 - (50000 * 0.10 * userData.perks.ticket_discount)
                                            userData.tickets += 1
                                            userData.progress.items.find(it => it.name == 'TICKETS_TOTAL').total_items += 1
                                            console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magenta(`[Получены билеты]`) + chalk.gray(`: ${member.user.username} получил 1 билет. Теперь у него ${userData.tickets} билетов`))
                                        }
                                    }
                                    userData.gexp_info.push({
                                        date: info_date,
                                        gexp: info_value
                                    })
                                    userData.black_hole.info.GEXP_lastMonth += info_value
                                } else {
                                    tr.gexp = info_value
                                }
                                userData.save()


                            } catch (error) {
                                console.log(chalk.blackBright(`[${new Date()}]`) + chalk.hex(`#FFA500`)(`[HypixelAPI]`) + chalk.red(`: Произошла ошибка при обновлении данных о GEXP пользователя ${userData.uuid} (${userData.nickname})!`));
                                console.log(error)
                            }
                        } else {
                            console.log(chalk.blackBright(`[${new Date()}]`) + chalk.hex(`#FFA500`)(`[HypixelAPI]`) + chalk.red(`: Игрок ${userData.uuid} (${userData.nickname}) не состоит в гильдии Starpixel!`));
                        }
                    } else {
                        console.log(chalk.blackBright(`[${new Date()}]`) + chalk.hex(`#FFA500`)(`[HypixelAPI]`) + chalk.red(`: Игрок ${userData.uuid} (${userData.nickname}) не состоит ни в какой гильдии на Hypixel!`));
                    }
                } else {
                    console.log(chalk.blackBright(`[${new Date()}]`) + `Гильдия не найдена или игрок не найден.`)
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
    static async InGuildRewards(client) {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", this.id)) return;
            let userDatas = await User.find({ guildid: guild.id, onlinemode: true })
            const response = await fetch(`https://api.hypixel.net/guild?id=5c1902fc77ce84cd430f3959`, {
                headers: {
                    "API-Key": api,
                    "Content-Type": "application/json"
                }
            })
            let json
            if (response.ok) json = await response.json()
            for (let userData of userDatas) {
                if (userData.black_hole.enabled !== true) {
                    const member = await guild.members.fetch(userData.userid)
                    const ch = await guild.channels.fetch(ch_list.main)

                    let player = await json.guild.members.find(member => member.uuid == userData.uuid)
                    if (!player) console.log(chalk.hex(`#FFA500`)(`[HypixelAPI]`) + chalk.red(`: Произошла ошибка при получении данных пользователя ${userData.uuid} (${userData.nickname})!`))
                    else {
                        let rewards = require(`../../jsons/InGuildRewards.json`)
                        for (let reward of rewards) {
                            if (!userData.in_guild_rewards.includes(reward.id)) {
                                if (Math.round(Date.now() / 1000) >= Math.round((userData.joinedGuild / 1000) + reward.timestamp)) {
                                    const role = await guild.roles.fetch(reward.rewards)
                                    if (member.roles.cache.has(reward.rewards)) {

                                        await userData.stacked_items.push(reward.rewards)
                                        const embed = new EmbedBuilder()
                                            .setColor(Number(linksInfo.bot_color))
                                            .setTimestamp(Date.now())
                                            .setTitle(`Выдана награда за время в гильдии`)
                                            .setThumbnail(member.user.displayAvatarURL())
                                            .setDescription(`${member} получил награду за время в гильдии:
Период: \`${reward.name}\`
Награда: ${role}

Ваша награда была сохранена! Используйте \`/rewards claim\`, чтобы получить её!`)
                                        await ch.send({
                                            embeds: [embed]
                                        })
                                    } else {
                                        await member.roles.add(reward.rewards)
                                        const embed = new EmbedBuilder()
                                            .setColor(Number(linksInfo.bot_color))
                                            .setTimestamp(Date.now())
                                            .setTitle(`Выдана награда за время в гильдии`)
                                            .setThumbnail(member.user.displayAvatarURL())
                                            .setDescription(`${member} получил награду за время в гильдии:
Период: \`${reward.name}\`
Награда: ${role}

Ваша награда была сохранена в профиле!`)
                                        await ch.send({
                                            embeds: [embed]
                                        })
                                    }
                                    userData.in_guild_rewards.push(reward.id)
                                }
                            }
                        }
                        userData.save()
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
    static async resetMarathon(client) {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", this.id)) return;
            let userDatas = await User.find({ guildid: guild.id })
            for (const userData of userDatas) {
                userData.quests.marathon.completed = []
                userData.quests.marathon.activated.id = -1
                userData.quests.marathon.activated.required = Infinity
                userData.quests.marathon.activated.stage = -1
                userData.quests.marathon.activated.status = true
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
    static async resetVeterans(client) {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", this.id)) return;
            let userDatas = await User.find({ guildid: guild.id })
            for (const userData of userDatas) {
                userData.quests.veterans.completed = []
                userData.quests.veterans.activated.id = -1
                userData.quests.veterans.activated.required = Infinity
                userData.quests.veterans.activated.status = true
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
    static async top_3_gexp(client) {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", this.id)) return;

            let userDatas = await User.find({ guildid: guild.id, onlinemode: true })
            let b = 0
            let msg = await guild.channels.cache.get(ch_list.main).send({
                content: `Идет генерация топ-3 игроков по GEXP за неделю!`
            })
            for (let userData of userDatas) {
                userData.weekly_exp = 0
                let responseA = await fetch(`https://api.hypixel.net/guild?player=${userData.uuid}`, {
                    headers: {
                        "API-Key": api,
                        "Content-Type": "application/json"
                    }
                })
                if (responseA.ok) {

                    let json = await responseA.json()
                    if (json.guild !== null) {


                        if (json.guild._id == `5c1902fc77ce84cd430f3959`) {
                            try {
                                var i = 0
                                while (json.guild.members[i].uuid !== userData.uuid) {
                                    i++
                                }
                                let gexpObj = json.guild.members[i].expHistory
                                let gexpArray = Object.values(gexpObj)
                                let weeklyGexp = gexpArray.reduce((a, b) => a + b, 0)
                                userData.weekly_exp = weeklyGexp

                                console.log(chalk.blackBright(`[${new Date()}]`) + chalk.hex(`#FFA500`)(`[HypixelAPI]`) + chalk.gray(`: Участник ${json.guild.members[i].uuid} (${userData.nickname}) заработал за неделю ${weeklyGexp} GEXP`))


                            } catch (error) {
                                console.log(chalk.blackBright(`[${new Date()}]`) + chalk.hex(`#FFA500`)(`[HypixelAPI]`) + chalk.red(`: Произошла ошибка при обновлении данных о GEXP пользователя ${userData.uuid} (${userData.nickname})!`));
                            }
                        } else {
                            console.log(chalk.blackBright(`[${new Date()}]`) + chalk.hex(`#FFA500`)(`[HypixelAPI]`) + chalk.red(`: Игрок ${userData.uuid} (${userData.nickname}) не состоит в гильдии Starpixel!`));
                        }
                    } else {
                        console.log(chalk.blackBright(`[${new Date()}]`) + chalk.hex(`#FFA500`)(`[HypixelAPI]`) + chalk.red(`: Игрок ${userData.uuid} (${userData.nickname}) не состоит ни в какой гильдии на Hypixel!`));
                    }
                } else {
                    console.log(chalk.blackBright(`[${new Date()}]`) + `Гильдия не найдена или игрок не найден.`)
                    interaction.editReply(`Ошибка! Свяжитесь с администрацией гильдии.`)
                }

                userData.save()
                await msg.edit({
                    content: `Идет просмотр опыта у всех участников . . . 

**Прогресс**: ${b + 1}/${userDatas.length} - ${(Math.round(((b + 1) / (userDatas.length)) * 100))}% завершено . . .`
                })
                b++
            }
            let sorted = await userDatas.sort((a, c) => c.weekly_exp - a.weekly_exp)
            let top = await sorted.slice(0, 3)
            let index = 1
            let medal
            let list = top.map(async (player) => {
                let user = guild.members.fetch(player.userid)
                if (index == 1) {
                    medal = index.toString().replace(1, `🥇`)
                    player.medal_1 += 1
                    player.progress.items.find(it => it.name == 'MEDALS_1').total_items += 1
                }
                if (index == 2) {
                    medal = index.toString().replace(2, `🥈`)
                    player.medal_2 += 1
                    player.progress.items.find(it => it.name == 'MEDALS_2').total_items += 1
                }
                if (index == 3) {
                    medal = index.toString().replace(3, `🥉`)
                    player.medal_3 += 1
                    player.progress.items.find(it => it.name == 'MEDALS_3').total_items += 1
                }
                index++
                player.save()
                return `**\`${medal} ${player.nickname}\`** - ${player.weekly_exp} опыта гильдии!`
            })
            list = await Promise.all(list)

            const top_3 = new EmbedBuilder()
                .setTitle(`Топ-3 лучших игрока по GEXP`)
                .setDescription(`${list.join('\n')}`)
                .setColor(Number(linksInfo.bot_color))
                .setTimestamp(Date.now())

            await msg.edit({
                content: ``,
                embeds: [top_3]
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


module.exports = {
    MCUpdates
}