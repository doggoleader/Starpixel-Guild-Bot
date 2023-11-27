const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, InteractionType, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } = require('discord.js');
const { Guild } = require(`../../../schemas/guilddata`)
const { Apply } = require(`../../../schemas/applications`)
const chalk = require(`chalk`)
const ch_list = require(`../../../discord structure/channels.json`)
/**
 * 
 * @param {import("discord.js").ButtonInteraction} interaction Interaction
 * @param {import("../../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {

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
        const guildData = await Guild.findOne({
            id: interaction.guild.id
        })
        let appData = await Apply.findOne({ userid: interaction.user.id, guildid: interaction.guild.id }) || new Apply({ userid: interaction.user.id, guildid: interaction.guild.id })
        if (appData.rules_accepted == false) return interaction.reply({
            content: `Вы не согласились с правилами в <#${ch_list.rules}>!`,
            ephemeral: true
        })
        if (appData.applied == true) return interaction.reply({
            content: `Вы уже подали заявку в гильдию!`,
            ephemeral: true
        })
        let haveAcc = appData.onlinemode
        if (guildData.global_settings.no_license_applications == "enabled_everyone") {
            if (!haveAcc) return interaction.reply({
                content: `Вы не выполнили шаг 1!`,
                ephemeral: true
            })

        }

        if (haveAcc == "no") {

            if (appData.status == `На рассмотрении`) return interaction.reply({
                content: `Вы уже подали заявку! Если вы хотите её изменить, пожалуйста, удалите её с помощью кнопки \`Удалить заявку\` и измените необходимые поля! (После удаления поля, которые вы заполнили, сохранятся!)`,
                ephemeral: true
            })
            let apply = new ModalBuilder()
                .setCustomId(`apply1`)
                .setTitle(`Заявка на вступление (1/2)`)

            let question1 = new TextInputBuilder()
                .setCustomId(`first`)
                .setLabel(`Как вас зовут?`)
                .setPlaceholder(`Введите ваше реальное имя.`)
                .setRequired(true)
                .setStyle(TextInputStyle.Short)
                .setValue(appData.que1)

            let question3 = new TextInputBuilder()
                .setCustomId(`third`)
                .setLabel(`Сколько вам лет?`)
                .setPlaceholder(`Введите ваш возраст числом без лишних символов! Например: 17`)
                .setRequired(true)
                .setMaxLength(2)
                .setStyle(TextInputStyle.Short)
                .setValue(appData.que3)

            let question4 = new TextInputBuilder()
                .setCustomId(`fourth`)
                .setLabel(`Можете ли вы пойти в голосовой канал?`)
                .setPlaceholder(`Наличие микрофона тоже обязательно.`)
                .setRequired(true)
                .setStyle(TextInputStyle.Short)
                .setValue(appData.que4)

            let question5 = new TextInputBuilder()
                .setCustomId(`fifth`)
                .setLabel(`Ознакомились ли вы с правилами?`)
                .setPlaceholder(`Напишите, готовы ли соблюдать правила и ознакомились ли вы с ними.`)
                .setRequired(true)
                .setStyle(TextInputStyle.Short)
                .setValue(appData.que5)

            apply.addComponents(new ActionRowBuilder().addComponents(question1)).addComponents(new ActionRowBuilder().addComponents(question3)).addComponents(new ActionRowBuilder().addComponents(question4)).addComponents(new ActionRowBuilder().addComponents(question5))
            await interaction.showModal(apply)
        } else {
            if (appData.status == `На рассмотрении`) return interaction.reply({
                content: `Вы уже подали заявку! Если вы хотите её изменить, пожалуйста, удалите её с помощью кнопки \`Удалить заявку\` и измените необходимые поля! (После удаления поля, которые вы заполнили, сохранятся!)`,
                ephemeral: true
            })
            let apply = new ModalBuilder()
                .setCustomId(`apply1`)
                .setTitle(`Заявка на вступление (1/2)`)

            let question1 = new TextInputBuilder()
                .setCustomId(`first`)
                .setLabel(`Как вас зовут?`)
                .setPlaceholder(`Введите ваше реальное имя.`)
                .setRequired(true)
                .setStyle(TextInputStyle.Short)
                .setValue(appData.que1)

            let question2 = new TextInputBuilder()
                .setCustomId(`second`)
                .setLabel(`Какой у вас никнейм в Minecraft?`)
                .setPlaceholder(`Введите ваш игровой никнейм.`)
                .setRequired(true)
                .setStyle(TextInputStyle.Short)
                .setMaxLength(16)
                .setValue(appData.que2)

            let question3 = new TextInputBuilder()
                .setCustomId(`third`)
                .setLabel(`Сколько вам лет?`)
                .setPlaceholder(`Введите ваш возраст числом без лишних символов! Например: 17`)
                .setRequired(true)
                .setMaxLength(2)
                .setStyle(TextInputStyle.Short)
                .setValue(appData.que3)

            let question4 = new TextInputBuilder()
                .setCustomId(`fourth`)
                .setLabel(`Можете ли вы пойти в голосовой канал?`)
                .setPlaceholder(`Наличие микрофона тоже обязательно.`)
                .setRequired(true)
                .setStyle(TextInputStyle.Short)
                .setValue(appData.que4)

            let question5 = new TextInputBuilder()
                .setCustomId(`fifth`)
                .setLabel(`Ознакомились ли вы с правилами?`)
                .setPlaceholder(`Напишите, готовы ли соблюдать правила и ознакомились ли вы с ними.`)
                .setRequired(true)
                .setStyle(TextInputStyle.Short)
                .setValue(appData.que5)
            apply.addComponents(new ActionRowBuilder().addComponents(question1)).addComponents(new ActionRowBuilder().addComponents(question2)).addComponents(new ActionRowBuilder().addComponents(question3)).addComponents(new ActionRowBuilder().addComponents(question4)).addComponents(new ActionRowBuilder().addComponents(question5))
            await interaction.showModal(apply)
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
        id: "new_users",
        name: "Новые пользователи"
    },
    data: {
        name: "apply1"
    },
    execute
}
