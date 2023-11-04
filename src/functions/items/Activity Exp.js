const { User } = require(`../../schemas/userdata`)
const chalk = require(`chalk`)
const ch_list = require(`../../discord structure/channels.json`)
const { calcActLevel, getLevel } = require(`../../functions`)
const linksInfo = require(`../../discord structure/links.json`)
const { Guild } = require(`../../schemas/guilddata`)
const { checkPlugin } = require("../../functions");
const plugin = {
    id: "items",
    name: "Предметы"
}

module.exports = (client) => {
    client.ActExp = async (userid) => {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", plugin.id)) return;
            const result = await User.findOne({ guildid: guild.id, userid: userid })
            if (result.black_hole.enabled == true) return
            const member = await guild.members.fetch(result.userid)
            let lvl_before = result.level
            let total_exp = calcActLevel(0, result.level, result.exp) //Текущий опыт
            let level_exp = getLevel(total_exp)
            let level = level_exp[0]
            let exp = level_exp[1]
            result.exp = exp
            result.level = level

            if (lvl_before < level) {
                await guild.channels.cache.get(ch_list.main).send(
                    `:black_medium_small_square:
${member} повысил уровень активности до ${result.level} уровня! :tada:
:black_medium_small_square:`);
            } else if (lvl_before > level) {
                await guild.channels.cache.get(ch_list.main).send(
                    `:black_medium_small_square:
К сожалению, ${member} понизил свой уровень активности до ${result.level} уровня! 😔
:black_medium_small_square:`);
            }
            result.save();


            client.act_rewards();
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
