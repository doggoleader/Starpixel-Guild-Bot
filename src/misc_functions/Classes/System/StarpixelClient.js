const { Client, Collection } = require("discord.js");
const { DisTube, Song } = require(`distube`);
const fs = require(`fs`);
const { REST } = require("@discordjs/rest");
const wait = require(`timers/promises`).setTimeout
const chalk = require(`chalk`)
const cron = require(`node-cron`)
const { Routes } = require("discord-api-types/v10");
const { connection, Model } = require("mongoose");
const { MCUpdates } = require("../../../functions/Updates/MCUpdates")
const { NewYear } = require("../../../functions/seasons/NewYearClass")
const { UserUpdates } = require("../../../functions/Updates/UpdatesClass")
const { UpdatesNicknames } = require("../../../functions/Updates/NicknamesClass")
const { Easter } = require("../../../functions/seasons/EasterClass")
const { Summer } = require("../../../functions/seasons/SummerClass")
const { ChannelUpdates } = require("../../../functions/Updates/ChannelsUpdatesClass")
const { Notifications } = require("../../../functions/Updates/NotificationsClass")
const { TempItems } = require("../../../functions/Updates/TempItemsClass")
const { Birthdays } = require("../../../functions/Updates/BirthdaysClass")
const { PersInfo } = require("../../../functions/Updates/PersonalInfoClass")
const { BlackHole } = require("../../../functions/Black Hole System/BlackHoleClass")
const { PollsUpdates } = require("../../../functions/Polls/PollsClass")
const { Halloween } = require("../../../functions/seasons/HalloweenClass")
const { GuildGames } = require("../../../functions/GuildGames/GuildGamesClass")
const { Achievements } = require(`../../../functions/Updates/AchievementsClass`)
const { ActExp } = require(`../../../functions/Updates/ActivityExpClass`);
const { User } = require("../../../schemas/userdata");


class StarpixelClient extends Client {
    client;
    distube;

    commands = new Collection();
    buttons = new Collection();
    modals = new Collection();
    selectMenus = new Collection();
    voiceManager = new Collection();
    invites = new Collection();

    information;
    /**
     * @type {Array<{
     * guildId: String,
     * voiceChannelId: String | null,
     * textChannelId: String | null,
     * messageId: String | null,
     * enabled: Boolean,
     * volume: Number,
     * queue: Array<Song>,
     * autoplay: Boolean,
     * paused: Boolean,
     * loopmode: Number
     * }>}
     */
    musicSession = [];

    commandArray = [];
    /**
     * @param {import("discord.js").ClientOptions} options 
     */
    constructor(options) {
        super(options)
        this.distube = new DisTube(this, {
            leaveOnEmpty: true,
            emptyCooldown: 300,
            leaveOnFinish: false,
            leaveOnStop: false,
            savePreviousSongs: true,
            searchSongs: 5,
            searchCooldown: 30,
            nsfw: true,
            emitAddListWhenCreatingQueue: true,
            emitAddSongWhenCreatingQueue: true,
            joinNewVoiceChannel: true,
            directLink: true,
        })

        this.client = this;
        this.information = {
            "bot_color": "0x5700FC",
            "bot_id": "883421063369859122",
            "bot_dev": "491343958660874242",
            "bot_descr": "➡️ Официальный бот гильдии Starpixel",
            "guild_discord": "https://discord.gg/CjNwZfSvej",
            "guild_youtube": "https://www.youtube.com/channel/UCadHvRQQgqdU0WwqT_XnzGg",
            "guild_tiktok": "https://tiktok.com/@starpixel_guild",
            "guild_telegram": "https://t.me/starpixel",
            "guild_vk": "https://vk.com/starpixel_guild",
            "guild_email": "starpixel.guild@gmail.com",
            "guild_forumpost": "https://hypixel.net/threads/Русская-Гильдия-hypixel-•starpixel-•-level-172-•-Топ-107-•-Все-мини-игры-•-discord.4761422/"
        }
    }


