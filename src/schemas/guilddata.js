const mongoose = require(`mongoose`);

const Guild = new mongoose.Schema({
    id: { type: String },
    name: { type: String },
    secret_word: {
        name: { type: String },
        hint: { type: String },
        guessed: { type: Boolean, default: false }
    },
    act_exp_boost: { type: Number, default: 1 },
    marathon: {
        marathon_type: { type: String, default: 'type1' }
    },
    global_settings: {
        shop_prices: { type: Number, default: 1 },
        no_license_applications: { type: String, default: "disabled" }
    },
    invites: {
        bypass_invite_codes: [String]
    },
    cooldowns: {

    },
    logs: {
        webhook_url: { type: String },
        webhook_token: { type: String },
        webhook_id: { type: String },
        log_channel: { type: String }
    },
    plugins: {
        items: { type: Boolean, default: true }, //Includes Boxes, Rumbiks, Rank Exp, Act Exp, Tickets Pets, Elements, Achievements, Subscriptions, Temporary Roles, Auto Roles
        nicknames: { type: Boolean, default: true }, //Includes Cosmetic Items, Auto-update Nicknames
        birthday: { type: Boolean, default: true }, // Includes /birthday command & Auto-wish 
        new_users: { type: Boolean, default: true }, //Includes welcome message & applications
        tickets: { type: Boolean, default: true }, //Includes Ticket system
        logs: { type: Boolean, default: true }, //Includes Action Logs
        hypixel: { type: Boolean, default: true }, //Includes all Quests, Rewards, Items associated with Hypixel Network
        music: { type: Boolean, default: true }, //Includes bot feature to play music
        guildgames: { type: Boolean, default: true }, //Includes Guild Games organized by guild Staff
        channels: { type: Boolean, default: true }, //Includes Auto Channel Updates, Temporary Voice Channels
        seasonal: { type: Boolean, default: true }, //Includes seasonal features
        admin: { type: Boolean, default: true }, //Includes ALL Administative Commands. DO NOT CHANGE VALUE AT ALL!
        misc: { type: Boolean, default: true }, //Includes other small feature which doesn't suitable for other plugins

        removed: {
            recording: { type: Boolean, default: true },
        }
    },
    hypixel_lvl: { type: Number, default: 0 },

    seasonal: {
        halloween: {
            enabled: { type: Boolean, default: false },
            channels: [{
                id: { type: String }
            }]

        },
        new_year: {
            enabled: { type: Boolean, default: false },
            channels: [{
                id: { type: String }
            }],
            advent_msgs: {
                msg1: { type: String },
                msg2: { type: String },
            }

        },
        easter: {
            enabled: { type: Boolean, default: false },
            channels: [{
                id: { type: String }
            }]

        },
        summer: {
            enabled: { type: Boolean, default: false },
            channels: [{
                id: { type: String }
            }],
            secret_word: { type: String, default: `каникулы` },
            secret_guessed: { type: Boolean, default: false }

        },
    },
    pers_info: {
        numb: { type: Number, default: 1 }
    },
    guildgames: {
        total: { type: Number, default: 0 },
        canceled: { type: Number, default: 0 },
        status: { type: String, default: `stopped` },
        gamestart_min: { type: Number, default: 0 },
        gamestart_hour: { type: Number, default: 0 },
        gameend_min: { type: Number, default: 0 },
        gameend_hour: { type: Number, default: 0 },
        pregame_song: { type: String },
        game_days: [String],
        officers: [{
            id: { type: String },
            day: { type: String },
            start_time: { type: String },
            end_time: { type: String },
            type: { type: String, default: `Традиционная` }
        }],
        music: [{
            link: { type: String },
            chance: { type: Number }
        }],
        started: { type: Number, default: 0 },
        games: [{
            id: { type: String },
            played: { type: Number, default: 0 }
        }],
        gameType: { type: String, default: `Традиционная` },
        music: [{
            link: { type: String },
            usedTimes: { type: Number, default: 0 },
            sent: { type: String }
        }],
        temp_leader: { type: String }
    }
})
Guild.index({ id: 1 })

module.exports = { Guild: mongoose.model(`Guild`, Guild) }