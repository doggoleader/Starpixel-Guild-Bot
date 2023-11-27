const { GuildMember, Client, EmbedBuilder } = require("discord.js");
const { User } = require("../../../schemas/userdata");

const { GuildProgress } = require("./progress_class");
const { rankName, calcActLevel, convertToRoman, getPerkName, getUpgradeName } = require("../../../functions");
const api = process.env.hypixel_apikey
const rolesInfo = require(`../../../discord structure/roles.json`)
const fetch = require(`node-fetch`);

/**
 * Creates information about User and gets all info from DB for Profile Info command.
 */
class UserProfile {
    /** @private */
    member;
    /** @private */
    client;
    /**
    * 
    * @param {GuildMember} member Member, who's profile you are going to check.
    * @param {import("../System/StarpixelClient").StarpixelClient} client Client class.
    */
    constructor(member, client) {
        /** @private */
        this.member = member;
        /** @private */
        this.client = client;
    }
    /** 
     * @returns MongoDB User Data profile
    */
    async getUserData() {
        const userData = await User.findOne({ userid: this.member.user.id })
        return userData
    }
    /**
     * 
     * @returns The object, including information for StringSelectMenuBuilder and Embed with information.
     * General information
     */
    async getGeneral() {
        const userData = await this.getUserData()

        const users = await User.find()
        let sort1 = users.sort((a, b) => {
            return b.exp - a.exp
        })
        let sorts = sort1.sort((a, b) => {
            return b.level - a.level
        })
        let rank = sorts.findIndex(i => i.userid == userData.userid) + 1
        let neededXP = 5 * (Math.pow(userData.level, 2)) + (50 * userData.level) + 100;
        let part1, part2
        if (userData.exp >= 1000) {
            part1 = (userData.exp / 1000).toFixed(1) + `k`
        } else part1 = userData.exp
        if (neededXP >= 1000) {
            part2 = (neededXP / 1000).toFixed(1) + `k`
        } else part2 = neededXP


        const embed = new EmbedBuilder()
            .setColor(Number(client.information.bot_color))
            .setTitle(`Профиль пользователя ${this.member.user.username}`)
            .setThumbnail(this.member.user.displayAvatarURL())
            .setTimestamp(Date.now())
            .setFooter({ text: "Актуально на" })
            .setDescription(
                `## Основное
\`Ранг в гильдии\` - ${rankName(userData.rank_number)}
\`Румбики\` - ${userData.rumbik}<:Rumbik:883638847056003072>
\`Опыт рангов\` - ${userData.rank}💠
\`Посещено совместных игр\` - ${userData.visited_games} игр
\`Опыта гильдии сохранено\` - ${userData.gexp} GEXP
\`Билеты\` - ${userData.tickets}🏷
\`Медаль 🥇\` - ${userData.medal_1} шт.
\`Медаль 🥈\` - ${userData.medal_2} шт.
\`Медаль 🥉\` - ${userData.medal_3} шт.
\`Собрано звёздных комплектов\` - ${userData.starway.current} ✨
\`Неполученных предметов\` - ${userData.stacked_items.length} шт.
\`Сброшен профиль\` - ${userData.times_reset} раз

## Уровень активности
\`Прогресс\` - ${part1}/${part2}🌀
\`Уровень\` - ${userData.level}
\`Всего опыта\` - ${calcActLevel(0, userData.level, userData.exp)}🌀
\`Позиция\` - #${rank}`)

        return {
            label: "Основное",
            description: "Основная информация о вашем профиле",
            emoji: "📃",
            value: "main",
            embed: embed
        }
    }
    /**
     * @deprecated Since v2.18.0 - Everything now shows on Main Page of Profile Info
     * @returns The object, including information for StringSelectMenuBuilder and Embed with information. 
     * Activity Experience & Levels
     */
    async getActivityExp() {
        const userData = await this.getUserData()
        const users = await User.find()
        let sort1 = users.sort((a, b) => {
            return b.exp - a.exp
        })
        let sorts = sort1.sort((a, b) => {
            return b.level - a.level
        })
        let rank = sorts.findIndex(i => i.userid == userData.userid) + 1
        let neededXP = 5 * (Math.pow(userData.level, 2)) + (50 * userData.level) + 100;
        let part1, part2
        if (userData.exp >= 1000) {
            part1 = (userData.exp / 1000).toFixed(1) + `k`
        } else part1 = userData.exp
        if (neededXP >= 1000) {
            part2 = (neededXP / 1000).toFixed(1) + `k`
        } else part2 = neededXP
        const embed = new EmbedBuilder()
            .setColor(Number(client.information.bot_color))
            .setTitle(`Профиль пользователя ${this.member.user.username}`)
            .setThumbnail(this.member.user.displayAvatarURL())
            .setTimestamp(Date.now())
            .setFooter({ text: "Актуально на" })
            .setDescription(`## Уровень активности
\`Прогресс\` - ${part1}/${part2}🌀
\`Уровень\` - ${userData.level}
\`Всего опыта\` - ${calcActLevel(0, userData.level, userData.exp)}🌀
\`Позиция\` - #${rank}`)

        return {
            label: "Уровень активности",
            description: "Информация о вашем уровне активности",
            emoji: "🌀",
            value: "act",
            embed: embed
        }

    }
    /**
     * 
     * @returns The object, including information for StringSelectMenuBuilder and Embed with information.
     * User Progress in the guild.
     */
    async getProgress() {
        const progress = new GuildProgress(this.member, this.client)
        let max_points = await progress.getMaxPoints()
        let current = await progress.getAndUpdateUserPoints();
        const p_file = progress.getProgressFile();

        let sum = 0;
        const map = await current.map((item, i) => {
            let file_info = p_file.requirements.find(it => it.name == item.name)
            let name = progress.getTaskKeyValue(item.name);
            let percentage = 0;
            let max = 0;
            if (file_info.array !== undefined) {
                max = (file_info.array.length / file_info.point_every) * file_info.points_per
                percentage = Math.floor(1000 * (Number(item.sum) / (file_info.array.length / file_info.point_every * file_info.points_per))) / 10
            }
            else if (file_info.total !== undefined) {
                max = (file_info.total / file_info.point_every) * file_info.points_per
                percentage = Math.floor(1000 * (Number(item.sum) / (file_info.total / file_info.point_every * file_info.points_per))) / 10
            }

            sum += Number(item.sum)
            return `**${++i}.** ${name} - ${Number(item.sum)}/${max} очков (${percentage}%)`
        })

        let totalPercentage = Math.round(1000 * (sum / max_points)) / 10
        const embed = new EmbedBuilder()
            .setColor(Number(client.information.bot_color))
            .setTitle(`Профиль пользователя ${this.member.user.username}`)
            .setThumbnail(this.member.user.displayAvatarURL())
            .setTimestamp(Date.now())
            .setFooter({ text: "Актуально на" })
            .setDescription(
                `## Прогресс в гильдии
${map.join(`\n`)}
**ИТОГО - ${sum}/${max_points} (${totalPercentage}%)**

Для получения подробной информации нажмите на кнопку ниже!
`)

        return {
            label: "Прогресс в гильдии",
            description: "Информация о прогрессе в гильдии за каждое задание и итого",
            emoji: "🌠",
            value: "progress",
            embed: embed
        }

    }

