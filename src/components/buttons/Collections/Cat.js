const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ComponentType, ButtonStyle } = require('discord.js');
const fetch = require(`node-fetch`)
const { joinVoiceChannel } = require('@discordjs/voice');
const wait = require(`node:timers/promises`).setTimeout
const api = process.env.hypixel_apikey;
const { Temp } = require(`../../../schemas/temp_items`);
const { User } = require(`../../../schemas/userdata`)
const { Guild } = require(`../../../schemas/guilddata`)
const chalk = require(`chalk`);
const ch_list = require(`../../../discord structure/channels.json`)
const { isOneEmoji } = require(`is-emojis`);
const { calcCooldown } = require('../../../functions');

/**
 * 
 * @param {import("discord.js").ButtonInteraction} interaction Interaction
 * @param {import("../../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        const { guild, member, user } = interaction
        const guildData = await Guild.findOne({ id: guild.id })
        const userData = await User.findOne({ userid: user.id })
        let coll = [`1020400022350725122`, `1020400026045915167`, `1020400024397565962`]
        if (!member.roles.cache.has(coll[0]) || !member.roles.cache.has(coll[1]) || !member.roles.cache.has(coll[2])) return interaction.reply({
            content: `Вы не собрали полностью коллекцию Кота, поэтому не можете использовать эту команду!`,
            ephemeral: true
        })
        if (userData.cooldowns.cat > Date.now()) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(Number(client.information.bot_color))
                    .setAuthor({
                        name: `Вы не можете использовать эту команду`
                    })
                    .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${calcCooldown(userData.cooldowns.cat - Date.now())}!`)
            ],
            ephemeral: true
        });
        let values = [4, 5, 6, 7]
        let value = values[Math.floor(Math.random() * values.length)]
        let lasts = [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
        let last = lasts[Math.floor(Math.random() * lasts.length)]
        const temp1 = new Temp({
            userid: user.id,
            guildid: guild.id,
            extraInfo: `box_chances.legendary`,
            number: value,
            expire: Date.now() + (1000 * 60 * 60 * 24 * last)
        })
        temp1.save()
        const temp2 = new Temp({
            userid: user.id,
            guildid: guild.id,
            extraInfo: `box_chances.mythical`,
            number: value,
            expire: Date.now() + (1000 * 60 * 60 * 24 * last)
        })
        temp2.save()
        const temp3 = new Temp({
            userid: user.id,
            guildid: guild.id,
            extraInfo: `box_chances.RNG`,
            number: value,
            expire: Date.now() + (1000 * 60 * 60 * 24 * last)
        })
        temp3.save()

        userData.box_chances.legendary += value
        userData.box_chances.mythical += value
        userData.box_chances.RNG += value

        userData.cooldowns.cat = Date.now() + (1000 * 60 * 60 * 24 * 30) * (1 - (userData.perks.decrease_cooldowns * 0.1))
        if (userData.cd_remind.includes('cat')) {
            let ITEM_ID = userData.cd_remind.findIndex(item_id => item_id == 'cat')
            userData.cd_remind.splice(ITEM_ID, 1)
        }
        userData.save()
        const embed = new EmbedBuilder()
            .setColor(Number(client.information.bot_color))
            .setTitle(`Использована коллекция Кота`)
            .setTimestamp(Date.now())
            .setDescription(`${member} использовал **КОЛЛЕКЦИЮ КОТА**! 
Коллекция Кота позволяет своему владельцу увеличить шансы на выпадение более редких предметов из коробок.

**Награда**:
Шансы на легендарные предметы: \`${value}x на ${last} дн.\`
Шансы на мифические предметы: \`${value}x на ${last} дн.\`
Шансы на ультраредкие предметы: \`${value}x на ${last} дн.\``)
        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
        await interaction.guild.channels.cache.get(ch_list.main).send({
            embeds: [embed]
        })
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
        name: "cat_collection"
    },
    execute
}