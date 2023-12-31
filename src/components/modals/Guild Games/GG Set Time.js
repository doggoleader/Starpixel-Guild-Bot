const { ContextMenuCommandBuilder, ApplicationCommandType, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, ModalSubmitInteraction, InteractionType, EmbedBuilder, PermissionFlagsBits, ComponentType, SlashCommandBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');

const { User } = require(`../../../schemas/userdata`)
const { Guild } = require(`../../../schemas/guilddata`)
const { daysOfWeek, isURL, secondPage } = require(`../../../functions`);
const { Song, SearchResultType } = require('distube');
const wait = require(`node:timers/promises`).setTimeout
const moment = require(`moment`)
const cron = require(`node-cron`)
/**
 * 
 * @param {import("discord.js").ModalSubmitInteraction} interaction Interaction
 * @param {import("../../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        const { member, guild, user } = interaction
        const guildData = await Guild.findOne({ id: guild.id })

        // Время начала
        const timeStart = interaction.fields.getTextInputValue(`gg_start_time`)
        if (!timeStart.includes(`:`)) return interaction.reply({
            content: `Время начала должно быть записано в формате \`HH:mm\` (\`ЧЧ:мм\`)!`,
            ephemeral: true
        })
        const timeArray = await timeStart.split(`:`, 2)
        const test = new Date()
        let format = `YYYY-MM-DD HH:mm`
        let date = test.getDate(), month = test.getMonth() + 1, year = test.getFullYear()
        if (month < 10) month = `0${month}`
        if (date < 10) date = `0${date}`
        let tr = moment(`${year}-${month}-${date} ${timeStart}`, format, true)
        if (tr.isValid() == false) return interaction.reply({
            content: `Введённое вами время **начала** не является действительным!`,
            ephemeral: true
        })
        let hour = Number(timeArray[0])
        if (hour < 0 || hour > 23) return interaction.reply({
            content: `Час (HH) **начала** должен быть в промежутке от 0 до 23!`,
            ephemeral: true
        })
        let min = Number(timeArray[1])
        if (min < 0 || min > 59) return interaction.reply({
            content: `Минута (mm) **начала** должна быть в промежутке от 0 до 60!`,
            ephemeral: true
        })
        if (String(min).length <= 1) {
            min = `0${min}`
        } else if (String(min).length > 1) {
            min = min
        }

        if (String(hour).length <= 1) {
            hour = `0${hour}`
        } else if (String(hour).length > 1) {
            hour = hour
        }
        guildData.guildgames.gamestart_hour = Number(hour)
        guildData.guildgames.gamestart_min = Number(min)

        // Время конца
        const timeEnd = interaction.fields.getTextInputValue(`gg_end_time`)
        if (!timeEnd.includes(`:`)) return interaction.reply({
            content: `Время начала должно быть записано в формате \`HH:mm\` (\`ЧЧ:мм\`)!`,
            ephemeral: true
        })
        const timeArray2 = await timeEnd.split(`:`, 2)
        const test2 = new Date()
        let format2 = `YYYY-MM-DD HH:mm`
        let date2 = test2.getDate(), month2 = test2.getMonth() + 1, year2 = test2.getFullYear()
        if (month2 < 10) month2 = `0${month2}`
        if (date2 < 10) date2 = `0${date2}`
        let tr2 = moment(`${year2}-${month2}-${date2} ${timeEnd}`, format2, true)
        if (tr2.isValid() == false) return interaction.reply({
            content: `Введённое вами время **конца** не является действительным!`,
            ephemeral: true
        })
        let hour2 = Number(timeArray2[0])
        if (hour2 < 0 || hour2 > 23) return interaction.reply({
            content: `Час (HH) **конца** должен быть в промежутке от 0 до 23!`,
            ephemeral: true
        })
        let min2 = Number(timeArray2[1])
        if (min2 < 0 || min2 > 59) return interaction.reply({
            content: `Минута (mm) **конца** должна быть в промежутке от 0 до 60!`,
            ephemeral: true
        })
        if (String(min2).length <= 1) {
            min2 = `0${min2}`
        } else if (String(min2).length > 1) {
            min2 = min2
        }

        if (String(hour2).length <= 1) {
            hour2 = `0${hour2}`
        } else if (String(hour2).length > 1) {
            hour2 = hour2
        }

        guildData.guildgames.gameend_hour = Number(hour2)
        guildData.guildgames.gameend_min = Number(min2)
        guildData.save()

        await interaction.reply({
            content: `**Установлено новое время**
__Время начала:__ \`${hour}:${min}\` по московскому времени
__Время окончания:__ \`${hour2}:${min2}\` по московскому времени`,
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
        id: "guildgames",
        name: "Совместные игры"
    },
    data: {
        name: "gg_time_set"
    },
    execute
}