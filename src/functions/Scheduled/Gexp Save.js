const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } = require('discord.js');
const fetch = require(`node-fetch`);
const wait = require(`node:timers/promises`).setTimeout
const api = process.env.hypixel_apikey;
const { User } = require(`../../schemas/userdata`)
const { Guild } = require(`../../schemas/guilddata`)
const chalk = require(`chalk`);
const prettyMilliseconds = require(`pretty-ms`); //ДОБАВИТЬ В ДРУГИЕ
const ch_list = require(`../../discord structure/channels.json`)
const cron = require(`node-cron`)
const linksInfo = require(`../../discord structure/links.json`)
const { checkPlugin } = require("../../functions");
const plugin = {
    id: "hypixel",
    name: "Hypixel"
}

module.exports = (client) => {
    client.GEXP_PROFILES = async () => {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", plugin.id)) return;



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
}