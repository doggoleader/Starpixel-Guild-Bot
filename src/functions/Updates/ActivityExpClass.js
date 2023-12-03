
const { User } = require(`../../schemas/userdata`)
const rewards = require(`../../jsons/act_rewards.json`)
const { Temp } = require(`../../schemas/temp_items`)
const chalk = require(`chalk`)
const ch_list = require(`../../discord structure/channels.json`)
const { calcActLevel, getLevel, mentionCommand } = require(`../../functions`)
const { Guild } = require(`../../schemas/guilddata`)
const { checkPlugin } = require("../../functions");
const { EmbedBuilder } = require("discord.js")

class ActExp {
    /** @private */
    static id = 'items';
    /** @private */
    static name = "Предметы";
    /**
     * 
     * @param {String} userid Discord User ID
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async ActExp(userid, client) {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", this.id)) return;
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
            await admin.send({
                content: `-> \`\`\`${e.stack}\`\`\``
            }).catch()
        }

    }

    /**
     * 
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async act_rewards(client) {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", this.id)) return;
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
                                        .setColor(Number(client.information.bot_color))
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
                                        .setDescription(`Награда за ${reward.level} уровень активности у пользователя ${member} была сохранена! Используйте ${mentionCommand(client, 'inventory')}, чтобы получить свою награду!`)
                                        .setTimestamp(Date.now())
                                        .setColor(Number(client.information.bot_color))
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
                                        .setColor(Number(client.information.bot_color))
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
                                        .setColor(Number(client.information.bot_color))
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
            await admin.send({
                content: `-> \`\`\`${e.stack}\`\`\``
            }).catch()
        }

    }
}

module.exports = {
    ActExp
}