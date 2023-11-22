const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

const fetch = require(`node-fetch`);
const api = process.env.hypixel_apikey;
const { User } = require(`../../../schemas/userdata`)
const { Guild } = require(`../../../schemas/guilddata`)
const chalk = require(`chalk`);
const prettyMilliseconds = require(`pretty-ms`); //ДОБАВИТЬ В ДРУГИЕ
const ch_list = require(`../../../discord structure/channels.json`)
const linksInfo = require(`../../../discord structure/links.json`);
/**
 * 
 * @param {import("discord.js").ButtonInteraction} interaction Interaction
 * @param {import("../../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        const { user, member, guild, channel } = interaction
        const userData = await User.findOne({ userid: user.id })

        const embed = new EmbedBuilder()
            .setAuthor({
                name: `❗ Отсутствует необходимая роль!`
            })
            .setDescription(`Вы не имеете роль \`${interaction.guild.roles.cache.get(`850336260265476096`).name}\`!`)
            .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
            .setColor(`DarkRed`)
            .setTimestamp(Date.now())
        if (!member.roles.cache.has(`850336260265476096`)) return interaction.reply({
            embeds: [embed],
            ephemeral: true
        })

        const cd = new EmbedBuilder()
            .setColor(Number(linksInfo.bot_color))
            .setAuthor({
                name: `Вы не можете использовать эту команду`
            })
            .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${prettyMilliseconds(userData.cooldowns.premium - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}!`)
            .setTimestamp(Date.now())
            .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)

        if (userData.cooldowns.premium > Date.now()) return interaction.reply({
            embeds: [cd],
            ephemeral: true
        });
        await interaction.deferUpdate()
        const loot = [
            {
                group: 1,
                name: `Жуткая коробка`,
                roleID: `893932177799135253`,
                chance: 150,
                "rarity": "Rare",
                "type": "Box",
            },
            {
                group: 1,
                name: `Новогодний подарок`,
                roleID: `925799156679856240`,
                chance: 150,
                "rarity": "Rare",
                "type": "Box",
            },
            {
                group: 1,
                name: `Летняя коробка`,
                roleID: `1104095303054934168`,
                chance: 150,
                "rarity": "Rare",
                "type": "Box",
            },
            {
                group: 1,
                name: `Пасхальное яйцо`,
                roleID: `1007718117809606736`,
                chance: 150,
                "rarity": "Rare",
                "type": "Box",
            },
            {
                group: 1,
                name: `Большая коробка`,
                roleID: `521248091853291540`,
                chance: 400,
                "rarity": "Common",
                "type": "Box",
            },
            {
                group: 1,
                name: `Коробка активности`,
                roleID: `983435186920366100`,
                chance: 250,
                "rarity": "Uncommon",
                "type": "Box",
            },
            {
                group: 1,
                name: `Огромная коробка`,
                roleID: `992820494900412456`,
                chance: 100,
                "rarity": "Epic",
                "type": "Box",
            },
            {
                group: 1,
                name: `Королевская коробка`,
                roleID: `584673040470769667`,
                chance: 70,
                "rarity": "Legendary",
                "type": "Box",
            },
            {
                group: 1,
                name: `Сокровища`,
                roleID: `595966177969176579`,
                chance: 30,
                "rarity": "Mythical",
                "type": "Box",
            },
            {
                group: 1,
                name: `Подарок судьбы`,
                roleID: `781069821953441832`,
                chance: 10,
                "rarity": "Mythical",
                "type": "Box",
            },
            {
                group: 1,
                name: `Загадочная коробка`,
                roleID: `992820488298578041`,
                chance: 1,
                "rarity": "RNG",
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
            content: `◾:star:◾
${user} открывает премиум коробку...
|—————~ஜ۩۞۩ஜ~—————|
\`${loot[i_loot].name}.\` (Шанс: \`${finalChance1}%\`)
Открой, чтобы получить награды.
|—————~ஜ۩۞۩ஜ~—————|
◾:star:◾`
        })
        if (loot[i_loot].group == 1) {
            if (!member.roles.cache.has(loot[i_loot].roleID)) {
                await member.roles.add(loot[i_loot].roleID)
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

        let rumbik = [
            {
                rumb_amount: 40,
                dropChanceRUMB: 49
            },
            {
                rumb_amount: 50,
                dropChanceRUMB: 33
            },
            {
                rumb_amount: 60,
                dropChanceRUMB: 17
            },
            {
                rumb_amount: 70,
                dropChanceRUMB: 1
            },

        ]

        //Рандом - румбики
        let sum_rumb = 0;
        for (let i_rumb = 0; i_rumb < rumbik.length; i_rumb++) {
            sum_rumb += rumbik[i_rumb].dropChanceRUMB;
        }
        let r_rumbik = Math.floor(Math.random() * sum_rumb);
        let i_rumb = 0;
        for (let s = rumbik[0].dropChanceRUMB; s <= r_rumbik; s += rumbik[i_rumb].dropChanceRUMB) {
            i_rumb++;
        }

        //Сообщение - румбики 
        let rumb_amount = rumbik[i_rumb].rumb_amount * userData.pers_rumb_boost
        interaction.guild.channels.cache.get(ch_list.rumb).send(
            `╔═════════♡════════╗
${user} +${rumb_amount}<:Rumbik:883638847056003072>
\`Получено из премиум-коробки.\`
╚═════════♡════════╝`
        );
        if (userData.rank_number >= 3) {
            userData.rumbik += rumb_amount
            userData.progress.items.find(it => it.name == 'RUMBIKS_TOTAL').total_items += rumb_amount
        } else {
            userData.rumbik += 0
        }


        userData.cooldowns.premium = Date.now() + (1000 * 60 * 60 * 24 * 7)
        userData.save();
        client.ProgressUpdate(member);


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
    plugin: {
        id: "items",
        name: "Предметы"
    },
    data: {
        name: `sub_premium`
    },
    execute

};