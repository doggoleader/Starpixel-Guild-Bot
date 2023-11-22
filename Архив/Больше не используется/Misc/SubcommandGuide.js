const { SlashCommandBuilder } = require('discord.js');
const { execute } = require('../../src/events/client/ready');

module.exports = {
    category: ``,
    plugin: `info`,
    data: new SlashCommandBuilder()
        .setName(`subcom`)
        .setDescription(`Основные ссылки и информация о гильдии.`)
        .addSubcommand(subcommand => subcommand
            .setName(`first`)
            .addNumberOption(option => option
                .setName(`somethingcool`)
                .setDescription(`123`)
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName(`second`)
            .addBooleanOption(option => option
                .setName(`возраст`)
                .setDescription(`234`)
                .setRequired(true)
            )
        ),
    async execute(interaction, client) {
        try {

        } catch (e) {
            const admin = await client.users.fetch(`491343958660874242`)
            console.log(e)
            let options = interaction?.options.data.map(a => {
                return `{
"status": true,
"name": "${a.name}",
"type": ${a.type},
"autocomplete": ${a?.autocomplete ? true : false },
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
        const subcommand = interaction.options.getSubcommand()
        console.log(chalk.blackBright(`[${new Date()}]`) + subcommand)

        switch (subcommand.name) {
            case first: {
                interaction.followUp({
                    content: `${subcommand.options.getNumber(`somethingcool`)}`
                })
            }

                break;
            case second: {
                interaction.followUp({
                    content: `${subcommand.options.getBoolean(`возраст`)}`
                })
            }

                break;
            default:
                break;
        }
    }
};