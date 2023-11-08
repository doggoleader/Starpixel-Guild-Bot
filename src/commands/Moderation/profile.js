const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType, StringSelectMenuBuilder, ChannelType, UserSelectMenuBuilder, AttachmentBuilder, ApplicationFlagsBitField } = require('discord.js');
const fetch = require(`node-fetch`);
const wait = require(`node:timers/promises`).setTimeout
const api = process.env.hypixel_apikey;
const { User } = require(`../../schemas/userdata`)
const { Guild } = require(`../../schemas/guilddata`)
const { Apply } = require(`../../schemas/applications`)
const { Birthday } = require(`../../schemas/birthday`)
const chalk = require(`chalk`);
const prettyMilliseconds = require(`pretty-ms`); //ДОБАВИТЬ В ДРУГИЕ
const ch_list = require(`../../discord structure/channels.json`);
const { calcActLevel, getLevel, rankName, monthName, convertToRoman } = require(`../../functions`);
const linksInfo = require(`../../discord structure/links.json`)
const fs = require(`fs`)
const rolesInfo = require(`../../discord structure/roles.json`);
const { UserProfile, GuildProgress } = require(`../../misc_functions/Exporter`)

module.exports = {
    category: `items`,
    plugin: {
        id: "items",
        name: "Предметы"
    },
    data: new SlashCommandBuilder()
        .setName(`profile`)
        .setDescription(`Профиль игрока`)
        .setDMPermission(true)
        .addSubcommand(subcommand => subcommand
            .setName(`create`)
            .setDescription(`Создать профиль игрока`)
            .addUserOption(option => option
                .setName(`пользователь`)
                .setDescription(`Пользователь в Discord`)
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName(`update`)
            .setDescription(`Обновить свой профиль`)
        )
        .addSubcommand(subcommand => subcommand
            .setName(`delete`)
            .setDescription(`Удалить профиль игрока`)
            .addStringOption(option => option
                .setName(`id`)
                .setDescription(`ID в Discord`)
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName(`reset`)
            .setDescription(`Сбросить свой профиль (Владыка+)`)
        )
        .addSubcommand(subcommand => subcommand
            .setName(`updateall`)
            .setDescription(`Обновить профиль всех участников`)
        )
        .addSubcommand(subcommand => subcommand
            .setName(`settings`)
            .setDescription(`Настройки профиля`)
        )
        .addSubcommand(subcommand => subcommand
            .setName(`info`)
            .setDescription(`Информация о профиле`)
            .addUserOption(o => o
                .setName(`пользователь`)
                .setDescription(`Получить информацию о профиле пользователя`)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName(`getgexp`)
            .setDescription(`Получить информацию о GEXP пользователя за последний месяц`)
            .addUserOption(o => o
                .setName(`пользователь`)
                .setDescription(`Получить информацию о GEXP пользователя`)
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName(`addtoinventory`)
            .setDescription(`Добавить предмет в инвентарь пользователя`)
            .addUserOption(o => o
                .setName(`пользователь`)
                .setDescription(`Пользователь, которому необходимо добавить предмет`)
                .setRequired(true)
            )
            .addRoleOption(o => o
                .setName(`роль`)
                .setDescription(`Роль, которую необходимо добавить`)
                .setRequired(true)
            )
            .addIntegerOption(o => o
                .setName(`количество`)
                .setDescription(`Количество, которое необходимо выдать`)
                .setRequired(false)
            )
        )
        .addSubcommand(sb => sb
            .setName(`removecolor`)
            .setDescription(`Удалить пользовательский цвет`)
            .addUserOption(o => o
                .setName(`пользователь`)
                .setDescription(`Пользователь, цвет которого нужно удалить (без возврата румбиков)`)
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName(`getprofile`)
            .setDescription(`Получить файл вашего профиля в формате JSON`)
            .addUserOption(o => o
                .setName(`пользователь`)
                .setDescription(`Пользователь, профиль которого необходимо получить`)
                .setRequired(false)
            )
        ),

    async autoComplete(interaction, client) {
        switch (interaction.options.getSubcommandGroup()) {
            case `set`: {
                switch (interaction.options.getSubcommand()) {
                    case `string`: {
                        const focusedValue = interaction.options.getFocused();
                        const choices = [
                            'ID в Discord',
                            'UUID в Minecraft'
                        ];
                        const filtered = choices.filter(choice => choice.toLowerCase().includes(focusedValue.toLowerCase()));;
                        await interaction.respond(
                            filtered.map(choice => ({ name: choice, value: choice })),
                        );
                    }

                        break;

                    case `number`: {
                        const focusedValue = interaction.options.getFocused();
                        const choices = [
                            `Возраст`,
                            'Опыт активности',
                            'Уровень активности',
                            'Опыт рангов',
                            'Румбики',
                            'Опыт гильдии (GEXP)',
                            'Билеты',
                            `Медаль 🥇`,
                            `Медаль 🥈`,
                            `Медаль 🥉`,
                            'Цены в магазине',
                            'Цены в магазине активности',
                            `Цены в королевском магазине`,
                            `Персональный бустер опыта активности`,
                            `Персональный бустер опыта рангов`,
                            `Персональный бустер румбиков`,
                            `Обычные достижения`,
                            `Мифические достижения`,

                            `Навык "Перемещение под землёй" (Земля)`,
                            `Навык "Быстрый рост растений" (Земля)`,
                            `Навык "Выращивание горных пород" (Земля)`,
                            `Навык "Плавание на глубине" (Вода)`,
                            `Навык "Сопротивление течениям" (Вода)`,
                            `Навык "Подводное дыхание" (Вода)`,
                            `Навык "Защита от огня" (Огонь)`,
                            `Навык "Удар молнии" (Огонь)`,
                            `Навык "Управление пламенем" (Огонь)`,
                            `Навык "Полет в небесах" (Воздух)`,
                            `Навык "Повеление ветром" (Воздух)`,
                            `Навык "Орлиный глаз" (Воздух)`,

                            `Шансы на обычные предметы`,
                            `Шансы на необычные предметы`,
                            `Шансы на редкие предметы`,
                            `Шансы на эпические предметы`,
                            `Шансы на легендарные предметы`,
                            `Шансы на мифические предметы`,
                            `Шансы на ультраредкие предметы`,

                            `Перк "Повышение опыта рангов"`,
                            `Перк "Скидка в королевском магазине"`,
                            `Перк "Скидка в магазине активности"`,
                            `Перк "Скидка в обычном магазине гильдии"`,
                            `Перк "Увеличение времени действия временных предметов"`,
                            `Перк "Возможность продавать предметы из профиля"`,
                            `Перк "Уменьшение опыта гильдии для получения билета"`,
                            `Перк "Изменение предметов"`,

                            `Совместные игры`

                        ];
                        const filtered = choices.filter(choice => choice.toLowerCase().includes(focusedValue.toLowerCase())).slice(0, 25);
                        await interaction.respond(
                            filtered.map(choice => ({ name: choice, value: choice })),
                        );
                    }

                        break;
                    case `boolean`: {
                        const focusedValue = interaction.options.getFocused();
                        const choices = [
                            'Пользовательский значок ранга',
                        ];
                        const filtered = choices.filter(choice => choice.toLowerCase().includes(focusedValue.toLowerCase()));;
                        await interaction.respond(
                            filtered.map(choice => ({ name: choice, value: choice })),
                        );
                    }

                        break;
                    default:
                        break;
                }
            }

                break;

            default:
                break;
        }


    },
    async execute(interaction, client) {
        try {
            switch (interaction.options.getSubcommand()) {
                case `create`: {
                    await interaction.deferReply({
                        fetchReply: true,
                        ephemeral: true
                    })
                    if (interaction.channel.type == ChannelType.DM) return interaction.editReply({
                        content: `Вы не можете использовать эту команду в личных сообщениях!`,
                        ephemeral: true
                    })
                    const user = interaction.options.getUser(`пользователь`)
                    const appData = await Apply.findOne({ userid: user.id, guildid: interaction.guild.id })
                    const realname = appData.que1
                    const playername = appData.que2

                    if (!interaction.member.roles.cache.has(`563793535250464809`)) {
                        const embed = new EmbedBuilder()
                            .setAuthor({
                                name: `❗ Отсутствует необходимая роль!`
                            })
                            .setDescription(`Вы не имеете роль \`${interaction.guild.roles.cache.get(`563793535250464809`).name}\` или выше!`)
                            .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                            .setColor(`DarkRed`)
                            .setTimestamp(Date.now())

                        return interaction.editReply({
                            embeds: [embed],
                            ephemeral: true
                        })
                    }
                    else {
                        const thread = await interaction.guild.channels.fetch(appData.threadid)
                        await thread.setLocked(true).catch()
                        await thread.setArchived(true).catch()

                        const userData = new User({ userid: user.id, name: user.username })
                        const creator = await User.findOne({ userid: interaction.member.user.id }) || new User({ userid: interaction.member.user.id, name: interaction.member.user.username })

                        if (creator.cooldowns.prof_create > Date.now()) return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                    .setAuthor({
                                        name: `Команда на перезарядке!`
                                    })
                                    .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                                    .setColor(`DarkRed`)
                                    .setTimestamp(Date.now())
                                    .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${prettyMilliseconds(userData.cooldowns.prof_create - Date.now(), { secondsDecimalDigits: 0 })}!`)
                            ],
                            ephemeral: true
                        });
                        const memberDM = await interaction.guild.members.fetch(user.id)
                        if (appData.onlinemode == 'yes') {
                            let response = await fetch(`https://api.hypixel.net/player?name=${playername}`, {
                                headers: {
                                    "API-Key": api,
                                    "Content-Type": "application/json"
                                }
                            })
                            try {
                                let json = await response.json()

                                console.log(chalk.blackBright(`[${new Date()}]`) + chalk.hex(`#FFA500`)(`[HypixelAPI]`) + chalk.gray(`: Ник игрока - ${json.player.displayname}, UUID - ${json.player.uuid}`))
                                userData.nickname = json.player.displayname;
                                userData.markModified(`nickname`)
                                userData.uuid = json.player.uuid;
                                userData.onlinemode = true;
                                userData.markModified(`uuid`)
                                userData.cooldowns.prof_update = Date.now() + (1000 * 60 * 60 * 24)
                                creator.cooldowns.prof_create = Date.now() + (1000 * 60)
                                creator.markModified(`prof_create`)
                            } catch (error) {
                                userData.onlinemode = false;
                                await interaction.followUp({
                                    content: `Пользователь ${memberDM} не имеет лицензионного аккаунта Minecraft (Введено: \`${playername}\`), поэтому он не будет иметь доступ к возможностям, требующим лицензию Minecraft!`
                                })
                                await memberDM.send({
                                    content: `У вас нет лицензионного аккаунта Minecraft (Введено: \`${playername}\`), поэтому у вас не будет доступа к возможностям, требующим лицензию Minecraft!`
                                }).catch()
                                console.log(chalk.blackBright(`[${new Date()}]`) + chalk.hex(`#FFA500`)(`[HypixelAPI]`) + chalk.gray(`: Игрока с никнеймом ${playername} не существует `));
                            }
                        } else {
                            userData.onlinemode = false;
                        }

                        try {
                            const age = Number(appData.que3)
                            if (age <= 0) return interaction.editReply({
                                content: `Возраст не может быть отрицательным!`,
                                ephemeral: true
                            })
                            userData.age = age
                        } catch (e) {
                            await interaction.followUp({
                                content: `Произошла ошибка при обработке вашего возраста \`${appData.que3}\`! Если это ошибка, пожалуйста, обратитесь в <#849516805529927700>, сообщив ваш возраст!`
                            })
                            await memberDM.send({
                                content: `Произошла ошибка при обработке вашего возраста \`${appData.que3}\`! Если это ошибка, пожалуйста, обратитесь в <#849516805529927700>, сообщив ваш возраст!`
                            }).catch()
                        }

                        userData.name = user.username
                        userData.displayname.name = realname

                        const roles = [
                            `553593731953983498`,
                            `504887113649750016`,
                            `721047643370815599`,
                            `702540345749143661`,
                            `746440976377184388`,
                            `722523773961633927`,
                            `849533128871641119`,
                            `709753395417972746`,
                            `722533819839938572`,
                            `722523856211935243`,
                            `1020403089943040040`
                        ]
                        const randombox = [
                            `819930814388240385`,
                            `510932601721192458`,
                            `521248091853291540`,
                            `584673040470769667`,
                            `893932177799135253`,
                            `925799156679856240`,
                            `1007718117809606736`,
                            `992820494900412456`
                        ]
                        let rloot1 = randombox[Math.floor(Math.random() * randombox.length)];
                        await memberDM.roles.add(roles).catch()
                        await memberDM.roles.add(rloot1).catch()
                        const channel = await interaction.guild.channels.fetch(ch_list.apply)
                        const msg = await channel.messages.fetch(appData.applicationid)
                        const buttons = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`app_decline`)
                                    .setEmoji(`❌`)
                                    .setLabel(`Отклонить заявку`)
                                    .setStyle(ButtonStyle.Danger)
                                    .setDisabled(true)
                            )
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`app_waiting`)
                                    .setEmoji(`🕑`)
                                    .setLabel(`На рассмотрение`)
                                    .setStyle(ButtonStyle.Secondary)
                                    .setDisabled(true)
                            )
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`app_accept`)
                                    .setEmoji(`✅`)
                                    .setLabel(`Принять заявку`)
                                    .setStyle(ButtonStyle.Success)
                                    .setDisabled(true)
                            )
                        const embed = new EmbedBuilder()
                            .setTitle(`Заявка на вступление пользователя ${interaction.user.username}`)
                            .setColor(Number(linksInfo.bot_color))
                            .setDescription(`**ЗАЯВКА**
1. Имя - \`${appData.que1}\`.
2. Никнейм - \`${appData.que2 ? appData.que2 : "Нет аккаунта"}\`.
3. Возраст - \`${appData.que3}\`.
4. Готовность пойти в голосовой канал - \`${appData.que4}\`.
5. Знакомство с правилами - \`${appData.que5}\`.
        
6. Почему вы желаете вступить именно к нам в гильдию?
\`${appData.que6}\`.
        
7. Как вы узнали о нашей гильдии?
\`${appData.que7}\`.

**Заявка обработана офицером ${interaction.member}**
**Статус заявки**: ${appData.status}`)
                            .setFooter({ text: `Пожалуйста, при любом решении нажмите на одну из кнопок ниже.` })
                        await msg.edit({
                            embeds: [embed],
                            components: [buttons]
                        })

                        userData.joinedGuild = Date.now()
                        const ch = await interaction.guild.channels.fetch(ch_list.hypixelThread)
                        await ch.send(`/g invite ${playername}`)
                        appData.status = `Принята`
                        await creator.save()
                        await userData.save()
                        await appData.save()
                        client.PersJoinGuild(userData.userid)
                        if (memberDM.user.id !== `491343958660874242`) {
                            await memberDM.setNickname(`「${userData.displayname.rank}」 ${userData.displayname.ramka1}${userData.displayname.name}${userData.displayname.ramka2}${userData.displayname.suffix} ${userData.displayname.symbol}┇ ${userData.displayname.premium}`)
                        }

                        const progress = new GuildProgress(memberDM, client);
                        await progress.getAndUpdateUserPoints();


                        const success = new EmbedBuilder()
                            .setAuthor({
                                name: `Профиль успешно создан!`
                            })
                            .setColor(Number(linksInfo.bot_color))
                            .setDescription(`Профиль пользователя ${interaction.options.getUser(`пользователь`)} (${userData.nickname}) был успешно создан. В течение определенного времени он будет добавлен в канал с участниками!`)
                            .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                            .setTimestamp(Date.now())

                        await interaction.editReply({
                            embeds: [success]
                        })
                        let d = 1, dd = 1, ddd = 1
                        const embed1 = new EmbedBuilder()
                            .setColor(Number(linksInfo.bot_color))
                            .setTitle(`Профиль игрока успешно создан!`)
                            .setTimestamp(Date.now())
                            .setThumbnail(interaction.guild.iconURL())
                            .setDescription(
                                `**${d++}.** Профиль пользователя ${interaction.options.getUser(`пользователь`)} (\`${userData.nickname}\`) был успешно создан. ✅
**${d++}.** Необходимые роли были добавлены. ✅
**${d++}.** Случайный приветственный подарок в виде <@&${rloot1}> был успешно выдан. ✅
**${d++}.** Никнейм был успешно изменён и привязан к системе никнеймов. ✅
**${d++}.** Синхронизация с аккаунтом Hypixel прошла успешно. ✅
**${d++}.** Прочая информация была добавлена. ✅

**${dd++}.** Ожидаем добавления игрока в гильдию на Hypixel. 🕑
**${dd++}.** Ожидаем данные о дне рождении игрока. 🕑`)

                        const embed2 = new EmbedBuilder()
                            .setColor(Number(linksInfo.bot_color))
                            .setTitle(`Добро пожаловать в гильдию Starpixel!`)
                            .setTimestamp(Date.now())
                            .setThumbnail(user.displayAvatarURL())
                            .setDescription(`${interaction.options.getUser(`пользователь`)}, добро пожаловать в гильдию!

Чтобы получить краткую информацию о нашем Discord сервере, используйте \`/start\`!

Пожалуйста, отправьте сообщением ниже дату вашего рождения в формате DD.MM.YYYY (DD - день, MM - месяц, YYYY - год).

Помимо этого, ознакомьтесь с последними новостями гильдии в канале <#${ch_list.news}>! Вы также можете ещё раз ознакомиться с правилами в <#${ch_list.rules}>!

Пропишите команду </help:1047205512971817040>, чтобы получить полный список команд!

Если модерация гильдии до сих пор не добавила вас, пожалуйста, подождите некоторое время. Вас скоро добавят!`)
                        await interaction.guild.channels.cache.get(ch_list.main).send({
                            content: `@here`,
                            embeds: [embed1, embed2],
                            allowedMentions: {
                                parse: ["everyone"]
                            }
                        })
                        console.log(chalk.blackBright(`[${new Date()}]`) + chalk.cyan(`[База данных]`) + chalk.gray(`: Профиль пользователя ${userData.name} (${userData.nickname}) был успешно создан!`))

                    }
                }

                    break;
                case `update`: {
                    const { user } = interaction;
                    const guild = await client.guilds.fetch(`320193302844669959`)
                    const member = await guild.members.fetch(user.id)
                    if (!member || !member.roles.cache.has(`504887113649750016`)) return interaction.reply({
                        content: `Вы не можете использовать эту команду, так как вы не являетесь участником гильдии!`
                    })
                    const userData = await User.findOne({ userid: user.id });
                    if (userData.cooldowns.prof_update > Date.now()) return interaction.reply({
                        embeds: [new EmbedBuilder()
                            .setAuthor({
                                name: `Команда на перезарядке!`
                            })
                            .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                            .setColor(`DarkRed`)
                            .setTimestamp(Date.now())
                            .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${prettyMilliseconds(userData.cooldowns.prof_update - Date.now(), { secondsDecimalDigits: 0 })}!`)
                        ],
                        ephemeral: true
                    })
                    userData.name = user.username
                    if (userData.onlinemode) {
                        let response = await fetch(`https://api.hypixel.net/player?uuid=${userData.uuid}`, {
                            headers: {
                                "API-Key": api,
                                "Content-Type": "application/json"
                            }
                        })
                        if (response.ok) {
                            try {
                                let json = await response.json()

                                console.log(chalk.blackBright(`[${new Date()}]`) + chalk.hex(`#FFA500`)(`[HypixelAPI]`) + chalk.gray(`: Ник игрока - ${json.player.displayname}, UUID - ${json.player.uuid}. Профиль обновлён!`))
                                userData.nickname = json.player.displayname;
                                userData.cooldowns.prof_update = Date.now() + (1000 * 60 * 60)

                            } catch (error) {
                                await interaction.reply({
                                    embeds: [new EmbedBuilder().setAuthor({ name: `Ошибка!` }).setDescription(`Игрок ${userData.uuid} не найден! Обратитесь в поддержку гильдии Starpixel!`).setThumbnail(`https://i.imgur.com/6IE3lz7.png`).setColor(`DarkRed`).setTimestamp(Date.now())],
                                    ephemeral: true
                                });
                                console.log(chalk.blackBright(`[${new Date()}]`) + chalk.hex(`#FFA500`)(`[HypixelAPI]`) + chalk.gray(`: Игрока с UUID ${userData.uuid} не существует`));
                                return;
                            }
                        }
                    }

                    client.rank_update();
                    client.AutoElements();
                    client.AutoStars();
                    client.Boosters();
                    client.checkSubscription();
                    client.Discounts();
                    client.AutoMythical();
                    client.removeNonPremiumColors();
                    client.updatenicks();
                    client.GuildGamesCheckRewards(member);
                    client.ActExp(userData.userid);

                    userData.save()
                    const totalexp = calcActLevel(0, userData.level, userData.exp)
                    if (userData.onlinemode) {
                        const success = new EmbedBuilder()
                            .setTitle(`Профиль успешно обновлен!`)
                            .setColor(Number(linksInfo.bot_color))
                            .setTimestamp(Date.now())
                            .setThumbnail(`https://minotar.net/helm/${userData.uuid}.png`)
                            .setDescription(`Профиль участника ${user} был успешно обновлен!

**Предметов на данный момент:**
Опыт активности - ${userData.exp} (подробнее: </profile info:1055546254609879095>)
Уровень активности - ${userData.level}
Всего опыта - ${totalexp}

Опыта рангов - ${userData.rank}
Румбиков - ${userData.rumbik}
Билетов - ${userData.tickets}
Опыта гильдии в наличии - ${userData.gexp}`)
                        await interaction.reply({
                            embeds: [success]
                        })
                    } else {
                        const success = new EmbedBuilder()
                            .setTitle(`Профиль успешно обновлен!`)
                            .setColor(Number(linksInfo.bot_color))
                            .setTimestamp(Date.now())
                            .setDescription(`Профиль участника ${user} был успешно обновлен!

**Предметов на данный момент:**
Опыт активности - ${userData.exp} (подробнее: </profile info:1055546254609879095>)
Уровень активности - ${userData.level}
Всего опыта - ${totalexp}

Опыта рангов - ${userData.rank}
Румбиков - ${userData.rumbik}
Билетов - ${userData.tickets}
Опыта гильдии в наличии - ${userData.gexp}`)
                        await interaction.reply({
                            embeds: [success]
                        })
                    }

                }
                    break;

                case `delete`: {
                    if (interaction.channel.type == ChannelType.DM) return interaction.reply({
                        content: `Вы не можете использовать эту команду в личных сообщениях!`,
                        ephemeral: true
                    })
                    const id = interaction.options.getString(`id`)
                    const user = await interaction.guild.members.fetch(id)
                    const userData = await User.findOne({ userid: id })
                    const birthdayData = await Birthday.findOne({ userid: id })
                    if (!interaction.member.roles.cache.has(`320880176416161802`)) {
                        const embed = new EmbedBuilder()
                            .setAuthor({
                                name: `❗ Отсутствует необходимая роль!`
                            })
                            .setDescription(`Вы не имеете роль \`${interaction.guild.roles.cache.get(`320880176416161802`).name}\`!
Но вы всё ещё можете использовать команду \`/profile update\``)
                            .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                            .setColor(`DarkRed`)
                            .setTimestamp(Date.now())

                        return interaction.reply({
                            embeds: [embed],
                            ephemeral: true
                        })
                    }
                    else if (interaction.member.roles.cache.has(`320880176416161802`)) {
                        const delete_button = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`delete_button`)
                                    .setEmoji(`🚫`)
                                    .setLabel(`Удалить`)
                                    .setStyle(ButtonStyle.Danger)
                            )
                        const delete_embed = new EmbedBuilder()
                            .setColor(`DarkRed`)
                            .setTitle(`Вы действительно хотите удалить профиль пользователя ${user.user.username}?`)
                            .setDescription(`**Это действие необратимо!**
Проверьте, тот ли профиль вы хотите удалить? Если игрок сейчас находится в гильдии, удалять его профиль **ЗАПРЕЩЕНО**! Если игрок покинул гильдию, то нажмите в течение __10 секунд__ на кнопку ниже, чтобы удалить профиль.

Пользователь потеряет следующую информацию:
\`Румбики, опыт рангов, опыт и уровень активности, накопленный опыт гильдии, билеты и умения!\``)
                            .setFooter({ text: `Чтобы подтвердить действие, нажмите кнопку 🚫 Удалить в течение 10 секунд.` })
                        await interaction.reply({
                            embeds: [delete_embed],
                            components: [delete_button]
                        })

                        const filter = i => i.customId === 'delete_button';

                        interaction.channel.awaitMessageComponent({ filter, componentType: ComponentType.Button, time: 10000 })
                            .then(async (i) => {
                                if (i.user.id === interaction.member.user.id) {
                                    delete_button.components[0].setDisabled(true)
                                    let name = userData.name
                                    let nickname = userData.nickname
                                    await interaction.editReply({
                                        embeds: [delete_embed],
                                        components: [delete_button]
                                    })
                                    try {
                                        const member = await interaction.guild.members.fetch(userData.userid)
                                        if (member) {
                                            await interaction.guild.members.edit(member, {
                                                roles: [],
                                                nick: `${member.user.username}`
                                            })
                                        }

                                    } catch (e) {

                                    }
                                    let stream = await fs.createWriteStream(`./src/files/Database/Profile.json`)
                                    let json = JSON.stringify(userData, (_, v) => typeof v === 'bigint' ? v.toString() : v)
                                    stream.once('open', function (fd) {
                                        stream.write(json);
                                        stream.end();
                                    });

                                    let interactionChannel = await interaction.guild.channels.fetch(`1114239308853936240`)
                                    let attach = new AttachmentBuilder()
                                        .setFile(`./src/files/Database/Profile.json`)
                                        .setName(`Profile.json`)

                                    await interactionChannel.send({
                                        content: `**Имя пользователя**: \`${userData.displayname.name}\`
**ID Discord**: \`${userData.userid}\`
**Никнейм**: \`${userData.nickname}\`
**UUID**: \`${userData.onlinemode ? userData.uuid : null}\``,
                                        files: [attach]
                                    })

                                    userData.delete()
                                    birthdayData.delete()
                                    await i.reply({
                                        content: `Профиль пользователя ${name} (\`${nickname}\`) был успешно удалён!`
                                    })
                                    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.cyan(`[База данных]`) + chalk.gray(`: Профиль пользователя ${name} (\`${nickname}\`) был успешно удалён!`))

                                } else {
                                    i.reply({ content: `Вы не можете использовать данную кнопочку!`, ephemeral: true });
                                }
                            })
                            .catch(async (err) => {
                                await delete_button.components[0]
                                    .setDisabled(true)
                                    .setLabel(`Отменено`)


                                delete_embed
                                    .setTitle(`Удаление профиля отменено из-за истечения времени!`)
                                    .setFields({
                                        name: `\u200b`,
                                        value: `\u200b`
                                    })
                                    .setDescription(`Удаление профиля отменено из-за истечения времени!`)
                                    .setFooter({ text: `Пропишите команду /profile delete ещё раз, чтобы повторить попытку!` })
                                await interaction.editReply({
                                    embeds: [delete_embed],
                                    components: [delete_button]
                                })
                                console.log(err)
                            });

                    }
                }
                    break;

                case `reset`: {
                    if (interaction.channel.type == ChannelType.DM) return interaction.reply({
                        content: `Вы не можете использовать эту команду в личных сообщениях!`,
                        ephemeral: true
                    })
                    const { member, user, guild } = interaction

                    const embed = new EmbedBuilder()
                        .setColor(Number(linksInfo.bot_color))
                        .setDescription(`# Вы собираетесь сбросить профиль
Используя данную команду, вы собираетесь начать развитие заново. Существует 2 типа сброса профиля:
1. **Сбросить и продолжить развитие дальше.** Выбирая данную кнопку, вы продолжите развиваться в дискорде гильдии дальше, получив доступ к новому каналу и возможность получать более крутые награды.
Нажав на данную кнопку, вы потеряете следующее:
- Полностью свой опыт участника и ранг
- Все эмоции
- Все картинки
- Все коробки
- Всех питомцев и стихии
- Мифические награды
- Талисманы
- Звезды, созвездия, кометы
- Косметические рамки и значки
- Румбики
- Билеты
- Медали
- Коллекции
- Собранные звёздные комплекты
- Перки
- Временные предметы (кроме подписки VIP)
- Множители
- Шансы на редкости
- Подписки (кроме VIP)
- Сезонные предметы

Вы сохраните следующие предметы:
- Достижения гильдии
- Опыт активности
- Подписка VIP (если имеется)
- Наградные роли

2. **Сбросить и начать развитие с абсолютного нуля.** Выбирая данную кнопку, вы **ПОЛНОСТЬЮ** сотрёте ваше текущее развитие и вам придётся развиваться заного!
:warning: **Будьте внимательны!** Если вы случайно нажмёте на данную кнопку, вы не сможете вернуть то развитие, которая у вас сейчас! __Подходит для тех игроков, которые уже полностью завершили развитие в гильдии и хотели бы повторить попытку развития!__`)

                    const buttons = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`reset_some`)
                                .setLabel(`Сбросить и продолжить развитие дальше`)
                                .setStyle(ButtonStyle.Primary)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`reset_everything`)
                                .setLabel(`Сбросить и начать развитие с абсолютного нуля`)
                                .setStyle(ButtonStyle.Danger)
                        )

                    const msg = await interaction.reply({
                        embeds: [embed],
                        components: [buttons],
                        ephemeral: true,
                        fetchReply: true
                    })

                    const collector = await msg.createMessageComponentCollector()

                    collector.on(`collect`, async (i) => {
                        if (i.customId == `reset_some`) {
                            if (!member.roles.cache.has(`849695880688173087`) && !member.roles.cache.has(`992122876394225814`) && !member.roles.cache.has(`992123014831419472`) && !member.roles.cache.has(`992123019793276961`)) return i.reply({
                                content: `Вы должны быть владыкой гильдии или выше, чтобы использовать эту кнопку!`,
                                ephemeral: true
                            });
                            await i.deferUpdate()
                            const userDataRolesClear = await User.findOneAndUpdate({ userid: user.id }, {
                                $set: {
                                    roles: []
                                }
                            })
                            userDataRolesClear.save()
                            const exceptions = [`567689925143822346`, `883617976790700032`, `883617966174896139`, `320880176416161802`, `563793535250464809`, `504887113649750016`, `721047643370815599`, `702540345749143661`, `746440976377184388`, `722523773961633927`, `660236704971489310`, `740241985155366973`, `730891493375475786`, `764198086738051092`, `856866046387683338`, `849533128871641119`, `584811233035681814`, `584811236085071882`, `584811238178029612`, `584811238626689024`, `610131860445724713`, `584811242498293781`, `584811242703552512`, `584811243496275988`, `584811243794202626`, `584811380117471252`, `585175150501036043`, `585175165315579904`, `585175168251592714`, `585175171154051083`, `610133244393816074`, `610133972034387983`, `585175188187119638`, `610131863683465246`, `610131866963673118`, `610131868045672615`, `610132199848804379`, `610132217204572190`, `694914070632988712`, `694914070746234970`, `694914072960958555`, `694914074630422555`, `694914073376194740`, `694914074550468758`, `694914075460894791`, `697796942134116382`, `709753395417972746`, `722533819839938572`, `722523856211935243`, `850336260265476096`, `1017131191771615243`, `1020400007989444678`, `1020400017330163712`, `1020400015300120638`, `1020400022350725122`, `1020400026045915167`, `1020400024397565962`, `1020400030575763587`, `1020400034853957713`, `1020400032651952168`, `1020400043154485278`, `1020400047260696647`, `1020400045251633163`, `1020400055812886529`, `1020400060636344440`, `1020400058543374388`, `1132678509307904210`]
                            let it = 0

                            for (let exception of exceptions) {

                                exception = exceptions[it]
                                if (member.roles.cache.has(exception)) {
                                    const userDataUpd = await User.findOneAndUpdate({
                                        userid: user.id
                                    }, {
                                        $push: {
                                            roles: exception
                                        }
                                    })
                                    userDataUpd.save()
                                    it++
                                } else {
                                    it++
                                }
                            }

                            await member.roles.set([`930520087797051452`, `553593731953983498`, `721047643370815599`, `702540345749143661`, `746440976377184388`, `722523773961633927`, `849533128871641119`, `709753395417972746`, `722533819839938572`, `722523856211935243`, `504887113649750016`])
                            const userData = await User.findOne({ userid: user.id })

                            userData.rank = 0
                            userData.rumbik = 0

                            userData.elements.diving = 0
                            userData.elements.eagle_eye = 0
                            userData.elements.fast_grow = 0
                            userData.elements.fire_resistance = 0
                            userData.elements.flame = 0
                            userData.elements.flying = 0
                            userData.elements.lightning = 0
                            userData.elements.mountains = 0
                            userData.elements.resistance = 0
                            userData.elements.respiration = 0
                            userData.elements.underground = 0
                            userData.elements.wind = 0

                            userData.displayname.ramka1 = ``
                            userData.displayname.ramka2 = ``
                            userData.displayname.suffix = ``
                            userData.displayname.rank = `🦋`
                            userData.displayname.symbol = `👤`

                            userData.gexp = 0
                            userData.tickets = 0
                            userData.medal_1 = 0
                            userData.medal_2 = 0
                            userData.medal_3 = 0
                            userData.stacked_items = []

                            userData.perks.act_discount = 0
                            userData.perks.change_items = 0
                            userData.perks.king_discount = 0
                            userData.perks.rank_boost = 0
                            userData.perks.sell_items = 0
                            userData.perks.store_items = 0
                            userData.perks.shop_discount = 0
                            userData.perks.temp_items = 0
                            userData.perks.ticket_discount = 0

                            userData.bank.account_type = 'Стартовый'
                            userData.bank.balance = 0
                            userData.bank.expire = Date.now()
                            userData.bank.max_balance = 500
                            userData.bank.multiplier = 1.05
                            userData.bank.opened = false

                            userData.upgrades.bank_account_tier = 1
                            userData.upgrades.inventory_size_tier = 1
                            userData.upgrades.max_purchases_tier = 1
                            userData.upgrades.max_sells_tier = 1
                            userData.upgrades.inventory_size = 10
                            userData.upgrades.max_purchases = 15
                            userData.upgrades.max_sells = 15

                            userData.rank_number = 0
                            userData.shop_costs = 1
                            userData.act_costs = 1
                            userData.king_costs = 1

                            userData.box_chances.common = 1
                            userData.box_chances.uncommon = 1
                            userData.box_chances.rare = 1
                            userData.box_chances.epic = 1
                            userData.box_chances.legendary = 1
                            userData.box_chances.mythical = 1
                            userData.box_chances.RNG = 1

                            userData.times_reset += 1

                            userData.save()

                            await i.member.roles.add(userData.roles).catch()

                            const back_roles = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId(`back_roles`)
                                        .setEmoji(`⚜`)
                                        .setLabel(`Вернуть сохранённые роли`)
                                        .setStyle(ButtonStyle.Primary)
                                )

                            const msg2 = await interaction.guild.channels.cache.get(ch_list.main).send({
                                content: `:black_medium_small_square:    :black_medium_small_square:    :black_medium_small_square:    :black_medium_small_square:    :black_medium_small_square:

:tada: ${user} решил сбросить свою статистику и начать развитие в Дискорде гильдии **заново**!           
Его ждут крутые награды и новые задания. Пожелаем ему удачи!

:black_medium_small_square:    :black_medium_small_square:    :black_medium_small_square:    :black_medium_small_square:    :black_medium_small_square:`,
                                //components: [back_roles]
                            })

                            await interaction.deleteReply();
                            /* const filter = int => int.customId === 'back_roles';

                            const col = msg2.createMessageComponentCollector({ filter });
                            col.on('collect', async (int) => {
                                if (int.user.id === interaction.member.user.id) {
                                    const roles = userData.roles
                                    await int.member.roles.add(roles).catch()

                                    back_roles.components[0].setDisabled(true)
                                    await int.reply({
                                        content: `Вы успешно вернули свои роли!`,
                                        ephemeral: true
                                    })
                                    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.cyan(`[СБРОС ПРОФИЛЯ]`) + chalk.gray(`: ${user.username} успешно вернул сохранённые роли!`))
                                    await msg2.edit({
                                        components: [back_roles]
                                    })
                                    col.stop()

                                } else {
                                    await int.reply({ content: `Вы не можете использовать данную кнопочку!`, ephemeral: true });
                                }
                            }) */
                        } else if (i.customId == `reset_everything`) {
                            if (!member.roles.cache.has(`992123019793276961`)) return i.reply({
                                content: `Вы должны быть повелителем гильдии или выше, чтобы использовать эту кнопку!`,
                                ephemeral: true
                            });
                            const but2 = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId(`reset_yes`)
                                        .setLabel(`Да`)
                                        .setStyle(ButtonStyle.Success)
                                )
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId(`reset_no`)
                                        .setLabel(`Нет`)
                                        .setStyle(ButtonStyle.Danger)
                                )

                            const msg2 = await i.reply({
                                content: `## Вы собираетесь начать развитие в дискорде гильдии с АБСОЛЮТНОГО НУЛЯ!
Нажимая "Да", вы **ПОЛНОСТЬЮ** сотрёте ваше текущее развитие и вам придётся развиваться заного!
:warning: **Будьте внимательны!** Если вы случайно нажмёте на данную кнопку, вы не сможете вернуть то развитие, которая у вас сейчас! __Подходит для тех игроков, которые уже полностью завершили развитие в гильдии и хотели бы повторить попытку развития!__

Если вы нажали на эту кнопку по ошибке или передумали полностью сбрасывать профиль, нажмите "Нет"!`,
                                components: [but2],
                                ephemeral: true,
                                fetchReply: true
                            })

                            const col2 = await msg2.createMessageComponentCollector()
                            col2.on('collect', async (int) => {
                                if (int.customId == `reset_yes`) {
                                    await int.deferReply({ ephemeral: true, fetchReply: true })
                                    const userData = await User.findOne({ userid: user.id })
                                    await member.roles.set([`553593731953983498`, `721047643370815599`, `702540345749143661`, `746440976377184388`, `722523773961633927`, `849533128871641119`, `709753395417972746`, `722533819839938572`, `722523856211935243`, `504887113649750016`])

                                    let stream = await fs.createWriteStream(`./src/files/Database/Profile.json`)
                                    let json = JSON.stringify(userData, (_, v) => typeof v === 'bigint' ? v.toString() : v)
                                    stream.once('open', function (fd) {
                                        stream.write(json);
                                        stream.end();
                                    });

                                    let interactionChannel = await interaction.guild.channels.fetch(`1114239308853936240`)
                                    let attach = new AttachmentBuilder()
                                        .setFile(`./src/files/Database/Profile.json`)
                                        .setName(`Profile.json`)

                                    await interactionChannel.send({
                                        content: `**Имя пользователя**: \`${userData.displayname.name}\`
**ID Discord**: \`${userData.userid}\`
**Никнейм**: \`${userData.nickname}\`
**UUID**: \`${userData.onlinemode ? userData.uuid : null}\``,
                                        files: [attach]
                                    })
                                    //userData.age = age
                                    //userData.nickname = json.player.displayname;
                                    //userData.uuid = json.player.uuid;
                                    //userData.onlinemode = true;
                                    //userData.cooldowns.prof_update = Date.now() + (1000 * 60 * 60 * 24)
                                    //userData.name = user.username
                                    //userData.displayname.name = realname
                                    //userData.joinedGuild
                                    const age = userData.age,
                                        guildid = userData.guildid,
                                        userid = userData.userid,
                                        nickname = userData.nickname,
                                        uuid = userData.uuid,
                                        onlinemode = userData.onlinemode,
                                        cd = userData.cooldowns.prof_update,
                                        name = userData.name,
                                        displ_name = userData.displayname.name,
                                        joinedGuild = userData.joinedGuild,
                                        times_reset = userData.times_reset,
                                        gexp_info = userData.gexp_info,
                                        warn_info = userData.warn_info,
                                        warns_number = userData.warns_number

                                    const newUserData = new User({ userid: userid, guildid: guildid })
                                    newUserData.age = age
                                    newUserData.nickname = nickname
                                    newUserData.uuid = uuid
                                    newUserData.onlinemode = onlinemode
                                    newUserData.name = name
                                    newUserData.displayname.name = displ_name
                                    newUserData.cooldowns.prof_update = cd
                                    newUserData.joinedGuild = joinedGuild
                                    newUserData.gexp_info = gexp_info
                                    newUserData.warn_info = warn_info
                                    newUserData.warns_number = warns_number
                                    newUserData.times_reset = times_reset + 1
                                    newUserData.save()
                                    userData.delete()

                                    await int.editReply({
                                        content: `Вы **полностью** сбросили свой профиль! Ваш никнейм обновится в течение 15 минут!
                                        
Ваш старый профиль был сохранён в архиве гильдии. Если вам будет интересно его получить, обратитесь к администратору Дмитрию!`,
                                        ephemeral: true
                                    })
                                    await interaction.guild.channels.cache.get(ch_list.main).send({
                                        content: `:black_medium_small_square:    :black_medium_small_square:    :black_medium_small_square:    :black_medium_small_square:    :black_medium_small_square:

:tada: ${user} решил **ПОЛНОСТЬЮ НАЧАТЬ ЗАНОВО РАЗВИТИЕ В ДИСКОРДЕ!**     @everyone
Это означает полноценный сброс прогресса и начало развития так, будто игрок только что вступил в гильдию!

:black_medium_small_square:    :black_medium_small_square:    :black_medium_small_square:    :black_medium_small_square:    :black_medium_small_square:`,
                                        allowedMentions: {
                                            parse: ["everyone"]
                                        }
                                        //components: [back_roles]
                                    })
                                    col2.stop()
                                    collector.stop();
                                    await i.deleteReply();
                                    await interaction.deleteReply();
                                } else if (int.customId == `reset_no`) {
                                    await int.reply({
                                        content: `Вы прекратили процесс сброса профиля. Если вы захотите сбросить профиль ещё раз, введите команду \`/profile reset\` ещё раз!`,
                                        ephemeral: true
                                    })
                                    col2.stop()
                                    collector.stop();
                                    await i.deleteReply();
                                    await interaction.deleteReply();
                                }
                            })
                        }
                    })




                }
                    break;

                case "updateall": {
                    if (interaction.channel.type == ChannelType.DM) return interaction.reply({
                        content: `Вы не можете использовать эту команду в личных сообщениях!`,
                        ephemeral: true
                    })
                    const embed = new EmbedBuilder()
                        .setAuthor({
                            name: `❗ Отсутствует необходимая роль!`
                        })
                        .setDescription(`Вы не имеете роль \`${interaction.guild.roles.cache.get(`320880176416161802`).name}\`!
Но вы всё ещё можете использовать команду \`/profile update\``)
                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                        .setColor(`DarkRed`)
                        .setTimestamp(Date.now())

                    if (!interaction.member.roles.cache.has(`320880176416161802`)) return interaction.reply({
                        embeds: [embed]
                    })
                    await interaction.reply({
                        content: `Идёт обработка всех участников гильдии..`,
                        fetchReply: true
                    })
                    const userDatas = await User.find({ guildid: interaction.guild.id })
                    let b = 0
                    let update
                    for (let userData of userDatas) {
                        userData = userDatas[b]

                        const member = await interaction.guild.members.fetch(userData.userid)
                        client.GuildGamesCheckRewards(member)
                        client.ActExp(userData.userid)
                        userData.name = member.user.username
                        if (userData.onlinemode) {
                            let response = await fetch(`https://api.hypixel.net/player?uuid=${userData.uuid}`, {
                                headers: {
                                    "API-Key": api,
                                    "Content-Type": "application/json"
                                }
                            })
                            if (response.ok) {
                                try {
                                    let json = await response.json()

                                    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.hex(`#FFA500`)(`[HypixelAPI]`) + chalk.gray(`: Ник игрока - ${json.player.displayname}, UUID - ${json.player.uuid}. Профиль обновлён!`))
                                    userData.nickname = json.player.displayname;
                                    userData.markModified(`nickname`)

                                } catch (error) {
                                    await interaction.reply({
                                        embeds: [new EmbedBuilder().setAuthor({ name: `Ошибка!` }).setDescription(`Игрок ${userData.uuid} не найден! Обратитесь в поддержку гильдии Starpixel!`).setThumbnail(`https://i.imgur.com/6IE3lz7.png`).setColor(`DarkRed`).setTimestamp(Date.now())],
                                        ephemeral: true
                                    });
                                    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.hex(`#FFA500`)(`[HypixelAPI]`) + chalk.gray(`: Игрока с UUID ${userData.uuid} не существует`));
                                    return;
                                }
                            }
                        }


                        if (userData.onlinemode) {
                            update = new EmbedBuilder()
                                .setTitle(`Идёт обработка всех участников . . .`)
                                .setColor(Number(linksInfo.bot_color))
                                .setDescription(`Идёт обработка и обновление профилей участников гильдии Starpixel!

В данный момент идёт обработка пользователя <@${userData.userid}> - \`${userData.nickname}\` (UUID: \`${userData.onlinemode ? userData.uuid : null}\`) 
**Прогресс**: ${b + 1}/${userDatas.length} - ${(Math.round(((b + 1) / (userDatas.length)) * 100))}% завершено . . .`)
                                .setTimestamp(Date.now())
                                .setThumbnail(`https://minotar.net/helm/${userData.uuid}.png`)
                        } else {
                            update = new EmbedBuilder()
                                .setTitle(`Идёт обработка всех участников . . .`)
                                .setColor(Number(linksInfo.bot_color))
                                .setDescription(`Идёт обработка и обновление профилей участников гильдии Starpixel!

В данный момент идёт обработка пользователя <@${userData.userid}> - \`${userData.nickname}\` (UUID: \`${userData.onlinemode ? userData.uuid : null}\`) 
**Прогресс**: ${b + 1}/${userDatas.length} - ${(Math.round(((b + 1) / (userDatas.length)) * 100))}% завершено . . .`)
                                .setTimestamp(Date.now())
                        }



                        await interaction.editReply({
                            embeds: [update],
                            fetchReply: true
                        })
                        userData.save()
                        b++
                        await wait(1100)
                    }
                    client.rank_update();
                    client.AutoElements();
                    client.AutoStars();
                    client.Boosters();
                    client.checkSubscription();
                    client.Discounts();
                    client.AutoMythical();
                    client.removeNonPremiumColors();
                    client.updatenicks();

                    update = new EmbedBuilder()
                        .setTitle(`Обработка завершена!`)
                        .setColor(Number(linksInfo.bot_color))
                        .setDescription(`Обработка и обновление профилей участников завершена!

Теперь никнеймы, идентификаторы и прочее актуальны! В скором времени канал <#932203255335899177> будет содержать данную информацию
**Прогресс**: ${b}/${userDatas.length} - ${(Math.round(((b) / (userDatas.length)) * 100))}% завершено . . .`)
                        .setTimestamp(Date.now())
                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                    await interaction.editReply({
                        embeds: [update]
                    })
                }
                    break;
                case `info`: {
                    const msg = await interaction.deferReply({
                        fetchReply: true
                    })
                    let user = interaction.options.getUser(`пользователь`) || interaction.user;
                    const guild = interaction.guild
                    let intMember = interaction.member
                    let member = await guild.members.fetch(user.id)
                    if (user.id !== interaction.user.id) {
                        let targetData = await User.findOne({ userid: user.id })
                        if (targetData.pers_settings.profile_view == false) {
                            let executorData = await User.findOne({ userid: interaction.user.id })
                            if (executorData.staff_pos < 2 || (targetData.staff_pos > executorData.staff_pos)) {
                                await interaction.editReply({
                                    content: `У вас недостаточно прав для просмотра профиля данного участника. Вероятнее всего, в настройках своего профиля он установил необходимые параметры!`,
                                    fetchReply: true
                                })
                                await wait(10000)
                                await interaction.deleteReply()
                                return
                            }
                        }
                    }

                    if (!intMember || !intMember.roles.cache.has(`504887113649750016`)) {
                        await interaction.editReply({
                            content: `Вы не можете использовать эту команду, так как вы не являетесь участником гильдии!`,
                            fetchReply: true
                        })
                        await wait(10000)
                        await interaction.deleteReply()
                        return
                    }
                    if (user.bot) {
                        await interaction.editReply({
                            content: `${user} является ботом, а значит у него нет профиля :'(`,
                            fetchReply: true
                        })
                        await wait(10000)
                        await interaction.deleteReply()
                        return
                    }
                    if (!member.roles.cache.has(`504887113649750016`) || !member) {
                        await interaction.editReply({
                            content: `Данный участник не находится в гильдии!`,
                            fetchReply: true
                        })
                        await wait(10000)
                        await interaction.deleteReply()
                        return
                    }

                    let profile = new UserProfile(member, client)
                    let userData = await profile.getUserData()
                    if (!userData) {
                        await interaction.editReply({
                            content: `Не удалось найти информацию о данном пользователе!`,
                            fetchReply: true
                        })
                        await wait(10000)
                        await interaction.deleteReply()
                        return
                    }

                    let profileData = await profile.getAllProfile();
                    let options = [];
                    for (let data of profileData) {
                        if (data.value == 'main') {
                            options.push({
                                label: data.label,
                                description: data.description,
                                emoji: data.emoji,
                                default: true,
                                value: data.value
                            })
                        } else {
                            options.push({
                                label: data.label,
                                description: data.description,
                                emoji: data.emoji,
                                default: false,
                                value: data.value
                            })
                        }
                    }

                    const selectMenu = new ActionRowBuilder()
                        .addComponents(
                            new StringSelectMenuBuilder()
                                .setCustomId(`profilemenu`)
                                .setPlaceholder(`Выберите меню, которое хотите увидеть`)
                                .addOptions(options)
                        )

                    const userMenu = new ActionRowBuilder()
                        .addComponents(
                            new UserSelectMenuBuilder()
                                .setCustomId(`usermenu`)
                                .setMaxValues(1)
                                .setPlaceholder(`Пользователь, которого хотите посмотреть`)
                        )


                    let main = await profileData.find(pf => pf.value == `main`).embed
                    await interaction.editReply({
                        embeds: [main],
                        components: [selectMenu, userMenu],
                        fetchReply: true
                    })

                    const collector = msg.createMessageComponentCollector()

                    collector.on(`collect`, async (i) => {
                        if (i.customId == `progress_info`) {
                            const msg3 = await i.deferReply({ fetchReply: true, ephemeral: true })
                            let progressData = await profile.getProgressInformation()
                            const but = new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel(`Общая информация`)
                                        .setStyle(ButtonStyle.Success)
                                        .setDisabled(true)
                                        .setCustomId(`progress_general`)
                                )
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel(`Неполученные роли`)
                                        .setStyle(ButtonStyle.Primary)
                                        .setDisabled(false)
                                        .setCustomId(`progress_roles`)
                                )
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel(`Незаконченные умения`)
                                        .setStyle(ButtonStyle.Primary)
                                        .setDisabled(false)
                                        .setCustomId(`progress_perks`)
                                )
                                .addComponents(
                                    new ButtonBuilder()
                                        .setLabel(`Незаконченные улучшения`)
                                        .setStyle(ButtonStyle.Primary)
                                        .setDisabled(false)
                                        .setCustomId(`progress_upgrades`)
                                )
                            await i.editReply({
                                embeds: [progressData[0]],
                                components: [but],
                                ephemeral: true
                            })

                            const col2 = await msg3.createMessageComponentCollector()
                            col2.on('collect', async (int) => {
                                await but.components.forEach(comp => {
                                    if (comp.data.custom_id == int.customId) {
                                        comp.setDisabled(true)
                                        comp.setStyle(ButtonStyle.Success)
                                    } else {
                                        comp.setDisabled(false)
                                        comp.setStyle(ButtonStyle.Primary)
                                    }
                                })

                                if (int.customId == 'progress_general') {
                                    await int.update({
                                        embeds: [progressData[0]],
                                        components: [but],
                                        fetchReply: true,
                                        ephemeral: true
                                    })
                                } else if (int.customId == `progress_roles`) {
                                    await int.update({
                                        embeds: [progressData[1]],
                                        components: [but],
                                        fetchReply: true,
                                        ephemeral: true
                                    })
                                } else if (int.customId == `progress_perks`) {
                                    await int.update({
                                        embeds: [progressData[2]],
                                        components: [but],
                                        fetchReply: true,
                                        ephemeral: true
                                    })
                                } else if (int.customId == `progress_upgrades`) {
                                    await int.update({
                                        embeds: [progressData[3]],
                                        components: [but],
                                        fetchReply: true,
                                        ephemeral: true
                                    })
                                }
                            })
                        }
                        else if (i.customId == `profilemenu`) {
                            const value = i.values[0]
                            if (i.user.id == interaction.user.id) {
                                await selectMenu.components[0].options.forEach(option => {
                                    if (option.data.value == value) {
                                        option.data.default = true
                                    } else option.data.default = false
                                })
                                const embed = await profileData.find(pf => pf.value == value).embed
                                if (value == 'progress') {
                                    const button = new ActionRowBuilder()
                                        .addComponents(
                                            new ButtonBuilder()
                                                .setCustomId(`progress_info`)
                                                .setLabel(`Получить дополнительную информацию`)
                                                .setStyle(ButtonStyle.Primary)
                                                .setEmoji(`📃`)
                                        )
                                    await i.update({
                                        embeds: [embed],
                                        components: [button, selectMenu, userMenu]
                                    })
                                } else {
                                    await i.update({
                                        embeds: [embed],
                                        components: [selectMenu, userMenu]
                                    })
                                }
                            }
                            else if (i.user.id !== interaction.user.id) {
                                const msg2 = await i.deferReply({ ephemeral: true, fetchReply: true })
                                const embed = await profileData.find(pf => pf.value == value).embed
                                if (value == 'progress') {
                                    const button = new ActionRowBuilder()
                                        .addComponents(
                                            new ButtonBuilder()
                                                .setCustomId(`progress_info`)
                                                .setLabel(`Получить дополнительную информацию`)
                                                .setStyle(ButtonStyle.Primary)
                                                .setEmoji(`📃`)
                                        )
                                    await i.editReply({
                                        embeds: [embed],
                                        components: [button]
                                    })

                                    const col2 = await msg2.createMessageComponentCollector()

                                    col2.on('collect', async (int) => {
                                        let progressData = await profile.getProgressInformation()

                                        await int.reply({
                                            embeds: [progressData],
                                            ephemeral: true
                                        })
                                    })
                                } else {
                                    await i.editReply({
                                        embeds: [embed]
                                    })
                                }
                            }
                        } else if (i.customId == `usermenu`) {


                            if (interaction.user.id == i.user.id) {
                                await i.deferReply({ fetchReply: true, ephemeral: true })
                                const us = await guild.members.fetch(i.values[0])
                                user = us.user
                                member = us
                                if (user.id !== i.user.id) {
                                    let targetData = await User.findOne({ userid: user.id })
                                    if (targetData.pers_settings.profile_view == false) {
                                        let executorData = await User.findOne({ userid: i.user.id })
                                        if (executorData.staff_pos < 2 || (targetData.staff_pos > executorData.staff_pos)) {
                                            await i.editReply({
                                                content: `У вас недостаточно прав для просмотра профиля данного участника. Вероятнее всего, в настройках своего профиля он установил необходимые параметры!`,
                                                fetchReply: true
                                            })
                                            return
                                        }
                                    }
                                }
                                profile = new UserProfile(member, client)
                                userData = await profile.getUserData()
                                if (!userData) {
                                    await i.editReply({
                                        content: `Не удалось найти информацию о данном пользователе!`,
                                        fetchReply: true
                                    })
                                    return
                                }

                                profileData = await profile.getAllProfile();
                                main = await profileData.find(pf => pf.value == `main`).embed
                                await selectMenu.components[0].options.forEach(option => {
                                    if (option.data.value == `main`) {
                                        option.data.default = true
                                    } else option.data.default = false
                                })
                                await i.deleteReply()
                                await interaction.editReply({
                                    embeds: [main],
                                    components: [selectMenu, userMenu],
                                    fetchReply: true
                                })
                            } else if (interaction.user.id !== i.user.id) {
                                await i.deferReply({ fetchReply: true, ephemeral: true })
                                const us = await guild.members.fetch(i.values[0])

                                let userT = us.user
                                let memberT = us
                                if (userT.id !== i.user.id) {
                                    let targetData = await User.findOne({ userid: userT.id })
                                    if (targetData.pers_settings.profile_view == false) {
                                        let executorData = await User.findOne({ userid: i.user.id })
                                        if (executorData.staff_pos < 2 || (targetData.staff_pos > executorData.staff_pos)) {
                                            await i.editReply({
                                                content: `У вас недостаточно прав для просмотра профиля данного участника. Вероятнее всего, в настройках своего профиля он установил необходимые параметры!`,
                                                fetchReply: true
                                            })
                                            return
                                        }
                                    }
                                }
                                let profileT = new UserProfile(memberT, client)
                                let userDataT = await profileT.getUserData()
                                if (!userDataT) {
                                    await i.editReply({
                                        content: `Не удалось найти информацию о данном пользователе!`,
                                        fetchReply: true
                                    })
                                    await wait(10000)
                                    await i.deleteReply()
                                    return
                                }
                                let profileDataT = await profileT.getAllProfile();
                                let mainT = await profileDataT.find(pf => pf.value == `main`).embed

                                await i.editReply({
                                    embeds: [mainT],
                                    ephemeral: true
                                })
                            }

                        }
                    })
                }
                    break;
                case `getgexp`: {
                    if (interaction.channel.type == ChannelType.DM) return interaction.reply({
                        content: `Вы не можете использовать эту команду в личных сообщениях!`,
                        ephemeral: true
                    })
                    if (!interaction.member.roles.cache.has(`563793535250464809`)) return interaction.reply({
                        content: `Вы не можете использовать эту команду!`,
                        ephemeral: true
                    })
                    let user = interaction.options.getUser(`пользователь`)
                    let member = interaction.options.getMember(`пользователь`)
                    let userData = await User.findOne({ userid: user.id, guildid: interaction.guild.id })
                    if (!userData) return interaction.reply({
                        content: `Не удалось найти информацию о данном пользователе! Проверьте, того ли пользователя вы выбрали!`,
                        ephemeral: true
                    })
                    let sort1 = userData.gexp_info.sort((a, b) => {
                        let splA = a.date.split(`-`)
                        let splB = b.date.split(`-`)
                        let yearA = splA[0]
                        let yearB = splB[0]
                        return yearB - yearA
                    })
                    let sort2 = sort1.sort((a, b) => {
                        let splA = a.date.split(`-`)
                        let splB = b.date.split(`-`)
                        let monthA = splA[1]
                        let monthB = splB[1]
                        return monthB - monthA
                    })
                    let sort = sort2.sort((a, b) => {
                        let splA = a.date.split(`-`)
                        let splB = b.date.split(`-`)
                        let dayA = splA[2]
                        let dayB = splB[2]
                        return dayB - dayA
                    })
                    let curDate = new Date()
                    let n = curDate.getMonth() + 1
                    let m = curDate.getFullYear()
                    let filt = sort.filter(s => {
                        let spl = s.date.split(`-`)
                        let month = spl[1], year = spl[0]
                        return month == n && year == m
                    })
                    let monthSum = 0
                    let map = filt.map(info => {
                        let dates = info.date.split(`-`)
                        let day = dates[2], month = dates[1], year = dates[0]
                        monthSum += info.gexp
                        return `\`${day}.${month}.${year}\` - \`${info.gexp}\` GEXP`
                    })
                    let tr = sort.filter(s => {
                        let ntr = curDate.getMonth() + 1
                        let mtr = curDate.getFullYear()
                        if (ntr - 1 <= 0) {
                            ntr = 12
                            mtr = mtr - 1
                        }
                        let spl = s.date.split(`-`)
                        let month = spl[1], year = spl[0]
                        return month == ntr - 1 && year == mtr
                    })
                    let dis
                    if (tr.length <= 0) dis = true
                    else dis = false
                    let monthN = await monthName(n)
                    let embed = new EmbedBuilder()
                        .setTitle(`GEXP пользователя ${userData.nickname}`)
                        .setThumbnail(user.displayAvatarURL())
                        .setColor(Number(linksInfo.bot_color))
                        .setTimestamp(Date.now())
                        .setDescription(`**${monthN}, ${m}**
${map.join(`\n`)}

**ИТОГО ЗА МЕСЯЦ**: \`${monthSum}\` GEXP`)
                    let buttons = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`prev`)
                                .setLabel(`Прошлый месяц`)
                                .setEmoji(`⬅`)
                                .setStyle(ButtonStyle.Danger)
                                .setDisabled(dis)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`next`)
                                .setLabel(`Следующий месяц`)
                                .setEmoji(`➡`)
                                .setStyle(ButtonStyle.Success)
                                .setDisabled(true)
                        )

                    let usSelect = new ActionRowBuilder()
                        .addComponents(
                            new UserSelectMenuBuilder()
                                .setCustomId(`user`)
                                .setPlaceholder(`Пользователь, GEXP которого хотите посмотреть`)
                                .setMaxValues(1)
                        )
                    let msg = await interaction.reply({
                        embeds: [embed],
                        components: [buttons, usSelect],
                        fetchReply: true
                    })

                    const collector = msg.createMessageComponentCollector()

                    collector.on('collect', async (i) => {
                        if (!i.member.roles.cache.has(`563793535250464809`)) return i.reply({
                            content: `Вы не можете использовать эту команду!`,
                            ephemeral: true
                        })
                        if (i.customId == `prev`) {
                            await i.deferUpdate()
                            const n_before = n
                            const m_before = m
                            tr = sort.filter(s => {
                                if (n_before - 1 <= 0) {
                                    n = 12
                                    m = m_before - 1
                                } else {
                                    n = n_before - 1
                                    m = m_before
                                }

                                let spl = s.date.split(`-`)
                                let month = spl[1], year = spl[0]
                                return month == n && year == m
                            })
                            let tr1 = sort.filter(s => {
                                let ntr = n_before, mtr = m_before
                                if (ntr - 1 <= 0) {
                                    ntr = 11
                                    mtr = m_before - 1
                                } else {
                                    ntr = ntr - 2
                                    mtr = m_before
                                }
                                let spl = s.date.split(`-`)
                                let month = spl[1], year = spl[0]
                                return month == ntr && year == mtr
                            })
                            monthN = await monthName(n)
                            let dis
                            if (tr1.length <= 0) dis = true
                            else dis = false
                            buttons.components[0].setDisabled(dis)
                            buttons.components[1].setDisabled(false)
                            monthSum = 0
                            map = tr.map(info => {
                                let dates = info.date.split(`-`)
                                let day = dates[2], month = dates[1], year = dates[0]
                                monthSum += info.gexp
                                return `\`${day}.${month}.${year}\` - \`${info.gexp}\` GEXP`
                            })
                            embed.setDescription(`**${monthN}, ${m}**
${map.join(`\n`)}

**ИТОГО ЗА МЕСЯЦ**: \`${monthSum}\` GEXP`)

                            await interaction.editReply({
                                embeds: [embed],
                                components: [buttons, usSelect],
                                fetchReply: true
                            })
                        } else if (i.customId == `next`) {
                            await i.deferUpdate()
                            const n_before = n
                            const m_before = m
                            tr = sort.filter(s => {
                                if (n_before + 1 > 12) {
                                    n = 1
                                    m = m_before + 1
                                } else {
                                    n = n_before + 1
                                    m = m_before
                                }
                                let spl = s.date.split(`-`)
                                let month = spl[1], year = spl[0]
                                return month == n && year == m
                            })
                            let tr1 = sort.filter(s => {
                                let ntr = n, mtr = m
                                if (ntr + 1 >= 12) {
                                    ntr = 1
                                    mtr = m_before + 1
                                } else {
                                    ntr = ntr + 1
                                    mtr = m_before
                                }
                                let spl = s.date.split(`-`)
                                let month = spl[1], year = spl[0]
                                return month == ntr && year == mtr
                            })
                            monthN = await monthName(n)
                            let dis
                            if (tr1.length <= 0) dis = true
                            else dis = false
                            buttons.components[1].setDisabled(dis)
                            buttons.components[0].setDisabled(false)
                            monthSum = 0
                            map = tr.map(info => {
                                let dates = info.date.split(`-`)
                                let day = dates[2], month = dates[1], year = dates[0]
                                monthSum += info.gexp
                                return `\`${day}.${month}.${year}\` - \`${info.gexp}\` GEXP`
                            })
                            embed.setDescription(`**${monthN}, ${m}**
${map.join(`\n`)}

**ИТОГО ЗА МЕСЯЦ**: \`${monthSum}\` GEXP`)

                            await interaction.editReply({
                                embeds: [embed],
                                components: [buttons, usSelect],
                                fetchReply: true
                            })
                        } else if (i.customId == `user`) {
                            member = await i.guild.members.fetch(i.values[0])
                            userData = await User.findOne({ userid: member.user.id, guildid: i.guild.id })
                            if (!userData) return i.reply({
                                content: `Не удалось найти информацию о данном пользователе! Проверьте, того ли пользователя вы выбрали!`,
                                ephemeral: true
                            })
                            await i.deferUpdate()
                            sort1 = userData.gexp_info.sort((a, b) => {
                                let splA = a.date.split(`-`)
                                let splB = b.date.split(`-`)
                                let yearA = splA[0]
                                let yearB = splB[0]
                                return yearB - yearA
                            })
                            sort2 = sort1.sort((a, b) => {
                                let splA = a.date.split(`-`)
                                let splB = b.date.split(`-`)
                                let monthA = splA[1]
                                let monthB = splB[1]
                                return monthB - monthA
                            })
                            sort = sort2.sort((a, b) => {
                                let splA = a.date.split(`-`)
                                let splB = b.date.split(`-`)
                                let dayA = splA[2]
                                let dayB = splB[2]
                                return dayB - dayA
                            })
                            curDate = new Date()
                            n = curDate.getMonth() + 1
                            m = curDate.getFullYear()
                            filt = sort.filter(s => {
                                let spl = s.date.split(`-`)
                                let month = spl[1], year = spl[0]
                                return month == n && year == m
                            })
                            monthSum = 0
                            map = filt.map(info => {
                                let dates = info.date.split(`-`)
                                let day = dates[2], month = dates[1], year = dates[0]
                                monthSum += info.gexp
                                return `\`${day}.${month}.${year}\` - \`${info.gexp}\` GEXP`
                            })
                            tr = sort.filter(s => {
                                let ntr = curDate.getMonth() + 1
                                let mtr = curDate.getFullYear()
                                if (ntr - 1 <= 0) {
                                    ntr = 12
                                    mtr = mtr - 1
                                }
                                let spl = s.date.split(`-`)
                                let month = spl[1], year = spl[0]
                                return month == ntr - 1 && year == mtr
                            })
                            if (tr.length <= 0) dis = true
                            else dis = false
                            monthN = await monthName(n)
                            embed.setTitle(`GEXP пользователя ${userData.nickname}`)
                                .setThumbnail(member.user.displayAvatarURL())
                                .setColor(Number(linksInfo.bot_color))
                                .setTimestamp(Date.now())
                                .setDescription(`**${monthN}, ${m}**
${map.join(`\n`)}

**ИТОГО ЗА МЕСЯЦ**: \`${monthSum}\` GEXP`)
                            buttons.components[1].setDisabled(true)
                            buttons.components[0].setDisabled(dis)

                            await interaction.editReply({
                                embeds: [embed],
                                components: [buttons, usSelect],
                                fetchReply: true
                            })
                        }
                    })
                }
                    break;
                case 'settings': {
                    const { selectmenu, embed, UserProfile } = require(`../../misc_functions/Exporter`)

                    await interaction.reply({
                        embeds: [embed],
                        components: [selectmenu],
                        ephemeral: true
                    })
                }
                    break;

                case 'removecolor': {
                    if (!interaction.member.roles.cache.has(`320880176416161802`)) return interaction.reply({
                        content: `Вы должны быть администратором гильдии, чтобы использовать эту команду!`,
                        ephemeral: true
                    })
                    const member = interaction.options.getMember(`пользователь`)
                    const userData = await User.findOne({ userid: member.user.id, guildid: guild.id })
                    if (!userData) return interaction.reply({
                        content: `Указанный пользователь должен быть участником гильдии и не должен быть ботом!`,
                        ephemeral: true
                    })
                    if (userData.custom_color.created === false) return interaction.reply({
                        content: `Пользователь не приобрел свой цвет!`,
                        ephemeral: true
                    })
                    const colorRole = await interaction.guild.roles.fetch(userData.custom_color.role)
                    await colorRole.delete()
                    userData.custom_color.created = false
                    userData.custom_color.hex = ``
                    userData.custom_color.role = ``
                    userData.save()
                    await interaction.reply({
                        content: `Вы успешно удалили пользовательский цвет игрока ${member}!`,
                        ephemeral: true
                    })
                }
                    break;
                case 'addtoinventory': {
                    await interaction.deferReply({ fetchReply: true, ephemeral: true })
                    if (!interaction.member.roles.cache.has(`320880176416161802`)) return interaction.reply({
                        content: `Вы должны быть администратором гильдии, чтобы использовать эту команду!`,
                        ephemeral: true
                    })
                    const member = interaction.options.getMember('пользователь')
                    const role = interaction.options.getRole(`роль`)
                    let amount = interaction.options.getInteger(`количество`);
                    if (!amount) amount = 1
                    const userData = await User.findOne({ userid: member.user.id })
                    if (!userData) return interaction.reply({
                        content: `Указанный пользователь должен быть участником гильдии и не должен быть ботом!`,
                        ephemeral: true
                    })
                    for (let i = 0; i < amount; i++) {
                        await userData.stacked_items.push(role.id);
                    }
                    userData.save()
                    await interaction.editReply({
                        content: `Успешно выдана роль ${role} (\`${amount} шт.\` участнику ${member}!`
                    })
                }
                    break;
                case 'getprofile': {
                    const member = interaction.options.getMember(`пользователь`) || interaction.member
                    const userData = await User.findOne({
                        userid: interaction.user.id
                    })
                    if (member.user.id !== interaction.member.user.id && userData.staff_pos < 3) return interaction.reply({
                        content: `Вы не можете получить профиль другого игрока!`,
                        ephemeral: true
                    })
                    const profile = await User.findOne({
                        userid: member.user.id
                    })
                    let stream = await fs.createWriteStream(`./src/files/Database/Profile.json`)
                    let json = JSON.stringify(profile, (_, v) => typeof v === 'bigint' ? v.toString() : v)
                    stream.once('open', function (fd) {
                        stream.write(json);
                        stream.end();
                    });
                    let attach = new AttachmentBuilder()
                        .setFile(`./src/files/Database/Profile.json`)
                        .setName(`${profile.nickname}.json`)

                    try {
                        await interaction.member.send({
                            content: `**ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ \`${profile.nickname}\`**
:warning: **Меры безопасности**
1. Запрещено отправлять файл с вашим профилем другим пользователям, кроме администрации гильдии.
2. В вашем профиле содержится вся необходимая информация о вас.
3. Вы можете скачать данный файл как резервное копирование данных, но помните, что в случае потери данных будет использоваться данные резервного копирования администрации гильдии.
4. Если есть вопросы по файлу JSON (обозначения, информация и т.д.), обращайтесь к Дмитрию.
5. Если вы являетесь администратором гильдии и запросили профиль другого пользователя, помните, что вы будете наказаны в случае распространения данных профиля.`,
                            files: [attach]
                        })
                        await interaction.reply({
                            content: `Профиль \`${profile.nickname}\` был отправлен вам в личные сообщения в формате JSON.`,
                            ephemeral: true
                        })
                    } catch (e) {
                        return interaction.reply({
                            content: `Ваши личные сообщения закрыты, поэтому мы не смогли отправить вам профиль \`${profile.nickname}\`.`,
                            ephemeral: true
                        })
                    }

                }
                    break;
                default:
                    break;
            }

            switch (interaction.options.getSubcommandGroup()) {
                case `set`: {
                    if (interaction.channel.type == ChannelType.DM) return interaction.reply({
                        content: `Вы не можете использовать эту команду в личных сообщениях!`,
                        ephemeral: true
                    })
                    const embed = new EmbedBuilder()
                        .setAuthor({
                            name: `❗ Отсутствует необходимая роль!`
                        })
                        .setDescription(`Вы не имеете роль \`${interaction.guild.roles.cache.get(`320880176416161802`).name}\`!
Но вы всё ещё можете использовать команду \`/profile update\``)
                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                        .setColor(`DarkRed`)
                        .setTimestamp(Date.now())

                    if (!interaction.member.roles.cache.has(`320880176416161802`)) return interaction.reply({
                        embeds: [embed]
                    })


                    switch (interaction.options.getSubcommand()) {
                        case `string`: {
                            const user_id = interaction.options.getString(`id`)
                            const user = await interaction.guild.members.fetch(user_id)
                            const userData = await User.findOne({ userid: user_id })
                            const value = interaction.options.getString(`значение`)

                            switch (interaction.options.getString(`опция`)) {
                                case `ID в Discord`: {
                                    const before = userData.userid
                                    userData.userid = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }

                                    break;
                                case `UUID в Minecraft`: {
                                    const before = userData.uuid
                                    userData.uuid = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }

                                    break;

                                default:
                                    break;
                            }
                        }

                            break;
                        case `number`: {
                            const user_id = interaction.options.getString(`id`)
                            const user = await interaction.guild.members.fetch(user_id)
                            const userData = await User.findOne({ userid: user_id })
                            const value = interaction.options.getNumber(`значение`)

                            switch (interaction.options.getString(`опция`)) {
                                case `Возраст`: {
                                    const before = userData.age

                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })

                                    userData.age = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }
                                    break;
                                case `Опыт активности`: {
                                    const before = calcActLevel(0, userData.level, userData.exp)

                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })

                                    const values = getLevel(value)
                                    const level = values[0]
                                    const exp = values[1]
                                    userData.level = level
                                    userData.exp = exp
                                    userData.save()
                                    client.ActExp(userData.userid)

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }
                                    break;
                                case `Уровень активности`: {
                                    const before = userData.level

                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })

                                    userData.level = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }
                                    break;
                                case `Опыт рангов`: {
                                    const before = userData.rank

                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })


                                    if (value > 25000) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть больше 25000!`,
                                        ephemeral: true
                                    })

                                    userData.rank = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }
                                    break;
                                case `Румбики`: {
                                    const before = userData.rumbik

                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })

                                    userData.rumbik = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }
                                    break;
                                case `Опыт гильдии (GEXP)`: {
                                    const before = userData.gexp

                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })

                                    userData.gexp = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }
                                    break;
                                case `Билеты`: {
                                    const before = userData.tickets

                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })

                                    userData.tickets = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }
                                    break;

                                case `Цены в магазине`: {
                                    const before = userData.shop_costs

                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })

                                    userData.shop_costs = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }
                                    break;
                                case `Цены в магазине активности`: {
                                    const before = userData.act_costs

                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })

                                    userData.act_costs = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }
                                    break;
                                case `Цены в королевском магазине`: {
                                    const before = userData.king_costs

                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })

                                    userData.king_costs = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }
                                    break;
                                case `Персональный бустер опыта активности`: {
                                    const before = userData.pers_act_boost

                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })

                                    userData.pers_act_boost = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }
                                    break;
                                case `Персональный бустер опыта рангов`: {
                                    const before = userData.pers_rank_boost

                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })

                                    userData.pers_rank_boost = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }
                                    break;
                                case `Персональный бустер румбиков`: {
                                    const before = userData.pers_rumb_boost

                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })

                                    userData.pers_rumb_boost = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }
                                    break;

                                case `Обычные достижения`: {

                                    const before = userData.achievements.normal

                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })
                                    if (value > 25) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть больше 25!`,
                                        ephemeral: true
                                    })

                                    userData.achievements.normal = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }
                                    break;

                                case `Мифические достижения`: {
                                    const before = userData.achievements.mythical

                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })
                                    if (value > 5) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть больше 5!`,
                                        ephemeral: true
                                    })

                                    userData.achievements.mythical = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }
                                    break;

                                case `Медаль 🥇`: {
                                    const before = userData.medal_1

                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })

                                    userData.medal_1 = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }
                                    break;

                                case `Медаль 🥈`: {
                                    const before = userData.medal_2

                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })

                                    userData.medal_2 = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }
                                    break;
                                case `Медаль 🥉`: {

                                    const before = userData.medal_3

                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })

                                    userData.medal_3 = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }
                                    break;
                                case `Шансы на обычные предметы`: {

                                    const before = userData.box_chances.common

                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })

                                    userData.box_chances.common = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }
                                    break;
                                case `Шансы на необычные предметы`: {

                                    const before = userData.box_chances.uncommon

                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })

                                    userData.box_chances.uncommon = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }
                                    break;
                                case `Шансы на редкие предметы`: {

                                    const before = userData.box_chances.rare

                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })

                                    userData.box_chances.rare = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }
                                    break;
                                case `Шансы на эпические предметы`: {

                                    const before = userData.box_chances.epic

                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })

                                    userData.box_chances.epic = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }
                                    break;
                                case `Шансы на легендарные предметы`: {

                                    const before = userData.box_chances.legendary

                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })

                                    userData.box_chances.legendary = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }
                                    break;
                                case `Шансы на мифические предметы`: {

                                    const before = userData.box_chances.mythical

                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })

                                    userData.box_chances.mythical = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }
                                    break;
                                case `Шансы на ультраредкие предметы`: {

                                    const before = userData.box_chances.RNG

                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })

                                    userData.box_chances.RNG = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }
                                    break;
                                case `Навык "Перемещение под землёй" (Земля)`: {
                                    const before = userData.elements.underground

                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })
                                    if (value > 1) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть больше 1!`,
                                        ephemeral: true
                                    })

                                    userData.elements.underground = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }
                                    break;
                                case `Навык "Быстрый рост растений" (Земля)`: {
                                    const before = userData.elements.fast_grow

                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })
                                    if (value > 1) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть больше 1!`,
                                        ephemeral: true
                                    })

                                    userData.elements.fast_grow = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }
                                    break;
                                case `Навык "Выращивание горных пород" (Земля)`: {
                                    const before = userData.elements.mountains

                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })
                                    if (value > 1) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть больше 1!`,
                                        ephemeral: true
                                    })

                                    userData.elements.mountains = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }
                                    break;
                                case `Навык "Плавание на глубине" (Вода)`: {
                                    const before = userData.elements.diving

                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })
                                    if (value > 1) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть больше 1!`,
                                        ephemeral: true
                                    })

                                    userData.elements.diving = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }
                                    break;
                                case `Навык "Сопротивление течениям" (Вода)`: {
                                    const before = userData.elements.resistance

                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })
                                    if (value > 1) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть больше 1!`,
                                        ephemeral: true
                                    })

                                    userData.elements.resistance = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }


                                    break;
                                case `Навык "Подводное дыхание" (Вода)`: {
                                    const before = userData.elements.respiration

                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })
                                    if (value > 1) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть больше 1!`,
                                        ephemeral: true
                                    })

                                    userData.elements.respiration = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }
                                    break;
                                case `Навык "Защита от огня" (Огонь)`: {
                                    const before = userData.elements.fire_resistance

                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })
                                    if (value > 1) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть больше 1!`,
                                        ephemeral: true
                                    })

                                    userData.elements.fire_resistance = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }
                                    break;
                                case `Навык "Удар молнии" (Огонь)`: {
                                    const before = userData.elements.lightning

                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })
                                    if (value > 1) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть больше 1!`,
                                        ephemeral: true
                                    })

                                    userData.elements.lightning = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }
                                    break;
                                case `Навык "Управление пламенем" (Огонь)`: {
                                    const before = userData.elements.flame

                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })
                                    if (value > 1) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть больше 1!`,
                                        ephemeral: true
                                    })

                                    userData.elements.flame = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }
                                    break;
                                case `Навык "Полет в небесах" (Воздух)`: {
                                    const before = userData.elements.flying

                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })
                                    if (value > 1) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть больше 1!`,
                                        ephemeral: true
                                    })

                                    userData.elements.flying = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }
                                    break;
                                case `Навык "Повеление ветром" (Воздух)`: {
                                    const before = userData.elements.wind

                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })
                                    if (value > 1) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть больше 1!`,
                                        ephemeral: true
                                    })

                                    userData.elements.wind = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }
                                    break;
                                case `Навык "Орлиный глаз" (Воздух)`: {
                                    const before = userData.elements.eagle_eye



                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })
                                    if (value > 1) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть больше 1!`,
                                        ephemeral: true
                                    })

                                    userData.elements.eagle_eye = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }
                                    break;
                                case `Перк "Повышение опыта рангов"`: {
                                    const before = userData.perks.rank_boost

                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })
                                    if (value > 6) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть больше 6!`,
                                        ephemeral: true
                                    })

                                    userData.perks.rank_boost = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }
                                    break;
                                case `Перк "Скидка в королевском магазине"`: {
                                    const before = userData.perks.king_discount

                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })
                                    if (value > 4) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть больше 4!`,
                                        ephemeral: true
                                    })

                                    userData.perks.king_discount = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }
                                    break;
                                case `Перк "Скидка в магазине активности"`: {
                                    const before = userData.perks.act_discount

                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })
                                    if (value > 3) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть больше 3!`,
                                        ephemeral: true
                                    })

                                    userData.perks.act_discount = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }
                                    break;
                                case `Перк "Скидка в обычном магазине гильдии"`: {
                                    const before = userData.perks.shop_discount

                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })
                                    if (value > 4) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть больше 4!`,
                                        ephemeral: true
                                    })

                                    userData.perks.shop_discount = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }
                                    break;
                                case `Перк "Увеличение времени действия временных предметов"`: {
                                    const before = userData.perks.temp_items

                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })
                                    if (value > 1) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть больше 1!`,
                                        ephemeral: true
                                    })

                                    userData.perks.temp_items = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }
                                    break;
                                case `Перк "Возможность продавать предметы из профиля"`: {
                                    const before = userData.perks.sell_items
                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })
                                    if (value > 1) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть больше 1!`,
                                        ephemeral: true
                                    })

                                    userData.perks.sell_items = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }
                                    break;
                                case `Перк "Уменьшение опыта гильдии для получения билета"`: {
                                    const before = userData.perks.ticket_discount

                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })
                                    if (value > 5) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть больше 5!`,
                                        ephemeral: true
                                    })

                                    userData.perks.ticket_discount = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }
                                    break;
                                case `Перк "Изменение предметов"`: {
                                    const before = userData.perks.change_items

                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })
                                    if (value > 1) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть больше 1!`,
                                        ephemeral: true
                                    })

                                    userData.perks.change_items = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }
                                    break;
                                case 'Совместные игры': {
                                    const before = userData.visited_games

                                    if (value < 0) return interaction.reply({
                                        content: `\`${interaction.options.getString(`опция`)}\` не может быть меньше 0!`,
                                        ephemeral: true
                                    })

                                    userData.visited_games = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }
                                    break;
                                default:
                                    break;
                            }

                        }

                            break;
                        case 'boolean': {
                            const user_id = interaction.options.getString(`id`)
                            const user = await interaction.guild.members.fetch(user_id)
                            const userData = await User.findOne({ userid: user_id })
                            const value = interaction.options.getBoolean(`значение`)

                            switch (interaction.options.getString(`опция`)) {
                                case `Пользовательский значок ранга`: {
                                    const before = userData.displayname.custom_rank
                                    userData.displayname.custom_rank = value
                                    userData.save()

                                    const success = new EmbedBuilder()
                                        .setTitle(`Установлено новое значение в профиле`)
                                        .setDescription(`Значение \`${interaction.options.getString(`опция`)}\` у пользователя ${user} было установлено на \`${before}  ➡  ${value}\`! Используйте \`/profile updateall\`, чтобы применить новые значения и обновить старые у других пользователей!`)
                                        .setColor(Number(linksInfo.bot_color))
                                        .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                                        .setTimestamp(Date.now())

                                    await interaction.reply({
                                        embeds: [success]
                                    })
                                }

                                    break;

                                default:
                                    break;
                            }
                        }
                            break
                        default:
                            break;
                    }
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