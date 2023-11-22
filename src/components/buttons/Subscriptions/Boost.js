const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, UserSelectMenuBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

const fetch = require(`node-fetch`);
const api = process.env.hypixel_apikey;
const { User } = require(`../../../schemas/userdata`)
const { Guild } = require(`../../../schemas/guilddata`)
const chalk = require(`chalk`);
const prettyMilliseconds = require(`pretty-ms`); //ДОБАВИТЬ В ДРУГИЕ
const linksInfo = require(`../../../discord structure/links.json`)
const ch_list = require(`../../../discord structure/channels.json`)
/**
 * 
 * @param {import("discord.js").ButtonInteraction} interaction Interaction
 * @param {import("../../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        const { user, member, guild, channel } = interaction
        const userData = await User.findOne({ userid: user.id })

        const embed = new EmbedBuilder()
            .setAuthor({
                name: `❗ Отсутствует необходимая роль!`
            })
            .setDescription(`Вы должны иметь \`${interaction.guild.roles.cache.get(`1007290182883622974`).name}\` или выше, чтобы использовать эту команду!`)
            .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
            .setColor(`DarkRed`)
            .setTimestamp(Date.now())
        if (!member.roles.cache.has(`850336260265476096`) && !member.roles.cache.has('1007290182883622974')) return interaction.reply({
            embeds: [embed],
            ephemeral: true
        })

        const cd = new EmbedBuilder()
            .setColor(Number(linksInfo.bot_color))
            .setAuthor({
                name: `Вы не можете использовать эту команду`
            })
            .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${prettyMilliseconds(userData.cooldowns.boost - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}!`)
            .setTimestamp(Date.now())
            .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)

        if (userData.cooldowns.boost > Date.now()) return interaction.reply({
            embeds: [cd],
            ephemeral: true
        });
        const userSelect = new ActionRowBuilder()
            .addComponents(
                new UserSelectMenuBuilder()
                    .setCustomId(`boost_select`)
                    .setPlaceholder(`Выберите, кого хотите забустить`)
                    .setMaxValues(1)
            )
        const msg = await interaction.reply({
            content: `Выберите пользователя, которого хотите забустить!`,
            ephemeral: true,
            components: [userSelect],
            fetchReply: true
        })





        const collector = msg.createMessageComponentCollector()
        collector.on('collect', async i => {
            const selected = await i.guild.members.fetch(i.values[0])
            const wrong_member = new EmbedBuilder()
                .setAuthor({
                    name: `❗ Произошла ошибка!`
                })
                .setColor(`DarkRed`)
                .setDescription(`Вы не можете бустить себя! Повторите попытку ещё раз с другим пользователем!`)
                .setTimestamp(Date.now())
                .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)

            if (selected.user.id === user.id) return i.reply({
                embeds: [wrong_member],
                ephemeral: true
            })

            const member_bot = new EmbedBuilder()
                .setAuthor({
                    name: `❗ Произошла ошибка!`
                })
                .setColor(`DarkRed`)
                .setDescription(`Вы не можете бустить ботов! Хоть они тоже живые, они отказались от такой ответственности. Выберите другого пользователя!`)
                .setTimestamp(Date.now())
                .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)

            if (selected.user.bot) return i.reply({
                embeds: [member_bot],
                ephemeral: true
            })

            const member_guest = new EmbedBuilder()
                .setAuthor({
                    name: `❗ Произошла ошибка!`
                })
                .setColor(`DarkRed`)
                .setDescription(`Вы не можете бустить гостей гильдии! Выбранный вами пользователь должен быть участников гильдии Starpixel! Выберите другого пользователя!`)
                .setTimestamp(Date.now())
                .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)

            if (!selected.roles.cache.has(`504887113649750016`)) return i.reply({
                embeds: [member_guest],
                ephemeral: true
            })
            await i.deferUpdate()

            const loot = [
                {
                    group: 1,
                    name: `Маленькую коробку`,
                    roleID: `510932601721192458`
                },
                {
                    group: 1,
                    name: `Мешочек`,
                    roleID: `819930814388240385`
                },
                {
                    group: 1,
                    name: `Большую коробку`,
                    roleID: `521248091853291540`
                },
                {
                    group: 1,
                    name: `Огромную коробку`,
                    roleID: `992820494900412456`
                },
                {
                    group: 1,
                    name: `Королевскую коробку`,
                    roleID: `584673040470769667`
                }
            ]

            const r_loot = loot[Math.floor(Math.random() * loot.length)]
            const msg = await interaction.guild.channels.cache.get(ch_list.main).send({
                content: `◾
**БУСТ-БУСТ-БУСТ!**
            
:zap: :credit_card: ${user} **БУСТИТ** участника.
${selected} получает \`${r_loot.name}\`.
            
**БУСТ-БУСТ-БУСТ!**
◾`
            })
            if (r_loot.group == 1) {
                if (!selected.roles.cache.has(r_loot.roleID)) {
                    selected.roles.add(r_loot.roleID)
                    await msg.react(`✅`)
                } else {
                    const selData = await User.findOne({ userid: selected.user.id })
                    if (selData.stacked_items.length < selData.upgrades.inventory_size) {
                        await selData.stacked_items.push(r_loot.roleID)
                        await msg.react("✅")
                    } else {
                        await interaction.guild.channels.cache.get(ch_list.main).send({
                            content: `Мы не можем добавить предмет в ваш инвентарь, так как он переполнен. Чтобы увеличить вместительность своего инвентаря, перейдите в канал <#1141026403765211136>!`
                        })
                        await msg.react("🚫")
                    }
                    selData.save()
                }
            }


            userData.cooldowns.boost = Date.now() + (1000 * 60 * 60 * 24 * 7)
            userData.save()
            collector.stop()
        })
        collector.on('end', async err => {
            await interaction.deleteReply()
        })



    } catch (e) {
        const admin = await client.users.fetch(`491343958660874242`)
        console.log(e)
        let options = interaction?.options.data.map(a => {
            return `{
"status": true,
"name": "${a.name}",
"type": ${a.type},
"autocomplete": ${a?.autocomplete ? true : false},
"value": "${a?.value ? a.value : "No value"}",
"user": "${a?.user?.id ? a.user.id : "No User"}",
"channel": "${a?.channel?.id ? a.channel.id : "No Channel"}",
"role": "${a?.role?.id ? a.role.id : "No Role"}",
"attachment": "${a?.attachment?.url ? a.attachment.url : "No Attachment"}"
}`
        })
        await admin.send(`Произошла ошибка!`)
        await admin.send(`=> ${e}.
**Команда**: \`${interaction.commandName}\`
**Пользователь**: ${interaction.member}
**Канал**: ${interaction.channel}
**Опции**: \`\`\`json
${interaction.options.data.length <= 0 ? `{"status": false}` : options.join(`,\n`)}
\`\`\``)
        await admin.send(`◾`)
    }


}

module.exports = {
    plugin: {
        id: "items",
        name: "Предметы"
    },
    data: {
        name: `sub_boost`
    },
    execute

};