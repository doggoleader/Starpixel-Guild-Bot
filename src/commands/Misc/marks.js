const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder, WebhookClient, PermissionsBitField, PermissionFlagsBits, ChannelType, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, UserSelectMenuBuilder, RoleSelectMenuBuilder, ChannelSelectMenuBuilder, MentionableSelectMenuBuilder, AutoModerationRuleEventType, AutoModerationRuleKeywordPresetType, AutoModerationActionType, AutoModerationRuleTriggerType, ComponentType } = require('discord.js');
const { joinVoiceChannel, generateDependencyReport, EndBehaviorType, getVoiceConnection } = require('@discordjs/voice');

const fs = require(`fs`)
const fetch = require(`node-fetch`);
const api = process.env.hypixel_apikey;
const { User } = require(`../../schemas/userdata`)
const { Guild } = require(`../../schemas/guilddata`)
const cron = require(`node-cron`)
const chalk = require(`chalk`);
const ch_list = require(`../../discord structure/channels.json`)
const prettyMilliseconds = require(`pretty-ms`); //ДОБАВИТЬ В ДРУГИЕ
const wait = require(`node:timers/promises`).setTimeout
const { gameConstructor, calcActLevel, getLevel, isURL, getRes, secondPage, mentionCommand } = require(`../../functions`)
const linksInfo = require(`../../discord structure/links.json`)
const toXLS = require(`json2xls`);
const { Chart } = require(`chart.js`)
const { isOneEmoji } = require(`is-emojis`)
const moment = require(`moment`);
const { Apply } = require('../../schemas/applications');
const { Polls } = require('../../schemas/polls');
const QiwiPayments = require(`@qiwi/bill-payments-node-js-sdk`);
const https = require('https');
const { API, Upload } = require('vk-io');
const { SocialVerify } = require('../../schemas/verify');
const { execArgv } = require('process');

