const { User } = require(`../../schemas/userdata`)
const chalk = require(`chalk`)
const cron = require(`node-cron`)
const fetch = require(`node-fetch`)
const wait = require('node:timers/promises').setTimeout;
const linksInfo = require(`../../discord structure/links.json`)
const ch_list = require(`../../discord structure/channels.json`);
const { EmbedBuilder } = require('discord.js');
const api = process.env.hypixel_apikey
const { Guild } = require(`../../schemas/guilddata`)
const { checkPlugin } = require("../../functions");
const plugin = {
    id: "hypixel",
    name: "Hypixel"
}

module.exports = (client) => {
    client.InGuildRewards = async () => {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", plugin.id)) return;
            let userDatas = await User.find({ guildid: guild.id, onlinemode: true })
            const response = await fetch(`https://api.hypixel.net/guild?id=5c1902fc77ce84cd430f3959`, {
                headers: {
                    "API-Key": api,
                    "Content-Type": "application/json"
                }
            })
            let json
            if (response.ok) json = await response.json()
            for (let userData of userDatas) {
                if (userData.black_hole.enabled !== true) {
                    const member = await guild.members.fetch(userData.userid)
                    const ch = await guild.channels.fetch(ch_list.main)

                    let player = await json.guild.members.find(member => member.uuid == userData.uuid)
                    if (!player) console.log(chalk.hex(`#FFA500`)(`[HypixelAPI]`) + chalk.red(`: Произошла ошибка при получении данных пользователя ${userData.uuid} (${userData.nickname})!`))
                    else {
                        let rewards = require(`./JSON/InGuildRewards.json`)
                        for (let reward of rewards) {
                            if (!userData.in_guild_rewards.includes(reward.id)) {
                                if (Math.round(Date.now() / 1000) >= Math.round((userData.joinedGuild / 1000) + reward.timestamp)) {
                                    const role = await guild.roles.fetch(reward.rewards)
                                    if (member.roles.cache.has(reward.rewards)) {

                                        await userData.stacked_items.push(reward.rewards)
                                        const embed = new EmbedBuilder()
                                            .setColor(Number(linksInfo.bot_color))
                                            .setTimestamp(Date.now())
                                            .setTitle(`Выдана награда за время в гильдии`)
                                            .setThumbnail(member.user.displayAvatarURL())
                                            .setDescription(`${member} получил награду за время в гильдии:
Период: \`${reward.name}\`
Награда: ${role}

Ваша награда была сохранена! Используйте \`/rewards claim\`, чтобы получить её!`)
                                        await ch.send({
                                            embeds: [embed]
                                        })
                                    } else {
                                        await member.roles.add(reward.rewards)
                                        const embed = new EmbedBuilder()
                                            .setColor(Number(linksInfo.bot_color))
                                            .setTimestamp(Date.now())
                                            .setTitle(`Выдана награда за время в гильдии`)
                                            .setThumbnail(member.user.displayAvatarURL())
                                            .setDescription(`${member} получил награду за время в гильдии:
Период: \`${reward.name}\`
Награда: ${role}

Ваша награда была сохранена в профиле!`)
                                        await ch.send({
                                            embeds: [embed]
                                        })
                                    }
                                    userData.in_guild_rewards.push(reward.id)
                                }
                            }
                        }
                        userData.save()
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