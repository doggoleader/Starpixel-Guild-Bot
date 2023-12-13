const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

const wait = require('node:timers/promises').setTimeout;
const fetch = require(`node-fetch`);
const api = process.env.hypixel_apikey;
const { User } = require(`../../schemas/userdata`)
const { Guild } = require(`../../schemas/guilddata`)
const chalk = require(`chalk`);

const { Games } = require('../../schemas/games');

async function autoComplete(interaction, client) {
    const focusedValue = interaction.options.getFocused();
    const choices = ['Камень', 'Ножницы', 'Бумага'];
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
        const user = interaction.member

        switch (interaction.options.getSubcommand()) {
            case `rps`: {
                const choice = interaction.options.getString(`выбор`)
                const random_choice = ['Камень', 'Ножницы', 'Бумага']
                let r_ch = random_choice[Math.floor(Math.random() * random_choice.length)]
                await interaction.reply({
                    content: `:black_medium_small_square: :rock: :black_medium_small_square: :page_facing_up: :black_medium_small_square: :scissors: :black_medium_small_square:

${user} играет в "Камень, ножницы, бумага". Он делает свой выбор...
:black_medium_small_square:`
                })
                await wait(500)
                await interaction.guild.channels.cache.get(interaction.channel.id).send({
                    content: `Противник думает....
:black_medium_small_square:`
                })
                await wait(500)
                await interaction.guild.channels.cache.get(interaction.channel.id).send({
                    content: `Противник все ещё думает....
:black_medium_small_square:`
                })
                await wait(500)
                await interaction.guild.channels.cache.get(interaction.channel.id).send({
                    content: `Противник сделал свой выбор...`
                })
                await wait(500)
                await interaction.guild.channels.cache.get(interaction.channel.id).send({
                    content: `:beginner: ${user} выбрал **${choice}**
                    
:beginner: Противник выбрал: **${r_ch}**.
                    
:black_medium_small_square: :rock: :black_medium_small_square: :page_facing_up: :black_medium_small_square: :scissors: :black_medium_small_square:`
                })
            }

                break;
            case `fact`: {
                const r_fact = [
                    ':crystal_ball: То получаешь не совсем то, что хочешь; то получаешь, а уже не хочешь; а то и вовсе не знаешь, чего хочешь на самом деле.',
                    ':crystal_ball: Да что ж за жизнь такая? Мечты сбываются, а переварить ты их не можешь...',
                    ':crystal_ball: Жизнь устроена так, что все вкусное рано или поздно кончается, поэтому вкусное можно дарить бесконечно.',
                    ':crystal_ball: Лишить сердце желания - все равно, что лишить Землю атмосферы.',
                    ':crystal_ball: В вопросах дружбы размер не имеет значения.',
                    ':crystal_ball: А вдруг окажется, что смысл жизни - не есть сладкого и не спать до двенадцати?',
                    ':crystal_ball: Когда сапфир закроет двери и грозный бык покажет путь, загадочная тайна мира в канале тайном услышит звук.',
                    ':crystal_ball: Не оглядывайся на прошлое. Живи настоящим.',
                    ':crystal_ball: Невероятно приятно влюбляться в одного и того же человека вновь и вновь. В его улыбку, смех и в то, как он на тебя смотрит.',
                    ':crystal_ball: Для того чтобы быть другом, не обязательно быть собакой.',
                    ':crystal_ball: Берись за все, что ты знаешь и умеешь или мечтаешь знать и уметь. В смелости заключается гениальность, власть и волшебная сила.',
                    ':crystal_ball: Никогда не спорьте с дураком — люди могут не заметить между вами разницы.',
                    ':scroll: **ИСТОРИЧЕСКИЙ ФАКТ** День рождения гильдии Starpixel - 6 июня 2021 года.',
                    ':scroll: **ИСТОРИЧЕСКИЙ ФАКТ** В прошлом гильдия Starpixel носила другие названия: Smeshariki и SkyGiants.',
                    ':scroll: **ИСТОРИЧЕСКИЙ ФАКТ** Официальный день рождения Discord сервера гильдии - 2 июня 2017 года.',
                    ':scroll: **ИСТОРИЧЕСКИЙ ФАКТ** Прошлая гильдия SkyGiants была распущена 26 мая 2021 года.',
                    ':scroll: **ИСТОРИЧЕСКИЙ ФАКТ** Гильдия Smeshariki была переименована в гильдию Starpixel 10 июля 2021 года.',
                    ':scroll: **ИСТОРИЧЕСКИЙ ФАКТ** За всю историю гильдии (с самого её начала) существовало 11 тайных команд. Только 7 из них были отгаданы.'
                ]
                let fact = r_fact[Math.floor(Math.random() * r_fact.length)]
                await interaction.reply({
                    content: `${fact} ${user}`
                })
            }

                break;
            case `random`: {
                const min = interaction.options.getNumber(`от`)
                const max = interaction.options.getNumber(`до`)
                let number = Math.floor(Math.random() * (max - min)) + min;
                await interaction.reply({
                    content: `Выбираю случайное число...`,
                    fetchReply: true
                })
                await wait(500)
                await interaction.followUp({
                    content: `Я выбрал **${number}**`
                })
            }

                break;
            case `mafia`: {
                const button = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`mafia_join`)
                            .setLabel(`Присоединиться к игре`)
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`🚪`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`mafia_start`)
                            .setLabel(`Начать игру`)
                            .setStyle(ButtonStyle.Success)
                            .setEmoji(`🚪`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`mafia_leave`)
                            .setLabel(`Выйти из игры`)
                            .setStyle(ButtonStyle.Danger)
                            .setEmoji(`🚪`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`mafia_end`)
                            .setLabel(`Закончить игру`)
                            .setStyle(ButtonStyle.Danger)
                            .setEmoji(`🚪`)
                    )

                const embed = new EmbedBuilder()
                    .setColor(Number(client.information.bot_color))
                    .setTitle(`Игра в мафию`)
                    .setDescription(`${interaction.member} создал комнату в игре в Мафию!
**Роли игры**:
__Мирные жители.__ Они, по сути, не выполняют никаких функций. Их основная задача – выяснить, кто же является мафией и убивает ни в чём не повинных горожан.
__Мафия__ – это самые главные злодеи, которые по ночам убивают мирных жителей. Мафиози может быть два, три или даже больше, в зависимости от общего количества игроков.
__Доктор__ может лечить горожан, убитых мафией.
__Любовница__ – персонаж вспомогательный. Этот игрок проводит ночь с одним из участников игры и тем самым спасает его от гибели, если на него будут покушаться мафиози.
__Комиссар__ следит за порядком и может арестовывать подозреваемых в убийствах.
__Маньяк.__ Он может занять сторону как мирных жителей, так и мафии или просто играть за себя и защищать собственные интересы. По ночам он может убивать всех: мирных жителей и мафию.

**Необходимое количество игроков для начала**: 5 игроков

**Игроков**
**1.** ${interaction.user} 🕑`)
                await interaction.deferReply({ fetchReply: true })
                await interaction.deleteReply()
                const msg = await interaction.channel.send({
                    components: [button],
                    embeds: [embed]
                })
                const delData = await Games.findOne({
                    guildid: interaction.guild.id,
                    started_by: interaction.user.id
                })
                if (delData) delData.delete()
                const gameData = new Games({ guildid: interaction.guild.id, messageid: msg.id, started_by: interaction.user.id })
                gameData.mafia.players.push({
                    userid: interaction.user.id
                })
                gameData.save()
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
    category: `games`,
    plugin: {
        id: "misc",
        name: "Разное"
    },
    data: new SlashCommandBuilder()
        .setName(`games`)
        .setDescription(`Игры с ботом`)
        .setDMPermission(false)
        .addSubcommand(subcommand => subcommand
            .setName(`rps`)
            .setDescription(`Камень, ножницы, бумага`)
            .addStringOption(option => option
                .setName(`выбор`)
                .setDescription(`Выберите: камень, ножницы или бумага`)
                .setRequired(true)
                .setAutocomplete(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName(`fact`)
            .setDescription(`Случайный факт о гильдии`)
        )
        .addSubcommand(subcommand => subcommand
            .setName(`random`)
            .setDescription(`Случайное число в диапазоне`)
            .addNumberOption(option => option
                .setName(`от`)
                .setDescription(`Начало выбора случайного числа`)
                .setRequired(true)
            )
            .addNumberOption(option => option
                .setName(`до`)
                .setDescription(`Конец выбора случайного числа`)
                .setRequired(true)
            )
        )
        /* .addSubcommand(subcommand => subcommand
            .setName(`mafia`)
            .setDescription(`Мафия`)
        ) */,
    autoComplete,
    execute
};