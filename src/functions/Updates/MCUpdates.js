
const { User } = require(`../../schemas/userdata`)
const chalk = require(`chalk`);
const fetch = require(`node-fetch`);
const ch_list = require(`../../discord structure/channels.json`)
const marathon = require(`../../jsons/Marathon.json`)
const upd_nick_api = process.env.hypixel_apikey, api = process.env.hypixel_apikey
const upgrades = require(`../../jsons/Upgrades Info.json`)
const { Guild } = require(`../../schemas/guilddata`)
const { checkPlugin, mentionCommand } = require("../../functions");
const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType } = require('discord.js');


class MCUpdates {
    /** @private */
    static id = 'hypixel';
    /** @private */
    static name = 'Hypixel';
    /**
     * 
     * @param {import("../../misc_functions/Classes/System/import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient").import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async UpdateNicknames(client) {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", this.id)) return;
            const results = await User.find({ guildid: guild.id, onlinemode: true })

            for (const result of results) {

                let response = await fetch(`https://api.hypixel.net/player?uuid=${result.uuid}`, {
                    headers: {
                        "API-Key": upd_nick_api,
                        "Content-Type": "application/json"
                    }
                })
                if (response.ok) {
                    try {
                        const oldnick = result.nickname
                        let json = await response.json()
                        if (oldnick !== json.player.displayname) {
                            result.oldnickname = oldnick
                        }
                        result.nickname = json.player.displayname;
                        result.save()
                    } catch (error) {
                        console.log(chalk.blackBright(`[${new Date()}]`) + chalk.hex(`#FFA500`)(`[HypixelAPI]`) + chalk.red(`: UUID не найден ИЛИ игрок не найден ИЛИ произошла другая ошибка!` + error))
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

    /**
     * 
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async GEXP_PROFILES(client) {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", this.id)) return;



            let userDatas = await User.find({ guildid: guild.id, onlinemode: true })

            for (let userData of userDatas) {
                const member = await guild.members.fetch(userData.userid)
                let responseA = await fetch(`https://api.hypixel.net/guild?player=${userData.uuid}`, {
                    headers: {
                        "API-Key": api,
                        "Content-Type": "application/json"
                    }
                })
                if (responseA.ok) {

                    let json = await responseA.json()
                    if (json.guild !== null) {


                        if (json.guild._id == `5c1902fc77ce84cd430f3959`) {
                            try {
                                let player = await json.guild.members.find(member => member.uuid == userData.uuid)
                                let gexpObj = player.expHistory
                                let gexpArray = Object.entries(gexpObj)
                                let info_date = gexpArray[1][0]
                                let info_value = gexpArray[1][1]
                                let tr = await userData.gexp_info.find(i => i.date == info_date)
                                if (!tr) {
                                    if (userData.rank_number >= 5) {
                                        userData.gexp += info_value
                                        while (userData.gexp >= 50000 - (50000 * 0.10 * userData.perks.ticket_discount)) {
                                            userData.gexp -= 50000 - (50000 * 0.10 * userData.perks.ticket_discount)
                                            userData.tickets += 1
                                            userData.progress.items.find(it => it.name == 'TICKETS_TOTAL').total_items += 1
                                            console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magenta(`[Получены билеты]`) + chalk.gray(`: ${member.user.username} получил 1 билет. Теперь у него ${userData.tickets} билетов`))
                                        }
                                    }
                                    userData.gexp_info.push({
                                        date: info_date,
                                        gexp: info_value
                                    })
                                    userData.black_hole.info.GEXP_lastMonth += info_value
                                } else {
                                    tr.gexp = info_value
                                }
                                userData.save()


                            } catch (error) {
                                console.log(chalk.blackBright(`[${new Date()}]`) + chalk.hex(`#FFA500`)(`[HypixelAPI]`) + chalk.red(`: Произошла ошибка при обновлении данных о GEXP пользователя ${userData.uuid} (${userData.nickname})!`));
                                console.log(error)
                            }
                        } else {
                            console.log(chalk.blackBright(`[${new Date()}]`) + chalk.hex(`#FFA500`)(`[HypixelAPI]`) + chalk.red(`: Игрок ${userData.uuid} (${userData.nickname}) не состоит в гильдии Starpixel!`));
                        }
                    } else {
                        console.log(chalk.blackBright(`[${new Date()}]`) + chalk.hex(`#FFA500`)(`[HypixelAPI]`) + chalk.red(`: Игрок ${userData.uuid} (${userData.nickname}) не состоит ни в какой гильдии на Hypixel!`));
                    }
                } else {
                    console.log(chalk.blackBright(`[${new Date()}]`) + `Гильдия не найдена или игрок не найден.`)
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

    /**
     * 
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async InGuildRewards(client) {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", this.id)) return;
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
                        let rewards = require(`../../jsons/InGuildRewards.json`)
                        for (let reward of rewards) {
                            if (!userData.in_guild_rewards.includes(reward.id)) {
                                if (Math.round(Date.now() / 1000) >= Math.round((userData.joinedGuild / 1000) + reward.timestamp)) {
                                    const role = await guild.roles.fetch(reward.rewards)
                                    if (member.roles.cache.has(reward.rewards)) {

                                        await userData.stacked_items.push(reward.rewards)
                                        const embed = new EmbedBuilder()
                                            .setColor(Number(client.information.bot_color))
                                            .setTimestamp(Date.now())
                                            .setTitle(`Выдана награда за время в гильдии`)
                                            .setThumbnail(member.user.displayAvatarURL())
                                            .setDescription(`${member} получил награду за время в гильдии:
Период: \`${reward.name}\`
Награда: ${role}

Ваша награда была сохранена! Используйте ${mentionCommand(client, 'rewards claim')}, чтобы получить её!`)
                                        await ch.send({
                                            embeds: [embed]
                                        })
                                    } else {
                                        await member.roles.add(reward.rewards)
                                        const embed = new EmbedBuilder()
                                            .setColor(Number(client.information.bot_color))
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

    /**
     * 
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async resetMarathon(client) {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", this.id)) return;
            let userDatas = await User.find({ guildid: guild.id })
            for (const userData of userDatas) {
                userData.quests.marathon.completed = []
                userData.quests.marathon.activated.id = -1
                userData.quests.marathon.activated.required = Infinity
                userData.quests.marathon.activated.stage = -1
                userData.quests.marathon.activated.status = true
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

    /**
     * 
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async resetVeterans(client) {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", this.id)) return;
            let userDatas = await User.find({ guildid: guild.id })
            for (const userData of userDatas) {
                userData.upgrades.veterans_quests = upgrades.veterans_quests.find(q => q.tier == userData.upgrades.veterans_quests_tier).upgrade
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

    /**
     * 
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async top_3_gexp(client) {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin(guild.id, this.id)) return;

            let userDatas = await User.find({ guildid: guild.id, onlinemode: true })
            let b = 0
            let msg = await guild.channels.cache.get(ch_list.main).send({
                content: `Идет генерация топ-3 игроков по GEXP за неделю!`
            })
            for (let userData of userDatas) {
                userData.weekly_exp = 0
                let responseA = await fetch(`https://api.hypixel.net/guild?player=${userData.uuid}`, {
                    headers: {
                        "API-Key": api,
                        "Content-Type": "application/json"
                    }
                })
                if (responseA.ok) {

                    let json = await responseA.json()
                    if (json.guild !== null) {


                        if (json.guild._id == `5c1902fc77ce84cd430f3959`) {
                            try {
                                var i = 0
                                while (json.guild.members[i].uuid !== userData.uuid) {
                                    i++
                                }
                                let gexpObj = json.guild.members[i].expHistory
                                let gexpArray = Object.values(gexpObj)
                                let weeklyGexp = gexpArray.reduce((a, b) => a + b, 0)
                                userData.weekly_exp = weeklyGexp

                                console.log(chalk.blackBright(`[${new Date()}]`) + chalk.hex(`#FFA500`)(`[HypixelAPI]`) + chalk.gray(`: Участник ${json.guild.members[i].uuid} (${userData.nickname}) заработал за неделю ${weeklyGexp} GEXP`))


                            } catch (error) {
                                console.log(chalk.blackBright(`[${new Date()}]`) + chalk.hex(`#FFA500`)(`[HypixelAPI]`) + chalk.red(`: Произошла ошибка при обновлении данных о GEXP пользователя ${userData.uuid} (${userData.nickname})!`));
                            }
                        } else {
                            console.log(chalk.blackBright(`[${new Date()}]`) + chalk.hex(`#FFA500`)(`[HypixelAPI]`) + chalk.red(`: Игрок ${userData.uuid} (${userData.nickname}) не состоит в гильдии Starpixel!`));
                        }
                    } else {
                        console.log(chalk.blackBright(`[${new Date()}]`) + chalk.hex(`#FFA500`)(`[HypixelAPI]`) + chalk.red(`: Игрок ${userData.uuid} (${userData.nickname}) не состоит ни в какой гильдии на Hypixel!`));
                    }
                } else {
                    console.log(chalk.blackBright(`[${new Date()}]`) + `Гильдия не найдена или игрок не найден.`)
                    interaction.editReply(`Ошибка! Свяжитесь с администрацией гильдии.`)
                }

                userData.save()
                await msg.edit({
                    content: `Идет просмотр опыта у всех участников . . . 

**Прогресс**: ${b + 1}/${userDatas.length} - ${(Math.round(((b + 1) / (userDatas.length)) * 100))}% завершено . . .`
                })
                b++
            }
            let sorted = await userDatas.sort((a, c) => c.weekly_exp - a.weekly_exp)
            let top = await sorted.slice(0, 3)
            let index = 1
            let medal
            let list = top.map(async (player) => {
                let user = guild.members.fetch(player.userid)
                if (index == 1) {
                    medal = index.toString().replace(1, `🥇`)
                    player.medal_1 += 1
                    player.progress.items.find(it => it.name == 'MEDALS_1').total_items += 1
                }
                if (index == 2) {
                    medal = index.toString().replace(2, `🥈`)
                    player.medal_2 += 1
                    player.progress.items.find(it => it.name == 'MEDALS_2').total_items += 1
                }
                if (index == 3) {
                    medal = index.toString().replace(3, `🥉`)
                    player.medal_3 += 1
                    player.progress.items.find(it => it.name == 'MEDALS_3').total_items += 1
                }
                index++
                player.save()
                return `**\`${medal} ${player.nickname}\`** - ${player.weekly_exp} опыта гильдии!`
            })
            list = await Promise.all(list)

            const top_3 = new EmbedBuilder()
                .setTitle(`Топ-3 лучших игрока по GEXP`)
                .setDescription(`${list.join('\n')}`)
                .setColor(Number(client.information.bot_color))
                .setTimestamp(Date.now())

            await msg.edit({
                content: ``,
                embeds: [top_3]
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


    /**
     * 
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async newMarathon(client) {
        const guild = await client.guilds.fetch('320193302844669959');
        if (!await checkPlugin(guild.id, this.id)) return;
        const channel = await guild.channels.fetch(ch_list.marathon);
        const guildData = await Guild.findOne({ id: guild.id })
        const stage1msg = await channel.messages.fetch('1173198390855733348');
        const stage2msg = await channel.messages.fetch('1173198391967219745');
        const stage3msg = await channel.messages.fetch('1173198393380720671');
        const stage4msg = await channel.messages.fetch('1173198394798387280');
        const stage5msg = await channel.messages.fetch('1173198415556001824');

        let curType = guildData.marathon.marathon_type;
        let types = marathon.types
        let curTypeID = types.findIndex(type => type == curType);
        types.splice(curTypeID, 1);
        let newType = types[Math.floor(Math.random() * types.length)];
        const marathonNew = marathon[newType];
        guildData.marathon.marathon_type = newType;
        guildData.save();
        const stage1 = marathonNew.filter(mar => mar.stage == 1);
        const stage2 = marathonNew.filter(mar => mar.stage == 2);
        const stage3 = marathonNew.filter(mar => mar.stage == 3);
        const stage4 = marathonNew.filter(mar => mar.stage == 4);
        const stage5 = marathonNew.filter(mar => mar.stage == 5);


        const buttons1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`marathon_1_1`)
                    .setEmoji(`1️⃣`)
                    .setLabel(`${stage1[0].game}`)
                    .setStyle(ButtonStyle.Primary)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`marathon_1_2`)
                    .setEmoji(`2️⃣`)
                    .setLabel(`${stage1[1].game}`)
                    .setStyle(ButtonStyle.Primary)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`marathon_1_3`)
                    .setEmoji(`3️⃣`)
                    .setLabel(`${stage1[2].game}`)
                    .setStyle(ButtonStyle.Primary)
            )

        const buttons2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`marathon_2_1`)
                    .setEmoji(`1️⃣`)
                    .setLabel(`${stage2[0].game}`)
                    .setStyle(ButtonStyle.Primary)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`marathon_2_2`)
                    .setEmoji(`2️⃣`)
                    .setLabel(`${stage2[1].game}`)
                    .setStyle(ButtonStyle.Primary)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`marathon_2_3`)
                    .setEmoji(`3️⃣`)
                    .setLabel(`${stage2[2].game}`)
                    .setStyle(ButtonStyle.Primary)
            )

        const buttons3 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`marathon_3_1`)
                    .setEmoji(`1️⃣`)
                    .setLabel(`${stage3[0].game}`)
                    .setStyle(ButtonStyle.Primary)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`marathon_3_2`)
                    .setEmoji(`2️⃣`)
                    .setLabel(`${stage3[1].game}`)
                    .setStyle(ButtonStyle.Primary)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`marathon_3_3`)
                    .setEmoji(`3️⃣`)
                    .setLabel(`${stage3[2].game}`)
                    .setStyle(ButtonStyle.Primary)
            )

        const buttons4 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`marathon_4_1`)
                    .setEmoji(`1️⃣`)
                    .setLabel(`${stage4[0].game}`)
                    .setStyle(ButtonStyle.Primary)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`marathon_4_2`)
                    .setEmoji(`2️⃣`)
                    .setLabel(`${stage4[1].game}`)
                    .setStyle(ButtonStyle.Primary)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`marathon_4_3`)
                    .setEmoji(`3️⃣`)
                    .setLabel(`${stage4[2].game}`)
                    .setStyle(ButtonStyle.Primary)
            )

        const buttons5 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`marathon_5_1`)
                    .setEmoji(`1️⃣`)
                    .setLabel(`${stage5[0].game}`)
                    .setStyle(ButtonStyle.Primary)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`marathon_5_2`)
                    .setEmoji(`2️⃣`)
                    .setLabel(`${stage5[1].game}`)
                    .setStyle(ButtonStyle.Primary)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`marathon_5_3`)
                    .setEmoji(`3️⃣`)
                    .setLabel(`${stage5[2].game}`)
                    .setStyle(ButtonStyle.Primary)
            )


        await stage1msg.edit({
            content: `**ПЕРВЫЙ ЭТАП**
${stage1[0].description}
         **ИЛИ**
${stage1[1].description}
         **ИЛИ**
${stage1[2].description}
:gift: Награда: \`Большая коробка\``,
            components: [buttons1]
        })
        await stage2msg.edit({
            content: `:black_medium_small_square:
**ВТОРОЙ ЭТАП**
${stage2[0].description}
         **ИЛИ**
${stage2[1].description}
         **ИЛИ**
${stage2[2].description}
:gift: Награда: \`Огромная коробка\``,
            components: [buttons2]
        })
        await stage3msg.edit({
            content: `:black_medium_small_square:
**ТРЕТИЙ ЭТАП**
${stage3[0].description}
         **ИЛИ**
${stage3[1].description}
         **ИЛИ**
${stage3[2].description}
:gift: Награда: \`250\` :diamond_shape_with_a_dot_inside:`,
            components: [buttons3]
        })
        await stage4msg.edit({
            content: `:black_medium_small_square:
**ЧЕТВЁРТЫЙ ЭТАП**
${stage4[0].description}
         **ИЛИ**
${stage4[1].description}
         **ИЛИ**
${stage4[2].description}
:gift: Награда: \`Королевская коробка\``,
            components: [buttons4]
        })
        await stage5msg.edit({
            content: `:black_medium_small_square:
**ПЯТЫЙ ЭТАП**
${stage5[0].description}
         **ИЛИ**
${stage5[1].description}
         **ИЛИ**
${stage5[2].description}
:gift: Награда: \`🔥 АКТИВИСТ ГИЛЬДИИ\` **или** \`Сокровище\``,
            components: [buttons5]
        })
    }
}


module.exports = {
    MCUpdates
}