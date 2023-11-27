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
        let role = `743831211667095592`
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
            .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${prettyMilliseconds(userData.cooldowns.mercury - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}!`)

        if (userData.cooldowns.mercury > Date.now()) return interaction.reply({
            embeds: [cd],
            ephemeral: true
        })
        const discount = [{
            name: `10%`,
            disc: 0.1
        },
        {
            name: `20%`,
            disc: 0.2
        },
        {
            name: `30%`,
            disc: 0.3
        },
        {
            name: `40%`,
            disc: 0.4
        }]

        let r_disc = discount[Math.floor(Math.random() * discount.length)]

        await interaction.reply({
            content: `◾ :star: ◾ 
:money_with_wings:  ${member}, вы получаете скидку в **${r_disc.name}** на все товары в обычном магазине.
Скидка действует ровно 24 часа. Следующую скидку вы можете получить через 1 месяц.
◾ :star: ◾ `,
            ephemeral: true
        })
        const disc = new Temp({
            userid: user.id,
            guildid: interaction.guild.id,
            extraInfo: `shop_costs`,
            number: r_disc.disc,
            expire: Date.now() + (1000 * 60 * 60 * 24)
        })
        disc.save()
        if (1 - r_disc.disc > userData.shop_costs) userData.shop_costs -= 0
        else if (1 - r_disc.disc < userData.shop_costs) userData.shop_costs = 1 - r_disc.disc;
        userData.cooldowns.mercury = Date.now() + (1000 * 60 * 60 * 24 * 30) * (1 - (userData.perks.decrease_cooldowns * 0.1))
        if (userData.cd_remind.includes('mercury')) {
            let ITEM_ID = userData.cd_remind.findIndex(item_id => item_id == 'mercury')
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
        name: "myth_merc"
    },
    execute
}