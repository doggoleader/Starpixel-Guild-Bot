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
            .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${prettyMilliseconds(userData.cooldowns.neptune - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}!`)

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
        const setup = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('setup')
                    .setLabel('Установить')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji(`⬆️`)
            )
        const reply = await interaction.reply({
            content: `◾
🧥 ${user}... Нептун зовёт тебя.
В этот раз он даёт тебе \`${r_ramka.name}\`!
:crystal_ball: Необходим ранг \"Звёздочка гильдии\".
Если хотите установить рамку, нажмите кнопку \"Установить\" в течение 60 секунд...
◾`,
            components: [setup],
            fetchReply: true,
            ephemeral: true
        });

        const filter = i => i.customId === 'setup';

        const collector = reply.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 60000 })

        collector.on(`collect`, async (i) => {
            if (i.user.id === member.user.id) {
                if (r_ramka.name.startsWith(`РАМКА ДЛЯ НИКА`) && (userData.rank_number >= 5)) {
                    userData.displayname.ramka1 = r_ramka.r1
                    userData.displayname.ramka2 = r_ramka.r2
                    i.reply({
                        content: `Ожидайте! Скоро ваша рамка будет установлена! Если этого не произойдет в течение 15 минут, обратитесь в вопрос-модерам!`,
                        ephemeral: true
                    })
                    await setup.components[0]
                        .setDisabled(true)
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(`🕓`)
                        .setLabel(`Идёт обработка...`)
                }
                else {
                    await setup.components[0]
                        .setDisabled(true)
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(`❌`)
                        .setLabel(`Низкий ранг`)

                    i.reply({
                        content: `Вы не можете установить себе данный предмет, так как не получили минимальный ранг. Посмотреть минимальный ранг для данного действия вы можете в канале <#931620901882068992>!`,
                        ephemeral: true
                    })
                }

                await interaction.editReply({
                    content: `◾
🧥 ${user}... Нептун зовёт тебя.
В этот раз он даёт тебе \`${r_ramka.name}\`!
:crystal_ball: Необходим ранг \"Звёздочка гильдии\".
Если хотите установить рамку, нажмите кнопку \"Установить\" в течение 60 секунд...
◾`,
                    components: [setup],
                    fetchReply: true
                })
                userData.save()
                collector.stop()
            } else {
                i.reply({ content: `Вы не можете использовать данную кнопочку!`, ephemeral: true });
            }
        })
        collector.on(`end`, async (err) => {
            await setup.components[0]
                .setDisabled(true)
                .setStyle(ButtonStyle.Secondary)

            await interaction.editReply({
                content: `◾
🧥 ${user}... Нептун зовёт тебя.
В этот раз он даёт тебе \`${r_ramka.name}\`!
:crystal_ball: Необходим ранг \"Звёздочка гильдии\".
Если хотите установить рамку, нажмите кнопку \"Установить\" в течение 60 секунд...
◾`,
                components: [setup]
            })
        });

        userData.cooldowns.neptune = Date.now() + (1000 * 60 * 60 * 24 * 30) * (1 - (userData.perks.decrease_cooldowns * 0.1))
        if (userData.cd_remind.includes('neptune')) {
            let ITEM_ID = userData.cd_remind.findIndex(item_id => item_id == 'neptune')
            userData.cd_remind.splice(ITEM_ID, 1)
        }
        userData.save()
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
**ID модели**: \`${interaction.customId}\`
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
        name: "myth_neptune"
    },
    execute
}