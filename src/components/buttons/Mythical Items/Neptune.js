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
        role = `780487592859795456`
        const no_role = new EmbedBuilder()
            .setAuthor({
                name: `❗ Отсутствует необходимая роль!`
            })
            .setDescription(`Вы должны иметь роль \`${interaction.guild.roles.cache.get(role).name}\`, чтобы использовать данную команду!`)
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
            .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${calcCooldown(userData.cooldowns.neptune - Date.now())}!`)

        if (userData.cooldowns.neptune > Date.now()) return interaction.reply({
            embeds: [cd],
            ephemeral: true
        })

        const ramkas = [
            {
                name: `РАМКА ДЛЯ НИКА ❦`,
                r1: `❦`,
                r2: `❦`
            },
            {
                name: `РАМКА ДЛЯ НИКА ஐ`,
                r1: `ஐ`,
                r2: `ஐ`
            },
            {
                name: `РАМКА ДЛЯ НИКА ❀`,
                r1: `❀`,
                r2: `❀`
            },
            {
                name: `РАМКА ДЛЯ НИКА ❉`,
                r1: `❉`,
                r2: `❉`
            },
            {
                name: `РАМКА ДЛЯ НИКА ✾`,
                r1: `✾`,
                r2: `✾`
            },
            {
                name: `РАМКА ДЛЯ НИКА ◉`,
                r1: `◉`,
                r2: `◉`
            },
            {
                name: `РАМКА ДЛЯ НИКА ⊙`,
                r1: `⊙`,
                r2: `⊙`
            },
            {
                name: `РАМКА ДЛЯ НИКА ට`,
                r1: `ට`,
                r2: `ට`
            },
            {
                name: `РАМКА ДЛЯ НИКА 益`,
                r1: `益`,
                r2: `益`
            },
            {
                name: `РАМКА ДЛЯ НИКА ௸`,
                r1: `௸`,
                r2: `௸`
            },
            {
                name: `РАМКА ДЛЯ НИКА ௵`,
                r1: `௵`,
                r2: `௵`
            }
        ]

        const r_ramka = ramkas[Math.floor(Math.random() * ramkas.length)]
        const reply = await interaction.reply({
            content: `◾
🧥 ${user}... Нептун зовёт тебя.
В этот раз он даёт тебе \`${r_ramka.name}\`!
:crystal_ball: Необходим ранг \"Звёздочка гильдии\".
◾`,
            fetchReply: true,
            ephemeral: true
        });

        if (!userData.cosmetics_storage.ramkas.includes({ ramka1: r_ramka.r1, ramka2: r_ramka.r2 })) {
            userData.cosmetics_storage.ramkas.push({ ramka1: r_ramka.r1, ramka2: r_ramka.r2 })
        }

        userData.cooldowns.neptune = Date.now() + (1000 * 60 * 60 * 24 * 30) * (1 - (userData.perks.decrease_cooldowns * 0.1))
        if (userData.cd_remind.includes('neptune')) {
            let ITEM_ID = userData.cd_remind.findIndex(item_id => item_id == 'neptune')
            userData.cd_remind.splice(ITEM_ID, 1)
        }
        userData.save()
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
        name: "myth_neptune"
    },
    execute
}