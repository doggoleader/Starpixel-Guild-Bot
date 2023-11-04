const { Temp } = require(`../../schemas/temp_items`)
const chalk = require(`chalk`)
const { Guild } = require(`../../schemas/guilddata`)
const { User } = require(`../../schemas/userdata`)
const linksInfo = require(`../../discord structure/links.json`)
const { changeProperty } = require(`../../functions`)
const { checkPlugin } = require("../../functions");
const plugin = {
    id: "items",
    name: "Предметы"
}

module.exports = (client) => {
    client.temp_roles = async () => {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", plugin.id)) return;
            const guildData = await Guild.findOne({ id: guild.id })
            const results = await Temp.find({ expire: { $lte: new Date() } })

            //Роли, которые невозможно сохранить даже при помощи луны
            let specialRoles = [
                "850336260265476096", //VIP
                "983441364903665714", //Именинник
            ]
            let moon = "780487592540897349"

            for (const result of results) {
                const { guildid, userid, roleid, boost, shop_disc, pers_boost } = result
                const memberData = await User.findOne({ userid: userid })
                if (!memberData) {
                    result.delete();
                } else if (memberData.black_hole.enabled !== true) {
                    const member = await guild.members.fetch(userid)

                    if (!result.extraInfo) {
                        if (boost == true) {

                            guildData.act_exp_boost = 1;
                            guildData.save()
                            result.delete()

                        } else if (member.roles.cache.has(moon)) {


                            if (specialRoles.includes(result.roleid)) {
                                const role = await guild.roles.fetch(result.roleid)

                                if (!member) {
                                    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.red(`[ОШИБКА]`) + chalk.gray(`: Пользователь не найден, файл с временной ролью удалён.`))
                                    result.delete()
                                } else if (member.roles.cache.has(roleid) && result.roleid == `850336260265476096`) {
                                    if (member.roles.cache.has(`606442068470005760`)) {
                                        console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magenta(`[УДАЛЕНА ВРЕМЕННАЯ РОЛЬ]`) + chalk.gray(`: Временная роль ${role.name} была оставлена у пользователя ${member.user.username}, так как он является бустером сервера!`))
                                        result.delete()
                                    } else {
                                        await member.roles.remove(roleid)
                                        console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magenta(`[УДАЛЕНА ВРЕМЕННАЯ РОЛЬ]`) + chalk.gray(`: Временная роль ${role.name} была удалена у пользователя ${member.user.username}!`))
                                        result.delete()
                                    }

                                } else {
                                    await member.roles.remove(roleid)
                                    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.red(`[ОШИБКА В temp_roles.js]`) + chalk.gray(`: Произошла непредвиденная ошибка. Роль была удалена вместе с файлом! Подробная информация о файле отправлена ниже:
                                ${result}`))
                                    result.delete()
                                }


                            } else if (!specialRoles.includes(result.roleid)) {
                                await result.delete()
                                //Позже: Добавить заметку в личное дело о данной роли, которая была оставлена навсегда
                            }
                        } else if (!member.roles.cache.has(moon)) {


                            if (specialRoles.includes(result.roleid)) {
                                const role = await guild.roles.fetch(result.roleid)

                                if (!member) {
                                    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.red(`[ОШИБКА]`) + chalk.gray(`: Пользователь не найден, файл с временной ролью удалён.`))
                                    result.delete()
                                } else if (member.roles.cache.has(roleid)) {
                                    if (member.roles.cache.has(`606442068470005760`) && result.roleid == `850336260265476096`) {
                                        console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magenta(`[УДАЛЕНА ВРЕМЕННАЯ РОЛЬ]`) + chalk.gray(`: Временная роль ${role.name} была оставлена у пользователя ${member.user.username}, так как он является бустером сервера!`))
                                        result.delete()
                                    } else {
                                        await member.roles.remove(roleid)
                                        console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magenta(`[УДАЛЕНА ВРЕМЕННАЯ РОЛЬ]`) + chalk.gray(`: Временная роль ${role.name} была удалена у пользователя ${member.user.username}!`))
                                        result.delete()
                                    }
                                } else {
                                    await member.roles.remove(roleid)
                                    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.red(`[ОШИБКА В temp_roles.js]`) + chalk.gray(`: Произошла непредвиденная ошибка. Роль была удалена вместе с файлом! Подробная информация о файле отправлена ниже:
                                ${result}`))
                                    result.delete()
                                }


                            } else if (!specialRoles.includes(result.roleid)) {
                                const role = await guild.roles.fetch(result.roleid)

                                if (!member) {
                                    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.red(`[ОШИБКА]`) + chalk.gray(`: Пользователь не найден, файл с временной ролью удалён.`))
                                    result.delete()
                                } else if (member.roles.cache.has(roleid)) {
                                    await member.roles.remove(roleid)
                                    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magenta(`[УДАЛЕНА ВРЕМЕННАЯ РОЛЬ]`) + chalk.gray(`: Временная роль ${role.name} была удалена у пользователя ${member.user.username}!`))
                                    result.delete()
                                } else {
                                    await member.roles.remove(roleid)
                                    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.red(`[ОШИБКА В temp_roles.js]`) + chalk.gray(`: Произошла непредвиденная ошибка. Роль была удалена вместе с файлом! Подробная информация о файле отправлена ниже:
                                ${result}`))
                                    result.delete()
                                }


                            }
                        }
                    } else {
                        client.TempItemsHelper(result.userid, result.guildid, result.extraInfo);
                    }
                }


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