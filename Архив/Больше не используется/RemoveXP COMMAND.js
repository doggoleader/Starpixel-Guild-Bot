const { SlashCommandBuilder } = require('discord.js');
const { execute } = require('../../../src/events/client/ready');
const { User } = require(`../../src/schemas/userdata`);
const chalk = require(`chalk`);

module.exports = {
    category: ``,
    plugin: `info`,
    data: new SlashCommandBuilder()
        .setName(`remove-xp`)
        .setDescription(`Убрать опыт у пользователя.`)
        .addStringOption(option => option
            .setName(`тип`)
            .setDescription(`Тип предмета`)
            .setAutocomplete(true)
            .setRequired(true)
        )
        .addUserOption(option => option
            .setName(`пользователь`)
            .setDescription(`Выберите пользователя, у которого нужно забрать опыт.`)
            .setRequired(true)
        )
        .addNumberOption(option => option
            .setName(`количество`)
            .setDescription(`Выберите количество убираемого опыта.`)
            .setRequired(true)
        ),

    async autoComplete(interaction, client) {

        const focusedValue = interaction.options.getFocused();
        const choices = ['Опыт активности', 'Опыт рангов', 'Румбики'];
        const filtered = choices.filter(choice => choice.toLowerCase().includes(focusedValue.toLowerCase()));;
        await interaction.respond(
            filtered.map(choice => ({ name: choice, value: choice })),
        );
    },
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

        const user = interaction.options.getUser(`пользователь`) || interaction.member.user;
        const userData = await User.findOne({ id: user.id })
        switch (interaction.options.getString(`тип`)) {
            case `Опыт активности`: {
                if (userData.totalexp < interaction.options.getNumber(`количество`)) return interaction.followUp({
                        content: `Вы не можете забрать больше опыта, чем есть у этого пользователя (${userData.totalexp}🌀)`,
                        ephemeral: true
                    })
                
                userData.exp -= interaction.options.getNumber(`количество`);
                userData.totalexp -= interaction.options.getNumber(`количество`);

            while (userData.exp < 0) {
                var exp = userData.exp
                userData.level -= 1
                userData.exp += 5 * (userData.level ^ 2) + (50 * userData.level) + 100 + exp;
                if (userData.totalexp <= 0) {
                     userData.level = 0;
                     userData.exp = 0;
                     userData.totalexp = 0;
                }
            }
                
                userData.save();
                interaction.followUp(`Убрано ${interaction.options.getNumber(`количество`)}🌀 у пользователя ${user}!`)
                console.log(chalk.blackBright(`[${new Date()}]`) + chalk.green(`[${user.username} потерял опыт активности]`) + chalk.gray(`: Теперь у него ${userData.exp} опыта и ${userData.level} уровень.`))
            };

                break;
            case `Опыт рангов`: {
                if (userData.rank < interaction.options.getNumber(`количество`)) return interaction.followUp({
                    content: `Вы не можете забрать больше опыта, чем есть у этого пользователя (${userData.rank}💠)`,
                    ephemeral: true
                })
                userData.rank -= interaction.options.getNumber(`количество`)
                userData.save();
                interaction.followUp(`Выдано ${interaction.options.getNumber(`количество`)}💠 у пользователя ${user}! У него теперь ${userData.rank} опыта рангов!`)
                console.log(chalk.blackBright(`[${new Date()}]`) + chalk.green(`[${user.username} потерял опыт рангов]`) + chalk.gray(`: Теперь у него ${userData.rank} опыта рангов.`))

            }

                break;
            case `Румбики`: {
                if (userData.rumbik < interaction.options.getNumber(`количество`)) return interaction.followUp({
                    content: `Вы не можете забрать больше рубмиков, чем есть у этого пользователя (${userData.rumbik}<:Rumbik:883638847056003072>)`,
                    ephemeral: true
                })
                userData.rumbik -= interaction.options.getNumber(`количество`)
                userData.save();
                interaction.followUp(`Выдано ${interaction.options.getNumber(`количество`)}<:Rumbik:883638847056003072> у пользователя ${user}! У него теперь ${userData.rumbik} румбиков!`)
                console.log(chalk.blackBright(`[${new Date()}]`) + chalk.green(`[${user.username} потерял румбики]`) + chalk.gray(`: Теперь у него ${userData.rumbik} румбиков.`))
            }

                break;

            default:
                break;
        }
    }
}