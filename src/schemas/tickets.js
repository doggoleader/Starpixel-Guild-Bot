const mongoose = require(`mongoose`);

const Tickets = new mongoose.Schema({
    guildid: { type: String  },
    id: { type: Number, default: 0 },
    support: { type: String }
})
Tickets.index({ guildid: 1, id: 1 })

module.exports = { Tickets: mongoose.model(`Tickets`, Tickets) }