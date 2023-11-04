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
    client.AutoStars = async () => {
        try {
            const guild = await client.guilds.fetch(`320193302844669959`)
            if (!await checkPlugin("320193302844669959", plugin.id)) return;
            const results = await User.find({ guildid: guild.id })

            for (const result of results) {
                if (result.black_hole.enabled !== true) {
                    const member = await guild.members.fetch(result.userid)
                    let a = `553660090184499201`
                    let b = `553660091677540363`
                    let c = `553660093523034112`
                    let d = `553660095259475989`
                    let e = `553660095951667217`
                    let f = `553660097520205824`
                    let g = `572417192755462165`
                    let h = `595962185641885716`
                    let i = `609082751349686282`

                    let aa = `531158683883929602`
                    let ab = `531158275400531988`
                    let ac = `553660120379293696`
                    let ad = `553660121444515842`
                    let ae = `931866162508230696`

                    let ba = `609085186738618395`
                    let bb = `609086542681604142`
                    let bc = `781069819838464022`
                    let bd = `785252400608182282`
                    let be = `781069820053160006`

                    let ca = `784434241613987861`
                    let cb = `784434242083487826`
                    let cc = `781069818525777940`

                    if (member.roles.cache.hasAll(a, b, c, d, e, f, g, h, i)) {

                        if (!member.roles.cache.has(aa)) {
                            await member.roles.remove([a, b, c, d, e, f, g, h, i])
                            await member.roles.add(aa)
                        } else if (!member.roles.cache.has(ab)) {
                            await member.roles.remove([a, b, c, d, e, f, g, h, i])
                            await member.roles.add(ab)
                        } else if (!member.roles.cache.has(ac)) {
                            await member.roles.remove([a, b, c, d, e, f, g, h, i])
                            await member.roles.add(ac)
                        } else if (!member.roles.cache.has(ad)) {
                            await member.roles.remove([a, b, c, d, e, f, g, h, i])
                            await member.roles.add(ad)
                        } else if (!member.roles.cache.has(ae)) {
                            await member.roles.remove([a, b, c, d, e, f, g, h, i])
                            await member.roles.add(ae)
                        }
                    }

                    if (member.roles.cache.hasAll(aa, ab, ac, ad, ae)) {
                        if (!member.roles.cache.has(ba)) {
                            await member.roles.remove([aa, ab, ac, ad, ae])
                            await member.roles.add(ba)
                        } else if (!member.roles.cache.has(bb)) {
                            await member.roles.remove([aa, ab, ac, ad, ae])
                            await member.roles.add(bb)
                        } else if (!member.roles.cache.has(bc)) {
                            await member.roles.remove([aa, ab, ac, ad, ae])
                            await member.roles.add(bc)
                        } else if (!member.roles.cache.has(bd)) {
                            await member.roles.remove([aa, ab, ac, ad, ae])
                            await member.roles.add(bd)
                        } else if (!member.roles.cache.has(be)) {
                            await member.roles.remove([aa, ab, ac, ad, ae])
                            await member.roles.add(be)
                        }
                    }

                    if (member.roles.cache.hasAll(ba, bb, bc, bd, be)) {
                        if (!member.roles.cache.has(ca)) {
                            await member.roles.remove([ba, bb, bc, bd, be])
                            await member.roles.add(ca)
                        } else if (!member.roles.cache.has(cb)) {
                            await member.roles.remove([ba, bb, bc, bd, be])
                            await member.roles.add(cb)
                        } else if (!member.roles.cache.has(cc)) {
                            await member.roles.remove([ba, bb, bc, bd, be])
                            await member.roles.add(cc)
                        }
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