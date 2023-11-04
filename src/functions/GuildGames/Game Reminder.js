const { User } = require(`../../schemas/userdata`)
const chalk = require(`chalk`);
const { EmbedBuilder } = require(`discord.js`)
const ch_list = require(`../../discord structure/channels.json`)
const { Guild } = require(`../../schemas/guilddata`)
const cron = require(`node-cron`)
const wait = require(`node:timers/promises`).setTimeout
const linksInfo = require(`../../discord structure/links.json`)
const { checkPlugin } = require("../../functions");
const plugin = {
    id: "guildgames",
    name: "Совместные игры"
}

module.exports = (client) => {
    client.GamePreStart = async () => {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", plugin.id)) return;
            const guildData = await Guild.findOne({ id: guild.id })
            if (guildData.guildgames.status == `canceled`) return

            let song = guildData.guildgames.pregame_song
            if (!song) song = `https://www.youtube.com/watch?v=KvAuzChTIJg`
            const channel = await guild.channels.fetch(ch_list.main)
            const MusicCommandsChannel = await guild.channels.fetch(ch_list.music)
            const date = new Date()
            const day = date.getDay().toLocaleString(`ru-RU`, { timeZone: `Europe/Moscow` })
            const memberInfo = guildData.guildgames.temp_leader || await guildData.guildgames.officers.find(off => off.day == day).id
            await client.distube.voices.leave(guild)
            const voice = await guild.channels.fetch(ch_list.guildGamesVoice)
            const connection = await client.distube.voices.join(voice).then(async (connection) => {
                await connection.setSelfDeaf(false)
                await connection.setSelfMute(false)
            })
            if (memberInfo) {
                const member = await guild.members.fetch(memberInfo)
                await channel.send({
                    content: `Скоро совместная игра!    
Заходите на Hypixel, чтобы успеть принять \`/g party\`.    @here

:scroll:  ${member} хочет напомнить вам **ПРАВИЛА** совместных игр: 
• Не нарушать правила гильдии и Hypixel;
• Не перебивать игроков;
• Вести себя адекватно;
• Нормально реагировать на возможные замечания ведущих;
• Выполнять все требования ведущих.`,
                    allowedMentions: {
                        parse: ["everyone"]
                    }
                })

                client.distube.play(voice, song, {
                    member: member,
                    textChannel: MusicCommandsChannel
                })
            } else {
                const clientMember = await guild.members.fetch(client.user.id)
                await channel.send({
                    content: `Скоро совместная игра!    
Заходите на Hypixel, чтобы успеть принять \`/g party\`.    @here

:scroll:  Ведущие хотят напомнить вам **ПРАВИЛА** совместных игр: 
• Не нарушать правила гильдии и Hypixel;
• Не перебивать игроков;
• Вести себя адекватно;
• Нормально реагировать на возможные замечания ведущих;
• Выполнять все требования ведущих.`,
                    allowedMentions: {
                        parse: ["everyone"]
                    }
                })

                client.distube.play(voice, song, {
                    member: clientMember,
                    textChannel: MusicCommandsChannel
                })
            }
            guildData.guildgames.started = 1
            guildData.save()

        } catch (e) {
            const admin = await client.users.fetch(`491343958660874242`)
            console.log(e)
            var path = require('path');
            var scriptName = path.basename(__filename);
            await admin.send(`Произошла ошибка!`)
            await admin.send(`=> ${e}.
**Файл**: ${scriptName}`)
            await admin.send(`◾`)
        }

    }
}
