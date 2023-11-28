const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require(`node-fetch`);
const api = process.env.hypixel_apikey;
const { User } = require(`../../../schemas/userdata`)
const chalk = require(`chalk`);
const prettyMilliseconds = require(`pretty-ms`); //ДОБАВИТЬ В ДРУГИЕ
const ch_list = require(`../../../discord structure/channels.json`)
/**
 * 
 * @param {import("discord.js").ButtonInteraction} interaction Interaction
 * @param {import("../../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        const { member, user, channel, guild } = interaction
        const userData = await User.findOne({ userid: user.id })

        let role = `930169143347523604`
        const no_role = new EmbedBuilder()
            .setAuthor({
                name: `❗ Отсутствует необходимая роль!`
            })
            .setDescription(`Вы не имеете роль \`${interaction.guild.roles.cache.get(role).name}\`!`)
            .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
            .setColor(`DarkRed`)
            .setTimestamp(Date.now())
        if (!member.roles.cache.has(role)) return interaction.reply({
            embeds: [no_role],
            ephemeral: true
        })

        const cd = new EmbedBuilder()
            .setColor(Number(client.information.bot_color))
            .setAuthor({
                name: `Вы не можете использовать эту команду`
            })
            .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${prettyMilliseconds(userData.cooldowns.earth - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}!`)

        if (userData.cooldowns.earth > Date.now()) return interaction.reply({
            embeds: [cd],
            ephemeral: true
        })

        try {
            await interaction.deferUpdate()
            let pet = [
                {
                    dropChance: 25,
                    name: "❕ 🎁 МАЛЕНЬКАЯ /small",
                    roleID: `510932601721192458`
                },
                {
                    dropChance: 40,
                    name: "❕ 💰 МЕШОЧЕК /bag",
                    roleID: `819930814388240385`
                },
                {
                    dropChance: 25,
                    name: "❕ 🎁 БОЛЬШАЯ /big",
                    roleID: `521248091853291540`
                },
                {
                    dropChance: 15,
                    name: "❕ 🎁 КОРОЛЕВСКАЯ /king",
                    roleID: `584673040470769667`
                },


            ]

            let sum_act = 0;
            for (let i_act = 0; i_act < pet.length; i_act++) {
                sum_act += pet[i_act].dropChance;
            }
            let r_act = Math.floor(Math.random() * sum_act);
            let i_act = 0;
            for (let s = pet[0].dropChance; s <= r_act; s += pet[i_act].dropChance) {
                i_act++;
            }
            let allChances = 0;
            for (let loo of pet) {
                allChances += loo.dropChance
            }
            let finalChance1 = ((pet[i_act].dropChance / allChances) * 100).toFixed(1)

            const r_loot_msg = await interaction.guild.channels.cache.get(ch_list.box).send(
                `:black_medium_small_square:
🌳 ${user} использует силы Стихии Земли:
╭─────✿✿✿─────╮
Он откапывает из-под земли \`${pet[i_act].name}\` (Шанс: \`${finalChance1}\`)
╰─────✿✿✿─────╯
:black_medium_small_square:`
            );
            userData.cooldowns.earth = Date.now() + (1000 * 60 * 60 * 24 * 7) * (1 - (userData.perks.decrease_cooldowns * 0.1))
            if (userData.cd_remind.includes('earth')) {
                let ITEM_ID = userData.cd_remind.findIndex(item_id => item_id == 'earth')
                userData.cd_remind.splice(ITEM_ID, 1)
            }
            if (!member.roles.cache.has(pet[i_act].roleID)) {
                await member.roles.add(pet[i_act].roleID).catch(console.error);
                await r_loot_msg.react("✅")
            } else {
                if (userData.stacked_items.length < userData.upgrades.inventory_size) {
                    await userData.stacked_items.push(pet[i_act].roleID)
                } else {
                    await interaction.guild.channels.cache.get(ch_list.box).send({
                        content: `Мы не можем добавить предмет в ваш инвентарь, так как он переполнен. Чтобы увеличить вместительность своего инвентаря, перейдите в канал <#1141026403765211136>!`
                    })
                    await r_loot_msg.react("🚫")
                }
            };
            userData.save()
        } catch (error) {
            console.log(chalk.blackBright(`[${new Date()}]`) + chalk.red(`[Ошибка]`) + chalk.white(`: ${member.user.username} получил ошибку при выдаче навыка`))
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
    plugin: {
        id: "items",
        name: "Предметы"
    },
    data: {
        name: `elem_earth`
    },
    execute

};