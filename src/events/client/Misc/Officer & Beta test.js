const chalk = require(`chalk`);
const { EmbedBuilder } = require("discord.js");
const { Guild } = require(`../../../schemas/guilddata`)

const { User } = require("../../../schemas/userdata");
const { checkPlugin } = require("../../../functions");
let plugin = {
    id: "admin",
    name: "Административное"
}
async function execute(oldMember, newMember, client) {
    try {
        if (!await checkPlugin(newMember.guild.id, plugin.id)) return
        const guild = await oldMember.client.guilds.fetch(`320193302844669959`)
        const modRoles = ["1059732744218882088", "563793535250464809", "320880176416161802", "567689925143822346"]
        if (!oldMember.roles.cache.has(`1059732744218882088`) && newMember.roles.cache.has(`1059732744218882088`)) {
            const userData = await User.findOne({ userid: newMember.user.id })
            const channel = await guild.channels.fetch("1124049794386628721")
            const thread = await channel.threads.fetch(userData.pers_info.channel)
            let check = []
            let i = 1
            for (let modRole of modRoles) {
                if (newMember.roles.cache.has(modRole)) check.push(`**${i++}**. <@&${modRole}>`)
            }
            if (check.length <= 0) check = ["Нет административных ролей"]
            const embed = new EmbedBuilder()
                .setTitle(`ЛИЧНОЕ ДЕЛО УЧАСТНИКА ${userData.nickname} (${newMember.user.username})`)
                .setColor(Number(client.information.bot_color))
                .setAuthor({ name: `Причина: Повышение в гильдии` })
                .setTimestamp(Date.now())
                .setFooter({ text: `Личное дело пользователя ${userData.nickname}. Доступно для чтения.` })
                .setDescription(`## Участник ${newMember} изменил свой статус в персонале гильдии!
Он получил роль <@&1059732744218882088>
                
Его текущие роли модератора:
${check.join('\n')}`)

            await thread.send({
                embeds: [embed]
            })

        } else if (!oldMember.roles.cache.has(`563793535250464809`) && newMember.roles.cache.has(`563793535250464809`)) {
            const userData = await User.findOne({ userid: newMember.user.id })
            const channel = await guild.channels.fetch("1124049794386628721")
            const thread = await channel.threads.fetch(userData.pers_info.channel)
            let check = []
            let i = 1
            for (let modRole of modRoles) {
                if (newMember.roles.cache.has(modRole)) check.push(`**${i++}**. <@&${modRole}>`)
            }
            if (check.length <= 0) check = ["Нет административных ролей"]
            const embed = new EmbedBuilder()
                .setTitle(`ЛИЧНОЕ ДЕЛО УЧАСТНИКА ${userData.nickname} (${newMember.user.username})`)
                .setColor(Number(client.information.bot_color))
                .setAuthor({ name: `Причина: Повышение в гильдии` })
                .setTimestamp(Date.now())
                .setFooter({ text: `Личное дело пользователя ${userData.nickname}. Доступно для чтения.` })
                .setDescription(`## Участник ${newMember} изменил свой статус в персонале гильдии!
Он получил роль <@&563793535250464809>
                
Его текущие роли модератора:
${check.join('\n')}`)

            await thread.send({
                embeds: [embed]
            })

        } else if (!oldMember.roles.cache.has(`320880176416161802`) && newMember.roles.cache.has(`320880176416161802`)) {
            const userData = await User.findOne({ userid: newMember.user.id })
            const channel = await guild.channels.fetch("1124049794386628721")
            const thread = await channel.threads.fetch(userData.pers_info.channel)
            let check = []
            let i = 1
            for (let modRole of modRoles) {
                if (newMember.roles.cache.has(modRole)) check.push(`**${i++}**. <@&${modRole}>`)
            }
            if (check.length <= 0) check = ["Нет административных ролей"]
            const embed = new EmbedBuilder()
                .setTitle(`ЛИЧНОЕ ДЕЛО УЧАСТНИКА ${userData.nickname} (${newMember.user.username})`)
                .setColor(Number(client.information.bot_color))
                .setAuthor({ name: `Причина: Повышение в гильдии` })
                .setTimestamp(Date.now())
                .setFooter({ text: `Личное дело пользователя ${userData.nickname}. Доступно для чтения.` })
                .setDescription(`## Участник ${newMember} изменил свой статус в персонале гильдии!
Он получил роль <@&320880176416161802>
                
Его текущие роли модератора:
${check.join('\n')}`)

            await thread.send({
                embeds: [embed]
            })
        } else if (!oldMember.roles.cache.has(`567689925143822346`) && newMember.roles.cache.has(`567689925143822346`)) {
            const userData = await User.findOne({ userid: newMember.user.id })
            const channel = await guild.channels.fetch("1124049794386628721")
            const thread = await channel.threads.fetch(userData.pers_info.channel)
            let check = []
            let i = 1
            for (let modRole of modRoles) {
                if (newMember.roles.cache.has(modRole)) check.push(`**${i++}**. <@&${modRole}>`)
            }
            if (check.length <= 0) check = ["Нет административных ролей"]
            const embed = new EmbedBuilder()
                .setTitle(`ЛИЧНОЕ ДЕЛО УЧАСТНИКА ${userData.nickname} (${newMember.user.username})`)
                .setColor(Number(client.information.bot_color))
                .setAuthor({ name: `Причина: Повышение в гильдии` })
                .setTimestamp(Date.now())
                .setFooter({ text: `Личное дело пользователя ${userData.nickname}. Доступно для чтения.` })
                .setDescription(`## Участник ${newMember} изменил свой статус в персонале гильдии!
Он получил роль <@&567689925143822346>
                
Его текущие роли модератора:
${check.join('\n')}`)

            await thread.send({
                embeds: [embed]
            })
        } else if (oldMember.roles.cache.has(`1059732744218882088`) && !newMember.roles.cache.has(`1059732744218882088`)) {
            const userData = await User.findOne({ userid: newMember.user.id })
            const channel = await guild.channels.fetch("1124049794386628721")
            const thread = await channel.threads.fetch(userData.pers_info.channel)
            let check = []
            let i = 1
            for (let modRole of modRoles) {
                if (newMember.roles.cache.has(modRole)) check.push(`**${i++}**. <@&${modRole}>`)
            }
            if (check.length <= 0) check = ["Нет административных ролей"]
            const embed = new EmbedBuilder()
                .setTitle(`ЛИЧНОЕ ДЕЛО УЧАСТНИКА ${userData.nickname} (${newMember.user.username})`)
                .setColor(Number(client.information.bot_color))
                .setAuthor({ name: `Причина: Понижение в гильдии` })
                .setTimestamp(Date.now())
                .setFooter({ text: `Личное дело пользователя ${userData.nickname}. Доступно для чтения.` })
                .setDescription(`## Участник ${newMember} изменил свой статус в персонале гильдии!
Он потерял роль <@&1059732744218882088>
                
Его текущие роли модератора:
${check.join('\n')}`)

            await thread.send({
                embeds: [embed]
            })

        } else if (oldMember.roles.cache.has(`563793535250464809`) && !newMember.roles.cache.has(`563793535250464809`)) {
            const userData = await User.findOne({ userid: newMember.user.id })
            const channel = await guild.channels.fetch("1124049794386628721")
            const thread = await channel.threads.fetch(userData.pers_info.channel)
            let check = []
            let i = 1
            for (let modRole of modRoles) {
                if (newMember.roles.cache.has(modRole)) check.push(`**${i++}**. <@&${modRole}>`)
            }
            if (check.length <= 0) check = ["Нет административных ролей"]
            const embed = new EmbedBuilder()
                .setTitle(`ЛИЧНОЕ ДЕЛО УЧАСТНИКА ${userData.nickname} (${newMember.user.username})`)
                .setColor(Number(client.information.bot_color))
                .setAuthor({ name: `Причина: Понижение в гильдии` })
                .setTimestamp(Date.now())
                .setFooter({ text: `Личное дело пользователя ${userData.nickname}. Доступно для чтения.` })
                .setDescription(`## Участник ${newMember} изменил свой статус в персонале гильдии!
Он потерял роль <@&563793535250464809>
                
Его текущие роли модератора:
${check.join('\n')}`)

            await thread.send({
                embeds: [embed]
            })
        } else if (oldMember.roles.cache.has(`320880176416161802`) && !newMember.roles.cache.has(`320880176416161802`)) {
            const userData = await User.findOne({ userid: newMember.user.id })
            const channel = await guild.channels.fetch("1124049794386628721")
            const thread = await channel.threads.fetch(userData.pers_info.channel)
            let check = []
            let i = 1
            for (let modRole of modRoles) {
                if (newMember.roles.cache.has(modRole)) check.push(`**${i++}**. <@&${modRole}>`)
            }
            if (check.length <= 0) check = ["Нет административных ролей"]
            const embed = new EmbedBuilder()
                .setTitle(`ЛИЧНОЕ ДЕЛО УЧАСТНИКА ${userData.nickname} (${newMember.user.username})`)
                .setColor(Number(client.information.bot_color))
                .setAuthor({ name: `Причина: Понижение в гильдии` })
                .setTimestamp(Date.now())
                .setFooter({ text: `Личное дело пользователя ${userData.nickname}. Доступно для чтения.` })
                .setDescription(`## Участник ${newMember} изменил свой статус в персонале гильдии!
Он потерял роль <@&320880176416161802>
                
Его текущие роли модератора:
${check.join('\n')}`)

            await thread.send({
                embeds: [embed]
            })
        } else if (oldMember.roles.cache.has(`567689925143822346`) && !newMember.roles.cache.has(`567689925143822346`)) {
            const userData = await User.findOne({ userid: newMember.user.id })
            const channel = await guild.channels.fetch("1124049794386628721")
            const thread = await channel.threads.fetch(userData.pers_info.channel)
            let check = []
            let i = 1
            for (let modRole of modRoles) {
                if (newMember.roles.cache.has(modRole)) check.push(`**${i++}**. <@&${modRole}>`)
            }
            if (check.length <= 0) check = ["Нет административных ролей"]
            const embed = new EmbedBuilder()
                .setTitle(`ЛИЧНОЕ ДЕЛО УЧАСТНИКА ${userData.nickname} (${newMember.user.username})`)
                .setColor(Number(client.information.bot_color))
                .setAuthor({ name: `Причина: Понижение в гильдии` })
                .setTimestamp(Date.now())
                .setFooter({ text: `Личное дело пользователя ${userData.nickname}. Доступно для чтения.` })
                .setDescription(`## Участник ${newMember} изменил свой статус в персонале гильдии!
Он потерял роль <@&567689925143822346>
                
Его текущие роли модератора:
${check.join('\n')}`)

            await thread.send({
                embeds: [embed]
            })
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
    name: 'guildMemberUpdate',
    plugin: plugin,
    execute
}