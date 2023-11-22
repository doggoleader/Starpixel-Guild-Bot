const { Polls } = require(`../../schemas/polls`)
const chalk = require(`chalk`)
const fs = require(`fs`)
const { Guild } = require(`../../schemas/guilddata`)
const { User } = require(`../../schemas/userdata`)
const linksInfo = require(`../../discord structure/links.json`)
const { changeProperty } = require(`../../functions`)
const { checkPlugin } = require("../../functions");
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } = require(`discord.js`)

class PollsUpdates {
    id = 'misc';
    name = `Разное`
    /**
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async StopPolls(client) {
        try {

            if (!await checkPlugin("320193302844669959", this.id)) return;
            const results = await Polls.find({ expire: { $lte: new Date() }, status: "ongoing" })

            for (const result of results) {
                const guild = await client.guilds.fetch(result.guildid)
                const member = await guild.members.fetch(result.userid)
                const dmChannel = await member.createDM()

                const pollChannel = await guild.channels.fetch(result.channelid)
                const pollMsg = await pollChannel.messages.fetch(result.messageid)
                const builderMsg = await dmChannel.messages.fetch(result.builder_message)
                let sort = await result.results.sort((a, b) => b.result - a.result)
                let sum = 0
                let res = sort.map((res, i) => {
                    sum += res.result
                    let percent = ((res.result / result.users.length) * 100).toFixed(1)
                    return `**${++i}.** \`${res.option}\` - ${percent}%`
                })
                const embed = new EmbedBuilder()
                    .setTitle(`Результаты голосования`)
                    .setColor(Number(linksInfo.bot_color))
                    .setDescription(`**Вопрос**: \`${result.question}\`
**Сообщение**: [Нажмите здесь](${pollMsg.url})

**Результаты**:
${res.join(`\n`)}

Пользователей проголосовало: ${result.users.length}
Голосов получено: ${sum}`)
                let max = Number(result.amount)
                if (max > result.options.length) max = Number(result.options.length)
                else max = Number(result.amount)
                let options = []
                for (let option of result.options) {
                    options.push({
                        label: option.label,
                        value: option.value,
                        description: option.description,
                        emoji: option.emoji
                    })
                }
                const pollSelect = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId(`poll_choice`)
                            .setMaxValues(max)
                            .setOptions(options)
                            .setDisabled(true)
                            .setPlaceholder(`Выберите одну из следующих опций`)
                    )
                await pollMsg.reply({
                    embeds: [embed]
                })
                await pollMsg.edit({
                    components: [pollSelect]
                })
                const selectMenu = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId(`poll_settings`)
                            .setPlaceholder(`Выберите, что хотите отредактировать в опросе`)
                            .setDisabled(true)
                            .setOptions(
                                {
                                    label: `Добавить вариант`,
                                    value: `add_option`,
                                    description: `Добавить вариант ответа в ваш опрос`,
                                    emoji: `1️⃣`
                                },
                                {
                                    label: `Удалить вариант`,
                                    value: `remove_option`,
                                    description: `Удалить вариант ответа из вашего опроса`,
                                    emoji: `2️⃣`
                                },
                                {
                                    label: `Изменить вопрос`,
                                    value: `edit_question`,
                                    description: `Изменить вопрос обсуждения опроса`,
                                    emoji: `3️⃣`
                                },
                                {
                                    label: `Изменить макс. количество`,
                                    value: `edit_amount`,
                                    description: `Изменить максимальное количество опций в опросе`,
                                    emoji: `4️⃣`
                                },
                                {
                                    label: `Длительность опроса`,
                                    value: `edit_time`,
                                    description: `Изменить длительность опроса`,
                                    emoji: `5️⃣`
                                },
                                {
                                    label: `Опубликовать опрос`,
                                    value: `start_poll`,
                                    description: `Изменить максимальное количество опций в опросе`,
                                    emoji: `✅`
                                },
                                {
                                    label: `Отменить опрос`,
                                    value: `remove_poll`,
                                    description: `Отменить создание опроса`,
                                    emoji: `❌`
                                },

                            )
                    )
                const getResults = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`poll_get_results`)
                            .setLabel(`Получить результаты`)
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(true)
                    )

                await builderMsg.edit({
                    components: [selectMenu, getResults]
                })
                await builderMsg.reply({
                    embeds: [embed]
                })
                let stream = await fs.createWriteStream(`./src/functions/Polls/Poll Files/Poll.json`)
                let json = JSON.stringify(result, (_, v) => typeof v === 'bigint' ? v.toString() : v)
                stream.once('open', function (fd) {
                    stream.write(json);
                    stream.end();
                });
                let pch = await guild.channels.fetch(`1065698999186763826`)
                let attach = new AttachmentBuilder()
                    .setFile(`./src/functions/Polls/Poll Files/Poll.json`)
                    .setName(`Poll .json`)

                await pch.send({
                    files: [attach]
                })
                await result.delete()
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


module.exports = {
    PollsUpdates
}