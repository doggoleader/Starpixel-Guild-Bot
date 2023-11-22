const { Apply } = require(`../../../schemas/applications`)
const { Guild } = require(`../../../schemas/guilddata`)
const { ChannelType, AttachmentBuilder, EmbedBuilder } = require(`discord.js`)
const chalk = require(`chalk`);
const prettyMilliseconds = require(`pretty-ms`) //ДОБАВИТЬ В ДРУГИЕ
const linksInfo = require(`../../../discord structure/links.json`)
const { checkPlugin } = require("../../../functions");
let plugin = {
    id: "new_users",
    name: "Новые пользователи"
}
async function execute(member, client) {
    if (!await checkPlugin(member.guild.id, plugin.id)) return
    const guild = member.guild
    const appData = await Apply.findOne({ userid: member.user.id, guildid: guild.id }) || new Apply({
        userid: member.user.id,
        guildid: guild.id
    })
    const guildInvites = await guild.invites.fetch()
    const guildData = await Guild.findOne({ id: guild.id })
    const invites = await client.invites.get(guild.id);
    let bypass = false;
    for (let inv of guildInvites) {
        inv = inv[1]
        const before = await invites.get(inv.code);
        if (before !== inv.uses) {
            appData.invite_code = inv.code;
            appData.invited_by = inv.inviter.id;
            if (guildData.invites.bypass_invite_codes.includes(inv.code)) {
                guildData.invites.bypass_invite_codes.splice(
                    guildData.invites.bypass_invite_codes.findIndex(i => i == inv.code),
                    1
                )
                await inv.delete();
                bypass = true;
            }
        }
        await invites.set(inv.code, inv.uses);
    }


    guildData.save()
    if (bypass == true) {
        appData.onlinemode = 'no';
    } else {
        appData.onlinemode = 'yes';
    }
    await appData.save();
    const embedJoin = new EmbedBuilder()
        .setTitle(`Пользователь присоединился`)
        .setColor(Number(linksInfo.bot_color))
        .setDescription(`${member} (${member.user.tag}, ${member.user.id}) присоединился!
Он является #${member.guild.memberCount}-ым участником сервера!

**Использованное приглашение:** \`${appData.invite_code}\`
**Приглашение создано пользователем <@${appData.invited_by}>**.${bypass ? `\n### Пользователь присоединился по ссылке для пользователей без лицензии!` : ` `}`)
        .setTimestamp(Date.now())
        .setThumbnail(member.user.displayAvatarURL())

    /*  const canvas = createCanvas(1000, 300),
         ctx = canvas.getContext('2d'),
         bg = await loadImage(`./src/assets/Cards/Join.png`),
         av = await loadImage(member.user.displayAvatarURL({ format: 'png', dynamic: false }))
 
     ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
 
     ctx.beginPath();
     ctx.arc(140, 140, 100, 0, 2 * Math.PI);
     ctx.lineWidth = 2;
     ctx.strokeStyle = `white`;
     ctx.stroke();
     ctx.closePath();
 
     ctx.font = "bold 44px Sans";
     ctx.fillStyle = "white";
     ctx.textAlign = "center";
     ctx.fillText(`${member.user.tag}`, 650, 115, 1000);
 
     ctx.font = "bold 34px Sans";
     ctx.fillStyle = "#c9ff50";
     ctx.textAlign = "center";
     ctx.fillText(`Пользователь присоединился:`, 650, 65, 1000);
     ctx.fillText(`Он является #${member.guild.memberCount}-ым`, 650, 185, 1000);
     ctx.fillText(`участником сервера!`, 650, 225, 1000);
 
     ctx.beginPath();
     ctx.arc(140, 140, 100, 0, 2 * Math.PI);
     ctx.closePath();
     ctx.clip();
 
     ctx.drawImage(av, 22, 22, 220, 220) */

    const channel = await guild.channels.cache.get(`849608079691350078`)


    /* const att = new AttachmentBuilder(canvas.toBuffer(), { name: `join.png` }) */
    await channel.send({
        embeds: [embedJoin]
    })
}

module.exports = {
    name: 'guildMemberAdd',
    plugin: plugin,
    execute
}