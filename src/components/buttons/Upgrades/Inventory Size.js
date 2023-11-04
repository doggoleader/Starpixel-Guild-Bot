const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, StringSelectMenuBuilder } = require('discord.js');
const { Apply } = require(`../../../schemas/applications`)
const { User } = require(`../../../schemas/userdata`)
const { Guild } = require(`../../../schemas/guilddata`)
const linksInfo = require(`../../../discord structure/links.json`)
const chalk = require(`chalk`)
const roles = require(`../../../discord structure/roles.json`)
const { secondPage, divideOnPages, convertToRoman } = require(`../../../functions`);
const { Temp } = require('../../../schemas/temp_items');

module.exports = {
    plugin: {
        id: "items",
        name: "Предметы"
    },
    data: {
        name: "upgrade_inv_size"
    },
    async execute(interaction, client) {
        try {
            const userData = await User.findOne({ userid: interaction.user.id })
            let upgradeInfo = require(`./JSON/Upgrades Info.json`).inventory_size
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
}
