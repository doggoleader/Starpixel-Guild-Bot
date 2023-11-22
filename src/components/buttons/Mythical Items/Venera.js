const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ComponentType, ButtonStyle } = require('discord.js');
const fetch = require(`node-fetch`)
const { joinVoiceChannel } = require('@discordjs/voice');

const wait = require(`node:timers/promises`).setTimeout
const api = process.env.hypixel_apikey;
const { Temp } = require(`../../../schemas/temp_items`);
const { User } = require(`../../../schemas/userdata`)
const { Guild } = require(`../../../schemas/guilddata`)
const chalk = require(`chalk`);
const prettyMilliseconds = require(`pretty-ms`); //ДОБАВИТЬ В ДРУГИЕ
const linksInfo = require(`../../../discord structure/links.json`)
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
        let role = `597746062798880778`
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

        const cd = new EmbedBuilder()
            .setColor(Number(linksInfo.bot_color))
            .setAuthor({
                name: `Вы не можете использовать эту команду`
            })
            .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${prettyMilliseconds(userData.cooldowns.venera - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}!`)

        if (userData.cooldowns.venera > Date.now()) return interaction.reply({
            embeds: [cd],
            ephemeral: true
        })

        const cosmetics = [
            {
                name: `КОСМЕТИЧЕСКИЙ ЭМОДЗИ 💀`,
                symbol: `💀`
            },
            {
                name: `КОСМЕТИЧЕСКИЙ  ЗНАЧОК 👻`,
                symbol: `👻`
            },
            {
                name: `КОСМЕТИЧЕСКИЙ ЭМОДЗИ 🤡`,
                symbol: `🤡`
            },
            {
                name: `КОСМЕТИЧЕСКИЙ ЭМОДЗИ 🐠`,
                symbol: `🐠`
            },
            {
                name: `КОСМЕТИЧЕСКИЙ ЭМОДЗИ 🦴`,
                symbol: `🦴`
            },
            {
                name: `КОСМЕТИЧЕСКИЙ ЭМОДЗИ 🥕`,
                symbol: `🥕`
            },
            {
                name: `КОСМЕТИЧЕСКИЙ ЭМОДЗИ 🧀`,
                symbol: `🧀`
            },
            {
                name: `КОСМЕТИЧЕСКИЙ ЭМОДЗИ 📦`,
                symbol: `📦`
            },
            {
                name: `КОСМЕТИЧЕСКИЙ ЭМОДЗИ 💎`,
                symbol: `💎`
            },
            {
                name: `КОСМЕТИЧЕСКИЙ ЭМОДЗИ 🏆`,
                symbol: `🏆`
            },
            {
                name: `КОСМЕТИЧЕСКИЙ ЭМОДЗИ 🛒`,
                symbol: `🛒`
            },
            {
                name: `КОСМЕТИЧЕСКИЙ ЭМОДЗИ 🔒`,
                symbol: `🔒`
            }

        ]
        let r_cosm = cosmetics[Math.floor(Math.random() * cosmetics.length)]

        const setup = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('setup')
                    .setLabel('Установить')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji(`⬆️`)
            )


        const reply = await interaction.reply({
            content: `:earth_americas: :bust_in_silhouette: :anchor: :star: :dash:
${user} обращается к Венере.
Она дарит ему легендарный косметический эмодзи \`${r_cosm.name}\`.
:beginner: Необходим ранг \"Чемпион гильдии\".
Если хотите установить эмодзи, нажмите кнопку \"Установить\" в течение 60 секунд.
:earth_americas: :bust_in_silhouette: :anchor: :star: :dash:`,
            components: [setup],
            ephemeral: true,
            fetchReply: true
        })

        const filter = i => i.customId === 'setup';

        const collector = await reply.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 60000 })
        collector.on('collect', async (i) => {
            if (i.user.id === member.user.id) {
                if (r_cosm.name.startsWith(`КОСМЕТИЧЕСКИЙ ЭМОДЗИ`) && userData.rank_number >= 4) {
                    userData.displayname.symbol = r_cosm.symbol
                    await setup.components[0]
                        .setDisabled(true)
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(`🕓`)
                        .setLabel(`Идёт обработка...`)
                    await i.reply({
                        content: `Ожидайте! Скоро ваш значок будет установлен! Если этого не произойдет в течение 15 минут, обратитесь в вопрос-модерам!`,
                        ephemeral: true
                    })
                }
                else {
                    await i.reply({
                        content: `Вы не можете установить себе данный предмет, так как не получили минимальный ранг. Посмотреть минимальный ранг для данного действия вы можете в канале <#1020401349441110046>!`,
                        ephemeral: true
                    })
                    await setup.components[0]
                        .setDisabled(true)
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(`❌`)
                        .setLabel(`Низкий ранг`)
                }

                await interaction.editReply({
                    content: `:earth_americas: :bust_in_silhouette: :anchor: :star: :dash:
${user} обращается к Венере.
Она дарит ему легендарный косметический эмодзи \`${r_cosm.name}\`.
:beginner: Необходим ранг \"Чемпион гильдии\".
Если хотите установить эмодзи, нажмите кнопку \"Установить\" в течение 60 секунд.
:earth_americas: :bust_in_silhouette: :anchor: :star: :dash:`,
                    components: [setup],
                    fetchReply: true
                })
                userData.save()
                collector.stop()

            } else {
                i.reply({ content: `Вы не можете использовать данную кнопочку!`, ephemeral: true });
            }
        })
        collector.on('end', async (err) => {
            await setup.components[0]
                .setDisabled(true)
                .setStyle(ButtonStyle.Secondary)

            await interaction.editReply({
                content: `:earth_americas: :bust_in_silhouette: :anchor: :star: :dash:
${user} обращается к Венере.
Она дарит ему легендарный косметический эмодзи \`${r_cosm.name}\`.
:beginner: Необходим ранг \"Чемпион гильдии\".
Если хотите установить эмодзи, нажмите кнопку \"Установить\" в течение 60 секунд.
:earth_americas: :bust_in_silhouette: :anchor: :star: :dash:`,
                components: [setup],
                fetchReply: true
            })
        });

        userData.cooldowns.venera = Date.now() + (1000 * 60 * 60 * 24 * 30)
        userData.save()
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
**ID модели**: \`${interaction.customId}\`
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
        id: "items",
        name: "Предметы"
    },
    data: {
        name: "myth_ven"
    },
    execute
}