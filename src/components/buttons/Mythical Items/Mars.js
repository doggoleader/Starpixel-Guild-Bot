const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ComponentType, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const fetch = require(`node-fetch`)
const { joinVoiceChannel } = require('@discordjs/voice');

const wait = require(`node:timers/promises`).setTimeout
const api = process.env.hypixel_apikey;
const { Temp } = require(`../../../schemas/temp_items`);
const { User } = require(`../../../schemas/userdata`)
const { Guild } = require(`../../../schemas/guilddata`)
const chalk = require(`chalk`);
const ch_list = require(`../../../discord structure/channels.json`)
const { isOneEmoji } = require(`is-emojis`)
/**
 * 
 * @param {import("discord.js").ButtonInteraction} interaction Interaction
 * @param {import("../../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        const { guild, member, user } = interaction
        const guildData = await Guild.findOne({ id: guild.id })
        const userData = await User.findOne({ userid: user.id })
        if (!userData.onlinemode) return interaction.reply({
            content: `Вы не можете использовать Марс, так как у вас нелицензированный аккаунт!`,
            ephemeral: true
        })
        let role = `597746057203548160`
        const no_role = new EmbedBuilder()
            .setAuthor({
                name: `❗ Отсутствует необходимая роль!`
            })
            .setDescription(`Вы должны иметь роль \`${interaction.guild.roles.cache.get(role).name}\`, чтобы использовать данную команду!`)
            .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
            .setColor(`DarkRed`)
            .setTimestamp(Date.now())

        if (!member.roles.cache.has(role)) return interaction.reply({
            embeds: [no_role],
            ephemeral: true
        })
        const menuCheck = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(`mars_check_menu`)
                    .setPlaceholder(`Получить информацию или завершить задание`)
                    .setOptions([
                        {
                            label: `Получить задание`,
                            value: `get`,
                            description: `Получить задание от Марса`,
                            emoji: `🏆`
                        },
                        {
                            label: `Получить информацию`,
                            value: `info`,
                            description: `Получить информацию о текущем задании Марса`,
                            emoji: `📃`
                        },
                        {
                            label: `Завершить задание`,
                            value: `end`,
                            description: `Завершить текущее задание`,
                            emoji: `✅`
                        }

                    ])
            )
        await interaction.reply({
            content: `Используйте данное меню для управления действиями с квестом Марса!`,
            components: [menuCheck],
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
        name: "myth_mars"
    },
    execute
}