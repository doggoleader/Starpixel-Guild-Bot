const { GuildMember, ButtonStyle, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js")
const ch_list = require(`./discord structure/channels.json`)
const fetch = require(`node-fetch`)
const { Guild } = require(`./schemas/guilddata`)
const api = process.env.hypixel_apikey


//Суффикс после цифр в днях рождения
function toOrdinalSuffix(num) {
    const int = parseInt(num), digits = [int % 10, int % 100], ordinals = [`-ым`, `-ым`, `-им`, `-ым`], oPattern = [1, 2, 3, 4], tPattern = [11, 12, 13, 14, 15, 16, 17, 18, 19]

    return oPattern.includes(digits[0]) && !tPattern.includes(digits[1])
        ? int + ordinals[digits[0] - 1]
        : int + ordinals[3]
};

function suffix(num) {
    const int = parseInt(num), digits = [int % 10, int % 100], ordinals = [` раз`, ` раза`, ` раза`, ` раза`, ` раз`], oPattern = [1, 2, 3, 4, 5], tPattern = [11, 12, 13, 14, 15, 16, 17, 18, 19]

    return oPattern.includes(digits[0]) && !tPattern.includes(digits[1])
        ? int + ordinals[digits[0] - 1]
        : int + ordinals[4]
};



//Игра в дурака
class gameConstructor {
    constructor() { }
    getAmountAndList(amount) {
        let err = new Error(`Значение не является числом! (${typeof amount})`)
        if (typeof amount !== "number") return err
        let cards_list = [`9♥`, `9♦`, `9♠`, `9♣`, `10♥`, `10♦`, `10♠`, `10♣`, `J♥`, `J♦`, `J♠`, `J♣`, `Q♥`, `Q♦`, `Q♠`, `Q♣`, `K♥`, `K♦`, `K♠`, `K♣`, `T♥`, `T♦`, `T♠`, `T♣`]
        if (amount === 24) {
            cards_list
        } else if (amount === 36) {
            cards_list.push([`6♥`, `6♦`, `6♠`, `6♣`, `7♥`, `7♦`, `7♠`, `7♣`, `8♥`, `8♦`, `8♠`, `8♣`])
        } else if (amount === 52) {
            cards_list.push([`2♥`, `2♦`, `2♠`, `2♣`, `3♥`, `3♦`, `3♠`, `3♣`, `4♥`, `4♦`, `4♠`, `4♣`, `5♥`, `5♦`, `5♠`, `5♣`, `6♥`, `6♦`, `6♠`, `6♣`, `7♥`, `7♦`, `7♠`, `7♣`, `8♥`, `8♦`, `8♠`, `8♣`])
        } else {
            let err = new Error(`Введённое вами число не является допустимым для создания игры!`)
            return err
        }
        return cards_list
    }

    getRule(rule) {
        let err = new Error(`Выбранный вариант не является допустим типом игры! ${rule}`)
        if (typeof rule !== "string") return err

        let g_rule
        if (rule === "Переводной") {
            g_rule = "Переводной"
        } else if (rule === "Подкидной") {
            g_rule = "Переводной"
        } else {
            let err = new Error(`Введённое вами правило не является допустимым для создания игры!`)
            return err
        }
        return g_rule
    }

    getFinal(final) {
        let err = new Error(`Выбранный вариант не является допустим финалом игры! ${final}`)
        if (typeof rule !== "string") return err
        let g_final
        if (final === "Дурак один") {
            g_final = "Дурак один"
        } else if (final === "Ничья") {
            g_final = "Ничья"
        } else {
            let err = new Error(`Введённое вами правило не является допустимым для создания игры!`)
            return err
        }
        return g_final

    }
}


//Получить ВСЕГО ОПЫТА АКТИВНОСТИ
function calcActLevel(i, level, exp) {
    let sum0 = []
    let sum1 = 0
    let result
    for (i = 0; i <= level; i++) {
        if (i < level) {
            sum1 = ((5 * (i ** 2)) + (50 * i) + 100)
            sum0.push(sum1)
        } else if (i == level) {
            sum0.push(exp)
            result = sum0.reduce((prev, cur) => {
                return prev + cur
            })
            return result
        }
    }
}

//Рассчитать УРОВЕНЬ АКТИВНОСТИ по ВСЕГО ОПЫТА
function getLevel(exp) {
    let level = 0
    if (exp >= ((5 * (level ** 2)) + (50 * level) + 100)) {
        while (exp >= ((5 * (level ** 2)) + (50 * level) + 100)) {
            exp -= ((5 * (level ** 2)) + (50 * level) + 100);
            level += 1;
        }
    }
    return [level, exp]
}

function permToName(array) {
    let result = []
    for (let i = 0; i < array.length; i++) {
        let name
        switch (array[i]) {
            case `AddReactions`: {
                name = `Добавлять реакции`
                result.push(name)
            }
                break;
            case `Administrator`: {
                name = `Администратор`
                result.push(name)
            }
                break;
            case `AttachFiles`: {
                name = `Прикреплять файлы`
                result.push(name)
            }
                break;
            case `BanMembers`: {
                name = `Банить участников`
                result.push(name)
            }
                break;
            case `ChangeNickname`: {
                name = `Изменять никнейм`
                result.push(name)
            }
                break;
            case `Connect`: {
                name = `Подключаться`
                result.push(name)
            }
                break;
            case `CreateInstantInvite`: {
                name = `Создавать приглашения`
                result.push(name)
            }
                break;
            case `CreatePrivateThreads`: {
                name = `Создавать приватные ветки`
                result.push(name)
            }
                break;
            case `CreatePublicThreads`: {
                name = `Создавать публичные ветки`
                result.push(name)
            }
                break;
            case `DeafenMembers`: {
                name = `Отключать участникам звук`
                result.push(name)
            }
                break;
            case `EmbedLinks`: {
                name = `Встраивать ссылки`
                result.push(name)
            }
                break;
            case `KickMembers`: {
                name = `Выгонять участников`
                result.push(name)
            }
                break;
            case `ManageChannels`: {
                name = `Управлять каналами`
                result.push(name)
            }
                break;
            case `ManageEmojisAndStickers`: {
                name = `Управлять эмодзи с стикерами`
                result.push(name)
            }
                break;
            case `ManageEvents`: {
                name = `Управлять событиями`
                result.push(name)
            }
                break;
            case `ManageGuild`: {
                name = `Управлять сервером`
                result.push(name)
            }
                break;
            case `ManageMessages`: {
                name = `Управлять сообщениями`
                result.push(name)
            }
                break;
            case `ManageNicknames`: {
                name = `Управлять никнеймами`
                result.push(name)
            }
                break;
            case `ManageRoles`: {
                name = `Управлять ролями`
                result.push(name)
            }
                break;
            case `ManageThreads`: {
                name = `Управлять ветками`
                result.push(name)
            }
                break;
            case `ManageWebhooks`: {
                name = `Управлять вебхуками`
                result.push(name)
            }
                break;
            case `MentionEveryone`: {
                name = `Упоминание \@everyone, \@here и всех ролей`
                result.push(name)
            }
                break;
            case `ModerateMembers`: {
                name = `Отправлять участников подумать о своем поведении`
                result.push(name)
            }
                break;
            case `MoveMembers`: {
                name = `Перемещать участников`
                result.push(name)
            }
                break;
            case `MuteMembers`: {
                name = `Отключать участникам микрофон`
                result.push(name)
            }
                break;
            case `PrioritySpeaker`: {
                name = `Приоритетные режим`
                result.push(name)
            }
                break;
            case `ReadMessageHistory`: {
                name = `Читать историю сообщений`
                result.push(name)
            }
                break;
            case `RequestToSpeak`: {
                name = `Попросить выступить`
                result.push(name)
            }
                break;
            case `SendMessages`: {
                name = `Отправлять сообщения`
                result.push(name)
            }
                break;
            case `SendMessagesInThreads`: {
                name = `Отправлять сообщения в ветках`
                result.push(name)
            }
                break;
            case `SendTTSMessages`: {
                name = `Отправлять TTS сообщения`
                result.push(name)
            }
                break;
            case `Speak`: {
                name = `Говорить`
                result.push(name)
            }
                break;
            case `Stream`: {
                name = `Использовать видео`
                result.push(name)
            }
                break;
            case `UseApplicationCommands`: {
                name = `Использовать команды приложений`
                result.push(name)
            }
                break;
            case `UseEmbeddedActivities`: {
                name = `Использовать активности`
                result.push(name)
            }
                break;
            case `UseExternalEmojis`: {
                name = `Использовать внешние эмодзи`
                result.push(name)
            }
                break;
            case `UseExternalStickers`: {
                name = `Использовать внешние стикеры`
                result.push(name)
            }
                break;
            case `UseVAD`: {
                name = `Использовать режим активации по голосу`
                result.push(name)
            }
                break;
            case `ViewAuditLog`: {
                name = `Просматривать журнал аудита`
                result.push(name)
            }
                break;
            case `ViewChannel`: {
                name = `Просматривать канал`
                result.push(name)
            }
                break;
            case `ViewGuildInsights`: {
                name = `Просматривать статистику сервера`
                result.push(name)
            }
                break;

            default:
                break;
        }
    }


    return result
}

function isURL(string) {
    let url;

    try {
        url = new URL(string);
        return true
    } catch (e) {
        return false;
    }
}

function toggleOnOff(boolean) {
    let err = new Error(`\`Выбранная опция должны иметь тип Boolean!\``)
    if (typeof boolean !== "boolean") return err

    if (boolean === false) return `\`Отключено\` ❌`
    else if (boolean === true) return `\`Включено\` ✅`

}

function replaceTrueFalse(boolean) {
    let err = new Error(`\`Выбранная опция должны иметь тип Boolean!\``)
    if (typeof boolean !== "boolean") return err

    if (boolean === false) return `\`Нет\` ❌`
    else if (boolean === true) return `\`Да\` ✅`
}

function achievementStats(boolean) {
    let err = new Error(`\`Выбранная опция должны иметь тип Boolean!\``)
    if (typeof boolean !== "boolean") return err

    if (boolean === false) return `\`Не выполнено\` ❌`
    else if (boolean === true) return `\`Выполнено\` ✅`
}
function found(boolean) {
    let err = new Error(`\`Выбранная опция должны иметь тип Boolean!\``)
    if (typeof boolean !== "boolean") return err

    if (boolean === false) return `\`Не найдено\` ❌`
    else if (boolean === true) return `\`Найдено\` ✅`
}

function secondPage(number) {
    if (number >= 2) return false
    else return true
}

function defaultShop(type, value) {
    if (type == value) return true
    else return false
}

function daysOfWeek(number) {
    let err = new Error(`\`Выбранная опция должны иметь тип Number!\``)
    if (typeof number !== "number") return err

    if (number == 0 || number == 7) {
        return `Воскресенье`
    } else if (number == 1) {
        return `Понедельник`
    } else if (number == 2) {
        return `Вторник`
    } else if (number == 3) {
        return `Среда`
    } else if (number == 4) {
        return `Четверг`
    } else if (number == 5) {
        return `Пятница`
    } else if (number == 6) {
        return `Суббота`
    } else return `Число ${number} не представляет собой день недели!`
}

function rankName(number) {
    let err = new Error(`\`Выбранная опция должны иметь тип Number!\``)
    if (typeof number !== "number") return err

    if (number == 0) {
        return `Новичок`
    } else if (number == 1) {
        return `Специалист`
    } else if (number == 2) {
        return `Профессионал`
    } else if (number == 3) {
        return `Мастер`
    } else if (number == 4) {
        return `Чемпион`
    } else if (number == 5) {
        return `Звёздочка`
    } else if (number == 6) {
        return `Легенда`
    } else if (number == 7) {
        return `Владыка`
    } else if (number == 8) {
        return `Лорд`
    } else if (number == 9) {
        return `Император`
    } else if (number == 10) {
        return `Повелитель`
    } else return `Число ${number} не имеет никакого ранга!`
}


function monthName(number) {
    let err = new Error(`\`Выбранная опция должны иметь тип Number!\``)
    if (typeof number !== "number") return err

    if (number == 1) {
        return `Январь`
    } else if (number == 2) {
        return `Февраль`
    } else if (number == 3) {
        return `Март`
    } else if (number == 4) {
        return `Апрель`
    } else if (number == 5) {
        return `Май`
    } else if (number == 6) {
        return `Июнь`
    } else if (number == 7) {
        return `Июль`
    } else if (number == 8) {
        return `Август`
    } else if (number == 9) {
        return `Сентябрь`
    } else if (number == 10) {
        return `Октябрь`
    } else if (number == 11) {
        return `Ноябрь`
    } else if (number == 12) {
        return `Декабрь`
    } else return `Число ${number} не имеет никакого месяца!`
}


async function lastValue(data, query) {
    let queryKeys = query
    let result
    if (typeof data == `object`) {
        for (let key in data) {
            let i = 0
            if (key == queryKeys[i] && queryKeys.length > 0) {
                queryKeys.splice(i, 1)
                result = data[key]
                return lastValue(result, queryKeys)
            }
        }
    } else if (typeof data !== 'object') {
        const res = data
        return res
    }
}
async function getRes(object, query) {
    if (!object) return `Вы не указали параметр data!`
    if (typeof object !== "object") return `Параметр data должен быть Object!`
    if (!query) return `Вы не указали параметр query!`
    if (typeof query !== "string") return `Параметр query должен быть String!`
    let queryKeys = query.split(`.`);
    const result = await lastValue(object, queryKeys)
    return result
}


async function lastValue(data, query) {
    let queryKeys = query
    let result
    if (typeof data == `object`) {
        for (let key in data) {
            let i = 0
            if (key == queryKeys[i] && queryKeys.length > 0) {
                queryKeys.splice(i, 1)
                result = data[key]
                return lastValue(result, queryKeys)
            }
        }
    } else if (typeof data !== 'object') {
        const res = data
        return res
    }
}
async function getRes(object, query) {
    if (!object) return `Вы не указали параметр data!`
    if (typeof object !== "object") return `Параметр data должен быть Object!`
    if (!query) return `Вы не указали параметр query!`
    if (typeof query !== "string") return `Параметр query должен быть String!`
    let queryKeys = query.split(`.`);
    const result = await lastValue(object, queryKeys)
    return result
}

async function changeProperty(object, query, newValue) {
    if (!object) return `Вы не указали параметр object!`
    if (typeof object !== "object") return `Параметр object должен быть Object!`
    if (!query) return `Вы не указали параметр query!`
    if (typeof query !== "string") return `Параметр query должен быть String!`
    if (!newValue) return `Вы не указали параметр newValue!`
    let property = object
    let queryKeys = query.split(`.`);
    while (queryKeys.length > 1) {
        property = property[queryKeys[0]]
        queryKeys.splice(0, 1)
    }
    if (typeof property[queryKeys[0]] !== typeof newValue) return console.log(`Новое значение должно иметь формат ${typeof property[queryKeys[0]]}!`)
    property[queryKeys[0]] = newValue
}

async function getProperty(object, query) {
    if (!object) return `Вы не указали параметр object!`
    if (typeof object !== "object") return `Параметр object должен быть Object!`
    if (!query) return `Вы не указали параметр query!`
    if (typeof query !== "string") return `Параметр query должен быть String!`
    let property = object
    let queryKeys = query.split(`.`);
    while (queryKeys.length > 1) {
        
        if (property) {
            property = property[queryKeys[0]]
            queryKeys.splice(0, 1)
            if (!property) return null;
        } else {
            return null
        }
    }
    if (!property[queryKeys[0]]) {
        return null
    } else return property[queryKeys[0]]
}
/**
 * Делит массив на страницы, в котором находятся по несколько элементов. 
 * @param {Array} array - Массив, который необходимо поделить на страницы
 * @param {Number} items_on_a_page - Количество элементов на странице
 * @param {Number} pageNumber - Номер требуемой страницы
 * @returns Страница массива <array> (номер страницы = pageNumber), состоящая из <items_on_a_page> элементов
 */
async function divideOnPages(array, items_on_a_page, pageNumber) {
    pageNumber--
    let result = array.slice(0 + (pageNumber * items_on_a_page), items_on_a_page + (pageNumber * items_on_a_page))
    if (result.length <= 0) throw new Error("COULD_NOT_CREATE_A_PAGE: Too little items in the provided array")
    else return result
}
function convertToRoman(num) {
    var roman = {
        M: 1000,
        CM: 900,
        D: 500,
        CD: 400,
        C: 100,
        XC: 90,
        L: 50,
        XL: 40,
        X: 10,
        IX: 9,
        V: 5,
        IV: 4,
        I: 1
    };
    var str = '';

    for (var i of Object.keys(roman)) {
        var q = Math.floor(num / roman[i]);
        num -= q * roman[i];
        str += i.repeat(q);
        if (num === 0) return str
    }

    return str;
}



/**
 * Get Application Channel Messages Templates to edit if the status was changed.
 * 
 * @param {import("./misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
 * @returns {array} Array of arrays, containing Application Channel Messages Templates.
 * The first array is for DISABLED bypass status
 * The second array is for ENABLED FOR ADMINISTRATION bypass status
 * The third array is for ENABLED FOR GUILD MEMBERS bypass status
 * The fourth array is for ENABLED FOR EVERYONE bypass status
 * 
 * Each array includes the next components: 
 *  2 embeds (0 & 1 array indexes), containing basic info about application process.
 *  All other array components are ActionRows, sorted in the right way they should be in the message.
 */
function getApplicationTemplates(client) {

    const enabled_everyone_embed1 = new EmbedBuilder()
        .setDescription(`# Как вступить в гильдию Starpixel?
Чтобы подать заявку в гильдию, по очереди нажмите на кнопки \`Часть 1 заявки\` и \`Часть 2 заявки\`.
            
После того, как вы ответите на все вопросы, вы можете нажать на кнопку \`Проверить заявку\`, чтобы проверить вашу заявку. Если вы обнаружили ошибку в вашей заявке, вы можете снова нажать на кнопки заполнения заявки. Для отправки вашей заявки нажмите кнопку \`Отправить заявку\`. Если вы решили полностью удалить заявку или переписать её __после отправки__, вы можете нажать на кнопку \`Удалить заявку\`.
            
Перед подачей заявки не забудьте прочитать <#${ch_list.rules}> и нажать кнопочку в конце, иначе вы __не сможете__ подать заявку в гильдию.
            
Помните, что в ваших основных данных (имя, никнейм, возраст) **не должно быть опечаток**, поэтому проверяйте введённые вами данные, так как вы не сможете изменить заявку!
            
После того, как вы отправили заявку, в течение 7 дней с вами свяжется член администрации гильдии и сообщит Вам результат вашей заявки. Если вы не получили ответ на вашу заявку в течение 7 дней, вероятнее всего, что вашу заявку отклонили. Вы можете проверить статус вашей заявки, нажав на кнопку \`Статус заявки\`!`)
        .setColor(Number(client.information.bot_color))

    const enabled_everyone_embed2 = new EmbedBuilder()
        .setColor(Number(client.information.bot_color))
        .setDescription(`# Процесс вступления в гильдию
Вступление в гильдию состоит из двух этапов: заявки, состоящей из двух частей, и интервью.

## Заявка
В заявке задаются обычные вопросы, которые позволяют нам узнать, кто подаёт заявку, соответствует ли он требованиям и т.д. В данном этапе нет ничего сложного, главное соответствовать требованиям для вступления в гильдию, указанным в канале <#${ch_list.guildInfo}>.
**Доступ для нелицензионных аккаунтов**: \`Открытый\`

### Шаг 1
Выберите, есть ли у вас лицензионный аккаунт Minecraft. Если аккаунт имеется, на 2-м шаге вам будет необходимо ввести никнейм своего аккаунта.

### Шаг 2
Заполните форму, состоящую из двух частей.

**Часть 1**
Первая часть заявки представляет собой базовые вопросы, которые позволяют нам получить основную информацию об игроке. Данная часть включает в себя следующие вопросы:
- **Как вас зовут?** Ваше реальное имя.
- **Какой у вас никнейм в Minecraft?** Ваш никнейм в Minecraft. __Только для пользователей с лицензионным аккаунтом.__
- **Сколько вам лет?** Ваш реальный возраст без лишних символов.
- **Можете ли вы пойти в голосовой канал?** В случае, если заявка будет принята, вы будете приглашены на небольшое интервью в голосовом канале, поэтому требуется наличие микрофона.
- **Ознакомились ли вы с правилами?** Вы даёте своё согласие (несогласие) соблюдать правила гильдии Starpixel.

**Часть 2**
Вторая часть заявки представляет собой вопросы, требующие развернутого ответа. Они позволяют нам узнать вас немного поближе. Данная часть включает в себя следующие вопросы:
- **Почему вы хотите вступить к нам в гильдию?** В данном вопросе вы можете рассказать, почему вы хотите вступить именно к нам. 
- **Как вы узнали о нашей гильдии?** Расскажите, как и где вы узнали о нашей гильдии (форумы, рекомендации друзей или другие источники).

### Шаг 3
Вам необходимо отправить вашу заявку, чтобы мы могли её рассмотреть. Если вы передумаете, вы можете удалить её в любое время.

### Информация
\`Проверить заявку\` - Присылает вам заполненную форму вашей заявки. Если вы хотите что-то изменить, вам необходимо удалить заявку, вернуться к шагу 2 и изменить ответы.
\`Статус заявки\` - Проверить статус вашей заявки. Существует 5 статусов заявок:
- \`На рассмотрении\` - Вы отправили вашу заявку и в данный момент её рассматривают.
- \`Удалена\` - Вы удалили свою заявку, процесс рассмотрения остановлен.
- \`Отклонена\` - К сожалению, ваша заявка была отклонена. Вы можете попробовать вступить ещё раз через 6 месяцев.
- \`Принята на интервью\` - Вы прошли первый этап вступления и перешли на этап интервью.
- \`Принята\` - Поздравляем со вступлением в гильдию Starpixel! 🎉

## Интервью
Этап интервью - это этап знакомства игрока с представителем администрации гильдии. На интервью с вами будут говорить о ваших увлечениях, любимых играх и о других темах, которые будут интересовать офицера. По окончании диалога будет принято финальное решение о принятии вас в гильдию, и, если все будет хорошо, вы станете полноценным участником гильдии Starpixel!`)

    const enabled_everyone_component1 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`dev_button1`)
                .setEmoji(`1️⃣`)
                .setStyle(ButtonStyle.Secondary)
                .setLabel(`Шаг 1 ➡`)
                .setDisabled(true)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`account_exist`)
                .setStyle(ButtonStyle.Success)
                .setLabel(`Имею лицензию`)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`account_dont_exist`)
                .setStyle(ButtonStyle.Danger)
                .setLabel(`Лицензии нет`)
        )
    const enabled_everyone_component2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`dev_button2`)
                .setEmoji(`2️⃣`)
                .setStyle(ButtonStyle.Secondary)
                .setLabel(`Шаг 2 ➡`)
                .setDisabled(true)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`apply1`)
                .setLabel(`Часть 1 заявки`)
                .setStyle(ButtonStyle.Primary)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`apply2`)
                .setLabel(`Часть 2 заявки`)
                .setStyle(ButtonStyle.Primary)
        )

    const enabled_everyone_component3 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`dev_button3`)
                .setEmoji(`3️⃣`)
                .setStyle(ButtonStyle.Secondary)
                .setLabel(`Шаг 3 ➡`)
                .setDisabled(true)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`app_send`)
                .setLabel(`Отправить`)
                .setStyle(ButtonStyle.Success)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`app_delete`)
                .setLabel(`Удалить`)
                .setStyle(ButtonStyle.Danger)
        )

    const enabled_everyone_component4 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`dev_button4`)
                .setEmoji(`ℹ`)
                .setStyle(ButtonStyle.Secondary)
                .setLabel(`Информация ➡`)
                .setDisabled(true)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`app_check`)
                .setLabel(`Проверить заявку`)
                .setStyle(ButtonStyle.Secondary)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`app_status`)
                .setLabel(`Статус заявки`)
                .setStyle(ButtonStyle.Secondary)
        )



    const enabled_members_embed1 = new EmbedBuilder()
        .setDescription(`# Как вступить в гильдию Starpixel?
Чтобы подать заявку в гильдию, по очереди нажмите на кнопки \`Часть 1 заявки\` и \`Часть 2 заявки\`.
            
После того, как вы ответите на все вопросы, вы можете нажать на кнопку \`Проверить заявку\`, чтобы проверить вашу заявку. Если вы обнаружили ошибку в вашей заявке, вы можете снова нажать на кнопки заполнения заявки. Для отправки вашей заявки нажмите кнопку \`Отправить заявку\`. Если вы решили полностью удалить заявку или переписать её __после отправки__, вы можете нажать на кнопку \`Удалить заявку\`.
            
Перед подачей заявки не забудьте прочитать <#${ch_list.rules}> и нажать кнопочку в конце, иначе вы __не сможете__ подать заявку в гильдию.
            
Помните, что в ваших основных данных (имя, никнейм, возраст) **не должно быть опечаток**, поэтому проверяйте введённые вами данные, так как вы не сможете изменить заявку!
            
После того, как вы отправили заявку, в течение 7 дней с вами свяжется член администрации гильдии и сообщит Вам результат вашей заявки. Если вы не получили ответ на вашу заявку в течение 7 дней, вероятнее всего, что вашу заявку отклонили. Вы можете проверить статус вашей заявки, нажав на кнопку \`Статус заявки\`!`)
        .setColor(Number(client.information.bot_color))

    const enabled_members_embed2 = new EmbedBuilder()
        .setColor(Number(client.information.bot_color))
        .setDescription(`# Процесс вступления в гильдию
Вступление в гильдию состоит из двух этапов: заявки, состоящей из двух частей, и интервью.

## Заявка
В заявке задаются обычные вопросы, которые позволяют нам узнать, кто подаёт заявку, соответствует ли он требованиям и т.д. В данном этапе нет ничего сложного, главное соответствовать требованиям для вступления в гильдию, указанным в канале <#${ch_list.guildInfo}>.
**Доступ для нелицензионных аккаунтов**: \`Приглашения только от участников гильдии\`

### Шаг 1
Заполните форму, состоящую из двух частей.

**Часть 1**
Первая часть заявки представляет собой базовые вопросы, которые позволяют нам получить основную информацию об игроке. Данная часть включает в себя следующие вопросы:
- **Как вас зовут?** Ваше реальное имя.
- **Какой у вас никнейм в Minecraft?** Ваш никнейм в Minecraft. __Только для пользователей с лицензионным аккаунтом.__
- **Сколько вам лет?** Ваш реальный возраст без лишних символов.
- **Можете ли вы пойти в голосовой канал?** В случае, если заявка будет принята, вы будете приглашены на небольшое интервью в голосовом канале, поэтому требуется наличие микрофона.
- **Ознакомились ли вы с правилами?** Вы даёте своё согласие (несогласие) соблюдать правила гильдии Starpixel.

**Часть 2**
Вторая часть заявки представляет собой вопросы, требующие развернутого ответа. Они позволяют нам узнать вас немного поближе. Данная часть включает в себя следующие вопросы:
- **Почему вы хотите вступить к нам в гильдию?** В данном вопросе вы можете рассказать, почему вы хотите вступить именно к нам. 
- **Как вы узнали о нашей гильдии?** Расскажите, как и где вы узнали о нашей гильдии (форумы, рекомендации друзей или другие источники).

### Шаг 2
Вам необходимо отправить вашу заявку, чтобы мы могли её рассмотреть. Если вы передумаете, вы можете удалить её в любое время.

### Информация
\`Проверить заявку\` - Присылает вам заполненную форму вашей заявки. Если вы хотите что-то изменить, вам необходимо удалить заявку, вернуться к шагу 2 и изменить ответы.
\`Статус заявки\` - Проверить статус вашей заявки. Существует 5 статусов заявок:
- \`На рассмотрении\` - Вы отправили вашу заявку и в данный момент её рассматривают.
- \`Удалена\` - Вы удалили свою заявку, процесс рассмотрения остановлен.
- \`Отклонена\` - К сожалению, ваша заявка была отклонена. Вы можете попробовать вступить ещё раз через 6 месяцев.
- \`Принята на интервью\` - Вы прошли первый этап вступления и перешли на этап интервью.
- \`Принята\` - Поздравляем со вступлением в гильдию Starpixel! 🎉

## Интервью
Этап интервью - это этап знакомства игрока с представителем администрации гильдии. На интервью с вами будут говорить о ваших увлечениях, любимых играх и о других темах, которые будут интересовать офицера. По окончании диалога будет принято финальное решение о принятии вас в гильдию, и, если все будет хорошо, вы станете полноценным участником гильдии Starpixel!`)

    const enabled_members_component1 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`dev_button2`)
                .setEmoji(`1️⃣`)
                .setStyle(ButtonStyle.Secondary)
                .setLabel(`Шаг 1 ➡`)
                .setDisabled(true)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`apply1`)
                .setLabel(`Часть 1 заявки`)
                .setStyle(ButtonStyle.Primary)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`apply2`)
                .setLabel(`Часть 2 заявки`)
                .setStyle(ButtonStyle.Primary)
        )

    const enabled_members_component2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`dev_button3`)
                .setEmoji(`2️⃣`)
                .setStyle(ButtonStyle.Secondary)
                .setLabel(`Шаг 2 ➡`)
                .setDisabled(true)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`app_send`)
                .setLabel(`Отправить`)
                .setStyle(ButtonStyle.Success)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`app_delete`)
                .setLabel(`Удалить`)
                .setStyle(ButtonStyle.Danger)
        )

    const enabled_members_component3 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`dev_button4`)
                .setEmoji(`ℹ`)
                .setStyle(ButtonStyle.Secondary)
                .setLabel(`Информация ➡`)
                .setDisabled(true)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`app_check`)
                .setLabel(`Проверить заявку`)
                .setStyle(ButtonStyle.Secondary)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`app_status`)
                .setLabel(`Статус заявки`)
                .setStyle(ButtonStyle.Secondary)
        )




    const enabled_admin_embed1 = new EmbedBuilder()
        .setDescription(`# Как вступить в гильдию Starpixel?
Чтобы подать заявку в гильдию, по очереди нажмите на кнопки \`Часть 1 заявки\` и \`Часть 2 заявки\`.
            
После того, как вы ответите на все вопросы, вы можете нажать на кнопку \`Проверить заявку\`, чтобы проверить вашу заявку. Если вы обнаружили ошибку в вашей заявке, вы можете снова нажать на кнопки заполнения заявки. Для отправки вашей заявки нажмите кнопку \`Отправить заявку\`. Если вы решили полностью удалить заявку или переписать её __после отправки__, вы можете нажать на кнопку \`Удалить заявку\`.
            
Перед подачей заявки не забудьте прочитать <#${ch_list.rules}> и нажать кнопочку в конце, иначе вы __не сможете__ подать заявку в гильдию.
            
Помните, что в ваших основных данных (имя, никнейм, возраст) **не должно быть опечаток**, поэтому проверяйте введённые вами данные, так как вы не сможете изменить заявку!
            
После того, как вы отправили заявку, в течение 7 дней с вами свяжется член администрации гильдии и сообщит Вам результат вашей заявки. Если вы не получили ответ на вашу заявку в течение 7 дней, вероятнее всего, что вашу заявку отклонили. Вы можете проверить статус вашей заявки, нажав на кнопку \`Статус заявки\`!`)
        .setColor(Number(client.information.bot_color))

    const enabled_admin_embed2 = new EmbedBuilder()
        .setColor(Number(client.information.bot_color))
        .setDescription(`# Процесс вступления в гильдию
Вступление в гильдию состоит из двух этапов: заявки, состоящей из двух частей, и интервью.

## Заявка
В заявке задаются обычные вопросы, которые позволяют нам узнать, кто подаёт заявку, соответствует ли он требованиям и т.д. В данном этапе нет ничего сложного, главное соответствовать требованиям для вступления в гильдию, указанным в канале <#${ch_list.guildInfo}>.
**Доступ для нелицензионных аккаунтов**: \`Приглашения только от персонала гильдии\`

### Шаг 1
Заполните форму, состоящую из двух частей.

**Часть 1**
Первая часть заявки представляет собой базовые вопросы, которые позволяют нам получить основную информацию об игроке. Данная часть включает в себя следующие вопросы:
- **Как вас зовут?** Ваше реальное имя.
- **Какой у вас никнейм в Minecraft?** Ваш никнейм в Minecraft. __Только для пользователей с лицензионным аккаунтом.__
- **Сколько вам лет?** Ваш реальный возраст без лишних символов.
- **Можете ли вы пойти в голосовой канал?** В случае, если заявка будет принята, вы будете приглашены на небольшое интервью в голосовом канале, поэтому требуется наличие микрофона.
- **Ознакомились ли вы с правилами?** Вы даёте своё согласие (несогласие) соблюдать правила гильдии Starpixel.

**Часть 2**
Вторая часть заявки представляет собой вопросы, требующие развернутого ответа. Они позволяют нам узнать вас немного поближе. Данная часть включает в себя следующие вопросы:
- **Почему вы хотите вступить к нам в гильдию?** В данном вопросе вы можете рассказать, почему вы хотите вступить именно к нам. 
- **Как вы узнали о нашей гильдии?** Расскажите, как и где вы узнали о нашей гильдии (форумы, рекомендации друзей или другие источники).

### Шаг 2
Вам необходимо отправить вашу заявку, чтобы мы могли её рассмотреть. Если вы передумаете, вы можете удалить её в любое время.

### Информация
\`Проверить заявку\` - Присылает вам заполненную форму вашей заявки. Если вы хотите что-то изменить, вам необходимо удалить заявку, вернуться к шагу 2 и изменить ответы.
\`Статус заявки\` - Проверить статус вашей заявки. Существует 5 статусов заявок:
- \`На рассмотрении\` - Вы отправили вашу заявку и в данный момент её рассматривают.
- \`Удалена\` - Вы удалили свою заявку, процесс рассмотрения остановлен.
- \`Отклонена\` - К сожалению, ваша заявка была отклонена. Вы можете попробовать вступить ещё раз через 6 месяцев.
- \`Принята на интервью\` - Вы прошли первый этап вступления и перешли на этап интервью.
- \`Принята\` - Поздравляем со вступлением в гильдию Starpixel! 🎉

## Интервью
Этап интервью - это этап знакомства игрока с представителем администрации гильдии. На интервью с вами будут говорить о ваших увлечениях, любимых играх и о других темах, которые будут интересовать офицера. По окончании диалога будет принято финальное решение о принятии вас в гильдию, и, если все будет хорошо, вы станете полноценным участником гильдии Starpixel!`)

    const enabled_admin_component1 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`dev_button2`)
                .setEmoji(`1️⃣`)
                .setStyle(ButtonStyle.Secondary)
                .setLabel(`Шаг 1 ➡`)
                .setDisabled(true)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`apply1`)
                .setLabel(`Часть 1 заявки`)
                .setStyle(ButtonStyle.Primary)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`apply2`)
                .setLabel(`Часть 2 заявки`)
                .setStyle(ButtonStyle.Primary)
        )

    const enabled_admin_component2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`dev_button3`)
                .setEmoji(`2️⃣`)
                .setStyle(ButtonStyle.Secondary)
                .setLabel(`Шаг 2 ➡`)
                .setDisabled(true)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`app_send`)
                .setLabel(`Отправить`)
                .setStyle(ButtonStyle.Success)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`app_delete`)
                .setLabel(`Удалить`)
                .setStyle(ButtonStyle.Danger)
        )

    const enabled_admin_component3 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`dev_button4`)
                .setEmoji(`ℹ`)
                .setStyle(ButtonStyle.Secondary)
                .setLabel(`Информация ➡`)
                .setDisabled(true)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`app_check`)
                .setLabel(`Проверить заявку`)
                .setStyle(ButtonStyle.Secondary)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`app_status`)
                .setLabel(`Статус заявки`)
                .setStyle(ButtonStyle.Secondary)
        )



    const disabled_embed1 = new EmbedBuilder()
        .setDescription(`# Как вступить в гильдию Starpixel?
Чтобы подать заявку в гильдию, по очереди нажмите на кнопки \`Часть 1 заявки\` и \`Часть 2 заявки\`.
            
После того, как вы ответите на все вопросы, вы можете нажать на кнопку \`Проверить заявку\`, чтобы проверить вашу заявку. Если вы обнаружили ошибку в вашей заявке, вы можете снова нажать на кнопки заполнения заявки. Для отправки вашей заявки нажмите кнопку \`Отправить заявку\`. Если вы решили полностью удалить заявку или переписать её __после отправки__, вы можете нажать на кнопку \`Удалить заявку\`.
            
Перед подачей заявки не забудьте прочитать <#${ch_list.rules}> и нажать кнопочку в конце, иначе вы __не сможете__ подать заявку в гильдию.
            
Помните, что в ваших основных данных (имя, никнейм, возраст) **не должно быть опечаток**, поэтому проверяйте введённые вами данные, так как вы не сможете изменить заявку!
            
После того, как вы отправили заявку, в течение 7 дней с вами свяжется член администрации гильдии и сообщит Вам результат вашей заявки. Если вы не получили ответ на вашу заявку в течение 7 дней, вероятнее всего, что вашу заявку отклонили. Вы можете проверить статус вашей заявки, нажав на кнопку \`Статус заявки\`!`)
        .setColor(Number(client.information.bot_color))

    const disabled_embed2 = new EmbedBuilder()
        .setColor(Number(client.information.bot_color))
        .setDescription(`# Процесс вступления в гильдию
Вступление в гильдию состоит из двух этапов: заявки, состоящей из двух частей, и интервью.

## Заявка
В заявке задаются обычные вопросы, которые позволяют нам узнать, кто подаёт заявку, соответствует ли он требованиям и т.д. В данном этапе нет ничего сложного, главное соответствовать требованиям для вступления в гильдию, указанным в канале <#${ch_list.guildInfo}>.
**Доступ для нелицензионных аккаунтов**: \`Закрыт\`

### Шаг 1
Заполните форму, состоящую из двух частей.

**Часть 1**
Первая часть заявки представляет собой базовые вопросы, которые позволяют нам получить основную информацию об игроке. Данная часть включает в себя следующие вопросы:
- **Как вас зовут?** Ваше реальное имя.
- **Какой у вас никнейм в Minecraft?** Ваш никнейм в Minecraft. __Только для пользователей с лицензионным аккаунтом.__
- **Сколько вам лет?** Ваш реальный возраст без лишних символов.
- **Можете ли вы пойти в голосовой канал?** В случае, если заявка будет принята, вы будете приглашены на небольшое интервью в голосовом канале, поэтому требуется наличие микрофона.
- **Ознакомились ли вы с правилами?** Вы даёте своё согласие (несогласие) соблюдать правила гильдии Starpixel.

**Часть 2**
Вторая часть заявки представляет собой вопросы, требующие развернутого ответа. Они позволяют нам узнать вас немного поближе. Данная часть включает в себя следующие вопросы:
- **Почему вы хотите вступить к нам в гильдию?** В данном вопросе вы можете рассказать, почему вы хотите вступить именно к нам. 
- **Как вы узнали о нашей гильдии?** Расскажите, как и где вы узнали о нашей гильдии (форумы, рекомендации друзей или другие источники).

### Шаг 2
Вам необходимо отправить вашу заявку, чтобы мы могли её рассмотреть. Если вы передумаете, вы можете удалить её в любое время.

### Информация
\`Проверить заявку\` - Присылает вам заполненную форму вашей заявки. Если вы хотите что-то изменить, вам необходимо удалить заявку, вернуться к шагу 2 и изменить ответы.
\`Статус заявки\` - Проверить статус вашей заявки. Существует 5 статусов заявок:
- \`На рассмотрении\` - Вы отправили вашу заявку и в данный момент её рассматривают.
- \`Удалена\` - Вы удалили свою заявку, процесс рассмотрения остановлен.
- \`Отклонена\` - К сожалению, ваша заявка была отклонена. Вы можете попробовать вступить ещё раз через 6 месяцев.
- \`Принята на интервью\` - Вы прошли первый этап вступления и перешли на этап интервью.
- \`Принята\` - Поздравляем со вступлением в гильдию Starpixel! 🎉

## Интервью
Этап интервью - это этап знакомства игрока с представителем администрации гильдии. На интервью с вами будут говорить о ваших увлечениях, любимых играх и о других темах, которые будут интересовать офицера. По окончании диалога будет принято финальное решение о принятии вас в гильдию, и, если все будет хорошо, вы станете полноценным участником гильдии Starpixel!`)

    const disabled_component1 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`dev_button2`)
                .setEmoji(`1️⃣`)
                .setStyle(ButtonStyle.Secondary)
                .setLabel(`Шаг 1 ➡`)
                .setDisabled(true)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`apply1`)
                .setLabel(`Часть 1 заявки`)
                .setStyle(ButtonStyle.Primary)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`apply2`)
                .setLabel(`Часть 2 заявки`)
                .setStyle(ButtonStyle.Primary)
        )

    const disabled_component2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`dev_button3`)
                .setEmoji(`2️⃣`)
                .setStyle(ButtonStyle.Secondary)
                .setLabel(`Шаг 2 ➡`)
                .setDisabled(true)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`app_send`)
                .setLabel(`Отправить`)
                .setStyle(ButtonStyle.Success)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`app_delete`)
                .setLabel(`Удалить`)
                .setStyle(ButtonStyle.Danger)
        )

    const disabled_component3 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`dev_button4`)
                .setEmoji(`ℹ`)
                .setStyle(ButtonStyle.Secondary)
                .setLabel(`Информация ➡`)
                .setDisabled(true)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`app_check`)
                .setLabel(`Проверить заявку`)
                .setStyle(ButtonStyle.Secondary)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`app_status`)
                .setLabel(`Статус заявки`)
                .setStyle(ButtonStyle.Secondary)
        )





    const disabled = [
        disabled_embed1,
        disabled_embed2,
        disabled_component1,
        disabled_component2,
        disabled_component3
    ],
        enabled_admin = [
            enabled_admin_embed1,
            enabled_admin_embed2,
            enabled_admin_component1,
            enabled_admin_component2,
            enabled_admin_component3
        ],
        enabled_members = [
            enabled_members_embed1,
            enabled_members_embed2,
            enabled_members_component1,
            enabled_members_component2,
            enabled_members_component3
        ],
        enabled_all = [
            enabled_everyone_embed1,
            enabled_everyone_embed2,
            enabled_everyone_component1,
            enabled_everyone_component2,
            enabled_everyone_component3,
            enabled_everyone_component4
        ]





    return [
        disabled,
        enabled_admin,
        enabled_members,
        enabled_all
    ]
}


