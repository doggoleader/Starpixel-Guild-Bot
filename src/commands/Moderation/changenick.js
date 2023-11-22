const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

const fetch = require(`node-fetch`);
const api = process.env.hypixel_apikey;
const { User } = require(`../../schemas/userdata`)
const { Guild } = require(`../../schemas/guilddata`)
const chalk = require(`chalk`);
const prettyMilliseconds = require(`pretty-ms`); //ДОБАВИТЬ В ДРУГИЕ
const linksInfo = require(`../../discord structure/links.json`)

async function autoComplete(interaction, client) {

    const focusedValue = interaction.options.getFocused();
    const choices = [
        'Символ ранга',
        'Рамка (перед ником)',
        'Имя',
        'Рамка (после ника)',
        'Суффикс',
        'Косметический значок',
        'Статус Premium',
    ];
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
        const user = interaction.options.getUser(`пользователь`)
        const userData = await User.findOne({ userid: user.id })

        const newoption = interaction.options.getString(`значение`) || ``

        switch (interaction.options.getString(`часть`)) {
            case `Символ ранга`: {
                userData.displayname.rank = newoption;
                userData.save()
                await interaction.reply({
                    content: `В скором времени никнейм пользователя изменится на \`「${userData.displayname.rank}」 ${userData.displayname.ramka1}${userData.displayname.name}${userData.displayname.ramka2}${userData.displayname.suffix} ${userData.displayname.symbol}┇ ${userData.displayname.premium}\``,
                    ephemeral: true
                })
            }

                break;
            case `Рамка (перед ником)`: {
                userData.displayname.ramka1 = newoption;
                userData.save()
                await interaction.reply({
                    content: `В скором времени никнейм пользователя изменится на \`「${userData.displayname.rank}」 ${userData.displayname.ramka1}${userData.displayname.name}${userData.displayname.ramka2}${userData.displayname.suffix} ${userData.displayname.symbol}┇ ${userData.displayname.premium}\``,
                    ephemeral: true
                })
            }

                break;
            case `Имя`: {
                userData.displayname.name = newoption;
                userData.save()
                await interaction.reply({
                    content: `В скором времени никнейм пользователя изменится на \`「${userData.displayname.rank}」 ${userData.displayname.ramka1}${userData.displayname.name}${userData.displayname.ramka2}${userData.displayname.suffix} ${userData.displayname.symbol}┇ ${userData.displayname.premium}\``,
                    ephemeral: true
                })
            }

                break;
            case `Рамка (после ника)`: {
                userData.displayname.ramka2 = newoption;
                userData.save()
                await interaction.reply({
                    content: `В скором времени никнейм пользователя изменится на \`「${userData.displayname.rank}」 ${userData.displayname.ramka1}${userData.displayname.name}${userData.displayname.ramka2}${userData.displayname.suffix} ${userData.displayname.symbol}┇ ${userData.displayname.premium}\``,
                    ephemeral: true
                })
            }

                break;
            case `Суффикс`: {
                userData.displayname.suffix = newoption;
                userData.save()
                await interaction.reply({
                    content: `В скором времени никнейм пользователя изменится на \`「${userData.displayname.rank}」 ${userData.displayname.ramka1}${userData.displayname.name}${userData.displayname.ramka2}${userData.displayname.suffix} ${userData.displayname.symbol}┇ ${userData.displayname.premium}\``,
                    ephemeral: true
                })
            }

                break;
            case `Косметический значок`: {
                userData.displayname.symbol = newoption;
                userData.save()
                await interaction.reply({
                    content: `В скором времени никнейм пользователя изменится на \`「${userData.displayname.rank}」 ${userData.displayname.ramka1}${userData.displayname.name}${userData.displayname.ramka2}${userData.displayname.suffix} ${userData.displayname.symbol}┇ ${userData.displayname.premium}\``,
                    ephemeral: true
                })
            }

                break;
            case `Статус Premium`: {
                userData.displayname.premium = newoption;
                userData.save()
                await interaction.reply({
                    content: `В скором времени никнейм пользователя изменится на \`「${userData.displayname.rank}」 ${userData.displayname.ramka1}${userData.displayname.name}${userData.displayname.ramka2}${userData.displayname.suffix} ${userData.displayname.symbol}┇ ${userData.displayname.premium}\``,
                    ephemeral: true
                })
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
        id: "nicknames",
        name: "Никнеймы"
    },
    data: new SlashCommandBuilder()
        .setName(`changenick`)
        .setDescription(`Изменить части никнейма пользователя`)
        .setDMPermission(false)
        .addUserOption(option => option
            .setName(`пользователь`)
            .setDescription(`Пользователь`)
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName(`часть`)
            .setDescription(`Часть никнейма для изменения`)
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addStringOption(option => option
            .setName(`значение`)
            .setDescription(`Символ, на который нужно изменить`)
        ),
};