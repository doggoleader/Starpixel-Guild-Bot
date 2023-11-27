const { User } = require(`../../../schemas/userdata`)
const { Guild } = require(`../../../schemas/guilddata`)
const { ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require(`discord.js`)
const chalk = require(`chalk`);
const prettyMilliseconds = require(`pretty-ms`)
const { checkPlugin } = require("../../../functions");
let plugin = {
    id: "new_users",
    name: "Новые пользователи"
}
async function execute(invite, client) {
    if (!await checkPlugin(invite.guild.id, plugin.id)) return
    const { invites } = client
    await invites.get(invite.guild.id).set(invite.code, invite.uses);
    await askForBypass(invite, client)
}

module.exports = {
    name: 'inviteCreate',
    plugin: plugin,
    execute
}


async function askForBypass(invite, client) {
    const guildData = await Guild.findOne({ id: invite.guild.id });
    const member = await invite.guild.members.fetch(invite.inviter.id)
    const buttons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('no_bypass')
                .setLabel(`Нет`)
                .setEmoji(`🚫`)
                .setStyle(ButtonStyle.Danger)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId('yes_bypass')
                .setLabel(`Да`)
                .setEmoji(`✅`)
                .setStyle(ButtonStyle.Success)
        )
    const buttonsEdited = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('no_bypass')
                .setLabel(`Нет`)
                .setEmoji(`❌`)
                .setStyle(ButtonStyle.Danger)
                .setDisabled(true)
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId('yes_bypass')
                .setLabel(`Да`)
                .setEmoji(`✅`)
                .setStyle(ButtonStyle.Success)
                .setDisabled(true)
        )
    const embed = new EmbedBuilder()
        .setColor(Number(client.information.bot_color))
        .setDescription(`## Сделать ссылку доступной для пользователей без лицензии?
Выбирая "Да", созданная вами ссылка будет иметь ограничения:
- Срок действия равен сроку действия с момента её создания (без изменений)
- Количество использований станет равным 1, т.е. только один пользовать сможет присоединиться по вашей ссылке

Прочие условия:
- Вы можете пригласить любого человека на сервер Discord при помощи данной ссылки
- Данный пользователь не должен иметь лицензию Minecraft
- Если вы хотите пригласить несколько человек без лицензии Minecraft, вам придётся создать несколько ссылок
- После использования данной ссылки она будет удалена

**Вы совершаете данные действия для следующей ссылки-приглашения:** ${invite.url}`)
    switch (guildData.global_settings.no_license_applications) {
        case `enabled_members`: {
            if (member.roles.cache.has("504887113649750016")) {
                await member.send({
                    embeds: [embed],
                    components: [buttons]
                }).catch().then(async msg => {
                    const collector = await msg.createMessageComponentCollector()

                    collector.on('collect', async i => {
                        if (i.customId == `yes_bypass`) {
                            guildData.invites.bypass_invite_codes.push(invite.code)
                            guildData.save()
                            await i.reply({
                                content: `Ссылка ${invite.url} стала доступной для пользователей без лицензии!`
                            })
                            await msg.edit({
                                components: [buttonsEdited]
                            })
                        } else if (i.customId == 'no_bypass') {
                            await i.reply({
                                content: `Ссылка ${invite.url} стала недоступной для пользователей без лицензии!`
                            })
                            await msg.edit({
                                components: [buttonsEdited]
                            })
                        }
                        await collector.stop();
                    })
                })
            }
        }
            break;
        case `enabled_staff`: {
            if (member.roles.cache.has("563793535250464809")) {
                await member.send({
                    embeds: [embed],
                    components: [buttons]
                }).catch().then(async msg => {
                    const collector = await msg.createMessageComponentCollector()

                    collector.on('collect', async i => {
                        if (i.customId == `yes_bypass`) {
                            guildData.invites.bypass_invite_codes.push(invite.code)
                            guildData.save()
                            await i.reply({
                                content: `Ссылка ${invite.url} стала доступной для пользователей без лицензии!`
                            })
                            await msg.edit({
                                components: [buttonsEdited]
                            })
                        } else if (i.customId == 'no_bypass') {
                            await i.reply({
                                content: `Ссылка ${invite.url} стала недоступной для пользователей без лицензии!`
                            })
                            await msg.edit({
                                components: [buttonsEdited]
                            })
                        }
                        await collector.stop();
                    })
                })
            }
        }
            break;
        default:
            break;
    }
}