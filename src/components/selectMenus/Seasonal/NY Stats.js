const { Temp } = require(`../../../schemas/temp_items`)
const { User } = require(`../../../schemas/userdata`)
const { Guild } = require(`../../../schemas/guilddata`)
const chalk = require(`chalk`)
const fetch = require(`node-fetch`)
const cron = require(`node-cron`)
const prettyMilliseconds = require(`pretty-ms`)
const ch_list = require(`../../../discord structure/channels.json`)
const { EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")

const { achievementStats, found, getProperty } = require(`../../../functions`)
const linksInfo = require(`../../../discord structure/links.json`)
const { lb_newyear, gift_newyear, stats_newyear, quests_newyear } = require("../../../misc_functions/Exporter")
const api = process.env.hypixel_apikey
/**
 * 
 * @param {import("discord.js").UserSelectMenuInteraction} interaction Interaction
 * @param {import("../../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        const msg = await interaction.deferReply({ fetchReply: true, ephemeral: true })
        await interaction.message.edit({
            components: [lb_newyear, stats_newyear, gift_newyear, quests_newyear]
        })
        const guildData = await Guild.findOne({ id: interaction.guild.id })
        if (guildData.plugins.seasonal === false) return interaction.editReply({ content: `Данный плагин отключён! Попробуйте позже!`, ephemeral: true })
        if (guildData.seasonal.new_year.enabled === false) return interaction.editReply({
            content: `Сейчас не время для Нового года! Попробуйте сделать это в период **1 декабря по 18 января**!`,
            ephemeral: true
        })

        const member = await interaction.guild.members.fetch(interaction.values[0])
        const { user } = member
        if (user.bot) return interaction.editReply({
            content: `${user} является ботом, а значит он не может получать новогодние очки :'(`,
            ephemeral: true
        })
        if (!member.roles.cache.has(`504887113649750016`)) return interaction.editReply({
            content: `${member} является гостем гильдии, а значит у него новогодних очков!`,
            ephemeral: true
        })
        const users = await User.find().then(users => {
            return users.filter(async user => await interaction.guild.members.fetch(user.userid))
        })
        const sorts = users.sort((a, b) => {
            return b.seasonal.new_year.points - a.seasonal.new_year.points
        })
        var i = 0
        while (sorts[i].userid !== user.id) {
            i++
        }
        const userData = await User.findOne({ userid: user.id, guildid: interaction.guild.id })
        let rank = i + 1

        let button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`exchange_snowflakes`)
                    .setLabel(`Обменять снежинки на румбики`)
                    .setEmoji(`💱`)
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(interaction.user.id == userData.userid ? false : true)
            )
        const embed = new EmbedBuilder()
            .setTitle(`Новогодняя статистика пользователя ${user.username}`)
            .setDescription(`**Позиция в топе**: ${rank}
**Очков**: ${userData.seasonal.new_year.points}
**Снежинок**: ${userData.seasonal.new_year.snowflakes}:snowflake:
**Открыто подарков**: ${userData.seasonal.new_year.opened_gifts}
**Выполнено квестов**: ${userData.seasonal.new_year.quests_completed}
**Подарено наборов**: ${userData.seasonal.new_year.gifted_packs}
**Собрано костюмов**: ${userData.seasonal.new_year.suits_returned}

**КОСТЮМ ДЕДА МОРОЗА**
**Шапка**: \`${userData.seasonal.new_year.santa_suit.hat ? `Найдено ✅` : `Не найдено ❌`}\`
**Шуба**: \`${userData.seasonal.new_year.santa_suit.chest ? `Найдено ✅` : `Не найдено ❌`}\`
**Варежки**: \`${userData.seasonal.new_year.santa_suit.gloves ? `Найдено ✅` : `Не найдено ❌`}\`
**Мешок**: \`${userData.seasonal.new_year.santa_suit.bag ? `Найдено ✅` : `Не найдено ❌`}\`

**ДОСТИЖЕНИЯ**
**Достижение №1**: ${achievementStats(userData.seasonal.new_year.achievements.num1)}
**Достижение №2**: ${achievementStats(userData.seasonal.new_year.achievements.num2)}
**Достижение №3**: ${achievementStats(userData.seasonal.new_year.achievements.num3)}
**Достижение №4**: ${achievementStats(userData.seasonal.new_year.achievements.num4)}
**Достижение №5**: ${achievementStats(userData.seasonal.new_year.achievements.num5)}
**Достижение №6**: ${achievementStats(userData.seasonal.new_year.achievements.num6)}

**ТЕКУЩИЙ КВЕСТ**
**Условие**: \`${userData.seasonal.new_year.quest.description} \`
**Количество на начало квеста**: ${userData.seasonal.new_year.quest.before}
**Количество на конец квеста**: ${userData.seasonal.new_year.quest.requirement}
**Статус**: \`${userData.seasonal.new_year.quest.finished ? `Завершено ✅` : `Не завершено ❌`}\``)
            .setThumbnail(user.displayAvatarURL())
            .setColor(Number(linksInfo.bot_color))
            .setTimestamp(Date.now())

        await interaction.editReply({
            embeds: [embed],
            components: [button],
            ephemeral: true,
            fetchReply: true
        })

        const collector = await msg.createMessageComponentCollector()

        collector.on('collect', async i => {
            if (userData.seasonal.new_year.snowflakes < 50) return i.reply({
                content: `Вы не можете обменять ваши снежинки, так как вы не заработали достаточное количество для обмена (50 :snowflake: -> 100 <:Rumbik:883638847056003072>)!`,
                ephemeral: true
            })


            userData.seasonal.new_year.snowflakes -= 50;
            userData.rumbik += 100;
            userData.progress.items.find(it => it.name == 'RUMBIKS_TOTAL').total_items += 100
            userData.save()

            button = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`exchange_snowflakes`)
                        .setLabel(`Обменять снежинки на румбики`)
                        .setEmoji(`💱`)
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(interaction.user.id == userData.userid ? false : true)
                )
            await i.reply({
                content: `Вы успешно обменяли 50 :snowflake: на 100 <:Rumbik:883638847056003072>! У вас сейчас ${userData.seasonal.new_year.snowflakes}:snowflake: и ${userData.rumbik}<:Rumbik:883638847056003072>!`,
                ephemeral: true
            })
            embed.setDescription(`**Позиция в топе**: ${rank}
**Очков**: ${userData.seasonal.new_year.points}
**Снежинок**: ${userData.seasonal.new_year.snowflakes}:snowflake:
**Открыто подарков**: ${userData.seasonal.new_year.opened_gifts}
**Выполнено квестов**: ${userData.seasonal.new_year.quests_completed}
**Подарено наборов**: ${userData.seasonal.new_year.gifted_packs}
**Собрано костюмов**: ${userData.seasonal.new_year.suits_returned}

**КОСТЮМ ДЕДА МОРОЗА**
**Шапка**: \`${userData.seasonal.new_year.santa_suit.hat ? `Найдено ✅` : `Не найдено ❌`}\`
**Шуба**: \`${userData.seasonal.new_year.santa_suit.chest ? `Найдено ✅` : `Не найдено ❌`}\`
**Варежки**: \`${userData.seasonal.new_year.santa_suit.gloves ? `Найдено ✅` : `Не найдено ❌`}\`
**Мешок**: \`${userData.seasonal.new_year.santa_suit.bag ? `Найдено ✅` : `Не найдено ❌`}\`

**ДОСТИЖЕНИЯ**
**Достижение №1**: ${achievementStats(userData.seasonal.new_year.achievements.num1)}
**Достижение №2**: ${achievementStats(userData.seasonal.new_year.achievements.num2)}
**Достижение №3**: ${achievementStats(userData.seasonal.new_year.achievements.num3)}
**Достижение №4**: ${achievementStats(userData.seasonal.new_year.achievements.num4)}
**Достижение №5**: ${achievementStats(userData.seasonal.new_year.achievements.num5)}
**Достижение №6**: ${achievementStats(userData.seasonal.new_year.achievements.num6)}

**ТЕКУЩИЙ КВЕСТ**
**Условие**: \`${userData.seasonal.new_year.quest.description} \`
**Количество на начало квеста**: ${userData.seasonal.new_year.quest.before}
**Количество на конец квеста**: ${userData.seasonal.new_year.quest.requirement}
**Статус**: \`${userData.seasonal.new_year.quest.finished ? `Завершено ✅` : `Не завершено ❌`}\``)
            await interaction.editReply({
                embeds: [embed],
                components: [button],
                fetchReply: true
            })
        })

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
module.exports = {
    plugin: {
        id: "seasonal",
        name: "Сезонное"
    },
    data: {
        name: `season_newyear_stats`
    },
    execute
}
