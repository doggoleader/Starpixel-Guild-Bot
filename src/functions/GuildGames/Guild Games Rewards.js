const { User } = require(`../../schemas/userdata`)
const chalk = require(`chalk`);
const { EmbedBuilder, AttachmentBuilder } = require(`discord.js`)
const ch_list = require(`../../discord structure/channels.json`)
const { Guild } = require(`../../schemas/guilddata`)
const wait = require(`node:timers/promises`).setTimeout
const linksInfo = require(`../../discord structure/links.json`)
const fs = require(`fs`)
const toXLS = require(`json2xls`)
const { checkPlugin } = require("../../functions");
const plugin = {
    id: "guildgames",
    name: "Совместные игры"
}

module.exports = (client) => {
    client.GuildGamesCheckRewards = async (member) => {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", plugin.id)) return;
            const channel = await guild.channels.fetch(ch_list.main)
            const userData = await User.findOne({ userid: member.user.id, guildid: guild.id })
            const rewardsFile = require(`./GuildGamesSettings/Guild Games Rewards.json`)
            const rewards = await rewardsFile.filter(rew => rew.required <= userData.visited_games)
            for (const reward of rewards) {
                let check = await userData.guild_games_rewards.find(r => r == reward.required);
                if (!check) {
                    if (!member.roles.cache.has(reward.box)) {
                        await member.roles.add(reward.box)
                        const embed = new EmbedBuilder()
                            .setTitle(`Получена награда за посещение совместной игры`)
                            .setDescription(`${member} получил награду за посещение ${reward.required} совместных игр! В качестве награды он получает <@&${reward.box}>! 
                    
Спасибо, что посещаете совместные игры! Ждём вас ещё!`)
                            .setColor(Number(linksInfo.bot_color))
                            .setThumbnail(member.user.displayAvatarURL())
                            .setTimestamp(Date.now())

                        await channel.send({
                            embeds: [embed]
                        })
                    } else {
                        await userData.stacked_items.push(reward.box)
                        const embed = new EmbedBuilder()
                            .setTitle(`В склад предметов добавлена награда!`)
                            .setDescription(`${member} теперь имеет ${userData.stacked_items.length} неполученных наград! За посещение ${reward.required} игр на склад была отправлена <@&${reward.box}>!

Чтобы получить награду, откройте коробки и пропишите команду </rewards claim:1055546254240784492>! Для просмотра списка неполученных наград пропишите </rewards unclaimed:1055546254240784492>!
Спасибо, что посещаете совместные игры! Ждём вас ещё!`)
                            .setColor(Number(linksInfo.bot_color))
                            .setThumbnail(member.user.displayAvatarURL())
                            .setTimestamp(Date.now())
                        await channel.send({
                            content: `⚠ ${member}`,
                            embeds: [embed]
                        })
                    }

                    await userData.guild_games_rewards.push(reward.required)
                }
            }

            userData.save()



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
