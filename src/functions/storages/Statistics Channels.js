const { User } = require(`../../schemas/userdata`)
const { Guild } = require(`../../schemas/guilddata`)
const fetch = require(`node-fetch`);
const api = process.env.hypixel_apikey;
const chalk = require(`chalk`);
const ch_list = require(`../../discord structure/channels.json`)
const linksInfo = require(`../../discord structure/links.json`)
const { GuildAuditLogs } = require("discord.js");
const { checkPlugin } = require("../../functions");
const plugin = {
    id: "channels",
    name: "Каналы"
}

module.exports = (client) => {
    client.statsChannel = async () => {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", plugin.id)) return;
            const dis_members = await guild.memberCount
            const role = await guild.roles.fetch(`504887113649750016`)
            const guilddata = await Guild.findOne({ id: guild.id })
            const guild_members = await role.members.size
            let level = 0
            let xpneeded = 0
            let responseA = await fetch(`https://api.hypixel.net/guild?id=5c1902fc77ce84cd430f3959`, {
                headers: {
                    "API-Key": api,
                    "Content-Type": "application/json"
                }
            })
            if (responseA.ok) {
                let json = await responseA.json()
                let hpguild = json.guild

                //Assign a level value based on guild.exp value
                if (hpguild.exp < 100000) level = 0
                else if (hpguild.exp < 250000) level = 1
                else if (hpguild.exp < 500000) level = 2
                else if (hpguild.exp < 1000000) level = 3
                else if (hpguild.exp < 1750000) level = 4
                else if (hpguild.exp < 2750000) level = 5
                else if (hpguild.exp < 4000000) level = 6
                else if (hpguild.exp < 5500000) level = 7
                else if (hpguild.exp < 7500000) level = 8
                else if (hpguild.exp >= 7500000 && hpguild.exp < 20000000) level = Math.floor((hpguild.exp - 7500000) / 2500000) + 9
                else if (hpguild.exp >= 20000000) level = Math.floor((hpguild.exp - 20000000) / 3000000) + 14

                if (hpguild.exp < 100000) xpneeded = 100000 - hpguild.exp
                else if (hpguild.exp < 250000) xpneeded = 250000 - hpguild.exp
                else if (hpguild.exp < 500000) xpneeded = 500000 - hpguild.exp
                else if (hpguild.exp < 1000000) xpneeded = 1000000 - hpguild.exp
                else if (hpguild.exp < 1750000) xpneeded = 1750000 - hpguild.exp
                else if (hpguild.exp < 2750000) xpneeded = 2750000 - hpguild.exp
                else if (hpguild.exp < 4000000) xpneeded = 4000000 - hpguild.exp
                else if (hpguild.exp < 5500000) xpneeded = 5500000 - hpguild.exp
                else if (hpguild.exp < 7500000) xpneeded = 7500000 - hpguild.exp
                else if (hpguild.exp >= 7500001 && hpguild.exp < 20000000) xpneeded = 20000000 - hpguild.exp
                else if (hpguild.exp >= 20000000) xpneeded = ((Math.floor((hpguild.exp - 20000000) / 3000000) + 1) * 3000000) - (hpguild.exp - 20000000)
            }
            const percent = 100 - (Math.round((xpneeded / 3000000) * 100))
            const before = guilddata.hypixel_lvl
            guilddata.hypixel_lvl = level
            guilddata.save()
            if (before < guilddata.hypixel_lvl) {
                const chat = await guild.channels.fetch(ch_list.main)
                await chat.send({
                    content: `**НОВЫЙ УРОВЕНЬ ГИЛЬДИИ** @here

Уровень гильдии на Hypixel повышен!
\`${before}\` ➡ \`${guilddata.hypixel_lvl}\``,
                    allowedMentions: {
                        parse: ["everyone"]
                    }
                })
            }

            const channel_level = await guild.channels.fetch(`1017729617739665408`)
            await channel_level.edit({
                name: `┊📊・Уровень: ${level}`
            })
            const channel_percent = await guild.channels.fetch(`1017757816125136896`)
            await channel_percent.edit({
                name: `┊📊・Прогресс: ${percent}%`
            })
            const channel_disc = await guild.channels.fetch(`1017760339464556605`)
            await channel_disc.edit({
                name: `┊📊・На сервере: ${dis_members}`
            })
            const channel_memb = await guild.channels.fetch(`1017729601813884928`)
            await channel_memb.edit({
                name: `╰📊・В гильдии: ${guild_members}`
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