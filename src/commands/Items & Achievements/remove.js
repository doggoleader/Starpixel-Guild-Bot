const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const { User } = require(`../../schemas/userdata`);
const chalk = require(`chalk`);
const ch_list = require(`../../discord structure/channels.json`)
const { calcActLevel, getLevel } = require(`../../functions`)
const linksInfo = require(`../../discord structure/links.json`);

async function autoComplete(interaction, client) {

    const focusedValue = interaction.options.getFocused();
    const choices = ['Опыт активности', 'Опыт рангов', 'Румбики', 'Билеты', 'Совместные игры'];
    const filtered = choices.filter(choice => choice.toLowerCase().includes(focusedValue.toLowerCase()));;
    await interaction.respond(
        filtered.map(choice => ({ name: choice, value: choice })),
    );
}
/**
 * 
 * @param {import("discord.js").ChatInputCommandInteraction} interaction Interaction
 * @param {import("../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        const embed = new EmbedBuilder()
            .setAuthor({
                name: `❗ Отсутствует необходимая роль!`
            })
            .setDescription(`Вы не имеете роль \`${interaction.guild.roles.cache.get(`320880176416161802`).name}\`!`)
            .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
            .setColor(`DarkRed`)
            .setTimestamp(Date.now())

        if (!interaction.member.roles.cache.has(`320880176416161802`)) return interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
        const member = interaction.options.getMember(`пользователь`)
        if (!member.roles.cache.has(`504887113649750016`)) return interaction.reply({
            content: `Данный участник не находится в гильдии!`,
            ephemeral: true
        })
        const user = interaction.options.getUser(`пользователь`);
        const userData = await User.findOne({ userid: user.id })
        switch (interaction.options.getString(`тип`)) {
            case `Опыт активности`: {

                const total = calcActLevel(0, userData.level, userData.exp)

                const value = interaction.options.getNumber(`количество`);
                const not_possible = new EmbedBuilder()
                    .setColor(`DarkRed`)
                    .setTitle(`Невозможно выполнить данное действие!`)
                    .setTimestamp(Date.now())
                    .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                    .setDescription(`Данное действие невозможно выполнить, так как опыт активности не может быть меньше 0! ${total} < ${value}`)
                if (total < value) return interaction.reply({
                    embeds: [not_possible]
                })

                let cur_exp = userData.exp - interaction.options.getNumber(`количество`)
                let cur_level = userData.level
                let total_exp = calcActLevel(0, cur_level, cur_exp)
                let level_exp = getLevel(total_exp)
                let level = level_exp[0], exp = level_exp[1]

                userData.level = level
                userData.exp = exp
                userData.save();
                client.ActExp(userData.userid);

                await interaction.reply({
                    content: `Убрано ${interaction.options.getNumber(`количество`)}🌀 у пользователя ${user}!`,
                    ephemeral: true
                })
                console.log(chalk.blackBright(`[${new Date()}]`) + chalk.green(`[${user.username} потерял опыт активности]`) + chalk.gray(`: Теперь у него ${userData.exp} опыта и ${userData.level} уровень.`))
            };

                break;
            case `Опыт рангов`: {

                userData.rank -= interaction.options.getNumber(`количество`)
                const not_possible = new EmbedBuilder()
                    .setColor(`DarkRed`)
                    .setTitle(`Невозможно выполнить данное действие!`)
                    .setTimestamp(Date.now())
                    .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                    .setDescription(`Данное действие невозможно выполнить, так как опыт рангов не может быть меньше 0! (${userData.rank} < 0)`)
                if (userData.rank < 0) return interaction.reply({
                    embeds: [not_possible]
                })
                userData.save();
                await interaction.reply({
                    content: `Убрано ${interaction.options.getNumber(`количество`)}💠 у пользователя ${user}! У него теперь ${userData.rank} опыта рангов!`,
                    ephemeral: true
                })

                console.log(chalk.blackBright(`[${new Date()}]`) + chalk.green(`[${user.username} потерял опыт рангов]`) + chalk.gray(`: Теперь у него ${userData.rank} опыта рангов.`))

            }

                break;
            case `Румбики`: {

                userData.rumbik -= interaction.options.getNumber(`количество`)
                const not_possible = new EmbedBuilder()
                    .setColor(`DarkRed`)
                    .setTitle(`Невозможно выполнить данное действие!`)
                    .setTimestamp(Date.now())
                    .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                    .setDescription(`Данное действие невозможно выполнить, так как количество румбиков не может быть меньше 0! (${userData.rumbik} < 0)`)
                if (userData.rumbik < 0) return interaction.reply({
                    embeds: [not_possible]
                })
                userData.save();
                await interaction.reply({
                    content: `Убрано ${interaction.options.getNumber(`количество`)}<:Rumbik:883638847056003072> у пользователя ${user}! У него теперь ${userData.rumbik} румбиков!`,
                    ephemeral: true
                })
                console.log(chalk.blackBright(`[${new Date()}]`) + chalk.green(`[${user.username} потерял румбики]`) + chalk.gray(`: Теперь у него ${userData.rumbik} румбиков.`))
            }

                break;

            case `Билеты`: {

                userData.tickets -= interaction.options.getNumber(`количество`)
                const not_possible = new EmbedBuilder()
                    .setColor(`DarkRed`)
                    .setTitle(`Невозможно выполнить данное действие!`)
                    .setTimestamp(Date.now())
                    .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                    .setDescription(`Данное действие невозможно выполнить, так как количество билетов не может быть меньше 0! (${userData.tickets} < 0)`)
                if (userData.tickets < 0) return interaction.reply({
                    embeds: [not_possible]
                })
                userData.save();
                await interaction.reply({
                    content: `Выдано ${interaction.options.getNumber(`количество`)}🏷 пользователю ${user}! У него теперь ${userData.tickets} билетов!`,
                    ephemeral: true
                })

                console.log(chalk.blackBright(`[${new Date()}]`) + chalk.green(`[${user.username} потерял билеты]`) + chalk.gray(`: Теперь у него ${userData.tickets} билетов.`))
            }

                break;
            case `Совместные игры`: {

                userData.visited_games -= interaction.options.getNumber(`количество`)
                const not_possible = new EmbedBuilder()
                    .setColor(`DarkRed`)
                    .setTitle(`Невозможно выполнить данное действие!`)
                    .setTimestamp(Date.now())
                    .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                    .setDescription(`Данное действие невозможно выполнить, так как количество посещенных совместных игр не может быть меньше 0! (${userData.visited_games} < 0)`)
                if (userData.visited_games < 0) return interaction.reply({
                    embeds: [not_possible]
                })
                userData.save();
                await interaction.reply({
                    content: `Выдано ${interaction.options.getNumber(`количество`)}🎲 пользователю ${user}! У него теперь ${userData.visited_games} посещенных совместных игр!`,
                    ephemeral: true
                })

                console.log(chalk.blackBright(`[${new Date()}]`) + chalk.green(`[${user.username} потерял совместные игры]`) + chalk.gray(`: Теперь у него ${userData.visited_games} посещенных совместных игр.`))
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
        id: "items",
        name: "Предметы"
    },
    data: new SlashCommandBuilder()
        .setName(`remove`)
        .setDescription(`Убрать предмет у пользователя.`)
        .setDMPermission(false)
        .addStringOption(option => option
            .setName(`тип`)
            .setDescription(`Тип предмета`)
            .setAutocomplete(true)
            .setRequired(true)
        )
        .addUserOption(option => option
            .setName(`пользователь`)
            .setDescription(`Выберите пользователя, у которого необходимо забрать предмет.`)
            .setRequired(true)
        )
        .addNumberOption(option => option
            .setName(`количество`)
            .setDescription(`Выберите количество забираемого предмета.`)
            .setRequired(true)
        ),
    autoComplete,
    execute
}