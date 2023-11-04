const { User } = require(`../../../schemas/userdata`)
const { Guild } = require(`../../../schemas/guilddata`)
const { ChannelType } = require(`discord.js`)
const chalk = require(`chalk`);
const ch_list = require(`../../../discord structure/channels.json`)
const prettyMilliseconds = require(`pretty-ms`) //ДОБАВИТЬ В ДРУГИЕ
const wait = require(`node:timers/promises`).setTimeout
const { isURL } = require(`../../../functions`)
const linksInfo = require(`../../../discord structure/links.json`)
const { checkPlugin } = require("../../../functions");

module.exports = {
    name: 'messageCreate',
    plugin: {
        id: "music",
        name: "Музыка"
    },
    async execute(message) {
        if (message.channel.type == ChannelType.DM) return
        if (!await checkPlugin(message.guild.id, this.plugin.id)) return
        if (message.author.bot) return
        const guildData = await Guild.findOne({ id: message.guild.id })
        if (guildData.plugins.guildgames === false) return
        const words = message.content.split(` `)
        const results = []
        words.forEach(word => results.push(isURL(word)))
        
        if (message.channel.id == ch_list.your_music && results.includes(true)) {
            message.react(`❤️`)
        } else if (message.channel.id == ch_list.your_music && !results.includes(true)) {
            
            const warnMsg = await message.reply({
                content: `${message.author}, в этом канале разрешено публиковать только ссылки на музыку!`
            })
            await message.delete()
            await wait(10000);
            await warnMsg.delete()
        }
    }
}