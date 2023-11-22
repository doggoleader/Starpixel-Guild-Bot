const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } = require('discord.js');
const { Apply } = require(`../../../schemas/applications`)
const linksInfo = require(`../../../discord structure/links.json`);
const ch_list = require(`../../../discord structure/channels.json`);
const { User } = require('../../../schemas/userdata');
const api = process.env.hypixel_apikey
const { tasks } = require(`../../../jsons/New Start.json`);
const fetch = require(`node-fetch`);
const { getProperty } = require('../../../functions');
const marathon = require(`../../../jsons/Marathon.json`)
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
        const quest = marathon.ids.find(q => q.id == userData.quests.marathon.activated.id)
        if (!quest) return interaction.editReply({
            content: `Не удалось найти ваш квест!`,
            ephemeral: true
        })
        const ids = quest.code.split(`.`)
        if (action == `info`) {
            let wins = await getProperty(json_pl.player.stats, quest.code)
            if (!wins) wins = 0
            let fin_res
            if (userData.quests.marathon.activated.required - wins <= 0) fin_res = 0
            else fin_res = userData.quests.marathon.activated.required - wins
            const embed = new EmbedBuilder()
                .setTitle(`Информация о марафоне пользователя ${user.username}`)
                .setColor(Number(linksInfo.bot_color))
                .setThumbnail(`https://minotar.net/helm/${userData.uuid}.png`)
                .setTimestamp(Date.now())
                .setDescription(`**Основная информация о вашем марафоне**

**Игра**: ${quest.game}
**Необходимое количество побед**: ${quest.req}
**Стадия**: ${userData.quests.marathon.activated.stage}

**Побед в режиме сейчас**: ${wins}
**Побед на конец стадии**: ${userData.quests.marathon.activated.required}
**Осталось побед**: ${fin_res}

**Статус**: \`${userData.quests.marathon.activated.status ? `✅ Завершена` : `❌ Не завершена`}\``)

            await interaction.editReply({
                embeds: [embed]
            })
        } else if (action == `end`) {
            let wins = await getProperty(json_pl.player.stats, quest.code)
            if (!wins) wins = 0
            if (userData.quests.marathon.activated.status == true) return interaction.editReply({
                content: `Вы уже выполнили этот квест!`,
                ephemeral: true
            })
            if (wins < userData.quests.marathon.activated.required) return interaction.editReply({
                content: `Вы не получили достаточного количества побед для завершения этого квеста! Чтобы получить информацию о квесте, выберите в меню опцию "Посмотреть информацию"!`,
                ephemeral: true
            })
            let stage = userData.quests.marathon.activated.stage
            let str
            if (stage == 1) {
                let reward = `510932601721192458`
                str = `<@&${reward}>`

                if (member.roles.cache.has(reward)) {
                    if (userData.stacked_items.length < userData.upgrades.inventory_size) {
                        await userData.stacked_items.push(reward)
                    } else return interaction.editReply({
                        content: `Мы не можем добавить предмет в ваш инвентарь, так как он переполнен. Чтобы увеличить вместительность своего инвентаря, перейдите в канал <#1141026403765211136>!`,
                        ephemeral: true
                    })
                } else {
                    await member.roles.add(reward)
                }
            } else if (stage == 2) {
                let reward = `521248091853291540`
                str = `<@&${reward}>`

                if (member.roles.cache.has(reward)) {
                    if (userData.stacked_items.length < userData.upgrades.inventory_size) {
                        await userData.stacked_items.push(reward)
                    } else return interaction.editReply({
                        content: `Мы не можем добавить предмет в ваш инвентарь, так как он переполнен. Чтобы увеличить вместительность своего инвентаря, перейдите в канал <#1141026403765211136>!`,
                        ephemeral: true
                    })
                } else {
                    await member.roles.add(reward)
                }
            } else if (stage == 3) {
                let reward = 50
                str = `${reward}💠`

                userData.rank += reward
            } else if (stage == 4) {
                let reward = `992820494900412456`
                str = `<@&${reward}>`

                if (member.roles.cache.has(reward)) {
                    if (userData.stacked_items.length < userData.upgrades.inventory_size) {
                        await userData.stacked_items.push(reward)
                    } else return interaction.editReply({
                        content: `Мы не можем добавить предмет в ваш инвентарь, так как он переполнен. Чтобы увеличить вместительность своего инвентаря, перейдите в канал <#1141026403765211136>!`,
                        ephemeral: true
                    })
                } else {
                    await member.roles.add(reward)
                }
            } else if (stage == 5) {
                let reward = `730891493375475786`
                if (member.roles.cache.has(reward)) reward = `584673040470769667`
                str = `<@&${reward}>`
                userData.quests.marathon.stats.total_mar += 1
                if (member.roles.cache.has(reward)) {
                    if (userData.stacked_items.length < userData.upgrades.inventory_size) {
                        await userData.stacked_items.push(reward)
                    } else return interaction.editReply({
                        content: `Мы не можем добавить предмет в ваш инвентарь, так как он переполнен. Чтобы увеличить вместительность своего инвентаря, перейдите в канал <#1141026403765211136>!`,
                        ephemeral: true
                    })
                } else {
                    await member.roles.add(reward)
                }
            }
            userData.quests.marathon.stats.total_stages += 1


            userData.quests.marathon.completed.push(stage)
            userData.quests.marathon.activated.status = true
            userData.save()

            const embed = new EmbedBuilder()
                .setTitle(`Стадия ${stage} марафона пользователя ${user.username} была выполнена!`)
                .setColor(Number(linksInfo.bot_color))
                .setThumbnail(`https://minotar.net/helm/${userData.uuid}.png`)
                .setTimestamp(Date.now())
                .setDescription(`**Вы выполнили ${stage} стадию марафона!**

**Игра**: ${quest.game}
**Награда**: ${str}
**Текущее количество побед**: ${wins}`)
            await interaction.editReply({
                embeds: [embed]
            })

            await interaction.guild.channels.cache.get(ch_list.main)
                .send({
                    embeds: [embed.setDescription(`**${member} выполнил ${stage} стадию марафона!**

**Игра**: ${quest.game}
**Награда**: ${str}
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

module.exports = {
    plugin: {
        id: "hypixel",
        name: "Hypixel"
    },
    data: {
        name: "marathon_check_menu"
    },
    execute
}