const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const { ClientSettings } = require(`../../../schemas/client`)

const { User } = require('../../../schemas/userdata');
const ch_list = require(`../../../discord structure/channels.json`)
const fs = require(`fs`)
const role_list = require(`../../../discord structure/roles.json`)
/**
 * 
 * @param {import("discord.js").ButtonInteraction} interaction Interaction
 * @param {import("../../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        const { user } = interaction
        await interaction.deferUpdate()

        const list = await fs.readdirSync(`./src/components/buttons/Tutorials`).filter(fule => fule.endsWith(`.js`))
        const guild = await client.guilds.cache.get(`320193302844669959`)
        const member = await guild.members.fetch(user.id)
        if (!member || !member.roles.cache.has(`504887113649750016`)) return interaction.reply({
            content: `Вы не являетесь участником гильдии Starpixel! Чтобы использовать эту команду, вступите в гильдию!`,
            ephemeral: true
        })
        const message = interaction.message
        const askChannel = await guild.channels.fetch(ch_list.ask)

        /* const attach = new AttachmentBuilder()
        .setFile(`./src/assets/Tutorials/Rumb.png`)
        .setName(`Rumb`) */
        const embed = new EmbedBuilder()
            .setTitle(`Туториал по Discord серверу гильдии`)
            .setDescription(`**Достижения гильдии**
В гильдии Starpixel также предусмотрена система достижений. В гильдии имеется ${role_list.achievements_normal.length} стандартных достижений и ${role_list.achievements_myth.length} мифических. Стандартные достижения может выполнять любой участник гильдии, в то время как мифические требуют начать развитие заново.

Стандартные достижения вам дают:
• Коробку
• 300 опыта активности
• 50 опыта рангов

Мифические достижения вам дают:
• Коробку
• 700 опыта активности
• 300 опыта рангов

За выполнение всех стандартных достижений вы получите наградную роль и коробку. Посмотреть список достижений вы можете в канале <#${ch_list.achs}>!`)
            .setColor(Number(client.information.bot_color))
            .setFooter({ text: `Если у вас есть какие-либо вопросы, вы можете задать их в ${askChannel.name}! • Страница 9/${list.length}` })
            .setTimestamp(Date.now())
        //.setImage(attach)

        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`tutorial8`)
                    .setDisabled(false)
                    .setEmoji(`⬅`)
                    .setStyle(ButtonStyle.Danger)
                    .setLabel(`Предыдущая`)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`tutorial10`)
                    .setDisabled(false)
                    .setEmoji(`➡`)
                    .setStyle(ButtonStyle.Success)
                    .setLabel(`Следующая`)
            )


        await message.edit({
            embeds: [embed],
            components: [buttons],
            files: [],
            attachments: []
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
        name: `tutorial9`
    },
    execute
};