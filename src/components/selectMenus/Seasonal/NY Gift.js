const { Temp } = require(`../../../schemas/temp_items`)
const { User } = require(`../../../schemas/userdata`)
const { Guild } = require(`../../../schemas/guilddata`)
const chalk = require(`chalk`)
const fetch = require(`node-fetch`)
const cron = require(`node-cron`)
const prettyMilliseconds = require(`pretty-ms`)
const ch_list = require(`../../../discord structure/channels.json`)
const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js")

const { achievementStats, found, getProperty, changeProperty } = require(`../../../functions`)
const linksInfo = require(`../../../discord structure/links.json`)
const { lb_newyear, gift_newyear, stats_newyear, quests_newyear } = require("../../../misc_functions/Exporter")
const api = process.env.hypixel_apikey
/**
 * 
 * @param {import("discord.js").UserSelectMenuInteraction} interaction Interaction
 * @param {import("../../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        const guildData = await Guild.findOne({ id: interaction.guild.id })
        await interaction.message.edit({
            components: [lb_newyear, stats_newyear, gift_newyear, quests_newyear]
        })
        if (guildData.plugins.seasonal === false) return interaction.reply({ content: `Данный плагин отключён! Попробуйте позже!`, ephemeral: true })
        if (guildData.seasonal.new_year.enabled === false) return interaction.reply({
            content: `Сейчас не время для Нового года! Попробуйте сделать это в период **1 декабря по 18 января**!`,
            ephemeral: true
        })

        const { member, user, guild } = interaction;
        const toGiftMember = await interaction.guild.members.fetch(interaction.values[0])
        if (user.id == toGiftMember.user.id) return interaction.reply({
            content: `Вы не можете сделать подарок самому себе!`,
            ephemeral: true
        })
        const { user: toGiftUser } = toGiftMember
        if (toGiftUser.bot) return interaction.reply({
            content: `${user} является ботом, а значит ему нельзя сделать подарок :'(`,
            ephemeral: true
        })
        if (!toGiftMember.roles.cache.has(`504887113649750016`)) return interaction.reply({
            content: `${member} является гостем гильдии, а значит ему нельзя сделать подарок!`,
            ephemeral: true
        })

        const userDataFrom = await User.findOne({ userid: user.id })
        const userDataTo = await User.findOne({ userid: toGiftUser.id })
        const packs = {
            pack_1: "🎄 Маленький новогодний набор",
            pack_2: "🎄 Средний новогодний набор",
            pack_3: "🎄 Большой новогодний набор",
            pack_4: "🎄 Гигантский новогодний набор"
        }
        let select = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setPlaceholder(`Выберите подарок`)
                    .setCustomId(`get_gift`)
                    .setOptions([
                        {
                            label: `Маленький новогодний набор`,
                            value: `pack_1`,
                            description: `У вас в наличии ${userDataFrom.seasonal.new_year.available_packs.pack_1} шт.`
                        },
                        {
                            label: `Средний новогодний набор`,
                            value: `pack_2`,
                            description: `У вас в наличии ${userDataFrom.seasonal.new_year.available_packs.pack_2} шт. `
                        },
                        {
                            label: `Большой новогодний набор`,
                            value: `pack_3`,
                            description: `У вас в наличии ${userDataFrom.seasonal.new_year.available_packs.pack_3} шт. `
                        },
                        {
                            label: `Гигантский новогодний набор`,
                            value: `pack_4`,
                            description: `У вас в наличии ${userDataFrom.seasonal.new_year.available_packs.pack_4} шт. `
                        }
                    ])
            )

        let embed = new EmbedBuilder()
            .setColor(Number(linksInfo.bot_color))
            .setDescription(`## Отправить подарочный набор
            
Вы собираетесь отправить подарочный набор. Выберите, какой набор вы хотите отправить:
- 🎄 Маленький новогодний набор (в наличии ${userDataFrom.seasonal.new_year.available_packs.pack_1} шт.)
- 🎄 Средний новогодний набор (в наличии ${userDataFrom.seasonal.new_year.available_packs.pack_2} шт.)
- 🎄 Большой новогодний набор (в наличии ${userDataFrom.seasonal.new_year.available_packs.pack_3} шт.)
- 🎄 Гигантский новогодний набор (в наличии ${userDataFrom.seasonal.new_year.available_packs.pack_4} шт.)
Содержимое каждого подарка вы можете узнать в канале <#${ch_list.shop}>!

**Получатель набора**: ${toGiftMember}

Если вы передумали отправлять подарок, просто удалите данное сообщение!`)

        const msg = await interaction.reply({
            embeds: [embed],
            components: [select],
            ephemeral: true,
            fetchReply: true
        })

        const collector = await msg.createMessageComponentCollector()

        collector.on('collect', async (i) => {
            const value = i.values[0]
            const pack_contents = require(`../../../jsons/SeasonalPacks.json`)
            if (userDataFrom.seasonal.new_year.available_packs[value] <= 0) return i.reply({
                content: `У вас нет данного набора в наличии!`,
                ephemeral: true
            })

            userDataFrom.seasonal.new_year.available_packs[value] -= 1

            for (let item of pack_contents.new_year[value].items) {
                if (item.type == 'role') {
                    for (let i = 0; i < item.amount; i++) {
                        userDataTo.stacked_items.push(item.id)
                    }
                } else if (item.type == 'static') {
                    if (typeof item.amount == 'number') {
                        await changeProperty(userDataTo, item.db_code, await getProperty(userDataTo, item.db_code) + item.amount)
                    } else if (typeof item.amount == 'boolean') {
                        await changeProperty(userDataTo, item.db_code, item.amount)
                    }
                }
            }

            userDataFrom.save()
            userDataTo.save()

            embed = new EmbedBuilder()
                .setColor(Number(linksInfo.bot_color))
                .setDescription(`## Отправить подарочный набор
            
Вы собираетесь отправить подарочный набор. Выберите, какой набор вы хотите отправить:
- 🎄 Маленький новогодний набор (в наличии ${userDataFrom.seasonal.new_year.available_packs.pack_1} шт.)
- 🎄 Средний новогодний набор (в наличии ${userDataFrom.seasonal.new_year.available_packs.pack_2} шт.)
- 🎄 Большой новогодний набор (в наличии ${userDataFrom.seasonal.new_year.available_packs.pack_3} шт.)
- 🎄 Гигантский новогодний набор (в наличии ${userDataFrom.seasonal.new_year.available_packs.pack_4} шт.)
Содержимое каждого подарка вы можете узнать в канале <#${ch_list.shop}>!

**Получатель набора**: ${toGiftMember}

Если вы передумали отправлять подарок, просто удалите данное сообщение!`)

            select = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setPlaceholder(`Выберите подарок`)
                        .setCustomId(`get_gift`)
                        .setOptions([
                            {
                                label: `Маленький новогодний набор`,
                                value: `pack_1`,
                                description: `У вас в наличии ${userDataFrom.seasonal.new_year.available_packs.pack_1} шт.`
                            },
                            {
                                label: `Средний новогодний набор`,
                                value: `pack_2`,
                                description: `У вас в наличии ${userDataFrom.seasonal.new_year.available_packs.pack_2} шт. `
                            },
                            {
                                label: `Большой новогодний набор`,
                                value: `pack_3`,
                                description: `У вас в наличии ${userDataFrom.seasonal.new_year.available_packs.pack_3} шт. `
                            },
                            {
                                label: `Гигантский новогодний набор`,
                                value: `pack_4`,
                                description: `У вас в наличии ${userDataFrom.seasonal.new_year.available_packs.pack_4} шт. `
                            }
                        ])
                )



            await interaction.editReply({
                embeds: [embed],
                components: [select],
                fetchReply: true
            })

            await i.reply({
                content: `Вы отправили пользователю ${toGiftMember} ${packs[value]}!`,
                ephemeral: true
            })

            const channel = await interaction.guild.channels.fetch(ch_list.main)
            await channel.send({
                content: `${member} отправил пользователю ${toGiftMember} \`${packs[value]}\`!`
            })
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
**ID кнопки**: \`${interaction.customId}\`
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
        id: "seasonal",
        name: "Сезонное"
    },
    data: {
        name: `season_newyear_gift`
    },
    execute
}
