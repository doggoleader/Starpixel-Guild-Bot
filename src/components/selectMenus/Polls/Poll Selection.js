const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');
const { Apply } = require(`../../../schemas/applications`)

const ch_list = require(`../../../discord structure/channels.json`);
const { User } = require('../../../schemas/userdata');
const api = process.env.hypixel_apikey
const { tasks } = require(`../../../jsons/New Start.json`);
const fetch = require(`node-fetch`);
const { getProperty } = require('../../../functions');
const { Polls } = require('../../../schemas/polls');
/**
 * 
 * @param {import("discord.js").StringSelectMenuInteraction} interaction Interaction
 * @param {import("../../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        const { member, guild, channel, values, user } = interaction
        const pollData = await Polls.findOne({ messageid: interaction.message.id })
        if (!pollData) return interaction.reply({
            content: `Данный опрос не был найден! Странно..`,
            ephemeral: true
        })
        let userVoted = await pollData.users.find(u => u.userid == user.id)
        if (userVoted) {
            for (let option of userVoted.options) {
                let optionVoted = await pollData.results.find(o => o.option == option)
                if (optionVoted) {
                    optionVoted.result -= 1
                }
            }
            userVoted.options = []

        }
        for (let value of values) {
            userVoted = await pollData.users.find(u => u.userid == user.id)
            if (userVoted) {
                userVoted.options.push(value)
            } else {
                pollData.users.push({
                    userid: user.id,
                    options: [value]
                })
            }

            let optionVoted = await pollData.results.find(o => o.option == value)
            if (optionVoted) {
                optionVoted.result += 1
            } else {
                pollData.results.push({
                    option: value,
                    result: 1
                })
            }
        }
        let map = values.map((value, i) => {
            return `**${++i}.** ${value}`
        })
        pollData.save()
        await interaction.reply({
            content: `Вы проголосовали за:
${map.join(`\n`)}

Вы можете изменить варианты ответа в любой момент, проголосовав ещё раз!`,
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
        id: "misc",
        name: "Разное"
    },
    data: {
        name: "poll_choice"
    },
    execute
}