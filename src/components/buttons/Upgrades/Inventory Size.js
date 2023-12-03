const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, StringSelectMenuBuilder } = require('discord.js');
const { Apply } = require(`../../../schemas/applications`)
const { User } = require(`../../../schemas/userdata`)
const { Guild } = require(`../../../schemas/guilddata`)
const chalk = require(`chalk`)
const roles = require(`../../../discord structure/roles.json`)
const { secondPage, divideOnPages, convertToRoman } = require(`../../../functions`);
const { Temp } = require('../../../schemas/temp_items');
/**
 * 
 * @param {import("discord.js").ButtonInteraction} interaction Interaction
 * @param {import("../../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        const userData = await User.findOne({ userid: interaction.user.id })
        let upgradeInfo = require(`../../../jsons/Upgrades Info.json`).inventory_size
        let nextTier = upgradeInfo.find(up => up.tier == userData.upgrades.inventory_size_tier + 1)
        if (!nextTier) return interaction.reply({
            content: `Вы уже полностью улучшили свой инвентарь!`,
            ephemeral: true
        })
        if (userData.rumbik < nextTier.price) return interaction.reply({
            content: `У вас недостаточно румбиков, чтобы приобрести улучшение "Размер инвентаря ${convertToRoman(nextTier.tier)}. Вам необходимо ещё ${nextTier.price - userData.rumbik} румбиков!`,
            ephemeral: true
        })
        userData.upgrades.inventory_size = nextTier.upgrade
        userData.upgrades.inventory_size_tier = nextTier.tier
        userData.rumbik -= nextTier.price
        userData.save()
        await interaction.reply({
            content: `Вы приобрели улучшение "Размер инвентаря ${convertToRoman(nextTier.tier)}! Теперь вместимость вашего инвентаря составляет \`${userData.upgrades.inventory_size}\` предметов.`,
            ephemeral: true
        })
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
        name: "upgrade_inv_size"
    },
    execute
}
