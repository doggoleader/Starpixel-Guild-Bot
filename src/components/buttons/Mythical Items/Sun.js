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
        let role = `781069817384927262`
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
            .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${calcCooldown(userData.cooldowns.sun - Date.now())}!`)

        if (userData.cooldowns.sun > Date.now()) return interaction.reply({
            embeds: [cd],
            ephemeral: true
        })

        const choices = [
            {
                name: `активности`,
                gift: `В течение этой недели весь опыт активности в чатах будет в 2 раза больше у всех участников гильдии`
            },
            {
                name: `богатства`,
                gift: `Владелец торжества может подарить подписку VIP на 30 дней любому участнику гильдии`
            },
            {
                name: `румбиков`,
                gift: `Владелец торжества может подарить 50 <:Rumbik:883638847056003072> любому участнику гильдии`
            }
        ]
        let r_choice = choices[Math.floor(Math.random() * choices.length)]
        if (r_choice.name == `активности`) {
            const boost = new Temp({
                userid: member.user.id,
                guildid: interaction.guild.id,
                boost: true,
                expire: Date.now() + (1000 * 60 * 60 * 24 * 7 * (userData.perks.temp_items + 1))
            })
            boost.save()
            guildData.act_exp_boost = 2
            guildData.save()
            userData.cooldowns.sun = Date.now() + (1000 * 60 * 60 * 24 * 30) * (1 - (userData.perks.decrease_cooldowns * 0.1))
            if (userData.cd_remind.includes('sun')) {
                let ITEM_ID = userData.cd_remind.findIndex(item_id => item_id == 'sun')
                userData.cd_remind.splice(ITEM_ID, 1)
            }
            userData.save()
            await interaction.deferUpdate()
            const ch = await interaction.guild.channels.fetch(ch_list.main)
            const mmm = await ch.send({
                content: `☀️ ${member} использует силу Солнца!

┊　　┊　　┊ 　 ┊    　┊　　┊　　┊

┊　　┊　　┊ 　 ☆    　┊　　┊　　┊

┊　　┊　　 ✬ 　 　    　✬ 　   ┊　   ┊

┊　　★ 　　　 　 　    　　　　★　  ┊

☆ 　　　　　　 　 　    　　　　　　   ☆

Торжество ${r_choice.name}. ${r_choice.gift}.`
            })
        } else if (r_choice.name == `богатства`) {
            const userSelect = new ActionRowBuilder()
                .addComponents(
                    new UserSelectMenuBuilder()
                        .setCustomId(`sun_user_select`)
                        .setPlaceholder(`Выберите пользователя`)
                )
            const msg = await interaction.reply({
                content: `Выберите пользователя, которому хотите подарить подписку Premium!`,
                components: [userSelect],
                ephemeral: true,
                fetchReply: true
            })
            const collector = msg.createMessageComponentCollector()
            collector.on('collect', async (i) => {
                const memberAddID = i.values[0]
                if (member.user.id === memberAddID) return i.reply({
                    content: `Вы не можете выбрать в качестве пользователя самого себя!`,
                    ephemeral: true
                })
                const memberAdd = await i.guild.members.fetch(memberAddID)
                if (!memberAdd.roles.cache.has(`504887113649750016`)) return i.reply({
                    content: `Вы не можете выбрать гостя гильдии!`,
                    ephemeral: true
                })
                if (memberAdd.user.bot) return i.reply({
                    content: `Вы не можете выбрать бота!`,
                    ephemeral: true
                })
                const memberData = await User.findOne({ userid: memberAddID })
                let prem_role = `850336260265476096`

                const premium = new Temp({
                    userid: memberAddID,
                    guildid: i.guild.id,
                    roleid: prem_role,
                    expire: Date.now() + (1000 * 60 * 60 * 24 * 30 * (memberData.perks.temp_items + 1))
                })
                await memberAdd.roles.add(prem_role)
                premium.save()
                const ch = await interaction.guild.channels.fetch(ch_list.main)
                const mmm = await ch.send({
                    content: `☀️ ${member} использует силу Солнца!

