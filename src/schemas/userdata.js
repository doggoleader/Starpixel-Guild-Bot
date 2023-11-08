const mongoose = require(`mongoose`);

const User = new mongoose.Schema({
    userid: { type: String, unique: true },
    guildid: { type: String, default: `320193302844669959` },
    displayname: {
        rank: { type: String, default: `🦋` },
        name: { type: String, default: `` },
        ramka1: { type: String, default: `` },
        ramka2: { type: String, default: `` },
        symbol: { type: String, default: `👤` },
        premium: { type: String, default: `` },
        suffix: { type: String, default: `` },
        custom_rank: { type: Boolean, default: false }

    },

    name: { type: String },
    nickname: { type: String, },
    joinedGuild: { type: Date, default: Date.now() },
    oldnickname: { type: String },
    uuid: { type: String, },
    onlinemode: { type: Boolean },
    age: { type: Number, },

    rank_number: { type: Number, default: 0 },
    sub_type: { type: Number, default: 0 },
    staff_pos: { type: Number, default: 0 },

    rumbik: { type: Number, default: 0 },
    rank: { type: Number, default: 0 },
    exp: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
    gexp: { type: Number, default: 0 },
    medal_1: { type: Number, default: 0 },
    medal_2: { type: Number, default: 0 },
    medal_3: { type: Number, default: 0 },
    times_reset: { type: Number, default: 0 },
    tickets: { type: Number, default: 0 },
    progress: {
        points: { type: Number, default: 0 },
        items: [
            {
                name: { type: String }, //Название части прогресса
                claimed_items: [String], //Для предметов с массивами
                max_items: { type: Number }, //Для предметов, требующих постепенный заработок
                total_items: { type: Number } //Для предметов, требующих подсчет предметов за все время
            }
        ]
    },

    user_roles_backup: {
        last_updated: { type: Date, default: Date.now() },
        roles: [String]
    },
    pers_emoji: { type: Boolean, default: false },
    pers_info: {
        channel: { type: String },
        main_msg: { type: String },
        numb: { type: Number }
    },
    pers_settings: {
        birthday_wishes: { type: Boolean, default: true },
        profile_view: { type: Boolean, default: true },
        marks_view: { type: Boolean, default: true },
        is_in_leaderboard: { type: Boolean, default: true },
        language: { type: String, default: 'ru' },
    },
    cooldowns: {
        daily: { type: Date, default: Date.now() },
        weekly: { type: Date, default: Date.now() },
        monthly: { type: Date, default: Date.now() },
        staffbox: { type: Date, default: Date.now() },
        seasonalWinner: { type: Date, default: Date.now() },

        msgCreateExp: { type: Date, default: Date.now() },
        hw_msgCreate: { type: Date, default: Date.now() },

        prof_update: { type: Date, default: Date.now() },
        prof_create: { type: Date, default: Date.now() },

        spet: { type: Date, default: Date.now() },
        epet: { type: Date, default: Date.now() },
        lpet: { type: Date, default: Date.now() },
        mpet: { type: Date, default: Date.now() },

        earth: { type: Date, default: Date.now() },
        air: { type: Date, default: Date.now() },
        water: { type: Date, default: Date.now() },
        fire: { type: Date, default: Date.now() },

        sun: { type: Date, default: Date.now() },
        mercury: { type: Date, default: Date.now() },
        venera: { type: Date, default: Date.now() },
        mars: { type: Date, default: Date.now() },
        jupiter: { type: Date, default: Date.now() },
        saturn: { type: Date, default: Date.now() },
        uran: { type: Date, default: Date.now() },
        neptune: { type: Date, default: Date.now() },

        sub_1: { type: Date, default: Date.now() },
        sub_2: { type: Date, default: Date.now() },
        sub_3: { type: Date, default: Date.now() },
        premium: { type: Date, default: Date.now() },
        boost: { type: Date, default: Date.now() },
        prestige: { type: Date, default: Date.now() },

        dog: { type: Date, default: Date.now() },
        cat: { type: Date, default: Date.now() },
        rabbit: { type: Date, default: Date.now() },
        fox: { type: Date, default: Date.now() },
        lion: { type: Date, default: Date.now() },

        hw_quest: { type: Date, default: Date.now() },
        ny_quest: { type: Date, default: Date.now() },
        ea_quest: { type: Date, default: Date.now() },
        su_quest: { type: Date, default: Date.now() },
        ny_santa_rew: { type: Date, default: Date.now() },

        mc_link: { type: Date, default: Date.now() },
        mc_unlink: { type: Date, default: Date.now() },
    },

    perks: {
        rank_boost: { type: Number, default: 0 },
        shop_discount: { type: Number, default: 0 },
        king_discount: { type: Number, default: 0 },
        act_discount: { type: Number, default: 0 },
        temp_items: { type: Number, default: 0 },
        sell_items: { type: Number, default: 0 },
        ticket_discount: { type: Number, default: 0 },
        change_items: { type: Number, default: 0 },
        store_items: { type: Number, default: 0 }
    },
    bank: {
        balance: { type: Number, default: 0 },
        max_balance: { type: Number, default: 500 },
        expire: { type: Date, default: Date.now() },
        multiplier: { type: Number, default: 1.05 },
        account_type: { type: String, default: `Стартовый` },
        opened: { type: Boolean, default: false }
    },

    achievements: {
        normal: { type: Number, default: 0, min: 0 },
        mythical: { type: Number, default: 0, min: 0 },
        rewards: [String],
        myth_6_clicked: { type: Number, default: 0 },
        myth_6_remove: { type: Date, default: Date.now() }
    },

    buys: {
        normal: { type: Number, default: 0 },
        activity: { type: Number, default: 0 },
        king: { type: Number, default: 0 },
        total_sum: { type: Number, default: 0 },
        total_tickets: { type: Number, default: 0 }
    },
    sell: {
        comet: { type: Number, default: 0 },
        constellation: { type: Number, default: 0 },
        other: { type: Number, default: 0 },
        total_sum: { type: Number, default: 0 }
    },
    upgrades: {
        inventory_size: { type: Number, default: 10 },
        max_purchases: { type: Number, default: 15 },
        max_sells: { type: Number, default: 15 },

        inventory_size_tier: { type: Number, default: 1 },
        max_purchases_tier: { type: Number, default: 1 },
        max_sells_tier: { type: Number, default: 1 },
        bank_account_tier: { type: Number, default: 1 },
    },
    daily: {
        purchases: { type: Number, default: 0 },
        sells: { type: Number, default: 0 }
    },

    elements: {
        //Земля
        underground: { type: Number, default: 0, max: 1, min: 0 },
        fast_grow: { type: Number, default: 0, max: 1, min: 0 },
        mountains: { type: Number, default: 0, max: 1, min: 0 },
        //Вода
        diving: { type: Number, default: 0, max: 1, min: 0 },
        resistance: { type: Number, default: 0, max: 1, min: 0 },
        respiration: { type: Number, default: 0, max: 1, min: 0 },
        //Огонь
        fire_resistance: { type: Number, default: 0, max: 1, min: 0 },
        lightning: { type: Number, default: 0, max: 1, min: 0 },
        flame: { type: Number, default: 0, max: 1, min: 0 },
        //Земля
        flying: { type: Number, default: 0, max: 1, min: 0 },
        wind: { type: Number, default: 0, max: 1, min: 0 },
        eagle_eye: { type: Number, default: 0, max: 1, min: 0 },
    },
    warn_info: [
        {
            user: { type: String },
            moderator: { type: String },
            reason: { type: String },
            date: { type: Date },
            warn_code: { type: String },
            message: {
                id: { type: String },
                content: { type: String },
                url: { type: String },
                attachments: [{
                    link: { type: String }
                }]
            },
            automodInfo: {
                alertSystemMessageID: { type: String },
                automodRuleName: { type: String },
                channelId: { type: String },
                messageMatchedContent: { type: String },
                messageMatchedKeyword: { type: String },
                ruleId: { type: String }
            }
        }
    ],
    warns_number: { type: Number, default: 0 },
    roles: [String],

    shop_costs: { type: Number, default: 1 },
    king_costs: { type: Number, default: 1 },
    act_costs: { type: Number, default: 1 },
    pers_act_boost: { type: Number, default: 1 },
    pers_rank_boost: { type: Number, default: 1 },
    pers_rumb_boost: { type: Number, default: 1 },

    act_rewards: [Number],
    in_guild_rewards: [Number],
    guild_games_rewards: [Number],

    marks: [{
        name: { type: String },
        date: { type: Date },
        given_by: { type: String },
        id: { type: Number }
    }],

    weekly_exp: { type: Number, default: 0 },
    gexp_info: [
        {
            date: { type: String },
            gexp: { type: Number }
        }
    ],
    temp_channel: {
        created: { type: Boolean, default: false },
        id: { type: String, default: `` },
    },

    seasonal: {
        halloween: {
            points: { type: Number, default: 0 },
            quest: {
                id: { type: Number, default: -1 },
                before: { type: Number, default: 0 },
                requirement: { type: Number, default: Infinity },
                finished: { type: Boolean, default: true },
                description: { type: String, default: `` }
            },
            quests_completed: { type: Number, default: 0 },
            achievements: {
                num1: { type: Boolean, default: false },
                num2: { type: Boolean, default: false },
                num3: { type: Boolean, default: false },
                num4: { type: Boolean, default: false },
                num5: { type: Boolean, default: false },
                num6: { type: Boolean, default: false },

            },
            opened_scary: { type: Number, default: 0 },
            hw_msg: { type: Boolean, default: false },
            hw_cosm: { type: Boolean, default: false },
            hw_soul: { type: Boolean, default: false },
        },
        new_year: {
            points: { type: Number, default: 0 },
            adventcalendar: [{
                num: { type: Number }
            }],
            santa_suit: {
                hat: { type: Boolean, default: false },
                chest: { type: Boolean, default: false },
                gloves: { type: Boolean, default: false },
                bag: { type: Boolean, default: false },
            },
            suits_returned: { type: Number, default: 0 },
            opened_gifts: { type: Number, default: 0 },
            quests_completed: { type: Number, default: 0 },
            quest: {
                id: { type: Number, default: -1 },
                before: { type: Number, default: 0 },
                requirement: { type: Number, default: Infinity },
                finished: { type: Boolean, default: true },
                description: { type: String, default: `` }
            },
            available_packs: {
                pack_1: { type: Number, default: 0},
                pack_2: { type: Number, default: 0},
                pack_3: { type: Number, default: 0},
                pack_4: { type: Number, default: 0},
            },
            gifted_packs: { type: Number, default: 0 }, 
            snowflakes: { type: Number, default: 0 },
            bingo_rewards: [String],
            bingo: [
                [
                    {
                        id: { type: Number, default: -1 },
                        before: { type: Number, default: 0 },
                        requirement: { type: Number, default: Infinity },
                        finished: { type: Boolean, default: true },
                        description: { type: String, default: `` }
                    }
                ]
            ],
            achievements: {
                num1: { type: Boolean, default: false },
                num2: { type: Boolean, default: false },
                num3: { type: Boolean, default: false },
                num4: { type: Boolean, default: false },
                num5: { type: Boolean, default: false },
                num6: { type: Boolean, default: false },
            },
        },
        easter: {
            points: { type: Number, default: 0 },
            quest: {
                id: { type: Number, default: -1 },
                before: { type: Number, default: 0 },
                requirement: { type: Number, default: Infinity },
                finished: { type: Boolean, default: true },
                description: { type: String, default: `` }
            },
            quests_completed: { type: Number, default: 0 },
            achievements: {
                num1: { type: Boolean, default: false },
                num2: { type: Boolean, default: false },
                num3: { type: Boolean, default: false },
                num4: { type: Boolean, default: false },
                num5: { type: Boolean, default: false },
            },
            opened_eggs: { type: Number, default: 0 },
            ea_cosm: { type: Boolean, default: false },
            rabbit: { type: Boolean, default: false },
        },
        summer: {
            points: { type: Number, default: 0 },
            quest: {
                id: { type: Number, default: -1 },
                before: { type: Number, default: 0 },
                requirement: { type: Number, default: Infinity },
                finished: { type: Boolean, default: true },
                description: { type: String, default: `` }
            },
            unique_quests: { type: Number, default: 0 },
            quests_completed: { type: Number, default: 0 },
            achievements: {
                num1: { type: Boolean, default: false },
                num2: { type: Boolean, default: false },
                num3: { type: Boolean, default: false },
                num4: { type: Boolean, default: false },
                num5: { type: Boolean, default: false },
                num6: { type: Boolean, default: false },
                num7: { type: Boolean, default: false },
                num8: { type: Boolean, default: false },
                num9: { type: Boolean, default: false },
                num10: { type: Boolean, default: false },
            },
            opened_boxes: { type: Number, default: 0 },
            su_cosm: { type: Boolean, default: false },
            sea_ticket: { type: Boolean, default: false },
            events: {
                events_attended: { type: Number, default: 0 },
                last_event_applied: { type: Boolean, default: false },
                last_event_member: { type: Boolean, default: false }
            }
        },
    },
    visited_games: { type: Number, default: 0 },
    stacked_items: [String],
    custom_color: {
        hex: { type: String },
        role: { type: String },
        custom_name: { type: String },
        created: { type: Boolean, default: false }
    },
    specialization: { type: String, default: `None` },
    quests: {
        veterans: {
            stats: {
                total: { type: Number, default: 0 }
            },
            completed: [String],
            activated: {
                id: { type: Number, default: -1 },
                required: { type: Number, default: Infinity },
                status: { type: Boolean, default: true }
            }
        },
        mars: {
            stats: {
                total: { type: Number, default: 0 }
            },
            activated: {
                id: { type: Number, default: -1 },
                required: { type: Number, default: Infinity },
                status: { type: Boolean, default: true }
            }
        },
        marathon: {
            stats: {
                total_mar: { type: Number, default: 0 },
                total_stages: { type: Number, default: 0 }
            },
            completed: [String],
            activated: {
                id: { type: Number, default: -1 },
                required: { type: Number, default: Infinity },
                status: { type: Boolean, default: true },
                stage: { type: Number, default: 0 }
            }
        },
        kings: {
            stats: {
                total: { type: Number, default: 0 }
            },
            completed: [String],
            activated_info: [
                {
                    id: { type: Number, default: -1 },
                    required: { type: Number, default: Infinity },
                    status: { type: Boolean, default: true }
                }
            ]
        },
        seasonal: {
            stats: {
                hw: {
                    total: { type: Number, default: 0 }
                },
                ny: {
                    total: { type: Number, default: 0 }
                },
                ea: {
                    total: { type: Number, default: 0 }
                },
                su: {
                    total: { type: Number, default: 0 }
                },

            }
        }
    },
    box_chances: {
        common: { type: Number, default: 1 },
        uncommon: { type: Number, default: 1 },
        rare: { type: Number, default: 1 },
        epic: { type: Number, default: 1 },
        legendary: { type: Number, default: 1 },
        mythical: { type: Number, default: 1 },
        RNG: { type: Number, default: 1 },
    },
    starway: {
        claimed: [Number],
        current: { type: Number, default: 0 },
        unclaimed: [String]
    },
    black_hole: {
        stage: { type: Number, default: 0 },
        info: {
            missing_news: [String],
            messages_lastMonth: { type: Number, default: 0 },
            games_lastMonth: { type: Number, default: 0 },
            minutesInVoice_lastMonth: { type: Number, default: 0 },
            minutesInVoiceTalking_lastMonth: { type: Number, default: 0 },

            joinedVoice: { type: Number, default: Number(Date.now()) },
            startedTalk: { type: Number, default: Number(Date.now()) },

            stage1_thread: { type: String },
            roles: [String],
            stage3_thread: { type: String },
            GEXP_lastMonth: { type: Number, default: 0 }
        },
        total_times: { type: Number, default: 0 },
        enabled: { type: Boolean, default: false }
    },
    social_medias: {
        vk: { type: String },
        telegram: { type: String },
        hypixel: { type: String },
        youtube: { type: String }
    },
    payments: {
        qiwi: [{
            billid: { type: String },
            messageid: { type: String }
        }]
    },
    misc: {
        elect_dec_2022: {
            voted: { type: Boolean, default: false },
            choice: { type: String, default: `None` }
        },
        feedback_dec_2022: {
            reward: { type: Boolean, default: false }
        }
    }
})
User.index({ guildid: 1, userid: 1 })

module.exports = { User: mongoose.model(`User`, User) }