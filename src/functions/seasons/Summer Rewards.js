const { User } = require(`../../schemas/userdata`)
const chalk = require(`chalk`);
const { EmbedBuilder } = require(`discord.js`)
const ch_list = require(`../../discord structure/channels.json`)
const linksInfo = require(`../../discord structure/links.json`)
const { Guild } = require(`../../schemas/guilddata`)
const { checkPlugin } = require("../../functions");
const plugin = {
    id: "seasonal",
    name: "Сезонное"
}

module.exports = (client) => {
    client.SummerRewards = async () => {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", plugin.id)) return;
            const guildData = await Guild.findOne({ id: guild.id })
            if (guildData.seasonal.summer.enabled === false) return
            const results = await User.find({ guildid: guild.id })

            for (const result of results) {
                const { seasonal } = result
                const member = await guild.members.fetch(result.userid)

                if (
                    seasonal.summer.achievements.num1 == true &&
                    seasonal.summer.achievements.num2 == true &&
                    seasonal.summer.achievements.num3 == true &&
                    seasonal.summer.achievements.num4 == true &&
                    seasonal.summer.achievements.num5 == true &&
                    seasonal.summer.achievements.num6 == true &&
                    seasonal.summer.achievements.num7 == true &&
                    seasonal.summer.achievements.num8 == true &&
                    seasonal.summer.achievements.num9 == true &&
                    seasonal.summer.achievements.num10 == true &&
                    !member.roles.cache.has(`1030757074839277608`)) {
                    const done = new EmbedBuilder()
                        .setTitle(`Выдана сезонная роль`)
                        .setColor(Number(linksInfo.bot_color))
                        .setThumbnail(member.user.displayAvatarURL())
                        .setTimestamp(Date.now())
                        .setDescription(`${member} получил \`${guild.roles.cache.get(`1030757074839277608`).name}\`! Теперь он может использовать сезонный цвет!
                        
В качестве бонуса он также получает <@&781069821953441832>!`)
                    await member.roles.add(`1030757074839277608`)
                    if (member.roles.cache.has("781069821953441832")) {
                        await result.stacked_items.push("781069821953441832")
                        await result.save()
                    } else {
                        await member.roles.add("781069821953441832")
                    }
                    await guild.channels.cache.get(ch_list.main).send({
                        embeds: [done]
                    })
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