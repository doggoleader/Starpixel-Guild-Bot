const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { User } = require(`../../schemas/userdata`); //ДОБАВИТЬ В ДРУГИЕ
const prettyMilliseconds = require(`pretty-ms`) //ДОБАВИТЬ В ДРУГИЕ
const { execute } = require('../../events/client/start_bot/ready');
const chalk = require(`chalk`);
const ch_list = require(`../../discord structure/channels.json`)
const linksInfo = require(`../../discord structure/links.json`)


async function Daily(interaction, client) {
    try {
        const { Guild } = require(`../../schemas/guilddata`)
        const guildData = await Guild.findOne({ id: interaction.guild.id })
        const { roles } = interaction.member //Участник команды

        const user = interaction.member.user //ДОБАВИТЬ В ДРУГИЕ
        const userData = await User.findOne({ userid: user.id })


        if (roles.cache.has("504887113649750016")) { //Проверка роли участника гильдии
            if (userData.cooldowns.daily > Date.now()) //ДОБАВИТЬ В ДРУГИЕ(ГДЕ КУЛДАУН)
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(Number(linksInfo.bot_color))
                            .setAuthor({
                                name: `Вы не можете использовать эту команду`
                            })
                            .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${prettyMilliseconds(userData.cooldowns.daily - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}!`)
                    ],
                    ephemeral: true
                });
            const opener = interaction.member.id
            await interaction.deferUpdate()


            //Лут из коробок
            //Случайный предмет
            //name - Название предмета
            //dropChanceLOOT - Шанс выпадения предмета
            //roleID - ID роли, которая связана с данным лутом.

            //Список предметов
            let { loot, rank_exp, act_exp } = require(`./Box loot/daily.json`)

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
<@${opener}> открывает ежедневную коробку...
╭──────────╮
\`${loot[i_loot].loot_name}\` (Шанс: \`${finalChance1}%\`)
${loot[i_loot].loot_description}
╰──────────╯
◾`)
            if (loot[i_loot].type == "Box" || userData.perks.store_items !== 0) {
                if (!roles.cache.has(loot[i_loot].loot_roleID) && loot[i_loot].loot_name !== `Награды нет.`) {
                    await r_loot_msg.react("✅")
                    await roles.add(loot[i_loot].loot_roleID).catch(console.error)
                } else if (loot[i_loot].loot_name == `Награды нет.`) {
                    if (roles.cache.has('1139849269050888202')) {
                        if (roles.cache.has('521248091853291540')) {
                            if (userData.stacked_items.length < userData.upgrades.inventory_size) {
                                await r_loot_msg.reply({
                                    content: `Так как у вас имеется талисман пустоты, к вам в инвентарь была добавлена большая коробка!`
                                })
                                await userData.stacked_items.push(loot[i_loot].loot_roleID)
                                await r_loot_msg.react("✅")
                            } else {
                                await interaction.guild.channels.cache.get(ch_list.box).send({
                                    content: `Мы не можем добавить предмет в ваш инвентарь, так как он переполнен. Чтобы увеличить вместительность своего инвентаря, перейдите в канал <#1141026403765211136>!`
                                })
                                await r_loot_msg.react("🚫")
                            }
                        } else {
                            await r_loot_msg.reply({
                                content: `Так как у вас имеется талисман пустоты, к вам в профиль была добавлена большая коробка!`
                            })
                            await roles.add(`521248091853291540`)
                            await r_loot_msg.react("✅")
                        }
                    } else {
                        await r_loot_msg.react("❌")
                    }
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
                    if (roles.cache.has('1139849269050888202')) {
                        await r_loot_msg.reply({
                            content: `Так как у вас имеется талисман пустоты, к вам в профиль была добавлена большая коробка!`
                        })
                        await roles.add(`521248091853291540`)
                        await r_loot_msg.react("✅")
                    } else {
                        await r_loot_msg.react("❌")
                    }
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
            interaction.guild.channels.cache.get(ch_list.rank).send(
                `╔═════════♡════════╗
<@${opener}> +${formula_rank}💠
\`Получено из ежедневной коробки.\`
╚═════════♡════════╝`
            );
            userData.rank += formula_rank //ДОБАВИТЬ В ДРУГИЕ



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
\`Получено из ежедневной коробки.\`
╚═════════♡════════╝`
            );
            if (roles.cache.has(`572124614050840576`)) {
                userData.exp += (actExp * 2) //ДОБАВИТЬ В ДРУГИЕ
            } else {
                userData.exp += actExp //ДОБАВИТЬ В ДРУГИЕ
            }

            userData.cooldowns.daily = Date.now() + (1000 * 60 * 60 * 16) //ДОБАВИТЬ В ДРУГИЕ(ГДЕ КУЛДАУН)  * 60 * 16

            userData.save();
            client.ActExp(userData.userid)
            console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magentaBright(`[${interaction.user.tag} открыл ежедневную коробку]`) + chalk.gray(`: +${act_exp[i_act].act_amount} опыта активности, +${rank_exp[i_rank].rank_amount} опыта рангов и ${loot[i_loot].loot_name}`))

        } else if (!roles.cache.has("504887113649750016")) {
            await interaction.reply({
                content: `Вы не являетесь участником гильдии Starpixel. Чтобы вступить в гильдию Starpixel, ознакомьтесь с каналами <#921719265139249203> и <#774546154209148928>, а затем напишите \`/application create\` в канале <#921719174819090462>!`,
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
    Daily
};