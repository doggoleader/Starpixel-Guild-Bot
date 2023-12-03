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
        let coll = [`1020400043154485278`, `1020400047260696647`, `1020400045251633163`]
        if (!member.roles.cache.has(coll[0]) || !member.roles.cache.has(coll[1]) || !member.roles.cache.has(coll[2])) return interaction.reply({
            content: `Вы не собрали полностью коллекцию Лисы, поэтому не можете использовать эту команду!`,
            ephemeral: true
        })
        if (userData.cooldowns.fox > Date.now()) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(Number(client.information.bot_color))
                    .setAuthor({
                        name: `Вы не можете использовать эту команду`
                    })
                    .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${prettyMilliseconds(userData.cooldowns.fox - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}!`)
            ],
            ephemeral: true
        });
        let values = [50, 75, 90, 100, 150, 180, 200, 210, 230, 250]
        let value = values[Math.floor(Math.random() * values.length)]

        userData.tickets += value
        userData.progress.items.find(it => it.name == 'TICKETS_TOTAL').total_items += value
        userData.cooldowns.fox = Date.now() + (1000 * 60 * 60 * 24 * 30) * (1 - (userData.perks.decrease_cooldowns * 0.1))
        if (userData.cd_remind.includes('fox')) {
            let ITEM_ID = userData.cd_remind.findIndex(item_id => item_id == 'fox')
            userData.cd_remind.splice(ITEM_ID, 1)
        }
        userData.save()
        const embed = new EmbedBuilder()
            .setColor(Number(client.information.bot_color))
            .setTitle(`Использована коллекция Лисы`)
            .setTimestamp(Date.now())
            .setDescription(`${member} использовал **КОЛЛЕКЦИЮ ЛИСЫ**! 
Коллекция Лисы позволяет своему владельцу раз в месяц получать определённое количество билетов.

**Награда**:
Билеты: \`${value}x\``)
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
        name: "fox_collection"
    },
    execute
}