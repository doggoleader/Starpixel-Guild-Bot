const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { execute } = require('../../events/client/start_bot/ready');
const { User } = require(`../../schemas/userdata`);
const ch_list = require(`../../discord structure/channels.json`)
const chalk = require(`chalk`);
const linksInfo = require(`../../discord structure/links.json`)
const { calcActLevel, getLevel } = require(`../../functions`)

module.exports = {
    category: `admin_only`,
    plugin: {
        id: "items",
        name: "Предметы"
    },
    data: new SlashCommandBuilder()
        .setName(`give`)
        .setDescription(`Выдать предмет пользователю`)
        .setDMPermission(false)
        .addStringOption(option => option
            .setName(`тип`)
            .setDescription(`Тип предмета`)
            .setAutocomplete(true)
            .setRequired(true)
        )
        .addUserOption(option => option
            .setName(`пользователь`)
            .setDescription(`Выберите пользователя, которому необходимо выдать предмет`)
            .setRequired(true)
        )
        .addNumberOption(option => option
            .setName(`количество`)
            .setDescription(`Выберите количество выдаваемого предмета`)
            .setRequired(true)
        ),

    async autoComplete(interaction, client) {

        const focusedValue = interaction.options.getFocused();
        const choices = ['Опыт активности', 'Опыт рангов', 'Румбики', 'Билеты', 'Совместные игры'];
        const filtered = choices.filter(choice => choice.toLowerCase().includes(focusedValue.toLowerCase()));;
        await interaction.respond(
            filtered.map(choice => ({ name: choice, value: choice })),
        );
    },
    async execute(interaction, client) {
        try {
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: `❗ Отсутствует необходимая роль!`
                })
                .setDescription(`Вы не имеете роль \`${interaction.guild.roles.cache.get(`320880176416161802`).name}\`!
Но вы всё ещё можете использовать команду \`/profile update\``)
                .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                .setColor(`DarkRed`)
                .setTimestamp(Date.now())

            if (!interaction.member.roles.cache.has(`320880176416161802`)) return interaction.reply({
                embeds: [embed],
                ephemeral: true
            })
            const member = interaction.options.getMember(`пользователь`) || interaction.member
            if (!member.roles.cache.has(`504887113649750016`)) return interaction.reply({
                content: `Данный участник не находится в гильдии!`,
                ephemeral: true
            })
            const user = interaction.options.getUser(`пользователь`) || interaction.member.user;
            const userData = await User.findOne({ userid: user.id })
            switch (interaction.options.getString(`тип`)) {
                case `Опыт активности`: {

                    let cur_exp = userData.exp + interaction.options.getNumber(`количество`)
                    let cur_level = userData.level
                    let total_exp = calcActLevel(0, cur_level, cur_exp)
                    let level_exp = getLevel(total_exp)
                    let level = level_exp[0], exp = level_exp[1]

                    userData.level = level
                    userData.exp = exp

                    userData.save();
                    client.ActExp(userData.userid)
                    await interaction.reply({
                        content: `Выдано ${interaction.options.getNumber(`количество`)}🌀 пользователю ${user}!`,
                        ephemeral: true
                    })
                    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.green(`[${user.username} получил опыт активности]`) + chalk.gray(`: Теперь у него ${userData.exp} опыта и ${userData.level} уровень.`))
                };

                    break;
                case `Опыт рангов`: {
                    userData.rank += interaction.options.getNumber(`количество`)
                    userData.save();

                    await interaction.reply({
                        content: `Выдано ${interaction.options.getNumber(`количество`)}💠 пользователю ${user}! У него теперь ${userData.rank} опыта рангов!`,
                        ephemeral: true
                    })
                    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.green(`[${user.username} получил опыт рангов]`) + chalk.gray(`: Теперь у него ${userData.rank} опыта рангов.`))

                }

                    break;
                case `Румбики`: {
                    userData.rumbik += interaction.options.getNumber(`количество`)
                    userData.progress.items.find(it => it.name == 'RUMBIKS_TOTAL').total_items += interaction.options.getNumber(`количество`)
                    userData.save();
                    await interaction.reply({
                        content: `Выдано ${interaction.options.getNumber(`количество`)}<:Rumbik:883638847056003072> пользователю ${user}! У него теперь ${userData.rumbik} румбиков!`,
                        ephemeral: true
                    })

                    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.green(`[${user.username} получил румбики]`) + chalk.gray(`: Теперь у него ${userData.rumbik} румбиков.`))
                }

                    break;

                case `Билеты`: {
                    userData.tickets += interaction.options.getNumber(`количество`)
                    userData.progress.items.find(it => it.name == 'TICKETS_TOTAL').total_items += interaction.options.getNumber(`количество`)
                    userData.save();
                    await interaction.reply({
                        content: `Выдано ${interaction.options.getNumber(`количество`)}🏷 пользователю ${user}! У него теперь ${userData.tickets} билетов!`,
                        ephemeral: true
                    })

                    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.green(`[${user.username} получил билеты]`) + chalk.gray(`: Теперь у него ${userData.tickets} билетов.`))
                }

                    break;
                case `Совместные игры`: {
                    userData.visited_games += interaction.options.getNumber(`количество`)
                    userData.save();
                    await interaction.reply({
                        content: `Выдано ${interaction.options.getNumber(`количество`)}🎲 пользователю ${user}! У него теперь ${userData.visited_games} посещенных совместных игр!`,
                        ephemeral: true
                    })

                    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.green(`[${user.username} получил совместные игры]`) + chalk.gray(`: Теперь у него ${userData.visited_games} посещенных совместных игр.`))
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
}