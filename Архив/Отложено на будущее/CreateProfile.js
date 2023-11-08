const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ComponentType, StringSelectMenuBuilder, ChannelType, UserSelectMenuBuilder } = require('discord.js');
const fetch = require(`node-fetch`);
const wait = require(`node:timers/promises`).setTimeout
const api = process.env.hypixel_apikey;
const { User } = require(`../../schemas/userdata`)
const { Guild } = require(`../../schemas/guilddata`)
const { Apply } = require(`../../schemas/applications`)
const { Birthday } = require(`../../schemas/birthday`)
const chalk = require(`chalk`);
const prettyMilliseconds = require(`pretty-ms`); //ДОБАВИТЬ В ДРУГИЕ
const ch_list = require(`../../discord structure/channels.json`);
const { calcActLevel, getLevel, rankName, monthName } = require(`../../functions`);
const linksInfo = require(`../../discord structure/links.json`)
const rolesInfo = require(`../../discord structure/roles.json`);
module.exports = (client) => {
    client.CreateProfile = async (interaction) => {
        try {
            await interaction.deferReply({
                fetchReply: true,
                ephemeral: true
            })
            if (interaction.channel.type == ChannelType.DM) return interaction.editReply({
                content: `Вы не можете использовать эту команду в личных сообщениях!`,
                ephemeral: true
            })
            const user = interaction.options.getUser(`пользователь`)
            const appData = await Apply.findOne({ userid: user.id, guildid: interaction.guild.id })
            const realname = appData.que1
            const playername = appData.que2

            if (!interaction.member.roles.cache.has(`563793535250464809`)) {
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: `❗ Отсутствует необходимая роль!`
                    })
                    .setDescription(`Вы не имеете роль \`${interaction.guild.roles.cache.get(`563793535250464809`).name}\` или выше!`)
                    .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                    .setColor(`DarkRed`)
                    .setTimestamp(Date.now())

                return interaction.editReply({
                    embeds: [embed],
                    ephemeral: true
                })
            }
            else {
                const thread = await interaction.guild.channels.fetch(appData.threadid)
                await thread.setLocked(true).catch()
                await thread.setArchived(true).catch()

                const userData = new User({ userid: user.id, name: user.username })
                const creator = await User.findOne({ userid: interaction.member.user.id }) || new User({ userid: interaction.member.user.id, name: interaction.member.user.username })

                if (creator.cooldowns.prof_create > Date.now()) return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({
                                name: `Команда на перезарядке!`
                            })
                            .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                            .setColor(`DarkRed`)
                            .setTimestamp(Date.now())
                            .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${prettyMilliseconds(userData.cooldowns.prof_create - Date.now(), { secondsDecimalDigits: 0 })}!`)
                    ],
                    ephemeral: true
                });
                const memberDM = await interaction.guild.members.fetch(user.id)
                let response = await fetch(`https://api.hypixel.net/player?key=${api}&name=${playername}`)
                try {
                    let json = await response.json()

                    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.hex(`#FFA500`)(`[HypixelAPI]`) + chalk.gray(`: Ник игрока - ${json.player.displayname}, UUID - ${json.player.uuid}`))
                    userData.nickname = json.player.displayname;
                    userData.markModified(`nickname`)
                    userData.uuid = json.player.uuid;
                    userData.markModified(`uuid`)
                    userData.cooldowns.prof_update = Date.now() + (1000 * 60 * 60 * 24)
                    creator.cooldowns.prof_create = Date.now() + (1000 * 60)
                    creator.markModified(`prof_create`)
                } catch (error) {
                    await interaction.followUp({
                        content: `Произошла ошибка при обработке никнейма \`${playername}\`! Если это ошибка, пожалуйста, обратить в <#849516805529927700>, сообщив ваш никнейм!`
                    })
                    await memberDM.send({
                        content: `Произошла ошибка при обработке никнейма \`${playername}\`! Если это ошибка, пожалуйста, обратить в <#849516805529927700>, сообщив ваш никнейм!`
                    }).catch()
                    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.hex(`#FFA500`)(`[HypixelAPI]`) + chalk.gray(`: Игрока с никнеймом ${playername} не существует `));
                    return;
                }
                try {
                    const age = Number(appData.que3)
                    if (age <= 0) return interaction.editReply({
                        content: `Возраст не может быть отрицательным!`,
                        ephemeral: true
                    })
                    userData.age = age
                } catch (e) {
                    await interaction.followUp({
                        content: `Произошла ошибка при обработке вашего возраста \`${appData.que3}\`! Если это ошибка, пожалуйста, обратить в <#849516805529927700>, сообщив ваш возраст!`
                    })
                    await memberDM.send({
                        content: `Произошла ошибка при обработке вашего возраста \`${appData.que3}\`! Если это ошибка, пожалуйста, обратить в <#849516805529927700>, сообщив ваш возраст!`
                    }).catch()
                }

                userData.name = user.username
                userData.displayname.name = realname

                const roles = [
                    `553593731953983498`,
                    `504887113649750016`,
                    `721047643370815599`,
                    `702540345749143661`,
                    `746440976377184388`,
                    `722523773961633927`,
                    `849533128871641119`,
                    `709753395417972746`,
                    `722533819839938572`,
                    `722523856211935243`,
                    `1020403089943040040`
                ]
                const randombox = [
                    `819930814388240385`,
                    `510932601721192458`,
                    `521248091853291540`,
                    `584673040470769667`,
                    `893932177799135253`,
                    `925799156679856240`,
                    `1007718117809606736`,
                    `992820494900412456`
                ]
                let rloot1 = randombox[Math.floor(Math.random() * randombox.length)];
                await memberDM.roles.add(roles).catch()
                await memberDM.roles.add(rloot1).catch()
                const channel = await interaction.guild.channels.fetch(ch_list.apply)
                const msg = await channel.messages.fetch(appData.applicationid)
                const buttons = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`app_decline`)
                            .setEmoji(`❌`)
                            .setLabel(`Отклонить заявку`)
                            .setStyle(ButtonStyle.Danger)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`app_waiting`)
                            .setEmoji(`🕑`)
                            .setLabel(`На рассмотрение`)
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`app_accept`)
                            .setEmoji(`✅`)
                            .setLabel(`Принять заявку`)
                            .setStyle(ButtonStyle.Success)
                            .setDisabled(true)
                    )
                await msg.edit({
                    components: [buttons]
                })
                userData.joinedGuild = Date.now()
                const ch = await interaction.guild.channels.fetch(ch_list.hypixelThread)
                await ch.send(`/g invite ${playername}`)
                appData.status = `Принята`
                creator.save()
                userData.save()
                appData.save()
                client.PersJoinGuild(interaction, userData.userid)
                if (memberDM.user.id !== `491343958660874242`) {
                    memberDM.setNickname(`「${userData.displayname.rank}」 ${userData.displayname.ramka1}${userData.displayname.name}${userData.displayname.ramka2}${userData.displayname.suffix} ${userData.displayname.symbol}┇ ${userData.displayname.premium}`)
                }

                const success = new EmbedBuilder()
                    .setAuthor({
                        name: `Профиль успешно создан!`
                    })
                    .setColor(Number(linksInfo.bot_color))
                    .setDescription(`Профиль пользователя ${interaction.options.getUser(`пользователь`)} (${userData.nickname}) был успешно создан. В течение определенного времени он будет добавлен в канал с участниками!`)
                    .setThumbnail(`https://i.imgur.com/BahQWAW.png`)
                    .setTimestamp(Date.now())

                await interaction.editReply({
                    embeds: [success]
                })
                let d = 1, dd = 1, ddd = 1
                const embed1 = new EmbedBuilder()
                    .setColor(Number(linksInfo.bot_color))
                    .setTitle(`Профиль игрока успешно создан!`)
                    .setTimestamp(Date.now())
                    .setThumbnail(interaction.guild.iconURL())
                    .setDescription(
                        `**${d++}.** Профиль пользователя ${interaction.options.getUser(`пользователь`)} (\`${userData.nickname}\`) был успешно создан. ✅
**${d++}.** Необходимые роли были добавлены. ✅
**${d++}.** Случайный приветственный подарок в виде <@&${rloot1}> был успешно выдан. ✅
**${d++}.** Никнейм был успешно изменён и привязан к системе никнеймов. ✅
**${d++}.** Синхронизация с аккаунтом Hypixel прошла успешно. ✅
**${d++}.** Прочая информация была добавлена. ✅
            
**${dd++}.** Ожидаем добавления игрока в гильдию на Hypixel. 🕑
**${dd++}.** Ожидаем данные о дне рождении игрока. 🕑`)

                const embed2 = new EmbedBuilder()
                    .setColor(Number(linksInfo.bot_color))
                    .setTitle(`Добро пожаловать в гильдию Starpixel!`)
                    .setTimestamp(Date.now())
                    .setThumbnail(user.displayAvatarURL())
                    .setDescription(`${interaction.options.getUser(`пользователь`)}, добро пожаловать в гильдию!        
Чтобы получить краткую информацию о нашем Discord сервере, используйте \`/start\`!        
Пожалуйста, отправьте сообщением ниже дату вашего рождения в формате DD.MM.YYYY (DD - день, MM - месяц, YYYY - год).   
Помимо этого, ознакомьтесь с последними новостями гильдии в канале <#${ch_list.news}>! Вы также можете ещё раз ознакомиться с правилами в <#${ch_list.rules}>!         
Пропишите команду </help:1047205512971817040>, чтобы получить полный список команд!
Если модерация гильдии до сих пор не добавила вас, пожалуйста, подождите некоторое время. Вас скоро добавят!`)
                await interaction.guild.channels.cache.get(ch_list.main).send({
                    content: `@here`,
                    embeds: [embed1, embed2],
                    allowedMentions: {
                        parse: ["everyone"]
                    }
                })
                console.log(chalk.blackBright(`[${new Date()}]`) + chalk.cyan(`[База данных]`) + chalk.gray(`: Профиль пользователя ${userData.name} (${userData.nickname}) был успешно создан!`))

            }
        } catch (e) {
            const admin = await client.users.fetch(`491343958660874242`)
            console.log(e)
            var path = require('path');
            var scriptName = path.basename(__filename);
            await admin.send(`Произошла ошибка!`)
            await admin.send(`=> ${e}.
**Файл**: ${scriptName}`)
            await admin.send(`◾`)
        }
    }
}



