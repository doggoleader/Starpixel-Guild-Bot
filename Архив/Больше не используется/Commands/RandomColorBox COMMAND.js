const { SlashCommandBuilder } = require('discord.js');
const { execute } = require('../../../src/events/client/start_bot/ready');
const { Temp } = require(`../../../src/schemas/temp_items`);
const chalk = require(`chalk`);
const ch_list = require(`../../../src/discord structure/channels.json`)
const linksInfo = require(`../../../src/discord structure/links.json`);
const { User } = require('../../../src/schemas/userdata');

module.exports = {
    category: `box`,
    plugin: `info`,
    data: new SlashCommandBuilder()
        .setName(`randomcolor`)  //Название команды
        .setDescription(`Получить случайный цвет`)
        .setDMPermission(false), //Описание команды
    async execute(interaction, client) {
        try {
            const { Guild } = require(`../../../src/schemas/guilddata`)
            const pluginData = await Guild.findOne({ id: interaction.guild.id })
            if (pluginData.plugins.items === false) return interaction.reply({ content: `Данный плагин отключён! Попробуйте позже!`, ephemeral: true })
            const user = interaction.member.user //ДОБАВИТЬ В ДРУГИЕ

            const { roles } = interaction.member //Участник команды
            const member = interaction.member
            const role = await interaction.guild.roles  //Постоянная для role
                .fetch("896100103700496436") //ID коробки
                .catch(console.error);
            if (roles.cache.has("896100103700496436") || roles.cache.has("567689925143822346")) { //Проверка роли коробки || правления
                const timestamp = Math.round(interaction.createdTimestamp / 1000)
                const opener = interaction.member.id;
                const userData = await User.findOne({ userid: interaction.user.id, guildid: interaction.guild.id })
                //Лут из коробок
                //Случайный предмет
                //name - Название предмета
                //dropChanceLOOT - Шанс выпадения предмета
                //roleID - ID роли, которая связана с данным лутом.

                //Список предметов
                let { loot } = require(`../../src/functions/Boxes/Box loot/randomcolor.json`)

                //рандом предметов
                let rloot = loot[Math.floor(Math.random() * loot.length)];
                const tempData = await Temp.findOne({ userid: user.id, roleid: rloot.loot_roleID })

                const r1 = `595893144055316490`; //Название цветов есть в /colors
                const r2 = `595892599693246474`;
                const r3 = `595892677451710468`;
                const r4 = `595892238370996235`;
                const r5 = `589770984391966760`;
                const r6 = `595893568485326862`;
                const r7 = `630395361508458516`;
                const r8 = `595892930204401665`;
                const r9 = `595889341058777088`;
                const r10 = `1024741633947873401`;

                if (member.roles.cache.has(r1) || member.roles.cache.has(r2) || member.roles.cache.has(r3) || member.roles.cache.has(r4) || member.roles.cache.has(r5) || member.roles.cache.has(r6) || member.roles.cache.has(r7) || member.roles.cache.has(r8) || member.roles.cache.has(r9) || member.roles.cache.has(r10)) return interaction.reply({
                    content: `Вы не можете использовать данную команду, так как у вас есть цвет! Используйте команду \`/colors reset\`, чтобы убрать ваш цвет!`,
                    ephemeral: true
                })
                await roles.remove(role).catch(console.error); //Удалить роль коробки
                //Отправка сообщения о луте              
                const r_loot_msg = await interaction.guild.channels.cache.get(ch_list.box)
                    .send(
                        `◾
<@${opener}> использует выбор цвета...
╭─────:rainbow:─────╮
Он получает \`${rloot.loot_name}\` цвет на 1 неделю!
╰─────:rainbow:─────╯
◾`)
                if (!member.roles.cache.has(rloot.loot_roleID) && (userData.rank_number >= 6 || userData.sub_type >= 3)) {
                    await member.roles.add(rloot.loot_roleID).catch(console.error);
                    await r_loot_msg.react("✅")
                    const tempItems = new Temp({
                        userid: user.id,
                        guildid: interaction.guild.id,
                        roleid: rloot.loot_roleID,
                        expire: Date.now() + (1000 * 60 * 60 * 24 * 7 * (userData.perks.temp_items + 1)),
                        color: true
                    })
                    tempItems.save()
                } else if (member.roles.cache.has(rloot.loot_roleID)) {
                    await r_loot_msg.react("🚫")
                } else {
                    await r_loot_msg.react("🚫")
                };

                console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magentaBright(`[${interaction.user.tag} использовал выбор цвета]`) + chalk.gray(`: Он получил ${rloot.loot_name}`))
                
            } else {
                await interaction.reply({
                    content: `У вас отсутствует роль "\`${role.name}\`!"`,
                    ephemeral: true
                })
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