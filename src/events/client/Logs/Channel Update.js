const { User } = require(`../../../../src/schemas/userdata`)
const { Guild } = require(`../../../../src/schemas/guilddata`)
const { ChannelType, EmbedBuilder, WebhookClient, AuditLogEvent, PermissionsBitField } = require(`discord.js`)
const ch_list = require(`../../../../src/discord structure/channels.json`)
const { permToName } = require(`../../../functions`)
const chalk = require(`chalk`);
const prettyMilliseconds = require(`pretty-ms`) //ДОБАВИТЬ В ДРУГИЕ
const linksInfo = require(`../../../discord structure/links.json`)
const { checkPlugin } = require("../../../functions");

module.exports = {
    name: 'channelUpdate',
    plugin: {
        id: "logs",
        name: "Журнал аудита"
    },
    async execute(oldCh, newCh) {
        const client = oldCh.client || newCh.client
        const guild = oldCh.guild || newCh.client
        if (!await checkPlugin(guild.id, this.plugin.id)) return
        if (oldCh.partial) {
            try {
                await oldCh.fetch();
            } catch (error) {
                console.error('Произошла ошибка при обработке канала', error);

                return;
            }
        }
        const log_data = await Guild.findOne({ id: guild.id })
        const log_channel = await guild.channels.cache.get(ch_list.log)
        const webhookF = await log_channel.fetchWebhooks().then(hooks => hooks.find(webhook => webhook.name == `Starpixel Logs`))
        let webhook
        if (!webhookF) {
            await log_channel.createWebhook({
                name: `Starpixel Logs`,
                avatar: guild.iconURL(),
                reason: `Не было вебхука для использования логов!`
            }).then(hook => {
                log_data.logs.webhook_id = hook.id
                log_data.logs.webhook_token = hook.token
                log_data.logs.webhook_url = hook.url
                log_data.save()
            })
            webhook = new WebhookClient({ id: log_data.logs.webhook_id, token: log_data.logs.webhook_token })
        } else if (webhookF) {
            webhook = new WebhookClient({ id: log_data.logs.webhook_id, token: log_data.logs.webhook_token })
        }

        const fetchedLogs = await newCh.guild.fetchAuditLogs({
            limit: 1,

        });
        const auditLog = fetchedLogs.entries.first();
        let mod
        if (auditLog.createdTimestamp > Date.now() - 2000) {
            mod = auditLog.executor

            const changesMap = auditLog.changes.map(async (log) => {
                let changes
                switch (log.key) {
                    case `allow`: {
                        let oldP = new PermissionsBitField(log.old).toArray()
                        let newP = new PermissionsBitField(log.new).toArray()
                        let allowedPermsArray = []
                        for (let i = 0; i < newP.length; i++) {
                            if (!oldP.includes(newP[i])) {
                                allowedPermsArray.push(newP[i])
                            }
                        }
                        let PermsList = permToName(allowedPermsArray)
                        changes = `✅ **Разрешены права для роли \`${auditLog.extra.name}\`**: ${PermsList.join(`, `)}`
                    }

                        break;
                    case `deny`: {
                        let oldP = new PermissionsBitField(log.old).toArray()
                        let newP = new PermissionsBitField(log.new).toArray()
                        let allowedPermsArray = []
                        for (let i = 0; i < oldP.length; i++) {
                            if (!newP.includes(oldP[i])) {
                                allowedPermsArray.push(oldP[i])
                            }
                        }
                        let PermsList = permToName(allowedPermsArray)
                        changes = `❌ **Запрещены права для роли \`${auditLog.extra.name}\`**: ${PermsList.join(`, `)}`
                    }

                        break;
                    case `nsfw`: {
                        let newP = log.new

                        if (newP === true) {
                            changes = `🔞 **NSFW**: Да`
                        } else if (newP === false) {
                            changes = `🔞 **NSFW**: Нет`
                        }

                    }

                        break;
                    case `name`: {
                        let oldP = log.old
                        let newP = log.new

                        changes = `📃 **Имя канала**: \`${oldP}\` ➡ \`${newP}\``
                    }

                        break;
                    case `rate_limit_per_user`: {
                        let oldP = log.old
                        let newP = log.new

                        changes = `🕑 **Медленный режим**: \`${oldP} сек.\` ➡ \`${newP}\` сек.`
                    }

                        break;
                    case `topic`: {
                        let oldP = log.old
                        let newP = log.new
                        if (!newP) newP = `Не указана`
                        changes = `📜 **Тема канала**: \`${newP}\``
                    }

                        break;
                    case `default_auto_archive_duration`: {
                        let oldP = log.old
                        let newP = log.new

                        changes = `📩 **Автоархивация веток**: \`${oldP} сек.\` ➡ \`${newP}\` сек.`
                    }

                        break;
                    case `type`: {
                        let oldP = log.old
                        let newP = log.new
                        let type
                        if (newP == 0) {
                            type = `Текстовый канал`
                        } else if (newP == 5) {
                            type = `Канал с объявлениями`
                        }

                        changes = `💡 **Тип**: \`${type}\` `
                    }

                        break;
                    case `id`: {
                        let oldP = log.old
                        let newP = log.new
                        let newPerm = await guild.members.fetch(newP) || await guild.roles.fetch(newP)
                        if (newPerm) {
                            if (!oldP && newP) {
                                changes = `✅ **Добавлены права для пользователя ${newPerm}**`
                            } else if (oldP && !newP) {
                                changes = `❌ **Убраны права у пользователя ${newPerm}**`
                            }
                        } else if (!newPerm) {
                            newPerm = await guild.roles.fetch(newP)
                            if (!oldP && newP) {
                                changes = `✅ **Добавлены права для роли ${newPerm}**`
                            } else if (oldP && !newP) {
                                changes = `❌ **Убраны права у роли ${newPerm}**`
                            }
                        }

                    }

                        break;

                    case `bitrate`: {
                        let oldP = log.old
                        let newP = log.new

                        changes = `🔊 **Битрейт**: \`${oldP} kbps\` ➡ \`${newP} kbps\``
                    }
                        break;
                    case `user_limit`: {
                        let oldP = log.old
                        let newP = log.new

                        changes = `👤 **Лимит участников**: \`${oldP}\` ➡ \`${newP}\``
                    }
                        break;
                    case `video_quality_mode`: {
                        let oldP = log.old
                        let newP = log.new

                        changes = `📷 **Качество видео**: \`${newP}\``
                    }
                        break;
                    case `rtc_region`: {
                        let oldP = log.old
                        let newP = log.new

                        changes = `🌍 **Регион**: \`${newP}\``
                    }
                        break;

                    default:
                        break;


                }
                return `${changes}`
            })

            let chanProm = await Promise.all(changesMap)

            let log = new EmbedBuilder()
                .setTitle(`Изменён канал`)
                .setDescription(`Категория: \`${newCh?.parent?.name ? newCh.parent.name : `Отсутствует`}\`
Канал: ${newCh}
**Изменения**
${chanProm.join(`\n`)}

Модератор: ${mod}`)
                .setColor(Number(linksInfo.bot_color))
                .setTimestamp(Date.now())
                .setThumbnail(newCh.guild.iconURL())
            webhook.send({
                embeds: [log]
            })
        } 

    }
}