const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder, WebhookClient, PermissionsBitField, PermissionFlagsBits, ChannelType, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, UserSelectMenuBuilder, RoleSelectMenuBuilder, ChannelSelectMenuBuilder, MentionableSelectMenuBuilder, AutoModerationRuleEventType, AutoModerationRuleKeywordPresetType, AutoModerationActionType, AutoModerationRuleTriggerType } = require('discord.js');
const { joinVoiceChannel, generateDependencyReport, EndBehaviorType, getVoiceConnection } = require('@discordjs/voice');
const { execute } = require('../../events/client/start_bot/ready');
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

    async execute(interaction, client) {
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




            const buttons1 = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId(`newstart`)
                        .setMinValues(1)
                        .setMaxValues(4)
                        .setPlaceholder(`Выберите задания, которые Вы хотите начать. Если Вы повторно выберите задания, Вы сохраните информацию о заданиях!`)
                        .addOptions(
                            {
                                label: `Задание 1`,
                                value: `задание 1`,
                                emoji: `1️⃣`,
                                description: `Набейте 1.000.000 GXP на Hypixel за неделю.`
                            },
                            {
                                label: `Задание 2`,
                                value: `задание 2`,
                                emoji: `2️⃣`,
                                description: `Выиграйте в SkyWars 500 раз.`
                            },
                            {
                                label: `Задание 3`,
                                value: `задание 3`,
                                emoji: `3️⃣`,
                                description: `Выиграйте в The Walls 20 раз.`
                            },
                            {
                                label: `Задание 4`,
                                value: `задание 4`,
                                emoji: `4️⃣`,
                                description: `Выиграйте в Bed Wars 300 раз.`
                            },
                        )
                )

            const menuCheck = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId(`newstart_check_menu`)
                        .setPlaceholder(`Получить информацию или закончить задание`)
                        .setOptions([
                            {
                                label: `Получить информацию`,
                                value: `info`,
                                description: `Получить информацию о текущих заданиях`,
                                emoji: `📃`
                            },
                            {
                                label: `Завершить задания`,
                                value: `end`,
                                description: `Завершить текущие задания`,
                                emoji: `✅`
                            }

                        ])
                )
            const b1 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`ach_myth_1`)
                        .setLabel(`Мифическое 1`)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(`🌟`)
                )
            const b2 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`ach_myth_2`)
                        .setLabel(`Мифическое 2`)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(`🌟`)
                )
            const b3 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`ach_myth_3`)
                        .setLabel(`Мифическое 3`)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(`🌟`)
                )
            const b4 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`ach_myth_4`)
                        .setLabel(`Мифическое 4`)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(`🌟`)
                )
            const b5 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`ach_myth_5`)
                        .setLabel(`Мифическое 5`)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(`🌟`)
                )
            const b6 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`ach_myth_6`)
                        .setLabel(`Мифическое 6`)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(`🌟`)
                )


            const file = new AttachmentBuilder()
                .setFile(`./src/assets/Channel names/NewStart.png`)
                .setName(`NewStart.png`)
            const c = await interaction.guild.channels.fetch(`1007317293983875174`)
            await c.send({
                files: [file]
            })
            await c.send({
                content: `Поздравляем! Вы решили начать свое развитие в гильдии заново. В данном канале Вы найдете для себя новые задания, достижения, награды и ранги!`
            })
            await c.send(`:black_medium_small_square:`)
            await c.send({
                content: `**МИФИЧЕСКИЕ ДОСТИЖЕНИЯ**
Теперь Вы можете выполнять мифические достижения. Выполнить их гораздо труднее, чем обычные. Возможно, придётся постараться, чтобы получить награду.
:black_medium_small_square:`
            })
            await c.send({
                content: `**ДОСТИЖЕНИЕ "СОЛНЦЕ"    |    СЛОЖНОСТЬ: :star: :star: :star: :star: :star: | НАГРАДА:** \`Сокровища\`

\`Овладеть силой Солнца.\`
Чтобы Вам засчитали ачивку, надо нажать на кнопку ниже. <@&694914074630422555>
:black_medium_small_square:`,
                allowedMentions: {
                    roles: ["694914074630422555"]
                },
                components: [b1]
            })
            await c.send({
                content: `**ДОСТИЖЕНИЕ "ЧЕМПИОН"    |    СЛОЖНОСТЬ: :star: :star: :star: :star: :star: | НАГРАДА:** \`Загадочная коробка\`

\`Иметь в профиле все наградные роли.\`
Чтобы Вам засчитали ачивку, надо нажать на кнопку ниже. <@&694914073376194740>
:black_medium_small_square:`,
                allowedMentions: {
                    roles: ["694914073376194740"]
                },
                components: [b2]
            })
            await c.send({
                content: `**ДОСТИЖЕНИЕ "ЖЕРТВА ВЕКА"    |    СЛОЖНОСТЬ: :star: :star: :star: | НАГРАДА:** \`Маленькая коробка\`

\`Иметь в профиле Подарок судьбы, а затем обменять его на маленькую коробку с помощью команды достижения.\`
Чтобы Вам засчитали ачивку, надо нажать на кнопку ниже. <@&694914074550468758> 
:black_medium_small_square:`,
                allowedMentions: {
                    roles: ["694914074550468758"]
                },
                components: [b3]
            })
            await c.send({
                content: `**ДОСТИЖЕНИЕ "ПЕРЕРОЖДЕНИЕ"    |    СЛОЖНОСТЬ: :star: :star: :star: :star: :star: | НАГРАДА:** \`Сокровища\`

\`Стать Владыкой гильдии ещё раз.\`
Чтобы Вам засчитали ачивку, надо нажать на кнопку ниже. <@&694914075460894791> 
:black_medium_small_square:`,
                allowedMentions: {
                    roles: ["694914075460894791"]
                },
                components: [b4]
            })
            await c.send({
                content: `**ДОСТИЖЕНИЕ "ПРОСТО МУСОР"    |    СЛОЖНОСТЬ: :star: :star: :star: :star: :star: | НАГРАДА:** \`Королевская коробка\`
\`Иметь в профиле 2000 румбиков, а затем обменять их на достижение.\`

Чтобы Вам засчитали ачивку, надо нажать на кнопку ниже. <@&697796942134116382>`,
                allowedMentions: {
                    roles: ["697796942134116382"]
                },
                components: [b5]
            })

            await c.send({
                content: `**ДОСТИЖЕНИЕ "??????? ?????"    |    СЛОЖНОСТЬ: :star: :star: :star: :star: :star: | НАГРАДА:** \`??????? ??????\`
\`??????? ?? ?????? ??? ???.\`

Чтобы Вам засчитали ачивку, надо нажать на кнопку ниже. <@&1068215995090608169>`,
                allowedMentions: {
                    roles: ["1068215995090608169"]
                },
                components: [b6]
            })
            await c.send({
                content: `:black_medium_small_square:`
            })
            await c.send({
                content: `
**МИФИЧЕСКИЕ РАНГИ**
Также Вы теперь можете стать выше Владыки гильдии и получить доступ к особым функциям сервера.
:black_medium_small_square: 
\`🧨\` **Лорд гильдии** - необходимо \`10000\` :diamond_shape_with_a_dot_inside:
Данный ранг имеет следующие преимущества:
- Все преимущества предыдущих рангов;
- __Возможность получать устанавливать постфикс__;
- __Возможность приобретать ускорители в магазине активности__.
:black_medium_small_square: 
\`💎\` **Император гильдии** - необходимо \`25000\` :diamond_shape_with_a_dot_inside:
Данный ранг имеет следующие преимущества:
- Все преимущества предыдущих рангов;
- __Доступ к королевскому магазину__;
- __Возможность получать коллекции гильдии__.
:black_medium_small_square: 
\`🍇\` **Повелитель гильдии** - необходимо \`50000\` :diamond_shape_with_a_dot_inside:
Данный ранг имеет следующие преимущества:
- Все преимущества предыдущих рангов;
- __Наивысшее отображение среди участников гильдии в списке__;
- __Возможность изменить значок ранга__;
- __Возможность передавать предметы другим участникам__\*.

\* *Не действует на достижения, ранги, позицию в гильдии, подписки, наградные роли, сезонные предметы и коллекции*.`
            })
            await c.send({
                content: `:black_medium_small_square:`
            })
            await c.send({
                content: `
**МИФИЧЕСКИЕ ЗАДАНИЯ**
Выполняйте мифические задания и получайте крутые награды. На выполнение каждого задания даётся неограниченное количество времени. Выполнить задание можно только 1 раз.
:black_medium_small_square:`
            })
            await c.send({
                content: `
**ЗАДАНИЕ 1**
:scroll: Набейте 1.000.000 GXP на Hypixel за неделю.
:trophy: Награда: \`Сокровища\`
:black_medium_small_square: 
**ЗАДАНИЕ 2**
:scroll: Выиграйте в SkyWars 500 раз.
:trophy: Награда: \`Сокровища\`
:black_medium_small_square: 
**ЗАДАНИЕ 3**
:scroll: Выиграйте в The Walls 20 раз.
:trophy: Награда: \`Подарок судьбы\`
:black_medium_small_square: 
**ЗАДАНИЕ 4**
:scroll: Выиграйте в Bed Wars 300 раз.
:trophy: Награда: \`Подарок судьбы\`
:black_medium_small_square: 
**ЗАДАНИЕ 5**
:scroll: Выполните все 31 достижения гильдии.
:trophy: Награда: \`Загадочная коробка\``,
                components: [buttons1, menuCheck]
            })

            await c.send({
                content: `:black_medium_small_square:`
            })
            await c.send({
                content: `
**ЗАКЛИНАНИЯ МАГА IV УРОВНЯ (МАГА-ЛЕГЕНДЫ)**
Начав развитие на сервере заново, Вы открыли для себя эксклюзивные возможности в школе магии. Теперь Вы можете использовать 3 новые команды:
\`/magic fourth attack\` - Дайте отпор своему обидчику с помощью данного заклинания! :muscle:
\`/magic fourth baby\` - Теперь Вы можете подарить любовь и тепло кому-либо из участников гильдии! :heart: 
\`/magic fourth scan\` - Просканируйте любого участника и расскажите всем о его секретах! :shield:`
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
}; 