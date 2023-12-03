const { Temp } = require(`../../schemas/temp_items`)
const chalk = require(`chalk`)
const { Guild } = require(`../../schemas/guilddata`)
const { User } = require(`../../schemas/userdata`)
const { changeProperty } = require(`../../functions`)
const { checkPlugin } = require("../../functions");

class TempItems {
    /** @private */
    static id = "items";
    /** @private */
    static name = `Предметы`
    /**
     * @param {String} userid Discord User ID
     * @param {String} guildid Discord Guild ID
     * @param {String} extraInfo MongoDB Database Object Path
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async TempItemsHelper(userid, guildid, extraInfo, client) {
        try {
            if (!await checkPlugin("320193302844669959", this.id)) return;
            const result = await Temp.findOne({ userid: userid, guildid: guildid, extraInfo: extraInfo, expire: { $lte: new Date() } })
            const userData = await User.findOne({ userid: userid, guildid: guildid })
            if (userData.black_hole.enabled == true) return
            const newValue = await client.getInfo(userid, guildid, extraInfo)
            if (String(newValue).startsWith(`Не удалось найти опцию`)) return
            await changeProperty(userData, extraInfo, newValue)
            userData.save()
            result.delete()
        } catch (e) {
            const admin = await client.users.fetch(`491343958660874242`)
            console.log(e)
            await admin.send({
                content: `-> \`\`\`${e.stack}\`\`\``
            }).catch()
        }

    }
    /**
    * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
    */
    static async temp_roles(client) {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", this.id)) return;
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
            await admin.send({
                content: `-> \`\`\`${e.stack}\`\`\``
            }).catch()
        }


    }
    /**
    * @param {String} userid Discord User ID
    * @param {String} guildid Discord Guild ID
    * @param {String} extraInfo MongoDB Database Object Path
    * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
    */
    static async getInfo(userid, guildid, extraInfo, client) {
        try {
            if (!await checkPlugin("320193302844669959", this.id)) return;
            const userData = await User.findOne({ userid: userid, guildid: guildid })
            let result

            if (extraInfo == `shop_costs`) {
                let sub_info
                if (userData.sub_type == 0) sub_info = 0
                else if (userData.sub_type == 1) sub_info = 0
                else if (userData.sub_type == 2) sub_info = 0.05
                else if (userData.sub_type == 3) sub_info = 0.1
                else if (userData.sub_type == 4) sub_info = 0.2

                let perks_info = userData.perks.shop_discount * 0.05

                if (1 - sub_info < 1 - perks_info) result = 1 - sub_info
                else if (1 - sub_info > 1 - perks_info) result = 1 - perks_info

            } else if (extraInfo == `king_costs`) {
                let perks_info = userData.perks.king_discount * 0.05

                result = 1 - perks_info
            } else if (extraInfo == `act_costs`) {
                let perks_info = userData.perks.act_discount * 0.1

                result = 1 - perks_info
            } else if (extraInfo == `pers_act_boost`) {

                let sub_info
                if (userData.sub_type == 0) sub_info = 1
                else if (userData.sub_type == 1) sub_info = 1.5
                else if (userData.sub_type == 2) sub_info = 2
                else if (userData.sub_type == 3) sub_info = 3
                else if (userData.sub_type == 4) sub_info = 5

                result = sub_info

            } else if (extraInfo == `pers_rank_boost`) {

                let sub_info
                if (userData.sub_type == 0) sub_info = 1
                else if (userData.sub_type == 1) sub_info = 1
                else if (userData.sub_type == 2) sub_info = 1.5
                else if (userData.sub_type == 3) sub_info = 2
                else if (userData.sub_type == 4) sub_info = 3

                let perks_info = userData.perks.rank_boost * 0.05

                result = sub_info + perks_info
            } else if (extraInfo == `pers_rumb_boost`) {
                result = 1
            } else if (extraInfo.startsWith("box_chances")) {
                result = 1
            } else {
                console.log(`Не удалось найти опцию ${extraInfo}!`)
                return `Не удалось найти опцию ${extraInfo}! Подождите, пока администратор это починит!`
            }
            return result
        } catch (e) {
            const admin = await client.users.fetch(`491343958660874242`)
            console.log(e)
            await admin.send({
                content: `-> \`\`\`${e.stack}\`\`\``
            }).catch()
        }

    }
}


module.exports = {
    TempItems
}