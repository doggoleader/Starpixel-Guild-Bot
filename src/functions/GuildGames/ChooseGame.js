const { User } = require(`../../schemas/userdata`)
const chalk = require(`chalk`);
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require(`discord.js`)
const ch_list = require(`../../discord structure/channels.json`)
const { Guild } = require(`../../schemas/guilddata`)
const { suffix } = require(`../../functions`)
const linksInfo = require(`../../discord structure/links.json`)
const wait = require(`node:timers/promises`).setTimeout
const { checkPlugin } = require("../../functions");
const plugin = {
    id: "guildgames",
    name: "Совместные игры"
}

module.exports = (client) => {
    client.randomGame = async () => {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", plugin.id)) return;
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
}
