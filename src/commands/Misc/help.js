const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder, WebhookClient, PermissionsBitField, PermissionFlagsBits, ChannelType, StringSelectMenuBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

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
const { gameConstructor, calcActLevel, getLevel, isURL, getRes } = require(`../../functions`)
const linksInfo = require(`../../discord structure/links.json`)
const toXLS = require(`json2xls`);
const { Chart } = require(`chart.js`)
const { isOneEmoji } = require(`is-emojis`)

/**
 * 
 * @param {import("discord.js").ChatInputCommandInteraction} interaction Interaction
 * @param {import("../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        const commandFolders = fs.readdirSync('./src/commands');
        let i = 1
        let map = []
        for (let folder of commandFolders) {
            const commandFiles = fs
                .readdirSync(`./src/commands/${folder}`)
                .filter((file) => file.endsWith('.js'));

            const commap = commandFiles.map(file => {
                const command = require(`../../commands/${folder}/${file}`);

                if (command.category !== `admin_only`) {
                    if (command.data.options.length >= 1) {
                        const options_map = command.data.options.map(option => {
                            if (option.constructor.name == `SlashCommandSubcommandBuilder`) {
                                return `  • \`${option.name}\` (${option.description})`
                            } else if (option.constructor.name == `SlashCommandSubcommandGroupBuilder`) {
                                const options2_map = option.options.map(opt => {
                                    if (opt.constructor.name == `SlashCommandSubcommandBuilder`) {
                                        return `    -> \`${opt.name}\` (${opt.description})`
                                    }
                                })
                                return `  • \`${option.name}\` (${option.description})
${options2_map.join(`\n`)}`
                            }
                        })
                        map.push(`**${i++}**. \`/${command.data.name}\` (${command.data.description})
${options_map.join(`\n`)}`)
                    } else {
                        map.push(`**${i++}**. \`/${command.data.name}\` (${command.data.description})`)
                    }
                }
            })
        }


        let n = 0
        let str = await map.slice(0 + (n * 10), 10 + (n * 10))
        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`prev`)
                    .setLabel(`Предыдущая`)
                    .setEmoji(`⬅`)
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(true)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`next`)
                    .setLabel(`Следующая`)
                    .setEmoji(`➡`)
                    .setStyle(ButtonStyle.Success)
            )
        const total = Math.ceil(map.length / 10)
        const embed = new EmbedBuilder()
            .setTitle(`Команды бота`)
            .setDescription(`__Список команд__
${str.join(`\n`)}`)
            .setColor(Number(linksInfo.bot_color))
            .setTimestamp(Date.now())
            .setFooter({
                text: `Страница ${n + 1}/${total}`
            })
        let msg = await interaction.reply({
            embeds: [embed],
            components: [buttons],
            ephemeral: true,
            fetchReply: true
        })

        const collector = msg.createMessageComponentCollector()

        collector.on(`collect`, async (i) => {
            await i.deferUpdate()
            if (i.customId == `prev`) {
                n = n - 1
                if (n <= 0) {
                    buttons.components[0].setDisabled(true)
                }
                buttons.components[0].setDisabled(false)
                str = map.slice(0 + (n * 10), 10 + (n * 10))
                embed
                    .setDescription(`__Список команд__
${str.join(`\n`)}`)
                    .setFooter({
                        text: `Страница ${n + 1}/${total}`
                    })
                await interaction.editReply({
                    embeds: [embed],
                    components: [buttons],
                    ephemeral: true,
                    fetchReply: true
                })
            } else if (i.customId == `next`) {
                n = n + 1
                if (n >= total - 1) {
                    buttons.components[1].setDisabled(true)
                }
                buttons.components[0].setDisabled(false)
                str = map.slice(0 + (n * 10), 10 + (n * 10))
                embed
                    .setDescription(`__Список команд__
${str.join(`\n`)}`)
                    .setFooter({
                        text: `Страница ${n + 1}/${total}`
                    })

                await interaction.editReply({
                    embeds: [embed],
                    components: [buttons],
                    ephemeral: true,
                    fetchReply: true
                })
            }
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
    category: `help`,
    plugin: {
        id: "misc",
        name: "Разное"
    },
    data: new SlashCommandBuilder()
        .setName(`help`)
        .setDescription(`Список команд бота`)
        .setDMPermission(false),
    execute
};