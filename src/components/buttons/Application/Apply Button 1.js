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
        })/* 
        if (guildData.global_settings.no_license_applications == "enabled_everyone") {
            if (!haveAcc) return interaction.reply({
                content: `Вы не выполнили шаг 1!`,
                ephemeral: true
            })

        } */


        if (appData.applied) return interaction.reply({
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
            .setValue(appData.que1 ? appData.que1 : "")


        let question2 = new TextInputBuilder()
            .setCustomId(`second`)
            .setLabel(`Какой у вас никнейм в Minecraft?`)
            .setPlaceholder(`Введите ваш игровой никнейм (опционально)`)
            .setRequired(false)
            .setStyle(TextInputStyle.Short)
            .setMaxLength(16)
            .setValue(appData.que2 ? appData.que2 : "")

        let question3 = new TextInputBuilder()
            .setCustomId(`third`)
            .setLabel(`Знакомство с правилами?`)
            .setPlaceholder(`Напишите, готовы ли соблюдать правила и ознакомились ли вы с ними.`)
            .setRequired(true)
            .setStyle(TextInputStyle.Short)
            .setValue(appData.que5 ? appData.que5 : "")

        let question4 = new TextInputBuilder()
            .setCustomId(`fourth`)
            .setLabel(`Слышали о разработке гильдией своего сервера?`)
            .setPlaceholder(`Сервер создаётся по мотивам далёких земель.`)
            .setRequired(true)
            .setStyle(TextInputStyle.Short)
            .setValue(appData.que6 ? appData.que6 : "")

        let question5 = new TextInputBuilder()
            .setCustomId(`fifth`)
            .setLabel(`Как вы узнали о нашей гильдии?`)
            .setPlaceholder(`Напишите, где и как вы узнали о нашей гильдии. (опционально)`)
            .setRequired(false)
            .setStyle(TextInputStyle.Paragraph)
            .setValue(appData.que7 ? appData.que7 : "")

        apply.addComponents(new ActionRowBuilder().addComponents(question1)).addComponents(new ActionRowBuilder().addComponents(question2)).addComponents(new ActionRowBuilder().addComponents(question3)).addComponents(new ActionRowBuilder().addComponents(question4)).addComponents(new ActionRowBuilder().addComponents(question5))
        await interaction.showModal(apply)

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
        id: "new_users",
        name: "Новые пользователи"
    },
    data: {
        name: "apply1"
    },
    execute
}
