const { User } = require(`../../schemas/userdata`)
const rewards = require(`./act_rewards.json`)
const { Temp } = require(`../../schemas/temp_items`)
const chalk = require(`chalk`)
const linksInfo = require(`../../discord structure/links.json`)
const ch_list = require(`../../discord structure/channels.json`)
const { EmbedBuilder } = require("discord.js")
const { Guild } = require(`../../schemas/guilddata`)
const wait = require(`node:timers/promises`).setTimeout
const { checkPlugin } = require("../../functions");
const plugin = {
    id: "items",
    name: "Предметы"
}

module.exports = (client) => {
    client.act_rewards = async () => {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", plugin.id)) return;
            const results = await User.find({ level: { $gt: 0 } })
            for (const result of results) {
                const { userid, level, act_rewards } = result;
                for (const reward of rewards) {
                    const member = await guild.members.fetch(userid)
                    let rew = await result.act_rewards.find(rewa => rewa == reward.level)

                    if (!rew && reward.level <= level) {

                        try {
                            if (reward.type == "box") {
                                const role = await guild.roles.fetch(reward.role)
                                if (!member.roles.cache.has(role.id)) {
                                    result.act_rewards.push(reward.level);
                                    await member.roles.add(role.id)
                                    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magenta(`[НАГРАДЫ ЗА УРОВЕНЬ]`) + chalk.gray(`: ${member.user.username} получил награду за ${reward.level} уровень!`))

                                    const channel = await guild.channels.fetch(ch_list.main)
                                    const embed = new EmbedBuilder()
                                        .setTitle(`Награда за уровень была получена!`)
                                        .setDescription(`Награда за ${reward.level} уровень активности у пользователя ${member} была сохранена! Проверьте свои роли, чтобы посмотреть награду!`)
                                        .setTimestamp(Date.now())
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(member.user.displayAvatarURL())

                                    await channel.send({
                                        embeds: [embed]
                                    })
                                } else if (member.roles.cache.has(role.id)) {
                                    result.act_rewards.push(reward.level);
                                    result.stacked_items.push(role.id)
                                    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magenta(`[НАГРАДЫ ЗА УРОВЕНЬ]`) + chalk.gray(`: ${member.user.username} получил награду за ${reward.level} уровень!`))

                                    const channel = await guild.channels.fetch(ch_list.main)
                                    const embed = new EmbedBuilder()
                                        .setTitle(`Награда за уровень была сохранена!`)
                                        .setDescription(`Награда за ${reward.level} уровень активности у пользователя ${member} была сохранена! Используйте </rewards claim:1055546254240784492>, чтобы получить свою награду!`)
                                        .setTimestamp(Date.now())
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(member.user.displayAvatarURL())

                                    await channel.send({
                                        embeds: [embed]
                                    })
                                }

                            } else if (reward.type == "premium") {
                                const role = await guild.roles.fetch(reward.role)
                                if (reward.expire == `7d` && !member.roles.cache.has(role.id)) {
                                    result.act_rewards.push(reward.level);
                                    const newItem = new Temp({
                                        userid: member.user.id,
                                        guildid: guild.id,
                                        roleid: role.id,
                                        expire: Date.now() + (1000 * 60 * 60 * 24 * 7 * (result.perks.temp_items + 1))
                                    })
                                    newItem.save()
                                    await member.roles.add(role.id)
                                    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magenta(`[НАГРАДЫ ЗА УРОВЕНЬ]`) + chalk.gray(`: ${member.user.username} получил награду за ${reward.level} уровень!`))
                                    const channel = await guild.channels.fetch(ch_list.main)
                                    const embed = new EmbedBuilder()
                                        .setTitle(`Награда за уровень была получена!`)
                                        .setDescription(`Награда за ${reward.level} уровень активности у пользователя ${member} была сохранена! Проверьте свои роли, чтобы посмотреть награду!`)
                                        .setTimestamp(Date.now())
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(member.user.displayAvatarURL())

                                    await channel.send({
                                        embeds: [embed]
                                    })
                                } else if (reward.expire == `30d` && !member.roles.cache.has(role.id)) {
                                    result.act_rewards.push(reward.level);
                                    const newItem = new Temp({
                                        userid: member.user.id,
                                        guildid: guild.id,
                                        roleid: role.id,
                                        expire: Date.now() + (1000 * 60 * 60 * 24 * 30 * (result.perks.temp_items + 1))
                                    })
                                    newItem.save()
                                    await member.roles.add(role.id)
                                    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magenta(`[НАГРАДЫ ЗА УРОВЕНЬ]`) + chalk.gray(`: ${member.user.username} получил награду за ${reward.level} уровень!`))
                                    const channel = await guild.channels.fetch(ch_list.main)
                                    const embed = new EmbedBuilder()
                                        .setTitle(`Награда за уровень была получена!`)
                                        .setDescription(`Награда за ${reward.level} уровень активности у пользователя ${member} была сохранена! Проверьте свои роли, чтобы посмотреть награду!`)
                                        .setTimestamp(Date.now())
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(member.user.displayAvatarURL())

                                    await channel.send({
                                        embeds: [embed]
                                    })
                                } else if (reward.expire == `7d` && member.roles.cache.has(role.id)) {
                                    result.act_rewards.push(reward.level);
                                    const item = await Temp.findOne({ userid: member.user.id, roleid: role.id })
                                    if (!item) {
                                        console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magenta(`[НАГРАДЫ ЗА УРОВЕНЬ]`) + chalk.gray(`: ${member.user.username} получил награду за ${reward.level} уровень!`))

                                    } else {

                                        item.expire += item.expire.getTime() + 1000 * 60 * 60 * 24 * 7
                                        item.save()
                                    }
                                } else if (reward.expire == `30d` && member.roles.cache.has(role.id)) {
                                    result.act_rewards.push(reward.level);
                                    const item = await Temp.findOne({ userid: member.user.id, roleid: role.id })
                                    if (!item) {
                                        console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magenta(`[НАГРАДЫ ЗА УРОВЕНЬ]`) + chalk.gray(`: ${member.user.username} получил награду за ${reward.level} уровень!`))

                                    } else {

                                        item.expire = item.expire.getTime() + 1000 * 60 * 60 * 24 * 30
                                        item.save()
                                    }
                                }
                            } else if (reward.type == "rank_exp") {
                                result.act_rewards.push(reward.level);
                                result.rank += reward.amount
                                console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magenta(`[НАГРАДЫ ЗА УРОВЕНЬ]`) + chalk.gray(`: ${member.user.username} получил награду за ${reward.level} уровень!`))

                            } else if (reward.type == "leg_reward") {
                                const role = await guild.roles.fetch(reward.role)
                                if (!member.roles.cache.has(role.id)) {
                                    result.act_rewards.push(reward.level);
                                    await member.roles.add(role.id)
                                    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magenta(`[НАГРАДЫ ЗА УРОВЕНЬ]`) + chalk.gray(`: ${member.user.username} получил награду за ${reward.level} уровень!`))

                                }
                            }
                        } catch (error) {
                            console.log(chalk.blackBright(`[${new Date()}]`) + `Роль за уровень ${reward.level} не существует!` + error)
                        }
                    }

                }
                await result.save()
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