const { Birthday } = require(`../../schemas/birthday`)
const { Temp } = require(`../../schemas/temp_items`)
const { User } = require(`../../schemas/userdata`)
const chalk = require(`chalk`)
const cron = require(`node-cron`)
const { EmbedBuilder } = require("discord.js")
const ch_list = require(`../../discord structure/channels.json`)
const linksInfo = require(`../../discord structure/links.json`)
const { Guild } = require("../../schemas/guilddata")
const { checkPlugin } = require("../../functions");
const plugin = {
    id: "items",
    name: "Предметы"
}

module.exports = (client) => {
    client.DailyEvents = async () => {
        try {
            const day = new Date().getDay()
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", plugin.id)) return;
            const guildData = await Guild.findOne({
                id: guild.id
            })
            const main = await guild.channels.fetch(ch_list.main)
            switch (day) {
                case 0: {
                    guildData.global_settings.shop_prices = 1.25
                    guildData.save()
                    const embed = new EmbedBuilder()
                        .setColor(Number(linksInfo.bot_color))
                        .setTimestamp(Date.now())
                        .setDescription(`## Событие на сегодня
Все цены в магазинах гильдии повысились на 25%!`)
                    await main.send({
                        embeds: [embed]
                    })
                }
                    break;
                case 1: {
                    guildData.global_settings.shop_prices = 1
                    guildData.save()
                }
                    break;
                case 2: {
                    
                }
                    break;
                case 3: {
                    guildData.global_settings.shop_prices = 0.95
                    guildData.save()
                    const embed = new EmbedBuilder()
                        .setColor(Number(linksInfo.bot_color))
                        .setTimestamp(Date.now())
                        .setDescription(`## Событие на сегодня
Все цены в магазинах гильдии понизились на 5%!`)
                    await main.send({
                        embeds: [embed]
                    })
                }
                    break;
                case 4: {
                    guildData.global_settings.shop_prices = 1
                    guildData.save()
                }
                    break;
                case 5: {

                }
                    break;
                case 6: {

                }
                    break;

                default:
                    break;
            }
        } catch (e) {
            const admin = await client.users.fetch(`491343958660874242`)
            console.log(e)
            var path = require('path');
            var scriptName = path.basename(__filename);
            await admin.send(`Произошла ошибка!`)
            await admin.send(`=> ${e}.
**Файл**: ${scriptName}`)
            await admin.send(`◾`)
        }

    }
}