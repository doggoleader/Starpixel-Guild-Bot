const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { execute } = require('../../../src/events/client/start_bot/ready');
const linksInfo = require(`../../../src/discord structure/links.json`)
const { Guild } = require(`../../../src/schemas/guilddata`)
const sellInfo = require(`../../../src/discord structure/rolesToSell.json`)
const { User } = require(`../../../src/schemas/userdata`)

module.exports = {
    category: `shop`,
    plugin: `info`,
    data: new SlashCommandBuilder()
        .setName(`sell`)
        .setDescription(`Продать предмет в магазин гильдии`)
        .setDMPermission(false)
        .addRoleOption(option => option
            .setName(`роль`)
            .setDescription(`Роль, которую вы хотите продать`)
            .setRequired(true)
        ),
    async execute(interaction, client) {
        try {
            return interaction.reply({
                content: `Магазин гильдии временно закрыт. Продажа предметов недоступна!`,
                ephemeral: true
            })


            const guildData = await Guild.findOne({ id: interaction.guild.id })
            if (guildData.plugins.items === false) return interaction.reply({ content: `Данный плагин отключён! Попробуйте позже!`, ephemeral: true })
            const role = interaction.options.getRole(`роль`)
            if (!interaction.member.roles.cache.has(role.id)) return interaction.reply({
                content: `У вас нет этой роли, поэтому вы не можете её продать!`,
                ephemeral: true
            })
            const userData = await User.findOne({ guildid: interaction.guild.id, userid: interaction.user.id })
            let stars = await sellInfo.stars.find(st => st == role.id)
            let comets = await sellInfo.comets.find(cm => cm == role.id)
            let blacklisted = await sellInfo.blacklisted.find(bl => bl == role.id)
            if (blacklisted) return interaction.reply({
                content: `Вы не можете продать этот предмет!`,
                ephemeral: true
            })
            else if (comets) {
                let price = 75
                await interaction.member.roles.remove(role.id)
                let rumb_amount = price * userData.pers_rumb_boost
                userData.rumbik += rumb_amount
                userData.sell.comet += 1
                userData.sell.total_sum += rumb_amount
                userData.save()
                await interaction.reply({
                    content: `Вы успешно продали ${role} за ${rumb_amount}<:Rumbik:883638847056003072>!`,
                    ephemeral: true
                })
            } else if (stars) {
                let price = 25
                await interaction.member.roles.remove(role.id)
                let rumb_amount = price * userData.pers_rumb_boost
                userData.rumbik += rumb_amount
                userData.sell.total_sum += rumb_amount
                userData.sell.constellation += 1
                userData.save()
                await interaction.reply({
                    content: `Вы успешно продали ${role} за ${rumb_amount}<:Rumbik:883638847056003072>!`,
                    ephemeral: true
                })
            } else {
                if (userData.perks.sell_items == 0) return interaction.reply({
                    content: `Вы не можете продать этот предмет, так как у вас нет перка \`💰 Возможность продавать предметы из профиля\`!`,
                    ephemeral: true
                })
                else if (userData.perks.sell_items == 1) {
                    let item = await guildData.shop.find(sh => sh.roleid.find(rl => rl.id == role.id))
                    let price
                    if (!item) return interaction.reply({
                        content: `Вы не можете продать данный предмет!`,
                        ephemeral: true
                    })
                    else if (item) price = (item.price / 2)

                    await interaction.member.roles.remove(role.id)
                    let rumb_amount = price * userData.pers_rumb_boost
                    userData.rumbik += rumb_amount
                    userData.sell.total_sum += rumb_amount
                    userData.sell.other += 1
                    userData.save()

                    await interaction.reply({
                        content: `Вы успешно продали ${role} за ${rumb_amount}<:Rumbik:883638847056003072>!`,
                        ephemeral: true
                    })
                }
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