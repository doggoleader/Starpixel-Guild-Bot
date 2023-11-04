const mongoose = require(`mongoose`);

const SocialVerify = new mongoose.Schema({
    discord: {
        userid: { type: String },
        verify_code: { type: String },
        role: { type: String, default: `member` }
    },
    vk: {
        userid: { type: String },
        verify_code: { type: String },
        role: { type: String, default: `member` }
    },
    hypixel: {
        userid: { type: String },
        verify_code: { type: String },
        role: { type: String, default: `member` }
    },
    telegram: {
        userid: { type: String },
        verify_code: { type: String },
        role: { type: String, default: `member` }
    },
    youtube: {
        userid: { type: String },
        verify_code: { type: String },
        role: { type: String, default: `member` }
    },
    tiktok: {
        userid: { type: String },
        verify_code: { type: String },
        role: { type: String, default: `member` }
    },
    date: { type: Date }
})
SocialVerify.index({ guildid: 1, userid: 1 })
module.exports = { SocialVerify: mongoose.model(`SocialVerify`, SocialVerify) }