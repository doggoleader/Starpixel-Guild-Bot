const { User } = require(`../../schemas/userdata`)
const chalk = require(`chalk`);
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require(`discord.js`)
const ch_list = require(`../../discord structure/channels.json`)
const { Guild } = require(`../../schemas/guilddata`)
const cron = require(`node-cron`)
const { isURL } = require(`../../functions`)
const wait = require(`node:timers/promises`).setTimeout
const linksInfo = require(`../../discord structure/links.json`)
const { checkPlugin } = require("../../functions");
const plugin = {
    id: "guildgames",
    name: "Совместные игры"
}

module.exports = (client) => {
    client.GuildGameStart = async () => {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", plugin.id)) return;
            const guildData = await Guild.findOne({ id: guild.id })
            if (guildData.guildgames.status == `canceled`) return
            /*  const gameTypes = [
                 `Традиционная`,
                 //`Особая`
             ]
             const gameType = gameTypes[Math.floor(Math.random() * gameTypes.length)] */
            const channel = await guild.channels.fetch(ch_list.main)
            const voice = await guild.channels.fetch(ch_list.guildGamesVoice)
            guildData.guildgames.started = 2
            //guildData.guildgames.gameType = gameType
            guildData.guildgames.status = `ongoing`
            guildData.save()
            const date = new Date()
            const day = date.getDay()
            let gameType = await guildData.guildgames.officers.find(off => off.day == day)?.type
            if (!gameType) gameType = 'Традиционная'
            await voice.members.forEach(async (member) => {
                await member.voice.setMute(false)
            })
            const buttonNext = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`gg_nextgame`)
                        .setEmoji(`🎮`)
                        .setLabel(`Выбрать игру`)
                        .setStyle(ButtonStyle.Primary)
                )
            const memberInfo = guildData.guildgames.temp_leader || await guildData.guildgames.officers.find(off => off.day == day)?.id
            if (memberInfo) {
                const member = await guild.members.fetch(memberInfo)
                await channel.send({
                    content: `## Совместная игра в гильдии Starpixel начинается!

**СОВМЕСТНАЯ ИГРА**  :arrow_down:     @here

Игру ведет ${member}!     :sunglasses:    
Ждём Вас в голосовом канале ${voice} с хорошим настроением!
Тип совместной игры: **${gameType}**.

:warning: Чтобы получить пати, просто примите \`/g party\`. Иногда вам придётся ждать, пока наши игроки доиграют.
:star: Ведущий будет рандомно выбирать игры в Дискорде с помощью команды. 
:gift: На совместной игре вас ждут различные призы, которые вы сможете получить за победу.

**Обращаем ваше внимание, что если тип совместной игры отличается от "Традиционная", то ведущий сам определяет, как и где будет проходить игра!**`,
                    allowedMentions: {
                        parse: ["everyone"]
                    },
                    components: [buttonNext]
                })
            } else {
                await channel.send({
                    content: `## Совместная игра в гильдии Starpixel начинается!

**СОВМЕСТНАЯ ИГРА**  :arrow_down:     @here

Ждём Вас в голосовом канале ${voice} с хорошим настроением!   
Тип совместной игры: **${gameType}**.

:warning: Чтобы получить пати, просто примите \`/g party\`. Иногда вам придётся ждать, пока наши игроки доиграют.
:star: Ведущий будет рандомно выбирать игры в Дискорде с помощью команды. 
:gift: На совместной игре вас ждут различные призы, которые вы сможете получить за победу.

**Обращаем ваше внимание, что если тип совместной игры отличается от "Традиционная", то ведущий сам определяет, как и где будет проходить игра!**`,
                    allowedMentions: {
                        parse: ["everyone"]
                    },
                    components: [buttonNext]
                })
            }
            /* if (gameType == `Особая`) {
                client.SpecialGame();
            } */
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
