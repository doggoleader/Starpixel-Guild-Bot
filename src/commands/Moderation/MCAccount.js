const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType, StringSelectMenuBuilder, ChannelType, UserSelectMenuBuilder, AttachmentBuilder, ApplicationFlagsBitField } = require('discord.js');
const fetch = require(`node-fetch`);
const api = process.env.hypixel_apikey;
const { User } = require(`../../schemas/userdata`)
const { Guild } = require(`../../schemas/guilddata`)
const chalk = require(`chalk`);
const prettyMilliseconds = require(`pretty-ms`); //ДОБАВИТЬ В ДРУГИЕ
const { calcActLevel, getLevel, rankName, monthName, convertToRoman } = require(`../../functions`);
const linksInfo = require(`../../discord structure/links.json`)
const fs = require(`fs`)
const rolesInfo = require(`../../discord structure/roles.json`);

module.exports = {
    category: `items`,
    plugin: {
        id: "hypixel",
        name: "Hypixel"
    },
    data: new SlashCommandBuilder()
        .setName(`mc`)
        .setDescription(`Аккаунт Minecraft`)
        .setDMPermission(false)
        .addSubcommand(subcommand => subcommand
            .setName(`link`)
            .setDescription(`Привязать аккаунт Minecraft`)
            .addStringOption(option => option
                .setName(`никнейм`)
                .setDescription(`Никнейм в Minecraft`)
                .setMaxLength(16)
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName(`unlink`)
            .setDescription(`Обновить свой профиль`)
        ),
    async execute(interaction, client) {
        try {
            const { user, member, guild, options } = interaction;
            if (!member.roles.cache.has("504887113649750016")) return interaction.reply({
                content: `Вы должны быть участником гильдии, чтобы использовать эту команду!`,
                ephemeral: true
            })
            const userData = await User.findOne({ userid: interaction.user.id, guildid: interaction.guild.id })
            const NICKNAME = userData.nickname;
            const UUID = userData.uuid;

            switch (options.getSubcommand()) {
                case `link`: {

                    if (userData.cooldowns.mc_link > Date.now())
                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(Number(linksInfo.bot_color))
                                    .setAuthor({
                                        name: `Вы не можете использовать эту команду`
                                    })
                                    .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${prettyMilliseconds(userData.cooldowns.mc_link - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}!`)
                            ],
                            ephemeral: true
                        });

                    if (userData.onlinemode) return interaction.reply({
                        content: `У вас уже имеется привязанный аккаунт \`${userData.nickname}\` (UUID: \`${userData.uuid}\`)! Если вы желаете поменять аккаунт, сначала отвяжите этот с помощью \`/${this.data.name + " unlink"}\`!`,
                        ephemeral: true
                    })

                    let nickname = options.getString("никнейм");
                    let response = await fetch(`https://api.hypixel.net/player?name=${nickname}`, {
                        headers: {
                            "API-Key": api,
                            "Content-Type": "application/json"
                        }
                    })
                    try {
                        let json = await response.json()
                        if (json.player == null) return interaction.reply({
                            content: `Пользователь с именем \`${nickname}\` не был найден!`,
                            ephemeral: true
                        })

                        if (!json?.player?.socialMedia?.links?.DISCORD) return interaction.reply({
                            content: `Данный аккаунт Discord (\`${user.username}\`) не привязан к вашему аккаунту Minecraft на сервере Hypixel (\`${nickname}\`). Чтобы привязать его, следуйте инструкции:
1. Зайдите на сервер Hypixel
2. В панели быстрого доступа выберите \`Мой профиль\`
3. Перейдите в \`Социальные сети\`
4. Выберите \`Discord\`
5. Введите в чате ваше имя пользователя (\`${user.username}\`) и отправьте сообщение
6. Введите команду ещё раз`
                        })

                        userData.nickname = json.player.displayname;
                        userData.uuid = json.player.uuid;
                        userData.onlinemode = true;
                        userData.cooldowns.mc_link = Date.now() + 1000 * 60 * 60 * 24
                        userData.save()
                        await interaction.reply({
                            content: `Данные вашего аккаунта были успешно изменены!
Никнейм Minecraft: \`${NICKNAME}\` ➡ \`${userData.nickname}\`
UUID: \`${UUID}\` ➡ \`${userData.uuid}\``
                        })
                    } catch (e) {
                        return interaction.reply({
                            content: `Во время обработки аккаунта с именем \`${nickname}\` произошла ошибка! Проверьте правильность введённых данных или попробуйте позже!`,
                            ephemeral: true
                        })
                    }
                }
                    break;
                case `unlink`: {
                    if (userData.cooldowns.mc_unlink > Date.now())
                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor(Number(linksInfo.bot_color))
                                    .setAuthor({
                                        name: `Вы не можете использовать эту команду`
                                    })
                                    .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${prettyMilliseconds(userData.cooldowns.mc_unlink - Date.now(), { verbose: true, secondsDecimalDigits: 0 })}!`)
                            ],
                            ephemeral: true
                        });

                    if (!userData.onlinemode) return interaction.reply({
                        content: `У вас нет привязанного аккаунта Minecraft, поэтому вы не можете использовать эту команду! Привяжите аккаунт при помощи команды \`/mc link\`!`,
                        ephemeral: true
                    })

                    userData.nickname = null;
                    userData.uuid = null;
                    userData.onlinemode = false;
                    userData.cooldowns.mc_unlink = Date.now() + 1000 * 60 * 60 * 24
                    userData.save()
                    await interaction.reply({
                        content: `Данные вашего аккаунта были успешно изменены!
Никнейм Minecraft: \`${NICKNAME}\` ➡ \`${userData.nickname}\`
UUID: \`${UUID}\` ➡ \`${userData.uuid}\``
                    })
                }
                    break;

                default:
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