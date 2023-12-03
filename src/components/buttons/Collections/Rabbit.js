const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ComponentType, ButtonStyle } = require('discord.js');
const fetch = require(`node-fetch`)
const { joinVoiceChannel } = require('@discordjs/voice');
const wait = require(`node:timers/promises`).setTimeout
const api = process.env.hypixel_apikey;
const { Temp } = require(`../../../schemas/temp_items`);
const { User } = require(`../../../schemas/userdata`)
const { Guild } = require(`../../../schemas/guilddata`)
const chalk = require(`chalk`);
const prettyMilliseconds = require(`pretty-ms`); //ДОБАВИТЬ В ДРУГИЕ
const ch_list = require(`../../../discord structure/channels.json`)
const { isOneEmoji } = require(`is-emojis`)

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
        let coll = [`1020400030575763587`, `1020400034853957713`, `1020400032651952168`]
        if (!member.roles.cache.has(coll[0]) || !member.roles.cache.has(coll[1]) || !member.roles.cache.has(coll[2])) return interaction.reply({
            content: `Вы не собрали полностью коллекцию Кролика, поэтому не можете использовать эту команду!`,
            ephemeral: true
        })
        if (userData.cooldowns.rabbit > Date.now()) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(Number(client.information.bot_color))
                    .setAuthor({
                        name: `Вы не можете использовать эту команду`
                    })
                    .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${prettyMilliseconds(userData.cooldowns.rabbit - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}!`)
            ],
            ephemeral: true
        });
        let values = [5, 6, 7, 8, 9, 10, 11]
        let value = values[Math.floor(Math.random() * values.length)]
        let lasts = [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
        let last = lasts[Math.floor(Math.random() * lasts.length)]
        const temp = new Temp({
            userid: user.id,
            guildid: guild.id,
            extraInfo: `pers_rank_boost`,
            number: value,
            expire: Date.now() + (1000 * 60 * 60 * 24 * last)
        })
        temp.save()

        userData.pers_rank_boost += value
        userData.cooldowns.rabbit = Date.now() + (1000 * 60 * 60 * 24 * 30) * (1 - (userData.perks.decrease_cooldowns * 0.1))
        if (userData.cd_remind.includes('rabbit')) {
            let ITEM_ID = userData.cd_remind.findIndex(item_id => item_id == 'rabbit')
            userData.cd_remind.splice(ITEM_ID, 1)
        }
        userData.save()
        const embed = new EmbedBuilder()
            .setColor(Number(client.information.bot_color))
            .setTitle(`Использована коллекция Кролика`)
            .setTimestamp(Date.now())
            .setDescription(`${member} использовал **КОЛЛЕКЦИЮ КРОЛИКА**! 
Коллекция Кролика позволяет своему владельцу увеличить множитель опыта рангов в несколько раз.

**Награда**:
Множитель опыта рангов: \`${value}x на ${last} дн.\``)
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
        name: "rabbit_collection"
    },
    execute
}