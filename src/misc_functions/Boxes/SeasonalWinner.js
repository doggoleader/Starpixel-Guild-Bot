const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } = require('discord.js');

const prettyMilliseconds = require(`pretty-ms`) //ДОБАВИТЬ В ДРУГИЕ
const wait = require('node:timers/promises').setTimeout;
const { User } = require(`../../schemas/userdata`);
const { Temp } = require(`../../schemas/temp_items`);
const chalk = require(`chalk`);
const ch_list = require(`../../discord structure/channels.json`)


async function SeasonalWinner(interaction, client) {
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
            .fetch("1132678509307904210") //ID коробки
            .catch(console.error);
        if (!roles.cache.has("1132678509307904210") && !roles.cache.has("567689925143822346")) return interaction.reply({
            content: `Вы не являетесь сезонным победителем, поэтому не можете открыть эту коробку!`,
            ephemeral: true
        }) //Проверка роли коробки || правления
        if (userData.cooldowns.seasonalWinner > Date.now()) //ДОБАВИТЬ В ДРУГИЕ(ГДЕ КУЛДАУН)
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Number(client.information.bot_color))
                        .setAuthor({
                            name: `Вы не можете использовать эту команду`
                        })
                        .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${prettyMilliseconds(userData.cooldowns.seasonalWinner - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}!`)
                ],
                ephemeral: true
            });
        await interaction.deferUpdate()
        //Лут из коробок
        //Случайный предмет
        //name - Название предмета
        //dropChanceLOOT - Шанс выпадения предмета
        //roleID - ID роли, которая связана с данным лутом.

        let { loot, act_exp } = require(`./Box loot/seasonalWinner.json`)
        //Опыт рангов (если необходимо)




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
\`Получено из коробки сезонного победителя.\`
╚═════════♡════════╝`
        );

        userData.exp += actExp //ДОБАВИТЬ В ДРУГИЕ

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


        //Отправка сообщения о луте

        const r_loot_msg = await interaction.guild.channels.cache.get(ch_list.box)
            .send({
                content: `◾ 🏆 ◾
<@${opener}> открывает коробку сезонного победителя...
╭────────۞────────╮
\`${loot[i_loot].name}\` (Шанс: \`${finalChance1}%\`)
${loot[i_loot].loot_description}.
╰────────۞────────╯
◾ 🏆 ◾`
            });
        if (!roles.cache.has(loot[i_loot].loot_roleID)) {
            await roles.add(loot[i_loot].loot_roleID).catch(console.error);
            await r_loot_msg.react("✅")
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
        userData.cooldowns.seasonalWinner = Date.now() + (1000 * 60 * 60 * 24 * 7) * (1 - (userData.perks.decrease_cooldowns * 0.1))
        if (userData.cd_remind.includes('seasonalWinner')) {
            let ITEM_ID = userData.cd_remind.findIndex(item_id => item_id == 'seasonalWinner')
            userData.cd_remind.splice(ITEM_ID, 1)
        }
        userData.save();
        client.ActExp(userData.userid)
        console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magentaBright(`[${interaction.user.tag} открыл сезонного победителя]`) + chalk.gray(`: +${act_exp[i_act].amount} опыта активности, ${loot[i_loot].name}`))

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
    SeasonalWinner
};