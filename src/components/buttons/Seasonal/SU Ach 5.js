const { Temp } = require(`../../../schemas/temp_items`)
const { User } = require(`../../../schemas/userdata`)
const { Guild } = require(`../../../schemas/guilddata`)
const chalk = require(`chalk`)
const fetch = require(`node-fetch`)
const cron = require(`node-cron`)
const ch_list = require(`../../../discord structure/channels.json`)
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js")


const { achievementStats, found, getProperty } = require(`../../../functions`)
const { mentionCommand } = require('../../../functions');
const api = process.env.hypixel_apikey
/**
 * 
 * @param {import("discord.js").ButtonInteraction} interaction Interaction
 * @param {import("../../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        const guildData = await Guild.findOne({ id: interaction.guild.id })
        if (guildData.plugins.seasonal === false) return interaction.reply({ content: `Данный плагин отключён! Попробуйте позже!`, ephemeral: true })
        if (guildData.seasonal.summer.enabled === false) return interaction.reply({
            content: `Сейчас не время для Лета! Попробуйте сделать это в период **1 июня по 31 августа**!`,
            ephemeral: true
        })
        const userData = await User.findOne({ userid: interaction.user.id })
        if (!userData.onlinemode) return interaction.reply({
            content: `Вы не можете выполнить это достижение, так как у вас нелицензированный аккаунт!`,
            ephemeral: true
        })
        const { member, guild, user, channel } = interaction
        const already_done = new EmbedBuilder()
            .setColor(`DarkRed`)
            .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
            .setAuthor({
                name: `❗ Достижение уже выполнено!`
            })
            .setDescription(`Вы не можете выполнить данное достижение, так как вы уже выполнили его! Найти его вы можете в своем профиле.
    
Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)


        if (userData.seasonal.summer.achievements.num5 === true) return interaction.reply({
            embeds: [already_done],
            ephemeral: true
        })

        const no_condition = new EmbedBuilder()
            .setColor(`DarkRed`)
            .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
            .setAuthor({
                name: `❗ Вы не соответствуете требованиям!`
            })
            .setDescription(`Вы не соответствуете требованиям для получения данного достижения! Проверить требования вы можете в канале <#${ch_list.su_achs}>.
**Проверьте, чтобы вы состояли в гильдии Starpixel!**
    
Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)
            .setTimestamp(Date.now())
        const response = await fetch(`https://api.hypixel.net/guild?id=5c1902fc77ce84cd430f3959`, {
            headers: {
                "API-Key": api,
                "Content-Type": "application/json"
            }
        })
        let json
        if (response.ok) json = await response.json()
        let gexp_nums
        let sum
        let map
        let player = await json.guild.members.find(member => member.uuid == userData.uuid)
        if (!player) {
            map = `Не удалось найти пользователя в гильдии!`
            sum = 0
        } else {
            gexp_nums = Object.entries(player.expHistory)
            sum = 0
            map = gexp_nums.map(([key, value]) => {
                sum += value
                let sp = key.split(`-`)
                let date = `${sp[2]}.${sp[1]}.${sp[0]}`
                return `• \`${date}\` - ${value} GEXP`
            }).join(`\n`)
        }
        if (sum < 150000 || !player) return interaction.reply({
            embeds: [no_condition],
            ephemeral: true
        })
        let reward = `1104095303054934168`
        let name = `Жажда активности`
        if (member.roles.cache.has(reward)) {
            if (userData.stacked_items.length < userData.upgrades.inventory_size) {
                await userData.stacked_items.push(reward)
                await interaction.reply({
                    content: `Награда была добавлена в инвентарь! Чтобы получить награду, откройте коробки и пропишите команду ${mentionCommand(client, 'inventory')}! Для просмотра списка неполученных наград пропишите ${mentionCommand(client, 'inventory')}!`,
                    ephemeral: true
                })
            } else return interaction.reply({
                content: `Мы не можем добавить предмет в ваш инвентарь, так как он переполнен. Чтобы увеличить вместительность своего инвентаря, перейдите в канал <#1141026403765211136>!`,
                ephemeral: true
            })
        } else {
            await member.roles.add(reward)
            await interaction.deferUpdate()
        }
        userData.seasonal.summer.achievements.num5 = true

        userData.seasonal.summer.points += 5
        let addAct = Math.round(300 * userData.pers_act_boost * guildData.act_exp_boost)
        let addRank = Math.round(100 * (userData.pers_rank_boost + userData.perks.rank_boost * 0.05))
        userData.rank += addRank
        userData.exp += addAct;
        userData.save()
        client.ActExp(userData.userid)
        const condition_meet = new EmbedBuilder()
            .setColor(Number(client.information.bot_color))
            .setThumbnail(`https://i.imgur.com/Xa6HxCU.png`)
            .setTitle(`✅ Достижение выполнено!`)
            .setTimestamp(Date.now())
            .setDescription(`${user} выполнил достижение \`${name}\`!
Он уже получил приз. Хочешь и ты? Тогда тебе в <#${ch_list.su_achs}>!

Чтобы проверить статистику ваших достижений, используйте меню статистики в канале <#${ch_list.su_main}>!

**Награды:**
1. <@&${reward}>
2. \`${addAct}\`🌀
3. \`${addRank}\`💠`)

        await interaction.guild.channels.cache.get(ch_list.main).send({
            embeds: [condition_meet]
        })
        await interaction.guild.channels.cache.get(ch_list.box).send({
            embeds: [condition_meet]
        })
    } catch (e) {
        const admin = await client.users.fetch(`491343958660874242`)
        console.log(e)
        await admin.send({
            content: `-> \`\`\`${e.stack}\`\`\``
        }).catch()
    }


}
module.exports = {
    plugin: {
        id: "seasonal",
        name: "Сезонное"
    },
    data: {
        name: `season_summer_ach5`
    },
    execute
}
