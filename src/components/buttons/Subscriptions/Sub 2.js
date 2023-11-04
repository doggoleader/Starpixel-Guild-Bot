const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const { execute } = require('../../../events/client/start_bot/ready');
const fetch = require(`node-fetch`);
const api = process.env.hypixel_apikey;
const { User } = require(`../../../schemas/userdata`)
const { Guild } = require(`../../../schemas/guilddata`)
const chalk = require(`chalk`);
const prettyMilliseconds = require(`pretty-ms`); //ДОБАВИТЬ В ДРУГИЕ
const ch_list = require(`../../../discord structure/channels.json`)
const linksInfo = require(`../../../discord structure/links.json`)

module.exports = {
    plugin: {
        id: "items",
        name: "Предметы"
    },
    data: {
        name: `sub_second`
    },

    async execute(interaction, client) {
        try {
            const { user, member, guild, channel } = interaction
            const userData = await User.findOne({ userid: user.id })
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: `❗ Отсутствует необходимая роль!`
                })
                .setDescription(`Вы не имеете роль \`${interaction.guild.roles.cache.get(`1007290181847613530`).name}\`!`)
                .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                .setColor(`DarkRed`)
                .setTimestamp(Date.now())
            if (!member.roles.cache.has(`1007290181847613530`)) return interaction.reply({
                embeds: [embed],
                ephemeral: true
            })

            const cd = new EmbedBuilder()
                .setColor(Number(linksInfo.bot_color))
                .setAuthor({
                    name: `Вы не можете использовать эту команду`
                })
                .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${prettyMilliseconds(userData.cooldowns.sub_2 - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}!`)
                .setTimestamp(Date.now())
                .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)

            if (userData.cooldowns.sub_2 > Date.now()) return interaction.reply({
                embeds: [cd],
                ephemeral: true
            });

            await interaction.deferUpdate()
            const loot = [
                {
                    group: 1,
                    name: `Маленькую коробку`,
                    roleID: `510932601721192458`,
                    chance: 35,
                    "rarity": "Uncommon",
                    "type": "Box",
                },
                {
                    group: 1,
                    name: `Мешочек`,
                    roleID: `819930814388240385`,
                    chance: 40,
                    "rarity": "Common",
                    "type": "Box",
                },
                {
                    group: 1,
                    name: `Большую коробку`,
                    roleID: `521248091853291540`,
                    chance: 25,
                    "rarity": "Rare",
                    "type": "Box",
                },
                {
                    group: 1,
                    name: `Огромную коробку`,
                    roleID: `992820494900412456`,
                    chance: 10,
                    "rarity": "Epic",
                    "type": "Box",
                },
                {
                    group: 1,
                    name: `Королевскую коробку`,
                    roleID: `584673040470769667`,
                    chance: 7,
                    "rarity": "Epic",
                    "type": "Box",
                }
            ]
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
            const msg = await interaction.guild.channels.cache.get(ch_list.box).send({
                content: `◾
${user} открывает коробку подписчика II уровня...
|———————~۞~———————|
\`${loot[i_loot].name}.\` (Шанс: \`${finalChance1}%\`)
Открой, чтобы получить награды.
|———————~۞~———————|
◾`
            })
            if (loot[i_loot].group == 1) {
                if (!member.roles.cache.has(loot[i_loot].roleID)) {
                    member.roles.add(loot[i_loot].roleID)
                    await msg.react(`✅`)
                } else {
                    if (userData.stacked_items.length < userData.upgrades.inventory_size) {
                        await userData.stacked_items.push(loot[i_loot].roleID)
                        await msg.react("✅")
                    } else {
                        await interaction.guild.channels.cache.get(ch_list.box).send({
                            content: `Мы не можем добавить предмет в ваш инвентарь, так как он переполнен. Чтобы увеличить вместительность своего инвентаря, перейдите в канал <#1141026403765211136>!`
                        })
                        await msg.react("🚫")
                    }
                }
            }



            userData.cooldowns.sub_2 = Date.now() + (1000 * 60 * 60 * 24 * 7)
            userData.save()



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
};