function getPluginName(id) {
    switch (id) {
        case 'items': {
            return 'Предметы';
        }
            break;
        case 'nicknames': {
            return 'Никнеймы';
        }
            break;

        case 'birthday': {
            return 'Дни рождения';
        }
            break;

        case 'new_users': {
            return 'Новые пользователи';
        }
            break;

        case 'tickets': {
            return 'Служба поддержки';
        }
            break;

        case 'logs': {
            return 'Журнал аудита';
        }
            break;

        case 'hypixel': {
            return 'Hypixel';
        }
            break;

        case 'music': {
            return 'Музыка';
        }
            break;

        case 'guildgames': {
            return 'Совместные игры';
        }
            break;

        case 'channels': {
            return 'Каналы';
        }
            break;

        case 'seasonal': {
            return 'Сезонное';
        }
            break;

        case 'admin': {
            return 'Административное';
        }
            break;

        case 'misc': {
            return 'Разное';
        }
            break;


        default: throw new Error(`Plugin with ID ${id} does not exist!`)
            break;
    }
}


async function checkPlugin(guildID, pluginID) {
    const guildData = await Guild.findOne({ id: guildID })
    if (!guildData) return true;
    if (guildData.plugins[pluginID] == true) return true
    else return false;
}

async function createBingoProfile(userData, season_id, bingo) {
    userData.seasonal[season_id].bingo = []
    let response = await fetch(`https://api.hypixel.net/player?uuid=${userData.uuid}`, {
        headers: {
            "API-Key": api,
            "Content-Type": "application/json"
        }
    })
    try {
        let json = await response.json()
        let rowNum = 0
        for (let row of bingo.bingo) {
            userData.seasonal[season_id].bingo.push([])
            let usRow = userData.seasonal[season_id].bingo[rowNum]
            for (let task of row) {
                if (task.type == 'discord') {
                    let curWins = await getProperty(userData, task.code)
                    if (!curWins) curWins = 0
                    usRow.push({
                        id: task.id,
                        before: curWins,
                        requirement: curWins + task.req_wins,
                        finished: false,
                        description: task.description
                    })
                } else if (task.type == 'hypixel') {
                    //console.log(userData.nickname + "    " + task.code)
                    let curWins = await getProperty(json.player, task.code)
                    if (!curWins) curWins = 0
                    usRow.push({
                        id: task.id,
                        before: curWins,
                        requirement: curWins + task.req_wins,
                        finished: false,
                        description: task.description
                    })
                }
            }
            rowNum++
        }
        userData.save()
        return userData;
    } catch (e) {
        console.log(e)
    }

}


