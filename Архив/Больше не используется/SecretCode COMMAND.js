const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { execute } = require('../../src/events/client/start_bot/ready');
const fetch = require(`node-fetch`);
const api = process.env.hypixel_apikey;
const { User } = require(`../../src/schemas/userdata`)
const chalk = require(`chalk`);
const prettyMilliseconds = require(`pretty-ms`); //ДОБАВИТЬ В ДРУГИЕ
const linksInfo = require(`../../src/discord structure/links.json`)

module.exports = {
    category: `security`,
    plugin: `info`,
    data: new SlashCommandBuilder()
        .setName(`code`)
        .setDescription(`Код безопасности гильдии Starpixel`)
        .setDMPermission(false)
        .addSubcommand(subcommand => subcommand
            .setName(`first`)
            .setDescription(`Получить первый код безопасности`)
        )
        .addSubcommand(subcommand => subcommand
            .setName(`new`)
            .setDescription(`Сгенерировать новый код безопасности`)
            .addStringOption(option => option
                .setName(`код`)
                .setDescription(`Введите введите текущий код безопасности`)
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName(`use`)
            .setDescription(`Использовать код безопасности`)
            .addStringOption(option => option
                .setName(`код`)
                .setDescription(`Введите код безопасности, чтобы использовать его`)
                .setRequired(true)
            )
        ),

    async execute(interaction, client) {
        try {
            const { Guild } = require(`../../src/schemas/guilddata`)
            const pluginData = await Guild.findOne({ id: interaction.guild.id })
            if (pluginData.plugins.security === false) return interaction.reply({ content: `Данный плагин отключён! Попробуйте позже!`, ephemeral: true })
            const user = interaction.user
            const userData = await User.findOne({ userid: user.id })

            switch (interaction.options.getSubcommand()) {
                case `new`: {
                    const old_code = interaction.options.getString(`код`)

                    const wrong_code = new EmbedBuilder()
                        .setAuthor({
                            name: `❗ Неверный код!`
                        })
                        .setDescription(`Код, который вы ввели - неверный. Пожалуйста, повторите попытку снова!`)
                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                        .setColor(`DarkRed`)
                        .setTimestamp(Date.now())
                    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.red(`[ВВЕДЁН КОД БЕЗОПАСНОСТИ]`) + chalk.white(`: ${user.username} ввёл код безопасности! Введённый код: ${old_code}. Правильный код: ${userData.security_code}`))
                    if (old_code !== userData.security_code) return interaction.reply({
                        embeds: [wrong_code]
                    })
                    if (old_code == userData.security_code) {
                        const right_code = new EmbedBuilder()
                            .setAuthor({
                                name: `✅ Код принят!`
                            })
                            .setColor(Number(linksInfo.bot_color))
                            .setDescription(`Новый код был отправлен вам в личные сообщения!`)
                            .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                            .setTimestamp(Date.now())
                        const n1 = [`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`, `N`, `O`, `P`, `Q`, `R`, `S`, `T`, `U`, `V`, `W`, `X`, `Y`, `Z`, `0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `a`, `b`, `c`, `d`, `e`, `f`, `g`, `h`, `i`, `j`, `k`, `l`, `m`, `n`, `o`, `p`, `q`, `r`, `s`, `t`, `u`, `v`, `w`, `x`, `y`, `z`, `0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`]
                        let r1 = n1[Math.floor(Math.random() * n1.length)]
                        let r2 = n1[Math.floor(Math.random() * n1.length)]
                        let r3 = n1[Math.floor(Math.random() * n1.length)]
                        let r4 = n1[Math.floor(Math.random() * n1.length)]
                        let r5 = n1[Math.floor(Math.random() * n1.length)]
                        let r6 = n1[Math.floor(Math.random() * n1.length)]
                        let r7 = n1[Math.floor(Math.random() * n1.length)]
                        let r8 = n1[Math.floor(Math.random() * n1.length)]
                        let r9 = n1[Math.floor(Math.random() * n1.length)]



                        const code = `${r1}${r2}${r3}${r4}${r5}${r6}${r7}${r8}${r9}`

                        try {
                            const memberDM = await interaction.guild.members.fetch(user.id)
                            userData.security_code = code;
                            userData.markModified(`code`)
                            await memberDM.send(`Ваш код безопасности в гильдии Starpixel: ${code}
Он может пригодиться вам, если с вашим аккаунтом что-либо случится, а также если вам нужна будет поддержка, связанная с изменением вашего аккаунта. 
❔ Если вы потеряете код, вы можете создать новый код, если пропишите команду \`/code new\`
❗ **Никому не сообщайте этот код!** Если вам потребуется использовать код, пропишите команду \`/code use\`.`)
                            console.log(chalk.blackBright(`[${new Date()}]`) + chalk.red(`[ПОЛУЧЕН КОД БЕЗОПАСНОСТИ]`) + chalk.white(`: ${user.username} получил первый код безопасности: ${userData.security_code}`))
                        } catch (error) {
                            await interaction.reply({
                                content: `У вас ${user} закрыты личные сообщения! Откройте их и повторите попытку снова!`,
                                ephemeral: true
                            });
                            return;
                        }
                        await interaction.reply({
                            embeds: [right_code]
                        })
                        userData.save()
                        console.log(chalk.blackBright(`[${new Date()}]`) + chalk.red(`[ИЗМЕНЁН КОД БЕЗОПАСНОСТИ]`) + chalk.white(`: ${user.username} изменил код безопасности! Новый код безопасности: ${userData.security_code}`))
                    }


                }

                    break;
                case `use`: {
                    const code = interaction.options.getString(`код`)
                    const DMadmin = await interaction.guild.members.fetch(user.id)

                    const wrong_code = new EmbedBuilder()
                        .setAuthor({
                            name: `❗ Неверный код!`
                        })
                        .setDescription(`Код, который вы ввели - неверный. Пожалуйста, повторите попытку снова!`)
                        .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                        .setColor(`DarkRed`)
                        .setTimestamp(Date.now())
                    if (code !== userData.security_code) return interaction.reply({
                        embeds: [wrong_code]
                    })
                    if (code == userData.security_code) {
                        const received = new EmbedBuilder()
                            .setAuthor({
                                name: `✅ Код принят!`
                            })
                            .setDescription(`Ваш код принят! Пожалуйста, дождитесь ответа администратора.`)
                            .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                            .setColor(Number(linksInfo.bot_color))
                            .setTimestamp(Date.now())

                        await interaction.reply({
                            embeds: [received]
                        })
                        console.log(chalk.blackBright(`[${new Date()}]`) + chalk.hex(`#c9ff50`)(`[ИСПОЛЬЗОВАН КОД БЕЗОПАСНОСТИ]`) + chalk.white(`: ${user.username} использовал код безопасности: ${userData.security_code}`))
                    }
                }
                    break;
                case `first`: {
                    if (userData.security_code !== `0000`) {
                        let currentCode = userData.security_code

                        const err_embed = new EmbedBuilder()
                            .setTitle(`Ошибка!`)
                            .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                            .setColor(`DarkRed`)
                            .setTimestamp(Date.now())
                            .setDescription(`Вы уже установили свой код безопасности! Найдите его в личных сообщениях с ботом!`)
                        await interaction.reply({
                            embeds: [err_embed],
                            ephemeral: true
                        })
                        return
                    }


                    const memberDM = await interaction.guild.members.fetch(user.id)
                    const n1 = [`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`, `N`, `O`, `P`, `Q`, `R`, `S`, `T`, `U`, `V`, `W`, `X`, `Y`, `Z`, `0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `a`, `b`, `c`, `d`, `e`, `f`, `g`, `h`, `i`, `j`, `k`, `l`, `m`, `n`, `o`, `p`, `q`, `r`, `s`, `t`, `u`, `v`, `w`, `x`, `y`, `z`, `0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`]
                    let r1 = n1[Math.floor(Math.random() * n1.length)]
                    let r2 = n1[Math.floor(Math.random() * n1.length)]
                    let r3 = n1[Math.floor(Math.random() * n1.length)]
                    let r4 = n1[Math.floor(Math.random() * n1.length)]
                    let r5 = n1[Math.floor(Math.random() * n1.length)]
                    let r6 = n1[Math.floor(Math.random() * n1.length)]
                    let r7 = n1[Math.floor(Math.random() * n1.length)]
                    let r8 = n1[Math.floor(Math.random() * n1.length)]
                    let r9 = n1[Math.floor(Math.random() * n1.length)]


                    const code = `${r1}${r2}${r3}${r4}${r5}${r6}${r7}${r8}${r9}`



                    try {
                        userData.security_code = code;
                        await memberDM.send(`Ваш код безопасности в гильдии Starpixel: \`${code}\`
Он может пригодиться вам, если с вашим аккаунтом что-либо случится, а также если вам нужна будет поддержка, связанная с изменением вашего аккаунта. 
❔ Если вы захотите поменять код, вы можете создать новый, если пропишите команду \`/code new\`
❗ **Никому не сообщайте этот код!** Если вам потребуется использовать код, пропишите команду \`/code use\`.`)
                        userData.security_code = code;
                        await interaction.reply({
                            content: `Код был отправлен вам в личные сообщения!`,
                            ephemeral: true
                        })
                    } catch (error) {
                        await interaction.reply({
                            content: `У вас закрыты личные сообщения! Откройте их и повторите попытку снова!`,
                            ephemeral: true
                        });
                        return;
                    }
                    userData.save()
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
};

