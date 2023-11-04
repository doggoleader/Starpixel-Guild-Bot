const mongoose = require(`mongoose`);

const ClientSettings = new mongoose.Schema({
    clientid: { type: String, default: `883421063369859122`},
    testmode: { type: Boolean, default: false },
    version: { type: String, default: `0.1`}
})
ClientSettings.index({ clientid: 1 })

module.exports = { ClientSettings: mongoose.model(`ClientSettings`, ClientSettings) }