function getPerkName(key) {
    let names = {
        "rank_boost": "🔺 Повышение опыта рангов",
        "shop_discount": "🔻 Скидка в обычном магазине гильдии",
        "king_discount": "🔻 Скидка в королевском магазине",
        "act_discount": "🔻 Скидка в магазине активности",
        "temp_items": "🕒 Увеличение времени действия временных предметов",
        "sell_items": "💰 Возможность продавать предметы из профиля",
        "ticket_discount": "🏷️ Уменьшение опыта гильдии для получения билета",
        "change_items": "✨ Изменение предметов",
        "store_items": "📦 Сохранение дубликатов из коробок в инвентаре",
        "decrease_cooldowns": "🕒 Уменьшение перезарядки",
    }
    return names[key]
}

function getUpgradeName(key) {
    let names = {
        "inventory_size_tier": "Размер инвентаря",
        "max_purchases_tier": "Максимальное количество покупок",
        "max_sells_tier": "Максимальное количество продаж",
        "bank_account_tier": "Банковский аккаунт",
        "veterans_quests_tier": "Количество заданий для ветеранов"
    }
    return names[key]
}

/**
 * 
 * @param {import("./misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
 * @param {String} command String name of command (including necessary subcommands and subcommand groups, but without `/` symbol)
 */
