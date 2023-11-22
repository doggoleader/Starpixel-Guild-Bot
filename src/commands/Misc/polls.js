const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ComponentType, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

const fetch = require(`node-fetch`);
const api = process.env.hypixel_apikey;
const { User } = require(`../../schemas/userdata`)
const { Guild } = require(`../../schemas/guilddata`)
const { Polls } = require(`../../schemas/polls`)
const chalk = require(`chalk`);
const prettyMilliseconds = require(`pretty-ms`); //ДОБАВИТЬ В ДРУГИЕ
const { toOrdinalSuffix, secondPage } = require(`../../functions`)
const linksInfo = require(`../../discord structure/links.json`)

/**
 * 
 * @param {import("discord.js").ChatInputCommandInteraction} interaction Interaction
 * @param {import("../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        const { guild, user, member, options } = interaction

        switch (options.getSubcommand()) {
            case `create`: {
                const modal = new ModalBuilder()
                    .setCustomId(`create_poll`)
                    .setTitle(`Создать опрос`)
                    .addComponents(
                        new ActionRowBuilder()
                            .addComponents(
                                new TextInputBuilder()
                                    .setCustomId(`poll_name`)
                                    .setLabel(`Вопрос`)
                                    .setPlaceholder(`Это может быть любой вопрос или фраза, которая будет отображать ваш опрос`)
                                    .setRequired(true)
                                    .setStyle(TextInputStyle.Short)
                                    .setMaxLength(250)
                            )
                    )
                    .addComponents(
                        new ActionRowBuilder()
                            .addComponents(
                                new TextInputBuilder()
                                    .setCustomId(`poll_description`)
                                    .setLabel(`Описание опроса`)
                                    .setPlaceholder(`Подробная информация об опросе`)
                                    .setRequired(true)
                                    .setStyle(TextInputStyle.Paragraph)
                                    .setMaxLength(1500)
                            )
                    )
                    .addComponents(
                        new ActionRowBuilder()
                            .addComponents(
                                new TextInputBuilder()
                                    .setCustomId(`poll_minamount`)
                                    .setLabel(`Минимальное количество опций (1-25)`)
                                    .setPlaceholder(`Мин. количество опций, которые участники смогут выбрать`)
                                    .setRequired(true)
                                    .setStyle(TextInputStyle.Short)
                                    .setMaxLength(2)
                            )
                    )
                    .addComponents(
                        new ActionRowBuilder()
                            .addComponents(
                                new TextInputBuilder()
                                    .setCustomId(`poll_maxamount`)
                                    .setLabel(`Максимальное количество опций (1-25)`)
                                    .setPlaceholder(`Макс. количество опций, которые участники смогут выбрать`)
                                    .setRequired(true)
                                    .setStyle(TextInputStyle.Short)
                                    .setMaxLength(2)
                            )
                    )
                await interaction.showModal(modal)
            }
                break;
            case `getpolls`: {
                const pollDatas = await Polls.find({ status: "ongoing" })
                if (pollDatas.length <= 0) return interaction.reply({
                    content: `В данный момент нет никаких опросов!`,
                    ephemeral: true
                })
                let n = 0
                const map = pollDatas.map(async (pollData, i) => {
                    const channel = await guild.channels.fetch(pollData.channelid)
                    const msg = await channel.messages.fetch(pollData.messageid)
                    return `**${++i}.** \`${pollData.question}\` ([перейти к опросу](${msg.url}))`
                })
                const mapProm = await Promise.all(map)
                let list = mapProm.slice(0 + (n * 10), 10 + (n * 10))

                const totalPages = Math.ceil(pollDatas.length / 10)


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
                            .setCustomId(`next`)
                            .setEmoji(`➡`)
                            .setStyle(ButtonStyle.Success)
                            .setDisabled(secondPage(totalPages))
                    )
                const embed = new EmbedBuilder()
                    .setTitle(`Активные опросы`)
                    .setColor(Number(linksInfo.bot_color))
                    .setDescription(`**Активные опросы**
${list.join(`\n`)}`)
                    .setFooter({
                        text: `Страница ${n + 1}/${totalPages}`
                    })

                const msg = await interaction.reply({
                    embeds: [embed],
                    components: [pages],
                    fetchReply: true,
                    ephemeral: true
                })

                const collector = msg.createMessageComponentCollector()

                collector.on(`collect`, async (i) => {
                    if (i.customId == `prev`) {
                        n = n - 1
                        if (n <= 0) {
                            pages.components[0].setDisabled(true)
                        } else {
                            pages.components[0].setDisabled(false)
                        }
                        list = mapProm.slice(0 + (n * 10), 10 + (n * 10))
                        embed
                            .setDescription(`**Активные опросы**
${list.join(`\n`)}`)
                            .setFooter({
                                text: `Страница ${n + 1}/${totalPages}`
                            })
                        pages.components[1].setDisabled(false)
                        await i.deferUpdate()
                        await interaction.editReply({
                            embeds: [embed],
                            components: [pages],
                            fetchReply: true
                        })
                    } else if (i.customId == `next`) {
                        n = n + 1
                        if (n >= totalPages - 1) {
                            pages.components[1].setDisabled(true)
                        } else {
                            pages.components[1].setDisabled(false)
                        }
                        list = mapProm.slice(0 + (n * 10), 10 + (n * 10))
                        embed
                            .setDescription(`**Активные опросы**
${list.join(`\n`)}`)
                            .setFooter({
                                text: `Страница ${n + 1}/${totalPages}`
                            })
                        pages.components[0].setDisabled(false)
                        await i.deferUpdate()
                        await interaction.editReply({
                            embeds: [embed],
                            components: [pages],
                            fetchReply: true
                        })
                    }
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
    category: `polls`,
    plugin: {
        id: "misc",
        name: "Разное"
    },
    data: new SlashCommandBuilder()
        .setName(`polls`)
        .setDescription(`Опросы среди участников`)
        .setDMPermission(false)
        .addSubcommand(subcommand => subcommand
            .setName(`create`)
            .setDescription(`Создать опрос`)
        )
        .addSubcommand(subcommand => subcommand
            .setName(`getpolls`)
            .setDescription(`Получить активные опросы`)
        ),
    execute
};


