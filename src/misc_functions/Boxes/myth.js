const { SlashCommandBuilder } = require('discord.js');
const { execute } = require('../../events/client/start_bot/ready');
const { User } = require(`../../schemas/userdata`);
const chalk = require(`chalk`);
const ch_list = require(`../../discord structure/channels.json`)
const linksInfo = require(`../../discord structure/links.json`)

async function Myth(interaction, client) {
    try {
        const { Guild } = require(`../../schemas/guilddata`)
        const guildData = await Guild.findOne({ id: interaction.guild.id })
        const user = interaction.member.user //ДОБАВИТЬ В ДРУГИЕ
        const userData = await User.findOne({ userid: user.id })


        const timestamp = Math.round(interaction.createdTimestamp / 1000)
        const opener = interaction.member.id;
        const cmd_name = `myth` //Название команды
        const { roles } = interaction.member //Участник команды

        const role = await interaction.guild.roles  //Постоянная для role
            .fetch("781069821953441832") //ID коробки
            .catch(console.error);
        if (roles.cache.has("781069821953441832") || roles.cache.has("567689925143822346")) { //Проверка роли коробки || правления

            await roles.remove(role).catch(console.error); //Удалить роль коробки
            await interaction.deferUpdate()
            //Лут из коробок
            //Случайный предмет
            //name - Название предмета
            //dropChanceLOOT - Шанс выпадения предмета
            //roleID - ID роли, которая связана с данным лутом.

            //Список предметов
            let { loot, mythical, rank_exp, act_exp, rumbik } = require(`./Box loot/myth.json`)

            //рандом предметов
            //L1

            let chances1 = []
            let sum_loot1 = 0;
            for (let i_loot1 = 0; i_loot1 < loot.length; i_loot1++) {
                if (loot[i_loot1].rarity == "Common") {
                    sum_loot1 += loot[i_loot1].chance * userData.box_chances.common
                    chances1.push(loot[i_loot1].chance * userData.box_chances.common)
                } else if (loot[i_loot1].rarity == "Uncommon") {
                    sum_loot1 += loot[i_loot1].chance * userData.box_chances.uncommon
                    chances1.push(loot[i_loot1].chance * userData.box_chances.uncommon)
                } else if (loot[i_loot1].rarity == "Rare") {
                    sum_loot1 += loot[i_loot1].chance * userData.box_chances.rare
                    chances1.push(loot[i_loot1].chance * userData.box_chances.rare)
                } else if (loot[i_loot1].rarity == "Epic") {
                    sum_loot1 += loot[i_loot1].chance * userData.box_chances.epic
                    chances1.push(loot[i_loot1].chance * userData.box_chances.epic)
                } else if (loot[i_loot1].rarity == "Legendary") {
                    sum_loot1 += loot[i_loot1].chance * userData.box_chances.legendary
                    chances1.push(loot[i_loot1].chance * userData.box_chances.legendary)
                } else if (loot[i_loot1].rarity == "Mythical") {
                    sum_loot1 += loot[i_loot1].chance * userData.box_chances.mythical
                    chances1.push(loot[i_loot1].chance * userData.box_chances.mythical)
                } else if (loot[i_loot1].rarity == "RNG") {
                    sum_loot1 += loot[i_loot1].chance * userData.box_chances.RNG
                    chances1.push(loot[i_loot1].chance * userData.box_chances.RNG)
                } else {
                    sum_loot1 += loot[i_loot1].chance * 1
                    chances1.push(loot[i_loot1].chance * 1)
                    console.log(`Предмет ${loot[i_loot1].loot_name} имеет неправильное отображение редкости!`)
                }
            }
            let r_loot1 = Math.floor(Math.random() * sum_loot1);
            let i_loot1 = 0;
            for (let s = chances1[0]; s <= r_loot1; s += chances1[i_loot1]) {
                i_loot1++;
            }

            //L3
            let chances3 = []
            let sum_loot3 = 0;
            for (let i_loot3 = 0; i_loot3 < loot.length; i_loot3++) {
                if (loot[i_loot3].rarity == "Common") {
                    sum_loot3 += loot[i_loot3].chance * userData.box_chances.common
                    chances3.push(loot[i_loot3].chance * userData.box_chances.common)
                } else if (loot[i_loot3].rarity == "Uncommon") {
                    sum_loot3 += loot[i_loot3].chance * userData.box_chances.uncommon
                    chances3.push(loot[i_loot3].chance * userData.box_chances.uncommon)
                } else if (loot[i_loot3].rarity == "Rare") {
                    sum_loot3 += loot[i_loot3].chance * userData.box_chances.rare
                    chances3.push(loot[i_loot3].chance * userData.box_chances.rare)
                } else if (loot[i_loot3].rarity == "Epic") {
                    sum_loot3 += loot[i_loot3].chance * userData.box_chances.epic
                    chances3.push(loot[i_loot3].chance * userData.box_chances.epic)
                } else if (loot[i_loot3].rarity == "Legendary") {
                    sum_loot3 += loot[i_loot3].chance * userData.box_chances.legendary
                    chances3.push(loot[i_loot3].chance * userData.box_chances.legendary)
                } else if (loot[i_loot3].rarity == "Mythical") {
                    sum_loot3 += loot[i_loot3].chance * userData.box_chances.mythical
                    chances3.push(loot[i_loot3].chance * userData.box_chances.mythical)
                } else if (loot[i_loot3].rarity == "RNG") {
                    sum_loot3 += loot[i_loot3].chance * userData.box_chances.RNG
                    chances3.push(loot[i_loot3].chance * userData.box_chances.RNG)
                } else {
                    sum_loot3 += loot[i_loot3].chance * 1
                    chances3.push(loot[i_loot3].chance * 1)
                    console.log(`Предмет ${loot[i_loot3].loot_name} имеет неправильное отображение редкости!`)
                }
            }
            let r_loot3 = Math.floor(Math.random() * sum_loot3);
            let i_loot3 = 0;
            for (let s = chances3[0]; s <= r_loot3; s += chances3[i_loot3]) {
                i_loot3++;
            }

            //L4
            let chances4 = []
            let sum_loot4 = 0;
            for (let i_loot4 = 0; i_loot4 < loot.length; i_loot4++) {
                if (loot[i_loot4].rarity == "Common") {
                    sum_loot4 += loot[i_loot4].chance * userData.box_chances.common
                    chances4.push(loot[i_loot4].chance * userData.box_chances.common)
                } else if (loot[i_loot4].rarity == "Uncommon") {
                    sum_loot4 += loot[i_loot4].chance * userData.box_chances.uncommon
                    chances4.push(loot[i_loot4].chance * userData.box_chances.uncommon)
                } else if (loot[i_loot4].rarity == "Rare") {
                    sum_loot4 += loot[i_loot4].chance * userData.box_chances.rare
                    chances4.push(loot[i_loot4].chance * userData.box_chances.rare)
                } else if (loot[i_loot4].rarity == "Epic") {
                    sum_loot4 += loot[i_loot4].chance * userData.box_chances.epic
                    chances4.push(loot[i_loot4].chance * userData.box_chances.epic)
                } else if (loot[i_loot4].rarity == "Legendary") {
                    sum_loot4 += loot[i_loot4].chance * userData.box_chances.legendary
                    chances4.push(loot[i_loot4].chance * userData.box_chances.legendary)
                } else if (loot[i_loot4].rarity == "Mythical") {
                    sum_loot4 += loot[i_loot4].chance * userData.box_chances.mythical
                    chances4.push(loot[i_loot4].chance * userData.box_chances.mythical)
                } else if (loot[i_loot4].rarity == "RNG") {
                    sum_loot4 += loot[i_loot4].chance * userData.box_chances.RNG
                    chances4.push(loot[i_loot4].chance * userData.box_chances.RNG)
                } else {
                    sum_loot4 += loot[i_loot4].chance * 1
                    chances4.push(loot[i_loot4].chance * 1)
                    console.log(`Предмет ${loot[i_loot4].loot_name} имеет неправильное отображение редкости!`)
                }
            }
            let r_loot4 = Math.floor(Math.random() * sum_loot4);
            let i_loot4 = 0;
            for (let s = chances4[0]; s <= r_loot4; s += chances4[i_loot4]) {
                i_loot4++;
            }


            //Лут 2


            //рандом предметов
            let sum_mythical = 0;
            for (let i_mythical = 0; i_mythical < mythical.length; i_mythical++) {
                sum_mythical += mythical[i_mythical].chance;
            }
            let r_mythical = Math.floor(Math.random() * sum_mythical);
            let i_mythical = 0;
            for (let s = mythical[0].chance; s <= r_mythical; s += mythical[i_mythical].chance) {
                i_mythical++;
            }
            let allChancesLoot = 0;
            for (let loo of loot) {
                allChancesLoot += loo.chance
            }
            let allChancesMyth = 0;
            for (let loo of mythical) {
                allChancesMyth += loo.chance
            }
            const rewards = [
                mythical[i_mythical],
                loot[i_loot1],
                loot[i_loot3],
                loot[i_loot4]
            ]
            let finalChance1 = ((mythical[i_mythical].chance / allChancesMyth) * 100).toFixed(1)
            let finalChance2 = ((loot[i_loot1].chance / allChancesLoot) * 100).toFixed(1)
            let finalChance3 = ((loot[i_loot3].chance / allChancesLoot) * 100).toFixed(1)
            let finalChance4 = ((loot[i_loot4].chance / allChancesLoot) * 100).toFixed(1)

            //Отправка сообщения о луте              
            const r_loot_msg = await interaction.guild.channels.cache.get(ch_list.box)
                .send(
                    `☆

                    ☆                                  ☆

   ☆                                                                       ☆


<@${opener}> открывает Подарок судьбы...

\`${mythical[i_mythical].mythical_name}\` (Шанс: \`${finalChance1}%\`)
${mythical[i_mythical].mythical_description}.

\`${loot[i_loot1].loot_name}\` (Шанс: \`${finalChance2}%\`)
${loot[i_loot1].loot_description}.

\`${loot[i_loot3].loot_name}\` (Шанс: \`${finalChance3}%\`)
${loot[i_loot3].loot_description}.

\`${loot[i_loot4].loot_name}\` (Шанс: \`${finalChance4}%\`)
${loot[i_loot4].loot_description}.

   ☆                                                                       ☆

                    ☆                                  ☆

☆`)


            for (let reward of rewards) {
                if (reward.type == "Box" || userData.perks.store_items !== 0) {
                    if (userData.rank_number < 2 && (reward.loot_name == `🪐 ᅠМЕРКУРИЙ` || reward.loot_name == `🪐 ᅠВЕНЕРА` || reward.loot_name == `🪐 ᅠЛУНА` || reward.loot_name == `🪐 ᅠМАРС` || reward.loot_name == `🪐 ᅠЮПИТЕР` || reward.loot_name == `🪐 ᅠСАТУРН` || reward.loot_name == `🪐 ᅠУРАН` || reward.loot_name == `🪐 ᅠНЕПТУН` || reward.loot_name == `🪐 ᅠПЛУТОН`)) {
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
                    if (userData.rank_number < 2 && (reward.loot_name == `🪐 ᅠМЕРКУРИЙ` || reward.loot_name == `🪐 ᅠВЕНЕРА` || reward.loot_name == `🪐 ᅠЛУНА` || reward.loot_name == `🪐 ᅠМАРС` || reward.loot_name == `🪐 ᅠЮПИТЕР` || reward.loot_name == `🪐 ᅠСАТУРН` || reward.loot_name == `🪐 ᅠУРАН` || reward.loot_name == `🪐 ᅠНЕПТУН` || reward.loot_name == `🪐 ᅠПЛУТОН`)) {
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
            let rumb_amount = rumbik[i_rumb].rumb_amount * userData.pers_rumb_boost
            //Сообщение - румбики                       
            interaction.guild.channels.cache.get(ch_list.rumb).send(
                `╔═════════♡════════╗
<@${opener}> +${rumb_amount}<:Rumbik:883638847056003072>
\`Получено из Подарка судьбы.\`
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
            let formula_rank = rank_exp[i_rank].rank_amount * userData.pers_rank_boost + Math.round(rank_exp[i_rank].rank_amount * userData.perks.rank_boost * 0.05)
            userData.rank += formula_rank
            interaction.guild.channels.cache.get(ch_list.rank).send(
                `╔═════════♡════════╗
<@${opener}> +${formula_rank}💠
\`Получено из Подарка судьбы.\`
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

            let actExp = act_exp[i_act].act_amount * userData.pers_act_boost * guildData.act_exp_boost
            interaction.guild.channels.cache.get(ch_list.act).send(
                `╔═════════♡════════╗
<@${opener}> +${actExp}🌀
\`Получено из Подарка судьбы.\`
╚═════════♡════════╝`
            );
            userData.exp += actExp //ДОБАВИТЬ В ДРУГИЕ

            userData.save();
            client.ActExp(userData.userid)
            console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magentaBright(`[${interaction.user.tag} открыл подарок судьбы]`) + chalk.gray(`: +${act_exp[i_act].act_amount} опыта активности, +${rank_exp[i_rank].rank_amount} опыта рангов, +${rumbik[i_rumb].rumb_amount} румбиков, ${mythical[i_mythical].mythical_name}, ${loot[i_loot1].loot_name}, ${loot[i_loot3].loot_name} и ${loot[i_loot4].loot_name}`))

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
    Myth
};