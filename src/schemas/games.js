const mongoose = require(`mongoose`);

const Games = new mongoose.Schema({
    guildid: { type: String, default: `320193302844669959` },
    messageid: { type: String },
    started_by: { type: String },
    mafia: {
        players: [{
            userid: { type: String },
            role: { type: String },
            votes: { type: Number },
            target: { type: String },

            killed: { type: Boolean},
            loved: { type: Boolean },
            voted: { type: Boolean },

            status: { type: String }
        }],
        night: { type: Number, default: 0 },
        turn: { type: String },
        gameNumber: { type: Number, default: 0 },
        time: { type: Number, default: 60 },
        mafia_targ: { type: String },
        murd_targ: { type: String },
        love_targ: { type: String }
    }
})
Games.index({ clientid: 1 })

module.exports = { Games: mongoose.model(`Games`, Games) }