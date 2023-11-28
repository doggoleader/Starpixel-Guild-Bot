const { SlashCommandBuilder } = require('discord.js');

const { User } = require(`../../schemas/userdata`);
const { Guild } = require(`../../schemas/guilddata`)
const chalk = require(`chalk`);
const ch_list = require(`../../discord structure/channels.json`)


async function Summer(interaction, client) {
    try {
        const guildData = await Guild.findOne({ id: interaction.guild.id })
        if (guildData.plugins.items === false) return interaction.reply({ content: `Данный плагин отключён! Попробуйте позже!`, ephemeral: true })
        const user = interaction.member.user //ДОБАВИТЬ В ДРУГИЕ
        const userData = await User.findOne({ userid: user.id })



        const { roles } = interaction.member //Участник команды
        const role = await interaction.guild.roles  //Постоянная для role
            .fetch("1104095303054934168") //ID коробки
            .catch(console.error);
        if (roles.cache.has("1104095303054934168") || roles.cache.has("567689925143822346")) { //Проверка роли коробки || правления

            const opener = interaction.member.id;
            await interaction.deferUpdate()
            await roles.remove(role).catch(console.error); //Удалить роль коробки
            //Лут из коробок
            //Случайный предмет
            //name - Название предмета
            //dropChanceLOOT - Шанс выпадения предмета
            //roleID - ID роли, которая связана с данным лутом.

            //Список предметов
            let { loot, rank_exp, act_exp } = require(`./Box loot/summer.json`)

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


            //Отправка сообщения о луте              
            const r_loot_msg = await interaction.guild.channels.cache.get(ch_list.box)
                .send(
                    `◾
<@${opener}> открывает летнюю коробку:

░░░░░░░░░░░░░░░░░░░░░░░
╭◜◞◝◜◟◝╮╭◜◜◝◜◝◝╮
╰◟◝◞◟◜◞╯╰◟◟◞◟◞◞╯
░░░░░░░░░░░░░░░░░░░░░░░


\`${loot[i_loot].loot_name}\` (Шанс: \`${finalChance1}%\`)
${loot[i_loot].loot_description}


░░░░░░░░░░░░░░░░░░░░░░░
╭◜◞◝◜◟◝╮╭◜◜◝◜◝◝╮
╰◟◝◞◟◜◞╯╰◟◟◞◟◞◞╯
░░░░░░░░░░░░░░░░░░░░░░░`)
            if (loot[i_loot].loot_name == `🎫 БИЛЕТ НА МОРЕ`) {
                if (userData.seasonal.summer.sea_ticket == false) {
                    userData.seasonal.summer.sea_ticket = true
                    await r_loot_msg.react("✅")
                } else {
                    await r_loot_msg.react("🚫")
                }

            } else if (loot[i_loot].type == "Box" || userData.perks.store_items !== 0) {
                if (!roles.cache.has(loot[i_loot].loot_roleID) && loot[i_loot].loot_name !== `Награды нет.`) {
                    await r_loot_msg.react("✅")
                    await roles.add(loot[i_loot].loot_roleID).catch(console.error)
                } else if (loot[i_loot].loot_name == `Награды нет.`) {
                    await r_loot_msg.react("❌")
                } else if (roles.cache.has(loot[i_loot].loot_roleID) && loot[i_loot].loot_name !== `Награды нет.`) {
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
                if (!roles.cache.has(loot[i_loot].loot_roleID) && loot[i_loot].loot_name !== `Награды нет.`) {
                    await r_loot_msg.react("✅")
                    await roles.add(loot[i_loot].loot_roleID).catch(console.error)
                } else if (loot[i_loot].loot_name == `Награды нет.`) {
                    await r_loot_msg.react("❌")
                } else if (roles.cache.has(loot[i_loot].loot_roleID) && loot[i_loot].loot_name !== `Награды нет.`) {
                    await r_loot_msg.react("❌")
                }
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
\`Получено из летней коробки.\`
╚═════════♡════════╝`
            );



            //Опыт активности


            //Рандом - опыт активности
            let sum_act = 0;
            for (let i_act = 0; i_act < act_exp.length; i_act++) {
                sum_act += act_exp[i_act].chance
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
\`Получено из летней коробки.\`
╚═════════♡════════╝`
            );
            userData.exp += actExp //ДОБАВИТЬ В ДРУГИЕ

            if (guildData.seasonal.easter.enabled === true) {
                const points = [0, 1, 2]
                const rp = points[Math.floor(Math.random() * points.length)]
                userData.seasonal.summer.points += rp
                userData.seasonal.summer.opened_boxes += 1
            }

            userData.save();
            client.ActExp(userData.userid)
            console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magentaBright(`[${interaction.user.tag} открыл летнюю коробку]`) + chalk.gray(`: +${act_exp[i_act].act_amount} опыта активности, +${rank_exp[i_rank].rank_amount} опыта рангов и ${loot[i_loot].loot_name}`))

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
    Summer
};