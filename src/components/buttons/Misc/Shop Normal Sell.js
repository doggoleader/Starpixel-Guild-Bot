const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, StringSelectMenuBuilder } = require('discord.js');
const { Apply } = require(`../../../schemas/applications`)
const { User } = require(`../../../schemas/userdata`)
const { Guild } = require(`../../../schemas/guilddata`)
const linksInfo = require(`../../../discord structure/links.json`)
const chalk = require(`chalk`)
const roles = require(`../../../discord structure/roles.json`)
const { secondPage, divideOnPages } = require(`../../../functions`);
const { Temp } = require('../../../schemas/temp_items');

module.exports = {
    plugin: {
        id: "items",
        name: "Предметы"
    },
    data: {
        name: "normal_sell"
    },
    async execute(interaction, client) {
        try {
            const userData = await User.findOne({ userid: interaction.user.id })
            if (userData.perks.sell_items <= 0) return interaction.reply({
                content: `Вы должны иметь перк \`💰 Возможность продавать предметы из профиля\`, чтобы продавать предметы!`,
                ephemeral: true
            })
            if (userData.rank_number < 3) return interaction.reply({
                content: `Вы должны быть **мастером гильдии** или выше, чтобы продавать товары в данном магазине!`,
                ephemeral: true
            })
            const guildData = await Guild.findOne({ id: interaction.guild.id })
            const shop = require(`./JSON/SH.json`).filter(item => item.sellable == true)
            let shopForSelMenu = []
            if (shop.length <= 0) return interaction.reply({
                content: `В данном магазине нельзя продать ни один товар.`,
                ephemeral: true
            })
            let items = shop.map((item, i) => {
                pers_price = Math.round((item.price * guildData.global_settings.shop_prices * userData.shop_costs) / 2)
                currency = `<:Rumbik:883638847056003072>`

                let list = item.items.map(it => {
                    if (it.type == `role`) {
                        let exp = `всегда`
                        if (it.expire > 0) {
                            exp = ` `
                            let timeLeft = it.expire
                            if (timeLeft >= 60 * 60 * 24) {
                                exp = exp + Math.round(timeLeft / (60 * 60 * 24)) + `дн. `
                                timeLeft = timeLeft % (60 * 60 * 24)
                            }
                            if (timeLeft >= 60 * 60) {
                                exp = exp + Math.round(timeLeft / (60 * 60)) + `ч. `
                                timeLeft = timeLeft % (60 * 60)
                            }
                            if (timeLeft >= 60) {
                                exp = exp + Math.round(timeLeft / (60)) + `мин. `
                                timeLeft = timeLeft % (60)
                            }
                            if (timeLeft >= 0) {
                                exp = exp + Math.round(timeLeft / (1)) + `сек. `
                                timeLeft = 0
                            }
                        }
                        return ` - <@&${it.id}> x${it.amount} на${exp}`
                    } else if (it.type == `cosmetic`) {
                        return ` - ${it.name} (\`${it.value}\`)`
                    } else if (it.type == `booster`) {
                        let exp = `всегда`
                        if (it.expire > 0) {
                            exp = ` `
                            let timeLeft = it.expire
                            if (timeLeft >= 60 * 60 * 24) {
                                exp = exp + Math.round(timeLeft / (60 * 60 * 24)) + `дн. `
                                timeLeft = timeLeft % (60 * 60 * 24)
                            }
                            if (timeLeft >= 60 * 60) {
                                exp = exp + Math.round(timeLeft / (60 * 60)) + `ч. `
                                timeLeft = timeLeft % (60 * 60)
                            }
                            if (timeLeft >= 60) {
                                exp = exp + Math.round(timeLeft / (60)) + `мин. `
                                timeLeft = timeLeft % (60)
                            }
                            if (timeLeft >= 0) {
                                exp = exp + Math.round(timeLeft) + `сек. `
                                timeLeft = 0
                            }
                        }
                        return ` - ${it.name} ${it.multiplier}x на${exp}`
                    }
                })
                shopForSelMenu.push({
                    label: `${item.name}`,
                    emoji: `${item.emoji}`,
                    description: `ЦЕНА: ${pers_price} румбиков`,
                    value: `${i++}`
                })
                return `**${i}.** Товар: \`${item.emoji} ${item.name}\`:
- Описание: \`${item.description}\`
- Цена: ${pers_price} ${currency}
- Товар включает в себя следующие предметы:
${list.join(`\n`)}`
            })
            let n = 1
            let items_on_a_page = 5

            const totalPages = Math.ceil(items.length / items_on_a_page)
            let itemsInfo = await divideOnPages(items, items_on_a_page, n)
            let shopForSelMenuInfo = await divideOnPages(shopForSelMenu, items_on_a_page, n)
            let toBuy = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId(`sell_item`)
                        .setMaxValues(1)
                        .setPlaceholder(`Продать товар`)
                        .setOptions(shopForSelMenuInfo)
                )
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
                        .setDisabled(secondPage(totalPages))
                )


            const list = new EmbedBuilder()
                .setTitle(`Список товаров стандартного магазина`)
                .setColor(Number(linksInfo.bot_color))
                .setTimestamp(Date.now())
                .setDescription(`## Доступные товары на продажу
${itemsInfo.join(`\n`)}

❕ Цена указывается с учётом ваших скидок и вдвое меньшая, чем вы бы могли приобрести
Доступно продаж на сегодня: ${userData.upgrades.max_sells - userData.daily.sells}`)
                .setFooter({
                    text: `Страница ${n}/${totalPages}`
                })

            let msg = await interaction.reply({
                embeds: [list],
                components: [toBuy, pages],
                fetchReply: true,
                ephemeral: true
            })

            const collector = msg.createMessageComponentCollector()
            collector.on('collect', async (i) => {
                if (i.customId == `prev`) {
                    n = n - 1
                    if (n <= 1) {
                        pages.components[0].setDisabled(true)
                    } else {
                        pages.components[0].setDisabled(false)
                    }
                    pages.components[1].setDisabled(false)
                    pages.components[2].setDisabled(false)
                    itemsInfo = await divideOnPages(items, items_on_a_page, n)
                    shopForSelMenuInfo = await divideOnPages(shopForSelMenu, items_on_a_page, n)
                    toBuy.components[0].setOptions(shopForSelMenuInfo)
                    list.setTimestamp(Date.now())
                        .setDescription(`## Доступные товары на продажу
${itemsInfo.join(`\n`)}

❕ Цена указывается с учётом ваших скидок и вдвое меньшая, чем вы бы могли приобрести
Доступно продаж на сегодня: ${userData.upgrades.max_sells - userData.daily.sells}`)
                        .setFooter({
                            text: `Страница ${n}/${totalPages}`
                        })
                    await i.deferUpdate()
                    await interaction.editReply({
                        embeds: [list],
                        components: [toBuy, pages],
                        fetchReply: true,
                        ephemeral: true
                    })

                } else if (i.customId == `stop`) {
                    await i.deferUpdate()
                    collector.stop()
                } else if (i.customId == `next`) {
                    n = n + 1
                    if (n >= totalPages) {
                        pages.components[2].setDisabled(true)
                    } else {
                        pages.components[2].setDisabled(false)
                    }
                    pages.components[1].setDisabled(false)
                    pages.components[0].setDisabled(false)
                    itemsInfo = await divideOnPages(items, items_on_a_page, n)
                    shopForSelMenuInfo = await divideOnPages(shopForSelMenu, items_on_a_page, n)
                    toBuy.components[0].setOptions(shopForSelMenuInfo)
                    list.setTimestamp(Date.now())
                        .setDescription(`## Доступные товары на продажу
${itemsInfo.join(`\n`)}

❕ Цена указывается с учётом ваших скидок и вдвое меньшая, чем вы бы могли приобрести
Доступно продаж на сегодня: ${userData.upgrades.max_sells - userData.daily.sells}`)
                        .setFooter({
                            text: `Страница ${n}/${totalPages}`
                        })
                    await i.deferUpdate()
                    await interaction.editReply({
                        embeds: [list],
                        components: [toBuy, pages],
                        fetchReply: true,
                        ephemeral: true
                    })
                } else if (i.customId == `sell_item`) {
                    await i.deferReply({ fetchReply: true, ephemeral: true })
                    let sold = shop[Number(i.values[0])]
                    let price = Math.round((sold.price * guildData.global_settings.shop_prices * userData.shop_costs) / 2)
                    let itemsSold = sold.items.length
                    if (userData.upgrades.max_sells - userData.daily.sells <= 0) return i.editReply({
                        content: `Ваш сегодняшний лимит на продажу товаров ИСЧЕРПАН! Увеличить его вы можете в канале <#1141026403765211136>!`,
                        ephemeral: true
                    })
                    if (userData.rank_number < 9) {
                        for (let item of sold.items) {
                            if (roles.collections.includes(item.id)) return i.editReply({
                                content: `Вы не можете продавать предметы коллекций, так как у вас слишком низкий ранг!`,
                                ephemeral: true
                            })

                        }
                    }

                    let notes = []
                    let a = 1
                    for (let item of sold.items) {
                        if (item.type == `role`) {
                            if (i.member.roles.cache.has(item.id)) {
                                if (item.expire <= 0) {
                                    notes.push(`**${a++}**. <@&${item.id}> был успешно продан!`)
                                    await i.member.roles.remove(item.id)
                                } else {
                                    const temp = await Temp.findOne({
                                        userid: i.user.id,
                                        guildid: i.guild.id,
                                        roleid: item.id
                                    })

                                    if (!temp) {
                                        notes.push(`**${a++}**. Видимо, <@&${item.id}> у вас навсегда, поэтому вы не можете его продать таким образом. Попробуйте другой товар!`)
                                        price -= Math.round(price / sold.items.length)
                                        itemsSold -= 1
                                    } else {
                                        let totalHours = Math.round(item.expire * (userData.perks.temp_items + 1) / (60 * 60))
                                        let leftHours = Math.round((temp.expire.getTime() - (Date.now())) / (1000 * 60 * 60)) // часов осталось
                                        let pricePerHour = ((price / sold.items.length) / totalHours).toFixed(20)
                                        price -= Math.round(((totalHours - leftHours) * pricePerHour))
                                        temp.delete()
                                        notes.push(`**${a++}**. Так как этот предмет \`${item.name}\` временный, то его цена была автоматически посчитана за количество оставшихся часов (${leftHours} ч., ~${Math.round(pricePerHour * leftHours)}<:Rumbik:883638847056003072> получено)`)
                                        await i.member.roles.remove(item.id)
                                    }
                                }

                            } else {
                                let itemInStash = await userData.stacked_items.find(it => it == item.id)
                                if (!itemInStash) {
                                    notes.push(`**${a++}**. У вас нет предмета <@&${item.id}>, поэтому не удалось его продать!`)
                                    price -= Math.round(price / sold.items.length)
                                    itemsSold -= 1
                                } else {
                                    let ID = await userData.stacked_items.findIndex(it => it == item.id)
                                    userData.stacked_items.splice(ID, 1)
                                    notes.push(`**${a++}**. Так как в вашем профиле не было <@&${item.id}>, но он имелся в вашем инвентаре, то он был продан оттуда!`)
                                }
                            }
                        } else if (item.type == `cosmetic`) {
                            switch (item.place) {
                                case `symbol`: {
                                    if (userData.displayname.symbol == item.value) {
                                        userData.displayname.symbol = `👤`
                                    } else {
                                        price -= Math.round(price / sold.items.length)
                                        notes.push(`**${a++}**. Так как у вас не установлен ${item.name} \`${item.value}\`, то за данный предмет вы ничего не получаете!`)
                                        itemsSold -= 1
                                    }
                                }
                                    break;
                                case `ramka`: {
                                    if (userData.displayname.ramka1 == item.values[0] && userData.displayname.ramka2 == item.values[1]) {
                                        userData.displayname.ramka1 = ``
                                        userData.displayname.ramka2 = ``
                                    } else {
                                        price -= Math.round(price / sold.items.length)
                                        notes.push(`**${a++}**. Так как у вас не установлен ${item.name} \`${item.value}\`, то за данный предмет вы ничего не получаете!`)
                                        itemsSold -= 1
                                    }
                                }
                                    break;
                                case `rank`: {
                                    if (userData.displayname.rank == item.value) {
                                        userData.displayname.rank = `❔`
                                        userData.displayname.custom_rank = false
                                    } else {
                                        price -= Math.round(price / sold.items.length)
                                        notes.push(`**${a++}**. Так как у вас не установлен ${item.name} \`${item.value}\`, то за данный предмет вы ничего не получаете!`)
                                        itemsSold -= 1
                                    }
                                }
                                    break;
                                case `suffix`: {
                                    if (userData.displayname.suffix == item.value) {
                                        userData.displayname.suffix = ``
                                    } else {
                                        price -= Math.round(price / sold.items.length)
                                        notes.push(`**${a++}**. Так как у вас не установлен ${item.name} \`${item.value}\`, то за данный предмет вы ничего не получаете!`)
                                        itemsSold -= 1
                                    }
                                }

                                    break;


                                default:
                                    break;
                            }

                            const { rank, ramka1, name, ramka2, suffix, symbol, premium } = userData.displayname;
                            notes.push(`**${a++}**. Ваш никнейм теперь будет выглядеть следующим образом: \`「${rank}」${ramka1}${name}${ramka2}${suffix} ${symbol}┇${premium}\``)
                        } else if (item.type == `booster`) {

                            const temp = await Temp.findOne({
                                userid: i.user.id,
                                guildid: i.guild.id,
                                extraInfo: item.db_code,
                                number: item.multiplier
                            })

                            if (!temp) {
                                notes.push(`**${a++}**. У вас не приобретён \`${item.name}\`, поэтому вы не можете его продать!`)
                                price -= Math.round(price / sold.items.length)
                                itemsSold -= 1
                            } else {
                                let totalHours = Math.round(item.expire * (userData.perks.temp_items + 1) / (60 * 60))
                                let leftHours = Math.round((temp.expire.getTime() - (Date.now())) / (1000 * 60 * 60)) // часов осталось
                                let pricePerHour = ((price / sold.items.length) / totalHours).toFixed(20)
                                price -= Math.round(((totalHours - leftHours) * pricePerHour))
                                temp.delete()
                                notes.push(`**${a++}**. Так как этот предмет \`${item.name}\` временный, то его цена была автоматически посчитана за количество оставшихся часов (${leftHours} ч., ~${Math.round(pricePerHour * leftHours)}<:Rumbik:883638847056003072> получено)`)

                            }

                        }

                        userData.rumbik += price
                        userData.sell.other += 1
                        userData.sell.total_sum += price
                        userData.daily.sells += itemsSold
                        userData.save()
                        await i.editReply({
                            content: `Товар \`${sold.emoji} ${sold.name}\` был успешно продан!
Вы получили ${price}<:Rumbik:883638847056003072>
                        
${notes.length <= 0 ? `Важных заметок нет.` : `**ВАЖНО ЗНАТЬ**: \n${notes.join(`\n`)}`}`,
                            ephemeral: true
                        })
                    }

                    await interaction.editReply({
                        embeds: [list],
                        components: [toBuy, pages],
                        fetchReply: true,
                        ephemeral: true
                    })
                }
            })

            collector.on('end', async (collected) => {
                n = n
                pages.components[0].setDisabled(true)
                pages.components[1].setDisabled(true)
                pages.components[2].setDisabled(true)
                itemsInfo = await divideOnPages(items, items_on_a_page, n)
                shopForSelMenuInfo = await divideOnPages(shopForSelMenu, items_on_a_page, n)
                toBuy.components[0].setOptions(shopForSelMenuInfo)
                toBuy.components[0].setDisabled(true)
                list.setTimestamp(Date.now())
                    .setDescription(`## Доступные товары на продажу
${itemsInfo.join(`\n`)}

❕ Цена указывается с учётом ваших скидок и вдвое меньшая, чем вы бы могли приобрести
Доступно продаж на сегодня: ${userData.upgrades.max_sells - userData.daily.sells}`)
                    .setFooter({
                        text: `Страница ${n}/${totalPages}`
                    })
                await interaction.editReply({
                    embeds: [list],
                    components: [pages],
                    ephemeral: true
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
}
