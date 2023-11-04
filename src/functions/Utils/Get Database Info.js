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
    client.getInfo = async (userid, guildid, extraInfo) => {
        try {
            if (!await checkPlugin("320193302844669959", plugin.id)) return;
            const userData = await User.findOne({ userid: userid, guildid: guildid })
            let result

            if (extraInfo == `shop_costs`) {
                let sub_info
                if (userData.sub_type == 0) sub_info = 0
                else if (userData.sub_type == 1) sub_info = 0
                else if (userData.sub_type == 2) sub_info = 0.05
                else if (userData.sub_type == 3) sub_info = 0.1
                else if (userData.sub_type == 4) sub_info = 0.2

                let perks_info = userData.perks.shop_discount * 0.05

                if (1 - sub_info < 1 - perks_info) result = 1 - sub_info
                else if (1 - sub_info > 1 - perks_info) result = 1 - perks_info

            } else if (extraInfo == `king_costs`) {
                let perks_info = userData.perks.king_discount * 0.05

                result = 1 - perks_info
            } else if (extraInfo == `act_costs`) {
                let perks_info = userData.perks.act_discount * 0.1

                result = 1 - perks_info
            } else if (extraInfo == `pers_act_boost`) {

                let sub_info
                if (userData.sub_type == 0) sub_info = 1
                else if (userData.sub_type == 1) sub_info = 1.5
                else if (userData.sub_type == 2) sub_info = 2
                else if (userData.sub_type == 3) sub_info = 3
                else if (userData.sub_type == 4) sub_info = 5

                result = sub_info

            } else if (extraInfo == `pers_rank_boost`) {

                let sub_info
                if (userData.sub_type == 0) sub_info = 1
                else if (userData.sub_type == 1) sub_info = 1
                else if (userData.sub_type == 2) sub_info = 1.5
                else if (userData.sub_type == 3) sub_info = 2
                else if (userData.sub_type == 4) sub_info = 3

                let perks_info = userData.perks.rank_boost * 0.05

                result = sub_info + perks_info
            } else if (extraInfo == `pers_rumb_boost`) {
                result = 1
            } else if (extraInfo.startsWith("box_chances")) {
                result = 1
            } else {
                console.log(`Не удалось найти опцию ${extraInfo}!`)
                return `Не удалось найти опцию ${extraInfo}! Подождите, пока администратор это починит!`
            }
            return result
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