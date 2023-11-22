const { SlashCommandBuilder, Attachment, EmbedBuilder } = require('discord.js');

const { User } = require(`../../schemas/userdata`);
const linksInfo = require(`../../discord structure/links.json`)
const chalk = require(`chalk`)

/**
 * 
 * @param {import("discord.js").ChatInputCommandInteraction} interaction Interaction
 * @param {import("../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {

        if (!interaction.member.roles.cache.has(`320880176416161802`)) {
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: `❗ Отсутствует необходимая роль!`
                })
                .setDescription(`Вы не имеете роль \`${interaction.guild.roles.cache.get(`320880176416161802`).name}\`!`)
                .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                .setColor(`DarkRed`)
                .setTimestamp(Date.now())

            return interaction.reply({
                embeds: [embed],
                ephemeral: true
            })

        }

        switch (interaction.options.getSubcommand()) {
            case `channel`: {
                const channel = await interaction.options.getChannel(`канал`)
                const message = await interaction.options.getString(`сообщение`)

                await interaction.guild.channels.cache.get(channel.id).send({
                    content: `${message}`
                })
                await interaction.reply({
                    content: `Сообщение отправлено на канал ${channel}!`,
                    ephemeral: true
                })
                console.log(chalk.blackBright(`[${new Date()}]`) + `Пользователь: ${channel.name}. Сообщение: ${message}`)
            }

                break;

            case `user`: {
                const user = await interaction.options.getUser(`пользователь`)
                const message = await interaction.options.getString(`сообщение`)
                const memberDM = await interaction.guild.members.fetch(user.id)

                try {
                    await memberDM.send(`${message}`)
                    await interaction.reply({
                        content: `Сообщение отправлено пользователю ${user}!`,
                        ephemeral: true
                    })
                    console.log(chalk.blackBright(`[${new Date()}]`) + `Пользователь: ${user.username}. Сообщение: ${message}`)
                } catch (error) {

                    await interaction.reply({
                        content: `У пользователя ${user} закрыты личные сообщения! Попросите его открыть их и повторите попытку снова!`,
                        ephemeral: true
                    });
                    return;
                }

            }
                break;

            default: {
                await interaction.reply({
                    content: `Данной опции не существует! Выберите одну из предложенных!`,
                    ephemeral: true
                })
            }
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
module.exports = {
    category: `admin_only`,
    plugin: {
        id: "misc",
        name: "Разное"
    },
    data: new SlashCommandBuilder()
        .setName(`message`)
        .setDescription(`Отправить сообщение в канал/личные сообщения`)
        .setDMPermission(false)
        .addSubcommand(subcommand => subcommand
            .setName(`channel`)
            .setDescription(`Отправить сообщение на канал`)
            .addChannelOption(option => option
                .setName(`канал`)
                .setDescription(`Канал, куда нужно отправить сообщение`)
                .setRequired(true)
            )
            .addStringOption(option => option
                .setName(`сообщение`)
                .setDescription(`Сообщение, которое нужно отправить`)
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName(`user`)
            .setDescription(`Отправить сообщение пользователю в личные сообщения.`)
            .addUserOption(option => option
                .setName(`пользователь`)
                .setDescription(`Пользователь, которому нужно отправить сообщение.`)
                .setRequired(true)
            )
            .addStringOption(option => option
                .setName(`сообщение`)
                .setDescription(`Сообщение, которое нужно отправить.`)
                .setRequired(true)
            )
        ),
    execute
}