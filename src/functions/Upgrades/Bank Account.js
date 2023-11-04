const { User } = require(`../../schemas/userdata`)
const chalk = require(`chalk`);
const { EmbedBuilder } = require(`discord.js`)
const ch_list = require(`../../discord structure/channels.json`)
const linksInfo = require(`../../discord structure/links.json`)
const { Guild } = require(`../../schemas/guilddata`)
const { checkPlugin } = require("../../functions");
const plugin = {
    id: "items",
    name: "Предметы"
}

module.exports = (client) => {
    client.BankAccountCheck = async () => {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", plugin.id)) return;
            const userDatas = await User.find({ "bank.expire": { $lte: Date.now() }, "bank.opened": true })
            for (let userData of userDatas) {
                const member = await guild.members.fetch(userData.userid)
                const balance = userData.bank.balance
                userData.rumbik += Math.floor(userData.bank.balance * userData.bank.multiplier)
                userData.bank.balance = 0
                userData.bank.opened = false
                userData.save()
                await member.send({
                    content: `## Ваш банковский вклад закрыт
Ваш банковский вклад на сумму ${balance}<:Rumbik:883638847056003072> был закрыт.
Ваша прибыль с данного вклада составила ${Math.floor(balance * (userData.bank.multiplier - 1))}<:Rumbik:883638847056003072>
У вас на данный момент ${userData.rumbik}<:Rumbik:883638847056003072>`
                }).catch(async e => {
                    const ch = await guild.channels.fetch(ch_list.main)
                    await ch.send({
                        content: `## Ваш банковский вклад закрыт, ${member}
Ваш банковский вклад на сумму ${balance}<:Rumbik:883638847056003072> был закрыт.
Ваша прибыль с данного вклада составила ${Math.floor(balance * (userData.bank.multiplier - 1))}}<:Rumbik:883638847056003072>
У вас на данный момент ${userData.rumbik}<:Rumbik:883638847056003072>`
                    })
                })
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