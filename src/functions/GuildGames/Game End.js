const { User } = require(`../../schemas/userdata`)
const chalk = require(`chalk`);
const { EmbedBuilder, AttachmentBuilder } = require(`discord.js`)
const ch_list = require(`../../discord structure/channels.json`)
const { Guild } = require(`../../schemas/guilddata`)
const wait = require(`node:timers/promises`).setTimeout
const linksInfo = require(`../../discord structure/links.json`)
const fs = require(`fs`)
const toXLS = require(`json2xls`)
const { checkPlugin } = require("../../functions");
const plugin = {
    id: "guildgames",
    name: "Совместные игры"
}

module.exports = (client) => {
    client.GameEnd = async () => {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", plugin.id)) return;
            const guildData = await Guild.findOne({ id: guild.id })
            try {
                await client.distube.voices.leave(guild)
            } catch (e) {

            }
            const channel = await guild.channels.fetch(ch_list.main)
            const voice = await guild.channels.fetch(ch_list.guildGamesVoice)
            const voiceMembers = await voice.members.filter(member => member.user.bot === false)
            const inGame = []
            //await voiceMembers.forEach(async member => {
            for (const members of voiceMembers) {
                let memberID = members[0]
                const member = await guild.members.fetch(memberID)
                const userData = await User.findOne({ userid: memberID, guildid: guild.id })
                userData.visited_games += 1
                userData.black_hole.info.games_lastMonth += 1
                if (guildData.seasonal.summer.enabled == true) {
                    userData.seasonal.summer.events.events_attended += 1
                }
                userData.save()
                await client.GuildGamesCheckRewards(member)
                inGame.push(memberID)
            }
            let i = 1
            const list = inGame.map(member => {
                return `**${i++}.** <@${member}>`
            })
            const date = new Date()
            const day = date.getDay().toLocaleString(`ru-RU`, { timeZone: `Europe/Moscow` })
            let memberInfo = guildData.guildgames.temp_leader || await guildData.guildgames.officers.find(off => off.day == day)?.id
            let member
            if (memberInfo) member = await guild.members.fetch(memberInfo)
            else member = `\`Неизвестный\``
            const visitedEmbed = new EmbedBuilder()
                .setTitle(`Совместная игра ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`)
                .setDescription(`**Посетило игроков**: ${voiceMembers.size}
**Ведущий**: ${member}

**Игру посетили**:
${list.join(`\n`)}`)
                .setColor(Number(linksInfo.bot_color))
                .setFooter({ text: `Если вы посетили совместную игру, но вас тут нет, напишите в вопрос-модерам, предоставив доказательство! Вся информация о посещённых игроках берётся из участников голосового канала. В следующий раз заходите в голосовой канал и общайтесь с другими участниками!` })
                .setThumbnail(guild.iconURL())
                .setTimestamp(Date.now())

            const gameStats = await guild.channels.fetch(ch_list.visitedGames)
            await gameStats.send({
                embeds: [visitedEmbed]
            })

            let b = 1
            const gamesPlayed = guildData.guildgames.games.map(game => {
                return `**${b++}**. ${game.id} - ${game.played} раз`
            })
            const statsEmbed = new EmbedBuilder()
                .setTitle(`Статистика текущей игры`)
                .setDescription(`Итоги: 
${gamesPlayed.join(`\n`)}`)
                .setTimestamp(Date.now())
                .setColor(Number(linksInfo.bot_color))
                .setThumbnail(guild.iconURL())
            await channel.send({
                content: `◾ 
**СОВМЕСТНАЯ ИГРА ЗАВЕРШАЕТСЯ**!
Пожалуйста, выйдите из канала ${voice}.

${member} благодарит всех, кто посетил её.
◾`
            })
            const hearts = [
                `:yellow_heart: :orange_heart: :yellow_heart: :orange_heart: :yellow_heart: :orange_heart:`,
                `:white_heart: :heart: :white_heart: :heart: :white_heart: :heart:`,
                `:brown_heart: :green_heart: :brown_heart: :green_heart: :brown_heart: :green_heart:`,
                `:purple_heart: :blue_heart: :purple_heart: :blue_heart: :purple_heart: :blue_heart:`
            ]
            const randomHearts = hearts[Math.floor(Math.random() * hearts.length)]
            await channel.send(`${randomHearts}`)
            await channel.send({
                embeds: [statsEmbed]
            })
            const endMin = date.getMinutes(), endHour = date.getHours() + 3;
            const normEndHour = guildData.guildgames.gameend_hour, normEndMin = guildData.guildgames.gameend_min;
            const totalMins = endMin + (60 * endHour), normTotalMins = normEndMin + (60 * normEndHour)
            const json = []
            let age = 0
            const membInfoGG = await voiceMembers.forEach(async (memb) => {
                const userData = await User.findOne({ userid: memb.user.id, guildid: guild.id })
                await json.push({
                    "Никнейм": userData.nickname,
                    "UUID": userData.onlinemode ? userData.uuid : null,
                    "Discord ID": memb.user.id,
                    "Discord Name": memb.user.tag,

                    "Возраст": userData.age,
                    "Посещено игр": userData.visited_games
                });
                age += userData.age
            })
            await wait(5000)
            var xls = toXLS(json);
            const offChannel = await guild.channels.fetch(ch_list.staff)
            const gg_date = new Date()
            fs.writeFileSync(`./src/files/Guild Games Info/GGINFOMEMBERS_${gg_date.getDate()}_${gg_date.getMonth() + 1}_${gg_date.getFullYear()}.xlsx`, xls, 'binary')
            const file1 = new AttachmentBuilder()
                .setFile(`./src/files/Guild Games Info/GGINFOMEMBERS_${gg_date.getDate()}_${gg_date.getMonth() + 1}_${gg_date.getFullYear()}.xlsx`)
                .setName(`GGINFOMEMBERS_${gg_date.getDate()}_${gg_date.getMonth() + 1}_${gg_date.getFullYear()}.xlsx`)


            const json2 = {
                "Дата проведения": `${gg_date.getDate()}.${gg_date.getMonth() + 1}.${gg_date.getFullYear()}`,
                "Ведущий (ID)": `${guildData.guildgames.temp_leader}`,
                "Конец по расписанию": `${normEndHour}:${normEndMin}`,
                "Фактический конец игры": `${endHour}:${endMin}`,
                "Время игры": `${endHour - guildData.guildgames.gamestart_hour}:${endMin - guildData.guildgames.gamestart_min}`,
                "Количество игроков": `${voiceMembers.size}`,
                "Соотнош. проведено/отменено": (guildData.guildgames.total / guildData.guildgames.canceled).toFixed(2),
                "Средний возраст": (age / voiceMembers.size).toFixed(2)
            }

            var xls2 = toXLS(json2);
            fs.writeFileSync(`./src/files/Guild Games Info/GGINFOGUILD_${gg_date.getDate()}_${gg_date.getMonth() + 1}_${gg_date.getFullYear()}.xlsx`, xls2, 'binary')
            const file2 = new AttachmentBuilder()
                .setFile(`./src/files/Guild Games Info/GGINFOGUILD_${gg_date.getDate()}_${gg_date.getMonth() + 1}_${gg_date.getFullYear()}.xlsx`)
                .setName(`GGINFOGUILD_${gg_date.getDate()}_${gg_date.getMonth() + 1}_${gg_date.getFullYear()}.xlsx`)
            await offChannel.send({
                content: `Статистика только что прошедшой совместной игры!`,
                files: [file1, file2]
            });
            guildData.guildgames.started = 0
            guildData.guildgames.total += 1
            guildData.guildgames.status = `finished`
            guildData.guildgames.groups = []
            guildData.guildgames.gameType = ``
            guildData.guildgames.temp_leader = ``
            guildData.guildgames.music.forEach(mus => mus.usedTimes = 0)
            guildData.guildgames.games = []
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
