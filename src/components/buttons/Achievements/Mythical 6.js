const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, channelLink, ChannelType, EmbedBuilder, } = require('discord.js');
const { Apply } = require(`../../../schemas/applications`)
const ch_list = require(`../../../discord structure/channels.json`);
const { User } = require('../../../schemas/userdata');
const { Guild } = require('../../../schemas/guilddata');
const roles_info = require(`../../../discord structure/roles.json`);
const { mentionCommand } = require('../../../functions');
const wait = require(`node:timers/promises`).setTimeout

/**
 * 
 * @param {import("discord.js").ButtonInteraction} interaction Interaction
 * @param {import("../../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        const { guild, member, user } = interaction
        const guildData = await Guild.findOne({ id: guild.id })
        const userData = await User.findOne({ userid: user.id })

        let role = `1068215995090608169`
        let name = `№6. Мировая тайна`

        const already_done = new EmbedBuilder()
            .setColor(`DarkRed`)
            .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
            .setAuthor({
                name: `❗ Достижение уже выполнено!`
            })
            .setDescription(`Вы не можете выполнить данное достижение, так как вы уже выполнили его! Найти его вы можете в своем профиле.
    
Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)


        if (member.roles.cache.has(role)) return interaction.reply({
            embeds: [already_done],
            ephemeral: true
        })
        if (userData.achievements.myth_6_clicked < 50) {
            let not_enough = [
                "Ты не можешь выполнить это достижение!",
                "О нет, о нет, достижение не выдано!",
                "Ай, блин, мне же больно!",
                "Хватит чупать меня, а? Я позову своего адвоката!",
                "Нет, ну правда, хватит уже!",
                "Я устала!",
                "Ты никогда не получишь это достижение!",
                "Ха, мимо, ведь так?",
                "Фу! Слабак!",
                "Ну... пожалуйста... остановись...",
                "О нет!",
                "Достижение уже выполнено! Вы не можете выполнить данное достижение, так как вы уже выполнили его!",
                "Никогда больше так не делай!",
                "Эх... Ну ладно, придется открыть тебе тайну, как получить меня... набей 1.000.000.000 GEXP за месяц",
                "Что ты хочешь?",
                "Как твои дела? Не устал?",
            ]
            let res = not_enough[Math.floor(Math.random() * not_enough.length)]
            await interaction.reply({
                content: `${res}`,
                ephemeral: true
            })
            userData.achievements.myth_6_clicked += 1
            userData.achievements.myth_6_remove = Date.now() + (1000 * 20)
            userData.save()

            await wait(20000)
            client.AchMyth6()
        } else {
            let reward = `781069821953441832`
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
            await member.roles.add(role)
            let addAct = Math.round(700 * userData.pers_act_boost * guildData.act_exp_boost)
            let addRank = Math.round(300 * (userData.pers_rank_boost + userData.perks.rank_boost * 0.05))
            userData.rank += addRank
            userData.exp += addAct;
            await client.CountAchievements()
            userData.save()
            client.ActExp(userData.userid)
            const condition_meet = new EmbedBuilder()
                .setColor(Number(client.information.bot_color))
                .setThumbnail(`https://i.imgur.com/Xa6HxCU.png`)
                .setTitle(`✅ Достижение выполнено!`)
                .setTimestamp(Date.now())
                .setDescription(`${user} выполнил достижение \`${name}\`!
Он уже получил приз. Хочешь и ты? Тогда тебе в <#${ch_list.achs}>!
    
Достижений выполнено: \`${userData.achievements.normal}/${roles_info.achievements_normal.length}\`
Мифических достижений выполнено: \`${userData.achievements.mythical + 1}/${roles_info.achievements_myth.length}\`

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
        }

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
        id: "items",
        name: "Предметы"
    },
    data: {
        name: "ach_myth_6"
    },
    execute
}