function mentionCommand(client, command) {
    const main_part = command.split(' ')[0]
    const command_found = client.application.commands.cache.find(command => command.name == main_part)
    if (!command_found) throw new Error(`Could not find command with the name ${command}! Please, check if you are not using / symbol or check if you did not misspelled the name of command`)
    return `</${command}:${command_found.id}>`
}

function getCooldownUsage(key) {
    const names = {
        "daily": `Открытие ежедневной коробки`,
        "weekly": `Открытие еженедельной коробки`,
        "monthly": `Открытие ежемесячной коробки`,
        "staffbox": `Открытие коробки персонала`,
        "seasonalWinner": `Открытие коробки сезонного победителя`,
        "prestige": "Открытие талисмана счастья",
        "prof_update": `Обновление профиля`,
        "prof_create": `Создание профиля игроку`,
        "spet": `Питомец Земли`,
        "epet": `Питомец Воздуха`,
        "lpet": `Питомец Воды`,
        "mpet": `Питомец Огня`,
        "earth": `Стихия Земли`,
        "air": `Стихия Воздуха`,
        "water": `Стихия Воды`,
        "fire": `Стихия Огня`,
        "sun": `Солнце`,
        "mercury": `Меркурий`,
        "venera": `Венера`,
        "mars": `Марс`,
        "jupiter": `Юпитер`,
        "saturn": `Сатурн`,
        "uran": `Уран`,
        "neptune": `Нептун`,
        "sub_1": `Подписка I уровня`,
        "sub_2": `Подписка II уровня`,
        "sub_3": `Подписка III уровня`,
        "premium": `Подписка уровня VIP`,
        "boost": `Буст игрока`,
        "dog": `Коллекция собаки`,
        "cat": `Коллекция кота`,
        "rabbit": `Коллекция кролика`,
        "fox": `Коллекция лисы`,
        "lion": `Коллекция льва`,
        "hw_quest": `Хэллоуинский квест`,
        "ny_quest": `Новогодний квест`,
        "ea_quest": `Пасхальный квест`,
        "su_quest": `Летний квест`,
        "ny_santa_rew": `Новогодняя награда`,
        "mc_link": `Привязка аккаунта Minecraft`,
        "mc_unlink": `Отвязка аккаунта Minecraft`,

    }

    return names[key]
}

