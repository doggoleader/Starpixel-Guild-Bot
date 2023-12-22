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
        let role = `597746062798880778`
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
            .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${calcCooldown(userData.cooldowns.venera - Date.now())}!`)

        if (userData.cooldowns.venera > Date.now()) return interaction.reply({
            embeds: [cd],
            ephemeral: true
        })

        const cosmetics = [
            {
                name: `КОСМЕТИЧЕСКИЙ ЭМОДЗИ 💀`,
                symbol: `💀`
            },
            {
                name: `КОСМЕТИЧЕСКИЙ  ЗНАЧОК 👻`,
                symbol: `👻`
            },
            {
                name: `КОСМЕТИЧЕСКИЙ ЭМОДЗИ 🤡`,
                symbol: `🤡`
            },
            {
                name: `КОСМЕТИЧЕСКИЙ ЭМОДЗИ 🐠`,
                symbol: `🐠`
            },
            {
                name: `КОСМЕТИЧЕСКИЙ ЭМОДЗИ 🦴`,
                symbol: `🦴`
            },
            {
                name: `КОСМЕТИЧЕСКИЙ ЭМОДЗИ 🥕`,
                symbol: `🥕`
            },
            {
                name: `КОСМЕТИЧЕСКИЙ ЭМОДЗИ 🧀`,
                symbol: `🧀`
            },
            {
                name: `КОСМЕТИЧЕСКИЙ ЭМОДЗИ 📦`,
                symbol: `📦`
            },
            {
                name: `КОСМЕТИЧЕСКИЙ ЭМОДЗИ 💎`,
                symbol: `💎`
            },
            {
                name: `КОСМЕТИЧЕСКИЙ ЭМОДЗИ 🏆`,
                symbol: `🏆`
            },
            {
                name: `КОСМЕТИЧЕСКИЙ ЭМОДЗИ 🛒`,
                symbol: `🛒`
            },
            {
                name: `КОСМЕТИЧЕСКИЙ ЭМОДЗИ 🔒`,
                symbol: `🔒`
            }

        ]
        let r_cosm = cosmetics[Math.floor(Math.random() * cosmetics.length)]


        const reply = await interaction.reply({
            content: `:earth_americas: :bust_in_silhouette: :anchor: :star: :dash:
${user} обращается к Венере.
Она дарит ему легендарный косметический эмодзи \`${r_cosm.name}\`.
:beginner: Необходим ранг \"Чемпион гильдии\".
:earth_americas: :bust_in_silhouette: :anchor: :star: :dash:`,
            ephemeral: true,
            fetchReply: true
        })
        if (!userData.cosmetics_storage.symbols.includes(r_cosm.symbol)) {
            userData.cosmetics_storage.symbols.push(r_cosm.symbol)
        }

        userData.cooldowns.venera = Date.now() + (1000 * 60 * 60 * 24 * 30) * (1 - (userData.perks.decrease_cooldowns * 0.1))
        if (userData.cd_remind.includes('venera')) {
            let ITEM_ID = userData.cd_remind.findIndex(item_id => item_id == 'venera')
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
        name: "myth_ven"
    },
    execute
}