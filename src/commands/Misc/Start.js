const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const { ClientSettings } = require(`../../schemas/client`)

const { User } = require('../../schemas/userdata');
const ch_list = require(`../../discord structure/channels.json`)
const fs = require(`fs`)

/**
 * 
 * @param {import("discord.js").ChatInputCommandInteraction} interaction Interaction
 * @param {import("../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        const { user } = interaction
        try {
            const list = await fs.readdirSync(`./src/components/buttons/Tutorials`).filter(fule => fule.endsWith(`.js`))
            const guild = await client.guilds.cache.get(`320193302844669959`)
            const member = await guild.members.fetch(user.id)
            if (!member || !member.roles.cache.has(`504887113649750016`)) return interaction.reply({
                content: `Вы не являетесь участником гильдии Starpixel! Чтобы использовать эту команду, вступите в гильдию!`,
                ephemeral: true
            })
            const askChannel = await guild.channels.fetch(ch_list.ask)
            const embed = new EmbedBuilder()
                .setTitle(`Туториал по Discord серверу гильдии`)
                .setDescription(`${user}, добро пожаловать в гильдию! В этом кратком туториале вы узнаете об основных возможностях нашего сервера Discord. Если у вас будут какие-либо вопросы, вы в любой момент можете вернуть на предыдущую страницу.
            
Давайте начнем! Чтобы продолжить, нажмите на кнопочку "Следующая"!`)
                .setColor(Number(client.information.bot_color))
                .setFooter({ text: `Если у вас есть какие-либо вопросы, вы можете задать их в ${askChannel.name}! • Страница 1/${list.length}` })
                .setTimestamp(Date.now())

            const buttons = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`tutorial0`)
                        .setDisabled(true)
                        .setEmoji(`⬅`)
                        .setStyle(ButtonStyle.Danger)
                        .setLabel(`Предыдущая`)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`tutorial2`)
                        .setDisabled(false)
                        .setEmoji(`➡`)
                        .setStyle(ButtonStyle.Success)
                        .setLabel(`Следующая`)
                )

            if (interaction.guild) {
                await member.send({
                    embeds: [embed],
                    buttons: [buttons]
                })
                await interaction.reply({
                    content: `Туториал был отправлен вам в личные сообщения!`,
                    ephemeral: true
                })
            } else if (!interaction.guild) {
                await interaction.reply({
                    embeds: [embed],
                    components: [buttons]
                })
            }
        } catch (e) {
            const file1 = new AttachmentBuilder()
                .setFile(`./src/assets/Tutorials/OpenDMs.png`)
                .setName(`OpenDMs.png`)

            const file2 = new AttachmentBuilder()
                .setFile(`./src/assets/Tutorials/OpenDMs2.png`)
                .setName(`OpenDMs2.png`)
            console.log(e)

            await interaction.reply({
                content: `У вас закрыты личные сообщения! Следуйте инструкциям, чтобы открыть их!`,
                ephemeral: true,
                files: [file1, file2]
            })
        }
    } catch (e) {
        const admin = await client.users.fetch(`491343958660874242`)
        console.log(e)
        await admin.send({
            content: `-> \`\`\`${e.stack}\`\`\``
        }).catch()
    }

}
module.exports = {
    category: `start`,
    plugin: {
        id: "misc",
        name: "Разное"
    },
    data: new SlashCommandBuilder()
        .setName(`start`)
        .setDescription(`Начать развитие в дискорде и получить краткую инструкцию в личные сообщения`)
        .setDMPermission(true),
    execute
};