const { User } = require(`../../schemas/userdata`)
const chalk = require(`chalk`)
const linksInfo = require(`../../discord structure/links.json`)
const { Temp } = require(`../../schemas/temp_items`)
const { Guild } = require(`../../schemas/guilddata`)
const { checkPlugin } = require("../../functions");
const plugin = {
    id: "items",
    name: "Предметы"
}

module.exports = (client) => {
    client.Boosters = async () => {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", plugin.id)) return;
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
}
