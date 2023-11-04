const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { execute } = require('../../../events/client/start_bot/ready');
const { ClientSettings } = require(`../../../schemas/client`)
const linksInfo = require(`../../../discord structure/links.json`);
const { User } = require('../../../schemas/userdata');
const ch_list = require(`../../../discord structure/channels.json`)
const fs = require(`fs`)
const role_list = require(`../../../discord structure/roles.json`)

module.exports = {
    plugin: {
        id: "misc",
        name: "Разное"
    },
    data: {
        name: `tutorial12`
    },
    async execute(interaction, client) {
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

            const embed = new EmbedBuilder()
                .setTitle(`Туториал по Discord серверу гильдии`)
                .setDescription(`**Подписка VIP**
В магазине гильдии или из коробок вы можете получить специальную подписку VIP, в помощью которой вы получите некоторые преимущества, такие, как:
- Случайная коробка каждую неделю, если прописать команду \`/premium\`
- Возможность бустить других участников с помощью \`/boost\`
- Возможность устанавливать любой стандартный цвет в гильдии
- Эксклюзивную роль подписчика Premium
- Эмодзи с головой вашего скина Minecraft
- Возможность создавать приватный канал и управлять его настройками
- Эксклюзивный значок \`💳\` после вашего никнейма

Чтобы приобрести подписку, напишите в <#${ch_list.ask}> с этим вопросом.`)
                .setColor(Number(linksInfo.bot_color))
                .setFooter({ text: `Если у вас есть какие-либо вопросы, вы можете задать их в ${askChannel.name}! • Страница 12/${list.length}` })
                .setTimestamp(Date.now())

            const buttons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`tutorial11`)
                        .setDisabled(false)
                        .setEmoji(`⬅`)
                        .setStyle(ButtonStyle.Danger)
                        .setLabel(`Предыдущая`)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`tutorial13`)
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
};