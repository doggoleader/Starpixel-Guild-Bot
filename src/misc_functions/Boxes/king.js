const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } = require('discord.js');

const wait = require('node:timers/promises').setTimeout;
const { User } = require(`../../schemas/userdata`);
const { Temp } = require(`../../schemas/temp_items`);
const chalk = require(`chalk`);
const ch_list = require(`../../discord structure/channels.json`)
    ;

async function King(interaction, client) {
    try {
        const { Guild } = require(`../../schemas/guilddata`)
        const guildData = await Guild.findOne({ id: interaction.guild.id })
        const user = interaction.member.user //ДОБАВИТЬ В ДРУГИЕ
        const userData = await User.findOne({ userid: user.id })


        const timestamp = Math.round(interaction.createdTimestamp / 1000)
        const opener = interaction.member.id;
        const cmd_name = `king` //Название команды
        const { roles } = interaction.member //Участник команды

        const role = await interaction.guild.roles  //Постоянная для role
            .fetch("584673040470769667") //ID коробки
            .catch(console.error);
        if (roles.cache.has("584673040470769667") || roles.cache.has("567689925143822346")) { //Проверка роли коробки || правления

            await roles.remove(role).catch(console.error); //Удалить роль коробки
            await interaction.deferUpdate()
            //Лут из коробок
            //Случайный предмет
            //name - Название предмета
            //dropChanceLOOT - Шанс выпадения предмета
            //roleID - ID роли, которая связана с данным лутом.

            let { loot, cosmetic, rank_exp, act_exp, rumbik } = require(`./Box loot/king.json`)
            //Опыт рангов (если необходимо)


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
            let formula_rank = rank_exp[i_rank].amount * userData.pers_rank_boost + Math.round(rank_exp[i_rank].amount * userData.perks.rank_boost * 0.05)
            userData.rank += formula_rank
            interaction.guild.channels.cache.get(ch_list.rank).send(
                `╔═════════♡════════╗
<@${opener}> +${formula_rank}💠
\`Получено из королевской коробки.\`
╚═════════♡════════╝`
            ); //ДОБАВИТЬ В ДРУГИЕ


            //Опыт активности

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

            let actExp = act_exp[i_act].amount * userData.pers_act_boost * guildData.act_exp_boost
            interaction.guild.channels.cache.get(ch_list.act).send(
                `╔═════════♡════════╗
<@${opener}> +${actExp}🌀
\`Получено из королевской коробки.\`
╚═════════♡════════╝`
            );

            userData.exp += actExp //ДОБАВИТЬ В ДРУГИЕ

            let sum_rumb = 0;
            for (let i_rumb = 0; i_rumb < rumbik.length; i_rumb++) {
                sum_rumb += rumbik[i_rumb].chance;
            }
            let r_rumbik = Math.floor(Math.random() * sum_rumb);
            let i_rumb = 0;
            for (let s = rumbik[0].chance; s <= r_rumbik; s += rumbik[i_rumb].chance) {
                i_rumb++;
            }
            let rumb_amount = rumbik[i_rumb].amount * userData.pers_rumb_boost
            //Сообщение - румбики                       
            interaction.guild.channels.cache.get(ch_list.rumb).send(
                `╔═════════♡════════╗
${interaction.member} +${rumb_amount}<:Rumbik:883638847056003072>
\`Получено из королевской коробки.\`
╚═════════♡════════╝`
            );
            if (userData.rank_number >= 3) {
                userData.rumbik += rumb_amount
                userData.progress.items.find(it => it.name == 'RUMBIKS_TOTAL').total_items += rumb_amount
            } else {

                userData.rumbik += 0
            }
            //Список предметов

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
                    console.log(`Предмет ${loot[i_loot].name} имеет неправильное отображение редкости!`)
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

            //Лут 2

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

            const r_loot_msg = await interaction.guild.channels.cache.get(ch_list.box)
                .send({
                    content: `◾ :crown: ◾
<@${opener}> открывает королевскую коробку гильдии...
╔━═━═━︽︾♚︾︽━═━═━╗
\`${loot[i_loot].name}\` (Шанс: \`${finalChance1}%\`)
${loot[i_loot].loot_description}.
╚━═━═━︾︽♔︽︾━═━═━╝
◾ :crown: ◾
Дополнительная косметическая награда из королевской коробки: \`${cosmetic[i_cosmetic].name}\`
${cosmetic[i_cosmetic].cosmetic_description}`
                });


            if (loot[i_loot].type == "Color") {
                if (userData.rank_number < 6) {
                    await r_loot_msg.reply({
                        content: `Вы должны быть **Легендой гильдии**, чтобы получать цвета из коробок!`
                    })
                    await r_loot_msg.react("🚫")
                } else {
                    if (!userData.cosmetics_storage.colors.includes(loot[i_loot].loot_roleID)) {
                        userData.cosmetics_storage.colors.push(loot[i_loot].loot_roleID)
                        await r_loot_msg.react("✅")
                    } else {
                        await r_loot_msg.react("🚫")
                    }
                }
            } else if (loot[i_loot].type == "Box" || userData.perks.store_items !== 0) {
                if (!roles.cache.has(loot[i_loot].loot_roleID)) {
                    if (loot[i_loot].name == `💳 Подписка VIP на 7 дней`) {
                        await roles.add(loot[i_loot].loot_roleID).catch();
                        await r_loot_msg.react("✅")
                        const tempItems = new Temp({
                            userid: user.id,
                            guildid: interaction.guild.id,
                            roleid: loot[i_loot].loot_roleID,
                            expire: Date.now() + (1000 * 60 * 60 * 24 * 7 * (userData.perks.temp_items + 1))
                        })
                        tempItems.save()

                    } else {
                        await roles.add(loot[i_loot].loot_roleID).catch(console.error);
                        await r_loot_msg.react("✅")
                    }
                } else {
                    if (userData.stacked_items.length < userData.upgrades.inventory_size) {
                        await userData.stacked_items.push(loot[i_loot].loot_roleID)
                        await r_loot_msg.react("✅")
                    } else {
                        await interaction.guild.channels.cache.get(ch_list.box).send({
                            content: `Мы не можем добавить предмет в ваш инвентарь, так как он переполнен. Чтобы увеличить вместительность своего инвентаря, перейдите в канал <#1141026403765211136>!`
                        })
                        await r_loot_msg.react("🚫")
                    }
                }
            } else {
                if (!roles.cache.has(loot[i_loot].loot_roleID)) {
                    if (loot[i_loot].name == `💳 Подписка VIP на 7 дней`) {
                        await roles.add(loot[i_loot].loot_roleID).catch();
                        await r_loot_msg.react("✅")
                        const tempItems = new Temp({
                            userid: user.id,
                            guildid: interaction.guild.id,
                            roleid: loot[i_loot].loot_roleID,
                            expire: Date.now() + (1000 * 60 * 60 * 24 * 7 * (userData.perks.temp_items + 1))
                        })
                        tempItems.save()

                    } else {
                        await roles.add(loot[i_loot].loot_roleID).catch(console.error);
                        await r_loot_msg.react("✅")
                    }
                } else {
                    await r_loot_msg.react("🚫")
                }
            }

            if (cosmetic[i_cosmetic].type == 'symbol') {
                if (userData.rank_number < 4) {
                    await r_loot_msg.react("🚫")
                    await r_loot_msg.reply({
                        content: `Вы должны быть **Чемпионом гильдии** или выше для получения косметического значка!`
                    })
                } else {
                    if (!userData.cosmetics_storage.symbols.includes(cosmetic[i_cosmetic].symbol)) {
                        userData.cosmetics_storage.symbols.push(cosmetic[i_cosmetic].symbol)
                        await r_loot_msg.react("✅")
                    } else {
                        await r_loot_msg.react("🚫")
                        await r_loot_msg.reply({
                            content: `У вас в инвентаре уже имеется данный значок!`
                        })
                    }
                }
            } else if (cosmetic[i_cosmetic].type == 'frame') {
                if (userData.rank_number < 5) {
                    await r_loot_msg.react("🚫")
                    await r_loot_msg.reply({
                        content: `Вы должны быть **Звёздочкой гильдии** или выше для получения косметической рамки!`
                    })
                } else {
                    if (!userData.cosmetics_storage.ramkas.includes({ ramka1: cosmetic[i_cosmetic].symbol, ramka2: cosmetic[i_cosmetic].symbol })) {
                        userData.cosmetics_storage.ramkas.push({
                            ramka1: cosmetic[i_cosmetic].symbol,
                            ramka2: cosmetic[i_cosmetic].symbol
                        })
                        await r_loot_msg.react("✅")
                    } else {
                        await r_loot_msg.react("🚫")
                        await r_loot_msg.reply({
                            content: `У вас в инвентаре уже имеется данная рамка!`
                        })
                    }
                }
            } else if (cosmetic[i_cosmetic].type == 'suffix') {
                if (userData.rank_number < 8) {
                    await r_loot_msg.react("🚫")
                    await r_loot_msg.reply({
                        content: `Вы должны быть **Лордом гильдии** или выше для получения косметического постфикса!`
                    })
                } else {
                    if (!userData.cosmetics_storage.suffixes.includes(cosmetic[i_cosmetic].symbol)) {
                        userData.cosmetics_storage.suffixes.push(cosmetic[i_cosmetic].symbol)
                        await r_loot_msg.react("✅")
                    } else {
                        await r_loot_msg.react("🚫")
                        await r_loot_msg.reply({
                            content: `У вас в инвентаре уже имеется данный постфикс!`
                        })
                    }
                }
            } else if (cosmetic[i_cosmetic].type == 'rank') {
                if (userData.rank_number < 10) {
                    await r_loot_msg.react("🚫")
                    await r_loot_msg.reply({
                        content: `Вы должны быть **Повелителем гильдии** или выше для получения косметического значка ранга!`
                    })
                } else {
                    if (!userData.cosmetics_storage.rank.includes(cosmetic[i_cosmetic].symbol)) {
                        userData.cosmetics_storage.rank.push(cosmetic[i_cosmetic].symbol)
                        await r_loot_msg.react("✅")
                    } else {
                        await r_loot_msg.react("🚫")
                        await r_loot_msg.reply({
                            content: `У вас в инвентаре уже имеется данный значок ранга!`
                        })
                    }
                }
            }


            userData.save();
            client.ActExp(userData.userid)
            await wait(1000)
            client.ProgressUpdate(interaction.member);
            console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magentaBright(`[${interaction.user.tag} открыл королевскую коробку]`) + chalk.gray(`: +${act_exp[i_act].amount} опыта активности, +${rank_exp[i_rank].amount} опыта рангов, ${loot[i_loot].name} и ${cosmetic[i_cosmetic].name}`))

        } else {
            await interaction.reply({
                content: `У вас отсутствует \`${role.name}\` коробка!`,
                ephemeral: true
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
    category: `box`,
    plugin: `info`,
    King
};