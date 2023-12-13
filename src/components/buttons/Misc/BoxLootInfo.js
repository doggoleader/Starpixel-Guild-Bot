const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, EmbedBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, } = require('discord.js');
const { Apply } = require(`../../../schemas/applications`)
const { User } = require(`../../../schemas/userdata`)
const chalk = require(`chalk`);
const { boxesInfo } = require('../../../misc_functions/Exporter');
const { getBoxLoot } = require('../../../functions');
/**
 * 
 * @param {import("discord.js").ButtonInteraction} interaction Interaction
 * @param {import("../../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        const selectMenu = boxesInfo

        const msg = await interaction.reply({
            content: `Выберите коробку, информацию о которой вы хотите получить!`,
            ephemeral: true,
            fetchReply: true,
            components: [selectMenu]
        })

        const collector = msg.createMessageComponentCollector();
        collector.on('collect', async (i) => {
            await i.deferReply({
                ephemeral: true,
                fetchReply: true
            })
            const v = i.values[0];
            const name = i.component.options.find(o => o.value == v).label;
            const boxFile = getBoxLoot(v);
            let result = []
            for (let key of Object.keys(boxFile)) {
                let array = boxFile[key];
                if (key == 'rumbik' || key == 'act_exp' || key == "rank_exp") {

                    let min = array.sort((a, b) => a.amount - b.amount)[0].amount
                    let max = array.sort((a, b) => b.amount - a.amount)[0].amount
                    result.push(
                        {
                            type: key,
                            string: `от ${min} до ${max}`
                        }
                    )

                } else if (key == 'loot' || key == 'mythical' || key == 'collection' || key == 'cosmetic') {
                    let allChances = 0;
                    for (let item of array) {
                        allChances += item.chance;
                    }

                    let map = array.map(item => {
                        let chance = ((item.chance / allChances) * 100).toFixed(1)
                        return `\`${item.name}\` (${chance}%)`
                    })

                    result.push({
                        type: key,
                        array: map
                    })

                }
            }

            let loot = result.find(l => l.type == 'loot')
            let mythical = result.find(l => l.type == 'mythical')
            let collection = result.find(l => l.type == 'collection')
            let cosmetic = result.find(l => l.type == 'cosmetic')
            let rumbik = result.find(l => l.type == 'rumbik')
            let act_exp = result.find(l => l.type == 'act_exp')
            let rank_exp = result.find(l => l.type == 'rank_exp')
            const embed = new EmbedBuilder()
                .setColor(Number(client.information.bot_color))
                .setDescription(`## ${name}
${loot ? `**Лут из коробки**\n${loot.array.join(`\n`)}` : ``}${mythical ? `\n\n**Мифическое**\n${mythical.array.join(`\n`)}` : ``}${collection ? `\n\n**Коллекция**\n${collection.array.join(`\n`)}` : ``}${cosmetic ? `\n\n**Косметические предметы**\n${cosmetic.array.join(`\n`)}` : ``}${act_exp ? `\n\n**Опыт активности**: ${act_exp.string}` : ``}${rank_exp ? `\n\n**Опыт рангов**: ${rank_exp.string}` : ``}${rumbik ? `\n\n**Румбики**: ${rumbik.string}` : ``}`)
            await i.editReply({
                embeds: [embed]
            })

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
        name: "boxes_getinfo"
    },
    execute
}
