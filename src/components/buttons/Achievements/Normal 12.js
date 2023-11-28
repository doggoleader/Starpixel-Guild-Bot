const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, channelLink, ChannelType, EmbedBuilder, } = require('discord.js');
const { Apply } = require(`../../../schemas/applications`)
const ch_list = require(`../../../discord structure/channels.json`);
const { User } = require('../../../schemas/userdata');
const { Guild } = require('../../../schemas/guilddata');
const roles_info = require(`../../../discord structure/roles.json`)
const { mentionCommand } = require('../../../functions');

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

        let role = `585175165315579904`
        let name = `№12. Смайл`
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

        const no_condition = new EmbedBuilder()
            .setColor(`DarkRed`)
            .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
            .setAuthor({
                name: `❗ Вы не соответствуете требованиям!`
            })
            .setDescription(`Вы не соответствуете требованиям для получения данного достижения! Проверить требования вы можете в канале <#${ch_list.achs}>.
    
Если вы считаете, что это ошибка, напишите об этом в <#${ch_list.ask}>!`)
            .setTimestamp(Date.now())

        if (!member.roles.cache.has(`566528019208863744`) && !member.roles.cache.has(`571743750049497089`) && !member.roles.cache.has(`571745411929341962`) && !member.roles.cache.has(`571744516894228481`) && !member.roles.cache.has(`571757459732168704`) && !member.roles.cache.has(`571757461380399106`) && !member.roles.cache.has(`571757462219128832`) && !member.roles.cache.has(`571757463876141077`) && !member.roles.cache.has(`642810527579373588`) && !member.roles.cache.has(`642393088689700893`) && !member.roles.cache.has(`636561006721761301`) && !member.roles.cache.has(`607495941490212885`) && !member.roles.cache.has(`694221126494060604`) && !member.roles.cache.has(`740241984190545971`)) return interaction.reply({
            embeds: [no_condition],
            ephemeral: true
        })
        let reward = `510932601721192458`
        if (member.roles.cache.has(reward)) {
            if (userData.stacked_items.length < userData.upgrades.inventory_size) {
                await userData.stacked_items.push(reward)
                await interaction.reply({
                    content: `Награда была добавлена в инвентарь! Чтобы получить награду, откройте коробки и пропишите команду ${mentionCommand(client, 'rewards claim')}! Для просмотра списка неполученных наград пропишите ${mentionCommand(client, 'rewards unclaimed')}!`,
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

        userData.rank += 50 * userData.pers_rank_boost + Math.round(50 * userData.perks.rank_boost * 0.05)
        userData.exp += 300;
        await client.CountAchievements()
        userData.save()
        const condition_meet = new EmbedBuilder()
            .setColor(Number(client.information.bot_color))
            .setThumbnail(`https://i.imgur.com/Xa6HxCU.png`)
            .setTitle(`✅ Достижение выполнено!`)
            .setTimestamp(Date.now())
            .setDescription(`${user} выполнил достижение \`${name}\`!
Он уже получил приз. Хочешь и ты? Тогда тебе в <#${ch_list.achs}>!
    
Достижений выполнено: \`${userData.achievements.normal + 1}/${roles_info.achievements_normal.length}\`
Мифических достижений выполнено: \`${userData.achievements.mythical}/${roles_info.achievements_myth.length}\``)


        await interaction.guild.channels.cache.get(ch_list.act).send(
            `╒══════════════════╕
${user} +300 🌀
\`Выполнение достижения.\`
╘══════════════════╛`)

        await interaction.guild.channels.cache.get(ch_list.rank).send(
            `╒══════════════════╕
${user} +50 💠
\`Выполнение достижения.\`
╘══════════════════╛`)
        await interaction.guild.channels.cache.get(ch_list.main).send({
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
        name: "ach_norm_12"
    },
    execute
}