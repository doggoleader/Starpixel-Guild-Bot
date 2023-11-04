const mongoose = require(`mongoose`);

const Birthday = new mongoose.Schema({
    guildid: { type: String },
    userid: { type: String },
    day: { type: Number },
    month: { type: Number },
    year: { type: Number }
})
Birthday.index({ guildid: 1, userid: 1 })

module.exports = { Birthday: mongoose.model(`Birthday`, Birthday) }