const chalk = require(`chalk`);
const { EmbedBuilder } = require("discord.js");
const { Guild } = require(`../../../schemas/guilddata`)
const linksInfo = require(`../../../discord structure/links.json`)
const ch_list = require(`../../../discord structure/channels.json`)
const { checkPlugin } = require("../../../functions");
let plugin = {
    id: "new_users",
    name: "Новые пользователи"
}
async function execute(oldMember, newMember) {
    if (!await checkPlugin(newMember.guild.id, plugin.id)) return
    const guild = await oldMember.client.guilds.fetch(`320193302844669959`)
    const forumChannel = await guild.channels.fetch(`1019649781460639865`)
    const threadChannel = await forumChannel.threads.fetch(`1032002235938381834`)

    //const main_ch = await guild.channels.fetch(ch_list.main)
    //const hyp_th = await main_ch.threads.fetch(`1052865050597150731`)
    if (!oldMember.roles.cache.has(`504887113649750016`) && newMember.roles.cache.has(`504887113649750016`)) {
        await threadChannel.members.add(newMember.user.id, `Вступил в гильдию`)
        //await hyp_th.members.add(newMember.user.id, `Вступил в гильдию`)
    } else if (oldMember.roles.cache.has(`504887113649750016`) && !newMember.roles.cache.has(`504887113649750016`)) {
        await threadChannel.members.remove(newMember.user.id, `Покинул гильдию`)
        //await hyp_th.members.remove(newMember.user.id, `Покинул гильдию`)
    }

    //const off_ch = await guild.channels.fetch(ch_list.staff)
    //const off_th = await off_ch.threads.fetch(`1052865547563442207`)
    if (!oldMember.roles.cache.has(`563793535250464809`) && newMember.roles.cache.has(`563793535250464809`)) {
        //await off_th.members.add(newMember.user.id, `Вступил в офицеры`)
    } else if (oldMember.roles.cache.has(`563793535250464809`) && !newMember.roles.cache.has(`563793535250464809`)) {
        //await off_th.members.remove(newMember.user.id, `Покинул офицеров`)
    }
}

module.exports = {
    name: 'guildMemberUpdate',
    plugin: plugin,
    execute
}