const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, channelLink, ChannelType, EmbedBuilder, } = require('discord.js');
const { Apply } = require(`../../../schemas/applications`)
const linksInfo = require(`../../../discord structure/links.json`)
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

        let role = `610131863683465246`
        let name = `№18. Художник`
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

        if (!member.roles.cache.has(`850079153746346044`) && !member.roles.cache.has(`850079142413598720`) && !member.roles.cache.has(`850079173149065277`) && !member.roles.cache.has(`642810535737425930`) && !member.roles.cache.has(`642810538518118430`) && !member.roles.cache.has(`642819600429481997`) && !member.roles.cache.has(`850079134700666890`) && !member.roles.cache.has(`893927886766096384`) && !member.roles.cache.has(`694914077104799764`)) return interaction.reply({
            embeds: [no_condition],
            ephemeral: true
        })
        let reward = `521248091853291540`
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
            .setColor(Number(linksInfo.bot_color))
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
        let options = interaction?.options.data.map(a => {
            return `{
"status": true,
"name": "${a.name}",
"type": ${a.type},
"autocomplete": ${a?.autocomplete ? true : false},
"value": "${a?.value ? a.value : "No value"}",
"user": "${a?.user?.id ? a.user.id : "No User"}",
"channel": "${a?.channel?.id ? a.channel.id : "No Channel"}",
"role": "${a?.role?.id ? a.role.id : "No Role"}",
"attachment": "${a?.attachment?.url ? a.attachment.url : "No Attachment"}"
}`
        })
        await admin.send(`Произошла ошибка!`)
        await admin.send(`=> ${e}.
**ID модели**: \`${interaction.customId}\`
**Пользователь**: ${interaction.member}
**Канал**: ${interaction.channel}
**Опции**: \`\`\`json
${interaction.options.data.length <= 0 ? `{"status": false}` : options.join(`,\n`)}
\`\`\``)
        await admin.send(`◾`)
    }

}
module.exports = {
    plugin: {
        id: "items",
        name: "Предметы"
    },
    data: {
        name: "ach_norm_18"
    },
    execute
}