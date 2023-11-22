const { User } = require(`../../schemas/userdata`)
const chalk = require(`chalk`);
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, GuildMember, AttachmentBuilder } = require(`discord.js`)
const ch_list = require(`../../discord structure/channels.json`)
const { Guild } = require(`../../schemas/guilddata`)
const { suffix } = require(`../../functions`)
const linksInfo = require(`../../discord structure/links.json`)
const wait = require(`node:timers/promises`).setTimeout
const cron = require(`node-cron`);
const { checkPlugin } = require("../../functions");
const fs = require(`fs`)
const toXLS = require(`json2xls`)


class GuildGames {
    id = "guildgames";
    name = "Совместные игры"

    /**
     * 
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async randomGame(client) {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", this.id)) return;
            const guildData = await Guild.findOne({ id: guild.id })

            const channel = await guild.channels.fetch(ch_list.guildGamesVoice)
            const voice = await guild.channels.fetch(ch_list.guildGamesVoice)




            if (true) {
                const buttonNext = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`gg_nextgame`)
                            .setEmoji(`🎮`)
                            .setLabel(`Выбрать игру`)
                            .setStyle(ButtonStyle.Primary)
                    )

                const games = require(`./GuildGamesSettings/Games List.json`)
                const type = games[Math.floor(Math.random() * games.length)]

                const rules = require(`./GuildGamesSettings/Special Rules.json`)
                let rule = rules[Math.floor(Math.random() * rules.length)]

                //Выбор игры
                if (type.type == `normal`) {
                    const game = type.games[Math.floor(Math.random() * type.games.length)]
                    const gameList = await guildData.guildgames.games.find(gm => gm.id == game.name)
                    if (!gameList) {
                        guildData.guildgames.games.push({
                            id: game.name,
                            played: 1
                        })
                    } else if (gameList.played >= game.max) {
                        return client.randomGame()
                    } else {
                        gameList.played += 1
                    }
                    await channel.send(`◾`)
                    await channel.send({
                        content: `╔════════════╗◊╔════════════╗
    **СОВМЕСТНАЯ ИГРА**
    Идёт выбор следующей игры...
    :video_game: **${game.name}**
    :game_die: Максимум **${suffix(game.max)}** раз за совместную игру
    ╚════════════╝◊╚════════════╝`,
                        components: [buttonNext]
                    })

                    guildData.save()

                } else if (type.type == `vote`) {


                    const game1 = type.games[Math.floor(Math.random() * type.games.length)]
                    let game2 = type.games[Math.floor(Math.random() * type.games.length)]
                    while (game2.name == game1.name) {
                        game2 = type.games[Math.floor(Math.random() * type.games.length)]
                    }
                    const buttonVote = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`gg_vote_1`)
                                .setEmoji(`🔶`)
                                .setLabel(`${game1.name} (0)`)
                                .setStyle(ButtonStyle.Primary)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`gg_vote_2`)
                                .setEmoji(`🔷`)
                                .setLabel(`${game2.name} (0)`)
                                .setStyle(ButtonStyle.Primary)
                        )
                    await channel.send(`◾`)
                    const msg = await channel.send({
                        content: `╔════════════╗◊╔════════════╗
    **СОВМЕСТНАЯ ИГРА**
    Игроки выбирают следующую игру:
    🔶 **${game1.name}**
    :game_die: Максимум **${suffix(game1.max)}** за совместную игру
    
    🔷 **${game2.name}**
    :game_die: Максимум **${suffix(game2.max)}** за совместную игру
    ╚════════════╝◊╚════════════╝
    Проголосуйте реакциями, у вас есть 30 секунд!`,
                        components: [buttonVote]
                    })
                    const filter = (i) => i.customId === 'gg_vote_1' || i.customId === 'gg_vote_2';

                    const collector = msg.createMessageComponentCollector({
                        filter,
                        time: 30000,
                        componentType: ComponentType.Button,
                        dispose: true
                    });
                    collector.on('collect', async i => {
                        await i.deferUpdate()
                        const find = await collector.collected.find(int => int.user.id == i.user.id && int.id !== i.id)
                        if (find) {
                            await collector.dispose(find)
                            await collector.handleDispose(find)
                        }

                        const f = await collector.collected.filter(int => int.customId == `gg_vote_1`)
                        const s = await collector.collected.filter(int => int.customId == `gg_vote_2`)
                        const buttonVoteNew = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`gg_vote_1`)
                                    .setEmoji(`🔶`)
                                    .setLabel(`${game1.name} (${f.size})`)
                                    .setStyle(ButtonStyle.Primary)
                            )
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`gg_vote_2`)
                                    .setEmoji(`🔷`)
                                    .setLabel(`${game2.name} (${s.size})`)
                                    .setStyle(ButtonStyle.Primary)
                            )
                        await i.message.edit({
                            components: [buttonVoteNew]
                        })
                    })
                    collector.on('end', async (collected) => {
                        /* 
                            1. ИСПРАВИТЬ РЕАКЦИИ НА КНОПКИ
                            2. СОБИРАТЬ ВСЕ ПОЛУЧЕННЫЕ INTERACTIONS
                            3. СОЗДАТЬ ФАЙЛ В КНОПКАХ RG.js
                            3.1. СДЕЛАТЬ ОГРАНИЧЕНИЕ ДЛЯ ОФИЦЕРОВ И ВЕДУЩИХ!
                            4. УБРАТЬ КОМАНДУ /gg randomgame
                            5. ДОБАВИТЬ КНОПКУ ВЫБОРА ИГРЫ В Game Start.js
                            
                            СДЕЛАТЬ ДО СЛЕДУЮЩЕЙ СОВМЕСТНОЙ
                            
                        */
                        const f = await collected.filter(int => int.customId == `gg_vote_1`)
                        const s = await collected.filter(int => int.customId == `gg_vote_2`)
                        const buttonVoteNew = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`gg_vote_1`)
                                    .setEmoji(`🔶`)
                                    .setLabel(`${game1.name} (${f.size})`)
                                    .setStyle(ButtonStyle.Primary)
                                    .setDisabled(true)
                            )
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`gg_vote_2`)
                                    .setEmoji(`🔷`)
                                    .setLabel(`${game2.name} (${s.size})`)
                                    .setStyle(ButtonStyle.Primary)
                                    .setDisabled(true)
                            )
                        await msg.edit({
                            components: [buttonVoteNew]
                        })
                        const sort = await [f, s].sort((a, b) => {
                            return b.size - a.size
                        })
                        try {
                            if (!sort[0].first()) {
                                const gameList = await guildData.guildgames.games.find(gm => gm.id == game1.name)
                                if (!gameList) {
                                    guildData.guildgames.games.push({
                                        id: game1.name,
                                        played: 1
                                    })
                                } else if (gameList.played >= game1.max) {
                                    await msg.reply({
                                        content: `Выбранная игра (${game1.name}) достигла своего лимита на данной совместной игре... Идёт выбор новой игры...`
                                    })
                                    return client.randomGame()
                                } else {
                                    gameList.played += 1
                                }
                                await msg.reply({
                                    content: `╔════════════╗◊╔════════════╗
    **СОВМЕСТНАЯ ИГРА**
    Игроки выбрали следующую игру...
    :video_game: **${game1.name}**
    :game_die: Максимум **${suffix(game1.max)}** за совместную игру
    ╚════════════╝◊╚════════════╝`,
                                    components: [buttonNext]
                                })
                            } else if (sort[0].first().customId == `gg_vote_1`) {
                                const gameList = await guildData.guildgames.games.find(gm => gm.id == game1.name)
                                if (!gameList) {
                                    guildData.guildgames.games.push({
                                        id: game1.name,
                                        played: 1
                                    })
                                } else if (gameList.played >= game1.max) {
                                    await msg.reply({
                                        content: `Выбранная игра (${game1.name}) достигла своего лимита на данной совместной игре... Идёт выбор новой игры...`
                                    })
                                    return client.randomGame()
                                } else {
                                    gameList.played += 1
                                }
                                await msg.reply({
                                    content: `╔════════════╗◊╔════════════╗
    **СОВМЕСТНАЯ ИГРА**
    Игроки выбрали следующую игру...
    :video_game: **${game1.name}**
    :game_die: Максимум **${suffix(game1.max)}** за совместную игру
    ╚════════════╝◊╚════════════╝`,
                                    components: [buttonNext]
                                })

                                //guildData.save()
                            } else if (sort[0].first().customId == `gg_vote_2`) {
                                const gameList = await guildData.guildgames.games.find(gm => gm.id == game2.name)
                                if (!gameList) {
                                    guildData.guildgames.games.push({
                                        id: game2.name,
                                        played: 1
                                    })
                                } else if (gameList.played >= game2.max) {
                                    await msg.reply({
                                        content: `Выбранная игра (${game2.name}) достигла своего лимита на данной совместной игре... Идёт выбор новой игры...`
                                    })
                                    return client.randomGame()
                                } else {
                                    gameList.played += 1
                                }
                                await msg.reply({
                                    content: `╔════════════╗◊╔════════════╗
    **СОВМЕСТНАЯ ИГРА**
    Игроки выбрали следующую игру...
    :video_game: **${game2.name}**
    :game_die: Максимум **${suffix(game2.max)}** за совместную игру
    ╚════════════╝◊╚════════════╝`,
                                    components: [buttonNext]
                                })

                                //guildData.save()
                            }
                        }
                        catch (e) {
                            console.log(e)
                            const gameList = await guildData.guildgames.games.find(gm => gm.id == game1.name)
                            if (!gameList) {
                                guildData.guildgames.games.push({
                                    id: game1.name,
                                    played: 1
                                })
                            } else if (gameList.played >= game1.max) {
                                await msg.reply({
                                    content: `Выбранная игра (${game1.name}) достигла своего лимита на данной совместной игре... Идёт выбор новой игры...`
                                })
                                return client.randomGame()
                            } else {
                                gameList.played += 1
                            }
                            await msg.reply({
                                content: `╔════════════╗◊╔════════════╗
    **СОВМЕСТНАЯ ИГРА**
    Игроки выбрали следующую игру...
    :video_game: **${game1.name}**
    :game_die: Максимум **${suffix(game1.max)}** за совместную игру
    ╚════════════╝◊╚════════════╝`,
                                components: [buttonNext]
                            })
                        }

                    })
                } else if (type.type == `restrictment`) {
                    const game = type.games[Math.floor(Math.random() * type.games.length)]
                    const gameList = await guildData.guildgames.games.find(gm => gm.id == game.name)
                    const voiceMembers = await voice.members.filter(member => member.user.bot === false)
                    if (!gameList) {
                        guildData.guildgames.games.push({
                            id: game.name,
                            played: 1
                        })
                    } else if (gameList.played >= game.max || voiceMembers.size >= game.rest_num) {
                        return this.randomGame()
                    } else {
                        gameList.played += 1
                    }
                    await channel.send(`◾`)
                    await channel.send({
                        content: `╔════════════╗◊╔════════════╗
    **СОВМЕСТНАЯ ИГРА**
    Идёт выбор следующей игры...
    :video_game: **${game.name}**
    :game_die: Максимум **${suffix(game.max)}** за совместную игру
    :warning: Данная игра имеет ограничение. __${game.rest}!__
    ╚════════════╝◊╚════════════╝`,
                        components: [buttonNext]
                    })

                    guildData.save()
                }

                if (!rule.restrictment || rule.restrictment == `SkyWars`) {
                    await channel.send({
                        content: `:warning: Специальное правило:
    ${rule.description}`
                    })
                } else if (rule.restrictment == `randomMember`) {
                    const randomNumber = Math.floor(Math.random() * voice.members.size) + 1
                    await channel.send(`:warning: Специальное правило:
    ${rule.description.replace(`%n`, randomNumber)}`)
                }
            }





            else if (guildData.guildgames.gameType == `Особая`) {
                const games = require(`./GuildGamesSettings/Games List.json`)
                const type = games[Math.floor(Math.random() * games.length)]

                const rules = require(`./GuildGamesSettings/Special Rules.json`)
                let rule = rules[Math.floor(Math.random() * rules.length)]
                const voiceMembers = await voice.members.fetch()
                let war = 0
                let tact = 0
                let sc = 0
                let cas = 0
                await voiceMembers.forEach(async member => {
                    const userData = await User.findOne({ guildid: guild.id, userid: member.user.id })
                    if (userData.specialization == `Warrior`) {
                        war += 1
                    } else if (userData.specialization == `Scout`) {
                        sc += 1
                    } else if (userData.specialization == `Casual`) {
                        cas += 1
                    } else if (userData.specialization == `Tactical`) {
                        tact += 1
                    }
                })
                await wait(1000)
                //Выбор игры
                if (type.type == `normal`) {

                    const chances = []
                    for (let i = 0; i < type.games.length; i++) {
                        let sps = type.games[i].specializations
                        let chance = type.games[i].chance
                        if (sps.includes(`Warrior`)) {
                            chance += 3 ** war
                        }
                        if (sps.includes(`Scout`)) {
                            chance += 3 ** sc
                        }
                        if (sps.includes(`Casual`)) {
                            chance += 3 ** cas
                        }
                        if (sps.includes(`Tactical`)) {
                            chance += 3 ** tact
                        }

                        chances.push(chance)
                    }


                    let total = 0;
                    for (let i = 0; i < chances.length; i++) {
                        total += chances[i];
                    }
                    let r = Math.floor(Math.random() * total);
                    let b = 0;
                    for (let s = chances[0]; s <= r; s += chances[b]) {
                        b++;
                    }
                    const game = type.games[b]
                    const gameList = await guildData.guildgames.games.find(gm => gm.id == game.name)
                    if (!gameList) {
                        guildData.guildgames.games.push({
                            id: game.name,
                            played: 1
                        })
                    } else if (gameList.played >= game.max) {
                        return this.randomGame()
                    } else {
                        gameList.played += 1
                    }
                    await channel.send(`◾`)
                    await channel.send({
                        content: `╔════════════╗◊╔════════════╗
    **СОВМЕСТНАЯ ИГРА**
    Идёт выбор следующей игры...
    :video_game: **${game.name}**
    :game_die: Максимум **${suffix(game.max)}** раз за совместную игру
    ╚════════════╝◊╚════════════╝`
                    })

                    guildData.save()

                } else if (type.type == `vote`) {
                    const chances = []
                    for (let i = 0; i < type.games.length; i++) {
                        let sps = type.games[i].specializations
                        let chance = type.games[i].chance
                        if (sps.includes(`Warrior`)) {
                            chance += 3 ** war
                        }
                        if (sps.includes(`Scout`)) {
                            chance += 3 ** sc
                        }
                        if (sps.includes(`Casual`)) {
                            chance += 3 ** cas
                        }
                        if (sps.includes(`Tactical`)) {
                            chance += 3 ** tact
                        }

                        chances.push(chance)
                    }


                    let total1 = 0;
                    for (let i = 0; i < chances.length; i++) {
                        total1 += chances[i];
                    }
                    let r1 = Math.floor(Math.random() * total2);
                    let b1 = 0;
                    for (let s = chances[0]; s <= r1; s += chances[b1]) {
                        b1++;
                    }

                    let total2 = 0;
                    for (let i = 0; i < chances.length; i++) {
                        total2 += chances[i];
                    }
                    let r2 = Math.floor(Math.random() * total2);
                    let b2 = 0;
                    for (let s = chances[0]; s <= r2; s += chances[b2]) {
                        b2++;
                    }


                    const game1 = type.games[b1]
                    let game2 = type.games[b2]
                    while (game2.name == game1.name) {
                        total2 = 0;
                        for (let i = 0; i < chances.length; i++) {
                            total2 += chances[i];
                        }
                        r2 = Math.floor(Math.random() * total2);
                        b2 = 0;
                        for (let s = chances[0]; s <= r2; s += chances[b2]) {
                            b2++;
                        }
                        game2 = type.games[b2]
                    }


                    await channel.send(`◾`)
                    const msg = await channel.send({
                        content: `╔════════════╗◊╔════════════╗
    **СОВМЕСТНАЯ ИГРА**
    Игроки выбирают следующую игру:
    🔶 **${game1.name}**
    :game_die: Максимум **${suffix(game1.max)}** за совместную игру
    
    🔷 **${game2.name}**
    :game_die: Максимум **${suffix(game2.max)}** за совместную игру
    ╚════════════╝◊╚════════════╝
    Проголосуйте реакциями, у вас есть 30 секунд!`
                    })
                    const filter = (reaction, user) => reaction.emoji.name === '🔶' || reaction.emoji.name === '🔷';

                    const collector = msg.createReactionCollector({ filter, time: 30000 });
                    await msg.react(`🔶`)
                    await msg.react(`🔷`)
                    collector.on('end', async (collected) => {
                        const sort = await collected.sort((a, b) => b.count - a.count)
                        if (sort.first().emoji.name == `🔶`) {
                            const gameList = await guildData.guildgames.games.find(gm => gm.id == game1.name)
                            if (!gameList) {
                                guildData.guildgames.games.push({
                                    id: game1.name,
                                    played: 1
                                })
                            } else if (gameList.played >= game1.max) {
                                await msg.reply({
                                    content: `Выбранная игра (${game1.name}) достигла своего лимита на данной совместной игре... Идёт выбор новой игры...`
                                })
                                return this.randomGame()
                            } else {
                                gameList.played += 1
                            }
                            await msg.reply({
                                content: `╔════════════╗◊╔════════════╗
    **СОВМЕСТНАЯ ИГРА**
    Игроки выбрали следующую игру...
    :video_game: **${game1.name}**
    :game_die: Максимум **${suffix(game1.max)}** за совместную игру
    ╚════════════╝◊╚════════════╝`
                            })

                            guildData.save()
                        } else if (sort.first().emoji.name == `🔷`) {
                            const gameList = await guildData.guildgames.games.find(gm => gm.id == game2.name)
                            if (!gameList) {
                                guildData.guildgames.games.push({
                                    id: game2.name,
                                    played: 1
                                })
                            } else if (gameList.played >= game2.max) {
                                await msg.reply({
                                    content: `Выбранная игра (${game2.name}) достигла своего лимита на данной совместной игре... Идёт выбор новой игры...`
                                })
                                return this.randomGame()
                            } else {
                                gameList.played += 1
                            }
                            await msg.reply({
                                content: `╔════════════╗◊╔════════════╗
    **СОВМЕСТНАЯ ИГРА**
    Игроки выбрали следующую игру...
    :video_game: **${game2.name}**
    :game_die: Максимум **${suffix(game2.max)}** за совместную игру
    ╚════════════╝◊╚════════════╝`
                            })

                            guildData.save()
                        }
                    })
                } else if (type.type == `restrictment`) {
                    const chances = []
                    for (let i = 0; i < type.games.length; i++) {
                        let sps = type.games[i].specializations
                        let chance = type.games[i].chance
                        if (sps.includes(`Warrior`)) {
                            chance += 3 ** war
                        }
                        if (sps.includes(`Scout`)) {
                            chance += 3 ** sc
                        }
                        if (sps.includes(`Casual`)) {
                            chance += 3 ** cas
                        }
                        if (sps.includes(`Tactical`)) {
                            chance += 3 ** tact
                        }

                        chances.push(chance)
                    }


                    let total = 0;
                    for (let i = 0; i < chances.length; i++) {
                        total += chances[i];
                    }
                    let r = Math.floor(Math.random() * total);
                    let b = 0;
                    for (let s = chances[0]; s <= r; s += chances[b]) {
                        b++;
                    }
                    const game = type.games[b]
                    const gameList = await guildData.guildgames.games.find(gm => gm.id == game.name)
                    const voiceMembersCheck = await voice.members.filter(member => member.user.bot === false)
                    if (!gameList) {
                        guildData.guildgames.games.push({
                            id: game.name,
                            played: 1
                        })
                    } else if (gameList.played >= game.max || voiceMembersCheck.size >= game.rest_num) {
                        return this.randomGame()
                    } else {
                        gameList.played += 1
                    }
                    await channel.send(`◾`)
                    await channel.send({
                        content: `╔════════════╗◊╔════════════╗
    **СОВМЕСТНАЯ ИГРА**
    Идёт выбор следующей игры...
    :video_game: **${game.name}**
    :game_die: Максимум **${suffix(game.max)}** за совместную игру
    :warning: Данная игра имеет ограничение. __${game.rest}!__
    ╚════════════╝◊╚════════════╝`
                    })

                    guildData.save()
                }

                if (!rule.restrictment || rule.restrictment == `SkyWars`) {
                    await channel.send({
                        content: `:warning: Специальное правило:
    ${rule.description}`
                    })
                } else if (rule.restrictment == `randomMember`) {
                    const randomNumber = Math.floor(Math.random() * voice.members.size) + 1
                    await channel.send(`:warning: Специальное правило:
    ${rule.description.replace(`%n`, randomNumber)}`)
                }
            }
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

    /**
     * 
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async ReminderForOfficer(client) {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", this.id)) return;
            const guildData = await Guild.findOne({ id: guild.id })
            const date = new Date()
            const day = date.getDay().toLocaleString(`ru-RU`, { timeZone: `Europe/Moscow` })
            const memberInfo = guildData.guildgames.temp_leader || await guildData.guildgames.officers.find(off => off.day == day).id
            if (memberInfo) {
                const member = await guild.members.fetch(memberInfo)
                try {
                    const channel = await guild.channels.fetch(ch_list.guildgames)
                    await member.send(`Привет! Скоро начинается твоя совместная игра! Пожалуйста, не пропусти ее! Если ты не можешь её посетить, заранее уведоми других ведущих в канале ${channel}! Спасибо!`)
                } catch (e) {
                    const channel = await guild.channels.fetch(ch_list.guildgames)
                    await channel.send(`${member}, привет!  У тебя закрыты личные сообщение, поэтому я не смог написать тебе. Пожалуйста, открой их.
                    
Скоро начинается твоя совместная игра! Пожалуйста, не пропусти ее! Если ты не можешь её посетить, заранее уведоми других ведущих в канале ${channel}! Спасибо!`)
                }

            } else {
                const channel = await guild.channels.fetch(ch_list.guildgames)
                const role = await guild.roles.fetch(`523559726219526184`)
                await channel.send({
                    content: `Скоро начинается совместная игра! Пожалуйста, не пропустите её! В моей базе данных нет информации о ведущем совместной игры в этот день. Прошу администрацию это исправить. ${role}
                    
Если ведущий уже имеется, пусть он готовится к проведению совместной! Спасибо!`,
                    allowenMentions: {
                        parse: ["everyone"],
                        roles: ["523559726219526184"]
                    }
                })
            }
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

    /**
     * 
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async GameEnd(client) {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", this.id)) return;
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
                await this.GuildGamesCheckRewards(member)
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

    /**
     * 
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async GamePreStart(client) {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", this.id)) return;
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

    /**
     * 
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async GuildGameStart(client) {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", this.id)) return;
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

    /**
     * @param {GuildMember} member Discord Guild Member
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async GuildGamesCheckRewards(member, client) {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", this.id)) return;
            const channel = await guild.channels.fetch(ch_list.main)
            const userData = await User.findOne({ userid: member.user.id, guildid: guild.id })
            const rewardsFile = require(`./GuildGamesSettings/Guild Games Rewards.json`)
            const rewards = await rewardsFile.filter(rew => rew.required <= userData.visited_games)
            for (const reward of rewards) {
                let check = await userData.guild_games_rewards.find(r => r == reward.required);
                if (!check) {
                    if (!member.roles.cache.has(reward.box)) {
                        await member.roles.add(reward.box)
                        const embed = new EmbedBuilder()
                            .setTitle(`Получена награда за посещение совместной игры`)
                            .setDescription(`${member} получил награду за посещение ${reward.required} совместных игр! В качестве награды он получает <@&${reward.box}>! 
                    
Спасибо, что посещаете совместные игры! Ждём вас ещё!`)
                            .setColor(Number(linksInfo.bot_color))
                            .setThumbnail(member.user.displayAvatarURL())
                            .setTimestamp(Date.now())

                        await channel.send({
                            embeds: [embed]
                        })
                    } else {
                        await userData.stacked_items.push(reward.box)
                        const embed = new EmbedBuilder()
                            .setTitle(`В склад предметов добавлена награда!`)
                            .setDescription(`${member} теперь имеет ${userData.stacked_items.length} неполученных наград! За посещение ${reward.required} игр на склад была отправлена <@&${reward.box}>!

Чтобы получить награду, откройте коробки и пропишите команду </rewards claim:1055546254240784492>! Для просмотра списка неполученных наград пропишите </rewards unclaimed:1055546254240784492>!
Спасибо, что посещаете совместные игры! Ждём вас ещё!`)
                            .setColor(Number(linksInfo.bot_color))
                            .setThumbnail(member.user.displayAvatarURL())
                            .setTimestamp(Date.now())
                        await channel.send({
                            content: `⚠ ${member}`,
                            embeds: [embed]
                        })
                    }

                    await userData.guild_games_rewards.push(reward.required)
                }
            }

            userData.save()



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

    /**
     * 
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async SchedulerGuildGamesOffs(client) {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            const guildData = await Guild.findOne({ id: guild.id })
            let startMin = guildData.guildgames.gamestart_min
            let startHour = guildData.guildgames.gamestart_hour
            let min_remind = []
            let hour_remind = []
            if (startMin - 15 < 0) {
                let min1 = startMin + 60
                min_remind.push(min1 - 15)
                hour_remind.push(startHour - 1)
            } else {
                let min1 = startMin
                min_remind.push(min1 - 15)
                hour_remind.push(startHour)
            }

            if (startMin - 10 < 0) {
                let min2 = startMin + 60
                min_remind.push(min2 - 10)
                hour_remind.push(startHour - 1)
            } else {
                let min2 = startMin
                min_remind.push(min2 - 10)
                hour_remind.push(startHour)
            }

            if (startMin - 5 < 0) {
                let min3 = startMin + 60
                min_remind.push(min3 - 5)
                hour_remind.push(startHour - 1)
            } else {
                let min3 = startMin
                min_remind.push(min3 - 5)
                hour_remind.push(startHour)
            }


            const weekDays = guildData.guildgames.game_days.join(`,`)
            const scheduleStop = await cron.getTasks().get(`ReminderForOfficer`)
            if (scheduleStop) {
                await scheduleStop.stop()
            }
            if (!weekDays) return
            cron.schedule(`${min_remind.join(`,`)} ${hour_remind.join(`,`)} * * ${weekDays}`, async () => {
                this.ReminderForOfficer()
            }, {
                timezone: `Europe/Moscow`,
                name: `ReminderForOfficer`,
                scheduled: true
            })
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

    /**
     * 
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async SchedulerGuildGamesRem(client) {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            const guildData = await Guild.findOne({ id: guild.id })

            let startMinPreStart = guildData.guildgames.gamestart_min
            let startHourPreStart = guildData.guildgames.gamestart_hour
            let min_remindPreStart
            let hour_remindPreStart
            if (startMinPreStart - 10 < 0) {
                startMinPreStart = startMinPreStart + 60
                min_remindPreStart = startMinPreStart - 10
                hour_remindPreStart = startHourPreStart - 1
            } else {
                min_remindPreStart = startMinPreStart - 10
                hour_remindPreStart = startHourPreStart
            }
            const weekDaysPreStart = guildData.guildgames.game_days.join(`,`)
            const scheduleStopPreStart = await cron.getTasks().get(`GamePreStart`)
            if (scheduleStopPreStart) {
                await scheduleStopPreStart.stop()
            }
            if (!weekDaysPreStart) return
            cron.schedule(`${min_remindPreStart} ${hour_remindPreStart} * * ${weekDaysPreStart}`, async () => {
                this.GamePreStart()
            }, {
                timezone: `Europe/Moscow`,
                name: `GamePreStart`,
                scheduled: true
            })
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

    /**
     * 
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async SchedulerGuildGamesStart(client) {
        const guild = await client.guilds.fetch(`320193302844669959`)
        const guildData = await Guild.findOne({ id: guild.id })

        let startMinGameStart = guildData.guildgames.gamestart_min
        let startHourGameStart = guildData.guildgames.gamestart_hour
        const weekDaysGameStart = guildData.guildgames.game_days.join(`,`)
        const scheduleStopGameStart = await cron.getTasks().get(`GuildGameStart`)
        if (scheduleStopGameStart) {
            await scheduleStopGameStart.stop()
        }
        if (!weekDaysGameStart) return
        cron.schedule(`${startMinGameStart} ${startHourGameStart} * * ${weekDaysGameStart}`, async () => {
            this.GuildGameStart()
        }, {
            timezone: `Europe/Moscow`,
            name: `GuildGameStart`,
            scheduled: true
        })
    }

    /**
     * 
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async GGResetStatus(client) {
        const guild = await client.guilds.fetch(`320193302844669959`)
        const guildData = await Guild.findOne({ id: guild.id })

        cron.schedule(`0 0 * * *`, async () => {
            guildData.guildgames.status = `waiting`
            guildData.save()
        }, {
            timezone: `Europe/Moscow`,
            name: `ResetStatus`,
            scheduled: true
        })
    }
}


module.exports = {
    GuildGames
}