const { Temp } = require(`../../../schemas/temp_items`)
const { User } = require(`../../../schemas/userdata`)
const { Guild } = require(`../../../schemas/guilddata`)
const chalk = require(`chalk`)
const fetch = require(`node-fetch`)
const cron = require(`node-cron`)
const ch_list = require(`../../../discord structure/channels.json`)
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js")

const { achievementStats, found, getProperty } = require(`../../../functions`)
const api = process.env.hypixel_apikey
/**
 * 
 * @param {import("discord.js").StringSelectMenuInteraction} interaction Interaction
 * @param {import("../../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        const guildData = await Guild.findOne({ id: interaction.guild.id })
        if (guildData.plugins.seasonal === false) return interaction.reply({ content: `Данный плагин отключён! Попробуйте позже!`, ephemeral: true })
        if (guildData.seasonal.summer.enabled === false) return interaction.reply({
            content: `Сейчас не время для Лета! Попробуйте сделать это в период **1 июня по 31 августа**!`,
            ephemeral: true
        })
        const userData = await User.findOne({ userid: interaction.user.id, guildid: interaction.guild.id })
        let symb, postfix, price, name, rank = userData.rank_number;

        switch (interaction.values[0]) {
            case "set_1": {
                symb = `🌴`, postfix = `♥⁠╣⁠[⁠-⁠_⁠-⁠]⁠╠⁠♥`, price = 50, name = `Набор "Люблю Лето!" (\`🌴\` + \`♥⁠╣⁠[⁠-⁠_⁠-⁠]⁠╠⁠♥\`)`
            }
                break;
            case "set_2": {
                symb = `🌡️`, postfix = `(⁠≧⁠▽⁠≦⁠)`, price = 60, name = `Набор "Я весь горю!" (\`🌡️\` + \`(⁠≧⁠▽⁠≦⁠)\`)`
            }
                break;
            case "set_3": {
                symb = `☀️`, postfix = `┏⁠(⁠＾⁠0⁠＾⁠)⁠┛`, price = 70, name = `Набор "Фанат Солнца!" (\`☀️\` + \`┏⁠(⁠＾⁠0⁠＾⁠)⁠┛\`)`
            }
                break;
            case "set_4": {
                symb = `🌊`, postfix = `ಠ⁠ಗ⁠ಠ`, price = 80, name = `Набор "Остывшее море!" (\`🌊\` + \`ಠ⁠ಗ⁠ಠ\`)`
            }
                break;
            case "set_5": {
                symb = `🌅`, postfix = `ಥ⁠╭⁠╮⁠ಥ`, price = 100, name = `Набор "Последний рассвет!" (\`🌅\` + \`ಥ⁠╭⁠╮⁠ಥ\`)`
            }
                break;
            case "set_6": {
                symb = `🌞`, postfix = `(⁠☞⁠^⁠o⁠^⁠)⁠ ⁠☞`, price = 150, name = `Набор "Любимчик Солнца!" (\`🌞\` + \`(⁠☞⁠^⁠o⁠^⁠)⁠ ⁠☞\`)`
            }
                break;

            default:
                break;
        }
        if (rank < 8 || userData.seasonal.summer.quests_completed < 15) {
            price = Math.round(price / 2)
            if (userData.seasonal.summer.points < price) return interaction.reply({
                content: `Для покупки \`${symb}\` вам необходимо минимум ${price} очков! У вас на данный момент ${userData.seasonal.summer.points} очков. 
                    
\*Постификс не учитывается, т.к. ваш ранг ниже Лорда гильдии или вы выполнили менее 15 летних квестов!`,
                ephemeral: true
            })
            userData.seasonal.summer.points -= price
            userData.seasonal.summer.su_cosm = true
            userData.displayname.symbol = symb
            if (!userData.cosmetics_storage.symbols.includes(symb)) {
                userData.cosmetics_storage.symbols.push(symb)
            }
            userData.save()
            await interaction.reply({
                content: `Вы приобрели ${name} за ${price} летних очков! В скором времени данный значок появится в вашем никнейме! Если этого не произойдёт в течение 15 минут, обратитесь в вопрос-модерам!
                    
\*Постификс не учитывается, т.к. ваш ранг ниже Лорда гильдии или вы выполнили менее 15 летних квестов!`,
                ephemeral: true
            })
        } else if (rank >= 8 && userData.seasonal.summer.quests_completed >= 15) {

            if (userData.seasonal.summer.points < price) return interaction.reply({
                content: `Для покупки \`${symb}\` + \`${postfix}\` вам необходимо минимум ${price} очков! У вас на данный момент ${userData.seasonal.summer.points} очков.`,
                ephemeral: true
            })
            userData.seasonal.summer.points -= price
            userData.seasonal.summer.su_cosm = true
            userData.displayname.symbol = symb
            if (!userData.cosmetics_storage.symbols.includes(symb)) {
                userData.cosmetics_storage.symbols.push(symb)
            }
            userData.displayname.suffix = postfix
            if (!userData.cosmetics_storage.suffixes.includes(postfix)) {
                userData.cosmetics_storage.suffixes.push(postfix)
            }
            userData.save()
            await interaction.reply({
                content: `Вы приобрели ${name} за ${price} летних очков! В скором времени данный значок появится в вашем никнейме! Если этого не произойдёт в течение 15 минут, обратитесь в вопрос-модерам!`,
                ephemeral: true
            })
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
        id: "seasonal",
        name: "Сезонное"
    },
    data: {
        name: `season_summer_shop`
    },
    execute
}
