const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const { ClientSettings } = require(`../../../schemas/client`)
const linksInfo = require(`../../../discord structure/links.json`);
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

        const attach = new AttachmentBuilder()
            .setFile(`./src/assets/Tutorials/Pets.png`)
            .setName(`Pets.png`)
        const embed = new EmbedBuilder()
            .setTitle(`Туториал по Discord серверу гильдии`)
            .setDescription(`**Питомцы и стихии**
В канале <#${ch_list.pets}> вы можете ознакомиться со всеми питомцами гильдии. Каждый питомец даёт вам урок той стихии, к которой относится питомец. Питомцев можно получить из коробок.

В гильдии есть всего 4 вида питомцев и, соответственно, 4 стихии:
• Питомец (\`spet\`) и стихия Земли (\`earth\`)
• Питомец (\`lpet\`) и стихия Воды (\`water\`)
• Питомец (\`mpet\`) и стихия Огня (\`fire\`)
• Питомец (\`epet\`) и стихия Воздуха (\`air\`)

Чтобы отправиться на урок к питомцу, необходимо прописать команду \`/pets\` и тип того питомца, к которому вы хотите отправиться.

Как только вы изучите все 3 урока определённой стихии, вы получите стихию, которая будет вам давать дополнительные награды каждую неделю. Для использования стихии вам необходимо написать команду \`/elements\` и выбрать стихию, которая у вас имеется`)
            .setColor(Number(linksInfo.bot_color))
            .setFooter({ text: `Если у вас есть какие-либо вопросы, вы можете задать их в ${askChannel.name}! • Страница 11/${list.length}` })
            .setTimestamp(Date.now())
            .setImage(`attachment://${attach.name}`)

        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`tutorial10`)
                    .setDisabled(false)
                    .setEmoji(`⬅`)
                    .setStyle(ButtonStyle.Danger)
                    .setLabel(`Предыдущая`)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`tutorial12`)
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
        name: `tutorial11`
    },
    execute
};