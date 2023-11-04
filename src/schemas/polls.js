const mongoose = require(`mongoose`);

const Polls = new mongoose.Schema({
    guildid: { type: String },
    userid: { type: String },
    channelid: { type: String },
    messageid: { type: String },
    builder_message: { type: String },
    amount: { type: String },
    min_amount: { type: String },
    status: { type: String },
    question: { type: String },
    description: { type: String },

    options: [
        {
            label: { type: String },
            value: { type: String },
            description: { type: String },
            emoji: { type: String, default: `🔑` }
        }
    ],
    results: [{
        option: { type: String },
        result: { type: Number }
    }],
    users: [{
        userid: { type: String },
        options: [String],
        voted: { type: Boolean }
    }],
    expire_minutes: { type: Number, default: 10080 },
    expire: { type: Date }
})
Polls.index({ guildid: 1, userid: 1 })
module.exports = { Polls: mongoose.model(`Polls`, Polls) }