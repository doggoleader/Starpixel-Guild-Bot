const { User } = require(`../../schemas/userdata`)
const chalk = require(`chalk`);
const { EmbedBuilder } = require(`discord.js`)
const ch_list = require(`../../discord structure/channels.json`)
const linksInfo = require(`../../discord structure/links.json`)
const { Guild } = require(`../../schemas/guilddata`)
const { checkPlugin } = require("../../functions");
const plugin = {
    id: "items",
    name: "Предметы"
}

module.exports = (client) => {
    client.AutoElements = async () => {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", plugin.id)) return;
            const results = await User.find({ guildid: guild.id })

            for (const result of results) {
                if (result.black_hole.enabled !== true) {
                    const { elements } = result
                    const member = await guild.members.fetch(result.userid)

                    if (elements.diving == 1 && elements.resistance == 1 && elements.respiration == 1 && !member.roles.cache.has(`930169139866259496`)) {
                        const done = new EmbedBuilder()
                            .setTitle(`Выдана стихия`)
                            .setColor(Number(linksInfo.bot_color))
                            .setThumbnail(member.user.displayAvatarURL())
                            .setTimestamp(Date.now())
                            .setDescription(`${member} получил \`${guild.roles.cache.get(`930169139866259496`).name}\`!`)
                        await member.roles.add(`930169139866259496`)
                        await guild.channels.cache.get(ch_list.main).send({
                            embeds: [done]
                        })
                    }

                    if (elements.eagle_eye == 1 && elements.wind == 1 && elements.flying == 1 && !member.roles.cache.has(`930169145314652170`)) {
                        const done = new EmbedBuilder()
                            .setTitle(`Выдана стихия`)
                            .setColor(Number(linksInfo.bot_color))
                            .setThumbnail(member.user.displayAvatarURL())
                            .setTimestamp(Date.now())
                            .setDescription(`${member} получил \`${guild.roles.cache.get(`930169145314652170`).name}\`!`)
                        await member.roles.add(`930169145314652170`)
                        await guild.channels.cache.get(ch_list.main).send({
                            embeds: [done]
                        })
                    }

                    if (elements.fast_grow == 1 && elements.mountains == 1 && elements.underground == 1 && !member.roles.cache.has(`930169143347523604`)) {
                        const done = new EmbedBuilder()
                            .setTitle(`Выдана стихия`)
                            .setColor(Number(linksInfo.bot_color))
                            .setThumbnail(member.user.displayAvatarURL())
                            .setTimestamp(Date.now())
                            .setDescription(`${member} получил \`${guild.roles.cache.get(`930169143347523604`).name}\`!`)
                        await member.roles.add(`930169143347523604`)
                        await guild.channels.cache.get(ch_list.main).send({
                            embeds: [done]
                        })
                    }

                    if (elements.fire_resistance == 1 && elements.flame == 1 && elements.lightning == 1 && !member.roles.cache.has(`930169133671280641`)) {
                        const done = new EmbedBuilder()
                            .setTitle(`Выдана стихия`)
                            .setColor(Number(linksInfo.bot_color))
                            .setThumbnail(member.user.displayAvatarURL())
                            .setTimestamp(Date.now())
                            .setDescription(`${member} получил \`${guild.roles.cache.get(`930169133671280641`).name}\`!`)
                        await member.roles.add(`930169133671280641`)
                        await guild.channels.cache.get(ch_list.main).send({
                            embeds: [done]
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