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
                const box = new Boxes.Big(interaction, client);
                await box.sendBox();
            }
                break;
            case `daily`: {
                const box = new Boxes.Daily(interaction, client);
                await box.sendBox();
            }
                break;
            case `monthly`: {
                const box = new Boxes.Monthly(interaction, client);
                await box.sendBox();
            }
                break;
            case `weekly`: {
                const box = new Boxes.Weekly(interaction, client);
                await box.sendBox();
            }
                break;
            case `spooky`: {
                const box = new Boxes.Spooky(interaction, client);
                await box.sendBox();
            }
                break;
            case `mystery`: {
                const box = new Boxes.Mystery(interaction, client);
                await box.sendBox();
            }
                break;
            case `activity`: {
                const box = new Boxes.Activity(interaction, client);
                await box.sendBox();
            }
                break;
            case `staff`: {
                const box = new Boxes.Staffbox(interaction, client);
                await box.sendBox();
            }
                break;
            case `king`: {
                const box = new Boxes.King(interaction, client);
                await box.sendBox();
            }
                break;
            case `summer`: {
                const box = new Boxes.Summer(interaction, client);
                await box.sendBox();
            }
                break;
            case `small`: {
                const box = new Boxes.Small(interaction, client);
                await box.sendBox();
            }
                break;
            case `bag`: {
                const box = new Boxes.Bag(interaction, client);
                await box.sendBox();
            }
                break;
            case `present`: {
                const box = new Boxes.Present(interaction, client);
                await box.getReceivers();
            }
                break;
            case `mega`: {
                const box = new Boxes.Mega(interaction, client);
                await box.sendBox();
            }
                break;
            case `easter`: {
                const box = new Boxes.Easter(interaction, client);
                await box.sendBox();
            }
                break;
            case `myth`: {
                const box = new Boxes.Myth(interaction, client);
                await box.sendBox();
            }
                break;
            case `treasure`: {
                const box = new Boxes.Treasure(interaction, client);
                await box.sendBox();
            }
                break;
            case `prestige`: {
                const box = new Boxes.Prestige(interaction, client);
                await box.sendBox();
            }
                break;
            case `seasonal_winner`: {
                const box = new Boxes.SeasonalWinner(interaction, client);
                await box.sendBox();
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