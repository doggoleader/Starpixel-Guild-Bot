const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ComponentType } = require('discord.js');

const wait = require('node:timers/promises').setTimeout;
const { User } = require(`../../schemas/userdata`);
const chalk = require(`chalk`);
const ch_list = require(`../../discord structure/channels.json`)
const linksInfo = require(`../../discord structure/links.json`)

async function Big(interaction, client) {
    try {
        const { Guild } = require(`../../schemas/guilddata`)
        const guildData = await Guild.findOne({ id: interaction.guild.id })
        const user = interaction.member.user //ДОБАВИТЬ В ДРУГИЕ
        const userData = await User.findOne({ userid: user.id })




        const { roles } = interaction.member //Участник команды
        const role = await interaction.guild.roles  //Постоянная для role
            .fetch("521248091853291540") //ID коробки
            .catch(console.error);
        if (roles.cache.has("521248091853291540") || roles.cache.has("567689925143822346")) { //Проверка роли коробки || правления
            await interaction.deferUpdate()
            const cmd_name = `big` //Название команды
            const timestamp = Math.round(interaction.createdTimestamp / 1000)
            const opener = interaction.member.id;
            await roles.remove(role).catch(console.error); //Удалить роль коробки

            //Лут из коробок
            //Случайный предмет
            //name - Название предмета
            //chance - Шанс выпадения предмета
            //roleID - ID роли, которая связана с данным лутом.

            //Опыт рангов (если необходимо)
            let { rank_exp, act_exp, loot, cosmetic } = require(`./Box loot/big.json`)

            //Рандом - опыт рангов
            let sum_rank = 0;
            for (let i_rank = 0; i_rank < rank_exp.length; i_rank++) {
                sum_rank += rank_exp[i_rank].chance;
            }
            let r_rank = Math.floor(Math.random() * sum_rank);
            let i_rank = 0;
            for (let s = rank_exp[0].chance; s <= r_rank; s += rank_exp[i_rank].chance) {
                i_rank++;
            }

            //Сообщение - опыт рангов  
            let formula_rank = rank_exp[i_rank].rank_amount * userData.pers_rank_boost + Math.round(rank_exp[i_rank].rank_amount * userData.perks.rank_boost * 0.05)
            interaction.guild.channels.cache.get(ch_list.rank).send(
                `╔═════════♡════════╗
<@${opener}> +${formula_rank}💠
\`Получено из большой коробки.\`
╚═════════♡════════╝`
            );
            userData.rank += formula_rank

            //Рандом - опыт активности
            let sum_act = 0;
            for (let i_act = 0; i_act < act_exp.length; i_act++) {
                sum_act += act_exp[i_act].chance;
            }
            let r_act = Math.floor(Math.random() * sum_act);
            let i_act = 0;
            for (let s = act_exp[0].chance; s <= r_act; s += act_exp[i_act].chance) {
                i_act++;
            }

            let actExp = act_exp[i_act].act_amount * userData.pers_act_boost * guildData.act_exp_boost
            interaction.guild.channels.cache.get(ch_list.act).send(
                `╔═════════♡════════╗
<@${opener}> +${actExp}🌀
\`Получено из большой коробки.\`
╚═════════♡════════╝`
            );
            userData.exp += actExp //ДОБАВИТЬ В ДРУГИЕ

            userData.save();
            client.ActExp(userData.userid)

            //рандом предметов
            let chances = []
            let sum_loot = 0;
            for (let i_loot = 0; i_loot < loot.length; i_loot++) {
                if (loot[i_loot].rarity == "Common") {
                    sum_loot += loot[i_loot].chance * userData.box_chances.common
                    chances.push(loot[i_loot].chance * userData.box_chances.common)
                } else if (loot[i_loot].rarity == "Uncommon") {
                    sum_loot += loot[i_loot].chance * userData.box_chances.uncommon
                    chances.push(loot[i_loot].chance * userData.box_chances.uncommon)
                } else if (loot[i_loot].rarity == "Rare") {
                    sum_loot += loot[i_loot].chance * userData.box_chances.rare
                    chances.push(loot[i_loot].chance * userData.box_chances.rare)
                } else if (loot[i_loot].rarity == "Epic") {
                    sum_loot += loot[i_loot].chance * userData.box_chances.epic
                    chances.push(loot[i_loot].chance * userData.box_chances.epic)
                } else if (loot[i_loot].rarity == "Legendary") {
                    sum_loot += loot[i_loot].chance * userData.box_chances.legendary
                    chances.push(loot[i_loot].chance * userData.box_chances.legendary)
                } else if (loot[i_loot].rarity == "Mythical") {
                    sum_loot += loot[i_loot].chance * userData.box_chances.mythical
                    chances.push(loot[i_loot].chance * userData.box_chances.mythical)
                } else if (loot[i_loot].rarity == "RNG") {
                    sum_loot += loot[i_loot].chance * userData.box_chances.RNG
                    chances.push(loot[i_loot].chance * userData.box_chances.RNG)
                } else {
                    sum_loot += loot[i_loot].chance * 1
                    chances.push(loot[i_loot].chance * 1)
                    console.log(`Предмет ${loot[i_loot].loot_name} имеет неправильное отображение редкости!`)
                }
            }
            let r_loot = Math.floor(Math.random() * sum_loot);
            let i_loot = 0;
            for (let s = chances[0]; s <= r_loot; s += chances[i_loot]) {
                i_loot++;
            }
            let allChances = 0;
            for (let loo of loot) {
                allChances += loo.chance
            }
            let finalChance1 = ((loot[i_loot].chance / allChances) * 100).toFixed(1)

            //рандом предметов
            let sum_cosmetic = 0;
            for (let i_cosmetic = 0; i_cosmetic < cosmetic.length; i_cosmetic++) {
                sum_cosmetic += cosmetic[i_cosmetic].chance;
            }
            let r_cosmetic = Math.floor(Math.random() * sum_cosmetic);
            let i_cosmetic = 0;
            for (let s = cosmetic[0].chance; s <= r_cosmetic; s += cosmetic[i_cosmetic].chance) {
                i_cosmetic++;
            }
            const before = await interaction.member.roles.cache.has(loot[i_loot].loot_roleID)

            //Отправка сообщения о луте    
            let r_loot_msg
            const boxes = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('boxes')
                        .setLabel('Установить')
                        .setStyle(ButtonStyle.Success)
                        .setEmoji(`⬆️`)
                        .setDisabled(false)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`changeitem`)
                        .setLabel(`Изменить предмет`)
                        .setEmoji(`✨`)
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(true)
                )
            if (cosmetic[i_cosmetic].loot_name == `Отсутствует.`) {
                boxes.components[0].setDisabled(true)
            }
            r_loot_msg = await interaction.guild.channels.cache.get(ch_list.box)
                .send({
                    content: `◾
<@${opener}> открывает большую коробку от гильдии.
╭═────═⌘═────═╮
\`${loot[i_loot].loot_name}\` (Шанс: \`${finalChance1}%\`)
${loot[i_loot].loot_description}
╰═────═⌘═────═╯
Дополнительная косметическая награда из большой коробки: \`${cosmetic[i_cosmetic].loot_name}\`
${cosmetic[i_cosmetic].loot_description}
◾`,
                    components: [boxes]
                });
            if (loot[i_loot].type == "Box" || userData.perks.store_items !== 0) {
                if (!roles.cache.has(loot[i_loot].loot_roleID) && loot[i_loot].loot_name != `Награды нет.` || !roles.cache.has(loot[i_loot].loot_roleID) && loot[i_loot].loot_name == `Награды нет.` && roles.cache.has("597746051998285834")) {
                    await roles.add(loot[i_loot].loot_roleID).catch(console.error);
                    await r_loot_msg.react("✅")
                } else {
                    if (loot[i_loot].loot_name == `Награды нет.` && !roles.cache.has("597746051998285834") || roles.cache.has(loot[i_loot].loot_roleID)) {
                        if (userData.stacked_items.length < userData.upgrades.inventory_size) {
                            await userData.stacked_items.push(loot[i_loot].loot_roleID)
                            await r_loot_msg.react("✅")
                        } else {
                            await interaction.guild.channels.cache.get(ch_list.box).send({
                                content: `Мы не можем добавить предмет в ваш инвентарь, так как он переполнен. Чтобы увеличить вместительность своего инвентаря, перейдите в канал <#1141026403765211136>!`
                            })
                            await r_loot_msg.react("🚫")
                        }
                    };
                };
            } else {
                if (!roles.cache.has(loot[i_loot].loot_roleID) && loot[i_loot].loot_name != `Награды нет.` || !roles.cache.has(loot[i_loot].loot_roleID) && loot[i_loot].loot_name == `Награды нет.` && roles.cache.has("597746051998285834")) {
                    await roles.add(loot[i_loot].loot_roleID).catch(console.error);
                    await r_loot_msg.react("✅")
                } else {
                    if (loot[i_loot].loot_name == `Награды нет.` && !roles.cache.has("597746051998285834") || roles.cache.has(loot[i_loot].loot_roleID)) {
                        await r_loot_msg.react("🚫")
                    };
                };
            }

            const filter = (i) => (i.user.id == interaction.user.id && i.customId === 'boxes');

            const coll1 = r_loot_msg.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 60000 })

            coll1.on('collect', async (i) => {
                if (i.user.id === interaction.member.user.id) {
                    if (cosmetic[i_cosmetic].loot_name.startsWith(`КОСМЕТИЧЕСКИЙ ЭМОДЗИ`) && userData.rank_number >= 4) {
                        userData.displayname.symbol = cosmetic[i_cosmetic].symbol
                        userData.save()
                        await boxes.components[0]
                            .setDisabled(true)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🕓`)
                            .setLabel(`Идёт обработка...`)
                        i.reply({
                            content: `Ожидайте! Скоро ваш значок будет установлен! Если этого не произойдет в течение 15 минут, обратитесь в вопрос-модерам!`,
                            ephemeral: true
                        })
                    }

                    else if (cosmetic[i_cosmetic].loot_name.startsWith(`РАМКА ДЛЯ НИКА`) && userData.rank_number >= 5) {
                        userData.displayname.ramka1 = cosmetic[i_cosmetic].symbol
                        userData.displayname.ramka2 = cosmetic[i_cosmetic].symbol
                        userData.save()
                        await boxes.components[0]
                            .setDisabled(true)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`🕓`)
                            .setLabel(`Идёт обработка...`)
                        i.reply({
                            content: `Ожидайте! Скоро ваша рамка будет установлена! Если этого не произойдет в течение 15 минут, обратитесь в вопрос-модерам!`,
                            ephemeral: true
                        })

                    } else {
                        i.reply({
                            content: `Вы не можете установить себе данный предмет, так как не получили минимальный ранг. Посмотреть минимальный ранг для данного действия вы можете в канале <#931620901882068992>!`,
                            ephemeral: true
                        })
                        await boxes.components[0]
                            .setDisabled(true)
                            .setStyle(ButtonStyle.Secondary)
                            .setEmoji(`❌`)
                            .setLabel(`Низкий ранг`)
                    }

                    await r_loot_msg.edit({
                        components: [boxes]
                    })

                } else {
                    i.reply({ content: `Вы не можете использовать данную кнопочку!`, ephemeral: true });
                }
            })
            coll1.on('end', async (err) => {
                await boxes.components[0]
                    .setDisabled(true)
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel(`Отменено`)
                    .setEmoji(`❌`)

                await r_loot_msg.edit({
                    components: [boxes]
                })
            });

            if (before == true && userData.perks.change_items >= 1 && loot[i_loot].loot_name !== "Награды нет.") {
                boxes.components[1].setDisabled(false)

                await r_loot_msg.edit({
                    content: `◾
<@${opener}> открывает большую коробку от гильдии.
╭═────═⌘═────═╮
\`${loot[i_loot].loot_name}\` (Шанс: \`${finalChance1}%\`)
${loot[i_loot].loot_description}
╰═────═⌘═────═╯
Дополнительная косметическая награда из большой коробки: \`${cosmetic[i_cosmetic].loot_name}\`
${cosmetic[i_cosmetic].loot_description}
◾
У вас есть перк \`✨ Изменение предметов\`, поэтому вы можете попытать удачу и изменить этот предмет, нажав на кнопку в течение следующих 60 секунд!`,
                    components: [boxes]
                })

                const filter = (i) => (i.user.id == interaction.user.id && i.customId == `changeitem`)
                const collector = r_loot_msg.createMessageComponentCollector({
                    filter,
                    time: 60000,
                    max: 1
                })
                collector.on('collect', async (int) => {
                    await int.deferUpdate()
                    let list = await loot.filter(item => item.type == loot[i_loot].type && item.rarity == loot[i_loot].rarity && item.loot_name !== loot[i_loot].loot_name)
                    let sum = 0;
                    for (let i_loot = 0; i_loot < list.length; i_loot++) {
                        sum += list[i_loot].chance;
                    }
                    let r = Math.floor(Math.random() * sum);
                    let i = 0;
                    for (let s = list[0].chance; s <= r; s += list[i].chance) {
                        i++;
                    }
                    if (interaction.member.roles.cache.has(list[i].loot_roleID)) {
                        await r_loot_msg.react(`✨`)
                        await r_loot_msg.react(`➡`)
                        await r_loot_msg.react(`🛑`)
                    } else if (!interaction.member.roles.cache.has(list[i].loot_roleID)) {
                        await r_loot_msg.react(`✨`)
                        await r_loot_msg.react(`➡`)
                        await r_loot_msg.react(`💚`)
                        await interaction.member.roles.add(list[i].loot_roleID)
                    }
                    boxes.components[1].setDisabled(true)
                    finalChance1 = ((list[i].chance / allChances) * 100).toFixed(1)
                    await r_loot_msg.edit({
                        content: `◾
<@${opener}> открывает большую коробку от гильдии.
╭═────═⌘═────═╮
\`${list[i].loot_name}\` (Шанс: \`${finalChance1}%\`)
${list[i].loot_description}
╰═────═⌘═────═╯
Дополнительная косметическая награда из большой коробки: \`${cosmetic[i_cosmetic].loot_name}\`
${cosmetic[i_cosmetic].loot_description}
◾
~~У вас есть перк \`✨ Изменение предметов\`, поэтому вы можете попытать удачу и изменить этот предмет, нажав на кнопку в течение следующих 60 секунд!~~`,
                        components: [boxes]
                    })
                })

                collector.on('end', async (err) => {
                    boxes.components[1].setDisabled(true)
                    await r_loot_msg.edit({
                        components: [boxes]
                    })
                })
            }




            console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magentaBright(`[${interaction.user.tag} открыл большую коробку]`) + chalk.gray(`: +${act_exp[i_act].act_amount} опыта активности, +${rank_exp[i_rank].rank_amount} опыта рангов, ${loot[i_loot].loot_name} и ${cosmetic[i_cosmetic].loot_name}`))

        } else {
            await interaction.reply({
                content: `У вас отсутствует \`${role.name}\` коробка!`,
                ephemeral: true
            })
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
module.exports = {
    category: `box`,
    plugin: `info`,
    Big
};