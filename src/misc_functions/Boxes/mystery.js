const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

const wait = require('node:timers/promises').setTimeout;
const { User } = require(`../../schemas/userdata`);
const chalk = require(`chalk`);
const ch_list = require(`../../discord structure/channels.json`)
    ;

async function Mystery(interaction, client) {
    try {
        const { Guild } = require(`../../schemas/guilddata`)
        const guildData = await Guild.findOne({ id: interaction.guild.id })
        const user = interaction.member.user //ДОБАВИТЬ В ДРУГИЕ
        const userData = await User.findOne({ userid: user.id })

        const opener = interaction.member.id;
        const { roles } = interaction.member //Участник команды

        const role = await interaction.guild.roles  //Постоянная для role
            .fetch("992820488298578041") //ID коробки
            .catch(console.error);
        if (roles.cache.has("992820488298578041") || roles.cache.has("567689925143822346")) { //Проверка роли коробки || правления

            await roles.remove(role).catch(console.error); //Удалить роль коробки
            await interaction.deferUpdate()
            //Лут из коробок
            //Случайный предмет
            //name - Название предмета
            //dropChanceLOOT - Шанс выпадения предмета
            //roleID - ID роли, которая связана с данным лутом.

            //Список предметов
            let { loot, mythical, cosmetic, collection, rank_exp, act_exp, rumbik } = require(`./Box loot/mystery.json`)

            //рандом предметов
            /**
             * loot - 7 штук
             * mythical - 2 штуки
             * collection - 1 штука
             */



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

            //1
            let r_loot1 = Math.floor(Math.random() * sum_loot);
            let i_loot1 = 0;
            for (let s = chances[0]; s <= r_loot1; s += chances[i_loot1]) {
                i_loot1++;

            }
            //2
            let r_loot2 = Math.floor(Math.random() * sum_loot);
            let i_loot2 = 0;
            for (let s = chances[0]; s <= r_loot2; s += chances[i_loot2]) {
                i_loot2++;
            }
            while (i_loot2 == i_loot1) {
                r_loot2 = Math.floor(Math.random() * sum_loot);
                i_loot2 = 0;
                for (let s = chances[0]; s <= r_loot2; s += chances[i_loot2]) {
                    i_loot2++;
                }
            }

            //3
            let r_loot3 = Math.floor(Math.random() * sum_loot);
            let i_loot3 = 0;
            for (let s = chances[0]; s <= r_loot3; s += chances[i_loot3]) {
                i_loot3++;
            }
            while (i_loot3 == i_loot1 || i_loot3 == i_loot2) {
                r_loot3 = Math.floor(Math.random() * sum_loot);
                i_loot3 = 0;
                for (let s = chances[0]; s <= r_loot3; s += chances[i_loot3]) {
                    i_loot3++;
                }
            }


            //4
            let r_loot4 = Math.floor(Math.random() * sum_loot);
            let i_loot4 = 0;
            for (let s = chances[0]; s <= r_loot4; s += chances[i_loot4]) {
                i_loot4++;
            }
            while (i_loot4 == i_loot1 || i_loot4 == i_loot2 || i_loot4 == i_loot3) {
                r_loot4 = Math.floor(Math.random() * sum_loot);
                i_loot4 = 0;
                for (let s = chances[0]; s <= r_loot4; s += chances[i_loot4]) {
                    i_loot4++;
                }
            }

            //5
            let r_loot5 = Math.floor(Math.random() * sum_loot);
            let i_loot5 = 0;
            for (let s = chances[0]; s <= r_loot5; s += chances[i_loot5]) {
                i_loot5++;
            }
            while (i_loot5 == i_loot1 || i_loot5 == i_loot2 || i_loot5 == i_loot3 || i_loot5 == i_loot4) {
                r_loot5 = Math.floor(Math.random() * sum_loot);
                i_loot5 = 0;
                for (let s = chances[0]; s <= r_loot5; s += chances[i_loot5]) {
                    i_loot5++;
                }
            }


            //6
            let r_loot6 = Math.floor(Math.random() * sum_loot);
            let i_loot6 = 0;
            for (let s = chances[0]; s <= r_loot6; s += chances[i_loot6]) {
                i_loot6++;
            }
            while (i_loot6 == i_loot1 || i_loot6 == i_loot2 || i_loot6 == i_loot3 || i_loot6 == i_loot4 || i_loot6 == i_loot5) {
                r_loot6 = Math.floor(Math.random() * sum_loot);
                i_loot6 = 0;
                for (let s = chances[0]; s <= r_loot6; s += chances[i_loot6]) {
                    i_loot6++;
                }
            }

            //7
            let r_loot7 = Math.floor(Math.random() * sum_loot);
            let i_loot7 = 0;
            for (let s = chances[0]; s <= r_loot7; s += chances[i_loot7]) {
                i_loot7++;
            }
            while (i_loot7 == i_loot1 || i_loot7 == i_loot2 || i_loot7 == i_loot3 || i_loot7 == i_loot4 || i_loot7 == i_loot5 || i_loot7 == i_loot6) {
                r_loot7 = Math.floor(Math.random() * sum_loot);
                i_loot7 = 0;
                for (let s = chances[0]; s <= r_loot7; s += chances[i_loot7]) {
                    i_loot7++;
                }
            }

            //Мифическое

            let sum_mythical = 0;
            for (let i_mythical = 0; i_mythical < mythical.length; i_mythical++) {
                sum_mythical += mythical[i_mythical].chance;
            }


            //1
            let r_mythical1 = Math.floor(Math.random() * sum_mythical);
            let i_mythical1 = 0;
            for (let s = mythical[0].chance; s <= r_mythical1; s += mythical[i_mythical1].chance) {
                i_mythical1++;
            }

            //2
            let r_mythical2 = Math.floor(Math.random() * sum_mythical);
            let i_mythical2 = 0;
            for (let s = mythical[0].chance; s <= r_mythical2; s += mythical[i_mythical2].chance) {
                i_mythical2++;
            }
            while (i_mythical2 == i_mythical1) {
                r_mythical2 = Math.floor(Math.random() * sum_mythical);
                i_mythical2 = 0;
                for (let s = mythical[0].chance; s <= r_mythical2; s += mythical[i_mythical2].chance) {
                    i_mythical2++;
                }
            }


            //Коллекция
            let sum_col = 0;
            for (let i_col = 0; i_col < collection.length; i_col++) {
                sum_col += collection[i_col].chance;
            }
            let r_col = Math.floor(Math.random() * sum_col);
            let i_col = 0;
            for (let s = collection[0].chance; s <= r_col; s += collection[i_col].chance) {
                i_col++;
            }

            let sum_cosm = 0;
            for (let i_cosm = 0; i_cosm < cosmetic.length; i_cosm++) {
                sum_cosm += cosmetic[i_cosm].chance;
            }
            let r_cosm = Math.floor(Math.random() * sum_cosm);
            let i_cosm = 0;
            for (let s = cosmetic[0].chance; s <= r_cosm; s += cosmetic[i_cosm].chance) {
                i_cosm++;
            }

            let rewards = [
                loot[i_loot1],
                loot[i_loot2],
                loot[i_loot3],
                loot[i_loot4],
                loot[i_loot5],
                loot[i_loot6],
                loot[i_loot7],
                mythical[i_mythical1],
                mythical[i_mythical2],
                collection[i_col]
            ]

            let allChancesLoot = 0;
            for (let loo of loot) {
                allChancesLoot += loo.chance
            }
            let allChancesMyth = 0;
            for (let loo of mythical) {
                allChancesMyth += loo.chance
            }
            let allChancesColl = 0;
            for (let loo of collection) {
                allChancesColl += loo.chance
            }

            let finalChance1 = ((mythical[i_mythical1].chance / allChancesMyth) * 100).toFixed(1)
            let finalChance2 = ((mythical[i_mythical2].chance / allChancesMyth) * 100).toFixed(1)
            let finalChance3 = ((loot[i_loot1].chance / allChancesLoot) * 100).toFixed(1)
            let finalChance4 = ((loot[i_loot2].chance / allChancesLoot) * 100).toFixed(1)
            let finalChance5 = ((loot[i_loot3].chance / allChancesLoot) * 100).toFixed(1)
            let finalChance6 = ((loot[i_loot4].chance / allChancesLoot) * 100).toFixed(1)
            let finalChance7 = ((loot[i_loot5].chance / allChancesLoot) * 100).toFixed(1)
            let finalChance8 = ((loot[i_loot6].chance / allChancesLoot) * 100).toFixed(1)
            let finalChance9 = ((loot[i_loot7].chance / allChancesLoot) * 100).toFixed(1)
            let finalChance10 = ((collection[i_col].chance / allChancesColl) * 100).toFixed(1)


            //Отправка сообщения о луте   
            let i = 1
            const r_loot_msg = await interaction.guild.channels.cache.get(ch_list.box)
                .send({
                    content: `｡･:\\*:･ﾟ★,｡･:\\*:･ﾟ☆ﾟ･:\\*:･ﾟ☆ﾟ･:\\*:･｡,★ﾟ･:\\*:･｡
˚\\*•̩̩͙✩•̩̩͙\\*˚＊˚\\*•̩̩͙✩•̩̩͙\\*˚＊˚\\*•̩̩͙✩•̩̩͙\\*˚＊˚\\*•̩̩͙✩•̩̩͙\\*˚＊

<@${opener}> открывает **ЗАГАДОЧНУЮ КОРОБКУ**...

**${i++}.** \`${mythical[i_mythical1].name}\` (Шанс: \`${finalChance1}%\`)
${mythical[i_mythical1].loot_description}.

**${i++}.** \`${mythical[i_mythical2].name}\` (Шанс: \`${finalChance2}%\`)
${mythical[i_mythical2].loot_description}.

**${i++}.** \`${loot[i_loot1].name}\` (Шанс: \`${finalChance3}%\`)
${loot[i_loot1].loot_description}.

**${i++}.** \`${loot[i_loot2].name}\` (Шанс: \`${finalChance4}%\`)
${loot[i_loot2].loot_description}.

**${i++}.** \`${loot[i_loot3].name}\` (Шанс: \`${finalChance5}%\`)
${loot[i_loot3].loot_description}.

**${i++}.** \`${loot[i_loot4].name}\` (Шанс: \`${finalChance6}%\`)
${loot[i_loot4].loot_description}.

**${i++}.** \`${loot[i_loot5].name}\` (Шанс: \`${finalChance7}%\`)
${loot[i_loot5].loot_description}.

**${i++}.** \`${loot[i_loot6].name}\` (Шанс: \`${finalChance8}%\`)
${loot[i_loot6].loot_description}.

**${i++}.** \`${loot[i_loot7].name}\` (Шанс: \`${finalChance9}%\`)
${loot[i_loot7].loot_description}.

**${i++}.** \`${collection[i_col].name}\` (Шанс: \`${finalChance10}%\`)
${collection[i_col].loot_description}.

**${i++}.** Косметическая награда из загадочной коробки: \`${cosmetic[i_cosm].name}\`
${cosmetic[i_cosm].cosmetic_description}

˚\\*•̩̩͙✩•̩̩͙\\*˚＊˚\\*•̩̩͙✩•̩̩͙\\*˚＊˚\\*•̩̩͙✩•̩̩͙\\*˚＊˚\\*•̩̩͙✩•̩̩͙\\*˚＊
｡･:\\*:･ﾟ★,｡･:\\*:･ﾟ☆ﾟ･:\\*:･ﾟ☆ﾟ･:\\*:･｡,★ﾟ･:\\*:･｡`
                })
            for (let reward of rewards) {
                if (reward.type == "Box" || userData.perks.store_items !== 0) {
                    if (userData.rank_number < 2 && (reward.name == `🪐 ᅠМЕРКУРИЙ` || reward.name == `🪐 ᅠВЕНЕРА` || reward.name == `🪐 ᅠЛУНА` || reward.name == `🪐 ᅠМАРС` || reward.name == `🪐 ᅠЮПИТЕР` || reward.name == `🪐 ᅠСАТУРН` || reward.name == `🪐 ᅠУРАН` || reward.name == `🪐 ᅠНЕПТУН` || reward.name == `🪐 ᅠПЛУТОН`)) {
                        await r_loot_msg.react("🚫")
                        await r_loot_msg.reply({
                            content: `Вы должны иметь ранг \`${interaction.guild.roles.cache.get(`553593136895623208`).name}\` или выше, чтобы получить данный предмет!`
                        })
                    } else if (userData.rank_number < 9 && (reward.name == `🦊 КОЛЬЦО` || reward.name == `🦊 БРАСЛЕТ` || reward.name == `🦊 ОЖЕРЕЛЬЕ`)) {

                        await r_loot_msg.react("🚫")
                        await r_loot_msg.reply({
                            content: `Вы должны иметь ранг \`${interaction.guild.roles.cache.get(`553593136895623208`).name}\` или выше, чтобы получить данный предмет!`
                        })

                    } else if (!roles.cache.has(reward.loot_roleID)) {

                        await roles.add(reward.loot_roleID).catch(console.error);
                        await r_loot_msg.react("✅")

                    } else {
                        if (userData.stacked_items.length < userData.upgrades.inventory_size) {
                            await userData.stacked_items.push(reward.loot_roleID)
                            await r_loot_msg.react("✅")
                        } else {
                            await interaction.guild.channels.cache.get(ch_list.box).send({
                                content: `Мы не можем добавить предмет в ваш инвентарь, так как он переполнен. Чтобы увеличить вместительность своего инвентаря, перейдите в канал <#1141026403765211136>!`
                            })
                            await r_loot_msg.react("🚫")
                        }
                    }
                } else {
                    if (userData.rank_number < 2 && (reward.name == `🪐 ᅠМЕРКУРИЙ` || reward.name == `🪐 ᅠВЕНЕРА` || reward.name == `🪐 ᅠЛУНА` || reward.name == `🪐 ᅠМАРС` || reward.name == `🪐 ᅠЮПИТЕР` || reward.name == `🪐 ᅠСАТУРН` || reward.name == `🪐 ᅠУРАН` || reward.name == `🪐 ᅠНЕПТУН` || reward.name == `🪐 ᅠПЛУТОН`)) {
                        await r_loot_msg.react("🚫")
                        await r_loot_msg.reply({
                            content: `Вы должны иметь ранг \`${interaction.guild.roles.cache.get(`553593136895623208`).name}\` или выше, чтобы получить данный предмет!`
                        })
                    } else if (userData.rank_number < 9 && (reward.name == `🦊 КОЛЬЦО` || reward.name == `🦊 БРАСЛЕТ` || reward.name == `🦊 ОЖЕРЕЛЬЕ`)) {

                        await r_loot_msg.react("🚫")
                        await r_loot_msg.reply({
                            content: `Вы должны иметь ранг \`${interaction.guild.roles.cache.get(`553593136895623208`).name}\` или выше, чтобы получить данный предмет!`
                        })

                    } else if (!roles.cache.has(reward.loot_roleID)) {

                        await roles.add(reward.loot_roleID).catch(console.error);
                        await r_loot_msg.react("✅")

                    } else {
                        await r_loot_msg.react("🚫")
                    }
                }


            }

            if (cosmetic[i_cosm].type == 'symbol') {
                if (userData.rank_number < 4) {
                    await r_loot_msg.react("🚫")
                    await r_loot_msg.reply({
                        content: `Вы должны быть **Чемпионом гильдии** или выше для получения косметического значка!`
                    })
                } else {
                    if (!userData.cosmetics_storage.symbols.includes(cosmetic[i_cosm].symbol)) {
                        userData.cosmetics_storage.symbols.push(cosmetic[i_cosm].symbol)
                        await r_loot_msg.react("✅")
                    } else {
                        await r_loot_msg.react("🚫")
                        await r_loot_msg.reply({
                            content: `У вас в инвентаре уже имеется данный значок!`
                        })
                    }
                }
            } else if (cosmetic[i_cosm].type == 'frame') {
                if (userData.rank_number < 5) {
                    await r_loot_msg.react("🚫")
                    await r_loot_msg.reply({
                        content: `Вы должны быть **Звёздочкой гильдии** или выше для получения косметической рамки!`
                    })
                } else {
                    if (!userData.cosmetics_storage.ramkas.includes({ ramka1: cosmetic[i_cosm].symbol, ramka2: cosmetic[i_cosm].symbol })) {
                        userData.cosmetics_storage.ramkas.push({
                            ramka1: cosmetic[i_cosm].symbol,
                            ramka2: cosmetic[i_cosm].symbol
                        })
                        await r_loot_msg.react("✅")
                    } else {
                        await r_loot_msg.react("🚫")
                        await r_loot_msg.reply({
                            content: `У вас в инвентаре уже имеется данная рамка!`
                        })
                    }
                }
            } else if (cosmetic[i_cosm].type == 'suffix') {
                if (userData.rank_number < 8) {
                    await r_loot_msg.react("🚫")
                    await r_loot_msg.reply({
                        content: `Вы должны быть **Лордом гильдии** или выше для получения косметического постфикса!`
                    })
                } else {
                    if (!userData.cosmetics_storage.suffixes.includes(cosmetic[i_cosm].symbol)) {
                        userData.cosmetics_storage.suffixes.push(cosmetic[i_cosm].symbol)
                        await r_loot_msg.react("✅")
                    } else {
                        await r_loot_msg.react("🚫")
                        await r_loot_msg.reply({
                            content: `У вас в инвентаре уже имеется данный постфикс!`
                        })
                    }
                }
            } else if (cosmetic[i_cosm].type == 'rank') {
                if (userData.rank_number < 10) {
                    await r_loot_msg.react("🚫")
                    await r_loot_msg.reply({
                        content: `Вы должны быть **Повелителем гильдии** или выше для получения косметического значка ранга!`
                    })
                } else {
                    if (!userData.cosmetics_storage.rank.includes(cosmetic[i_cosm].symbol)) {
                        userData.cosmetics_storage.rank.push(cosmetic[i_cosm].symbol)
                        await r_loot_msg.react("✅")
                    } else {
                        await r_loot_msg.react("🚫")
                        await r_loot_msg.reply({
                            content: `У вас в инвентаре уже имеется данный значок ранга!`
                        })
                    }
                }
            }
            //Румбики (если необходимо)

            //Рандом - румбики
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
<@${opener}> +${rumb_amount}<:Rumbik:883638847056003072>
\`Получено из Загадочной коробки.\`
╚═════════♡════════╝`
            );
            if (userData.rank_number >= 3) {
                userData.rumbik += rumb_amount
                userData.progress.items.find(it => it.name == 'RUMBIKS_TOTAL').total_items += rumb_amount
            } else {

                userData.rumbik += 0
            }

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
\`Получено из Загадочной коробки.\`
╚═════════♡════════╝`
            );


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
\`Получено из Загадочной коробки.\`
╚═════════♡════════╝`
            );
            userData.exp += actExp //ДОБАВИТЬ В ДРУГИЕ

            userData.save();
            client.ActExp(userData.userid)
            await wait(1000)
            client.ProgressUpdate(interaction.member);

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
    Mystery
};