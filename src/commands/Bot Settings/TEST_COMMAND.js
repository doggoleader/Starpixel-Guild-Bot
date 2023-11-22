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
const { gameConstructor, calcActLevel, getLevel, isURL, getRes, getApplicationTemplates, createBingoProfile } = require(`../../functions`)
const linksInfo = require(`../../discord structure/links.json`)
const toXLS = require(`json2xls`);
const { Chart } = require(`chart.js`)
const { isOneEmoji } = require(`is-emojis`)
const moment = require(`moment`);
const { Apply } = require('../../schemas/applications');
const { Polls } = require('../../schemas/polls');
const QiwiPayments = require(`@qiwi/bill-payments-node-js-sdk`);
const { Birthday } = require('../../schemas/birthday');
const https = require('https');
const { API, Upload } = require('vk-io');
const { SocialVerify } = require('../../schemas/verify');
let nbt = require('prismarine-nbt');
let zlib = require('zlib');
const { GuildProgress, UserProfile } = require('../../misc_functions/Exporter');

/**
 * 
 * @param {import("discord.js").ChatInputCommandInteraction} interaction Interaction
 * @param {import("../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        /* const userData = await User.findOne({ userid: interaction.user.id })
        const qiwiAPI = new QiwiPayments(process.env.QIWI_P2P_PRIVATE)
        const billId = await qiwiAPI.generateId();
        const bill = await qiwiAPI.createBill(billId, {
            amount: 1.00,
            currency: 'RUB',
            comment: 'Покупка румбиков в гильдии Starpixel',
            expirationDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
            account: userData.userid,
            successUrl: 'https://discord.gg/CjNwZfSvej',
            paySource: `qw`
        })
        const buttons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel(`Оплатить`)
            .setURL(bill.payUrl)
        )
        .addComponents(
            new ButtonBuilder()
            .setStyle(ButtonStyle.Success)
            .setLabel(`Проверить`)
            .setCustomId(`qiwi_bill_check`)
        )
        .addComponents(
            new ButtonBuilder()
            .setStyle(ButtonStyle.Danger)
            .setLabel(`Проверить`)
            .setCustomId(`qiwi_bill_reject`)
        )
        const msg = await interaction.member.send({
            content: `Оплатите счет!`,
            components: [buttons]
        })
        userData.payments.qiwi.push({
            billid: billId, 
            messageid: msg.id
        })
        userData.save() */

        /* const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) return interaction.channel.send("Please join a voice channel first!");
        console.log(1)
        const connection = await joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            selfDeaf: false,
            selfMute: true,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });
        const receiver = connection.receiver.subscribe(interaction.member.user.id, {
            mode: "pcm",
            end: {
                behavior: EndBehaviorType.AfterSilence,
                duration: 1000
            }
        });
        console.log(2)
        const writer = receiver.pipe(fs.createWriteStream(`./src/files/Recordings/recorded.pcm`));
        console.log(3)
        writer.once("finish", async () => {
            console.log(4)
            await connection.destroy()
            await interaction.channel.send("Finished writing audio");
            var exec = require('child_process').exec;
            console.log(5)
            await exec(`ffmpeg -f s16le -ar 44.1k -ac 2 -i ./src/files/Recordings/recorded.pcm ./src/files/Recordings/recorded.wav`,
                function (error, stdout, stderr) {
                    console.log('stdout: ' + stdout);
                    console.log('stderr: ' + stderr);
                    if (error !== null) {
                        console.log('exec error: ' + error);
                    }
                    console.log(6)
                });
            await wait(2000)
            console.log(7)
            const att = new AttachmentBuilder().setFile(`./src/files/Recordings/recorded.wav`).setName(`recording.wav`)
            await interaction.channel.send({
                files: [att]
            })
        }); */
        /* let d = `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`
        let invData = [31, -117, 8, 0, 0, 0, 0, 0, 0, 0, -29, 98, 96, -32, 100, 96, -52, -28, 98, 96, 96, 80, 97, 98, 96, -54, 76, 97, 100, 98, 100, 96,
            117, -50, 47, -51, 43, 97, -28, 98, 96, 46, 73, 76, 103, 100, -32, 14, -51, 75, 42, 74, 77, -52, 78, 76, -54, 73, 101, 100, 102, -32, -12,
            -56, 76, 73, 117, -53, 73, 76, 47, 6, 106, -6, -57, -59, -64, -98, -110, 89, 92, -112, -109, 88, -55, -55, -64, -30, -109, 95, -108, -54, 1,
            20, 101, 97, -32, 57, -76, -36, 60, 32, -75, 40, 91, 33, -77, 36, 53, 23, 40, 34, 124, 104, -71, -91, -74, -71, -126, 99, 73, 73, 98, 114,
            -74, -126, 75, 98, 110, 98, 122, 42, 3, 31, 80, 16, -55, 108, 6, 6, 38, 6, 54, -88, 20, -120, 13, 114, 13, 43, 126, -41, -96, -24, -128, 0,
            -120, 62, 54, -104, 62, 5, 76, 21, -40, 1, 0, 111, 21, -87, 83, 10, 1, 0, 0];
        let buf = Buffer.from(d, 'base64');

        nbt.parse(buf, (err, data) => {
            if (err)
                return console.error(err);

            console.log(JSON.stringify(data));
        }) */
        await interaction.deferReply({ fetchReply: true })
        const bday_datas = await Birthday.find()
        for (let bday of bday_datas) { 
            const userData = await User.findOne({ userid: bday.userid })
            userData.birthday.day = bday.day
            userData.birthday.month = bday.month
            userData.birthday.year = bday.year
            userData.save()
        }

        await interaction.editReply({
            content: `ДР ОБНОВЛЕНЫ`
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
    category: `admin_only`,
    plugin: {
        id: "admin",
        name: "Административное"
    },
    data: new SlashCommandBuilder()
        .setName(`test_command_no_usage`)
        .setDescription(`TEST_COMMAND_NO_USAGE`)
        .setDefaultMemberPermissions(0)
        /* .addUserOption(o => o
            .setName(`пользователь`)
            .setDescription(`45o345`)
            .setRequired(true))
        .addIntegerOption(o => o
            .setName(`число`)
            .setDescription(`45o345`)
            .setRequired(true)) */
        .setDMPermission(false),
    execute
}; 