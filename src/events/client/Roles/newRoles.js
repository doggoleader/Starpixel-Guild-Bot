const chalk = require(`chalk`);
const { EmbedBuilder } = require("discord.js");
const { Guild } = require(`../../../schemas/guilddata`)
const linksInfo = require(`../../../discord structure/links.json`);
const ch_list = require(`../../../discord structure/channels.json`);
const { User } = require("../../../schemas/userdata");
const { Temp } = require("../../../schemas/temp_items");
const { checkPlugin } = require("../../../functions");
const { GuildProgress } = require("../../../misc_functions/Exporter");
const { UserUpdates } = require("../../../functions/Updates/UpdatesClass");
let plugin = {
    id: "items",
    name: "Предметы"
}
async function execute(oldMember, newMember, client) {
    if (!await checkPlugin(newMember.guild.id, plugin.id)) return
    if (oldMember.user.bot || newMember.user.bot) return
    if (!newMember.roles.cache.has(`504887113649750016`)) return
    const userData = await User.findOne({
        userid: newMember.user.id
    })
    //Booster Role
    let premRole = await newMember.guild.roles.fetch(`850336260265476096`), boostRole = await newMember.guild.roles.fetch(`606442068470005760`)
    if (!oldMember.roles.cache.has(boostRole) && newMember.roles.cache.has(boostRole)) {
        await newMember.roles.add(premRole)
        const embed = new EmbedBuilder()
            .setColor(Number(linksInfo.bot_color))
            .setTitle(`Награда за буст сервера`)
            .setDescription(`Спасибо вам, ${newMember}, за то, что забустили наш сервер! В качестве благодарности вы получаете \`${boostRole.name}\` и \`${premRole.name}\` до тех пор, пока не закончится ваш буст сервера!`)
        await newMember.send({
            embeds: [embed]
        })
            .catch(async cb => {
                const main = await newMember.guild.channels.cache.get(ch_list.main)
                await main.send({
                    embeds: [embed],
                    content: `${newMember}`
                })
            })
    } else if (oldMember.roles.cache.has(boostRole) && !newMember.roles.cache.has(boostRole)) {
        const tempData = await Temp.findOne({ userid: userData.userid, roleid: premRole })
        if (tempData) {
            const embed = new EmbedBuilder()
                .setColor(Number(linksInfo.bot_color))
                .setTitle(`Награда за буст сервера`)
                .setDescription(`${newMember}, похоже, что ваш буст сервера закончился! Спасибо вам за него, но, к сожалению, мы вынуждены убрать у вас \`${boostRole.name}\` :'(`)
            await newMember.send({
                embeds: [embed]
            })
                .catch(async cb => {
                    const main = await newMember.guild.channels.cache.get(ch_list.main)
                    await main.send({
                        embeds: [embed],
                        content: `${newMember}`
                    })
                })
        } else if (!tempData) {
            await newMember.roles.remove(premRole)
            const embed = new EmbedBuilder()
                .setColor(Number(linksInfo.bot_color))
                .setTitle(`Награда за буст сервера`)
                .setDescription(`${newMember}, похоже, что ваш буст сервера закончился! Спасибо вам за него, но, к сожалению, мы вынуждены убрать у вас \`${boostRole.name}\` и \`${premRole.name}\` :'(`)
            await newMember.send({
                embeds: [embed]
            })
                .catch(async cb => {
                    const main = await newMember.guild.channels.cache.get(ch_list.main)
                    await main.send({
                        embeds: [embed],
                        content: `${newMember}`
                    })
                })
        }


    }

    UserUpdates.StaffPosUpdate(newMember.user.id, client)
}

module.exports = {
    name: 'guildMemberUpdate',
    plugin: plugin,
    execute
}