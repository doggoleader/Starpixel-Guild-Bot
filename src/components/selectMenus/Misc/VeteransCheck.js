const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } = require('discord.js');
const { Apply } = require(`../../../schemas/applications`)
const linksInfo = require(`../../../discord structure/links.json`);
const ch_list = require(`../../../discord structure/channels.json`);
const { User } = require('../../../schemas/userdata');
const api = process.env.hypixel_apikey
const { tasks } = require(`../../../jsons/New Start.json`);
const fetch = require(`node-fetch`);
const { getProperty } = require('../../../functions');
const veterans = require(`../../../jsons/Veterans.json`)

module.exports = {
    plugin: {
        id: "hypixel",
        name: "Hypixel"
    },
    data: {
        name: "veterans_check_menu"
    },
    async execute(interaction, client) {
        try {
            await interaction.deferReply({ ephemeral: true, fetchReply: true })
            const { member, user, guild } = interaction;
            const userData = await User.findOne({ userid: user.id, guildid: guild.id })
            if (!userData.onlinemode) return interaction.editReply({
                content: `Вы не можете использовать данное меню, так как у вас нелицензированный аккаунт!`,
                ephemeral: true
            })
            const response = await fetch(`https://api.hypixel.net/player?uuid=${userData.uuid}`, {
                headers: {
                    "API-Key": api,
                    "Content-Type": "application/json"
                }
            })
            let json_pl
            if (response.ok) {
                json_pl = await response.json()
            }

            const action = interaction.values[0];
            const quest = veterans.veterans.find(q => q.id == userData.quests.veterans.activated.id)
            if (!quest) return interaction.editReply({
                content: `Не удалось найти ваш квест!`,
                ephemeral: true
            })
            if (action == `info`) {
                let wins = await getProperty(json_pl.player.stats, quest.code)
                if (!wins) wins = 0
                let fin_res
                if (userData.quests.veterans.activated.required - wins <= 0) fin_res = 0
                else fin_res = userData.quests.veterans.activated.required - wins
                const embed = new EmbedBuilder()
                    .setTitle(`Информация о задании пользователя ${user.username}`)
                    .setColor(Number(linksInfo.bot_color))
                    .setThumbnail(`https://minotar.net/helm/${userData.uuid}.png`)
                    .setTimestamp(Date.now())
                    .setDescription(`**Основная информация о вашем задании для ветеранов**

**Задание**: ${quest.name}
**Требование**: ${quest.task}
**Необходимое количество побед**: ${quest.req}

**Побед в режиме сейчас**: ${wins}
**Побед на конец задания**: ${userData.quests.veterans.activated.required}
**Осталось побед**: ${fin_res}

**Статус**: \`${userData.quests.veterans.activated.status ? `✅ Завершено` : `❌ Не завершено`}\``)

                await interaction.editReply({
                    embeds: [embed]
                })
            } else if (action == `end`) {
                let wins = await getProperty(json_pl.player.stats, quest.code)
                if (!wins) wins = 0
                if (userData.quests.veterans.activated.status == true) return interaction.editReply({
                    content: `Вы уже выполнили это задание!`,
                    ephemeral: true
                })
                if (wins < userData.quests.veterans.activated.required) return interaction.editReply({
                    content: `Вы не получили достаточного количества побед для завершения этого задания! Чтобы получить информацию о задании, выберите в меню выше кнопку "Посмотреть информацию"!`,
                    ephemeral: true
                })
                let id = userData.quests.veterans.activated.id
                if (member.roles.cache.has(quest.reward)) {
                    if (userData.stacked_items.length < userData.upgrades.inventory_size) {
                        await userData.stacked_items.push(quest.reward)
                    } else return interaction.editReply({
                        content: `Мы не можем добавить предмет в ваш инвентарь, так как он переполнен. Чтобы увеличить вместительность своего инвентаря, перейдите в канал <#1141026403765211136>!`,
                        ephemeral: true
                    })
                } else {
                    await member.roles.add(quest.reward)
                }


                userData.quests.veterans.stats.total += 1
                userData.quests.veterans.completed.push(id)
                userData.quests.veterans.activated.status = true
                userData.save()

                const embed = new EmbedBuilder()
                    .setTitle(`Пользователь ${user.username} выполнил задание для ветеранов!`)
                    .setColor(Number(linksInfo.bot_color))
                    .setThumbnail(`https://minotar.net/helm/${userData.uuid}.png`)
                    .setTimestamp(Date.now())
                    .setDescription(`**Вы выполнили задание "${quest.name}"!**

**Игра**: ${quest.game}
**Награда**: <@&${quest.reward}>
**Текущее количество побед**: ${wins}`)
                await interaction.editReply({
                    embeds: [embed]
                })


                await interaction.guild.channels.cache.get(ch_list.main)
                    .send({
                        embeds: [embed.setDescription(`**${member} выполнил задание "${quest.name}"!**

**Игра**: ${quest.game}
**Награда**: <@&${quest.reward}>
**Текущее количество побед**: ${wins}`)]
                    })
            }
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
**ID меню**: \`${interaction.customId}\`
**Пользователь**: ${interaction.member}
**Канал**: ${interaction.channel}
**Опции**: \`\`\`json
${interaction.options.data.length <= 0 ? `{"status": false}` : options.join(`,\n`)}
\`\`\``)
            await admin.send(`◾`)
        }


    }
}