    getVersion() {
        const pack = require(`../../../../package.json`)
        return pack.version
    }


    //System
    async handleEvents() {
        const folders = fs.readdirSync('./src/events');
        let i = 1
        for (const folder of folders) {
            const eventFolders = fs
                .readdirSync(`./src/events/${folder}`)
            switch (folder) {
                case "client":
                    for (const eventFolder of eventFolders) {
                        const eventFiles = fs
                            .readdirSync(`./src/events/${folder}/${eventFolder}`)
                            .filter((file) => file.endsWith(`.js`));;

                        for (const file of eventFiles) {
                            const event = require(`../../../events/${folder}/${eventFolder}/${file}`)
                            if (event.once) this.once(event.name, (...args) => event.execute(...args, this.client))
                            else this.on(event.name, (...args) => event.execute(...args, this.client));
                            console.log(chalk.blackBright(`[${new Date()}]`) + chalk.hex(`#707070`)(`[ЗАГРУЗКА СОБЫТИЙ] ${i++}. ${file} был успешно загружен! (Discord.js)`))
                        }

                    }
                    break;



                case "mongo": {
                    for (const eventFolder of eventFolders) {
                        const eventFiles = fs
                            .readdirSync(`./src/events/${folder}/${eventFolder}`)
                            .filter((file) => file.endsWith(`.js`));;

                        for (const file of eventFiles) {
                            const event = require(`../../../events/${folder}/${eventFolder}/${file}`)
                            if (event.once) connection.once(event.name, (...args) => event.execute(...args, this.client))
                            else connection.on(event.name, (...args) => event.execute(...args, this.client));
                            console.log(chalk.blackBright(`[${new Date()}]`) + chalk.hex(`#707070`)(`[ЗАГРУЗКА СОБЫТИЙ] ${i++}. ${file} был успешно загружен! (MongoDB)`))
                        }
                    }
                }
                    break;

                case "distube": {
                    for (const eventFolder of eventFolders) {
                        const eventFiles = fs
                            .readdirSync(`./src/events/${folder}/${eventFolder}`)
                            .filter((file) => file.endsWith(`.js`));;

                        for (const file of eventFiles) {
                            const event = require(`../../../events/${folder}/${eventFolder}/${file}`)
                            if (event.once) this.distube.once(event.name, (...args) => event.execute(...args, this.clientv))
                            else this.distube.on(event.name, (...args) => event.execute(...args, this.client));
                            console.log(chalk.blackBright(`[${new Date()}]`) + chalk.hex(`#707070`)(`[ЗАГРУЗКА СОБЫТИЙ] ${i++}. ${file} был успешно загружен! (Distube)`))
                        }

                    }
                }
                    break;
                /* case "hypixelbot": {
                    for (const eventFolder of eventFolders) {
                        const eventFiles = fs
                            .readdirSync(`./src/events/${folder}/${eventFolder}`)
                            .filter((file) => file.endsWith(`.js`));;

                        for (const file of eventFiles) {
                            const event = require(`../../../events/${folder}/${eventFolder}/${file}`)
                            if (event.once) McClient.once(event.name, (...args) => event.execute(...args, this))
                            else McClient.on(event.name, (...args) => event.execute(...args, this));
                            console.log(chalk.blackBright(`[${new Date()}]`) + chalk.hex(`#707070`)(`[ЗАГРУЗКА СОБЫТИЙ] ${i++}. ${file} был успешно загружен! (Hypixel Bot)`))
                        }

                    }
                }
                    break; */
                default:
                    break;
            }
        };

        console.log(chalk.blackBright(`[${new Date()}]`) + chalk.blue(`[Бот Starpixel] События запущены!`))
    }

