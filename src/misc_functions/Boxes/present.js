const { SlashCommandBuilder, ActionRowBuilder, UserSelectMenuBuilder } = require('discord.js');

const { User } = require(`../../schemas/userdata`);
const chalk = require(`chalk`);
const ch_list = require(`../../discord structure/channels.json`)

const { changeProperty } = require('../../functions');


async function Present(interaction, client) {
    try {
        const { Guild } = require(`../../schemas/guilddata`)
        const guildData = await Guild.findOne({ id: interaction.guild.id })
        const user = interaction.member.user //ДОБАВИТЬ В ДРУГИЕ
        const userData = await User.findOne({ userid: user.id })



        const { roles } = interaction.member //Участник команды
        const role = await interaction.guild.roles  //Постоянная для role
            .fetch("925799156679856240") //ID коробки
            .catch(console.error);
        if (roles.cache.has("925799156679856240") || roles.cache.has("567689925143822346")) { //Проверка роли коробки || правления
            const timestamp = Math.round(interaction.createdTimestamp / 1000)
            const userSelect = new ActionRowBuilder()
                .addComponents(
                    new UserSelectMenuBuilder()
                        .setCustomId(`user_present`)
                        .setPlaceholder(`Выберите пользователя`)
                )
            const rr = await interaction.reply({
                content: `Выберите пользователя, который станет получателем подарка!`,
                ephemeral: true,
                components: [userSelect],
                fetchReply: true
            })
            const collector = rr.createMessageComponentCollector()
            collector.on('collect', async i => {
                const toReceive = await i.guild.members.fetch(i.values[0])
                if (toReceive.user.id == i.user.id) return i.reply({
                    content: `Вы не можете отправить подарок самому себе!`,
                    ephemeral: true
                })
                if (!toReceive.roles.cache.has(`504887113649750016`)) return i.reply({
                    content: `Вы не можете отправить подарок гостю гильдии!`,
                    ephemeral: true
                })
                if (toReceive.user.bot) return i.reply({
                    content: `Вы не можете отправить подарок боту!`,
                    ephemeral: true
                })
                await i.deferUpdate()
                const opener = interaction.member.id;
                await roles.remove(role).catch(console.error); //Удалить роль коробки
                let receivers = [
                    "opener",
                    "gifted",
                    "both",
                    "both",
                    "both"

                ]
                let receiver = receivers[Math.floor(Math.random() * receivers.length)]
                let userToReceive = []
                if (receiver == `opener`) {
                    userToReceive.push(i.member)
                } else if (receiver == `gifted`) {
                    userToReceive.push(toReceive)
                } else if (receiver == `both`) {
                    userToReceive.push(i.member)
                    userToReceive.push(toReceive)
                }
                //Лут из коробок
                //Случайный предмет
                //name - Название предмета
                //dropChanceLOOT - Шанс выпадения предмета
                //roleID - ID роли, которая связана с данным лутом.

                //Список предметов
                let { loot, act_exp } = require(`./Box loot/present.json`)
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

                const songs = [
                    `Новый год к нам мчится`,
                    `А снег идет`,
                    `Знает каждый снеговик снеговика`,
                    `Новый год, он раз в году!`,
                    `На свете есть Волшебный клей`,
                    `Наша елка — просто чудо`,
                    `Хорошо, что каждый год к нам приходит Новый год`,
                    `Не рубили елочку мы на Новый год`,
                    `Под Новый год, как в сказке, полным-полно чудес`,
                    `Снежинки спускаются с неба`,
                    `Белые снежинки кружатся с утра`,
                    `Праздник к нам приходит`,

                ]
                const r_song = songs[Math.floor(Math.random() * songs.length)]

                //Отправка сообщения о луте              
                const r_loot_msg = await i.guild.channels.cache.get(ch_list.box)
                    .send(
                        `<@${opener}> открывает подарок:

╔━═━︽︾︽︾🎅︾︽︾︽━═━╗
\`${loot[i_loot].loot_name}\` (Шанс: \`${finalChance1}%\`)
Получатель: ${userToReceive.join(`, `)}
${r_song}!
╚━═━︽︾︽︾🎅︾︽︾︽━═━╝`)
                userToReceive.forEach(async member => {



                    if (loot[i_loot].type == "Box" || userData.perks.store_items !== 0) {
                        if (loot[i_loot].loot_roleID.startsWith(`new_year`)) {

                            let usToReceive = await User.findOne({ userid: member.user.id })
                            await changeProperty(usToReceive.seasonal, loot[i_loot].loot_roleID, true)
                            await r_loot_msg.react("✅")
                            usToReceive.save()
                        } else if (!member.roles.cache.has(loot[i_loot].loot_roleID)) {
                            await member.roles.add(loot[i_loot].loot_roleID).catch(console.error);
                            await r_loot_msg.react("✅")
                        } else {
                            if (!loot[i_loot].loot_roleID.startsWith(`new_year`)) {
                                let usToReceive = await User.findOne({ userid: member.user.id })
                                if (userData.stacked_items.length < userData.upgrades.inventory_size) {
                                    await usToReceive.stacked_items.push(loot[i_loot].loot_roleID)
                                    await r_loot_msg.react("✅")
                                } else {
                                    await interaction.guild.channels.cache.get(ch_list.box).send({
                                        content: `Мы не можем добавить предмет в ваш инвентарь, так как он переполнен. Чтобы увеличить вместительность своего инвентаря, перейдите в канал <#1141026403765211136>!`
                                    })
                                    await r_loot_msg.react("🚫")
                                }
                                usToReceive.save()
                            }
                        }
                    } else {
                        if (loot[i_loot].loot_roleID.startsWith(`new_year`)) {
                            let usToReceive = await User.findOne({ userid: member.user.id })
                            await changeProperty(usToReceive.seasonal, loot[i_loot].loot_roleID, true)
                            await r_loot_msg.react("✅")
                            usToReceive.save()
                        } else if (!member.roles.cache.has(loot[i_loot].loot_roleID)) {
                            await member.roles.add(loot[i_loot].loot_roleID).catch(console.error);
                            await r_loot_msg.react("✅")
                        } else {
                            await r_loot_msg.react("🚫")
                        }
                    }


                })




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
\`Получено из подарка.\`
╚═════════♡════════╝`
                );
                userData.exp += actExp //ДОБАВИТЬ В ДРУГИЕ
                let p = [1, 2, 3]

                userData.seasonal.new_year.points += p[Math.floor(Math.random() * p.length)]
                userData.seasonal.new_year.opened_gifts += 1
                userData.save();
                client.ActExp(userData.userid)
                console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magentaBright(`[${interaction.user.tag} открыл подарок]`) + chalk.gray(`: +${act_exp[i_act].act_amount} опыта активности и ${loot[i_loot].loot_name}`))
                collector.stop()
            })
            collector.on('end', async err => {
                await interaction.deleteReply()
            })


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
    Present
};