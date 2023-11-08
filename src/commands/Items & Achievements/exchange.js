const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { execute } = require('../../events/client/start_bot/ready');
const { User } = require(`../../schemas/userdata`);
const chalk = require(`chalk`);
const ch_list = require(`../../discord structure/channels.json`)
const { calcActLevel, getLevel } = require(`../../functions`)
const linksInfo = require(`../../discord structure/links.json`)

module.exports = {
    category: `shop`,
    plugin: {
        id: "items",
        name: "Предметы"
    },
    data: new SlashCommandBuilder()
        .setName(`exchange`)
        .setDescription(`Обменять предметы`)
        .setDMPermission(false)
        .addSubcommand(sb => sb
            .setName(`medals`)
            .setDescription(`Обменять медали на билеты`)
            .addStringOption(o => o
                .setName(`медаль`)
                .setDescription(`Медаль, которую вы хотите обменять`)
                .setChoices(
                    {
                        name: `Медаль🥇`,
                        value: `Медаль🥇`
                    },
                    {
                        name: `Медаль🥈`,
                        value: `Медаль🥈`
                    },
                    {
                        name: `Медаль🥉`,
                        value: `Медаль🥉`
                    }
                )
                .setRequired(true)
            )
            .addIntegerOption(o => o
                .setName(`количество`)
                .setDescription(`Количество медалей, которое вы хотите обменять`)
                .setMinValue(1)
                .setRequired(true)
            )
        ),

    async execute(interaction, client) {
        try {
            const userData = await User.findOne({ userid: interaction.user.id })
            switch (interaction.options.getSubcommand()) {
                case `medals`: {
                    let value = interaction.options.getInteger(`количество`)
                    let final
                    if (interaction.options.getString(`медаль`) == `Медаль🥇`) {
                        if (userData.medal_1 < value) return interaction.reply({
                            content: `Вы не можете обменять больше медалей, чем у вас имеется! (${userData.medal_1})`,
                            ephemeral: true
                        })

                        userData.medal_1 -= value
                        final = value * 30
                        userData.tickets += final
                        userData.progress.items.find(it => it.name == 'TICKETS_TOTAL').total_items += final
                    } else if (interaction.options.getString(`медаль`) == `Медаль🥈`) {
                        if (userData.medal_2 < value) return interaction.reply({
                            content: `Вы не можете обменять больше медалей, чем у вас имеется! (${userData.medal_2})`,
                            ephemeral: true
                        })

                        userData.medal_2 -= value
                        final = value * 20
                        userData.tickets += final
                        userData.progress.items.find(it => it.name == 'TICKETS_TOTAL').total_items += final

                    } else if (interaction.options.getString(`медаль`) == `Медаль🥉`) {
                        if (userData.medal_3 < value) return interaction.reply({
                            content: `Вы не можете обменять больше медалей, чем у вас имеется! (${userData.medal_3})`,
                            ephemeral: true
                        })

                        userData.medal_3 -= value
                        final = value * 10
                        userData.tickets += final
                        userData.progress.items.find(it => it.name == 'TICKETS_TOTAL').total_items += final
                    }
                    userData.save()
                    await interaction.reply({
                        content: `Вы обменяли ${value} \`${interaction.options.getString(`медаль`)}\` на ${final} билетов! У вас стало:
- ${userData.medal_1} 🥇
- ${userData.medal_2} 🥈
- ${userData.medal_3} 🥉
- ${userData.tickets} 🏷`,
                        ephemeral: true
                    })
                }
                    break;

                default:
                    break;
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
**Команда**: \`${interaction.commandName}\`
**Пользователь**: ${interaction.member}
**Канал**: ${interaction.channel}
**Опции**: \`\`\`json
${interaction.options.data.length <= 0 ? `{"status": false}` : options.join(`,\n`)}
\`\`\``)
            await admin.send(`◾`)
        }



    }
}