    /**
     * 
     * @returns The object, including information for StringSelectMenuBuilder and Embed with information.
     * User Progress in the guild.
     */
    async getProgressInformation() {
        const userData = await this.getUserData()
        const progress = new GuildProgress(this.member, this.client)
        let max_points = await progress.getMaxPoints()
        let current = await progress.getAndUpdateUserPoints();
        const p_file = progress.getProgressFile();

        let sum = 0;
        let leftRoles = [], leftPerks = [], leftUpgrades = []
        const map = await current.map(async (item, i) => {
            let file_info = p_file.requirements.find(it => it.name == item.name)
            let name = progress.getTaskKeyValue(item.name);
            let percentage = 0;
            let max = 0;
            let task = progress.getTaskDescription(item.name)
            sum += Number(item.sum)
            if (file_info.array !== undefined) {
                max = (file_info.array.length / file_info.point_every) * file_info.points_per
                percentage = Math.floor(1000 * (Number(item.sum) / (file_info.array.length / file_info.point_every * file_info.points_per))) / 10
                let notClaimed = []
                for (let it of file_info.array) {
                    switch (file_info.name) {
                        case `ALL_ROLES`: {
                            if (!userData.progress.items.find(it2 => it2.name == item.name).claimed_items.includes(it)) {
                                notClaimed.push(` - <@&${it}>`)
                                leftRoles.push(`- <@&${it}>`)
                            }
                        }
                            break;
                        case `MAXED_PERKS`: {
                            if (!userData.progress.items.find(it2 => it2.name == item.name).claimed_items.includes(it)) {
                                notClaimed.push(` - ${getPerkName(it)}`)
                                leftPerks.push(`- ${getPerkName(it)}`)
                            }
                        }
                            break;
                        case `MAXED_UPGRADES`: {
                            if (!userData.progress.items.find(it2 => it2.name == item.name).claimed_items.includes(it)) {
                                notClaimed.push(` - ${getUpgradeName(it)}`)
                                leftUpgrades.push(`- ${getUpgradeName(it)}`)
                            }
                        }
                            break;

                        default:
                            break;
                    }
                }
                return `**${++i}.** ${name} - ${Number(item.sum)}/${max} очков (${percentage}%)
- ${task}
 - ${notClaimed.length <= 0 ? `**Задание успешно выполнено!** :tada:` : `Осталось выполнить: ${notClaimed.length}`}`
            }
            else if (file_info.total !== undefined) {
                max = (file_info.total / file_info.point_every) * file_info.points_per
                percentage = Math.floor(1000 * (Number(item.sum) / (file_info.total / file_info.point_every * file_info.points_per))) / 10
                const dbInfo = userData.progress.items.find(it => it.name == item.name)
                let progress = ``
                if (!dbInfo) progress = `???/${file_info.total}`
                else {
                    if (dbInfo.max_items !== undefined) {
                        progress = `${dbInfo.max_items >= file_info.total ? `${file_info.total}/${file_info.total} **Задание успешно выполнено!** :tada:` : `${dbInfo.max_items}/${file_info.total}`}`
                    } else if (dbInfo.total_items !== undefined) {
                        progress = `${dbInfo.total_items >= file_info.total ? `${file_info.total}/${file_info.total} **Задание успешно выполнено!** :tada:` : `${dbInfo.total_items}/${file_info.total}`}`
                    }
                }
                return `**${++i}.** ${name} - ${Number(item.sum)}/${max} очков (${percentage}%)
- ${task}
 - Прогресс: ${progress}`
            }

        })

        const mapProm = await Promise.all(map)

        let totalPercentage = Math.round(1000 * (sum / max_points)) / 10
        const embed = new EmbedBuilder()
            .setColor(Number(client.information.bot_color))
            .setTitle(`Профиль пользователя ${this.member.user.username}`)
            .setThumbnail(this.member.user.displayAvatarURL())
            .setTimestamp(Date.now())
            .setFooter({ text: "Актуально на" })
            .setDescription(
                `## Прогресс в гильдии
${mapProm.join(`\n`)}
**ИТОГО - ${sum}/${max_points} очков (${totalPercentage}%)**

**Для получения дополнительной информации используйте кнопки ниже!**`)

        const unclaimedRoles = new EmbedBuilder()
            .setColor(Number(client.information.bot_color))
            .setTitle(`Профиль пользователя ${this.member.user.username}`)
            .setThumbnail(this.member.user.displayAvatarURL())
            .setTimestamp(Date.now())
            .setFooter({ text: "Актуально на" })
            .setDescription(
                `## Прогресс в гильдии
**Неполученные роли**:
${leftRoles.length <= 0 ? `Вы успешно получили все роли! :tada:` : leftRoles.join(`\n`)}

**Для получения дополнительной информации используйте кнопки ниже!**`)

        const unclaimedPerks = new EmbedBuilder()
            .setColor(Number(client.information.bot_color))
            .setTitle(`Профиль пользователя ${this.member.user.username}`)
            .setThumbnail(this.member.user.displayAvatarURL())
            .setTimestamp(Date.now())
            .setFooter({ text: "Актуально на" })
            .setDescription(
                `## Прогресс в гильдии
**Незаконченные умения**:
${leftPerks.length <= 0 ? `Вы успешно улучшили все умения! :tada:` : leftPerks.join(`\n`)}

**Для получения дополнительной информации используйте кнопки ниже!**`)

        const unclaimedUpgrades = new EmbedBuilder()
            .setColor(Number(client.information.bot_color))
            .setTitle(`Профиль пользователя ${this.member.user.username}`)
            .setThumbnail(this.member.user.displayAvatarURL())
            .setTimestamp(Date.now())
            .setFooter({ text: "Актуально на" })
            .setDescription(
                `## Прогресс в гильдии
**Незаконченные улучшения**:
${leftUpgrades.length <= 0 ? `Вы успешно прокачали все улучшения! :tada:` : leftUpgrades.join(`\n`)}

**Для получения дополнительной информации используйте кнопки ниже!**`)

        return [embed, unclaimedRoles, unclaimedPerks, unclaimedUpgrades]

    }
    /**
     * 
     * @returns The object, including information for StringSelectMenuBuilder and Embed with information.
     */
    async getElements() {
        const userData = await this.getUserData()
        const embed = new EmbedBuilder()
            .setColor(Number(client.information.bot_color))
            .setTitle(`Профиль пользователя ${this.member.user.username}`)
            .setThumbnail(this.member.user.displayAvatarURL())
            .setTimestamp(Date.now())
            .setFooter({ text: "Актуально на" })
            .setDescription(`## Навыки питомцев

__**Земля**__
\`Выращивание горных пород\` - ${userData.elements.mountains == 1 ? "Урок выучен ✅" : "Урок не выучен ❌"}
\`Быстрый рост растений\` - ${userData.elements.fast_grow == 1 ? "Урок выучен ✅" : "Урок не выучен ❌"}
\`Перемещение под землёй\` - ${userData.elements.underground == 1 ? "Урок выучен ✅" : "Урок не выучен ❌"}

__**Вода**__
\`Плавание на глубине\` - ${userData.elements.diving == 1 ? "Урок выучен ✅" : "Урок не выучен ❌"}
\`Сопротивление течениям\` - ${userData.elements.resistance == 1 ? "Урок выучен ✅" : "Урок не выучен ❌"}
\`Подводное дыхание\` - ${userData.elements.respiration == 1 ? "Урок выучен ✅" : "Урок не выучен ❌"}

__**Огонь**__
\`Защита от огня\` - ${userData.elements.fire_resistance == 1 ? "Урок выучен ✅" : "Урок не выучен ❌"}
\`Удар молнии\` - ${userData.elements.lightning == 1 ? "Урок выучен ✅" : "Урок не выучен ❌"}
\`Управление пламенем\` - ${userData.elements.flame == 1 ? "Урок выучен ✅" : "Урок не выучен ❌"}

__**Воздух**__
\`Полёт в небесах\` - ${userData.elements.flying == 1 ? "Урок выучен ✅" : "Урок не выучен ❌"}
\`Повеление ветром\` - ${userData.elements.wind == 1 ? "Урок выучен ✅" : "Урок не выучен ❌"}
\`Орлиный глаз\` - ${userData.elements.eagle_eye == 1 ? "Урок выучен ✅" : "Урок не выучен ❌"}`)

        return {
            label: "Стихии",
            description: "Информация о ваших навыках в стихиях",
            emoji: "🌊",
            value: "elem",
            embed: embed
        }

    }
    /**
     * 
     * @returns The object, including information for StringSelectMenuBuilder and Embed with information.
     */
    async getAchievements() {
        const userData = await this.getUserData()
        let n_unclaimed = []

        for (let norm of rolesInfo.achievements_normal) {
            if (!this.member.roles.cache.has(norm)) {
                n_unclaimed.push(norm)
            }
        }

        let m_unclaimed = []

        for (let myth of rolesInfo.achievements_myth) {
            if (!this.member.roles.cache.has(myth)) {
                m_unclaimed.push(myth)
            }
        }

        let n_map


        if (n_unclaimed.length <= 0) {
            n_map = `🎉 Вы выполнили все обычные достижения! Поздравляем! ✨`
        } else {
            n_map = n_unclaimed.map((norm, i) => {
                return `**${++i}.** <@&${norm}>`
            }).join(`\n`)
        }
        let m_map
        if (m_unclaimed.length <= 0) {
            m_map = `🎉 Вы выполнили все мифические достижения! Поздравляем! ✨`
        } else {
            m_map = m_unclaimed.map((myth, i) => {
                return `**${++i}.** <@&${myth}>`
            }).join(`\n`)
        }
        const embed = new EmbedBuilder()
            .setColor(Number(client.information.bot_color))
            .setTitle(`Профиль пользователя ${this.member.user.username}`)
            .setThumbnail(this.member.user.displayAvatarURL())
            .setTimestamp(Date.now())
            .setFooter({ text: "Актуально на" })
            .setDescription(`## Достижения гильдии
__**Общая информация**__
\`Обычные достижения\` - ${userData.achievements.normal}/${rolesInfo.achievements_normal.length}
\`Мифические достижения\` - ${userData.achievements.mythical}/${rolesInfo.achievements_myth.length}

__**Неполученные достижения**__
__Обычные достижения__
${n_map}

__Мифические достижения__
${m_map}`)

        return {
            label: "Достижения гильдии",
            description: "Информация о ваших достижениях",
            emoji: "🏅",
            value: "achievements",
            embed: embed
        }

    }
    /**
     * 
     * @returns The object, including information for StringSelectMenuBuilder and Embed with information.
     */
    async getPerks() {
        const userData = await this.getUserData()
        const embed = new EmbedBuilder()
            .setColor(Number(client.information.bot_color))
            .setTitle(`Профиль пользователя ${this.member.user.username}`)
            .setThumbnail(this.member.user.displayAvatarURL())
            .setTimestamp(Date.now())
            .setFooter({ text: "Актуально на" })
            .setDescription(`## Умения
\`🔺 Повышение опыта рангов\` - ${userData.perks.rank_boost}/6
\`🔻 Скидка в королевском магазине\` - ${userData.perks.king_discount}/4
\`🔻 Скидка в магазине активности\` - ${userData.perks.act_discount}/3
\`🔻 Скидка в обычном магазине гильдии\` - ${userData.perks.shop_discount}/4
\`🕒 Увеличение времени действия временных предметов\` - ${userData.perks.temp_items}/1
\`💰 Возможность продавать предметы из профиля\` - ${userData.perks.sell_items}/1
\`🏷️ Уменьшение опыта гильдии для получения билета\` - ${userData.perks.ticket_discount}/5
\`✨ Изменение предметов\` - ${userData.perks.change_items}/1
\`📦 Сохранение дубликатов из коробок в инвентаре\` - ${userData.perks.store_items}/1
\`🕒 Уменьшение перезарядки\` - ${userData.perks.decrease_cooldowns}/5

## Улучшения
\`Размер инвентаря\`: ${userData.upgrades.inventory_size} (уровень ${convertToRoman(userData.upgrades.inventory_size_tier)})
\`Максимальное количество покупок\`: ${userData.upgrades.max_purchases} (уровень ${convertToRoman(userData.upgrades.max_purchases_tier)})
\`Максимальное количество продаж\`: ${userData.upgrades.max_sells} (уровень ${convertToRoman(userData.upgrades.max_sells_tier)})
\`Банковский аккаунт\`: ${userData.bank.account_type}
\`Количество заданий для ветеранов\`: ${userData.upgrades.veterans_quests} (уровень ${convertToRoman(userData.upgrades.veterans_quests_tier)})`)

        return {
            label: "Умения и улучшения",
            description: "Информация о ваших умениях и улучшениях в гильдии",
            emoji: "📍",
            value: "perks",
            embed: embed
        }

    }
    /**
     * @deprecated Since v2.18.0 - Everything now shows on Perks & Upgrades Page.
     * @returns The object, including information for StringSelectMenuBuilder and Embed with information.
     */
    async getUpgrades() {
        const userData = await this.getUserData()
        const embed = new EmbedBuilder()
            .setColor(Number(client.information.bot_color))
            .setTitle(`Профиль пользователя ${this.member.user.username}`)
            .setThumbnail(this.member.user.displayAvatarURL())
            .setTimestamp(Date.now())
            .setFooter({ text: "Актуально на" })
            .setDescription(`## Улучшения

**Размер инвентаря**: ${userData.upgrades.inventory_size} (уровень ${convertToRoman(userData.upgrades.inventory_size_tier)})
**Максимальное количество покупок**: ${userData.upgrades.max_purchases} (уровень ${convertToRoman(userData.upgrades.max_purchases_tier)})
**Максимальное количество продаж**: ${userData.upgrades.max_sells} (уровень ${convertToRoman(userData.upgrades.max_sells_tier)})
**Банковский аккаунт**: ${userData.bank.account_type}`)

        return {
            label: "Улучшения",
            description: "Информация о ваших улучшениях",
            emoji: "🔹",
            value: "upgrades",
            embed: embed
        }

    }
    /**
     * 
     * @returns The object, including information for StringSelectMenuBuilder and Embed with information.
     */
    async getGexp() {
        const userData = await this.getUserData()
        let embed

        if (userData.onlinemode) {
            const response = await fetch(`https://api.hypixel.net/guild?id=5c1902fc77ce84cd430f3959`, {
                headers: {
                    "API-Key": api,
                    "Content-Type": "application/json"
                }
            })
            let json
            if (response.ok) json = await response.json()
            let gexp_nums
            let sum
            let map
            let player = await json.guild.members.find(member => member.uuid == userData.uuid)
            if (!player) {
                map = `Не удалось найти пользователя в гильдии!`
                sum = 0
            } else {
                gexp_nums = Object.entries(player.expHistory)
                sum = 0
                map = gexp_nums.map(([key, value]) => {
                    sum += value
                    let sp = key.split(`-`)
                    let date = `${sp[2]}.${sp[1]}.${sp[0]}`
                    return `• \`${date}\` - ${value} GEXP`
                }).join(`\n`)
            }



            embed = new EmbedBuilder()
                .setColor(Number(client.information.bot_color))
                .setTitle(`Профиль пользователя ${this.member.user.username}`)
                .setThumbnail(this.member.user.displayAvatarURL())
                .setTimestamp(Date.now())
                .setFooter({ text: "Актуально на" })
                .setDescription(`## Опыт гильдии участника
Никнейм: \`${userData.nickname}\`
__**Опыт гильдии**__:
${map}

**Опыта гильдии за последние 7 дней**: ${sum} GEXP`)
        } else {
            embed = new EmbedBuilder()
                .setColor(Number(client.information.bot_color))
                .setTitle(`Профиль пользователя ${this.member.user.username}`)
                .setThumbnail(this.member.user.displayAvatarURL())
                .setTimestamp(Date.now())
                .setFooter({ text: "Актуально на" })
                .setDescription(`## Опыт гильдии участника
Никнейм: \`${userData.nickname}\`
__**Опыт гильдии**__:
\`Нелицензированный аккаунт!\``)
        }

        return {
            label: "Опыт гильдии",
            description: "Ваш опыт гильдии за последние 7 дней",
            emoji: "🔰",
            value: "gexp",
            embed: embed
        }

    }
    /**
     * 
     * @returns The object, including information for StringSelectMenuBuilder and Embed with information.
     */
    async getQuests() {
        const userData = await this.getUserData()
        let total = userData.quests.seasonal.stats.hw.total + userData.quests.seasonal.stats.ny.total + userData.quests.seasonal.stats.ea.total + userData.quests.seasonal.stats.su.total
        const embed = new EmbedBuilder()
            .setColor(Number(client.information.bot_color))
            .setTitle(`Профиль пользователя ${this.member.user.username}`)
            .setThumbnail(this.member.user.displayAvatarURL())
            .setTimestamp(Date.now())
            .setFooter({ text: "Актуально на" })
            .setDescription(`## Квесты и марафоны
__**Марафон**__
\`Выполнено стадий\` - ${userData.quests.marathon.stats.total_stages}
\`Пройдено раз\` - ${userData.quests.marathon.stats.total_mar}

__**Задания для ветеранов**__
\`Выполнено заданий\` - ${userData.quests.veterans.stats.total}

__**Квесты "Новое начало"**__
\`Выполнено заданий\` - ${userData.quests.kings.stats.total}/4\\*
\\*Задание с достижениями не учитывается

__**Задания Марса**__
\`Выполнено заданий\` - ${userData.quests.mars.stats.total}

__**Сезонное**__
\`Хэллоуинские квесты\` - ${userData.quests.seasonal.stats.hw.total}
\`Новогодние квесты\` - ${userData.quests.seasonal.stats.ny.total}
\`Пасхальные квесты\` - ${userData.quests.seasonal.stats.ea.total}
\`Летние квесты\` - ${userData.quests.seasonal.stats.su.total}
__**\`Всего\`**__ - ${total}`)

        return {
            label: "Квесты и марафон",
            description: "Статистика ваших квестов/заданий/этапов марафона",
            emoji: "💪",
            value: "quests",
            embed: embed
        }

    }
    /**
     * 
     * @returns The object, including information for StringSelectMenuBuilder and Embed with information.
     */
    async getShops() {
        const userData = await this.getUserData()
        const embed = new EmbedBuilder()
            .setColor(Number(client.information.bot_color))
            .setTitle(`Профиль пользователя ${this.member.user.username}`)
            .setThumbnail(this.member.user.displayAvatarURL())
            .setTimestamp(Date.now())
            .setFooter({ text: "Актуально на" })
            .setDescription(`## Статистика магазинов гильдии
\`Куплено предметов\` - ${userData.buys.normal + userData.buys.king + userData.buys.activity} шт.
\`Куплено предметов в обычном магазине\` - ${userData.buys.normal} шт.
\`Куплено предметов в королевском магазине\` - ${userData.buys.king} шт.
\`Куплено предметов в магазине активности\` - ${userData.buys.activity} шт.
\`Потрачено румбиков\` - ${userData.buys.total_sum} <:Rumbik:883638847056003072>
\`Потрачено билетов\` - ${userData.buys.total_tickets} 🏷

\`Всего продано предметов\` - ${userData.sell.constellation + userData.sell.comet + userData.sell.other} шт.
\`Продано созвездий\` - ${userData.sell.constellation} шт.
\`Продано комет\` - ${userData.sell.comet} шт.
\`Продано других предметов\` - ${userData.sell.other} шт.
\`Продано предметов на сумму\` - ${userData.sell.total_sum} <:Rumbik:883638847056003072>`)

        return {
            label: "Магазины гильдии",
            description: "Статистика покупок/продаж в магазинах",
            emoji: "💰",
            value: "shops",
            embed: embed
        }

    }
    /**
     * 
     * @returns The object, including information for StringSelectMenuBuilder and Embed with information.
     */
    async getMultipliers() {
        const userData = await this.getUserData()
        const embed = new EmbedBuilder()
            .setColor(Number(client.information.bot_color))
            .setTitle(`Профиль пользователя ${this.member.user.username}`)
            .setThumbnail(this.member.user.displayAvatarURL())
            .setTimestamp(Date.now())
            .setFooter({ text: "Актуально на" })
            .setDescription(`## Множители
\`Множитель опыта активности\` - ${userData.pers_act_boost}x
\`Множитель опыта рангов\` - ${userData.pers_rank_boost}x
\`Множитель румбиков\` - ${userData.pers_rumb_boost}x
\`Множитель цен товаров в стандартном магазине\` - ${userData.shop_costs}x
\`Множитель цен товаров в магазине активности\` - ${userData.act_costs}x
\`Множитель цен товаров в королевском магазине\` - ${userData.king_costs}x

## Шансы на редкости
\`Обычные предметы\` - ${userData.box_chances.common}x
\`Необычные предметы\` - ${userData.box_chances.uncommon}x
\`Редкие предметы\` - ${userData.box_chances.rare}x
\`Эпические предметы\` - ${userData.box_chances.epic}x
\`Легендарные предметы\` - ${userData.box_chances.legendary}x
\`Мифические предметы\` - ${userData.box_chances.mythical}x
\`Ультраредкие предметы\` - ${userData.box_chances.RNG}x`)

        return {
            label: "Множители и шансы",
            description: "Информация о ваших множителях и шансах",
            emoji: "🔺",
            value: "boosters",
            embed: embed
        }

    }
    /**
     * 
     * @returns The object, including information for StringSelectMenuBuilder and Embed with information.
     */
    async getCustomColor() {
        const userData = await this.getUserData()
        const guild = await this.client.guilds.fetch(userData.guildid);
        let colorRole = await guild.roles.fetch(userData.custom_color?.role ? userData.custom_color.role : `1`)
        if (!colorRole) colorRole = `Не создана`
        const embed = new EmbedBuilder()
            .setColor(Number(client.information.bot_color))
            .setTitle(`Профиль пользователя ${this.member.user.username}`)
            .setThumbnail(this.member.user.displayAvatarURL())
            .setTimestamp(Date.now())
            .setFooter({ text: "Актуально на" })
            .setDescription(`## Пользовательский цвет
\`Наличие\` - ${userData.custom_color.created ? `Создан` : `Не создан`}
\`Цветовой код\` - ${userData.custom_color?.hex ? userData.custom_color?.hex : `Цветовой код отсутствует`}
\`Имя роли\` - ${userData.custom_color?.custom_name ? userData.custom_color?.custom_name : `ЛИЧНЫЙ ЦВЕТ`} 
\`Роль\` - ${colorRole}`)

        return {
            label: "Пользовательский цвет",
            description: "Информация о вашем пользовательском цвете",
            emoji: "🟣",
            value: "colors",
            embed: embed
        }

    }
    /**
     * @deprecated Since v2.18.0. Everything now shows in Multipliers Menu.
     * @returns The object, including information for StringSelectMenuBuilder and Embed with information.
     */
    async getChances() {
        const userData = await this.getUserData()
        const embed = new EmbedBuilder()
            .setColor(Number(client.information.bot_color))
            .setTitle(`Профиль пользователя ${this.member.user.username}`)
            .setThumbnail(this.member.user.displayAvatarURL())
            .setTimestamp(Date.now())
            .setFooter({ text: "Актуально на" })
            .setDescription(`## Шансы на редкости
\`Обычные предметы\` - ${userData.box_chances.common}x
\`Необычные предметы\` - ${userData.box_chances.uncommon}x
\`Редкие предметы\` - ${userData.box_chances.rare}x
\`Эпические предметы\` - ${userData.box_chances.epic}x
\`Легендарные предметы\` - ${userData.box_chances.legendary}x
\`Мифические предметы\` - ${userData.box_chances.mythical}x
\`Ультраредкие предметы\` - ${userData.box_chances.RNG}x`)

        return {
            label: "Шансы на редкости",
            description: "Ваши шансы на определённую редкость в коробках",
            emoji: "🎱",
            value: "chances",
            embed: embed
        }

    }
    /**
     * 
     * @returns The object, including information for StringSelectMenuBuilder and Embed with information.
     */
    async getAboutMember() {
        const userData = await this.getUserData()
        let day
        let month
        if (userData.birthday.day < 10) day = `0${userData.birthday.day}`
        else day = `${userData.birthday.day}`

        if (userData.birthday.month == 1) month = `января`
        else if (userData.birthday.month == 2) month = `февраля`
        else if (userData.birthday.month == 3) month = `марта`
        else if (userData.birthday.month == 4) month = `апреля`
        else if (userData.birthday.month == 5) month = `мая`
        else if (userData.birthday.month == 6) month = `июня`
        else if (userData.birthday.month == 7) month = `июля`
        else if (userData.birthday.month == 8) month = `августа`
        else if (userData.birthday.month == 9) month = `сентября`
        else if (userData.birthday.month == 10) month = `октября`
        else if (userData.birthday.month == 11) month = `ноября`
        else if (userData.birthday.month == 12) month = `декабря`

        let bday = `${day} ${month} ${userData.birthday.year}`
        let timestamp = `<t:${Math.round(userData.joinedGuild / 1000)}:f>`
        const embed = new EmbedBuilder()
            .setColor(Number(client.information.bot_color))
            .setTitle(`Профиль пользователя ${this.member.user.username}`)
            .setThumbnail(this.member.user.displayAvatarURL())
            .setTimestamp(Date.now())
            .setFooter({ text: "Актуально на" })
            .setDescription(`## Информация об участнике
\`Имя\` - ${userData.displayname.name}
\`Возраст\` - ${userData.age} лет
\`Minecraft Nickname\` - \`${userData.nickname ? userData.nickname : "Нелицензированный аккаунт!"}\`
\`Дата вступления\` - ${timestamp}
\`День рождения\` - ${bday}`)

        return {
            label: "Об участнике",
            description: "Основная информация об участнике гильдии",
            emoji: "❔",
            value: "about",
            embed: embed
        }

    }
    /**
     * 
     * @returns Array of all data about user profile (including informations for select menus and embeds)
     */
    async getAllProfile() {
        const general = await this.getGeneral()
        const progress = await this.getProgress()
        const elems = await this.getElements()
        const achs = await this.getAchievements()
        const perks = await this.getPerks()
        const gexp = await this.getGexp()
        const quests = await this.getQuests()
        const shops = await this.getShops()
        const mults = await this.getMultipliers()
        const color = await this.getCustomColor()
        const about = await this.getAboutMember()

        return [general, progress, elems, achs, perks, gexp, quests, shops, mults, color, about]
    }
}


module.exports = {
    UserProfile
}