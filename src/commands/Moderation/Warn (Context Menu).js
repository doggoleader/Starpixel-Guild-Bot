const { ContextMenuCommandBuilder, ApplicationCommandType, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, ModalSubmitInteraction, InteractionType, EmbedBuilder } = require('discord.js');

const ch_list = require(`../../discord structure/channels.json`)

const { User } = require('../../schemas/userdata');

/**
 * 
 * @param {import("discord.js").ChatInputCommandInteraction} interaction Interaction
 * @param {import("../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        const embed = new EmbedBuilder()
            .setAuthor({
                name: `❗ Вы не можете использовать это!`
            })
            .setDescription(`Недостаточно прав для использования данной команды`)
            .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
            .setColor(`DarkRed`)
            .setTimestamp(Date.now())
        const { user, member } = interaction
        if (!member.roles.cache.has(`320880176416161802`) || !member.roles.cache.has(`563793535250464809`)) return interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
        if (!member.roles.cache.has(`504887113649750016`)) return interaction.reply({
            content: `Данный участник не находится в гильдии!`,
            ephemeral: true
        })
        const modal = new ModalBuilder()
            .setCustomId(`warn_user`)
            .setTitle(`Выдать предупреждение ${interaction.targetMessage.author.username}`)
            .addComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId(`reason`)
                            .setLabel(`Причина предупреждения`)
                            .setMaxLength(100)
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                    )
            )

        await interaction.showModal(modal)

        const filter = (i) => i.customId === 'warn_user';
        interaction.awaitModalSubmit({ filter, time: 10000000 })
            .then(async (i) => {
                await i.deferReply({ fetchReply: true })
                const userData = await User.findOne({ userid: interaction.targetMessage.author.id })
                const reason = i.fields.getTextInputValue("reason")
                const n1 = [`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`, `N`, `O`, `P`, `Q`, `R`, `S`, `T`, `U`, `V`, `W`, `X`, `Y`, `Z`, `0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`]
                let r1 = n1[Math.floor(Math.random() * n1.length)]
                let r2 = n1[Math.floor(Math.random() * n1.length)]
                let r3 = n1[Math.floor(Math.random() * n1.length)]
                let r4 = n1[Math.floor(Math.random() * n1.length)]
                let r5 = n1[Math.floor(Math.random() * n1.length)]
                let r6 = n1[Math.floor(Math.random() * n1.length)]
                let r7 = n1[Math.floor(Math.random() * n1.length)]
                const date = new Date()
                const warn_code = `${r1}${r2}${r3}${r4}${r5}${r6}${r7}-${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}_${date.getHours()}${date.getMinutes()}${date.getSeconds()}`
                const attachments = []
                for (let attach of interaction.targetMessage.attachments) {
                    attachments.push(
                        {
                            link: attach.url
                        }
                    )
                }
                userData.warn_info.push({
                    user: interaction.targetMessage.author.id,
                    moderator: interaction.user.id,
                    reason: reason,
                    date: date,
                    warn_code: warn_code,
                    message: {
                        id: interaction.targetMessage.id,
                        content: interaction.targetMessage.content,
                        url: interaction.targetMessage.url,
                        attachments: attachments
                    }
                })
                userData.save()
                client.Warnings()
                const warning = new EmbedBuilder()
                    .setTitle(`Выдано предупреждение`)
                    .setColor(Number(client.information.bot_color))
                    .setThumbnail(user.displayAvatarURL())
                    .setTimestamp(Date.now())
                    .setDescription(`Вам выдано предупреждение! Причина: \`${reason}\`! Пожалуйста, ознакомьтесь с <#774546154209148928>! 

Модератор: ${user}
Код предупреждения: \`${warn_code}\`

Текущее количество предупреждений: ${userData.warn_info.length}`)

                await i.editReply({
                    ocntent: `${interaction.targetMessage.author}`,
                    embeds: [warning]
                })
            })
            .catch(async (e) => {
                console.log(e)
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
    category: `admin_only`,
    plugin: {
        id: "admin",
        name: "Административное"
    },
    data: new ContextMenuCommandBuilder()
        .setName(`Выдать предупреждение`)
        .setType(ApplicationCommandType.Message)
        .setDMPermission(false),
    execute
}