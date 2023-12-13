const { User } = require(`../../../schemas/userdata`)
const { Temp } = require(`../../../schemas/temp_items`)
const { Apply } = require(`../../../schemas/applications`)
const { TicketsUser } = require(`../../../schemas/ticketUser`)
const { ChannelType, AttachmentBuilder } = require(`discord.js`)
const chalk = require(`chalk`); //ДОБАВИТЬ В ДРУГИЕ
const fs = require(`fs`)
const { checkPlugin } = require("../../../functions");
let plugin = {
    id: "new_users",
    name: "Новые пользователи"
}
async function execute(member, client) {
    try {
        if (!await checkPlugin(member.guild.id, plugin.id)) return
        const { Guild } = require(`../../../schemas/guilddata`)
        const guild = member.guild
        if (guild.id !== `320193302844669959`) return
        const userData = await User.findOne({ userid: member.user.id })
        const temp = await Temp.find({ userid: member.user.id })
        const appData = await Apply.findOne({ userid: member.user.id })
        const tickets = await TicketsUser.find({ userid: member.user.id })
        const channel = await guild.channels.cache.get(`849608079691350078`)
        if (appData) {
            appData.applied = false;
            appData.status = "Не подана";
            appData.rules_accepted = false;
            appData.save()
        }
        if (tickets) {
            tickets.forEach(async (ticket) => {
                const channel = await member.guild.channels.fetch(ticket.channelid)
                await channel.delete()
                ticket.delete()
            })
        }
        if (temp) {
            temp.forEach((item) => {
                item.delete()
            })
        }
        let info
        if (userData) {
            info = `Minecraft Nick: \`${userData.nickname}\`
Minecraft UUID: ${userData.onlinemode ? userData.uuid : null}
Discord ID: ${userData.userid}
Реальное имя: ${userData.displayname.name}`

            let stream = await fs.createWriteStream(`./src/files/Database/Profile.json`)
            let json = JSON.stringify(userData, (_, v) => typeof v === 'bigint' ? v.toString() : v)
            stream.once('open', function (fd) {
                stream.write(json);
                stream.end();
            });

            let interactionChannel = await guild.channels.fetch(`1114239308853936240`)
            let attach = new AttachmentBuilder()
                .setFile(`./src/files/Database/Profile.json`)
                .setName(`Profile.json`)

            await interactionChannel.send({
                content: `**Имя пользователя**: \`${userData.displayname.name}\`
**ID Discord**: \`${userData.userid}\`
**Никнейм**: \`${userData.nickname}\`
**UUID**: \`${userData.onlinemode ? userData.uuid : null}\``,
                files: [attach]
            })
            await client.InfoUpdate(userData.userid, `guild_leave`)
            const ch = await guild.channels.fetch(userData.pers_info.channel)
            await ch.send({
                content: `**ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ**`,
                files: [attach]
            })
            userData.delete()
        }


        await channel.send({
            content: `❌ ${member.user.username} покинул сервер!
**Дополнительная информация**: ${info ? info : `Не являлся участником гильдии!`}`
        })
    } catch (e) {
        const admin = await client.users.fetch(`491343958660874242`)
        console.log(e)
        await admin.send({
            content: `-> \`\`\`${e.stack}\`\`\``
        }).catch()
    }
}

module.exports = {
    name: 'guildMemberRemove',
    plugin: plugin,
    execute
}