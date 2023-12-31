const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const { User } = require(`../../schemas/userdata`);
const chalk = require(`chalk`);
const ch_list = require(`../../discord structure/channels.json`)
const { calcActLevel, getLevel } = require(`../../functions`)

/**
 * 
 * @param {import("discord.js").ChatInputCommandInteraction} interaction Interaction
 * @param {import("../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
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
        await admin.send({
            content: `-> \`\`\`${e.stack}\`\`\``
        }).catch()
    }



}
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
    execute
}