const mongoose = require(`mongoose`);

const Apply = new mongoose.Schema({
    guildid: { type: String },
    userid: { type: String },
    invited_by: { type: String },
    invite_code: { type: String },

    rules_accepted: { type: Boolean, default: false },

    part1: { type: Boolean, default: false },
    part2: { type: Boolean, default: false },
    applied: { type: Boolean, default: false },

    que1: { type: String, default: `` },
    que2: { type: String, default: `` },
    que3: { type: String, default: `` },
    que4: { type: String, default: `` },
    que5: { type: String, default: `` },
    que6: { type: String, default: `` },
    que7: { type: String, default: `` },

    secondPartID: { type: String, default: `` },
    applicationid: { type: String, default: `` },
    threadid: { type: String, default: `` },
    status: { type: String, default: `` },
    officer: { type: String, default: `` },
    onlinemode: { type: String, default: null },

    off1: { type: String, default: `` },
    off2: { type: String, default: `` },
    off3: { type: String, default: `` },
})
Apply.index({ guildid: 1, userid: 1 })
module.exports = { Apply: mongoose.model(`Apply`, Apply) }