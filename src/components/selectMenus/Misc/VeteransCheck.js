const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } = require('discord.js');
const { Apply } = require(`../../../schemas/applications`)
const linksInfo = require(`../../../discord structure/links.json`);
const ch_list = require(`../../../discord structure/channels.json`);
const { User } = require('../../../schemas/userdata');
const api = process.env.hypixel_apikey
const { tasks } = require(`../../../jsons/New Start.json`);
const prettyMilliseconds = require(`pretty-ms`)
const fetch = require(`node-fetch`);
const { getProperty } = require('../../../functions');
const veterans = require(`../../../jsons/Veterans.json`);
const { menuCheckVeterans } = require('../../../misc_functions/Exporter');
/**
 * 
 * @param {import("discord.js").StringSelectMenuInteraction} interaction Interaction
 * @param {import("../../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        await interaction.deferReply({ ephemeral: true, fetchReply: true })
        const { member, user, guild } = interaction;
        const userData = await User.findOne({ userid: user.id, guildid: guild.id })
        await interaction.message.edit({
            components: [menuCheckVeterans]
        })
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
        if (action == `info`) {
            const quest = veterans.veterans.find(q => q.id == userData.quests.veterans.activated.id)
            if (!quest) return interaction.editReply({
                content: `Не удалось найти ваш квест!`,
                ephemeral: true
            })
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

**Игры**: ${quest.game}
**Требование**: ${quest.task}
**Необходимое количество побед**: ${quest.req}

**Побед в режиме сейчас**: ${wins}
**Побед на конец задания**: ${userData.quests.veterans.activated.required}
**Осталось побед**: ${fin_res}
**Награда**: <@&${userData.quests.veterans.activated.reward}>

**Статус**: \`${userData.quests.veterans.activated.status ? `✅ Завершено` : `❌ Не завершено`}\``)

            await interaction.editReply({
                embeds: [embed]
            })
        } else if (action == `end`) {
            const quest = veterans.veterans.find(q => q.id == userData.quests.veterans.activated.id)
            if (!quest) return interaction.editReply({
                content: `Не удалось найти ваш квест!`,
                ephemeral: true
            })
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
            if (member.roles.cache.has(userData.quests.veterans.activated.reward)) {
                if (userData.stacked_items.length < userData.upgrades.inventory_size) {
                    await userData.stacked_items.push(userData.quests.veterans.activated.reward)
                } else return interaction.editReply({
                    content: `Мы не можем добавить предмет в ваш инвентарь, так как он переполнен. Чтобы увеличить вместительность своего инвентаря, перейдите в канал <#1141026403765211136>!`,
                    ephemeral: true
                })
            } else {
                await member.roles.add(userData.quests.veterans.activated.reward)
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
                .setDescription(`**Вы выполнили задание для ветеранов!**

**Задание**: ${quest.task}
**Игра**: ${quest.game}
**Награда**: <@&${userData.quests.veterans.activated.reward}>
**Текущее количество побед**: ${wins}`)
            await interaction.editReply({
                embeds: [embed]
            })


            await interaction.guild.channels.cache.get(ch_list.main)
                .send({
                    embeds: [embed.setDescription(`**${member} выполнил задание для ветеранов!**

**Задание**: ${quest.task}
**Игра**: ${quest.game}
**Награда**: <@&${userData.quests.veterans.activated.reward}>
**Текущее количество побед**: ${wins}`)]
                })
        } else if (action == `start`) {

            if (userData.quests.veterans.activated.status == false) return interaction.editReply({
                content: `Вы ещё не выполнили текущее задание! Если вы не можете его выполнить, вы можете пропустить задание, однако оно не будет зачтено вам в статистику и вы не получите награду!`,
                ephemeral: true
            })

            if (userData.upgrades.veterans_quests <= 0) return interaction.editReply({
                content: `Вы уже выполнили максимально возможное количество заданий для ветеранов на этой неделе! Если вы хотите выполнять больше заданий, перейдите в канал <#1141026403765211136>!`,
                ephemeral: true
            })
            const loot = veterans.rewards
            let chances = []
            let sum = 0;
            for (let i = 0; i < loot.length; i++) {
                sum += loot[i].chance
                chances.push(loot[i].chance)
            }
            let r_loot = Math.floor(Math.random() * sum);
            let i = 0;
            for (let s = chances[0]; s <= r_loot; s += chances[i]) {
                i++;
            }
            let allChances = 0;
            for (let loo of loot) {
                allChances += loo.chance
            }
            let finalChance1 = ((loot[i].chance / allChances) * 100).toFixed(1)

            let quest1 = veterans.veterans[Math.floor(Math.random() * veterans.veterans.length)]

            let quest2 = veterans.veterans[Math.floor(Math.random() * veterans.veterans.length)]
            while (quest2.id == quest1.id) {
                quest2 = veterans.veterans[Math.floor(Math.random() * veterans.veterans.length)]
            }

            let quest3 = veterans.veterans[Math.floor(Math.random() * veterans.veterans.length)]
            while (quest3.id == quest1.id || quest3.id == quest2.id) {
                quest3 = veterans.veterans[Math.floor(Math.random() * veterans.veterans.length)]
            }


            const buttons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`veterans_choose_1`)
                        .setLabel(`${quest1.game}`)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(`1️⃣`)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`veterans_choose_2`)
                        .setLabel(`${quest2.game}`)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(`2️⃣`)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`veterans_choose_3`)
                        .setLabel(`${quest3.game}`)
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(`3️⃣`)
                )

            const embed2 = new EmbedBuilder()
                .setColor(Number(linksInfo.bot_color))
                .setTimestamp(Date.now())
                .setDescription(`## Задание для ветеранов
            
Выберите одно из следующих заданий для ветеранов:
1. ${quest1.task}
2. ${quest2.task}
3. ${quest3.task}

Чтобы выбрать задание, нажмите на кнопку ниже`)

            const msg = await interaction.editReply({
                embeds: [embed2],
                components: [buttons],
                fetchReply: true
            })

            const collector = await msg.createMessageComponentCollector()
            collector.on('collect', async int => {
                await int.deferUpdate();

                let quest

                if (int.customId == 'veterans_choose_1') {
                    quest = quest1
                } else if (int.customId == `veterans_choose_2`) {
                    quest = quest2
                } else if (int.customId == `veterans_choose_3`) {
                    quest = quest3
                }

                let wins = await getProperty(json_pl.player.stats, quest.code)
                if (!wins) wins = 0

                let vetQuest = userData.quests.veterans.activated
                vetQuest.id = quest.id
                vetQuest.required = wins + quest.req
                vetQuest.status = false
                vetQuest.reward = loot[i].reward
                userData.upgrades.veterans_quests -= 1


                userData.save()
                const embed = new EmbedBuilder()
                    .setTitle(`Пользователь ${user.username} начал задание для ветеранов!`)
                    .setColor(Number(linksInfo.bot_color))
                    .setThumbnail(`https://minotar.net/helm/${userData.uuid}.png`)
                    .setTimestamp(Date.now())
                    .setDescription(`Вы начали выполнять задание для ветеранов!
**Ваше задание:** ${quest.task}                
**Игра:** ${quest.game}
**Количество побед на начало:** ${wins}
**Количество побед на конец:** ${vetQuest.required}
**Награда:** <@&${loot[i].reward}> (Шанс: **${finalChance1}%**)
Вы можете проверить его с помощью меню в сообщении выше!

**Осталось выполнить заданий на этой неделе: ${userData.upgrades.veterans_quests}**`)
                await interaction.editReply({
                    embeds: [embed],
                    components: []
                })
            })
        } else if (action == `skip`) {

            if (userData.quests.veterans.activated.status == true) return interaction.editReply({
                content: `Вы уже выполнили задание или пропустили его! Теперь вы можете выбрать следующее задание!`,
                ephemeral: true
            })

            userData.quests.veterans.activated.status = true
            userData.save()

            await interaction.editReply({
                content: `Вы успешно пропустили текущее задание! Теперь вы можете выбрать следующее. Помните, что повторно пропустить задание вы сможете только через 8 часов!`,
                ephemeral: true
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

module.exports = {
    plugin: {
        id: "hypixel",
        name: "Hypixel"
    },
    data: {
        name: "veterans_check_menu"
    },
    execute
}