/**
 * 
 * @param {import("discord.js").ChatInputCommandInteraction} interaction Interaction
 * @param {import("../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        switch (interaction.options.getSubcommand()) {
            case "add": {
                if (!interaction.member.roles.cache.has("563793535250464809")) return interaction.reply({
                    content: "Вы не являетесь офицером или администратором гильдии Starpixel, поэтому не можете использовать эту команду!",
                    ephemeral: true
                })
                let emoji = interaction.options?.getString("эмодзи")
                if (!emoji) emoji = ``
                let string = interaction.options?.getString("название")
                let mark = `${emoji} ${string}`
                const member = await interaction.options.getMember("пользователь")
                const userData = await User.findOne({
                    userid: member.user.id
                })
                if (!userData) return interaction.reply({
                    content: `Вы не можете вручить значок этому пользователю!`,
                    ephemeral: true
                })
                await interaction.deferReply({ fetchReply: true, ephemeral: true })
                await interaction.deleteReply()
                let i = Math.floor(Math.random() * 100000000)
                let find = userData.marks.find(m => m.id == i)
                while (find) {
                    i = Math.floor(Math.random() * 100000000)
                    find = userData.marks.find(m => m.id == i)
                }
                await userData.marks.push({
                    name: mark,
                    date: new Date(),
                    given_by: interaction.user.id,
                    id: i
                })
                userData.save()
                const embed = new EmbedBuilder()
                    .setTitle("Выдан значок")
                    .setColor(Number(linksInfo.bot_color))
                    .setTimestamp(Date.now())
                    .setDescription(`Пользователю ${member} был выдан значок \`${mark}\`. Подробную информацию о значке можно найти в ${mentionCommand(client, 'marks check')}!`)
                await interaction.guild.channels.cache.get(ch_list.main).send({
                    embeds: [embed]
                })

            }
                break;
            case "remove": {
                if (!interaction.member.roles.cache.has("563793535250464809")) return interaction.reply({
                    content: "Вы не являетесь офицером или администратором гильдии Starpixel, поэтому не можете использовать эту команду!",
                    ephemeral: true
                })
                let id = interaction.options.getInteger("id")
                const member = await interaction.options.getMember("пользователь")
                const userData = await User.findOne({
                    userid: member.user.id
                })
                if (!userData) return interaction.reply({
                    content: `Вы не можете забрать значок у этого пользователя!`,
                    ephemeral: true
                })
                let mark = userData.marks.find(m => m.id == id)
                if (!mark) return interaction.reply({
                    content: `Значка с ID \`${id}\` не существует. Пожалуйста, проверьте правильность введенного ID!`,
                    ephemeral: true
                })

                await interaction.deferReply({ fetchReply: true, ephemeral: true })
                await interaction.deleteReply();
                let i = userData.marks.findIndex(m => m.id == id)
                await userData.marks.splice(i, 1)
                userData.save()
                const embed = new EmbedBuilder()
                    .setTitle("Удалён значок")
                    .setColor(Number(linksInfo.bot_color))
                    .setTimestamp(Date.now())
                    .setDescription(`У пользователя ${member} был убран значок \`${mark.name}\`. Подробную информацию о своих значках можно найти в ${mentionCommand(client, 'marks check')}!`)
                await interaction.guild.channels.cache.get(ch_list.main).send({
                    embeds: [embed]
                })

            }
                break;
            case "check": {

                const member = interaction.options.getMember('пользователь') || interaction.member
                if (member.user.id !== interaction.user.id) {
                    let targetData = await User.findOne({ userid: member.user.id })
                    if (targetData.pers_settings.marks_view == false) {
                        let executorData = await User.findOne({ userid: interaction.user.id })
                        if (executorData.staff_pos < 2 || (targetData.staff_pos > executorData.staff_pos)) {
                            await interaction.reply({
                                content: `У вас недостаточно прав для просмотра профиля данного участника. Вероятнее всего, в настройках своего профиля он установил необходимые параметры!`,
                                ephemeral: true
                            })
                            return
                        }
                    }
                }
                const userData = await User.findOne({ userid: member.user.id })
                if (!userData) return interaction.reply({
                    content: `Вы не можете посмотреть информацию о значках данного пользователя, так как он не является участником гильдии или является ботом!`,
                    ephemeral: true
                })
                let map = await userData.marks.map((mark, i) => {
                    //let date = `${mark.date.getDate()}.${mark.date.getMonth() < 10 ? `0${mark.date.getMonth()}`: `${mark.date.getMonth()}`}.${mark.date.getFullYear()} `
                    return `**${++i}**. \`${mark.name}\`
- ID значка: \`${mark.id}\`
- Кем выдано: <@${mark.given_by}>
- Дата выдачи: <t:${Math.round(mark.date.getTime() / 1000)}:F>
`
                })

                let n = 0

                const totalPages = Math.ceil(map.length / 10)
                let markInfo = map.slice(0 + (n * 10), 10 + (n * 10))
                const pages = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`prev`)
                            .setEmoji(`⬅`)
                            .setStyle(ButtonStyle.Danger)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`stop`)
                            .setEmoji(`⏹`)
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(false)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`next`)
                            .setEmoji(`➡`)
                            .setStyle(ButtonStyle.Success)
                            .setDisabled(secondPage(totalPages))
                    )


                const list = new EmbedBuilder()
                    .setTitle(`Список значков`)
                    .setColor(Number(linksInfo.bot_color))
                    .setTimestamp(Date.now())
                    .setDescription(`## Значки пользователя ${member}
${markInfo.length >= 1 ? markInfo.join(`\n`) : "У пользователя нет никаких значков!"}`)
                    .setFooter({
                        text: `Страница ${n + 1}/${totalPages}`
                    })

                let msg = await interaction.reply({
                    embeds: [list],
                    components: [pages],
                    fetchReply: true
                })

                const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button })
                collector.on('collect', async (i) => {
                    if (i.customId == `prev`) {
                        n = n - 1
                        if (n <= 0) {
                            pages.components[0].setDisabled(true)
                        } else {
                            pages.components[0].setDisabled(false)
                        }
                        pages.components[1].setDisabled(false)
                        pages.components[2].setDisabled(false)
                        markInfo = map.slice(0 + (n * 10), 10 + (n * 10))
                        list.setTimestamp(Date.now())
                            .setDescription(`## Значки пользователя ${member}
${markInfo.length >= 1 ? markInfo.join(`\n`) : "У пользователя нет никаких значков!"}`)
                            .setFooter({
                                text: `Страница ${n + 1}/${totalPages}`
                            })
                        await i.deferUpdate()
                        await interaction.editReply({
                            embeds: [list],
                            components: [pages],
                            fetchReply: true
                        })

                    } else if (i.customId == `stop`) {
                        await i.deferUpdate()
                        collector.stop()
                    } else if (i.customId == `next`) {
                        n = n + 1
                        if (n >= totalPages - 1) {
                            pages.components[2].setDisabled(true)
                        } else {
                            pages.components[2].setDisabled(false)
                        }
                        pages.components[1].setDisabled(false)
                        pages.components[0].setDisabled(false)
                        markInfo = map.slice(0 + (n * 10), 10 + (n * 10))
                        list.setTimestamp(Date.now())
                            .setDescription(`## Значки пользователя ${member}
${markInfo.length >= 1 ? markInfo.join(`\n`) : "У пользователя нет никаких значков!"}`)
                            .setFooter({
                                text: `Страница ${n + 1}/${totalPages}`
                            })
                        await i.deferUpdate()
                        await interaction.editReply({
                            embeds: [list],
                            components: [pages],
                            fetchReply: true
                        })
                    }
                })

                collector.on('end', async (collected) => {
                    n = n
                    pages.components[0].setDisabled(true)
                    pages.components[1].setDisabled(true)
                    pages.components[2].setDisabled(true)
                    markInfo = map.slice(0 + (n * 10), 10 + (n * 10))
                    list.setTimestamp(Date.now())
                        .setDescription(`## Значки пользователя ${member}
${markInfo.length >= 1 ? markInfo.join(`\n`) : "У пользователя нет никаких значков!"}`)
                        .setFooter({
                            text: `Страница ${n + 1}/${totalPages}`
                        })
                    await interaction.editReply({
                        embeds: [list],
                        components: [pages]
                    })
                })
            }
                break;

            default:
                break;
        }
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
    category: `misc`,
    plugin: {
        id: "misc",
        name: "Разное"
    },
    data: new SlashCommandBuilder()
        .setName(`marks`)
        .setDescription(`Значки участников гильдии`)
        .addSubcommand(sb => sb
            .setName(`add`)
            .setDescription(`Добавить значок участнику гильдии`)
            .addUserOption(o => o
                .setName("пользователь")
                .setDescription(`Пользователь, которому вручается значок`)
                .setRequired(true)
            )
            .addStringOption(o => o
                .setName(`название`)
                .setDescription(`Названия значка, который вы хотите добавить`)
                .setMaxLength(32)
                .setRequired(true)
            )
            .addStringOption(o => o
                .setName(`эмодзи`)
                .setDescription(`Эмодзи значка, который вы хотите добавить`)
                .setRequired(false)
            )
        )
        .addSubcommand(sb => sb
            .setName(`remove`)
            .setDescription(`Убрать значок у участника гильдии`)
            .addUserOption(o => o
                .setName("пользователь")
                .setDescription(`Пользователь, у которого убирается значок`)
                .setRequired(true)
            )
            .addIntegerOption(o => o
                .setName(`id`)
                .setDescription(`ID значка, который вы хотите убрать`)
                .setRequired(true)
            )
        )
        .addSubcommand(sb => sb
            .setName(`check`)
            .setDescription(`Посмотреть значки у пользователя`)
            .addUserOption(o => o
                .setName("пользователь")
                .setDescription(`Пользователь, у которого хотите посмотреть значки`)
                .setRequired(false)
            )
        )
        .setDMPermission(false),
    execute
}; 