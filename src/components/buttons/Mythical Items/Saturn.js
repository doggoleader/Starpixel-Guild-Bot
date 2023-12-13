const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ComponentType, ButtonStyle, UserSelectMenuBuilder } = require('discord.js');
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
        let role = `597746059879645185`
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
            .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${calcCooldown(userData.cooldowns.saturn - Date.now())}!`)

        if (userData.cooldowns.saturn > Date.now()) return interaction.reply({
            embeds: [cd],
            ephemeral: true
        })

        const userSelect = new ActionRowBuilder()
            .addComponents(
                new UserSelectMenuBuilder()
                    .setCustomId(`user_select`)
                    .setPlaceholder(`Выберите пользователя`)
            )
        const msg = await interaction.reply({
            content: `Выберите пользователя, который станет жертвой Сатурна!`,
            components: [userSelect],
            ephemeral: true,
            fetchReply: true
        })
        const collector = msg.createMessageComponentCollector()

        collector.on('collect', async (i) => {
            let toRemoveID = i.values[0]
            if (toRemoveID === member.user.id) return interaction.reply({
                content: `Вы не можете выбрать в качестве пользователя самого себя!`,
                ephemeral: true
            })
            const toRemove = await i.guild.members.fetch(toRemoveID)
            if (toRemove.user.bot == true) return interaction.reply({
                content: `Вы не можете выбрать бота в качестве пользователя!`,
                ephemeral: true
            })
            if (!toRemove.roles.cache.has(`504887113649750016`)) return interaction.reply({
                content: `Вы не можете выбрать гостя гильдии в качестве жертвы!`,
                ephemeral: true
            })
            const items = [`случайная эмоция`, `случайная звезда`, `случайный питомец`, `случайная стихия`, `случайная картинка`]
            let r_item = items[Math.floor(Math.random() * items.length)]
            if (r_item == `случайная эмоция`) {
                let to_lose = [
                    `566528019208863744`,
                    `571743750049497089`,
                    `571745411929341962`,
                    `571744516894228481`,
                    `571757459732168704`,
                    `571757461380399106`,
                    `571757463876141077`,
                    `642810527579373588`,
                    `642393088689700893`,
                    `636561006721761301`,
                    `607495941490212885`,
                    `694221126494060604`,
                    `740241984190545971`,
                ]
                let i = Math.floor(Math.random() * to_lose.length)
                let r_lose = to_lose[i]
                while (!toRemove.roles.cache.has(r_lose) && to_lose.length >= 1) {
                    i = Math.floor(Math.random() * to_lose.length)
                    r_lose = to_lose[i]
                    to_lose.splice(i, 1)
                }
                await toRemove.roles.remove(r_lose)
            } else if (r_item == `случайная звезда`) {
                let to_lose = [
                    `553660090184499201`,
                    `553660091677540363`,
                    `553660093523034112`,
                    `553660095259475989`,
                    `553660095951667217`,
                    `553660097520205824`,
                    `572417192755462165`,
                    `595962185641885716`,
                    `609082751349686282`
                ]

                let i = Math.floor(Math.random() * to_lose.length)
                let r_lose = to_lose[i]
                while (!toRemove.roles.cache.has(r_lose) && to_lose.length >= 1) {
                    i = Math.floor(Math.random() * to_lose.length)
                    r_lose = to_lose[i]
                    to_lose.splice(i, 1)
                }
                await toRemove.roles.remove(r_lose)
            } else if (r_item == `случайный питомец`) {
                let to_lose = [
                    `553637207911563264`,
                    `553638061817200650`,
                    `605696079819964426`,
                    `553638054238093364`
                ]

                let i = Math.floor(Math.random() * to_lose.length)
                let r_lose = to_lose[i]
                while (!toRemove.roles.cache.has(r_lose) && to_lose.length >= 1) {
                    i = Math.floor(Math.random() * to_lose.length)
                    r_lose = to_lose[i]
                    to_lose.splice(i, 1)
                }
                await toRemove.roles.remove(r_lose)
            } else if (r_item == `случайная стихия`) {
                let to_lose = [
                    `930169143347523604`,
                    `930169139866259496`,
                    `930169133671280641`,
                    `930169145314652170`
                ]

                let i = Math.floor(Math.random() * to_lose.length)
                let r_lose = to_lose[i]
                while (!toRemove.roles.cache.has(r_lose) && to_lose.length >= 1) {
                    i = Math.floor(Math.random() * to_lose.length)
                    r_lose = to_lose[i]
                    to_lose.splice(i, 1)
                }
                await toRemove.roles.remove(r_lose)
            } else if (r_item == `случайная картинка`) {
                let to_lose = [
                    `850079153746346044`,
                    `850079142413598720`,
                    `850079173149065277`,
                    `642810535737425930`,
                    `642810538518118430`,
                    `642819600429481997`,
                    `850079134700666890`,
                    `893927886766096384`,
                    `694914077104799764`,
                    `1046475276080648302`
                ]

                let i = Math.floor(Math.random() * to_lose.length)
                let r_lose = to_lose[i]
                while (!toRemove.roles.cache.has(r_lose) && to_lose.length >= 1) {
                    i = Math.floor(Math.random() * to_lose.length)
                    r_lose = to_lose[i]
                    to_lose.splice(i, 1)
                }
                await toRemove.roles.remove(r_lose)
            }

            await i.deferUpdate()
            await i.guild.channels.cache.get(ch_list.main).send({
                content: `📔  📔  📔  📔  📔
${member} использует силу Сатурна, чтобы наказать ${toRemove} за плохое поведение. 
\`У участника пропадает 1 ${r_item} в профиле.\`
📔  📔  📔  📔  📔`
            })
            userData.cooldowns.saturn = Date.now() + (1000 * 60 * 60 * 24 * 30) * (1 - (userData.perks.decrease_cooldowns * 0.1))
            if (userData.cd_remind.includes('saturn')) {
                let ITEM_ID = userData.cd_remind.findIndex(item_id => item_id == 'saturn')
                userData.cd_remind.splice(ITEM_ID, 1)
            }
            userData.save()
            collector.stop()
        })

        collector.on('end', async (err) => {
            await interaction.deleteReply()
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
        name: "myth_sat"
    },
    execute
}