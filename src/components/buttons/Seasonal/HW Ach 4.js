const { Temp } = require(`../../../schemas/temp_items`)
const { User } = require(`../../../schemas/userdata`)
const { Guild } = require(`../../../schemas/guilddata`)
const chalk = require(`chalk`)
const fetch = require(`node-fetch`)
const cron = require(`node-cron`)
const ch_list = require(`../../../discord structure/channels.json`)
const { mentionCommand } = require('../../../functions');
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js")


const { achievementStats, found, getProperty } = require(`../../../functions`)
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
        if (guildData.seasonal.halloween.enabled === false) return interaction.reply({
            content: `Сейчас не время для Хэллоуина! Попробуйте сделать это в период с **7 октября по 7 ноября**!`,
            ephemeral: true
        })
        const userData = await User.findOne({ userid: interaction.user.id })
        const { member, guild, user, channel } = interaction
        const already_done = new EmbedBuilder()
            .setColor(`DarkRed`)
            .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
            .setAuthor({
                name: `❗ Достижение уже выполнено!`
            })
            .setDescription(`Вы не можете выполнить данное достижение, так как вы уже выполнили его! Найти его вы можете в своем профиле.
    
Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)


        if (userData.seasonal.halloween.achievements.num4 === true) return interaction.reply({
            embeds: [already_done],
            ephemeral: true
        })

        const no_condition = new EmbedBuilder()
            .setColor(`DarkRed`)
            .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
            .setAuthor({
                name: `❗ Вы не соответствуете требованиям!`
            })
            .setDescription(`Вы не соответствуете требованиям для получения данного достижения! Проверить требования вы можете в канале <#${ch_list.hw_achs}>.
    
Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)
            .setTimestamp(Date.now())

        if (!userData.seasonal.halloween.hw_cosm) return interaction.reply({
            embeds: [no_condition],
            ephemeral: true
        })
        let reward = `893932177799135253`
        let name = `Жуть`
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
        userData.seasonal.halloween.achievements.num4 = true
        userData.seasonal.halloween.points += 5
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
Он уже получил приз. Хочешь и ты? Тогда тебе в <#${ch_list.hw_achs}>!

Чтобы проверить статистику ваших достижений, используйте меню статистики в канале <#${ch_list.hw_main}>!

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
        name: `season_halloween_ach4`
    },
    execute
}
