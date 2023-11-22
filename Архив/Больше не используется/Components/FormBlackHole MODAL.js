const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, ChannelType, EmbedBuilder, } = require('discord.js');
const { Apply } = require(`../../../src/schemas/applications`)
const linksInfo = require(`../../../src/discord structure/links.json`)
const chalk = require(`chalk`);
const { User } = require('../../../src/schemas/userdata');

module.exports = {
    data: {
        name: "black_hole_form"
    },
    async execute(interaction, client) {
        try {
            await interaction.deferReply({
                ephemeral: true,
                fetchReply: true
            })
            const { channel, user, member } = interaction
            const userData = await User.findOne({
                userid: interaction.user.id,
                guildid: interaction.guild.id
            })
            const thread = await channel.threads.create({
                type: ChannelType.PrivateThread,
                name: `Неактивность - ${user.username}`,
                invitable: false
            })

            const embed1 = new EmbedBuilder()
                .setColor(Number(linksInfo.bot_color))
                .setTitle(`Почему вы перестали проявлять активность в гильдии?`)
                .setDescription(`**Ответ**
${interaction.fields.getTextInputValue(`bh_1`)}`)

            const embed2 = new EmbedBuilder()
                .setColor(Number(linksInfo.bot_color))
                .setTitle(`Почему вы решили вступить к нам в гильдию?`)
                .setDescription(`**Ответ**
${interaction.fields.getTextInputValue(`bh_2`)}`)

            const embed3 = new EmbedBuilder()
                .setColor(Number(linksInfo.bot_color))
                .setTitle(`Ознакомились ли вы повторно с Соглашением гильдии?`)
                .setDescription(`**Ответ**
${interaction.fields.getTextInputValue(`bh_3`)}`)

            const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId(`black_hole_dec`)
                .setLabel(`Отрицательное`)
                .setEmoji(`❌`)
                .setStyle(ButtonStyle.Danger)
            )
            .addComponents(
                new ButtonBuilder()
                .setCustomId(`black_hole_acc`)
                .setLabel(`Положительное`)
                .setEmoji(`✅`)
                .setStyle(ButtonStyle.Success)
            )
            userData.black_hole.info.stage3_thread = thread.id
            userData.save()


            await thread.send({
                embeds: [embed1]
            })
            
            await thread.send({
                embeds: [embed2]
            })
            
            await thread.send({
                embeds: [embed3]
            })
            await thread.send({
                content: `Ветка была создана для того, чтобы офицер гильдии мог договориться о дате и времени проведения собеседования!
                
Кнопки ниже созданы для того, чтобы офицер гильдии мог вынести окончательный вердикт собеседования.
**Заметка офицерам!** Обратите внимание, что оба действия, которые выполняют кнопки, отменить нельзя. Будьте осторожны при нажатии на кнопки, а также не нажимайте на них "по-приколу"! Это может повлиять на Вашу репутацию в гильдии.`,
                components: [buttons]
            })
            await thread.send(`${interaction.member} <@&563793535250464809>`)
            await interaction.editReply({
                content: `Ваша форма была заполнена! Можете перейти в канал ${thread} для дальнейшей коммуникации с офицерами гильдии!`,
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
