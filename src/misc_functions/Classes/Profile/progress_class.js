const { GuildMember, Client } = require("discord.js");
const { User } = require("../../../schemas/userdata");
const { calcActLevel, getLevel } = require("../../../functions");

/**
 * Class for checking progress of members in Starpixel Guild.
 */
class GuildProgress {
    /** @private */
    member;
    /** @private */
    progress_file;
    /** @private */
    client;
    /**
     * 
     * @param {GuildMember} member Member, who's progress you are going to check.
     * @param {Client} client Client class.
     */
    constructor(member, client) {
        /** @private */
        this.member = member;
        /** @private */
        this.client = client;
        /** @private */
        this.progress_file = require(`../../../jsons/ProgressiveLevels.json`);
    }
    /**
     * 
     * @returns File which includes all tasks required to complete to progress in the guild.
     */
    getProgressFile() {
        return this.progress_file;
    }
    /**
     * 
     * @returns The max number of points which can be obtained.
     */
    getMaxPoints() {
        const progress = this.progress_file
        let sum_points = 0;
        progress.requirements.forEach(async it => {
            if (it?.array !== undefined) {
                let toAdd = (it.array.length / it.point_every) * it.points_per
                sum_points += toAdd
            } else if (it?.total !== undefined) {
                let toAdd = (it.total / it.point_every) * it.points_per
                sum_points += toAdd
            }
        })

        return sum_points;
    }
    /**
     * 
     * @param {String} key Task developer key, required for getting its String name
     * @returns Name of the key
     */
    getTaskKeyValue(key) {
        const tasks = {
            "ALL_ROLES": "Роли в гильдии",
            "RUMBIKS_TOTAL": "Количество заработанных румбиков",
            "ACT_LEVEL": "Уровень активности",
            "HIGHEST_RANK": "Ранг в гильдии",
            "TICKETS_TOTAL": "Количество заработанных билетов",
            "MEDALS_1": "Медали за 1-е место",
            "MEDALS_2": "Медали за 2-е место",
            "MEDALS_3": "Медали за 3-е место",
            "MAXED_PERKS": "Полностью улучшенные умения",
            "MAXED_UPGRADES": "Полностью прокаченные улучшения",
            "GG_REWARDS": "Награды за совместные игры",
            "MARS": "Задания Марса",
            "VETERANS": "Задания для ветеранов",
            "MARATHON": "Выполнение марафона",
            "NEW_START": "Задания из нового начала",
            "STARWAY": "Звёздный путь",
            "SUBS": "Наивысший уровень подписки",
            "COSMETIC_COLORS": "Косметические цвета",
            "COSMETIC_SYMBOLS": "Косметические значки",
            "COSMETIC_FRAMES": "Косметические рамки",
            "COSMETIC_SUFFIXES": "Косметические постфиксы",
            "COSMETIC_RANKS": "Косметические значки ранга",

        }
        return tasks[key]
    }
    /**
     * 
     * @param {String} key Task developer key, required for getting its String name
     * @returns Name of the key
     */
    getTaskDescription(key) {
        let file = this.progress_file;
        const tasks = {
            "ALL_ROLES": "Найти хотя бы раз следующие роли",
            "RUMBIKS_TOTAL": `Заработать за всё время ${file.requirements.find(f => f.name == "RUMBIKS_TOTAL").total} румбиков`,
            "ACT_LEVEL": `Достичь ${file.requirements.find(f => f.name == "ACT_LEVEL").total} уровень активности`,
            "HIGHEST_RANK": "Достигните наивысшего ранга в гильдии",
            "TICKETS_TOTAL": `Заработать за всё время ${file.requirements.find(f => f.name == "TICKETS_TOTAL").total} билетов`,
            "MEDALS_1": `Заработать за всё время ${file.requirements.find(f => f.name == "MEDALS_1").total} медалей за 1-е место`,
            "MEDALS_2": `Заработать за всё время ${file.requirements.find(f => f.name == "MEDALS_2").total} медалей за 2-е место`,
            "MEDALS_3": `Заработать за всё время ${file.requirements.find(f => f.name == "MEDALS_3").total} медалей за 3-е место`,
            "MAXED_PERKS": "Полностью улучшить все умения",
            "MAXED_UPGRADES": "Полностью прокачать все улучшения",
            "GG_REWARDS": "Получить все награды за посещение совместных игр",
            "MARS": `Выполнить ${file.requirements.find(f => f.name == "MARS").total} заданий Марса`,
            "VETERANS": `Выполнить ${file.requirements.find(f => f.name == "VETERANS").total} заданий для ветеранов`,
            "MARATHON": `Завершить марафон ${file.requirements.find(f => f.name == "MARATHON").total} раз`,
            "NEW_START": "Выполнить все задания из Нового начала",
            "STARWAY": "Завершить звёздный путь",
            "SUBS": "Получить подписку наивысшего уровня хотя бы раз",
            "COSMETIC_COLORS": `Иметь в инвентаре все ${file.requirements.find(f => f.name == "COSMETIC_COLORS").total} стандартных цвета`,
            "COSMETIC_SYMBOLS": `Иметь в инвентаре ${file.requirements.find(f => f.name == "COSMETIC_SYMBOLS").total} косметических значков`,
            "COSMETIC_FRAMES": `Иметь в инвентаре ${file.requirements.find(f => f.name == "COSMETIC_FRAMES").total} косметических рамок`,
            "COSMETIC_SUFFIXES": `Иметь в инвентаре ${file.requirements.find(f => f.name == "COSMETIC_SUFFIXES").total} косметических постфиксов`,
            "COSMETIC_RANKS": `Иметь в инвентаре ${file.requirements.find(f => f.name == "COSMETIC_RANKS").total} косметических значков ранга`,
        }
        return tasks[key]
    }
    /**
     * @returns The current amount of points which user has obtained per task.
     */
    async getAndUpdateUserPoints() {
        const userData = await User.findOne({ userid: this.member.user.id })
        if (!userData) return null;
        const progress = this.progress_file
        let tasks = [];

        for (let req of progress.requirements) {
            let taskData = await userData.progress.items.find(it => it.name == req.name)
            let sum = 0
            switch (req.name) {
                case 'ALL_ROLES': {
                    if (!taskData) {
                        userData.progress.items.push({
                            name: req.name,
                            claimed_items: []
                        })
                        taskData = await userData.progress.items.find(it => it.name == req.name)
                    }

                    const m_roles = this.member.roles;
                    for (let role of req.array) {
                        if (m_roles.cache.has(role)) {
                            if (!taskData.claimed_items.includes(role)) {
                                taskData.claimed_items.push(role)
                            }
                        }
                    }

                    sum = taskData.claimed_items.length < req.array.length ? ((taskData.claimed_items.length / req.point_every) * req.points_per).toFixed(1) : ((req.array.length / req.point_every) * req.points_per).toFixed(1)
                    tasks.push(
                        {
                            name: req.name,
                            sum: sum
                        }
                    )
                }
                    break;
                case 'RUMBIKS_TOTAL': {
                    if (!taskData) {
                        userData.progress.items.push({
                            name: req.name,
                            total_items: userData.rumbik
                        })
                        taskData = await userData.progress.items.find(it => it.name == req.name)
                    }
                    sum = taskData.total_items < req.total ? ((taskData.total_items / req.point_every) * req.points_per).toFixed(1) : ((req.total / req.point_every) * req.points_per).toFixed(1)
                    tasks.push(
                        {
                            name: req.name,
                            sum: sum
                        }
                    )
                }
                    break;
                case 'ACT_LEVEL': {
                    let totalExp = calcActLevel(0, userData.level, userData.exp)
                    if (!taskData) {

                        userData.progress.items.push({
                            name: req.name,
                            max_items: getLevel(totalExp)[0]
                        })
                        taskData = await userData.progress.items.find(it => it.name == req.name)
                    }
                    let cur = getLevel(totalExp)[0]
                    if (taskData.max_items < cur) taskData.max_items = cur
                    sum = taskData.max_items < req.total ? ((taskData.max_items / req.point_every) * req.points_per).toFixed(1) : ((req.total / req.point_every) * req.points_per).toFixed(1)
                    tasks.push(
                        {
                            name: req.name,
                            sum: sum
                        }
                    )
                }
                    break;
                case 'HIGHEST_RANK': {
                    if (!taskData) {
                        userData.progress.items.push({
                            name: req.name,
                            max_items: userData.rank_number
                        })
                        taskData = await userData.progress.items.find(it => it.name == req.name)
                    }
                    let cur = userData.rank_number
                    if (taskData.max_items < cur) taskData.max_items = cur
                    sum = taskData.max_items < req.total ? ((taskData.max_items / req.point_every) * req.points_per).toFixed(1) : ((req.total / req.point_every) * req.points_per).toFixed(1)
                    tasks.push(
                        {
                            name: req.name,
                            sum: sum
                        }
                    )
                }
                    break;
                case 'TICKETS_TOTAL': {
                    if (!taskData) {
                        userData.progress.items.push({
                            name: req.name,
                            total_items: userData.tickets
                        })
                        taskData = await userData.progress.items.find(it => it.name == req.name)
                    }
                    sum = taskData.total_items < req.total ? ((taskData.total_items / req.point_every) * req.points_per).toFixed(1) : ((req.total / req.point_every) * req.points_per).toFixed(1)

                    tasks.push(
                        {
                            name: req.name,
                            sum: sum
                        }
                    )
                }
                    break;
                case 'MEDALS_1': {
                    if (!taskData) {
                        userData.progress.items.push({
                            name: req.name,
                            total_items: userData.medal_1
                        })
                        taskData = await userData.progress.items.find(it => it.name == req.name)
                    }
                    sum = taskData.total_items < req.total ? ((taskData.total_items / req.point_every) * req.points_per).toFixed(1) : ((req.total / req.point_every) * req.points_per).toFixed(1)

                    tasks.push(
                        {
                            name: req.name,
                            sum: sum
                        }
                    )
                }
                    break;
                case 'MEDALS_2': {
                    if (!taskData) {
                        userData.progress.items.push({
                            name: req.name,
                            total_items: userData.medal_2
                        })
                        taskData = await userData.progress.items.find(it => it.name == req.name)
                    }
                    sum = taskData.total_items < req.total ? ((taskData.total_items / req.point_every) * req.points_per).toFixed(1) : ((req.total / req.point_every) * req.points_per).toFixed(1)

                    tasks.push(
                        {
                            name: req.name,
                            sum: sum
                        }
                    )
                }
                    break;
                case 'MEDALS_3': {
                    if (!taskData) {
                        userData.progress.items.push({
                            name: req.name,
                            total_items: userData.medal_3
                        })
                        taskData = await userData.progress.items.find(it => it.name == req.name)
                    }
                    sum = taskData.total_items < req.total ? ((taskData.total_items / req.point_every) * req.points_per).toFixed(1) : ((req.total / req.point_every) * req.points_per).toFixed(1)

                    tasks.push(
                        {
                            name: req.name,
                            sum: sum
                        }
                    )
                }
                    break;
                case 'MAXED_PERKS': {
                    if (!taskData) {
                        userData.progress.items.push({
                            name: req.name,
                            claimed_items: []
                        })
                        taskData = await userData.progress.items.find(it => it.name == req.name)
                    }
                    for (let perk of Object.keys(userData.perks)) {
                        switch (perk) {
                            case 'rank_boost': {
                                if (userData.perks[perk] >= 6) {
                                    if (!taskData.claimed_items.includes(perk)) {
                                        taskData.claimed_items.push(perk)
                                    }
                                }
                            }
                                break;
                            case 'shop_discount': {
                                if (userData.perks[perk] >= 4) {
                                    if (!taskData.claimed_items.includes(perk)) {
                                        taskData.claimed_items.push(perk)
                                    }
                                }
                            }
                                break;
                            case 'king_discount': {
                                if (userData.perks[perk] >= 4) {
                                    if (!taskData.claimed_items.includes(perk)) {
                                        taskData.claimed_items.push(perk)
                                    }
                                }
                            }
                                break;
                            case 'act_discount': {
                                if (userData.perks[perk] >= 3) {
                                    if (!taskData.claimed_items.includes(perk)) {
                                        taskData.claimed_items.push(perk)
                                    }
                                }
                            }
                                break;
                            case 'temp_items': {
                                if (userData.perks[perk] >= 1) {
                                    if (!taskData.claimed_items.includes(perk)) {
                                        taskData.claimed_items.push(perk)
                                    }
                                }
                            }
                                break;
                            case 'sell_items': {
                                if (userData.perks[perk] >= 1) {
                                    if (!taskData.claimed_items.includes(perk)) {
                                        taskData.claimed_items.push(perk)
                                    }
                                }
                            }
                                break;
                            case 'ticket_discount': {
                                if (userData.perks[perk] >= 5) {
                                    if (!taskData.claimed_items.includes(perk)) {
                                        taskData.claimed_items.push(perk)
                                    }
                                }
                            }
                                break;
                            case 'change_items': {
                                if (userData.perks[perk] >= 1) {
                                    if (!taskData.claimed_items.includes(perk)) {
                                        taskData.claimed_items.push(perk)
                                    }
                                }
                            }
                                break;
                            case 'store_items': {
                                if (userData.perks[perk] >= 1) {
                                    if (!taskData.claimed_items.includes(perk)) {
                                        taskData.claimed_items.push(perk)
                                    }
                                }
                            }
                                break;
                            case 'decrease_cooldowns': {
                                if (userData.perks[perk] >= 5) {
                                    if (!taskData.claimed_items.includes(perk)) {
                                        taskData.claimed_items.push(perk)
                                    }
                                }
                            }
                                break;

                            default:
                                break;
                        }
                    }
                    sum = taskData.claimed_items.length < req.array.length ? ((taskData.claimed_items.length / req.point_every) * req.points_per).toFixed(1) : ((req.array.length / req.point_every) * req.points_per).toFixed(1)

                    tasks.push(
                        {
                            name: req.name,
                            sum: sum
                        }
                    )
                }
                    break;
                case 'MAXED_UPGRADES': {
                    if (!taskData) {
                        userData.progress.items.push({
                            name: req.name,
                            claimed_items: []
                        })
                        taskData = await userData.progress.items.find(it => it.name == req.name)
                    }
                    for (let upgrade of req.array) {
                        switch (upgrade) {
                            case 'inventory_size_tier': {
                                if (userData.upgrades[upgrade] >= 10) {
                                    if (!taskData.claimed_items.includes(upgrade)) {
                                        taskData.claimed_items.push(upgrade)
                                    }
                                }
                            }
                                break;
                            case 'max_purchases_tier': {
                                if (userData.upgrades[upgrade] >= 10) {
                                    if (!taskData.claimed_items.includes(upgrade)) {
                                        taskData.claimed_items.push(upgrade)
                                    }
                                }
                            }
                                break;
                            case 'max_sells_tier': {
                                if (userData.upgrades[upgrade] >= 10) {
                                    if (!taskData.claimed_items.includes(upgrade)) {
                                        taskData.claimed_items.push(upgrade)
                                    }
                                }
                            }
                                break;
                            case 'bank_account_tier': {
                                if (userData.upgrades[upgrade] >= 5) {
                                    if (!taskData.claimed_items.includes(upgrade)) {
                                        taskData.claimed_items.push(upgrade)
                                    }
                                }
                            }
                                break;
                            case 'veterans_quests_tier': {
                                if (userData.upgrades[upgrade] >= 10) {
                                    if (!taskData.claimed_items.includes(upgrade)) {
                                        taskData.claimed_items.push(upgrade)
                                    }
                                }
                            }
                                break;

                            default:
                                break;
                        }
                    }
                    sum = taskData.claimed_items.length < req.array.length ? ((taskData.claimed_items.length / req.point_every) * req.points_per).toFixed(1) : ((req.array.length / req.point_every) * req.points_per).toFixed(1)

                    tasks.push(
                        {
                            name: req.name,
                            sum: sum
                        }
                    )
                }
                    break;
                case 'GG_REWARDS': {
                    if (!taskData) {
                        userData.progress.items.push({
                            name: req.name,
                            max_items: userData.guild_games_rewards.length
                        })
                        taskData = await userData.progress.items.find(it => it.name == req.name)
                    }
                    let cur = userData.guild_games_rewards.length
                    if (taskData.max_items < cur) taskData.max_items = cur
                    sum = taskData.max_items < req.total ? ((taskData.max_items / req.point_every) * req.points_per).toFixed(1) : ((req.total / req.point_every) * req.points_per).toFixed(1)
                    tasks.push(
                        {
                            name: req.name,
                            sum: sum
                        }
                    )
                }
                    break;
                case 'MARS': {
                    if (!taskData) {
                        userData.progress.items.push({
                            name: req.name,
                            max_items: userData.quests.mars.stats.total
                        })
                        taskData = await userData.progress.items.find(it => it.name == req.name)
                    }
                    let cur = userData.quests.mars.stats.total
                    if (taskData.max_items < cur) taskData.max_items = cur
                    sum = taskData.max_items < req.total ? ((taskData.max_items / req.point_every) * req.points_per).toFixed(1) : ((req.total / req.point_every) * req.points_per).toFixed(1)

                    tasks.push(
                        {
                            name: req.name,
                            sum: sum
                        }
                    )
                }
                    break;
                case 'VETERANS': {
                    if (!taskData) {
                        userData.progress.items.push({
                            name: req.name,
                            max_items: userData.quests.veterans.stats.total
                        })
                        taskData = await userData.progress.items.find(it => it.name == req.name)
                    }
                    let cur = userData.quests.veterans.stats.total
                    if (taskData.max_items < cur) taskData.max_items = cur
                    sum = taskData.max_items < req.total ? ((taskData.max_items / req.point_every) * req.points_per).toFixed(1) : ((req.total / req.point_every) * req.points_per).toFixed(1)


                    tasks.push(
                        {
                            name: req.name,
                            sum: sum
                        }
                    )
                }
                    break;
                case 'MARATHON': {
                    if (!taskData) {
                        userData.progress.items.push({
                            name: req.name,
                            max_items: userData.quests.marathon.stats.total_mar
                        })
                        taskData = await userData.progress.items.find(it => it.name == req.name)
                    }
                    let cur = userData.quests.marathon.stats.total_mar
                    if (taskData.max_items < cur) taskData.max_items = cur
                    sum = taskData.max_items < req.total ? ((taskData.max_items / req.point_every) * req.points_per).toFixed(1) : ((req.total / req.point_every) * req.points_per).toFixed(1)


                    tasks.push(
                        {
                            name: req.name,
                            sum: sum
                        }
                    )
                }
                    break;
                case 'NEW_START': {
                    if (!taskData) {
                        userData.progress.items.push({
                            name: req.name,
                            max_items: userData.quests.kings.completed.length
                        })
                        taskData = await userData.progress.items.find(it => it.name == req.name)
                    }
                    let cur = userData.quests.kings.completed.length
                    if (taskData.max_items < cur) taskData.max_items = cur
                    sum = taskData.max_items < req.total ? ((taskData.max_items / req.point_every) * req.points_per).toFixed(1) : ((req.total / req.point_every) * req.points_per).toFixed(1)

                    tasks.push(
                        {
                            name: req.name,
                            sum: sum
                        }
                    )
                }
                    break;
                case 'STARWAY': {
                    if (!taskData) {
                        userData.progress.items.push({
                            name: req.name,
                            max_items: userData.starway.current
                        })
                        taskData = await userData.progress.items.find(it => it.name == req.name)
                    }
                    let cur = userData.starway.current
                    if (taskData.max_items < cur) taskData.max_items = cur
                    sum = taskData.max_items < req.total ? ((taskData.max_items / req.point_every) * req.points_per).toFixed(1) : ((req.total / req.point_every) * req.points_per).toFixed(1)

                    tasks.push(
                        {
                            name: req.name,
                            sum: sum
                        }
                    )
                }
                    break;
                case 'SUBS': {
                    if (!taskData) {
                        userData.progress.items.push({
                            name: req.name,
                            max_items: userData.sub_type
                        })
                        taskData = await userData.progress.items.find(it => it.name == req.name)
                    }
                    let cur = userData.sub_type
                    if (taskData.max_items < cur) taskData.max_items = cur
                    sum = taskData.max_items < req.total ? ((taskData.max_items / req.point_every) * req.points_per).toFixed(1) : ((req.total / req.point_every) * req.points_per).toFixed(1)

                    tasks.push(
                        {
                            name: req.name,
                            sum: sum
                        }
                    )
                }
                    break;
                case 'COSMETIC_COLORS': {
                    if (!taskData) {
                        userData.progress.items.push({
                            name: req.name,
                            max_items: userData.cosmetics_storage.colors.length
                        })
                        taskData = await userData.progress.items.find(it => it.name == req.name)
                    }
                    let cur = userData.cosmetics_storage.colors.length
                    if (taskData.max_items < cur) taskData.max_items = cur
                    sum = taskData.max_items < req.total ? ((taskData.max_items / req.point_every) * req.points_per).toFixed(1) : ((req.total / req.point_every) * req.points_per).toFixed(1)

                    tasks.push(
                        {
                            name: req.name,
                            sum: sum
                        }
                    )
                }
                    break;
                case 'COSMETIC_SYMBOLS': {
                    if (!taskData) {
                        userData.progress.items.push({
                            name: req.name,
                            max_items: userData.cosmetics_storage.symbols.length
                        })
                        taskData = await userData.progress.items.find(it => it.name == req.name)
                    }
                    let cur = userData.cosmetics_storage.symbols.length
                    if (taskData.max_items < cur) taskData.max_items = cur
                    sum = taskData.max_items < req.total ? ((taskData.max_items / req.point_every) * req.points_per).toFixed(1) : ((req.total / req.point_every) * req.points_per).toFixed(1)

                    tasks.push(
                        {
                            name: req.name,
                            sum: sum
                        }
                    )
                }
                    break;
                case 'COSMETIC_FRAMES': {
                    if (!taskData) {
                        userData.progress.items.push({
                            name: req.name,
                            max_items: userData.cosmetics_storage.ramkas.length
                        })
                        taskData = await userData.progress.items.find(it => it.name == req.name)
                    }
                    let cur = userData.cosmetics_storage.ramkas.length
                    if (taskData.max_items < cur) taskData.max_items = cur
                    sum = taskData.max_items < req.total ? ((taskData.max_items / req.point_every) * req.points_per).toFixed(1) : ((req.total / req.point_every) * req.points_per).toFixed(1)

                    tasks.push(
                        {
                            name: req.name,
                            sum: sum
                        }
                    )
                }
                    break;
                case 'COSMETIC_SUFFIXES': {
                    if (!taskData) {
                        userData.progress.items.push({
                            name: req.name,
                            max_items: userData.cosmetics_storage.suffixes.length
                        })
                        taskData = await userData.progress.items.find(it => it.name == req.name)
                    }
                    let cur = userData.cosmetics_storage.suffixes.length
                    if (taskData.max_items < cur) taskData.max_items = cur
                    sum = taskData.max_items < req.total ? ((taskData.max_items / req.point_every) * req.points_per).toFixed(1) : ((req.total / req.point_every) * req.points_per).toFixed(1)

                    tasks.push(
                        {
                            name: req.name,
                            sum: sum
                        }
                    )
                }
                    break;
                case 'COSMETIC_RANKS': {
                    if (!taskData) {
                        userData.progress.items.push({
                            name: req.name,
                            max_items: userData.cosmetics_storage.rank.length
                        })
                        taskData = await userData.progress.items.find(it => it.name == req.name)
                    }
                    let cur = userData.cosmetics_storage.rank.length
                    if (taskData.max_items < cur) taskData.max_items = cur
                    sum = taskData.max_items < req.total ? ((taskData.max_items / req.point_every) * req.points_per).toFixed(1) : ((req.total / req.point_every) * req.points_per).toFixed(1)

                    tasks.push(
                        {
                            name: req.name,
                            sum: sum
                        }
                    )
                }
                    break;

                default:
                    break;
            }
        }

        let totalSum = 0;
        for (let task of tasks) {
            totalSum += Number(task.sum)
        }
        userData.progress.points = totalSum;
        userData.save()
        return tasks;
    }
}

module.exports = {
    GuildProgress
}