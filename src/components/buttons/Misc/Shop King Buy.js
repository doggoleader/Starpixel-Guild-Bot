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
        name: "king_buy"
    },
    async execute(interaction, client) {
        try {
            const userData = await User.findOne({ userid: interaction.user.id })
            if (userData.rank_number < 9) return interaction.reply({
                content: `Вы должны быть **императором гильдии** или выше, чтобы приобретать товары в данном магазине!`,
                ephemeral: true
            })
            const guildData = await Guild.findOne({ id: interaction.guild.id })
            const shop = require(`./JSON/KG.json`)
            let shopForSelMenu = []
            let items = shop.map((item, i) => {
                pers_price = Math.round(item.price * guildData.global_settings.shop_prices * userData.king_costs)
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
                        .setCustomId(`buy_item`)
                        .setMaxValues(1)
                        .setPlaceholder(`Приобрести товар`)
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
                .setTitle(`Список товаров королевского магазина`)
                .setColor(Number(linksInfo.bot_color))
                .setTimestamp(Date.now())
                .setDescription(`## Доступные товары
${itemsInfo.join(`\n`)}


\❕ Цена указывается с учётом ваших скидок
Доступно покупок на сегодня: ${userData.upgrades.max_purchases - userData.daily.purchases}`)
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
                        .setDescription(`## Доступные товары
${itemsInfo.join(`\n`)}


\❕ Цена указывается с учётом ваших скидок
Доступно покупок на сегодня: ${userData.upgrades.max_purchases - userData.daily.purchases}`)
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
                        .setDescription(`## Доступные товары
${itemsInfo.join(`\n`)}


\❕ Цена указывается с учётом ваших скидок
Доступно покупок на сегодня: ${userData.upgrades.max_purchases - userData.daily.purchases}`)
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
                } else if (i.customId == `buy_item`) {
                    await i.deferReply({ fetchReply: true, ephemeral: true })
                    let purchased = shop[Number(i.values[0])]
                    let price = Math.round(purchased.price * guildData.global_settings.shop_prices * userData.king_costs)
                    if (userData.upgrades.max_purchases - userData.daily.purchases <= 0) return i.editReply({
                        content: `Ваш сегодняшний лимит на приобретение товаров ИСЧЕРПАН! Увеличить его вы можете в канале <#1141026403765211136>!`,
                        ephemeral: true
                    })
                    if (userData.rank_number < 9) {
                        for (let item of purchased.items) {
                            if (roles.collections.includes(item.id)) return i.editReply({
                                content: `Вы не можете покупать предметы коллекций, так как у вас слишком низкий ранг!`,
                                ephemeral: true
                            })

                        }
                    }
                    if (userData.rumbik < price) return i.editReply({
                        content: `У вас недостаточно румбиков для покупки \`${purchased.emoji} ${purchased.name}\` (необходимо ещё ${price - userData.rumbik}<:Rumbik:883638847056003072>)`
                    })
                    else {
                        let notes = []
                        let a = 1
                        for (let item of purchased.items) {
                            if (item.type == `role`) {
                                if (item.expire <= 0) {
                                    if (item.amount == 1) {
                                        if (interaction.member.roles.cache.has(item.id)) {
                                            if (userData.stacked_items.length < userData.upgrades.inventory_size && item.stackable) {
                                                userData.stacked_items.push(item.id)
                                            } else notes.push(`**${a++}**. <@&${item.id}> - Недостаточно места в инвентаре, товар **сгорел**`)
                                        } else {
                                            await i.member.roles.add(item.id)
                                        }
                                    } else {
                                        let amount = item.amount
                                        notes.push(`**${a++}**. <@&${item.id}> - Так как предмет в наборе не один, он был автоматически перемещён в ваш инвентарь </rewards unclaimed:1055546254240784492>!`)
                                        for (let c = 0; c < amount; c++) {
                                            if (userData.stacked_items.length < userData.upgrades.inventory_size) {
                                                userData.stacked_items.push(item.id)
                                            } else {
                                                notes.push(`**${a++}**. <@&${item.id}> - Недостаточно места в инвентаре, товар **сгорел**`)
                                            }
                                        }
                                    }

                                } else {
                                    if (interaction.member.roles.cache.has(item.id)) {
                                        let temp = await Temp.findOne({
                                            userid: i.user.id,
                                            roleid: item.id
                                        })

                                        if (temp) {
                                            if (temp.expire.getTime() <= Date.now()) temp.expire = Date.now() + (item.expire * 1000 * (userData.perks.temp_items + 1))
                                            else temp.expire = temp.expire.getTime() + (item.expire * 1000 * (userData.perks.temp_items + 1))
                                            temp.save()
                                            notes.push(`**${a++}**. <@&${item.id}> - Действие данного предмета продлено до <t:${Math.round(temp.expire.getTime() / 1000)}:f>`)
                                        } else {
                                            notes.push(`**${a++}**. <@&${item.id}> - Данный предмет сгорел при покупке, так как он уже навсегда вами приобретён`)
                                        }
                                    } else {
                                        let temp = await Temp.findOne({
                                            userid: i.user.id,
                                            roleid: item.id
                                        })

                                        if (temp) {
                                            if (temp.expire.getTime() <= Date.now()) temp.expire = Date.now() + (item.expire * 1000 * (userData.perks.temp_items + 1))
                                            else temp.expire = temp.expire.getTime() + (item.expire * 1000 * (userData.perks.temp_items + 1))
                                            temp.save()
                                            await i.member.roles.add(item.id)
                                            notes.push(`**${a++}**. <@&${item.id}> - Действие данного предмета истечёт <t:${Math.round(temp.expire.getTime() / 1000)}:f>`)
                                        } else {
                                            let newTemp = new Temp({
                                                userid: i.user.id,
                                                guildid: i.guild.id,
                                                roleid: item.id,
                                                expire: Date.now() + (item.expire * 1000 * (userData.perks.temp_items + 1))
                                            })
                                            await i.member.roles.add(item.id)
                                            newTemp.save()
                                            notes.push(`**${a++}**. <@&${item.id}> - Действие данного предмета истечёт <t:${Math.round(newTemp.expire.getTime() / 1000)}:f>`)
                                        }

                                    }
                                }
                            } else if (item.type == `cosmetic`) {
                                switch (item.place) {
                                    case `symbol`: {
                                        if (userData.rank_number < 4) {
                                            notes.push(`**${a++}**. ${item.name} (${item.value}) - Необходим ранг **Чемпион гильдии** или выше для покупки косметического значка! Предмет сгорел.`)
                                        } else userData.displayname.symbol = item.value
                                    }
                                        break;
                                    case `ramka`: {
                                        if (userData.rank_number < 5) {
                                            notes.push(`**${a++}**. ${item.name} (${item.value}) - Необходим ранг **Звёздочка гильдии** или выше для покупки косметического значка! Предмет сгорел.`)
                                        } else {

                                            userData.displayname.ramka1 = item.values[0]
                                            userData.displayname.ramka2 = item.values[1]
                                        }
                                    }
                                        break;
                                    case `rank`: {
                                        if (userData.rank_number < 10) {
                                            notes.push(`**${a++}**. ${item.name} (${item.value}) - Необходим ранг **Повелитель гильдии** или выше для покупки косметического значка! Предмет сгорел.`)
                                        } else {

                                            userData.displayname.rank = item.value
                                            userData.displayname.custom_rank = true
                                        }
                                    }
                                        break;
                                    case `suffix`: {
                                        if (userData.rank_number < 8) {
                                            notes.push(`**${a++}**. ${item.name} (${item.value}) - Необходим ранг **Лорд гильдии** или выше для покупки косметического значка! Предмет сгорел.`)
                                        } else userData.displayname.suffix = item.value
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

                                if (temp) {
                                    temp.expire = temp.expire.getTime() + (item.expire * 1000 * (userData.perks.temp_items + 1))
                                    temp.save()
                                    notes.push(`**${a++}**. Так как у вас уже имеется данный ускоритель, то время его действия было продлено! Его действие истечёт <t:${Math.round(temp.expire.getTime() / 1000)}:f>!`)
                                } else {
                                    const newTemp = new Temp({
                                        userid: i.user.id,
                                        guildid: i.guild.id,
                                        extraInfo: item.db_code,
                                        number: item.multiplier,
                                        expire: Date.now() + (item.expire * 1000 * (userData.perks.temp_items + 1))
                                    })
                                    newTemp.save()
                                    notes.push(`**${a++}**. Ускоритель был успешно приобретён! Скоро его действие будет применено! Ускоритель истечёт <t:${Math.round(newTemp.expire.getTime() / 1000)}:f>!`)
                                }
                                client.Discounts();
                            }
                        }
                        userData.rumbik -= price
                        userData.buys.king += 1
                        userData.buys.total_sum += price
                        userData.daily.purchases += 1
                        userData.save()
                        await i.editReply({
                            content: `Товар \`${purchased.emoji} ${purchased.name}\` был успешно приобретён!
                        
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
                    .setDescription(`## Доступные товары
${itemsInfo.join(`\n`)}


\❕ Цена указывается с учётом ваших скидок
Доступно покупок на сегодня: ${userData.upgrades.max_purchases - userData.daily.purchases}`)
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