function getBoxLoot(key) {
    const object = {
        "big": require(`./misc_functions/Boxes/Box loot/big.json`),
        "daily": require(`./misc_functions/Boxes/Box loot/daily.json`),
        "monthly": require(`./misc_functions/Boxes/Box loot/monthly.json`),
        "weekly": require(`./misc_functions/Boxes/Box loot/weekly.json`),
        "spooky": require(`./misc_functions/Boxes/Box loot/spooky.json`),
        "mystery": require(`./misc_functions/Boxes/Box loot/mystery.json`),
        "activity": require(`./misc_functions/Boxes/Box loot/activity.json`),
        "staff": require(`./misc_functions/Boxes/Box loot/staffbox.json`),
        "king": require(`./misc_functions/Boxes/Box loot/king.json`),
        "summer": require(`./misc_functions/Boxes/Box loot/summer.json`),
        "small": require(`./misc_functions/Boxes/Box loot/small.json`),
        "bag": require(`./misc_functions/Boxes/Box loot/bag.json`),
        "present": require(`./misc_functions/Boxes/Box loot/present.json`),
        "mega": require(`./misc_functions/Boxes/Box loot/mega.json`),
        "easter": require(`./misc_functions/Boxes/Box loot/easter.json`),
        "myth": require(`./misc_functions/Boxes/Box loot/myth.json`),
        "seasonal_winner": require(`./misc_functions/Boxes/Box loot/seasonalWinner.json`),
        "treasure": require(`./misc_functions/Boxes/Box loot/treasure.json`),
        "prestige": require(`./misc_functions/Boxes/Box loot/prestige.json`),
    }

    return object[key]
}

