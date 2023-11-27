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

        let role = `553637207911563264`
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
            .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${prettyMilliseconds(userData.cooldowns.spet - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}!`)

        if (userData.cooldowns.spet > Date.now()) return interaction.reply({
            embeds: [cd],
            ephemeral: true
        })
        let pet = [
            {
                dropChance: 25,
                name: "Он получает урок навыка \`Выращивание горных пород\`. 🌳"
            },
            {
                dropChance: 25,
                name: "Он получает урок навыка \`Быстрый рост растений\`. 🌳"
            },
            {
                dropChance: 25,
                name: "Он получает урок навыка \`Перемещение под землёй\`. 🌳"
            },
            {
                dropChance: 25,
                name: "Он не получает никакого урока."
            },
        ]


        try {
            await interaction.deferUpdate()

            let sum_act = 0;
            for (let i_act = 0; i_act < pet.length; i_act++) {
                sum_act += pet[i_act].dropChance;
            }
            let r_act = Math.floor(Math.random() * sum_act);
            let i_act = 0;
            for (let s = pet[0].dropChance; s <= r_act; s += pet[i_act].dropChance) {
                i_act++;
            }

            await interaction.guild.channels.cache.get(ch_list.elem).send(
                `:black_medium_small_square:
${user} отправился на обучение к Питомцу Земли 🐛.
╭──────────╮
${pet[i_act].name}
╰──────────╯
:black_medium_small_square:`
            );
            if (pet[i_act].name == `Он получает урок навыка \`Выращивание горных пород\`. 🌳` && userData.elements.mountains < 1) {
                userData.elements.mountains += 1
                console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magenta(`[Получен навык]`) + chalk.white(`: ${member.user.username} получил навык ${pet[i_act].name}`))
            } else if (pet[i_act].name == `Он получает урок навыка \`Быстрый рост растений\`. 🌳` && userData.elements.fast_grow < 1) {
                userData.elements.fast_grow += 1
                console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magenta(`[Получен навык]`) + chalk.white(`: ${member.user.username} получил навык ${pet[i_act].name}`))
            } else if (pet[i_act].name == `Он получает урок навыка \`Перемещение под землёй\`. 🌳` && userData.elements.underground < 1) {
                userData.elements.underground += 1
                console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magenta(`[Получен навык]`) + chalk.white(`: ${member.user.username} получил навык ${pet[i_act].name}`))
            } else {
                console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magenta(`[Получен навык]`) + chalk.white(`: ${member.user.username} получил навык ${pet[i_act].name}`))
            }
            userData.cooldowns.spet = Date.now() + (1000 * 60 * 60 * 24 * 4) * (1 - (userData.perks.decrease_cooldowns * 0.1))
            if (userData.cd_remind.includes('spet')) {
                let ITEM_ID = userData.cd_remind.findIndex(item_id => item_id == 'spet')
                userData.cd_remind.splice(ITEM_ID, 1)
            }
            userData.save()
        } catch (error) {
            console.log(chalk.blackBright(`[${new Date()}]`) + chalk.red(`[Превышен лимит навыков]`) + chalk.white(`: ${member.user.username} превысил количество навыка ${pet[i_act].name}`))
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
        name: `pets_spet`
    },
    execute

};