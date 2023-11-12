const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { User } = require(`../../schemas/userdata`)
const { execute } = require('../../events/client/start_bot/ready');
const chalk = require(`chalk`);
const ch_list = require(`../../discord structure/channels.json`)
const linksInfo = require(`../../discord structure/links.json`)
const { Guild } = require(`../../schemas/guilddata`)

async function Mega(interaction, client) {
    try {
        const guildData = await Guild.findOne({ id: interaction.guild.id })
        const { user, member, guild } = interaction //ДОБАВИТЬ В ДРУГИЕ
        const userData = await User.findOne({ userid: user.id })
        const box_role = await guild.roles.fetch(`992820494900412456`)
        if (!member.roles.cache.has(box_role.id) && !member.roles.cache.has(`567689925143822346`)) return interaction.reply({
            content: `У вас нет \`${box_role.name}\` коробки!`,
            ephemeral: true
        })
        await interaction.deferUpdate()
        await member.roles.remove(box_role.id)
        let { loot, act_exp, rank_exp, rumbik, cosmetic } = require(`./Box loot/mega.json`)
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
        let r_loot1 = Math.floor(Math.random() * sum_loot);
        let i_loot1 = 0;
        for (let s = chances[0]; s <= r_loot1; s += chances[i_loot1]) {
            i_loot1++;
        }
        let r_loot2 = Math.floor(Math.random() * sum_loot);
        let i_loot2 = 0;
        for (let s = chances[0]; s <= r_loot2; s += chances[i_loot2]) {
            i_loot2++;
        }

        let sum_cosmetic = 0;
        for (let i_cosmetic = 0; i_cosmetic < cosmetic.length; i_cosmetic++) {
            sum_cosmetic += cosmetic[i_cosmetic].chance;
        }
        let r_cosmetic = Math.floor(Math.random() * sum_cosmetic);
        let i_cosmetic = 0;
        for (let s = cosmetic[0].chance; s <= r_cosmetic; s += cosmetic[i_cosmetic].chance) {
            i_cosmetic++;
        }

        let allChances = 0;
        for (let loo of loot) {
            allChances += loo.chance
        }
        let finalChance1 = ((loot[i_loot1].chance / allChances) * 100).toFixed(1)
        let finalChance2 = ((loot[i_loot2].chance / allChances) * 100).toFixed(1)

        //Отправка сообщения о луте    
        const boxesk = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('boxesk')
                .setLabel('Установить')
                .setStyle(ButtonStyle.Success)
                .setEmoji(`⬆️`)
        )

        const r_loot_msg = await interaction.guild.channels.cache.get(ch_list.box)
            .send({
                content: `◾
${interaction.member} открывает огромную коробку от гильдии.
╭───────₪۞₪───────╮
**1.** \`${loot[i_loot1].name}\` (Шанс: \`${finalChance1}%\`)
${loot[i_loot1].description}

**2.** \`${loot[i_loot2].name}\` (Шанс: \`${finalChance2}%\`)
${loot[i_loot2].description}
╰───────₪۞₪───────╯
Дополнительная косметическая награда из огромной коробки: ${cosmetic[i_cosmetic].loot_name}
${cosmetic[i_cosmetic].loot_description}
◾`,
                components: [boxesk]
            })

        //Выдача лут 1
        if (loot[i_loot1].type == "Box" || userData.perks.store_items !== 0) {
            if (!member.roles.cache.has(loot[i_loot1].role) && (loot[i_loot1].role == `1020400007989444678` || loot[i_loot1].role == `1020400017330163712` || loot[i_loot1].role == `1020400015300120638`) && userData.rank_number >= 9) {
                await member.roles.add(loot[i_loot1].role)
                await r_loot_msg.react(`✅`)
            } else if (!member.roles.cache.has(loot[i_loot1].role) && (loot[i_loot1].role !== `1020400007989444678` && loot[i_loot1].role !== `1020400017330163712` && loot[i_loot1].role !== `1020400015300120638`)) {
                await member.roles.add(loot[i_loot1].role)
                await r_loot_msg.react(`✅`)
            } else if (member.roles.cache.has(loot[i_loot1].role)) {
                await member.roles.add(loot[i_loot1].role).catch(console.error);
                await r_loot_msg.react("✅")
            } else {
                await r_loot_msg.react(`❌`)
                await r_loot_msg.reply({
                    content: `Ваш ранг слишком низкий, чтобы получить эту роль!`
                })
            }
        } else {
            if (!member.roles.cache.has(loot[i_loot1].role) && (loot[i_loot1].role == `1020400007989444678` || loot[i_loot1].role == `1020400017330163712` || loot[i_loot1].role == `1020400015300120638`) && userData.rank_number >= 9) {
                await member.roles.add(loot[i_loot1].role)
                await r_loot_msg.react(`✅`)
            } else if (!member.roles.cache.has(loot[i_loot1].role) && (loot[i_loot1].role !== `1020400007989444678` && loot[i_loot1].role !== `1020400017330163712` && loot[i_loot1].role !== `1020400015300120638`)) {
                await member.roles.add(loot[i_loot1].role)
                await r_loot_msg.react(`✅`)
            } else if (member.roles.cache.has(loot[i_loot1].role)) {
                await r_loot_msg.react(`❌`)
            } else {
                await r_loot_msg.react(`❌`)
                await r_loot_msg.reply({
                    content: `Ваш ранг слишком низкий, чтобы получить эту роль!`
                })
            }
        }


        if (loot[i_loot2].type == "Box" || userData.perks.store_items !== 0) {
            if (!member.roles.cache.has(loot[i_loot2].role) && (loot[i_loot2].role == `1020400007989444678` || loot[i_loot2].role == `1020400017330163712` || loot[i_loot2].role == `1020400015300120638`) && userData.rank_number >= 9) {
                await member.roles.add(loot[i_loot2].role)
                await r_loot_msg.react(`✅`)
            } else if (!member.roles.cache.has(loot[i_loot2].role) && (loot[i_loot2].role !== `1020400007989444678` && loot[i_loot2].role !== `1020400017330163712` && loot[i_loot2].role !== `1020400015300120638`)) {
                await member.roles.add(loot[i_loot2].role)
                await r_loot_msg.react(`✅`)
            } else if (member.roles.cache.has(loot[i_loot2].role)) {
                await member.roles.add(loot[i_loot2].role).catch(console.error);
                await r_loot_msg.react("✅")
            } else {
                await r_loot_msg.react(`❌`)
                await r_loot_msg.reply({
                    content: `Ваш ранг слишком низкий, чтобы получить эту роль!`
                })
            }
        } else {
            if (!member.roles.cache.has(loot[i_loot2].role) && (loot[i_loot2].role == `1020400007989444678` || loot[i_loot2].role == `1020400017330163712` || loot[i_loot2].role == `1020400015300120638`) && userData.rank_number >= 9) {
                await member.roles.add(loot[i_loot2].role)
                await r_loot_msg.react(`✅`)
            } else if (!member.roles.cache.has(loot[i_loot2].role) && (loot[i_loot2].role !== `1020400007989444678` && loot[i_loot2].role !== `1020400017330163712` && loot[i_loot2].role !== `1020400015300120638`)) {
                await member.roles.add(loot[i_loot2].role)
                await r_loot_msg.react(`✅`)
            } else if (member.roles.cache.has(loot[i_loot2].role)) {
                await r_loot_msg.react(`❌`)
            } else {
                await r_loot_msg.react(`❌`)
                await r_loot_msg.reply({
                    content: `Ваш ранг слишком низкий, чтобы получить эту роль!`
                })
            }
        }



        const filter = (i) => (i.user.id == interaction.user.id && i.customId === 'boxesk');

        const coll1 = r_loot_msg.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 60000 })

        coll1.on('collect', async (i) => {
            if (i.user.id === interaction.member.user.id) {
                if (cosmetic[i_cosmetic].loot_name.includes(`ПОСТФИКС ДЛЯ НИКНЕЙМА`) && userData.rank_number >= 8) {
                    userData.displayname.suffix = cosmetic[i_cosmetic].symbol
                    userData.save()
                    await boxesk.components[0]
                        .setDisabled(true)
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(`🕓`)
                        .setLabel(`Идёт обработка...`)
                    i.reply({
                        content: `Ожидайте! Скоро ваш значок будет установлен! Если этого не произойдет в течение 15 минут, обратитесь в вопрос-модерам!`,
                        ephemeral: true
                    })
                } else {
                    i.reply({
                        content: `Вы не можете установить себе данный предмет, так как не получили минимальный ранг. Посмотреть минимальный ранг для данного действия вы можете в канале <#931620901882068992>!`,
                        ephemeral: true
                    })
                    await boxesk.components[0]
                        .setDisabled(true)
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(`❌`)
                        .setLabel(`Низкий ранг`)
                }

                await r_loot_msg.edit({
                    components: [boxesk]
                })

            } else {
                i.reply({ content: `Вы не можете использовать данную кнопочку!`, ephemeral: true });
            }
        })
        coll1.on('end', async (err) => {
            await boxesk.components[0]
                .setDisabled(true)
                .setStyle(ButtonStyle.Secondary)

            await r_loot_msg.edit({
                components: [boxesk]
            })
        });
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
${interaction.member} +${rumb_amount}<:Rumbik:883638847056003072>
\`Получено из огромной коробки.\`
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
${interaction.member} +${formula_rank}💠
\`Получено из огромной коробки.\`
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
${interaction.member} +${actExp}🌀
\`Получено из огромной коробки.\`
╚═════════♡════════╝`
        );
        userData.exp += actExp //ДОБАВИТЬ В ДРУГИЕ


        userData.save();
        client.ActExp(userData.userid)
        client.ProgressUpdate(interaction.member);

        console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magentaBright(`[${interaction.user.tag} открыл сокровище]`) + chalk.gray(`: +${act_exp[i_act].amount} опыта активности, +${rank_exp[i_rank].amount} опыта рангов, +${rumbik[i_rumb].amount} румбиков,  ${loot[i_loot1].name} и ${loot[i_loot2].name}`))


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
    Mega
};