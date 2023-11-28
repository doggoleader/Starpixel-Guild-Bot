const chalk = require(`chalk`);
const { ReactionCollector, ChannelType } = require("discord.js");
const { Guild } = require(`../../../schemas/guilddata`)
const { isURL } = require(`../../../functions`)
const { checkPlugin } = require("../../../functions");
let plugin = {
    id: "admin",
    name: "Административное"
}
async function execute(thread, newlyCreated) {
    if (!await checkPlugin(thread.guild.id, plugin.id)) return
    if (thread.parent.id == `1036346705827868753` && thread.parent.type == ChannelType.GuildForum) {
        await thread.join()
        let tags = await thread.appliedTags
        await tags.push(`1036349459577192510`)
        await thread.send({
            content: `<@${thread.ownerId}>, спасибо, что отправили отчёт об ошибки! В скором времени администратор исправит ошибку и свяжется с вами! Никто, кроме вас и администратора, не может отправлять сообщения в данную ветку!`
        })
        await thread.setAppliedTags(tags)
    }
    if (thread.parent.id == `1045336589083099156` && thread.parent.type == ChannelType.GuildForum) {
        await thread.join()
        let tags = await thread.appliedTags
        await tags.push(`1045337358955974737`)
        await thread.send({
            content: `<@${thread.ownerId}>, спасибо, что отправили отчёт об ошибки! В скором времени администратор исправит ошибку и свяжется с вами! Никто, кроме вас и администратора, не может отправлять сообщения в данную ветку!`
        })
        await thread.setAppliedTags(tags)
    }
}

module.exports = {
    name: 'threadCreate',
    plugin: plugin,
    execute
}