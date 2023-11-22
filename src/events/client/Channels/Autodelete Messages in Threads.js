const chalk = require(`chalk`);
const { ReactionCollector, ChannelType } = require("discord.js");
const { Guild } = require(`../../../schemas/guilddata`)
const { isURL } = require(`../../../functions`)
const wait = require(`node:timers/promises`).setTimeout
const linksInfo = require(`../../../discord structure/links.json`)
const { checkPlugin } = require("../../../functions");
let plugin = {
    id: "admin",
    name: "Административное"
}
async function execute(message, client) {
    if (message.author.id == client.user.id) return
    if (message.channel.type == ChannelType.DM) return
    const guild = message.guild
    if (!await checkPlugin(guild.id, plugin.id)) return
    const channel = await message.guild.channels.fetch(message.channelId)
    if (message.channel.id == `1034497096629362730` && !message.member.roles.cache.has(`320880176416161802`)) {
        const member = message.member
        const msg = await message.channel.send({
            content: `${member}, не можете отправлять сообщения в данном канале!`
        })
        await message.delete()
        await wait(10000)
        await msg.delete()
    } else if (channel.type == ChannelType.PublicThread && channel.parentId == `1036346705827868753`) {
        const member = await guild.members.fetch(message.author.id)
        if (member.user.id !== channel.ownerId && !member.roles.cache.has(`320880176416161802`)) {
            await message.delete()
            const msg = await channel.send({
                content: `${message.author}, вы не можете отправлять сообщения в данной ветке! Чтобы создать отчёт об ошибке, создайте новую публикацию!`
            })
            await wait(10000)
            await msg.delete()
        }
    } else if (channel.type == ChannelType.PublicThread && channel.parentId == `1045336589083099156`) {
        const member = await guild.members.fetch(message.author.id)
        if (member.user.id !== channel.ownerId && !member.roles.cache.has(`320880176416161802`)) {
            await message.delete()
            const msg = await channel.send({
                content: `${message.author}, вы не можете отправлять сообщения в данной ветке! Чтобы создать отчёт об ошибке, создайте новую публикацию!`
            })
            await wait(10000)
            await msg.delete()
        }
    }
}

module.exports = {
    name: 'messageCreate',
    plugin: plugin,
    execute
}