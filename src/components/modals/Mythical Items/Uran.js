const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ComponentType, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
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
 * @param {import("discord.js").ModalSubmitInteraction} interaction Interaction
 * @param {import("../../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        const { guild, member, user } = interaction
        const guildData = await Guild.findOne({ id: guild.id })
        const userData = await User.findOne({ userid: user.id })
        let role = `745326453369077841`

        const symbol = interaction.fields.getTextInputValue(`myth_emoji`)
        if (isOneEmoji(symbol) == false) return interaction.reply({
            content: `Данный символ не является эмоджи или не поддерживается!`,
            ephemeral: true
        })
        if (userData.cosmetics_storage.symbols.includes(symbol)) return interaction.reply({
            content: `Данный косметический значок уже есть в вашем инвентаре!`,
            ephemeral: true
        })
        userData.displayname.symbol = symbol;
        userData.cosmetics_storage.symbols.push(symbol)
        userData.save()
        await member.roles.remove(role)

        await interaction.reply({
            content: `${member}, вы решили установить значок ${symbol}! Он изменится в течение 15-ти минут. Если этого не произойдет, пожалуйста, обратитесь в вопрос-модерам!

Предпросмотр вашего никнейма в Discord: \`「${userData.displayname.rank}」 ${userData.displayname.ramka1}${userData.displayname.name}${userData.displayname.ramka2}${userData.displayname.suffix} ${userData.displayname.symbol}┇ ${userData.displayname.premium}\``,
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
        name: "myth_changeemoji"
    },
    execute
}