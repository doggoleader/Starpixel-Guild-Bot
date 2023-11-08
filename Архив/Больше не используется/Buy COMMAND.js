const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { execute } = require('../../src/events/client/start_bot/ready');
const linksInfo = require(`../../src/discord structure/links.json`)
const { Temp } = require(`../../src/schemas/temp_items`)
const { Guild } = require(`../../src/schemas/guilddata`);
const { User } = require('../../src/schemas/userdata');
const { rankName, changeProperty } = require('../../src/functions');
const chalk = require('chalk');
const wait = require(`node:timers/promises`).setTimeout

module.exports = {
    category: `shop`,
    plugin: `info`,
    data: new SlashCommandBuilder()
        .setName(`buy`)
        .setDescription(`Купить предмет в магазине гильдии`)
        .setDMPermission(false)
        .addStringOption(option => option
            .setName(`код`)
            .setDescription(`Код предмета, который вы хотите купить`)
            .setRequired(true)
            .setAutocomplete(true)
        ),

    async autoComplete(interaction, client) {
        const focusedValue = interaction.options.getFocused();
        const guildData = await Guild.findOne({ id: interaction.guild.id })
        const userData = await User.findOne({ userid: interaction.user.id, guildid: interaction.guild.id })
        const choices = [];
        guildData.shop.forEach(sh => choices.push({
            code: sh.code,
            price: sh.price
        }
        ))
        const sh = []
        const ac = []
        const kg = []
        for (let ch of choices) {
            if (ch.code.startsWith(`KG`)) {
                kg.push(ch)
            } else if (ch.code.startsWith(`SH`)) {
                sh.push(ch)
            } else if (ch.code.startsWith(`AC`)) {
                ac.push(ch)
            }
        }

        const sorted = sh.sort((a, b) => a.code.localeCompare(b.code)).concat(ac.sort((a, b) => a.code.localeCompare(b.code)), kg.sort((a, b) => a.code.localeCompare(b.code)))
        const filtered = sorted.filter(choice => choice.code.toLowerCase().includes(focusedValue.toLowerCase())).slice(0, 25);
        return interaction.respond([{ name: `Магазин гильдии закрыт!`, value: `Магазин гильдии закрыт!`}])
        await interaction.respond(
            filtered.map(choice => {
                let price = choice.price
                let currency
                if (choice.code.startsWith(`KG`)) {
                    price = Math.round(choice.price * userData.king_costs)
                    currency = `румбиков`
                } else if (choice.code.startsWith(`SH`)) {
                    price = Math.round(choice.price * userData.shop_costs)
                    currency = `румбиков`
                } else if (choice.code.startsWith(`AC`)) {
                    price = Math.round(choice.price * userData.act_costs)
                    currency = `билетов`
                }
                return ({ name: `${choice.code} - ${price} ${currency}`, value: choice.code })
            })
        );
    },


    async execute(interaction, client) {
        return interaction.reply({
            content: `Магазин гильдии временно закрыт. Покупка предметов недоступна!`,
            ephemeral: true
        })
        try {
            await interaction.deferReply({
                fetchReply: true,
                ephemeral: true
            })
            const guildData = await Guild.findOne({ id: interaction.guild.id })
            if (guildData.plugins.items === false) return interaction.editReply({ content: `Данный плагин отключён! Попробуйте позже!`, ephemeral: true })

            const userData = await User.findOne({ userid: interaction.user.id, guildid: interaction.guild.id })

            const item = interaction.options.getString(`код`)
            let currency
            let cur_code
            if (item.startsWith(`KG`) && userData.rank < 9) return interaction.editReply({
                content: `Вы не можете покупать предметы в данном магазине, так как у вас нет ранга \`${rankName(9)}\`!`
            })
            if (item.startsWith(`AC`) && userData.rank < 5) return interaction.editReply({
                content: `Вы не можете покупать предметы в данном магазине, так как у вас нет ранга \`${rankName(5)}\`!`
            })
            if (item.startsWith(`SH`) && userData.rank < 3) return interaction.editReply({
                content: `Вы не можете покупать предметы в данном магазине, так как у вас нет ранга \`${rankName(3)}\`!`
            })

            if (item.startsWith(`KG`)) {
                currency = `<:Rumbik:883638847056003072>`
                cur_code = userData.rumbik
            } else if (item.startsWith(`SH`)) {
                currency = `<:Rumbik:883638847056003072>`
                cur_code = userData.rumbik
            } else if (item.startsWith(`AC`)) {
                currency = `🏷`
                cur_code = userData.tickets
            }


            const itemInShop = await guildData.shop.find(sh => sh.code == item)
            if (!itemInShop) return interaction.editReply({
                content: `Предмет в данным кодом не найден!`,
                ephemeral: true
            })
            let price = itemInShop.price
            if (itemInShop.shop_type == `AC` && userData.rank_number < 5) return interaction.editReply({
                content: `Вы не можете покупать товары в этом магазине!`,
                ephemeral: true
            })
            else if (itemInShop.shop_type == `SH` && userData.rank_number < 3) return interaction.editReply({
                content: `Вы не можете покупать товары в этом магазине!`,
                ephemeral: true
            })
            else if (itemInShop.shop_type == `KG` && userData.rank_number < 9) return interaction.editReply({
                content: `Вы не можете покупать товары в этом магазине!`,
                ephemeral: true
            })
            if (!itemInShop) return interaction.editReply({
                content: `Данного товара нет в магазине! Проверьте введённый вами код.`,
                ephemeral: true
            })
            if (itemInShop.name.includes(`🔺 Персональный ускоритель`) && userData.rank_number < 8) return interaction.editReply({
                content: `Вы не можете покупать ускорители, так как у вас слишком низкий ранг!`,
                ephemeral: true
            })
            if ((itemInShop.name.includes(`КОЛЬЦО`) || itemInShop.name.includes(`БРАСЛЕТ`) || itemInShop.name.includes(`ОЖЕРЕЛЬЕ`)) && userData.rank_number < 9) return interaction.editReply({
                content: `Вы не можете покупать предметы коллекций, так как у вас слишком низкий ранг!`,
                ephemeral: true
            })
            if (itemInShop.code.startsWith(`KG`)) {
                price = Math.round(itemInShop.price * userData.king_costs)
                if (cur_code < price) return interaction.editReply({
                    content: `У вас недостаточно ${currency}, чтобы купить данный предмет! Вам необходимо ${price}${currency}, чтобы купить его.`,
                    ephemeral: true
                })
                userData.rumbik -= price
                userData.buys.king += 1
                userData.buys.total_sum += price
            } else if (itemInShop.code.startsWith(`SH`)) {
                price = Math.round(itemInShop.price * userData.shop_costs)
                if (cur_code < price) return interaction.editReply({
                    content: `У вас недостаточно ${currency}, чтобы купить данный предмет! Вам необходимо ${price}${currency}, чтобы купить его.`,
                    ephemeral: true
                })
                userData.rumbik -= price
                userData.buys.normal += 1
                userData.buys.total_sum += price
            } else if (itemInShop.code.startsWith(`AC`)) {
                price = Math.round(itemInShop.price * userData.act_costs)
                if (cur_code < price) return interaction.editReply({
                    content: `У вас недостаточно ${currency}, чтобы купить данный предмет! Вам необходимо ${price}${currency}, чтобы купить его.`,
                    ephemeral: true
                })
                userData.tickets -= price
                userData.buys.activity += 1
                userData.buys.total_tickets += price
            }
            if (itemInShop.type == `Role`) {
                for (let addItem of itemInShop.roleid) {
                    if (addItem?.id == `850336260265476096`) {
                        if (interaction.member.roles.cache.has(addItem.id)) {
                            const temp = await Temp.findOne({
                                guildid: interaction.guild.id,
                                userid: interaction.user.id,
                                roleid: addItem.id,
                            })
                            if (temp) {
                                /* console.log(chalk.red(`[ПРЕДМЕТ НЕ БЫЛ ПРИОБРЕТЁН]`) + chalk.white(`: ${interaction.member.user.username} не смог приобрести предмет с ID ${addItem.id}, так как у него уже есть этот предмет!`)) */
                                let oldVal = temp.expire.getTime()
                                temp.expire = oldVal + (addItem.expire * (userData.perks.temp_items + 1))
                                temp.save()
                            } else if (!temp) {
                                let expire
                                if (addItem?.expire > 0) expire = addItem?.expire
                                const newTemp = new Temp({
                                    guildid: interaction.guild.id,
                                    userid: interaction.user.id,
                                    roleid: addItem.id,
                                    expire: Date.now() + (expire * (userData.perks.temp_items + 1))
                                })
                                newTemp.save()
                            }
                            await interaction.member.roles.add(addItem.id)
                        } else {
                            const temp = await Temp.findOne({
                                guildid: interaction.guild.id,
                                userid: interaction.user.id,
                                roleid: addItem.id,
                            })
                            if (temp) {
                                /* console.log(chalk.red(`[ПРЕДМЕТ НЕ БЫЛ ПРИОБРЕТЁН]`) + chalk.white(`: ${interaction.member.user.username} не смог приобрести предмет с ID ${addItem.id}, так как у него уже есть этот предмет!`)) */
                                let oldVal = temp.expire.getTime()
                                temp.expire = oldVal + (addItem.expire * (userData.perks.temp_items + 1))
                                temp.save()
                            } else if (!temp) {
                                let expire
                                if (addItem?.expire > 0) expire = addItem?.expire
                                const newTemp = new Temp({
                                    guildid: interaction.guild.id,
                                    userid: interaction.user.id,
                                    roleid: addItem.id,
                                    expire: Date.now() + (expire * (userData.perks.temp_items + 1))
                                })
                                newTemp.save()
                            }
                            await interaction.member.roles.add(addItem.id)
                        }
                    } else if (!interaction.member.roles.cache.has(addItem.id) && addItem?.id !== `850336260265476096` && addItem?.id !== `1020400022350725122` && addItem?.id !== `1020400026045915167` && addItem?.id !== `1020400024397565962` && addItem?.id !== `1020400055812886529` && addItem?.id !== `1020400060636344440` && addItem?.id !== `1020400058543374388`) {
                        await interaction.member.roles.add(addItem.id)
                        if (addItem?.expire > 0 && !interaction.member.roles.cache.has(`780487592540897349`)) {
                            const newItem = new Temp({
                                guildid: interaction.guild.id,
                                userid: interaction.user.id,
                                roleid: addItem.id,
                                expire: Date.now() + (addItem.expire * (userData.perks.temp_items + 1))
                            })
                            newItem.save()
                        }
                        await wait(500)
                    } else if (interaction.member.roles.cache.has(addItem.id) && addItem?.id !== `850336260265476096` && addItem?.expire == 0 && addItem?.id !== `1020400022350725122` && addItem?.id !== `1020400026045915167` && addItem?.id !== `1020400024397565962` && addItem?.id !== `1020400055812886529` && addItem?.id !== `1020400060636344440` && addItem?.id !== `1020400058543374388`) {
                        userData.stacked_items.push(addItem.id)
                    } else if (interaction.member.roles.cache.has(addItem.id) && addItem?.id !== `850336260265476096` && addItem?.expire > 0 && addItem?.id !== `1020400022350725122` && addItem?.id !== `1020400026045915167` && addItem?.id !== `1020400024397565962` && addItem?.id !== `1020400055812886529` && addItem?.id !== `1020400060636344440` && addItem?.id !== `1020400058543374388`) {
                        const temp = await Temp.findOne({
                            guildid: interaction.guild.id,
                            userid: interaction.user.id,
                            roleid: addItem.id,
                        })
                        if (temp) {
                            let oldVal = temp.expire.getTime()
                            temp.expire = oldVal + (addItem.expire * (userData.perks.temp_items + 1))
                            temp.save()
                        } else if (!temp) {
                            let expire
                            if (addItem?.expire > 0) expire = addItem?.expire
                            const newTemp = new Temp({
                                guildid: interaction.guild.id,
                                userid: interaction.user.id,
                                roleid: addItem.id,
                                expire: Date.now() + (addItem.expire * (userData.perks.temp_items + 1))
                            })
                            newTemp.save()
                        }
                    } else if (addItem?.id == `1020400022350725122` || addItem?.id == `1020400026045915167` || addItem?.id == `1020400024397565962` || addItem?.id == `1020400055812886529` || addItem?.id == `1020400060636344440` || addItem?.id == `1020400058543374388` && userData.rank_number >= 9) {
                        await interaction.member.roles.add(addItem?.id)
                    }
                }
            } else if (itemInShop.type == `Static`) {
                for (let addItem of itemInShop.static_items_code) {
                    await changeProperty(userData, addItem.name, addItem.value)

                    if (addItem.expire > 0) {
                        const temp = await Temp.findOne({
                            guildid: interaction.guild.id,
                            userid: interaction.user.id,
                            extraInfo: addItem.id,
                            number: addItem.value,
                        })
                        if (!temp) {
                            const newTemp = new Temp({
                                guildid: interaction.guild.id,
                                userid: interaction.user.id,
                                extraInfo: addItem.id,
                                number: addItem.value,
                                expire: Date.now() + (addItem.expire * (userData.perks.temp_items + 1))
                            })
                            newTemp.save()
                        } else if (temp) {
                            let oldVal = temp.expire.getTime()
                            temp.expire = oldVal + (addItem.expire * (userData.perks.temp_items + 1))
                            temp.save()
                        }
                    }
                }
            }
            userData.save()
            await interaction.editReply({
                content: `Вы приобрели \`${itemInShop.name}\` за ${price}${currency}!`,
                ephemeral: true
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