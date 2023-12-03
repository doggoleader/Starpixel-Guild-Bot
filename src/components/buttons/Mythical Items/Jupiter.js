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
        let role = `597746054808731648`
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
            .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${prettyMilliseconds(userData.cooldowns.jupiter - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}!`)

        if (userData.cooldowns.jupiter > Date.now()) return interaction.reply({
            embeds: [cd],
            ephemeral: true
        })
        const rewards = [
            {
                name: `🎁 КОРОЛЕВСКАЯ /king`,
                roleID: `584673040470769667`,
            },
            {
                name: `💰 МЕШОЧЕК /bag`,
                roleID: `819930814388240385`,
            },
            {
                name: `🎁 БОЛЬШАЯ /big`,
                roleID: `521248091853291540`,
            },
            {
                name: `🎁 МАЛЕНЬКАЯ /small`,
                roleID: `510932601721192458`,
            },
            {
                name: `🎁 ОГРОМНАЯ /mega`,
                roleID: `992820494900412456`,
            },
        ]
        let r_1 = rewards[Math.floor(Math.random() * rewards.length)]
        let r_2 = rewards[Math.floor(Math.random() * rewards.length)]


        await interaction.deferUpdate()
        await interaction.guild.channels.cache.get(ch_list.main).send({
            content: `:magnet: :sparkles: :magnet: :sparkles: :magnet: :sparkles: 
${user} использует **СИЛУ ЮПИТЕРА**    @here 

Юпитер притягивает ко всем другим участникам:
- \`${r_1.name}\`
- \`${r_2.name}\`
:magnet: :sparkles: :magnet: :sparkles: :magnet: :sparkles: `,
            allowedMentions: {
                parse: ["everyone"]
            }
        })

        const members = await interaction.guild.members.fetch()
        await members.filter(m => !m.user.bot && m.roles.cache.has(`504887113649750016`)).forEach(member => member.roles.add([r_1.roleID, r_2.roleID]).catch())

        userData.cooldowns.jupiter = Date.now() + (1000 * 60 * 60 * 24 * 365) * (1 - (userData.perks.decrease_cooldowns * 0.1))
        if (userData.cd_remind.includes('jupiter')) {
            let ITEM_ID = userData.cd_remind.findIndex(item_id => item_id == 'jupiter')
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
        name: "myth_jup"
    },
    execute
}