const { ButtonBuilder, ChannelType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const { Tickets } = require(`../../../schemas/tickets`)
const { TicketsUser } = require(`../../../schemas/ticketUser`)
const { Guild } = require(`../../../schemas/guilddata`)
const { User } = require(`../../../schemas/userdata`)
const linksInfo = require(`../../../discord structure/links.json`)
const api = process.env.hypixel_apikey;
const info = require(`../../../jsons/Marathon.json`);
const fetch = require(`node-fetch`)
const { getProperty } = require("../../../functions");
const { starway } = require(`../../../jsons/Starway Rewards.json`)
module.exports = {
    plugin: {
        id: "items",
        name: "Предметы"
    },
    data: {
        name: `starway`
    },
    async execute(interaction, client) {
        try {
           
            const userData = await User.findOne({ userid: interaction.user.id, guildid: interaction.guild.id })
            let check = userData.starway.claimed.find(cl => cl == userData.starway.current)
            if (check) return interaction.reply({
                content: `Вы уже получили награду за \`${userData.starway.current}-й\` этап звёздного пути!`,
                ephemeral: true
            })

            let a = `553660090184499201` //Альфа
            let b = `553660091677540363` //Бета
            let c = `553660093523034112` //Гамма
            let d = `553660095259475989` //...
            let e = `553660095951667217`
            let f = `553660097520205824`
            let g = `572417192755462165`
            let h = `595962185641885716`
            let i = `609082751349686282` //Йота

            let aa = `531158683883929602` //Созвездия
            let ab = `531158275400531988`
            let ac = `553660120379293696`
            let ad = `553660121444515842`
            let ae = `931866162508230696`

            let ba = `609085186738618395` //Пыль
            let bb = `609086542681604142`
            let bc = `781069819838464022`
            let bd = `785252400608182282`
            let be = `781069820053160006`

            let ca = `784434241613987861` //Кометы
            let cb = `784434242083487826`
            let cc = `781069818525777940`

            if (interaction.member.roles.cache.has(a) && interaction.member.roles.cache.has(b) && interaction.member.roles.cache.has(c) && interaction.member.roles.cache.has(d) && interaction.member.roles.cache.has(e) && interaction.member.roles.cache.has(f) && interaction.member.roles.cache.has(g) && interaction.member.roles.cache.has(h) && interaction.member.roles.cache.has(i) && interaction.member.roles.cache.has(aa) && interaction.member.roles.cache.has(ab) && interaction.member.roles.cache.has(ac) && interaction.member.roles.cache.has(ad) && interaction.member.roles.cache.has(ae) && interaction.member.roles.cache.has(ba) && interaction.member.roles.cache.has(bb) && interaction.member.roles.cache.has(bc) && interaction.member.roles.cache.has(bd) && interaction.member.roles.cache.has(be) && interaction.member.roles.cache.has(ca) && interaction.member.roles.cache.has(cb) && interaction.member.roles.cache.has(cc)) {
                
                await interaction.member.roles.remove([ca, cb, cc])
                await interaction.member.roles.remove([ba, bb, bc, bd, be])
                await interaction.member.roles.remove([aa, ab, ac, ad, ae])
                await interaction.member.roles.remove([a, b, c, d, e, f, g, h, i])
                userData.starway.claimed.push(userData.starway.current)
                userData.starway.current += 1
                const reward = starway.find(sw => sw.stage == userData.starway.current)
                if (reward) {
                    for (let rew of reward.rewards) {
                        if (interaction.member.roles.cache.has(rew) && (rew !== `1020400030575763587` && rew !== `1020400034853957713` && rew !== `1020400032651952168`)) {
                            await userData.stacked_items.push(rew)
                        } else if (!interaction.member.roles.cache.has(rew) && (rew !== `1020400030575763587` && rew !== `1020400034853957713` && rew !== `1020400032651952168`)) {
                            await interaction.member.roles.add(rew)
                        } else if (userData.rank_number < 9 && (rew == `1020400030575763587` || rew == `1020400034853957713` || rew == `1020400032651952168`)) {
                            await userData.starway.unclaimed.push(rew)
                        } else if (userData.rank_number >= 9 && (rew == `1020400030575763587` || rew == `1020400034853957713` || rew == `1020400032651952168`)) {
                            await interaction.member.roles.add(rew)
                        }
                    }


                }
                userData.save()
                await interaction.reply({
                    content: `Вы получили награду за сбор ${userData.starway.current}-го звёздного комплекта!`,
                })
            } else return interaction.reply({
                content: `Вы не собрали полностью звёздный комплект! Попробуйте ещё раз, когда соберёте его!`,
                ephemeral: true
            })
        } catch (e) {
            const admin = await client.users.fetch(`491343958660874242`)
            console.log(e)
            let options = interaction?.options.data.map(a => {
                return `{
"status": true,
"name": "${a.name}",
"type": ${a.type},
"autocomplete": ${a?.autocomplete ? true : false},
"value": "${a?.value ? a.value : "No value"}",
"user": "${a?.user?.id ? a.user.id : "No User"}",
"channel": "${a?.channel?.id ? a.channel.id : "No Channel"}",
"role": "${a?.role?.id ? a.role.id : "No Role"}",
"attachment": "${a?.attachment?.url ? a.attachment.url : "No Attachment"}"
}`
            })
            await admin.send(`Произошла ошибка!`)
            await admin.send(`=> ${e}.
**ID кнопки**: \`${interaction.customId}\`
**Пользователь**: ${interaction.member}
**Канал**: ${interaction.channel}
**Опции**: \`\`\`json
${interaction.options.data.length <= 0 ? `{"status": false}` : options.join(`,\n`)}
\`\`\``)
            await admin.send(`◾`)
        }

    }
}