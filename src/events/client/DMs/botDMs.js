const chalk = require(`chalk`);
const { ChannelType, EmbedBuilder } = require("discord.js");
const linksInfo = require(`../../../discord structure/links.json`)
const { checkPlugin } = require("../../../functions");
let plugin = {
    id: "channels",
    name: "Каналы"
}
async function execute(message, client) {
    if (message.channel.type === ChannelType.DM) {
        const guild = await message.client.guilds.fetch(`320193302844669959`)
        if (!await checkPlugin(guild.id, plugin.id)) return
        const channel = await guild.channels.fetch(`982551755340537866`)
        const message_embed = new EmbedBuilder()
            .setColor(Number(linksInfo.bot_color))
            .setThumbnail(message.author.displayAvatarURL())
            .setTitle(`НОВОЕ СООБЩЕНИЕ В ЛИЧНЫХ СООБЩЕНИЯХ C ${message.channel.recipient.tag}`)
            .setTimestamp(Date.now())
            .setDescription(`Автор: \`${message.author.tag}\`
Содержимое: \`${message.content}\`
Получатель: ${message.channel.recipient.tag}`)
        await channel.send({
            embeds: [message_embed]
        })
        console.log(chalk.blackBright(`[${new Date()}]`) + chalk.yellow(`[${message.author.tag} в личных сообщениях с ${message.channel.recipient.tag}]`) + chalk.white(`: ${message.content}`))



    }

}

module.exports = {
    name: 'messageCreate',
    plugin: plugin,
    execute
}