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
const wait = require(`node:timers/promises`).setTimeout
const { gameConstructor, calcActLevel, getLevel, isURL, getRes, getApplicationTemplates, createBingoProfile, mentionCommand, getProperty, calcCooldown } = require(`../../functions`)
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
let nbt = require('prismarine-nbt');
let zlib = require('zlib');
const bingo = require(`../../jsons/NewYearBingo.json`)
const { GuildProgress, UserProfile } = require('../../misc_functions/Exporter');
const { PersInfo } = require('../../functions/Updates/PersonalInfoClass');
const { Model } = require('mongoose');
const { Temp } = require('../../schemas/temp_items');

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
        //await client.AdventCalendar();

        const ch1 = await interaction.guild.channels.fetch(`1031224458855321720`)
        const ch2 = await interaction.guild.channels.fetch(`1031224478803447808`)
        const ch3 = await interaction.guild.channels.fetch(`1031224495932969071`)
        const stats = new ActionRowBuilder()
            .addComponents(
                new UserSelectMenuBuilder()
                    .setCustomId(`season_easter_stats`)
                    .setMaxValues(1)
                    .setPlaceholder(`Посмотреть пасхальную статистику`)
            )
        const quests = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(`season_easter_quests`)
                    .setPlaceholder(`Пасхальные квесты`)
                    .setOptions(
                        {
                            label: `Начать квест`,
                            value: `start_quest`
                        },
                        {
                            label: `Получить информацию о квесте`,
                            value: `quest_info`
                        },
                        {
                            label: `Закончить квест`,
                            value: `end_quest`
                        },
                        {
                            label: "Пасхальный бинго-марафон",
                            value: "bingo"
                        }

                    )
            )
        const lb = new ActionRowBuilder()
            .setComponents(
                new ButtonBuilder()
                    .setCustomId(`season_easter_leaderboard`)
                    .setEmoji(`🏅`)
                    .setLabel(`Таблица лидеров`)
                    .setStyle(ButtonStyle.Primary)
            )

        const f1 = new AttachmentBuilder()
            .setName(`Easter Main.png`)
            .setFile(`./src/assets/Channel names/Easter Main.png`),
            f2 = new AttachmentBuilder()
                .setName(`Easter Achievements.png`)
                .setFile(`./src/assets/Channel names/Easter Achievements.png`),
            f3 = new AttachmentBuilder()
                .setName(`Easter Points.png`)
                .setFile(`./src/assets/Channel names/Easter Points.png`)

        await ch1.send({
            files: [f1]
        })
        await ch1.send({
            content: `Наступила весна, а это значит, что самое время для празднования самого главного весеннего праздника - Пасхи.`
        })
        await ch1.send({
            content: `:black_medium_small_square:`
        })
        await ch1.send({
            content: `**Что вас ждет?**
• Пасхальное яйцо
• Пасхальные ежедневные квесты
• Пасхальные предметы
• Пасхальные косметические значки
• Пасхальные достижения
• Пасхальные очки`
        })
        await ch1.send({
            content: `:black_medium_small_square:`
        })
        await ch1.send({
            content: `**Пасхальная коробка и предметы**
В течение этого месяца у вас будет возможность заработать <@&1007718117809606736> и различные сезонные косметические роли! Выполняйте задания, зарабатывайте очки и открывайте пасхальное яйцо для получения ролей!
◾ 
**Пасхальные ежедневные квесты**
Каждый день вы можете активировать пасхальный квест. Для его активации используйте меню ниже. Его выполнение даст вам 5 пасхальных очков & пасхальное яйцо!
◾  
**Пасхальный бинго-марафон**
Каждый день вы можете активировать пасхальный квест. Для его активации используйте меню ниже. Его выполнение даст вам 5 пасхальных очков & пасхальное яйцо!
◾ 
**Пасхальные достижения**
В канале <#1031224478803447808> вы можете прочитать про все пасхальные достижения, которые доступны вам! Помните, что вы можете выполнить каждое достижение только 1 раз в год!
◾ 
**Пасхальные очки**
За каждое открытие коробки вы будете получать от 0 до 2 пасхальных очков. Вы можете обменять их на косметические значки **ИЛИ** можете начать их копить, чтобы заработать звание <@&660236704971489310>! Тот, кто соберет больше всего очков за период, получит данную награду! Подробнее вы можете прочитать в <#1031224495932969071>!`
        })
        await ch1.send({
            content: `:black_medium_small_square:`
        })
        await ch1.send({
            content: `Используйте данные меню и кнопки, чтобы активно участвовать в пасхальном событии и узнать свою сезонную статистику!`,
            components: [
                lb,
                quests,
                stats
            ]
        })


        const ach1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`season_easter_ach1`)
                    .setEmoji(`🥚`)
                    .setLabel(`Достижение 1`)
                    .setStyle(ButtonStyle.Primary)
            )
        const ach2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`season_easter_ach2`)
                    .setEmoji(`🥚`)
                    .setLabel(`Достижение 2`)
                    .setStyle(ButtonStyle.Primary)
            )
        const ach3 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`season_easter_ach3`)
                    .setEmoji(`🥚`)
                    .setLabel(`Достижение 3`)
                    .setStyle(ButtonStyle.Primary)
            )
        const ach4 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`season_easter_ach4`)
                    .setEmoji(`🥚`)
                    .setLabel(`Достижение 4`)
                    .setStyle(ButtonStyle.Primary)
            )
        const ach5 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`season_easter_ach5`)
                    .setEmoji(`🥚`)
                    .setLabel(`Достижение 5`)
                    .setStyle(ButtonStyle.Primary)
            )

        await ch2.send({
            files: [f2]
        })
        await ch2.send({
            content: `В данном канале вы можете увидеть пасхальные достижения, которые вы можете выполнить в течение этого сезона!`
        })
        await ch2.send({
            content: `:black_medium_small_square:`
        })
        await ch2.send({
            content: `:black_medium_small_square:
**ДОСТИЖЕНИЕ "ЯЙЦО"    |    СЛОЖНОСТЬ: :egg: | НАГРАДА:** \`Пасхальное яйцо\`

\`Получите эксклюзивную картинку egg.\`
Чтобы получить достижение, нажмите на кнопку ниже.`,
            components: [ach1]
        })

        await ch2.send({
            content: `:black_medium_small_square:
**ДОСТИЖЕНИЕ "ПОЛТИННИК"    |    СЛОЖНОСТЬ: :egg: :egg: | НАГРАДА:** \`Пасхальное яйцо\`

\`Заработайте 50 пасхальных очков.\`
Чтобы получить достижение, нажмите на кнопку ниже.`,
            components: [ach2]
        })
        await ch2.send({
            content: `:black_medium_small_square:
**ДОСТИЖЕНИЕ "КРАСОТА"    |    СЛОЖНОСТЬ: :egg: :egg: :egg: | НАГРАДА:** \`Пасхальное яйцо\`

\`Приобретите косметический значок в пасхальном магазине.\`
Чтобы получить достижение, нажмите на кнопку ниже.`,
            components: [ach3]
        })

        await ch2.send({
            content: `:black_medium_small_square:
**ДОСТИЖЕНИЕ "КРОЛИК"    |    СЛОЖНОСТЬ: :egg: :egg: :egg: :egg: | НАГРАДА:** \`Пасхальное яйцо\`

\`Найдите пасхального кролика.\`
Чтобы получить достижение, нажмите на кнопку ниже.`,
            components: [ach4]
        })

        await ch2.send({
            content: `:black_medium_small_square:
**ДОСТИЖЕНИЕ "ЗАДАНИЕ"    |    СЛОЖНОСТЬ: :egg: :egg: :egg: :egg: :egg: | НАГРАДА:** \`Пасхальное яйцо\`

\`Выполните 5 пасхальных квестов.\`
Чтобы получить достижение, нажмите на кнопку ниже.`,
            components: [ach5]
        })
        await ch2.send({
            content: `:black_medium_small_square:`
        })
        await ch2.send({
            content: `За выполнение всех достижений вы получите **ЭКСКЛЮЗИВНУЮ** роль <@&1030757633231167538>, дающую вам возможность поставить пасхальный цвет в любое время!`
        })


        const shop = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(`season_easter_shop`)
                    .setPlaceholder(`Купить косметический значок`)
                    .setOptions(
                        {
                            label: `🥚`,
                            value: `🥚`
                        },
                        {
                            label: `🐣`,
                            value: `🐣`
                        },
                        {
                            label: `🐤`,
                            value: `🐤`
                        },
                        {
                            label: `🐔`,
                            value: `🐔`
                        },
                        {
                            label: `🍃`,
                            value: `🍃`
                        },
                        {
                            label: `🥧`,
                            value: `🥧`
                        },

                    )
            )
        await ch3.send({
            files: [f3]
        })
        await ch3.send({
            content: `Участвуя в пасхальном событии, вы будете зарабатывать специальные очки, которые вы можете либо копить, либо потратить в данном магазине.`
        })
        await ch3.send({
            content: `:black_medium_small_square:`
        })
        await ch3.send({
            content: `**СПОСОБЫ ЗАРАБОТКА ОЧКОВ**
• Открытие пасхальных яиц (от 0 до 2 очков за открытие)
• Выполнение достижений (5 очков за достижение)
• Выполнение пасхальных квестов (5 очков за выполненный квест)

Чтобы посмотреть заработанные вами очки, используйте меню в канале <#1031224458855321720>.`
        })
        await ch3.send({
            content: `:black_medium_small_square:`
        })
        await ch3.send({
            content: `**ПАСХАЛЬНЫЙ МАГАЗИН**
В данном магазине вы можете приобрести пасхальные косметические значки, которые доступны только в этот период.
\`🥚\` - 30 очков
\`🐣\` - 30 очков
\`🐤\` - 30 очков
\`🐔\` - 40 очков
\`🍃\` - 50 очков
\`🥧\` - 50 очков

Для покупки косметического значка в данном магазине используйте меню ниже.`,
            components: [shop]
        })
        await ch3.send({
            content: `:black_medium_small_square:`
        })
        await ch3.send({
            content: `В конце сезона (10 мая) человек, который имеет в профиле наибольшее количество очков, получит роль <@&660236704971489310>! Вы можете в любой момент посмотреть список лучших участников с помощью кнопки в канале <#1031224458855321720>.`
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