const { User } = require(`../../schemas/userdata`)
const chalk = require(`chalk`);
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require(`discord.js`)
const ch_list = require(`../../discord structure/channels.json`)
const linksInfo = require(`../../discord structure/links.json`)
const { Guild } = require(`../../schemas/guilddata`)
const { checkPlugin } = require("../../functions");
const cron = require(`node-cron`);
const plugin = {
    id: "seasonal",
    name: "Сезонное"
}

module.exports = (client) => {
    client.NewYearSnowfall = async () => {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", plugin.id)) return;
            const guildData = await Guild.findOne({ id: guild.id })

            cron.schedule(`0 * * * *`, async () => {
                if (guildData.seasonal.new_year.enabled == false) return
                const items = [true, false, false, false]
                const item = items[Math.floor(Math.random() * items.length)]

                if (item) {
                    let prizes = [
                        {
                            id: 1,
                            name: `Новогодний подарок`,
                            amount: 1
                        },
                        {
                            id: 2,
                            name: `Новогодний подарок`,
                            amount: 2
                        },
                        {
                            id: 3,
                            name: `Новогодние очки`,
                            amount: 1
                        },
                        {
                            id: 4,
                            name: `Новогодние очки`,
                            amount: 2
                        },
                        {
                            id: 5,
                            name: `Новогодние очки`,
                            amount: 3
                        },
                        {
                            id: 6,
                            name: `Снежинки`,
                            amount: 3
                        },
                        {
                            id: 7,
                            name: `Снежинки`,
                            amount: 5
                        },
                        {
                            id: 8,
                            name: `Снежинки`,
                            amount: 7
                        }
                    ]

                    let prize = prizes[Math.floor(Math.random() * prizes.length)]

                    const channel = await guild.channels.fetch(ch_list.main);
                    const button = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(`Получить подарок`)
                                .setCustomId(`claim_elf_reward`)
                                .setStyle(ButtonStyle.Success)
                                .setEmoji(`🧝‍♂️`)
                        )

                    const msg = await channel.send({
                        content: `🧝‍♂️ Новогодний эльф прибыл в чат и оставил свой подарок! **Заберите его в течение 10 минут, иначе он растает!**
                        
\`??? x?\` 🎁`,
                        components: [button]
                    })

                    const collector = await msg.createMessageComponentCollector({ time: 1000 * 60 * 10 })
                    let claimed = false
                    collector.on('collect', async (i) => {
                        const userData = await User.findOne({
                            userid: i.user.id,
                            guildid: i.guild.id
                        })

                        if (prize.id == 1 || prize.id == 2) {
                            for (let i = 0; i < prize.amount; i++) {
                                userData.stacked_items.push(`925799156679856240`)
                            }
                        } else if (prize.id == 3 || prize.id == 4 || prize.id == 5) {
                            userData.seasonal.new_year.points += prize.amount
                        } else if (prize.id == 6 || prize.id == 7 || prize.id == 8) {
                            userData.seasonal.new_year.snowflakes += prize.amount
                        }

                        userData.save()
                        claimed = true

                        await i.reply({
                            content: `Вы получили ${prize.name} x${prize.amount} от новогоднего эльфа!`,
                            ephemeral: true
                        })
                        await msg.edit({
                            content: `🧝‍♂️ Новогодний эльф прибыл в чат и оставил свой подарок! **Заберите его в течение 10 минут, иначе он растает!**
                        
\`${prize.name} x${prize.amount}\` 🎁
Подарок забрал: ${i.user}`,
                            components: []
                        })

                        collector.stop();
                    })

                    collector.on('end', async e => {
                        if (!claimed) {
                            await msg.edit({
                                content: `🧝‍♂️ Новогодний эльф прибыл в чат и оставил свой подарок! **Заберите его в течение 10 минут, иначе он растает!**
                        
\`${prize.name} x${prize.amount}\` 🎁
**Подарок, к сожалению, никто не забрал!**`,
                                components: []
                            })
                        }
                    })



                }

            }, {
                scheduled: true,
                timezone: `Europe/Moscow`
            })
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