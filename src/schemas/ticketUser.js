const mongoose = require(`mongoose`);

const TicketsUser = new mongoose.Schema({
    guildid: { type: String },
    userid: { type: String  },
    channelid: { type: String, default: `` },
    categoryid: { type: String, default: ``},
    opened: { type: Boolean, default: false }
})
TicketsUser.index({ guildid: 1, userid: 1 })

module.exports = { TicketsUser: mongoose.model(`TicketsUser`, TicketsUser) }