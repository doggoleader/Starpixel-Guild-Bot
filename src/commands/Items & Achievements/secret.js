const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const fetch = require(`node-fetch`);
const api = process.env.hypixel_apikey;
const { User } = require(`../../schemas/userdata`);
const { Guild } = require(`../../schemas/guilddata`)
const chalk = require(`chalk`);
const prettyMilliseconds = require(`pretty-ms`); //ДОБАВИТЬ В ДРУГИЕ
const ch_list = require(`../../discord structure/channels.json`)

/**
 * 
 * @param {import("discord.js").ChatInputCommandInteraction} interaction Interaction
 * @param {import("../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        const user = interaction.member
        const guild = interaction.guild
        const guildData = await Guild.findOne({ id: interaction.guild.id })
        if (guildData.plugins.achievements === false) return interaction.reply({ content: `Данный плагин отключён! Попробуйте позже!`, ephemeral: true })

        switch (interaction.options.getSubcommand()) {
            case `set`: {

                const not_admin = new EmbedBuilder()
                    .setAuthor({
                        name: `❗ Отсутствует необходимая роль!`
                    })
                    .setDescription(`Вы не имеете роль \`${interaction.guild.roles.cache.get(`320880176416161802`).name}\`!`)
                    .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                    .setColor(`DarkRed`)
                    .setTimestamp(Date.now())
                if (!user.roles.cache.has(`320880176416161802`)) return interaction.reply({
                    embeds: [not_admin]
                })
                await interaction.deferReply({ fetchReply: true, ephemeral: true })
                await interaction.deleteReply();
                let name = interaction.options.getString(`слово`).toLowerCase()
                const hint = interaction.options.getString(`подсказка`)
                guildData.secret_word.guessed = false
                guildData.secret_word.name = name
                guildData.secret_word.hint = hint
                guildData.save()


                const msg = await interaction.guild.channels.cache.get(ch_list.main).send(
                    `Установлена новая тайная команда!    @here
**Подсказка**: ${guildData.secret_word.hint} (\`${name.replace(/./g, '_ ')}\`)`
                )
                await msg.pin(`Новая тайная команда!`)
                console.log(chalk.blackBright(`[${new Date()}]`) + chalk.red(`[НОВАЯ ТАЙНАЯ КОМАНДА]`) + chalk.gray(`: Установлена новая тайная команда: ${guildData.secret_word.name}. Подсказка: ${guildData.secret_word.hint}`))
            }

                break;
            case `hint`: {
                const hint = new EmbedBuilder()
                    .setTitle(`Подсказка для тайного слова`)
                    .setColor(Number(client.information.bot_color))
                    .setTimestamp(Date.now())
                    .setThumbnail(`https://i.imgur.com/Lo2SaOA.png`)
                    .setDescription(`**Подсказка**: \`${guildData.secret_word.hint}\``)
                await interaction.reply({
                    embeds: [hint]
                })
            }

                break;

            default:
                break;
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
    category: `sec`,
    plugin: {
        id: "misc",
        name: "Разное"
    },
    data: new SlashCommandBuilder()
        .setName(`secret`)
        .setDescription(`Тайная команда гильдии`)
        .setDMPermission(false)
        .addSubcommand(subcommand => subcommand
            .setName(`set`)
            .setDescription(`Установить новую тайную команду`)
            .addStringOption(option => option
                .setName(`слово`)
                .setDescription(`Новое тайное слово`)
                .setRequired(true)
            )
            .addStringOption(option => option
                .setName(`подсказка`)
                .setDescription(`Новая подсказка для тайного слова`)
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName(`hint`)
            .setDescription(`Подсказка для тайного слова`)
        ),
    execute
};