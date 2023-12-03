const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, StringSelectMenuBuilder } = require('discord.js');
const { Apply } = require(`../../../schemas/applications`)

const { User } = require('../../../schemas/userdata');
const api = process.env.hypixel_apikey
const { tasks } = require(`../../../jsons/New Start.json`);
const fetch = require(`node-fetch`);
const { getProperty } = require('../../../functions');
const Boxes = require(`../../../misc_functions/Exporter`)
const { boxesMenu } = require(`../../../misc_functions/Exporter`)
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
        const selectMenu = boxesMenu
        const getInfoButton = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId(`boxes_getinfo`)
            .setEmoji(`📃`)
            .setLabel(`Получить информацию о коробках`)
            .setStyle(ButtonStyle.Primary)
        )

        await interaction.message.edit({
            components: [selectMenu, getInfoButton]
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
        await admin.send({
            content: `-> \`\`\`${e.stack}\`\`\``
        }).catch()
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