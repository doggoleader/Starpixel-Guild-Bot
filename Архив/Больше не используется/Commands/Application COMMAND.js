const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');
const { execute } = require('../../../src/events/client/start_bot/ready');
const { Apply } = require(`../../../src/schemas/applications`)
const ch_list = require(`../../../src/discord structure/channels.json`)
const linksInfo = require(`../../../src/discord structure/links.json`)

module.exports = {
    category: `guests`,
    plugin: `info`,
    data: new SlashCommandBuilder()
        .setName(`application`)
        .setDescription(`Заявки на вступление в гильдию Starpixel`)
        .setDMPermission(false)
        .addSubcommand(subcommand => subcommand
            .setName(`create`)
            .setDescription(`Подать заявку в гильдию`)
        )
        .addSubcommand(subcommand => subcommand
            .setName(`delete`)
            .setDescription(`Удалить заявку на вступление в гильдию`)
        )
        .addSubcommand(subcommand => subcommand
            .setName(`status`)
            .setDescription(`Посмотреть статус заявки`)
        )
        .addSubcommand(subcommand => subcommand
            .setName(`setstatus`)
            .setDescription(`Установить статус рассмотрения заявки`)
            .addUserOption(option => option
                .setName(`пользователь`)
                .setDescription(`Пользователь, статус заявки которого нужно изменить`)
                .setRequired(true)
            )
            .addStringOption(option => option
                .setName(`статус`)
                .setDescription(`Установить статус заявки`)
                .addChoices(
                    {
                        name: `Принята`, value: `✅`
                    },
                    {
                        name: `На рассмотрении`, value: `🕒`
                    },
                    {
                        name: `Отклонена`, value: `❌`
                    }
                )
                .setRequired(true)
            )
        ),
    async execute(interaction, client) {
        try {
            const { Guild } = require(`../../../src/schemas/guilddata`)
            const pluginData = await Guild.findOne({ id: interaction.guild.id })
            if (pluginData.plugins.welcome === false) return interaction.reply({ content: `Данный плагин отключён! Попробуйте позже!`, ephemeral: true })
            switch (interaction.options.getSubcommand()) {
                case `create`: {
                    const member = interaction.member
                    const guild = interaction.guild
                    if (member.roles.cache.has(`504887113649750016`)) {
                        const embed = new EmbedBuilder()
                            .setAuthor({
                                name: `❗ Вы уже в гильдии!`
                            })
                            .setDescription(`Вы уже состоите в гильдии Starpixel! Зачем вам подавать заявку ещё раз? 😂`)
                            .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                            .setColor(`DarkRed`)
                            .setTimestamp(Date.now())

                        return interaction.reply({
                            embeds: [embed],
                            ephemeral: true
                        })
                    }

                    if (interaction.channel.id !== ch_list.apply) {
                        const embed = new EmbedBuilder()
                            .setColor(`DarkRed`)
                            .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                            .setTitle(`❗ Команда недоступна в данном канале!`)
                            .setDescription(`Вы не можете использовать команду в данном канале! Пожалуйста, перейдите в <#${ch_list.apply}>!`)
                            .setTimestamp(Date.now())

                        return interaction.reply({
                            embeds: [embed],
                            ephemeral: true
                        })
                    }

                    let appData = await Apply.findOne({ userid: member.user.id, guildid: guild.id })
                    let apply
                    let question1
                    let question2
                    let question3
                    let question4
                    let question5

                    if (!appData) {

                        apply = new ModalBuilder()
                            .setCustomId(`apply1`)
                            .setTitle(`Заявка на вступление (1/2)`)

                        question1 = new TextInputBuilder()
                            .setCustomId(`first`)
                            .setLabel(`Как вас зовут?`)
                            .setPlaceholder(`Введите ваше реальное имя без лишних символов! Например: Дмитрий`)
                            .setRequired(true)
                            .setStyle(TextInputStyle.Short)

                        question2 = new TextInputBuilder()
                            .setCustomId(`second`)
                            .setLabel(`Какой у вас никнейм в Minecraft?`)
                            .setPlaceholder(`Введите ваш игровой никнейм без лишних символовом! Например: iDoggo`)
                            .setRequired(true)
                            .setStyle(TextInputStyle.Short)
                            .setMaxLength(16)

                        question3 = new TextInputBuilder()
                            .setCustomId(`third`)
                            .setLabel(`Сколько вам лет?`)
                            .setPlaceholder(`Введите ваш возраст числом без лишних символов! Например: 17`)
                            .setRequired(true)
                            .setMaxLength(2)
                            .setStyle(TextInputStyle.Short)

                        question4 = new TextInputBuilder()
                            .setCustomId(`fourth`)
                            .setLabel(`Можете ли вы пойти в голосовой канал?`)
                            .setPlaceholder(`Наличие микрофона тоже обязательно.`)
                            .setRequired(true)
                            .setStyle(TextInputStyle.Short)

                        question5 = new TextInputBuilder()
                            .setCustomId(`fifth`)
                            .setLabel(`Ознакомились ли вы с правилами?`)
                            .setPlaceholder(`Напишите, готовы ли соблюдать правила и ознакомились ли вы с ними.`)
                            .setRequired(true)
                            .setStyle(TextInputStyle.Short)


                    } else if (appData) {
                        if (appData.status == `На рассмотрении` || appData.status == `Принята`) return interaction.reply({
                            content: `Вы уже подали заявку! Если вы хотите её изменить, пожалуйста, удалите её с помощью \`/application delete\` и измените необходимые поля! (После удаления поля, которые вы заполнили, сохранятся!)`
                        })
                        apply = new ModalBuilder()
                            .setCustomId(`apply1`)
                            .setTitle(`Заявка на вступление (1/2)`)

                        question1 = new TextInputBuilder()
                            .setCustomId(`first`)
                            .setLabel(`Как вас зовут?`)
                            .setPlaceholder(`Введите ваше реальное имя.`)
                            .setRequired(true)
                            .setStyle(TextInputStyle.Short)
                            .setValue(appData.que1)

                        question2 = new TextInputBuilder()
                            .setCustomId(`second`)
                            .setLabel(`Какой у вас никнейм в Minecraft?`)
                            .setPlaceholder(`Введите ваш игровой никнейм.`)
                            .setRequired(true)
                            .setStyle(TextInputStyle.Short)
                            .setMaxLength(16)
                            .setValue(appData.que2)

                        question3 = new TextInputBuilder()
                            .setCustomId(`third`)
                            .setLabel(`Сколько вам лет?`)
                            .setPlaceholder(`Вам должно быть больше 14 лет для вступления.`)
                            .setRequired(true)
                            .setStyle(TextInputStyle.Short)
                            .setValue(appData.que3)

                        question4 = new TextInputBuilder()
                            .setCustomId(`fourth`)
                            .setLabel(`Можете ли вы пойти в голосовой канал?`)
                            .setPlaceholder(`Наличие микрофона тоже обязательно.`)
                            .setRequired(true)
                            .setStyle(TextInputStyle.Short)
                            .setValue(appData.que4)

                        question5 = new TextInputBuilder()
                            .setCustomId(`fifth`)
                            .setLabel(`Ознакомились ли вы с правилами?`)
                            .setPlaceholder(`Напишите, готовы ли соблюдать правила и ознакомились ли вы с ними.`)
                            .setRequired(true)
                            .setStyle(TextInputStyle.Short)
                            .setValue(appData.que5)
                    }



                    apply.addComponents(new ActionRowBuilder().addComponents(question1)).addComponents(new ActionRowBuilder().addComponents(question2)).addComponents(new ActionRowBuilder().addComponents(question3)).addComponents(new ActionRowBuilder().addComponents(question4)).addComponents(new ActionRowBuilder().addComponents(question5))
                    await interaction.showModal(apply)
                }

                    break;
                case `delete`: {
                    const member = interaction.member
                    const guild = interaction.guild
                    if (member.roles.cache.has(`504887113649750016`)) {
                        const embed = new EmbedBuilder()
                            .setAuthor({
                                name: `❗ Вы уже в гильдии!`
                            })
                            .setDescription(`Вы уже состоите в гильдии Starpixel! Зачем вам удалять свою заявку? 😂`)
                            .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                            .setColor(`DarkRed`)
                            .setTimestamp(Date.now())

                        return interaction.reply({
                            embeds: [embed],
                            ephemeral: true
                        })
                    }
                    let appData = await Apply.findOne({ userid: member.user.id, guildid: guild.id })
                    if (!appData) return interaction.reply({
                        content: `Вы не подавали заявку в гильдию, поэтому вы не можете удалить вашу заявку!`,
                        ephemeral: true
                    })
                    appData.status = `Отклонена`
                    appData.save()
                    const appCh = await interaction.guild.channels.fetch(ch_list.apply)
                    const appMsg = await appCh.messages.fetch(appData.applicationid)
                    await appMsg.delete()
                    await interaction.reply({
                        content: `Ваша заявка была удалена! Если вы захотите подать заявку ещё раз, просто пропишите \`/application create\`!`,
                        ephemeral: true
                    })

                }

                    break;
                case `setstatus`: {
                    if (!interaction.member.roles.cache.has(`563793535250464809`)) {
                        const embed = new EmbedBuilder()
                            .setAuthor({
                                name: `❗ Отсутствует необходимая роль!`
                            })
                            .setDescription(`Вы не имеете роль \`${interaction.guild.roles.cache.get(`563793535250464809`).name}\`! Только офицеры и администраторы могут изменять статус заявки!`)
                            .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                            .setColor(`DarkRed`)
                            .setTimestamp(Date.now())

                        return interaction.reply({
                            embeds: [embed],
                            ephemeral: true
                        })
                    }
                    const user = interaction.options.getUser(`пользователь`)
                    const status = interaction.options.getString(`статус`)
                    const guild = interaction.guild
                    let appData = await Apply.findOne({ userid: user.id, guildid: guild.id })
                    if (!appData) return interaction.reply({
                        content: `Заявка данного пользователя не найдена!`,
                        ephemeral: true
                    })
                    const appCh = await interaction.guild.channels.fetch(ch_list.apply)
                    const appMsg = await appCh.messages.fetch(appData.applicationid)
                    if (status == `✅`) {
                        await appMsg.reactions.removeAll()
                        appData.status = `Принята`
                        await appMsg.react(`✅`)
                        await interaction.reply({
                            content: `Установлен статус на заявку ${user} - \`Принята\``,
                            ephemeral: true
                        })
                    } else if (status == `🕒`) {
                        await appMsg.reactions.removeAll()
                        appData.status = `На рассмотрении`
                        await appMsg.react(`🕒`)
                        await interaction.reply({
                            content: `Установлен статус на заявку ${user} - \`На рассмотрении\``,
                            ephemeral: true
                        })
                    } else if (status == `❌`) {
                        await appMsg.reactions.removeAll()
                        appData.status = `Отклонена`
                        await appMsg.react(`❌`)
                        await interaction.reply({
                            content: `Установлен статус на заявку ${user} - \`Отклонена\``,
                            ephemeral: true
                        })
                    }
                    appData.save()

                }

                    break;
                case `status`: {
                    const member = interaction.member
                    const guild = interaction.guild
                    if (member.roles.cache.has(`504887113649750016`)) {
                        const embed = new EmbedBuilder()
                            .setAuthor({
                                name: `❗ Вы уже в гильдии!`
                            })
                            .setDescription(`Вы уже состоите в гильдии Starpixel! Зачем вам смотреть статус заявки? Ответ очевиден! 😂`)
                            .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                            .setColor(`DarkRed`)
                            .setTimestamp(Date.now())

                        return interaction.reply({
                            embeds: [embed],
                            ephemeral: true
                        })
                    }
                    let appData = await Apply.findOne({ userid: member.user.id, guildid: guild.id })
                    if (!appData) return interaction.reply({
                        content: `Вы не подавали заявку в гильдию, поэтому вы не можете удалить вашу заявку!`,
                        ephemeral: true
                    })

                    await interaction.reply({
                        content: `Статус вашей заявки на вступление в гильдию: \`${appData.status}\`!`,
                        ephemeral: true
                    })
                }
                    break;
                default:
                    break;
            }
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
**Команда**: \`${interaction.commandName}\`
**Пользователь**: ${interaction.member}
**Канал**: ${interaction.channel}
**Опции**: \`\`\`json
${interaction.options.data.length <= 0 ? `{"status": false}` : options.join(`,\n`)}
\`\`\``)
            await admin.send(`◾`)
        }


    }
};