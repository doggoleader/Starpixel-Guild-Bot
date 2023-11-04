const { User } = require(`../../schemas/userdata`)
const { Birthday } = require(`../../schemas/birthday`)
const chalk = require(`chalk`);
const { EmbedBuilder, ChannelType } = require(`discord.js`)
const ch_list = require(`../../discord structure/channels.json`)
const linksInfo = require(`../../discord structure/links.json`);
const { Guild } = require('../../schemas/guilddata');
const { Apply } = require('../../schemas/applications');
const { checkPlugin } = require("../../functions");
const plugin = {
    id: "admin",
    name: "Административное"
}

module.exports = (client) => {
    client.PersJoinGuild = async (userid) => {
        try {
            const guild = await client.guilds.fetch("320193302844669959")
            if (!await checkPlugin("320193302844669959", plugin.id)) return;
            const guildData = await Guild.findOne({ id: guild.id })
            const channel = await guild.channels.fetch("1124049794386628721")
            const userData = await User.findOne({ userid: userid });
            const member = await guild.members.fetch(userData.userid)
            if (!userData) return
            if (!userData.pers_info.channel) {
                const thread = await channel.threads.create({
                    name: `Личное дело ${userData.nickname}`,
                    reason: `Создан профиль пользователя ${userData.nickname}`,
                    type: ChannelType.PrivateThread,
                    invitable: false
                })
                const birthday = await Birthday.findOne({ userid: userData.userid })
                let bday
                if (birthday) bday = `${birthday.day}.${birthday.month}.${birthday.year}`
                else bday = `Нет данных.`
                userData.pers_info.channel = thread.id
                let i = guildData.pers_info.numb + 1
                guildData.pers_info.numb = i
                userData.pers_info.numb = i
                const embed = new EmbedBuilder()
                    .setTitle(`ЛИЧНОЕ ДЕЛО УЧАСТНИКА ${userData.nickname} (${member.user.username})`)
                    .setColor(Number(linksInfo.bot_color))
                    .setAuthor({ name: `Причина: Создание профиля` })
                    .setTimestamp(Date.now())
                    .setFooter({ text: `Личное дело пользователя ${userData.nickname}. Доступно для чтения.` })
                    .setDescription(`## ЛИЧНОЕ ДЕЛО №${i} (${userData.nickname})
                
Реальное имя - \`${userData.displayname.name}\`
Игровой никнейм - \`${userData.nickname}\`
UUID Minecraft - \`${userData.onlinemode ? userData.uuid : null}\`
Дата рождения - \`${bday}\`
Дата вступления - \`${userData.joinedGuild}\`
ID пользователя - \`${userData.userid}\`
Возраст - \`${userData.age}\``)

                const msg = await thread.send({
                    embeds: [embed]
                })
                userData.pers_info.main_msg = msg.id
                userData.save();

                const application = await Apply.findOne({ userid: userData.userid })
                if (application) {
                    let appsChannel = await guild.channels.fetch('921719174819090462')
                    try {
                        let appMsg = await appsChannel.messages.fetch(application.applicationid)
                        if (appMsg) {
                            const embed2 = new EmbedBuilder()
                                .setTitle("Данные о пользователе на время вступления в гильдию")
                                .setColor(Number(linksInfo.bot_color))
                                .setAuthor({ name: `Причина: Создание профиля` })
                                .setTimestamp(Date.now())
                                .setFooter({ text: `Личное дело пользователя ${userData.nickname}. Доступно для чтения.` })
                                .setDescription(`**Данные на время вступления в гильдию. Заявка пользователя**

Реальное имя - \`${userData.displayname.name}\`
Игровой никнейм - \`${userData.nickname}\`
UUID Minecraft - \`${userData.onlinemode ? userData.uuid : null}\`
Дата рождения - \`${bday}\`
Дата вступления - \`${userData.joinedGuild}\`
ID пользователя - \`${userData.userid}\`
Возраст - \`${userData.age}\`

[Заявка пользователя доступна по ссылке](${appMsg?.url})`)
                            await thread.send({
                                embeds: [embed2]
                            })
                        }
                    } catch (e) {
                        console.log(e)
                    }


                }
                const embed3 = new EmbedBuilder()
                    .setTitle(`Создано личное дело №${i}`)
                    .setColor(Number(linksInfo.bot_color))
                    .setTimestamp(Date.now())
                    .setDescription(`### Зарегистрировано личное дело пользователя ${member} под номером №${i}.
                    
[Получить доступ к личному делу можно, нажав на ссылку](${thread.url}) **НЕОБХОДИМЫ ПРАВА АДМИНИСТРАТОРА**`)
                await channel.send({
                    embeds: [embed3]
                })
                await channel.send({
                    content: ':black_medium_small_square:'
                })
            }
            guildData.save()


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