    async setupMusicPlugin() {
        await this.client.guilds.cache.forEach(async guild => {
            this.musicSession.push(
                {
                    guildId: guild.id,
                    voiceChannelId: null,
                    textChannelId: null,
                    messageId: null,
                    enabled: false,
                    volume: 50,
                    queue: [],
                    autoplay: false,
                    paused: false,
                    loopmode: 0,
                }
            )
        })
    }
    async handleCommands() {
        const commandFolders = fs.readdirSync('./src/commands');
        let i = 1
        for (const folder of commandFolders) {
            const commandFiles = fs
                .readdirSync(`./src/commands/${folder}`)
                .filter((file) => file.endsWith('.js'));

            const { commands, commandArray } = this;
            for (const file of commandFiles) {
                const command = require(`../../../commands/${folder}/${file}`);
                commands.set(command.data.name, command);
                commandArray.push(command.data.toJSON());
                console.log(chalk.blackBright(`[${new Date()}]`) + chalk.hex(`#535b83`)(`[ЗАГРУЗКА КОМАНД] ${i++}. ${file} был успешно загружен!`))
            }
        }

        const clientId = '883421063369859122';
        const guildId = '320193302844669959';
        const rest = new REST({ version: '10' }).setToken(process.env.token);
        try {
            console.log(chalk.blackBright(`[${new Date()}]`) + chalk.blue(`[Бот Starpixel] Обновление команд приложения...`));

            await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
                body: [],
            });
            await rest.put(Routes.applicationCommands(clientId), { body: this.commandArray })
            console.log(chalk.blackBright(`[${new Date()}]`) + chalk.blue(`[Бот Starpixel] Команды обновлены.`));
        } catch (error) {
            console.error(error);
        }
    }

    async handleComponents() {
        const folders = fs.readdirSync('./src/components');
        for (const folder of folders) {
            const componentFolder = fs
                .readdirSync(`./src/components/${folder}`)

            const { buttons, modals, selectMenus } = this;
            switch (folder) {
                case "buttons": {
                    let i = 1
                    for (const buttonFolder of componentFolder) {
                        const buttonFiles = fs
                            .readdirSync(`./src/components/${folder}/${buttonFolder}`)
                            .filter(file => file.endsWith(`.js`))
                        for (const file of buttonFiles) {
                            const button = require(`../../../components/${folder}/${buttonFolder}/${file}`)
                            buttons.set(button.data.name, button)
                            console.log(chalk.blackBright(`[${new Date()}]`) + chalk.hex(`#63fffb`)(`[ЗАГРУЗКА КНОПОК] ${i++}. ${file} был успешно загружен!`))
                        }
                    }
                }
                    break;



                case "modals": {
                    let i = 1
                    for (const modalFolder of componentFolder) {
                        const modalFiles = fs
                            .readdirSync(`./src/components/${folder}/${modalFolder}`)
                            .filter((file) => file.endsWith(`.js`));;

                        for (const file of modalFiles) {
                            const modal = require(`../../../components/${folder}/${modalFolder}/${file}`)
                            modals.set(modal.data.name, modal)
                            console.log(chalk.blackBright(`[${new Date()}]`) + chalk.hex(`#9370d8`)(`[ЗАГРУЗКА ФОРМ] ${i++}. ${file} был успешно загружен!`))
                        }

                    }
                }
                    break;

                case "selectMenus": {
                    let i = 1
                    for (const selectMenuFolder of componentFolder) {
                        const selectMenuFiles = fs
                            .readdirSync(`./src/components/${folder}/${selectMenuFolder}`)
                            .filter((file) => file.endsWith(`.js`));;

                        for (const file of selectMenuFiles) {
                            const selectMenu = require(`../../../components/${folder}/${selectMenuFolder}/${file}`)
                            selectMenus.set(selectMenu.data.name, selectMenu)
                            console.log(chalk.blackBright(`[${new Date()}]`) + chalk.hex(`#fdda64`)(`[ЗАГРУЗКА МЕНЮ] ${i++}. ${file} был успешно загружен!`))
                        }

                    }
                }
                    break;

                default:
                    break;
            }
        };
    }

    async startFunctions() {
        await wait(3000)
        cron.schedule(`0 10 */1 * *`, async () => {
            this.GEXP_PROFILES(); //Ежедневное обновление профилей участников гильдии (GEXP)
        }, {
            scheduled: true,
            timezone: `Europe/Moscow`
        })
        cron.schedule(`0 5 * 12 *`, async () => {
            this.AdventCalendar(); //Адвент календарь
        }, {
            scheduled: true,
            timezone: `Europe/Moscow`
        })


        cron.schedule(`0 5 1 1 *`, async () => {
            this.AdventCalendar(); //Адвент календарь
        }, {
            scheduled: true,
            timezone: `Europe/Moscow`
        })

        cron.schedule(`*/10 * * * *`, async () => {
            //Items
            this.rank_update(); //Обновление рангов
            this.updatenicks(); //Изменение никнеймов Discord

        }, {
            scheduled: true,
            timezone: `Europe/Moscow`
        });

        cron.schedule(`0 * * * *`, async () => {
            //Profiles
            this.AutoElements(); //Автовыдача стихий
            this.AutoStars(); //Автовыдача звезд
            this.checkSubscription(); //Проверка на наличие подписки
            this.ProgressUpdate(null); //Обновление информации о прогрессе
            this.CheckCollections();
            this.AutoSeasonalColors();

            //Seasonal
            this.halloweenRewards(); //Выдача хэллоуинских наград (Если сезон активен)
            this.NewYearRewards(); //Выдача новогодних наград (Если сезон активен)
            this.EasterRewards(); //Выдача пасхальных наград (Если сезон активен)
            this.SummerRewards(); //Выдача летних наград (Если сезон активен)

            //Storages
            this.statsChannel(); //Обновление каналов со статистикой
            this.temp_roles(); //Уборка временных ролей
            this.AutoMythical();
            this.Discounts();
            this.Boosters();
            this.BankAccountCheck();

        }, {
            scheduled: true,
            timezone: `Europe/Moscow`
        });


        cron.schedule(`0 5 * * *`, async () => {

            this.UpdateNicknames(); //Обновление никнеймов в базе данных
            this.birthdayChannel(); //Обновление канала с днями рождения
            this.update_members(); //Обновление каналов с участниками
            this.removeNonPremiumColors(); //Уборка цветов у участников без VIP
            this.emojiUpdate(); //Запланированное обновление эмоджи
            this.wish_birthday(); //Запланированное поздравление с днем рождения
            this.InGuildRewards(); //Выдача наград за время в гильдии
            this.InfoUpdate(null, null); //Обновление информациия из личных дел
            this.StaffPosUpdate(null); //Обновление Staff позиции участника в гильдии
            this.ResetDailyLimits(); //Улучшения - сброс ежедневного лимита
            this.DailyEvents();
        }, {
            scheduled: true,
            timezone: `Europe/Moscow`
        });
        // Misc
        cron.schedule(`0 16 * * 0`, async () => {
            this.top_3_gexp(); //Запланированный подсчёт топ-3 по GEXP
        }, {
            scheduled: true,
            timezone: `Europe/Moscow`
        })
        cron.schedule(`1 0 * * 0`, async () => {
            this.resetVeterans(); //Сброс статистики ветеранов
        }, {
            scheduled: true,
            timezone: `Europe/Moscow`
        })
        cron.schedule(`1 0 1 * *`, async () => {
            this.resetMarathon(); //Сброс статистики марафона
            this.newMarathon(); //Выбор нового марафона
        }, {
            scheduled: true,
            timezone: `Europe/Moscow`
        })
        cron.schedule(`0 12 1 * *`, async () => {
            this.activate(); //Чёрная дыра
        }, {
            scheduled: true,
            timezone: `Europe/Moscow`
        })
        cron.schedule(`* * * * *`, async () => {
            this.StopPolls(); //Проверка результатов опроса
            this.cd_notifications(); //Уведомления о перезарядках
        }, {
            scheduled: true,
            timezone: `Europe/Moscow`
        })
        this.halloweenStart(); //Запланированное начало Хэллоуина
        this.halloweenEnd(); //Запланированный конец Хэллоуина
        this.newYearStart(); //Запланированное начало Нового года
        this.newYearEnd(); //Запланированный конец Нового года
        this.NewYearSnowfall(); //Новогодний снегопад
        this.EasterStart(); //Запланированное начало Пасхи
        this.EasterEnd(); //Запланированный конец Пасхи
        this.SummerStart(); //Запланированное начало Лета
        this.SummerEnd(); //Запланированный конец Лета
        this.HappyNewYear();
        this.SchedulerGuildGamesOffs();
        this.SchedulerGuildGamesRem();
        this.SchedulerGuildGamesStart();
        this.GGResetStatus();
        console.log(chalk.blackBright(`[${new Date()}]`) + chalk.blue(`[Бот Starpixel] Функции запущены!`))
    }


    //MCUpdates
    async GEXP_PROFILES() {
        await MCUpdates.GEXP_PROFILES(this.client);
    }

    async InGuildRewards() {
        await MCUpdates.InGuildRewards(this.client);
    }

    async UpdateNicknames() {
        await MCUpdates.UpdateNicknames(this.client);
    }

    async resetMarathon() {
        await MCUpdates.resetMarathon(this.client);
    }

    async resetVeterans() {
        await MCUpdates.resetVeterans(this.client);
    }

    async top_3_gexp() {
        await MCUpdates.top_3_gexp(this.client);
    }
    async newMarathon() {
        await MCUpdates.newMarathon(this.client);
    }


    //NewYear
    async newYearStart() {
        await NewYear.newYearStart(this.client);
    }
    async AdvCalendarClear() {
        await NewYear.AdvCalendarClear(this.client);
    }
    async AdventCalendar() {
        await NewYear.AdventCalendar(this.client);
    }
    async HappyNewYear() {
        await NewYear.HappyNewYear(this.client);
    }
    async NewYearNamesDisable() {
        await NewYear.NewYearNamesDisable(this.client);
    }
    async NewYearNamesEnable() {
        await NewYear.NewYearNamesEnable(this.client);
    }
    async NewYearRewards() {
        await NewYear.NewYearRewards(this.client);
    }
    async NewYearSnowfall() {
        await NewYear.NewYearSnowfall(this.client);
    }
    async newYearEnd() {
        await NewYear.newYearEnd(this.client);
    }

    //UserUpdates
    async AutoElements() {
        await UserUpdates.AutoElements(this.client);
    }
    async AutoMythical() {
        await UserUpdates.AutoMythical(this.client);
    }
    async AutoStars() {
        await UserUpdates.AutoStars(this.client);
    }
    async BankAccountCheck() {
        await UserUpdates.BankAccountCheck(this.client);
    }
    async Boosters() {
        await UserUpdates.Boosters(this.client);
    }
    async DailyEvents() {
        await UserUpdates.DailyEvents(this.client);
    }
    async Discounts() {
        await UserUpdates.Discounts(this.client);
    }
    async ProgressUpdate(oldMember) {
        await UserUpdates.ProgressUpdate(oldMember, this.client);
    }
    async ResetDailyLimits() {
        await UserUpdates.ResetDailyLimits(this.client);
    }
    async StaffPosUpdate(userid) {
        await UserUpdates.StaffPosUpdate(userid, this.client);
    }
    async checkSubscription() {
        await UserUpdates.checkSubscription(this.client);
    }
    async emojiUpdate() {
        await UserUpdates.emojiUpdate(this.client);
    }
    async rank_update() {
        await UserUpdates.rank_update(this.client);
    }
    async removeNonPremiumColors() {
        await UserUpdates.removeNonPremiumColors(this.client);
    }
    async CheckCollections() {
        await UserUpdates.CheckCollections(this.client);
    }
    async AutoSeasonalColors() {
        await UserUpdates.AutoSeasonalColors(this.client)
    }

    //UpdatesNicknames
    async updatenicks() {
        await UpdatesNicknames.updatenicks(this.client);
    }

    //Easter
    async EasterStart() {
        await Easter.EasterStart(this.client);
    }
    async EasterRewards() {
        await Easter.EasterRewards(this.client);
    }
    async EasterEnd() {
        await Easter.EasterEnd(this.client);
    }

    //Summer
    async SummerStart() {
        await Summer.SummerStart(this.client);
    }
    async SummerRewards() {
        await Summer.SummerRewards(this.client);
    }
    async SummerEnd() {
        await Summer.SummerEnd(this.client);
    }

    //Halloween
    async halloweenStart() {
        await Halloween.halloweenStart(this.client);
    }
    async halloweenRewards() {
        await Halloween.halloweenRewards(this.client);
    }
    async halloweenEnd() {
        await Halloween.halloweenEnd(this.client);
    }

    //ChannelUpdates
    async birthdayChannel() {
        await ChannelUpdates.birthdayChannel(this.client);
    }
    async statsChannel() {
        await ChannelUpdates.statsChannel(this.client);
    }
    async update_members() {
        await ChannelUpdates.update_members(this.client);
    }

    //TempItems
    async TempItemsHelper(userid, guildid, extraInfo) {
        TempItems.TempItemsHelper(userid, guildid, extraInfo, this.client);
    }
    async getInfo(userid, guildid, extraInfo) {
        TempItems.getInfo(userid, guildid, extraInfo, this.client);
    }
    async temp_roles() {
        TempItems.temp_roles(this.client);
    }

    //Birthdays
    async wish_birthday() {
        await Birthdays.wish_birthday(this.client);
    }

    //PersInfo
    async InfoUpdate(userid, reason) {
        await PersInfo.InfoUpdate(userid, reason, this.client)
    }
    async MonthlyGEXPCheck() {
        await PersInfo.MonthlyGEXPCheck(this.client)
    }
    async PersJoinGuild(userid) {
        await PersInfo.PersJoinGuild(userid, this.client)
    }
    async Warnings() {
        await PersInfo.Warnings(this.client)
    }

    //BlackHole
    async BlackHoleActivate() {
        await BlackHole.activate(this.client);
    }

    //PollsUpdates
    async StopPolls() {
        await PollsUpdates.StopPolls(this.client);
    }

    //GuildGames
    async GGResetStatus() {
        await GuildGames.GGResetStatus(this.client);
    }
    async GameEnd() {
        await GuildGames.GameEnd(this.client);
    }
    async GamePreStart() {
        await GuildGames.GamePreStart(this.client);
    }
    async GuildGameStart() {
        await GuildGames.GuildGameStart(this.client);
    }
    async GuildGamesCheckRewards(member) {
        await GuildGames.GuildGamesCheckRewards(member, this.client);
    }
    async ReminderForOfficer() {
        await GuildGames.ReminderForOfficer(this.client);
    }
    async SchedulerGuildGamesOffs() {
        await GuildGames.SchedulerGuildGamesOffs(this.client);
    }
    async SchedulerGuildGamesRem() {
        await GuildGames.SchedulerGuildGamesRem(this.client);
    }
    async SchedulerGuildGamesStart() {
        await GuildGames.SchedulerGuildGamesStart(this.client);
    }
    async randomGame() {
        await GuildGames.randomGame(this.client);
    }

    //Achievements
    async AchMyth6() {
        await Achievements.AchMyth6(this.client);
    }
    async CountAchievements() {
        await Achievements.CountAchievements(this.client);
    }

    //ActExp
    async ActExp(userid) {
        await ActExp.ActExp(userid, this.client);
    }
    async act_rewards() {
        await ActExp.act_rewards(this.client);
    }

    //Notifications
    async cd_notifications() {
        await Notifications.cd_notifications(this.client);
    }
}
module.exports = {
    StarpixelClient
}