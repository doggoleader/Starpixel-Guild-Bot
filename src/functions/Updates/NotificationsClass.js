const { EmbedBuilder } = require("discord.js");
const { checkPlugin, getCooldownUsage } = require("../../functions");
const { User } = require("../../schemas/userdata");


class Notifications {
    static id = 'misc';
    static name = 'Разное'

    /**
     * 
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord Client
     */
    static async cd_notifications(client) {
        try {
            const guild = await client.guilds.fetch("320193302844669959");
            if (!await checkPlugin(guild.id, this.id)) return;
            const userDatas = (await User.find()).filter(userData => userData.pers_settings.cd_notifications == true)
            const blacklistedCDs = [`msgCreateExp`, `hw_msgCreate`]
            for (const userData of userDatas) {
                const member = await guild.members.fetch(userData.userid)
                let finished_cd = []

                for (const item of Object.keys(userData.cooldowns)) {
                    if (!blacklistedCDs.includes(item)) {
                        if (userData.cooldowns[item].getTime() <= Date.now()) {
                            if (!userData.cd_remind.includes(item)) {
                                finished_cd.push(`- ${getCooldownUsage(item)}`)
                                userData.cd_remind.push(item)
                            }
                        }
                    }
                }
                if (finished_cd.length >= 1) {
                    const embed = new EmbedBuilder()
                        .setColor(Number(client.information.bot_color))
                        .setDescription(`## Уведомление об окончании перезарядки
Перезарядка успешно закончилась у следующих предметов:
${finished_cd.join(`\n`)}

**Обратите внимание, что некоторые команды или кнопки могут быть вам недоступны, но уведомление об окончании перезарядки вам отправилось. Связано это с тем, что бот обновляет информацию о перезарядке всех предметов в вашем профиле!**`)
                        .setTimestamp(Date.now())

                    try {
                        await member.send({
                            embeds: [embed]
                        })
                    } catch (err) {

                    }
                    userData.save()
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
}





module.exports = {
    Notifications
}