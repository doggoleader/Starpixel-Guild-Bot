const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, channelLink, ChannelType, EmbedBuilder, } = require('discord.js');
const { Apply } = require(`../../../schemas/applications`)
const ch_list = require(`../../../discord structure/channels.json`);
const { User } = require('../../../schemas/userdata');
const { Guild } = require('../../../schemas/guilddata');
const roles_info = require(`../../../discord structure/roles.json`);
const { Achievements } = require('../../../functions/Updates/AchievementsClass');
const { mentionCommand } = require('../../../functions');

/**
 * 
 * @param {import("discord.js").ModalSubmitInteraction} interaction Interaction
 * @param {import("../../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        const { guild, member, user } = interaction
        const guildData = await Guild.findOne({ id: guild.id })
        const userData = await User.findOne({ userid: user.id })

        let role = `694914072960958555`
        let name = `№25. Тайная команда`


        const no_condition = new EmbedBuilder()
            .setColor(`DarkRed`)
            .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
            .setAuthor({
                name: `❗ Неверное слово`
            })
            .setDescription(`Вы не отгадали тайное слово! Повторите попытку ещё раз.`)
            .setTimestamp(Date.now())

        let answer = interaction.fields.getTextInputValue(`word`);
        if (!answer || answer.toLowerCase() !== guildData.secret_word.name) return interaction.reply({
            embeds: [no_condition],
            ephemeral: true
        })
        let reward = `584673040470769667`
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
        await member.roles.add(role);
        guildData.secret_word.guessed = true
        guildData.save()
        let addAct = Math.round(300 * userData.pers_act_boost * guildData.act_exp_boost)
        let addRank = Math.round(100 * (userData.pers_rank_boost + userData.perks.rank_boost * 0.05))
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

Достижений выполнено: \`${userData.achievements.normal + 1}/${roles_info.achievements_normal.length}\`
Мифических достижений выполнено: \`${userData.achievements.mythical}/${roles_info.achievements_myth.length}\`

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
        id: "items",
        name: "Предметы"
    },
    data: {
        name: "modal_ach_norm_25"
    },
    execute
}