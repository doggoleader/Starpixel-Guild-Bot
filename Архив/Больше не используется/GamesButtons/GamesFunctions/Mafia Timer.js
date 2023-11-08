const { User } = require(`../../schemas/userdata`)
const chalk = require(`chalk`)
const ch_list = require(`../../discord structure/channels.json`)
const { calcActLevel, getLevel } = require(`../../functions`)
const linksInfo = require(`../../discord structure/links.json`)
const { Games } = require('../../schemas/games')
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const wait = require(`timers/promises`).setTimeout

module.exports = (client) => {
    client.MafiaTimer = async (msg) => {
        try {
            const gameData = await Games.findOne({ messageid: msg.id })
            let i = 0
            let timeto = 20
            let turns = [
                {
                    time: "День",
                    turn: "Мирный житель",
                    timeto: 60,

                },
                {
                    time: "Ночь",
                    turn: "Мафия",
                    timeto: 60,
                },
                {
                    time: "Ночь",
                    turn: "Доктор",
                    timeto: 60,
                },
                {
                    time: "Ночь",
                    turn: "Любовница",
                    timeto: 60,
                },
                {
                    time: "Ночь",
                    turn: "Комиссар",
                    timeto: 60,
                },
                {
                    time: "Ночь",
                    turn: "Маньяк",
                    timeto: 60,
                }


            ]
            while (i < 120) {
                if (i < timeto) {
                    await wait(1000);
                    i += 1
                } else if (i => timeto) {
                    const curTime = gameData.mafia.time
                    const cutTurn = gameData.mafia.turn
                    i = 0;
                    let index = await turns.findIndex(p => p.turn == gameData.mafia.turn)
                    index += 1
                    if (!turns[index]) {
                        index = 0
                    }
                    let tr = false
                    let tt = []
                    while (tr == false) {
                        let ch = await gameData.mafia.players.find(p => p.role == turns[index].turn)
                        if (!ch) {
                            tr = false
                            index += 1
                            tt.push(turns[index].turn)
                            if (tt.includes(`Мирный житель`) && tt.includes(`Мафия`) && tt.includes(`Доктор`) && tt.includes(`Любовница`) && tt.includes(`Комиссар`) && tt.includes(`Маньяк`)) {
                                const players = await gameData.mafia.players.map((pl, i) => {
                                    return `**${++i}** <@${pl.userid}> 🕑`
                                })
                                let embed = new EmbedBuilder()
                                    .setColor(Number(linksInfo.bot_color))
                                    .setTitle(`Игра в мафию`)
                                    .setDescription(`<@${gameData.started_by}> начал игру в Мафию!
**Игроки**
${players.join(`\n`)}

**ИГРА ОКОНЧЕНА**
**Победители**: \`Ничья\`
Игра закончилась! Выживших не осталось!

**Ночь ${gameData.mafia.night}**`)
                                for (let player of gameData.mafia.players) {
                                    player.votes = 0
                                    player.role = ``
                                    player.status = ``
                                    player.voted = false
                                    player.target = ``
                                }

                                const embedNew = new EmbedBuilder()
                                    .setColor(Number(linksInfo.bot_color))
                                    .setTitle(`Игра в мафию`)
                                    .setDescription(`<@${gameData.started_by}> создал комнату в игре в Мафию!
**ИГРА ОКОНЧЕНА**
**Победители**: \`Мирные жители\`

**Роли игры**:
__Мирные жители.__ Они, по сути, не выполняют никаких функций. Их основная задача – выяснить, кто же является мафией и убивает ни в чём не повинных горожан.
__Мафия__ – это самые главные злодеи, которые по ночам убивают мирных жителей. Мафиози может быть два, три или даже больше, в зависимости от общего количества игроков.
__Доктор__ может лечить горожан, убитых мафией.
__Любовница__ проводит ночь с одним из участников игры и тем самым спасает его от гибели, если на него будут покушаться мафиози. Также у того, кто проведёт ночь с любовницей, будет алиби, а значит против него нельзя будет голосовать днём.
__Комиссар__ следит за порядком и может арестовывать подозреваемых в убийствах.
__Маньяк.__ Он может занять сторону как мирных жителей, так и мафии или просто играть за себя и защищать собственные интересы. По ночам он может убивать всех: мирных жителей и мафию.

**Необходимое количество игроков для начала**: 5 игроков

**Игроков**
${players.join(`\n`)}`)

                                const button = new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                            .setCustomId(`mafia_join`)
                                            .setLabel(`Присоединиться к игре`)
                                            .setStyle(ButtonStyle.Success)
                                            .setEmoji(`🚪`)
                                    )
                                    .addComponents(
                                        new ButtonBuilder()
                                            .setCustomId(`mafia_leave`)
                                            .setLabel(`Выйти из игры`)
                                            .setStyle(ButtonStyle.Danger)
                                            .setEmoji(`🚪`)
                                    )
                                    .addComponents(
                                        new ButtonBuilder()
                                            .setCustomId(`mafia_start`)
                                            .setLabel(`Начать игру`)
                                            .setStyle(ButtonStyle.Success)
                                            .setEmoji(`🚪`)
                                    )
                                    .addComponents(
                                        new ButtonBuilder()
                                            .setCustomId(`mafia_end`)
                                            .setLabel(`Закончить игру`)
                                            .setStyle(ButtonStyle.Danger)
                                            .setEmoji(`🚪`)
                                    )
                                await msg.reply({
                                    embeds: [embed]
                                })
                                await msg.edit({
                                    embeds: [embedNew],
                                    components: [button]
                                })
                                return
                            }
                        } else if (ch) {
                            tr = true
                        }
                    }
                    if (turns[index].turn == `Мирный житель`) {
                        const mur = await gameData.mafia.players.find(p => p.role == `Маньяк`)
                        if (!mur) {
                            await msg.reply({
                                content: `Сегодня ночью был убит: ${gameData.mafia?.mafia_targ ? `<@${gameData.mafia?.mafia_targ}> (${gameData.mafia.players.find(p => p.userid == gameData.mafia?.mafia_targ).role})` : `\`Никто.\``}`
                            })
                        } else {
                            await msg.reply({
                                content: `Сегодня ночью был убит: ${gameData.mafia?.mafia_targ ? `<@${gameData.mafia?.mafia_targ}> (${gameData.mafia.players.find(p => p.userid == gameData.mafia?.mafia_targ).role})` : `\`Никто.\``} & ${gameData.mafia?.murd_targ ? `<@${gameData.mafia.murd_targ}> (${gameData.mafia.players.find(p => p.userid == gameData.mafia?.murd_targ).role})` : `\`Никто.\``}`
                            })
                        }
                        const lov = await gameData.mafia.players.find(p => p.role == `Любовница`)
                        if (lov) {
                            await msg.reply({
                                content: `Сегодня ночью переспали ${gameData.mafia?.love_targ ? `с <@${gameData.mafia?.love_targ}>` : `\`ни с кем.\``}`
                            })
                        }
                        gameData.mafia.players.find(p => p.userid == gameData.mafia?.mafia_targ).role = `Труп`
                        gameData.mafia.players.find(p => p.userid == gameData.mafia?.murd_targ).role = `Труп`
                        for (let player of gameData.mafia.players) {
                            player.votes = 0
                        }
                    } else if (cutTurn == `Мирный житель`) {
                        let filt = await gameData.mafia.players.filter(p => p.role !== `Труп`)
                        let sort = await filt.sort((a, b) => b.votes - a.votes)
                        if (sort[0].votes > 0) {
                            await msg.reply({
                                content: `Большинство проголосовало за <@${sort[0].userid}>. Он выбывает из игры. Его роль: \`${sort[0].role}\``
                            })
                            sort[0].role = `Труп`
                        } else {
                            await msg.reply({
                                content: `Мирные жители не проголосовали ни за кого!`
                            })
                        }
                    } else if (cutTurn == `Мафия`) {
                        let filt = await gameData.mafia.players.filter(p => p.role !== `Мафия`)
                        let targ = [{
                            uid: `n`,
                            votes: -1
                        }]
                        for (let maf of filt) {
                            let chh = await targ.find(t => t?.uid == maf.target)
                            if (!chh) {
                                await targ.push({
                                    uid: maf.target,
                                    votes: 1
                                })
                            } else {
                                chh.votes += 1
                            }
                        }

                        let sort = targ.sort((a, b) => b.votes - a.votes)
                        gameData.mafia.murd_targ = sort[0].uid
                    }
                    gameData.mafia.turn = turns[index].turn
                    gameData.mafia.time = turns[index].time
                    if (curTime == `День` && curTime !== gameData.mafia.time) gameData.mafia.night += 1
                    let checkMafia = gameData.mafia.players.find(p => p.role == `Мафия`)
                    let checkMur = gameData.mafia.players.find(p => p.role == `Маньяк`)
                    let checkInno = gameData.mafia.players.find(p => p.role == `Мирный житель`)
                    let checkHeal = gameData.mafia.players.find(p => p.role == `Доктор`)
                    let checkSher = gameData.mafia.players.find(p => p.role == `Комиссар`)
                    let checkLover = gameData.mafia.players.find(p => p.role == `Любовница`)

                    if (!checkMafia && !checkMur) {
                        const players = await gameData.mafia.players.map((pl, i) => {
                            return `**${++i}** <@${pl.userid}> 🕑`
                        })
                        let embed = new EmbedBuilder()
                            .setColor(Number(linksInfo.bot_color))
                            .setTitle(`Игра в мафию`)
                            .setDescription(`<@${gameData.started_by}> начал игру в Мафию!
**Игроки**
${players.join(`\n`)}

**ИГРА ОКОНЧЕНА**
**Победители**: \`Мирные жители\`

**Ночь ${gameData.mafia.night}**`)
                        for (let player of gameData.mafia.players) {
                            player.votes = 0
                            player.role = ``
                            player.status = ``
                            player.voted = false
                            player.target = ``
                        }

                        const embedNew = new EmbedBuilder()
                            .setColor(Number(linksInfo.bot_color))
                            .setTitle(`Игра в мафию`)
                            .setDescription(`<@${gameData.started_by}> создал комнату в игре в Мафию!
**ИГРА ОКОНЧЕНА**
**Победители**: \`Мирные жители\`

**Роли игры**:
__Мирные жители.__ Они, по сути, не выполняют никаких функций. Их основная задача – выяснить, кто же является мафией и убивает ни в чём не повинных горожан.
__Мафия__ – это самые главные злодеи, которые по ночам убивают мирных жителей. Мафиози может быть два, три или даже больше, в зависимости от общего количества игроков.
__Доктор__ может лечить горожан, убитых мафией.
__Любовница__ проводит ночь с одним из участников игры и тем самым спасает его от гибели, если на него будут покушаться мафиози. Также у того, кто проведёт ночь с любовницей, будет алиби, а значит против него нельзя будет голосовать днём.
__Комиссар__ следит за порядком и может арестовывать подозреваемых в убийствах.
__Маньяк.__ Он может занять сторону как мирных жителей, так и мафии или просто играть за себя и защищать собственные интересы. По ночам он может убивать всех: мирных жителей и мафию.

**Необходимое количество игроков для начала**: 5 игроков

**Игроков**
${players.join(`\n`)}`)

                        const button = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`mafia_join`)
                                    .setLabel(`Присоединиться к игре`)
                                    .setStyle(ButtonStyle.Success)
                                    .setEmoji(`🚪`)
                            )
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`mafia_leave`)
                                    .setLabel(`Выйти из игры`)
                                    .setStyle(ButtonStyle.Danger)
                                    .setEmoji(`🚪`)
                            )
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`mafia_start`)
                                    .setLabel(`Начать игру`)
                                    .setStyle(ButtonStyle.Success)
                                    .setEmoji(`🚪`)
                            )
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`mafia_end`)
                                    .setLabel(`Закончить игру`)
                                    .setStyle(ButtonStyle.Danger)
                                    .setEmoji(`🚪`)
                            )
                        await msg.reply({
                            embeds: [embed]
                        })
                        await msg.edit({
                            embeds: [embedNew],
                            components: [button]
                        })
                        gameData.save()
                        return

                    } else if (!checkInno && !checkHeal && !checkSher && !checkLover) {
                        const players = await gameData.mafia.players.map((pl, i) => {
                            return `**${++i}** <@${pl.userid}> 🕑`
                        })
                        let embed = new EmbedBuilder()
                            .setColor(Number(linksInfo.bot_color))
                            .setTitle(`Игра в мафию`)
                            .setDescription(`<@${gameData.started_by}> начал игру в Мафию!
**Игроки**
${players.join(`\n`)}

**ИГРА ОКОНЧЕНА**
**Победители**: \`Мафия\`

**Ночь ${gameData.mafia.night}**`)
                        const embedNew = new EmbedBuilder()
                            .setColor(Number(linksInfo.bot_color))
                            .setTitle(`Игра в мафию`)
                            .setDescription(`<@${gameData.started_by}> создал комнату в игре в Мафию!
**ИГРА ОКОНЧЕНА**
**Победители**: \`Мафия\`

**Роли игры**:
__Мирные жители.__ Они, по сути, не выполняют никаких функций. Их основная задача – выяснить, кто же является мафией и убивает ни в чём не повинных горожан.
__Мафия__ – это самые главные злодеи, которые по ночам убивают мирных жителей. Мафиози может быть два, три или даже больше, в зависимости от общего количества игроков.
__Доктор__ может лечить горожан, убитых мафией.
__Любовница__ – персонаж вспомогательный. Этот игрок проводит ночь с одним из участников игры и тем самым спасает его от гибели, если на него будут покушаться мафиози.
__Комиссар__ следит за порядком и может арестовывать подозреваемых в убийствах.
__Маньяк.__ Он может занять сторону как мирных жителей, так и мафии или просто играть за себя и защищать собственные интересы. По ночам он может убивать всех: мирных жителей и мафию.

**Необходимое количество игроков для начала**: 5 игроков

**Игроков**
${players.join(`\n`)}`)
                        const button = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`mafia_join`)
                                    .setLabel(`Присоединиться к игре`)
                                    .setStyle(ButtonStyle.Success)
                                    .setEmoji(`🚪`)
                            )
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`mafia_leave`)
                                    .setLabel(`Выйти из игры`)
                                    .setStyle(ButtonStyle.Danger)
                                    .setEmoji(`🚪`)
                            )
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`mafia_start`)
                                    .setLabel(`Начать игру`)
                                    .setStyle(ButtonStyle.Success)
                                    .setEmoji(`🚪`)
                            )
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId(`mafia_end`)
                                    .setLabel(`Закончить игру`)
                                    .setStyle(ButtonStyle.Danger)
                                    .setEmoji(`🚪`)
                            )
                        await msg.reply({
                            embeds: [embed]
                        })
                        await msg.edit({
                            embeds: [embedNew],
                            components: [button]
                        })
                        gameData.save()
                        return
                    }
                    gameData.save()
                    await msg.reply({
                        content: `Сейчас ходит ${gameData.mafia.turn}!`
                    })
                    const players = await gameData.mafia.players.map((pl, i) => {
                        return `**${++i}** <@${pl.userid}> ${pl.role == `Труп` ? `❌` : `✅`}`
                    })
                    let embed = new EmbedBuilder()
                        .setColor(Number(linksInfo.bot_color))
                        .setTitle(`Игра в мафию`)
                        .setDescription(`<@${gameData.started_by}> начал игру в Мафию!
**Игроки**
${players.join(`\n`)}

**Время суток**: \`${turns[index].time}\`
**Ходит**: \`${turns[index].turn}\`

**Ночь ${gameData.mafia.night}**`)
                    await msg.edit({
                        embeds: [embed]
                    })
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
