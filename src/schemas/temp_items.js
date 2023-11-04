const mongoose = require(`mongoose`);

const Temp = new mongoose.Schema({
    guildid: { type: String },
    userid: { type: String },
    roleid: { type: String },
    pers_boost: { type: Boolean, default: false },
    extraInfo: { type: String },
    number: { type: Number, default: 1 },
    color: { type: Boolean, default: false },
    boost: { type: Boolean, default: false },
    shop_disc: { type: Boolean, default: false },
    expire: { type: Date }
})
Temp.index({ guildid: 1, userid: 1 })

module.exports = { Temp: mongoose.model(`Temp`, Temp) }