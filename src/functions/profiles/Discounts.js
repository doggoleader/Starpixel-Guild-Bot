const { Temp } = require(`../../schemas/temp_items`)
const chalk = require(`chalk`)
const { Guild } = require(`../../schemas/guilddata`)
const { User } = require(`../../schemas/userdata`)
const linksInfo = require(`../../discord structure/links.json`)
const { changeProperty } = require(`../../functions`)
const { checkPlugin } = require("../../functions");
const plugin = {
    id: "items",
    name: "Предметы"
}

module.exports = (client) => {
    client.Discounts = async () => {
        try {
            if (!await checkPlugin("320193302844669959", plugin.id)) return;
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
}
