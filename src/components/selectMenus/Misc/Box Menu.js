const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, StringSelectMenuBuilder } = require('discord.js');
const { Apply } = require(`../../../schemas/applications`)
const linksInfo = require(`../../../discord structure/links.json`);
const { User } = require('../../../schemas/userdata');
const api = process.env.hypixel_apikey
const { tasks } = require(`../../../jsons/New Start.json`);
const fetch = require(`node-fetch`);
const { getProperty } = require('../../../functions');
const Boxes = require(`../../../misc_functions/Exporter`)
/**
 * 
 * @param {import("discord.js").StringSelectMenuInteraction} interaction Interaction
 * @param {import("../../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        const value = interaction.values[0]
        const selectMenu = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(`boxes_menu`)
                    .setPlaceholder(`Выберите коробку`)
                    .addOptions(
                        {
                            label: `Большая коробка`,
                            emoji: `🎁`,
                            description: `Открыть большую коробку`,
                            value: `big`
                        },
                        {
                            label: `Ежедневная коробка`,
                            emoji: `🕑`,
                            description: `Открыть ежедневную коробку`,
                            value: `daily`
                        },
                        {
                            label: `Ежемесячная коробка`,
                            emoji: `🕑`,
                            description: `Открыть ежемесячную коробку`,
                            value: `monthly`
                        },
                        {
                            label: `Еженедельная коробка`,
                            emoji: `🕑`,
                            description: `Открыть еженедельную коробку`,
                            value: `weekly`
                        },
                        {
                            label: `Жуткая коробка`,
                            emoji: `🎃`,
                            description: `Открыть жуткую коробку`,
                            value: `spooky`
                        },
                        {
                            label: `Загадочная коробка`,
                            emoji: `🎁`,
                            description: `Открыть загадочную коробку`,
                            value: `mystery`
                        },
                        {
                            label: `Коробка активности`,
                            emoji: `🎁`,
                            description: `Открыть коробку активности`,
                            value: `activity`
                        },
                        {
                            label: `Коробка персонала`,
                            emoji: `💼`,
                            description: `Открыть коробку персонала`,
                            value: `staff`
                        },
                        {
                            label: `Королевская коробка`,
                            emoji: `🎁`,
                            description: `Открыть королевскую коробку`,
                            value: `king`
                        },
                        {
                            label: `Летняя коробка`,
                            emoji: `🌞`,
                            description: `Открыть летнюю коробку`,
                            value: `summer`
                        },
                        {
                            label: `Маленькая коробка`,
                            emoji: `🎁`,
                            description: `Открыть маленькую коробку`,
                            value: `small`
                        },
                        {
                            label: `Мешочек`,
                            emoji: `💰`,
                            description: `Открыть мешочек`,
                            value: `bag`
                        },
                        {
                            label: `Новогодний подарок`,
                            emoji: `🎁`,
                            description: `Открыть новогодний подарок`,
                            value: `present`
                        },
                        {
                            label: `Огромная коробка`,
                            emoji: `🎁`,
                            description: `Открыть огромную коробку`,
                            value: `mega`
                        },
                        {
                            label: `Пасхальное яйцо`,
                            emoji: `🥚`,
                            description: `Открыть пасхальную коробку`,
                            value: `easter`
                        },
                        {
                            label: `Подарок судьбы`,
                            emoji: `💼`,
                            description: `Открыть подарок судьбы`,
                            value: `myth`
                        },
                        {
                            label: `Сезонный победитель`,
                            emoji: `🏆`,
                            description: `Открыть коробку сезонного победителя`,
                            value: `seasonal_winner`
                        },
                        {
                            label: `Сокровище`,
                            emoji: `🎁`,
                            description: `Открыть сокровище`,
                            value: `treasure`
                        },
                        {
                            label: `Талисман счастья`,
                            emoji: `🧿`,
                            description: `Открыть талисман счастья`,
                            value: `prestige`
                        },
                    )
            )

        await interaction.message.edit({
            components: [selectMenu]
        })
        switch (value) {
            case `big`: {
                await Boxes.Big(interaction, client)
            }
                break;
            case `daily`: {
                await Boxes.Daily(interaction, client)
            }
                break;
            case `monthly`: {
                await Boxes.Monthly(interaction, client)
            }
                break;
            case `weekly`: {
                await Boxes.Weekly(interaction, client)
            }
                break;
            case `spooky`: {
                await Boxes.Spooky(interaction, client)
            }
                break;
            case `mystery`: {
                await Boxes.Mystery(interaction, client)
            }
                break;
            case `activity`: {
                await Boxes.Activity(interaction, client)
            }
                break;
            case `staff`: {
                await Boxes.StaffBox(interaction, client)
            }
                break;
            case `king`: {
                await Boxes.King(interaction, client)
            }
                break;
            case `summer`: {
                await Boxes.Summer(interaction, client)
            }
                break;
            case `small`: {
                await Boxes.Small(interaction, client)
            }
                break;
            case `bag`: {
                await Boxes.Bag(interaction, client)
            }
                break;
            case `present`: {
                await Boxes.Present(interaction, client)
            }
                break;
            case `mega`: {
                await Boxes.Mega(interaction, client)
            }
                break;
            case `easter`: {
                await Boxes.Easter(interaction, client)
            }
                break;
            case `myth`: {
                await Boxes.Myth(interaction, client)
            }
                break;
            case `treasure`: {
                await Boxes.Treasure(interaction, client)
            }
                break;
            case `prestige`: {
                await Boxes.Prestige(interaction, client)
            }
                break;
            case `seasonal_winner`: {
                await Boxes.SeasonalWinner(interaction, client)
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
        id: "items",
        name: "Предметы"
    },
    data: {
        name: "boxes_menu"
    },
    execute
}