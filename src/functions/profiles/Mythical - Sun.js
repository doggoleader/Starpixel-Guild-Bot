const { User } = require(`../../schemas/userdata`)
const chalk = require(`chalk`);
const { EmbedBuilder } = require(`discord.js`)
const { Guild } = require(`../../schemas/guilddata`)
const ch_list = require(`../../discord structure/channels.json`)
const linksInfo = require(`../../discord structure/links.json`)
const { checkPlugin } = require("../../functions");
const plugin = {
    id: "items",
    name: "Предметы"
}

module.exports = (client) => {
    client.AutoMythical = async () => {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", plugin.id)) return;
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
                            .setColor(Number(linksInfo.bot_color))
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
}