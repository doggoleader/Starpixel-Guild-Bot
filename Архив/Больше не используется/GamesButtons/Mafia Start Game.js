const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } = require('discord.js');
const { Games } = require(`../../../src/schemas/games`)
const linksInfo = require(`../../../src/discord structure/links.json`)
const chalk = require(`chalk`)
const wait = require(`node:timers/promises`).setTimeout

module.exports = {
    data: {
        name: "mafia_start"
    },
    async execute(interaction, client) {
        try {
            const gameData = await Games.findOne({ messageid: interaction.message.id })
            if (!gameData) return interaction.message.delete()
            if (gameData.started_by !== interaction.user.id) return interaction.reply({
                content: `Вы не можете начать игру, так как не вы начали её!`,
                ephemeral: true
            })
            if (gameData.mafia.players.length < 5) return interaction.reply({
                content: `Необходимо 5 или более игроков, чтобы начать игру!`,
                ephemeral: true
            })


            let roles = []
            if (gameData.mafia.players.length >= 5 && gameData.mafia.players.length < 7) {
                const amount = gameData.mafia.players.length

                roles = [
                    {
                        name: `Мирный житель`,
                        amount: Math.floor(gameData.mafia.players.length * 0.70),
                    },
                    {
                        name: `Мафия`,
                        amount: Math.floor(gameData.mafia.players.length * 0.30),
                    },
                    {
                        name: `Доктор`,
                        amount: 1,
                    },
                    {
                        name: `Комиссар`,
                        amount: 1,
                    }
                ]
                let i = 1
                let rolesAmount = 0
                for (let r of roles) {
                    rolesAmount += r.amount
                }
                while (amount < rolesAmount) {
                    if (i % 2 == 1) {
                        roles[0].amount += 1
                    } else if (i % 2 == 0) {
                        roles[1].amount += 1
                    }
                    i++
                }
                while (amount > rolesAmount) {
                    if (i % 2 == 1) {
                        roles[0].amount -= 1
                    } else if (i % 2 == 0) {
                        roles[1].amount -= 1
                    }
                    i++
                }
            } else if (gameData.mafia.players.length >= 7 && gameData.mafia.players.length < 10) {
                let amount = gameData.mafia.players.length
                roles = [
                    {
                        name: `Мирный житель`,
                        amount: Math.floor(gameData.mafia.players.length * 0.66),
                    },
                    {
                        name: `Мафия`,
                        amount: Math.floor(gameData.mafia.players.length * 0.34),
                    },
                    {
                        name: `Доктор`,
                        amount: 1,
                    },
                    {
                        name: `Любовница`,
                        amount: 1,
                    },
                    {
                        name: `Комиссар`,
                        amount: 1,
                    }
                ]
                let i = 1
                let rolesAmount = 0
                for (let r of roles) {
                    rolesAmount += r.amount
                }
                while (amount < rolesAmount) {
                    if (i % 2 == 1) {
                        roles[0].amount += 1
                    } else if (i % 2 == 0) {
                        roles[1].amount += 1
                    }
                    i++
                }
                while (amount > rolesAmount) {
                    if (i % 2 == 1) {
                        roles[0].amount -= 1
                    } else if (i % 2 == 0) {
                        roles[1].amount -= 1
                    }
                    i++
                }
            } else if (gameData.mafia.players.length >= 10) {
                let amount = gameData.mafia.players.length
                roles = [
                    {
                        name: `Мирный житель`,
                        amount: Math.floor(gameData.mafia.players.length * 0.65),
                    },
                    {
                        name: `Мафия`,
                        amount: Math.floor(gameData.mafia.players.length * 0.35),
                    },
                    {
                        name: `Доктор`,
                        amount: 1,
                    },
                    {
                        name: `Любовница`,
                        amount: 1,
                    },
                    {
                        name: `Комиссар`,
                        amount: 1,
                    },
                    {
                        name: `Маньяк`,
                        amount: 1,
                    }
                ]
                let i = 1
                let rolesAmount = 0
                for (let r of roles) {
                    rolesAmount += r.amount
                }
                while (amount < rolesAmount) {
                    if (i % 2 == 1) {
                        roles[0].amount += 1
                    } else if (i % 2 == 0) {
                        roles[1].amount += 1
                    }
                    i++
                }
                while (amount > rolesAmount) {
                    if (i % 2 == 1) {
                        roles[0].amount -= 1
                    } else if (i % 2 == 0) {
                        roles[1].amount -= 1
                    }
                    i++
                }
            }

            for (const player of gameData.mafia.players) {
                let roless = await roles.filter(r => r.amount > 0)
                if (roless.length > 0) {
                    let r_role = roless[Math.floor(Math.random() * roless.length)]
                    player.role = r_role.name
                    r_role.amount -= 1
                }
            }

            gameData.save()
            const players = await gameData.mafia.players.map((pl, i) => {
                return `**${++i}** <@${pl.userid}> ✅`
            })
            const actionMenu = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`mafia_getactionmenu`)
                        .setEmoji(``)
                )
            await interaction.reply({
                content: `Вы начали игру в Мафию!`,
                ephemeral: true
            })
            let embed = new EmbedBuilder()
                .setColor(Number(linksInfo.bot_color))
                .setTitle(`Игра в мафию`)
                .setDescription(`<@${gameData.started_by}> начал игру в Мафию!
**Игроки**
${players.join(`\n`)}

Роли были успешно всем выданы! Вы не можете покинуть игру, пока текущая игра __не закончится__! Храните свою роль в тайне!
Чтобы открыть меню управления вашими действиями, нажмите на кнопку ниже!

**Игра начнётся через 3...**`)
            await interaction.message.edit({
                embeds: [embed]
            })

            await wait(1000)
            embed = new EmbedBuilder()
                .setColor(Number(linksInfo.bot_color))
                .setTitle(`Игра в мафию`)
                .setDescription(`<@${gameData.started_by}> начал игру в Мафию!
**Игроки**
${players.join(`\n`)}

Роли были успешно всем выданы! Вы не можете покинуть игру, пока текущая игра __не закончится__! Храните свою роль в тайне!
Чтобы открыть меню управления вашими действиями, нажмите на кнопку ниже!

**Игра начнётся через 2...**`)
            await interaction.message.edit({
                embeds: [embed]
            })
            await wait(1000)
            embed = new EmbedBuilder()
                .setColor(Number(linksInfo.bot_color))
                .setTitle(`Игра в мафию`)
                .setDescription(`<@${gameData.started_by}> начал игру в Мафию!
**Игроки**
${players.join(`\n`)}

**Время суток**: \`День.\`
**Действие**: \`Нажмите на кнопку получения меню действия вашей роли, чтобы узнать вашу роль.\`

**Игра началась!**`)
            await interaction.message.edit({
                embeds: [embed],
                components: [actionMenu]
            })
            client.MafiaTimer(interaction.message)
        } catch (e) {
            const admin = await client.users.fetch(`491343958660874242`)
            console.log(e)
            let options = interaction?.options.data.map(a => {
                return `{
"status": true,
"name": "${a.name}",
"type": ${a.type},
"autocomplete": ${a?.autocomplete ? true : false},
"value": "${a?.value ? a.value : "No value"}",
"user": "${a?.user?.id ? a.user.id : "No User"}",
"channel": "${a?.channel?.id ? a.channel.id : "No Channel"}",
"role": "${a?.role?.id ? a.role.id : "No Role"}",
"attachment": "${a?.attachment?.url ? a.attachment.url : "No Attachment"}"
}`
            })
            await admin.send(`Произошла ошибка!`)
            await admin.send(`=> ${e}.
**ID кнопки**: \`${interaction.customId}\`
**Пользователь**: ${interaction.member}
**Канал**: ${interaction.channel}
**Опции**: \`\`\`json
${interaction.options.data.length <= 0 ? `{"status": false}` : options.join(`,\n`)}
\`\`\``)
            await admin.send(`◾`)
        }

    }
}
