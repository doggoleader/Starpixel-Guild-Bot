const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const { ClientSettings } = require(`../../../schemas/client`)
const linksInfo = require(`../../../discord structure/links.json`);
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
        const embed = new EmbedBuilder()
            .setTitle(`Туториал по Discord серверу гильдии`)
            .setDescription(`**Профиль участника**
При вступлении в гильдию администратор создал ваш профиль. Создав профиль, вы сразу получили доступ ко всем начальным функциям сервера. Также вы получите доступ к самым основным каналам:
<#${ch_list.news}> - в данном канале публикуются различные новости, связанные с гильдией, например, мероприятия, обновления Дискорда.

<#${ch_list.rules}> - в данном канале прописаны все требования к участникам гильдии, а также правила в голосовых и текстовых каналах.

<#${ch_list.main}> - основной канал, в котором общаются все участники нашей гильдии. Помните, что необходимо соблюдать правила.

<#${ch_list.content}> - в данном канале вы можете публиковать любой интересный контент, например, ваши успехи и достижения, мемы с участниками гильдии и прочее. Если вы хотите прокомментировать чей-либо пост, сделать вы это можете прямо под ним.

<#${ch_list.ask}> - если у вас возник вопрос, вы можете смело задать его в данном канале. Наша администрация ответит на него, и вы получите ответ в главном чате.

<#${ch_list.support}> - этот канал существует, если у вас возник более серьёзный вопрос, который вы хотите обсудить лично с администрацией.

<#${ch_list.g_leave}> - если вам не понравилась наша гильдия, вы имеете право покинуть её. Помните, что как только вы уйдёте из неё, вы больше не сможете вернуться.


Для просмотра основной информации о вашем профиле пропишите команду \`/profile info\` в любом канале на сервере гильдии.`)
            .setColor(Number(linksInfo.bot_color))
            .setFooter({ text: `Если у вас есть какие-либо вопросы, вы можете задать их в ${askChannel.name}! • Страница 2/${list.length}` })
            .setTimestamp(Date.now())

        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`tutorial1`)
                    .setDisabled(false)
                    .setEmoji(`⬅`)
                    .setStyle(ButtonStyle.Danger)
                    .setLabel(`Предыдущая`)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`tutorial3`)
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

module.exports = {
    plugin: {
        id: "misc",
        name: "Разное"
    },
    data: {
        name: `tutorial2`
    },
    execute
};