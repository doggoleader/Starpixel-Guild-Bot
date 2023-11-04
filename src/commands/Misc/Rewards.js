const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { execute } = require('../../events/client/start_bot/ready');
const fetch = require(`node-fetch`);
const api = process.env.hypixel_apikey;
const { User } = require(`../../schemas/userdata`)
const chalk = require(`chalk`);
const prettyMilliseconds = require(`pretty-ms`); //ДОБАВИТЬ В ДРУГИЕ
const ch_list = require(`../../discord structure/channels.json`)
const { Guild } = require(`../../schemas/guilddata`)
const wait = require(`node:timers/promises`).setTimeout
const linksInfo = require(`../../discord structure/links.json`)

module.exports = {
    category: `items`,
    plugin: {
        id: "items",
        name: "Предметы"
    },
    data: new SlashCommandBuilder()
        .setName(`rewards`)
        .setDescription(`Неполученные награды`)
        .setDMPermission(false)
        .addSubcommand(subcommand => subcommand
            .setName(`claim`)
            .setDescription(`Забрать неполученные награды`)
        )
        .addSubcommand(subcommand => subcommand
            .setName(`unclaimed`)
            .setDescription(`Список неполученных наград`)
        ),

    async execute(interaction, client) {
        try {
           
            const { user, member, guild } = interaction
            const userData = await User.findOne({ userid: user.id })

            switch (interaction.options.getSubcommand()) {
                case `claim`: {
                    if (userData.stacked_items.length <= 0) return interaction.reply({
                        content: `У вас нет неполученных наград!`,
                        ephemeral: true
                    })
                    let claimed = []
                    const msg = await interaction.reply({ content: `Начинается выдача наград...`, ephemeral: true, fetchReply: true })
                    const items = userData.stacked_items.slice(0)
                    for (const item of items) {
                        if (!member.roles.cache.has(item) && (item !== "1007290181038133269" && item !== "1007290181847613530" && item !== "1007290182883622974" && item !== "850336260265476096")) {
                            await claimed.push(item)
                            await member.roles.add(item).catch()
                            let b = await userData.stacked_items.findIndex(it => it == item)
                            userData.stacked_items.splice(b, 1)
                            await interaction.editReply({ content: `Вы получили <@&${item}>... Идёт проверка других наград!`, fetchReply: true })
                            await wait(500)
                        } else if (item == "1007290181038133269" || item == "1007290181847613530" || item == "1007290182883622974" || item == "850336260265476096") {
                            switch (item) {
                                case "1007290181038133269": {
                                    if (!member.roles.cache.has("1007290181847613530") && !member.roles.cache.has("1007290182883622974") && !member.roles.cache.has("850336260265476096")) {
                                        await claimed.push(item)
                                        await member.roles.add(item).catch()
                                        let b = await userData.stacked_items.findIndex(it => it == item)
                                        userData.stacked_items.splice(b, 1)
                                        await interaction.editReply({ content: `Вы получили <@&${item}>... Идёт проверка других наград!`, fetchReply: true })
                                        await wait(500)
                                    }
                                }
                                    break;
                                case "1007290181847613530": {
                                    if (!member.roles.cache.has("1007290182883622974") && !member.roles.cache.has("850336260265476096")) {
                                        await claimed.push(item)
                                        await member.roles.add(item).catch()
                                        let b = await userData.stacked_items.findIndex(it => it == item)
                                        userData.stacked_items.splice(b, 1)
                                        await interaction.editReply({ content: `Вы получили <@&${item}>... Идёт проверка других наград!`, fetchReply: true })
                                        await wait(500)
                                    }
                                }
                                    break;
                                case "1007290182883622974": {
                                    if (!member.roles.cache.has("850336260265476096")) {
                                        await claimed.push(item)
                                        await member.roles.add(item).catch()
                                        let b = await userData.stacked_items.findIndex(it => it == item)
                                        userData.stacked_items.splice(b, 1)
                                        await interaction.editReply({ content: `Вы получили <@&${item}>... Идёт проверка других наград!`, fetchReply: true })
                                        await wait(500)
                                    }
                                }
                                    break;
                                case "850336260265476096": {
                                    await claimed.push(item)
                                    await member.roles.add(item).catch()
                                    let b = await userData.stacked_items.findIndex(it => it == item)
                                    userData.stacked_items.splice(b, 1)
                                    await interaction.editReply({ content: `Вы получили <@&${item}>... Идёт проверка других наград!`, fetchReply: true })
                                    await wait(500)
                                }
                                    break;

                                default:
                                    break;
                            }
                        }
                    }
                    userData.save()
                    let i = 1
                    if (claimed.length <= 0) return interaction.editReply({
                        content: `Вы не получили ни одной награды! Пожалуйста, откройте коробки, а затем пропишите эту команду ещё раз!`
                    })
                    const map = claimed.map(reward => {
                        return `**${i++}.** Получена награда <@&${reward}>!`
                    })
                    const embed = new EmbedBuilder()
                        .setTitle(`Получены награды`)
                        .setDescription(`**Список наград:**
${map.join('\n')}

Осталось неполученных наград: ${userData.stacked_items.length}!`)
                        .setColor(Number(linksInfo.bot_color))
                        .setThumbnail(user.displayAvatarURL())
                        .setTimestamp(Date.now())

                    await interaction.editReply({
                        content: ``,
                        embeds: [embed]
                    })
                }

                    break;
                case `unclaimed`: {
                    if (userData.stacked_items.length <= 0) return interaction.reply({
                        content: `У вас нет неполученных наград!`,
                        ephemeral: true
                    })
                    let i = 1
                    const map = userData.stacked_items.map(reward => {
                        return `**${i++}.** Награда: <@&${reward}>!`
                    })
                    let n = 0

                    const totalPages = Math.ceil(map.length / 10)
                    let rewardsList = map.slice(0 + (n * 10), 10 + (n * 10))
                    const pages = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`prev`)
                                .setEmoji(`⬅`)
                                .setStyle(ButtonStyle.Danger)
                                .setDisabled(true)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`stop`)
                                .setEmoji(`⏹`)
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(false)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`next`)
                                .setEmoji(`➡`)
                                .setStyle(ButtonStyle.Success)
                                .setDisabled(false)
                        )
                    const embed = new EmbedBuilder()
                        .setTitle(`Неполученные награды`)
                        .setDescription(`Неполученных наград: ${userData.stacked_items.length}!

**Список наград:**
${rewardsList.join('\n')}`)
                        .setColor(Number(linksInfo.bot_color))
                        .setThumbnail(user.displayAvatarURL())
                        .setTimestamp(Date.now())
                        .setFooter({
                            text: `Страница ${n + 1}/${totalPages}`
                        })

                    const msg = await interaction.reply({
                        embeds: [embed],
                        components: [pages],
                        fetchReply: true
                    })
                    const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button })
                    collector.on('collect', async (i) => {
                        if (i.customId == `prev`) {
                            n = n - 1
                            if (n <= 0) {
                                pages.components[0].setDisabled(true)
                            } else {
                                pages.components[0].setDisabled(false)
                            }
                            pages.components[1].setDisabled(false)
                            pages.components[2].setDisabled(false)
                            rewardsList = map.slice(0 + (n * 10), 10 + (n * 10))
                            embed.setTimestamp(Date.now())
                                .setDescription(`Неполученных наград: ${userData.stacked_items.length}!

**Список наград:**
${rewardsList.join('\n')}`)
                                .setFooter({
                                    text: `Страница ${n + 1}/${totalPages}`
                                })
                            await i.deferUpdate()
                            await interaction.editReply({
                                embeds: [embed],
                                components: [pages],
                                fetchReply: true
                            })

                        } else if (i.customId == `stop`) {
                            await i.deferUpdate()
                            collector.stop()
                        } else if (i.customId == `next`) {
                            n = n + 1
                            if (n >= totalPages - 1) {
                                pages.components[2].setDisabled(true)
                            } else {
                                pages.components[2].setDisabled(false)
                            }
                            pages.components[1].setDisabled(false)
                            pages.components[0].setDisabled(false)
                            rewardsList = map.slice(0 + (n * 10), 10 + (n * 10))
                            embed.setTimestamp(Date.now())
                                .setDescription(`Неполученных наград: ${userData.stacked_items.length}!

**Список наград:**
${rewardsList.join('\n')}`)
                                .setFooter({
                                    text: `Страница ${n + 1}/${totalPages}`
                                })
                            await i.deferUpdate()
                            await interaction.editReply({
                                embeds: [embed],
                                components: [pages],
                                fetchReply: true
                            })
                        }
                    })

                    collector.on('end', async (collected) => {
                        n = n
                        pages.components[0].setDisabled(true)
                        pages.components[1].setDisabled(true)
                        pages.components[2].setDisabled(true)
                        rewardsList = map.slice(0 + (n * 10), 10 + (n * 10))
                        embed.setTimestamp(Date.now())
                            .setDescription(`Неполученных наград: ${userData.stacked_items.length}!

**Список наград:**
${rewardsList.join('\n')}`)
                            .setFooter({
                                text: `Страница ${n + 1}/${totalPages}`
                            })
                        await interaction.editReply({
                            embeds: [embed],
                            components: [pages]
                        })
                    })
                }
                    break;

                default:
                    break;
            }
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
**Команда**: \`${interaction.commandName}\`
**Пользователь**: ${interaction.member}
**Канал**: ${interaction.channel}
**Опции**: \`\`\`json
${interaction.options.data.length <= 0 ? `{"status": false}` : options.join(`,\n`)}
\`\`\``)
            await admin.send(`◾`)
        }


    }
};