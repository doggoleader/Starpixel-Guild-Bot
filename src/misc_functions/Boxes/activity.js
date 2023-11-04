const { SlashCommandBuilder } = require('discord.js');
const { User } = require(`../../schemas/userdata`);
const chalk = require(`chalk`);
const ch_list = require(`../../discord structure/channels.json`)
const linksInfo = require(`../../discord structure/links.json`)

async function Activity(interaction, client) {
    try {


        const user = interaction.member.user //ДОБАВИТЬ В ДРУГИЕ
        const userData = await User.findOne({ userid: user.id })



        const { roles } = interaction.member //Участник команды
        const role = await interaction.guild.roles  //Постоянная для role
            .fetch("983435186920366100") //ID коробки
            .catch(console.error);
        if (roles.cache.has("983435186920366100") || roles.cache.has("567689925143822346")) { //Проверка роли коробки || правления
            const cmd_name = `activity` //Название команды
            await interaction.deferUpdate()
            const timestamp = Math.round(interaction.createdTimestamp / 1000)
            const opener = interaction.member;
            await roles.remove(role).catch(console.error); //Удалить роль коробки


            //Лут из коробок
            //Случайный предмет
            //name - Название предмета
            //dropChanceLOOT - Шанс выпадения предмета
            //roleID - ID роли, которая связана с данным лутом.

            //Список предметов
            let { loot } = require(`./Box loot/activity.json`);

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
${opener} открывает коробку активности.
╭═────═⌘═────═╮
\`${loot[i_loot].loot_name}\` (Шанс: \`${finalChance1}%\`)
╰═────═⌘═────═╯
◾`)
            if (loot[i_loot].id == 1) {
                if (userData.perks.sell_items < 1) {
                    userData.perks.sell_items += 1
                    await r_loot_msg.react(`✅`)
                } else await r_loot_msg.react(`🚫`)

            } else if (loot[i_loot].id == 2) {
                if (userData.perks.change_items < 1) {
                    userData.perks.change_items += 1
                    await r_loot_msg.react(`✅`)
                } else await r_loot_msg.react(`🚫`)

            } else if (loot[i_loot].id == 3) {
                if (userData.perks.rank_boost < 6) {
                    userData.perks.rank_boost += 1
                    await r_loot_msg.react(`✅`)
                } else await r_loot_msg.react(`🚫`)

            } else if (loot[i_loot].id == 4) {
                if (userData.perks.king_discount < 4) {
                    userData.perks.king_discount += 1
                    await r_loot_msg.react(`✅`)
                } else await r_loot_msg.react(`🚫`)

            } else if (loot[i_loot].id == 5) {
                if (userData.perks.act_discount < 3) {
                    userData.perks.act_discount += 1
                    await r_loot_msg.react(`✅`)
                } else await r_loot_msg.react(`🚫`)

            } else if (loot[i_loot].id == 6) {
                if (userData.perks.shop_discount < 4) {
                    userData.perks.shop_discount += 1
                    await r_loot_msg.react(`✅`)
                } else await r_loot_msg.react(`🚫`)

            } else if (loot[i_loot].id == 7) {
                if (userData.perks.temp_items < 1) {
                    userData.perks.temp_items += 1
                    await r_loot_msg.react(`✅`)
                } else await r_loot_msg.react(`🚫`)

            } else if (loot[i_loot].id == 8) {
                if (userData.perks.ticket_discount < 5) {
                    userData.perks.ticket_discount += 1
                    await r_loot_msg.react(`✅`)
                } else await r_loot_msg.react(`🚫`)

            } else if (loot[i_loot].id == 9) {
                if (userData.perks.store_items < 1) {
                    userData.perks.store_items += 1
                    await r_loot_msg.react(`✅`)
                } else await r_loot_msg.react(`🚫`)

            } else {
                await r_loot_msg.react(`❔`)
                await r_loot_msg.reply(`Произошла неизвестная ошибка!`)
            }

            userData.save();
            console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magentaBright(`[${interaction.user.tag} открыл коробку активности]`) + chalk.gray(`: +${loot[i_loot].loot_name}`))

        } else {
            await interaction.reply({
                content: `У вас отсутствует коробка \`${role.name}\`!`,
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
    Activity
};