/**
 * 
 * @param {number} time Time left for the cooldown (in Milliseconds & above 0)
 * @returns {string} String display for the cooldowns
 */
function calcCooldown(time) {
    if (time <= 0) return `Time parameter has to be above 0`
    let timeRounded = Math.round(time / 1000);
    let d = 0, h = 0, m = 0, s = 0;
    let finalString = ``;
    //Days
    if (timeRounded >= 86400) {
        d = Math.floor(timeRounded / 86400)
        timeRounded = timeRounded % 86400
        finalString += `${d} дн. `
    } 

    //Hours
    if (timeRounded >= 3600) {
        h = Math.floor(timeRounded / 3600)
        timeRounded = timeRounded % 3600
        finalString += `${h} ч. `
    } 

    //Minutes
    if (timeRounded >= 60) {
        m = Math.floor(timeRounded / 60)
        timeRounded = timeRounded % 60
        finalString += `${m} мин. `
    } 

    //Seconds
    if (timeRounded > 0) {
        s = Math.floor(timeRounded)
        timeRounded = timeRounded - s
        finalString += `${s} сек.`
    } 

    return finalString
}

module.exports = {
    toOrdinalSuffix,
    suffix,
    gameConstructor,
    calcActLevel,
    getLevel,
    permToName,
    isURL,
    toggleOnOff,
    replaceTrueFalse,
    defaultShop,
    secondPage,
    achievementStats,
    found,
    daysOfWeek,
    rankName,
    getRes,
    changeProperty,
    getProperty,
    monthName,
    divideOnPages,
    convertToRoman,
    getApplicationTemplates,
    getPluginName,
    checkPlugin,
    createBingoProfile,
    getPerkName,
    getUpgradeName,
    mentionCommand,
    getCooldownUsage,
    getBoxLoot,
    calcCooldown
}