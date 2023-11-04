const { Temp } = require(`../../schemas/temp_items`)
const chalk = require(`chalk`)
const { Guild } = require(`../../schemas/guilddata`)
const { User } = require(`../../schemas/userdata`)
const linksInfo = require(`../../discord structure/links.json`)
const { changeProperty } = require(`../../functions`)
const { checkPlugin } = require("../../functions");
const plugin = {
    id: "seasonal",
    name: "Сезонное"
}

module.exports = (client) => {
    client.NewYearNamesEnable = async () => {
        try {
            if (!await checkPlugin("320193302844669959", plugin.id)) return;
            const userDatas = await User.find()

            for (const userData of userDatas) {
                const { displayname, rank_number } = userData
                if (displayname.custom_rank == false) {
                    if (rank_number == 0) {
                        displayname.rank = `🎏`
                    } else if (rank_number == 1) {
                        displayname.rank = `🎈`
                    } else if (rank_number == 2) {
                        displayname.rank = `🎁`
                    } else if (rank_number == 3) {
                        displayname.rank = `🎀`
                    } else if (rank_number == 4) {
                        displayname.rank = `🍊`
                    } else if (rank_number == 5) {
                        displayname.rank = `⛄`
                    } else if (rank_number == 6) {
                        displayname.rank = `🎄`
                    } else if (rank_number == 7) {
                        displayname.rank = `🍷`
                    } else if (rank_number == 8) {
                        displayname.rank = `🧁`
                    } else if (rank_number == 9) {
                        displayname.rank = `🍧`
                    } else if (rank_number == 10) {
                        displayname.rank = `🍾`
                    }
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