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
    client.halloweenRewards = async () => {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", plugin.id)) return;
            const guildData = await Guild.findOne({ id: guild.id })
            if (guildData.seasonal.halloween.enabled === false) return
            const results = await User.find({ guildid: guild.id })

            for (const result of results) {
                const { seasonal } = result
                const member = await guild.members.fetch(result.userid)

                if (seasonal.halloween.achievements.num1 == true && seasonal.halloween.achievements.num2 == true && seasonal.halloween.achievements.num3 == true && seasonal.halloween.achievements.num4 == true && seasonal.halloween.achievements.num5 == true && seasonal.halloween.achievements.num6 == true && !member.roles.cache.has(`1030757644320915556`)) {
                    const done = new EmbedBuilder()
                        .setTitle(`Выдана сезонная роль`)
                        .setColor(Number(linksInfo.bot_color))
                        .setThumbnail(member.user.displayAvatarURL())
                        .setTimestamp(Date.now())
                        .setDescription(`${member} получил \`${guild.roles.cache.get(`1030757644320915556`).name}\`! Теперь он может использовать сезонный цвет!`)
                    await member.roles.add(`1030757644320915556`)
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