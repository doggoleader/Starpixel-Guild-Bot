const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder, WebhookClient, PermissionsBitField, PermissionFlagsBits, ChannelType, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, UserSelectMenuBuilder, RoleSelectMenuBuilder, ChannelSelectMenuBuilder, MentionableSelectMenuBuilder, AutoModerationRuleEventType, AutoModerationRuleKeywordPresetType, AutoModerationActionType, AutoModerationRuleTriggerType } = require('discord.js');
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
const { gameConstructor, calcActLevel, getLevel, isURL, getRes } = require(`../../functions`)
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

/**
 * 
 * @param {import("discord.js").ChatInputCommandInteraction} interaction Interaction
 * @param {import("../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        const userData = await User.findOne({ userid: interaction.user.id })
        if (userData.rank_number < 4) return interaction.reply({
            content: `Вы должны быть **чемпионом гильдии** или выше, чтобы использовать банк гильдии!`,
            ephemeral: true
        })
        switch (interaction.options.getSubcommand()) {
            case `open`: {
                if (userData.bank.opened == true) return interaction.reply({
                    content: `Вы не можете открыть новый вклад, пока у вас открыт старый!`,
                    ephemeral: true
                })
                let int = await interaction.options.getInteger(`количество`)
                if (int > userData.bank.max_balance) return interaction.reply({
                    content: `У вас не может быть более ${userData.bank.max_balance}<:Rumbik:883638847056003072> на вкладе. Чтобы увеличить максимальное количество румбиков, улучшите свой банковский аккаунт!`,
                    ephemeral: true
                })
                if (int < 100) return interaction.reply({
                    content: `Для открытия вклада вам необходимо как минимум 100<:Rumbik:883638847056003072>!`,
                    ephemeral: true
                })
                if (int > userData.bank.rumbik) return interaction.reply({
                    content: `У вас нет такого количества румбиков для открытия вклада!`,
                    ephemeral: true
                })
                userData.rumbik -= int
                userData.bank.balance = int
                userData.bank.expire = Date.now() + 1000 * 60 * 60 * 24 * 120
                userData.bank.opened = true
                userData.save()
                await interaction.reply({
                    content: `Вы успешно открыли свой банковский вклад на сумму ${int}<:Rumbik:883638847056003072>! Вы получите свои средства <t:${Math.round(userData.bank.expire / 1000)}:f>!`,
                    ephemeral: true
                })
            }
                break;
            case `info`: {
                if (userData.bank.opened == false) return interaction.reply({
                    content: `Вы не можете получить информацию о вашем вкладе, так как его у вас нет!`,
                    ephemeral: true
                })
                const embed = new EmbedBuilder()
                    .setTitle(`Информация о вашем банковском вкладе`)
                    .setColor(Number(linksInfo.bot_color))
                    .setTimestamp(Date.now())
                    .setDescription(`Вклад пользователя ${interaction.member}
                    
Баланс: ${userData.bank.balance}<:Rumbik:883638847056003072>
Процентная ставка: ${Math.round(userData.bank.multiplier * 100 - 100)}%
Дата закрытия вклада: <t:${Math.round(userData.bank.expire / 1000)}:f>
Ожидаемая прибыль: ${Math.round(userData.bank.balance * userData.bank.multiplier)}<:Rumbik:883638847056003072>`)
                await interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                })
            }
                break;
            case `close`: {
                if (userData.bank.opened == false) return interaction.reply({
                    content: `Вы не можете закрыть вклад, так как у вас нет открытых вкладов!`,
                    ephemeral: true
                })
                let button = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`close_bank`)
                            .setLabel(`Закрыть счёт`)
                            .setEmoji(`❌`)
                            .setStyle(ButtonStyle.Danger)
                    )
                const msg = await interaction.reply({
                    content: `Вы собираетесь закрыть свой банковский вклад на сумму ${userData.bank.balance}<:Rumbik:883638847056003072>! Он должен быть закрыт <t:${Math.round(userData.bank.expire / 1000)}:f>!
:warning: Обращаем ваше внимание, что в случае закрытия вклада сейчас вы потеряете все ваши проценты и не сможете их вернуть!
**Для подтверждения операции нажмите на кнопку ниже!**
**Для отмены операции удалите данное сообщение!**`,
                    components: [button],
                    fetchReply: true,
                    ephemeral: true
                })
                const collector = await msg.createMessageComponentCollector()
                collector.on('collect', async i => {
                    if (i.customId == `close_bank`) {
                        userData.rumbik += userData.bank.balance
                        userData.bank.balance = 0
                        userData.bank.expire = Date.now()
                        userData.bank.opened = false
                        userData.save()
                        await i.reply({
                            content: `Вы успешно закрыли ваш вклад!`,
                            ephemeral: true
                        })
                        collector.stop()
                    }
                })
                collector.on('end', async e => {
                    button = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`close_bank`)
                                .setLabel(`Закрыть счёт`)
                                .setEmoji(`❌`)
                                .setDisabled(true)
                                .setStyle(ButtonStyle.Danger)
                        )
                    await interaction.editReply({
                        components: [button]
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
    category: `info`,
    plugin: {
        id: "items",
        name: "Предметы"
    },
    data: new SlashCommandBuilder()
        .setName(`bank`)
        .setDescription(`Банковский аккаунт участника`)
        .setDMPermission(false)
        .addSubcommand(sb => sb
            .setName('open')
            .setDescription(`Открыть банковский вклад участника`)
            .addIntegerOption(o => o
                .setName(`количество`)
                .setDescription(`Количество румбиков, которые вы хотите положить в банк`)
                .setRequired(true)
            )
        )
        .addSubcommand(sb => sb
            .setName('info')
            .setDescription(`Информация о вкладе участника`)
        )
        .addSubcommand(sb => sb
            .setName('close')
            .setDescription(`Закрыть банковский вклад`)
        ),
    execute
}; 