┊　　┊　　┊ 　 ┊    　┊　　┊　　┊

┊　　┊　　┊ 　 ☆    　┊　　┊　　┊

┊　　┊　　 ✬ 　 　    　✬ 　   ┊　   ┊

┊　　★ 　　　 　 　    　　　　★　  ┊

☆ 　　　　　　 　 　    　　　　　　   ☆

Торжество ${r_choice.name}. ${r_choice.gift}.`
                })
                await i.deferUpdate()
                await mmm.reply({
                    content: `${member} выбрал пользователя ${memberAdd}!`
                })
                collector.stop()
            })

            collector.on('end', async (err) => {
                await interaction.deleteReply()
                userData.cooldowns.sun = Date.now() + (1000 * 60 * 60 * 24 * 30) * (1 - (userData.perks.decrease_cooldowns * 0.1))
                if (userData.cd_remind.includes('sun')) {
                    let ITEM_ID = userData.cd_remind.findIndex(item_id => item_id == 'sun')
                    userData.cd_remind.splice(ITEM_ID, 1)
                }
                userData.save()
            })


        } else if (r_choice.name == `румбиков`) {
            const userSelect = new ActionRowBuilder()
                .addComponents(
                    new UserSelectMenuBuilder()
                        .setCustomId(`sun_user_select`)
                        .setPlaceholder(`Выберите пользователя`)
                )
            const msg = await interaction.reply({
                content: `Выберите пользователя, которому хотите подарить 50 румбиков!`,
                components: [userSelect],
                ephemeral: true,
                fetchReply: true
            })
            const collector = msg.createMessageComponentCollector()
            collector.on('collect', async (i) => {
                const memberAddID = i.values[0]
                if (member.user.id === memberAddID) return i.reply({
                    content: `Вы не можете выбрать в качестве пользователя самого себя!`,
                    ephemeral: true
                })
                const memberAdd = await i.guild.members.fetch(memberAddID)
                if (!memberAdd.roles.cache.has(`504887113649750016`)) return i.reply({
                    content: `Вы не можете выбрать гостя гильдии!`,
                    ephemeral: true
                })
                if (memberAdd.user.bot) return i.reply({
                    content: `Вы не можете выбрать бота!`,
                    ephemeral: true
                })
                const memberData = await User.findOne({ userid: memberAddID })
                memberData.rumbik += 50
                memberData.progress.items.find(it => it.name == 'RUMBIKS_TOTAL').total_items += 50
                memberData.save()
                const ch = await interaction.guild.channels.fetch(ch_list.main)
                const mmm = await ch.send({
                    content: `☀️ ${member} использует силу Солнца!

┊　　┊　　┊ 　 ┊    　┊　　┊　　┊

┊　　┊　　┊ 　 ☆    　┊　　┊　　┊

┊　　┊　　 ✬ 　 　    　✬ 　   ┊　   ┊

┊　　★ 　　　 　 　    　　　　★　    ┊

☆ 　　　　　　 　 　    　　　　　　   ☆

Торжество ${r_choice.name}. ${r_choice.gift}.`
                })
                await i.deferUpdate()
                await mmm.reply({
                    content: `${member} выбрал пользователя ${memberAdd}!`
                })
                collector.stop()
            })

            collector.on('end', async (err) => {
                await interaction.deleteReply()
                userData.cooldowns.sun = Date.now() + (1000 * 60 * 60 * 24 * 30) * (1 - (userData.perks.decrease_cooldowns * 0.1))
                if (userData.cd_remind.includes('sun')) {
                    let ITEM_ID = userData.cd_remind.findIndex(item_id => item_id == 'sun')
                    userData.cd_remind.splice(ITEM_ID, 1)
                }
                userData.save()
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
        id: "items",
        name: "Предметы"
    },
    data: {
        name: "myth_sun"
    },
    execute
}