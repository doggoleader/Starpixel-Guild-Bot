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
        await interaction.deferUpdate({ fetchReply: true })

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
            .setFile(`./src/assets/Tutorials/Rumb.png`)
            .setName(`Rumb.png`)
        const embed = new EmbedBuilder()
            .setTitle(`Туториал по Discord серверу гильдии`)
            .setDescription(`**Румбики и магазин гильдии**
Из некоторых видов коробок также выпадает такая валюта, как румбики <:Rumbik:883638847056003072>. Она позволяет вам покупать предметы в магазине гильдии. Большинство предметов из магазина можно только купить, но есть такие предметы, которые могут выпасть в коробках высокого уровня.

❗ Для получения румбиков вам необходим ранг "Мастер гильдии"!

Полученные румбики вы можете посмотреть в канале <#${ch_list.rumb}>.`)
            .setColor(Number(client.information.bot_color))
            .setFooter({ text: `Если у вас есть какие-либо вопросы, вы можете задать их в ${askChannel.name}! • Страница 8/${list.length}` })
            .setTimestamp(Date.now())
            .setImage(`attachment://${attach.name}`)

        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`tutorial7`)
                    .setDisabled(false)
                    .setEmoji(`⬅`)
                    .setStyle(ButtonStyle.Danger)
                    .setLabel(`Предыдущая`)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`tutorial9`)
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
        name: `tutorial8`
    },
    execute
};