const { User } = require(`../../../schemas/userdata`)
const { Guild } = require(`../../../schemas/guilddata`)
const { SocialVerify } = require(`../../../schemas/verify`)
const https = require(`https`)
const { API, Upload } = require(`vk-io`)
const { ChannelType } = require(`discord.js`)
const chalk = require(`chalk`);
const prettyMilliseconds = require(`pretty-ms`) //ДОБАВИТЬ В ДРУГИЕ
const { isURL } = require(`../../../functions`)
const linksInfo = require(`../../../discord structure/links.json`)
const fs = require(`fs`)
const fetch = require(`node-fetch`)
const { checkPlugin } = require("../../../functions");

module.exports = {
    name: 'messageCreate',
    plugin: {
        id: "misc",
        name: "Разное"
    },
    async execute(message, client) {

        if (message.channel.type !== ChannelType.DM) {
            if (!await checkPlugin(message.guild.id, this.plugin.id)) return


            if (message.author.bot) return
            console.log(chalk.blackBright(`[${new Date()}]`) + chalk.yellow(`[${message.author.tag} в ${message.channel.name}]`) + chalk.white(`: ${message.content}`))

            const blocked = require(`./JSON/blockedWords.json`)
            let words = await message.content.split(` `)

            let word
            for (let w of words) {
                if (blocked.includes(w)) {
                    console.log(w)
                    word = w
                }
            }
            if (blocked.includes(word)) {
                const member = message.member
                const userData = await User.findOne({ userid: message.author.id, guildid: message.guild.id })
                if (!userData) return
                const reason = `Использование нецензурной лексики`
                const n1 = [`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`, `N`, `O`, `P`, `Q`, `R`, `S`, `T`, `U`, `V`, `W`, `X`, `Y`, `Z`, `0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`]
                let r1 = n1[Math.floor(Math.random() * n1.length)]
                let r2 = n1[Math.floor(Math.random() * n1.length)]
                let r3 = n1[Math.floor(Math.random() * n1.length)]
                let r4 = n1[Math.floor(Math.random() * n1.length)]
                let r5 = n1[Math.floor(Math.random() * n1.length)]
                let r6 = n1[Math.floor(Math.random() * n1.length)]
                let r7 = n1[Math.floor(Math.random() * n1.length)]
                const date = new Date()
                const warn_code = `${r1}${r2}${r3}${r4}${r5}${r6}${r7}-${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}_${date.getHours()}${date.getMinutes()}${date.getSeconds()}`
                const attachments = []
                for (let attach of message.attachments) {
                    attachments.push(
                        {
                            link: attach.url
                        }
                    )
                }
                userData.warn_info.push({
                    user: message.author.id,
                    moderator: client.user.id,
                    reason: reason,
                    date: date,
                    warn_code: warn_code,
                    message: {
                        id: message.id,
                        content: message.content,
                        url: message.url,
                        attachments: attachments
                    }
                })
                userData.save()
                client.Warnings()
                await member.send(`Вы не можете использовать \`${word}\`!`).catch()
                return message.delete()
            }
            const guildData = await Guild.findOne({ id: message.guild.id }) || new Guild({ id: message.guild.id, name: message.guild.name })
            const user = message.author
            const userData = await User.findOne({ userid: user.id })
            if (!userData) return
            if (userData.black_hole.enabled == true) return
            if (message.channel.id == `982551755340537866`
                || message.author.bot
                || !message.member.roles.cache.has(`504887113649750016`)) return

            if (userData.cooldowns.msgCreateExp > Date.now()) {
                userData.exp += 0
            } else {
                if (message.channel.id == `1034497096629362730`) return
                let add_exp = Math.floor(Math.random() * 15 + 11) * guildData.act_exp_boost * userData.pers_act_boost

                userData.exp += add_exp

                console.log(chalk.blackBright(`[${new Date()}]`) + chalk.magentaBright(`[${message.author.tag} в ${message.channel.name}]`) + chalk.gray(`: +${add_exp} опыта активности`))
                userData.cooldowns.msgCreateExp = Date.now() + (1000 * 60)

            }
            userData.black_hole.info.messages_lastMonth += 1

            if (guildData.seasonal.halloween.enabled) {
                const date = new Date()
                if (date.getMonth() + 1 == 10 && date.getDate() == 31) {
                    userData.seasonal.halloween.hw_msg = true;
                }
            }


            userData.save();
            client.ActExp(userData.userid)

            try {
                if (message.channel.id == `1048981114594799706`) {
                    const userDatas = await User.find();
                    const verifies = await SocialVerify.find();

                    if (message.attachments) {
                        await message.attachments.forEach(async att => {

                            if (att.contentType.startsWith(`image`)) {
                                function downloadImage(url, filepath) {
                                    return new Promise((resolve, reject) => {
                                        https.get(url, (res) => {
                                            if (res.statusCode === 200) {
                                                res.pipe(fs.createWriteStream(filepath))
                                                    .on('error', reject)
                                                    .once('close', () => resolve(filepath));
                                            } else {
                                                // Consume response data to free up memory
                                                res.resume();
                                                reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));

                                            }
                                        });
                                    });
                                }
                                await downloadImage(att.url, `./src/files/Images/${att.name}`).then(console.log).catch(console.error)

                                const appAPI = new API({
                                    token: process.env.VK_TOKEN_APP,
                                    apiVersion: `5.131`
                                })

                                const up = new Upload({
                                    api: appAPI
                                })

                                let author
                                if (verifies.find(v => v.discord.userid == message.author.id)) {
                                    let verify = await verifies.find(v => v.discord.userid == message.author.id)
                                    let uuu = await appAPI.users.get({
                                        user_ids: verify.vk.userid,
                                    })
                                    author = `[id${verify.vk.userid}|${uuu[0].first_name} ${uuu[0].last_name}]`
                                } else author = `${userDatas.find(u => u.userid == message.author.id).displayname.name} (${userDatas.find(u => u.userid == message.author.id).nickname})`

                                const upload_url = await appAPI.photos.getUploadServer({
                                    album_id: 291098457,
                                    group_id: 215499694,
                                })
                                const a = await up.photoAlbum({
                                    source: {
                                        value: `./src/files/Images/${att.name}`,
                                        uploadUrl: upload_url.upload_url
                                    },
                                    album_id: 291098457,
                                    group_id: 215499694,
                                    caption: `${message.content ? message.content : `Совместная игра от гильдии Starpixel`}
                                    
Автор: ${author}`,

                                })

                            }
                        })
                    }
                }
            } catch (e) {
                console.log(e)
            }
        }
    }
}