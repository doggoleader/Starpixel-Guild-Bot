const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, AttachmentBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

const fetch = require(`node-fetch`);
const api = process.env.hypixel_apikey;
const { User } = require(`../../schemas/userdata`)
const { Apply } = require(`../../schemas/applications`)
const { Guild } = require(`../../schemas/guilddata`)
const chalk = require(`chalk`);
const prettyMilliseconds = require(`pretty-ms`); //ДОБАВИТЬ В ДРУГИЕ
const ch_list = require(`../../discord structure/channels.json`)
const fs = require(`fs`)
const linksInfo = require(`../../discord structure/links.json`);
const { mentionCommand } = require('../../functions');

/**
 * 
 * @param {import("discord.js").ChatInputCommandInteraction} interaction Interaction
 * @param {import("../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        let reason = interaction.options.getString('причина') || "Не указана"
        const user = interaction.member
        const member = interaction.member
        if (!user.roles.cache.has(`504887113649750016`)) return interaction.reply({
            content: `Вы не являетесь участником гильдии Starpixel, какую гильдию вы собираетесь покидать? 😂`,
            ephemeral: true
        })
        if (interaction.channel.id !== `849516805529927700`) return interaction.reply({
            content: `Пожалуйста, перейдите в канал <#${ch_list.ask}>, чтобы использовать данную команду!`,
            ephemeral: true
        })
        const userData = await User.findOne({ userid: member.user.id, guildid: member.guild.id })
        const appData = await Apply.findOne({ userid: member.user.id })
        const guild_leave = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`g_leave`)
                    .setLabel(`Покинуть гильдию`)
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji(`👋`)
            )
            .addComponents(

                new ButtonBuilder()
                    .setCustomId(`g_stay`)
                    .setLabel(`Остаться в гильдии`)
                    .setStyle(ButtonStyle.Success)
                    .setEmoji(`😎`)
            )

        const g_leave_embed = new EmbedBuilder()
            .setColor(Number(linksInfo.bot_color))
            .setThumbnail(user.user.displayAvatarURL())
            .setTimestamp(Date.now())
            .setTitle(`Подтвердите, что вы готовы покинуть гильдию Starpixel`)
            .setDescription(`Перед тем как принять решение об уходе чётко спросите себя - не пожалеете ли вы об этом, ведь по правилам гильдии тот, кто покинул гильдию - не может в неё вернуться больше никогда. Если вы потеряли интерес к игре, то не спешите так быстро уходить из гильдии, ведь интерес может всегда вернуться. Наш совет для вас: перед тем как принять решение об уходе, свяжитесь с офицерами гильдии в <#${ch_list.ask}> и расскажите о своей ситуации. Если это какая-то депрессия, большое количество учёбы или же что-то в этом роде - мы обязательно найдём с вами решение. Главное не бойтесь написать!
        
Если вы всё же готовы покинуть нас, то нажмите на кнопку "Покинуть гильдию". После того, как вы на неё нажмёте, вы потеряете весь процесс в гильдии. Вы всё ещё сможете находиться на сервере Discord, однако у вас будет ограниченный доступ. Нажимая на данную кнопку, вы подтверждаете, что вы осознанно делаете это действие, и понимаете, что назад дороги нет.

**Чтобы покинуть гильдию, нажмите на кнопку ниже!**`)

        const reply = await interaction.reply({
            content: `${user} хочет покинуть гильдию!`,
            embeds: [g_leave_embed],
            components: [guild_leave],
            fetchReply: true
        })


        const collector = await reply.createMessageComponentCollector()
        collector.on('collect', async (i) => {
            if (i.user.id === interaction.member.user.id) {
                guild_leave.components[0].setDisabled(true)
                guild_leave.components[1].setDisabled(true)
                if (i.customId === `g_leave`) {
                    const DM = await interaction.guild.members.fetch(user.user.id)
                    g_leave_embed
                        .setTitle(`Пользователь решил покинуть гильдию!`)
                        .setDescription(`${user} покинул гильдию. Все роли у него были убраны!
                            
                            
**Причина ухода**: \`${reason}\``)
                    await i.guild.members.edit(user, {
                        roles: [],
                        nick: ""
                    })

                    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.cyan(`[База данных]`) + chalk.gray(`: Профиль пользователя ${userData.name} (${userData.nickname}) был успешно удалён, так как он покинул гильдию!  Причина: ${reason}`))
                    await interaction.editReply({
                        content: `${user} покинул гильдию!`,
                        embeds: [g_leave_embed],
                        components: [guild_leave]
                    })
                    await i.reply({
                        content: `${user} покинул гильдию Starpixel!`
                    })
                    if (userData) {
                        let stream = await fs.createWriteStream(`./src/files/Database/Profile.json`)
                        let json = JSON.stringify(userData, (_, v) => typeof v === 'bigint' ? v.toString() : v)
                        stream.once('open', function (fd) {
                            stream.write(json);
                            stream.end();
                        });

                        let interactionChannel = await interaction.guild.channels.fetch(`1114239308853936240`)
                        let attach = new AttachmentBuilder()
                            .setFile(`./src/files/Database/Profile.json`)
                            .setName(`Profile.json`)

                        await interactionChannel.send({
                            content: `**Имя пользователя**: \`${userData.displayname.name}\`
**ID Discord**: \`${userData.userid}\`
**Никнейм**: \`${userData.nickname}\`
**UUID**: \`${userData.onlinemode ? userData.uuid : null}\``,
                            files: [attach]
                        })
                        userData.delete()
                    }
                    if (appData) {
                        appData.status = "Удалена"
                        appData.save()
                    }

                    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.red(`[УЧАСТНИК ПОКИНУЛ ГИЛЬДИЮ]`) + chalk.gray(`: Пользователь ${i.user.username} покинул гильдию Starpixel!`))
                } else if (i.customId === `g_stay`) {
                    g_leave_embed
                        .setTitle(`Пользователь решил остаться в гильдии!`)
                        .setDescription(`${user} решил остаться в гильдии. Благодарим, что вы являетесь участником гильдии Starpixel! Мы будем радовать вас различным контентом и сделаем всё возможное, чтобы вы остались с нами!`)
                        .setFooter({ text: `Если вы всё-таки решите нас покинуть, пропишите ${mentionCommand(client, 'guild-leave')} ещё раз!` })

                    await interaction.editReply({
                        content: `${user} остался в гильдии!`,
                        embeds: [g_leave_embed],
                        components: [guild_leave]
                    })

                    await i.reply({
                        content: `${user} остался в гильдии!`
                    })
                }


            } else {
                await i.reply({ content: `Вы не можете использовать данную кнопочку!`, ephemeral: true });
            }
        })
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
    category: `leave`,
    plugin: {
        id: "admin",
        name: "Административное"
    },
    data: new SlashCommandBuilder()
        .setName(`guild-leave`)
        .setDescription(`Покинуть гильдию Starpixel`)
        .addStringOption(o => o
            .setName("причина")
            .setDescription("Причина ухода из гильдии")
            .setRequired(true))
        .setDMPermission(false),
    execute
};