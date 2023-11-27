
const { User } = require(`../../schemas/userdata`)
const chalk = require(`chalk`)
const { EmbedBuilder, GuildMember } = require("discord.js")
const ch_list = require(`../../discord structure/channels.json`)
const { checkPlugin } = require("../../functions");
const { Temp } = require(`../../schemas/temp_items`)
const { Guild } = require(`../../schemas/guilddata`)

class UpdatesNicknames {
    /** @private */
    static id = 'nicknames';
    /** @private */
    static name = `Никнеймы`;

    /**
     * 
     * @param {import("../../misc_functions/Classes/System/StarpixelClient").StarpixelClient} client Discord CLient
     */
    static async updatenicks(client) {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", this.id)) return;
            const results = await User.find({ guildid: `320193302844669959` })
            let i = 0
            for (const result of results) {
                if (result.black_hole.enabled !== true) {
                    if (result.userid !== `491343958660874242`) {
                        const { userid, displayname } = result;
                        const { rank, ramka1, name, ramka2, suffix, symbol, premium } = displayname;
                        const member = await guild.members.fetch(userid)
                        const oldNickname = member.nickname;
                        let newNickname = `「${rank}」${ramka1}${name}${ramka2}${suffix} ${symbol}┇${premium}`
                        if (newNickname !== oldNickname) {
                            await member.setNickname(newNickname)
                        }
                    }
                }

            }

            console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magenta(`[ИЗМЕНЕНИЕ НИКНЕЙМОВ]`) + chalk.gray(`: Никнеймы всех участников были обновлены!`))

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

module.exports = {
    UpdatesNicknames
}