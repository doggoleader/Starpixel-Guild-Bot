
const chalk = require(`chalk`)
const cron = require(`node-cron`)
const wait = require(`node:timers/promises`).setTimeout
const linksInfo = require(`../../discord structure/links.json`)
const plugin = {
    id: "admin",
    name: "Административное"
}

module.exports = (client) => {
    client.repeatFunctions = async () => {
        await wait(3000)

        cron.schedule(`0 10 */1 * *`, async () => {
            client.GEXP_PROFILES(); //Ежедневное обновление профилей участников гильдии (GEXP)
        }, {
            scheduled: true,
            timezone: `Europe/Moscow`
        })
        cron.schedule(`0 5 * 12 *`, async () => {
            client.AdventCalendar(); //Адвент календарь
        }, {
            scheduled: true,
            timezone: `Europe/Moscow`
        })


        cron.schedule(`0 5 1 1 *`, async () => {
            client.AdventCalendar(); //Адвент календарь
        }, {
            scheduled: true,
            timezone: `Europe/Moscow`
        })

        cron.schedule(`*/10 * * * *`, async () => {
            //Items
            client.rank_update(); //Обновление рангов
            client.updatenicks(); //Изменение никнеймов Discord

        }, {
            scheduled: true,
            timezone: `Europe/Moscow`
        });

        cron.schedule(`0 * * * *`, async () => {
            //Profiles
            client.AutoElements(); //Автовыдача стихий
            client.AutoStars(); //Автовыдача звезд
            client.checkSubscription(); //Проверка на наличие подписки
            client.ProgressUpdate(); //Обновление информации о прогрессе

            //Seasonal
            client.halloweenRewards(); //Выдача хэллоуинских наград (Если сезон активен)
            client.NewYearRewards(); //Выдача новогодних наград (Если сезон активен)
            client.EasterRewards(); //Выдача пасхальных наград (Если сезон активен)
            client.SummerRewards(); //Выдача летних наград (Если сезон активен)

            //Storages
            client.statsChannel(); //Обновление каналов со статистикой
            client.temp_roles(); //Уборка временных ролей
            client.AutoMythical();
            client.Discounts();
            client.Boosters();
            client.BankAccountCheck();

        }, {
            scheduled: true,
            timezone: `Europe/Moscow`
        });


        cron.schedule(`0 5 * * *`, async () => {

            client.UpdateNicknames(); //Обновление никнеймов в базе данных
            client.birthdayChannel(); //Обновление канала с днями рождения
            client.update_members(); //Обновление каналов с участниками
            client.removeNonPremiumColors(); //Уборка цветов у участников без VIP
            client.emojiUpdate(); //Запланированное обновление эмоджи
            client.wish_birthday(); //Запланированное поздравление с днем рождения
            client.InGuildRewards(); //Выдача наград за время в гильдии
            client.InfoUpdate(); //Обновление информациия из личных дел
            client.StaffPosUpdate(); //Обновление Staff позиции участника в гильдии
            client.ResetDailyLimits(); //Улучшения - сброс ежедневного лимита
            client.DailyEvents();
        }, {
            scheduled: true,
            timezone: `Europe/Moscow`
        });
        // Misc
        cron.schedule(`0 16 * * 0`, async () => {
            client.top_3_gexp(); //Запланированный подсчёт топ-3 по GEXP
        }, {
            scheduled: true,
            timezone: `Europe/Moscow`
        })
        cron.schedule(`1 0 * * 0`, async () => {
            client.resetVeterans(); //Сброс статистики ветеранов
        }, {
            scheduled: true,
            timezone: `Europe/Moscow`
        })
        cron.schedule(`1 0 1 * *`, async () => {
            client.resetMarathon(); //Сброс статистики марафона
        }, {
            scheduled: true,
            timezone: `Europe/Moscow`
        })
        cron.schedule(`0 12 1 * *`, async () => {
            client.BlackHole(); //Чёрная дыра
        }, {
            scheduled: true,
            timezone: `Europe/Moscow`
        })
        cron.schedule(`* * * * *`, async () => {
            client.StopPolls(); //Сброс статистики марафона
        }, {
            scheduled: true,
            timezone: `Europe/Moscow`
        })
        client.halloweenStart(); //Запланированное начало Хэллоуина
        client.halloweenEnd(); //Запланированный конец Хэллоуина
        client.newYearStart(); //Запланированное начало Нового года
        client.newYearEnd(); //Запланированный конец Нового года
        client.NewYearSnowfall(); //Новогодний снегопад
        client.EasterStart(); //Запланированное начало Пасхи
        client.EasterEnd(); //Запланированный конец Пасхи
        client.SummerStart(); //Запланированное начало Лета
        client.SummerEnd(); //Запланированный конец Лета
        client.HappyNewYear();
        client.SchedulerGuildGamesOffs();
        client.SchedulerGuildGamesRem();
        client.SchedulerGuildGamesStart();
        client.GGResetStatus();
        console.log(chalk.blackBright(`[${new Date()}]`) + chalk.blue(`[Бот Starpixel] Функции запущены!`))
    };
};