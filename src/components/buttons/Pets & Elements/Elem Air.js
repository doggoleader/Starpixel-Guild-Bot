const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fetch = require(`node-fetch`);
const api = process.env.hypixel_apikey;
const { User } = require(`../../../schemas/userdata`)
const chalk = require(`chalk`);
const prettyMilliseconds = require(`pretty-ms`); //ДОБАВИТЬ В ДРУГИЕ
const ch_list = require(`../../../discord structure/channels.json`)
const linksInfo = require(`../../../discord structure/links.json`)

module.exports = {
    plugin: {
        id: "items",
        name: "Предметы"
    },
    data: {
        name: `elem_air`
    },

    async execute(interaction, client) {
        try {
            const { member, user, channel, guild } = interaction
            const userData = await User.findOne({ userid: user.id })

            let role = `930169145314652170`
            const no_role = new EmbedBuilder()
                .setAuthor({
                    name: `❗ Отсутствует необходимая роль!`
                })
                .setDescription(`Вы не имеете роль \`${interaction.guild.roles.cache.get(role).name}\`!`)
                .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                .setColor(`DarkRed`)
                .setTimestamp(Date.now())
            if (!member.roles.cache.has(role)) return interaction.reply({
                embeds: [no_role],
                ephemeral: true
            })

            const cd = new EmbedBuilder()
                .setColor(Number(linksInfo.bot_color))
                .setAuthor({
                    name: `Вы не можете использовать эту команду`
                })
                .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${prettyMilliseconds(userData.cooldowns.air - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}!`)

            if (userData.cooldowns.air > Date.now()) return interaction.reply({
                embeds: [cd],
                ephemeral: true
            })

            try {
                await interaction.deferUpdate()
                let pet = [
                    {
                        dropChance: 10,
                        name: 300
                    },
                    {
                        dropChance: 5,
                        name: 500
                    },
                    {
                        dropChance: 35,
                        name: 400
                    },
                    {
                        dropChance: 50,
                        name: 200
                    },


                ]

                let sum_act = 0;
                for (let i_act = 0; i_act < pet.length; i_act++) {
                    sum_act += pet[i_act].dropChance;
                }
                let r_act = Math.floor(Math.random() * sum_act);
                let i_act = 0;
                for (let s = pet[0].dropChance; s <= r_act; s += pet[i_act].dropChance) {
                    i_act++;
                }

                await interaction.guild.channels.cache.get(ch_list.act).send(
                    `:black_medium_small_square:
🌪️ ${user} использует силы Стихии Воздуха:
╭─────↯─────╮
Он получает \`${pet[i_act].name}\`🌀.
╰─────↯─────╯
:black_medium_small_square:`
                );
                userData.exp += pet[i_act].name
                userData.total += pet[i_act].name
                userData.cooldowns.air = Date.now() + (1000 * 60 * 60 * 24 * 7)
                userData.save()
                client.ActExp(userData.userid)


            } catch (error) {
                console.log(chalk.blackBright(`[${new Date()}]`) + chalk.red(`[Ошибка]`) + chalk.white(`: ${member.user.username} получил ошибку при выдаче навыка`))
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
};