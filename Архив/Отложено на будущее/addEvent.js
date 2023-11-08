const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder, WebhookClient, PermissionsBitField, PermissionFlagsBits, ChannelType, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, UserSelectMenuBuilder, RoleSelectMenuBuilder, ChannelSelectMenuBuilder, MentionableSelectMenuBuilder, AutoModerationRuleEventType, AutoModerationRuleKeywordPresetType, AutoModerationActionType, AutoModerationRuleTriggerType } = require('discord.js');
const { joinVoiceChannel, generateDependencyReport } = require('@discordjs/voice');
const { execute } = require('../../src/events/client/start_bot/ready');
const fs = require(`fs`)
const fetch = require(`node-fetch`);
const api = process.env.hypixel_apikey;
const { User } = require(`../../src/schemas/userdata`)
const { Guild } = require(`../../src/schemas/guilddata`)
const cron = require(`node-cron`)
const chalk = require(`chalk`);
const ch_list = require(`../../src/discord structure/channels.json`)
const prettyMilliseconds = require(`pretty-ms`); //ДОБАВИТЬ В ДРУГИЕ
const wait = require(`node:timers/promises`).setTimeout
const { gameConstructor, calcActLevel, getLevel, isURL, getRes } = require(`../../src/functions`)
const linksInfo = require(`../../src/discord structure/links.json`)
const { isOneEmoji } = require(`is-emojis`)
const moment = require(`moment`);

module.exports = {
    category: `admin_only`,
    plugin: `info`,
    data: new SlashCommandBuilder()
        .setName(`events`)
        .setDescription(`События гильдии`)
        .addSubcommand(sb => sb
            .setName("summer_add_visit")
            .setDescription("Засчитать летнее событие пользователю")
            .addUserOption(o => o
                .setName("пользователь")
                .setDescription("Пользователь, которому нужно засчитать летнее событие")
                .setRequired(true)
            )
        )
        .addSubcommand(sb => sb
            .setName("summer_remove_visit")
            .setDescription("Отменить посещение летнего события")
            .addUserOption(o => o
                .setName("пользователь")
                .setDescription("Пользователь, которому нужно отменить посещение летнего события")
                .setRequired(true)
            )
        )
        .addSubcommand(sb => sb
            .setName("check_voice")
            .setDescription("Отменить посещение летнего события")
            .addUserOption(o => o
                .setName("пользователь")
                .setDescription("Пользователь, которому нужно отменить посещение летнего события")
                .setRequired(true)
            )
        )
        .setDMPermission(false),

    async execute(interaction, client) {
        try {
            await interaction.reply({
                content: "Недоступно.",
                ephemeral: true
            })
            if (interaction.member.roles.cache.has('')) return interaction.reply({
                content: `У вас недостаточно прав, чтобы использовать эту команду!`,
                ephemeral: true
            })
            switch (interaction.options.getSubcommand()) {
                case "summer_add_visit": {

                }
                    break;
                case "summer_remove_visit": {

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
}; 