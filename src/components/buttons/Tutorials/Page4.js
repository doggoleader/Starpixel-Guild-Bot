const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const { ClientSettings } = require(`../../../schemas/client`)

const { User } = require('../../../schemas/userdata');
const ch_list = require(`../../../discord structure/channels.json`)
const fs = require(`fs`)
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

        const attach = new AttachmentBuilder()
            .setFile(`./src/assets/Tutorials/CommandMenu.png`)
            .setName(`CommandMenu.png`)
        const embed = new EmbedBuilder()
            .setTitle(`Туториал по Discord серверу гильдии`)
            .setDescription(`**Первые коробки**
При вступлении гильдии вам также был выдан вступительный подарок в виде коробки. Найти её вы можете в списке ваших ролей. Помимо коробок с ролями, есть ежедневные, еженедельные и ежемесячные коробки. Давайте попробуем открыть свои первые коробки. Чтобы команда активировалась, необходимо в канале <#${ch_list.box}> начать сообщение с \`/\` и вы увидите список доступных команд на сервере. Нас интересуют команды бота ${client.user}.

Для открытия **ежедневной** коробки используйте команду \`/daily\` (можно использовать 1 раз в 16 часов).

Для открытия **еженедельной** коробки используйте команду \`/weekly\` (можно использовать 1 раз в 7 дней).

Для открытия **ежемесячной** коробки используйте команду \`/monthly\` (можно использовать 1 раз в 30 дней).

Для открытия любых других коробок используйте ту команду, которая написана в роли (например, для \`❕ 🎁 МАЛЕНЬКАЯ /small\` командой будет \`/small\`).`)
            .setColor(Number(client.information.bot_color))
            .setFooter({ text: `Если у вас есть какие-либо вопросы, вы можете задать их в ${askChannel.name}! • Страница 4/${list.length}` })
            .setTimestamp(Date.now())
            .setImage(`attachment://${attach.name}`)

        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`tutorial3`)
                    .setDisabled(false)
                    .setEmoji(`⬅`)
                    .setStyle(ButtonStyle.Danger)
                    .setLabel(`Предыдущая`)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`tutorial5`)
                    .setDisabled(false)
                    .setEmoji(`➡`)
                    .setStyle(ButtonStyle.Success)
                    .setLabel(`Следующая`)
            )


        await message.edit({
            embeds: [embed],
            components: [buttons],
            files: [attach],
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
        name: `tutorial4`
    },
    execute
};