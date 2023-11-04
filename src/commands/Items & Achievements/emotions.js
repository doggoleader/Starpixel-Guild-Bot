const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { execute } = require('../../events/client/start_bot/ready');
const { User } = require(`../../schemas/userdata`);
const chalk = require(`chalk`);
const linksInfo = require(`../../discord structure/links.json`)

module.exports = {
    category: `em`,
    plugin: {
        id: "items",
        name: "Предметы"
    },
    data: new SlashCommandBuilder()
        .setName(`emotion`)
        .setDescription(`Отправить эмоцию в чат`)
        .setDMPermission(false)
        .addStringOption(option => option
            .setName(`эмоция`)
            .setDescription(`Выберите эмоцию, которую хотите отправить в чат`)
            .setAutocomplete(true)
            .setRequired(true)
        )
        .addUserOption(option => option
            .setName(`пользователь`)
            .setDescription(`Выберите пользователя, к кому хотите применить эмоцию`)
            .setRequired(false)
        ),
    async autoComplete(interaction, client) {
        const focusedValue = interaction.options.getFocused();
        const choices = [
            'oh',
            'army',
            'get up',
            'sleep',
            'hey',
            'hmm',
            'love',
            'happy',
            'money',
            'music',
            'spider',
            'pls',
            'party',
            'cool'
        ];
        const filtered = choices.filter(choice => choice.toLowerCase().includes(focusedValue.toLowerCase()));;
        await interaction.respond(
            filtered.map(choice => ({ name: choice, value: choice })),
        );
    },

    async execute(interaction, client) {
        try {
            
            switch (interaction.options.getString(`эмоция`)) {
                case `oh`: {
                    const role = `566528019208863744`;
                    if (!interaction.member.roles.cache.has(role)) {
                        const embed = new EmbedBuilder()
                            .setAuthor({
                                name: `❗ Отсутствует необходимая роль!`
                            })
                            .setDescription(`У вас нет эмоции \`${interaction.guild.roles.cache.get(role).name}\`!`)
                            .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                            .setColor(`DarkRed`)
                            .setTimestamp(Date.now())

                        interaction.reply({
                            embeds: [embed],
                            ephemeral: true
                        })

                    } else {
                        if (!interaction.options.getUser(`пользователь`)) {
                            interaction.reply(`${interaction.member} (⊙_⊙)`)
                        } else {
                            interaction.reply(`${interaction.member} (⊙_⊙) ${interaction.options.getUser(`пользователь`)}`)
                        }
                    }
                };
                    break;
                case `army`: {
                    const role = `571743750049497089`;
                    if (!interaction.member.roles.cache.has(role)) {
                        const embed = new EmbedBuilder()
                            .setAuthor({
                                name: `❗ Отсутствует необходимая роль!`
                            })
                            .setDescription(`У вас нет эмоции \`${interaction.guild.roles.cache.get(role).name}\`!`)
                            .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                            .setColor(`DarkRed`)
                            .setTimestamp(Date.now())

                        interaction.reply({
                            embeds: [embed],
                            ephemeral: true
                        })

                    } else {
                        if (!interaction.options.getUser(`пользователь`)) {
                            interaction.reply(`${interaction.member} (￣^￣)ゞ`)
                        } else {
                            interaction.reply(`${interaction.member} (￣^￣)ゞ ${interaction.options.getUser(`пользователь`)}`)
                        }
                    }
                };
                    break;

                case `get up`: {
                    const role = `571745411929341962`;
                    if (!interaction.member.roles.cache.has(role)) {
                        const embed = new EmbedBuilder()
                            .setAuthor({
                                name: `❗ Отсутствует необходимая роль!`
                            })
                            .setDescription(`У вас нет эмоции \`${interaction.guild.roles.cache.get(role).name}\`!`)
                            .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                            .setColor(`DarkRed`)
                            .setTimestamp(Date.now())

                        interaction.reply({
                            embeds: [embed],
                            ephemeral: true
                        })

                    } else {
                        if (!interaction.options.getUser(`пользователь`)) {
                            interaction.reply(`${interaction.member} ٩(ˊ〇ˋ*)و`)
                        } else {
                            interaction.reply(`${interaction.member} ٩(ˊ〇ˋ*)و ${interaction.options.getUser(`пользователь`)}`)
                        }
                    }
                };
                    break;

                case `sleep`: {
                    const role = `571744516894228481`;
                    if (!interaction.member.roles.cache.has(role)) {
                        const embed = new EmbedBuilder()
                            .setAuthor({
                                name: `❗ Отсутствует необходимая роль!`
                            })
                            .setDescription(`У вас нет эмоции \`${interaction.guild.roles.cache.get(role).name}\`!`)
                            .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                            .setColor(`DarkRed`)
                            .setTimestamp(Date.now())

                        interaction.reply({
                            embeds: [embed],
                            ephemeral: true
                        })

                    } else {
                        if (!interaction.options.getUser(`пользователь`)) {
                            interaction.reply(`${interaction.member} (￣ρ￣)..zzZZ`)
                        } else {
                            interaction.reply(`${interaction.member} (￣ρ￣)..zzZZ ${interaction.options.getUser(`пользователь`)}`)
                        }
                    }
                };
                    break;

                case `hey`: {
                    const role = `571757459732168704`;
                    if (!interaction.member.roles.cache.has(role)) {
                        const embed = new EmbedBuilder()
                            .setAuthor({
                                name: `❗ Отсутствует необходимая роль!`
                            })
                            .setDescription(`У вас нет эмоции \`${interaction.guild.roles.cache.get(role).name}\`!`)
                            .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                            .setColor(`DarkRed`)
                            .setTimestamp(Date.now())

                        interaction.reply({
                            embeds: [embed],
                            ephemeral: true
                        })

                    } else {
                        if (!interaction.options.getUser(`пользователь`)) {
                            interaction.reply(`${interaction.member} (´• ω •)ﾉ`)
                        } else {
                            interaction.reply(`${interaction.member} (´• ω •)ﾉ ${interaction.options.getUser(`пользователь`)}`)
                        }
                    }
                };
                    break;

                case `hmm`: {
                    const role = `571757461380399106`;
                    if (!interaction.member.roles.cache.has(role)) {
                        const embed = new EmbedBuilder()
                            .setAuthor({
                                name: `❗ Отсутствует необходимая роль!`
                            })
                            .setDescription(`У вас нет эмоции \`${interaction.guild.roles.cache.get(role).name}\`!`)
                            .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                            .setColor(`DarkRed`)
                            .setTimestamp(Date.now())

                        interaction.reply({
                            embeds: [embed],
                            ephemeral: true
                        })

                    } else {
                        if (!interaction.options.getUser(`пользователь`)) {
                            interaction.reply(`${interaction.member} (・・ ) ?`)
                        } else {
                            interaction.reply(`${interaction.member} (・・ ) ? ${interaction.options.getUser(`пользователь`)}`)
                        }
                    }
                };
                    break;

                case `love`: {
                    const role = `571757462219128832`;
                    if (!interaction.member.roles.cache.has(role)) {
                        const embed = new EmbedBuilder()
                            .setAuthor({
                                name: `❗ Отсутствует необходимая роль!`
                            })
                            .setDescription(`У вас нет эмоции \`${interaction.guild.roles.cache.get(role).name}\`!`)
                            .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                            .setColor(`DarkRed`)
                            .setTimestamp(Date.now())

                        interaction.reply({
                            embeds: [embed],
                            ephemeral: true
                        })

                    } else {
                        if (!interaction.options.getUser(`пользователь`)) {
                            interaction.reply(`${interaction.member} (ღ˘⌣˘ღ)`)
                        } else {
                            interaction.reply(`${interaction.member} (ღ˘⌣˘ღ) ${interaction.options.getUser(`пользователь`)}`)
                        }
                    }
                };
                    break;

                case `happy`: {
                    const role = `571757463876141077`;
                    if (!interaction.member.roles.cache.has(role)) {
                        const embed = new EmbedBuilder()
                            .setAuthor({
                                name: `❗ Отсутствует необходимая роль!`
                            })
                            .setDescription(`У вас нет эмоции \`${interaction.guild.roles.cache.get(role).name}\`!`)
                            .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                            .setColor(`DarkRed`)
                            .setTimestamp(Date.now())

                        interaction.reply({
                            embeds: [embed],
                            ephemeral: true
                        })

                    } else {
                        if (!interaction.options.getUser(`пользователь`)) {
                            interaction.reply(`${interaction.member} (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧`)
                        } else {
                            interaction.reply(`${interaction.member} (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ ${interaction.options.getUser(`пользователь`)}`)
                        }
                    }
                };
                    break;

                case `money`: {
                    const role = `642810527579373588`;
                    if (!interaction.member.roles.cache.has(role)) {
                        const embed = new EmbedBuilder()
                            .setAuthor({
                                name: `❗ Отсутствует необходимая роль!`
                            })
                            .setDescription(`У вас нет эмоции \`${interaction.guild.roles.cache.get(role).name}\`!`)
                            .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                            .setColor(`DarkRed`)
                            .setTimestamp(Date.now())

                        interaction.reply({
                            embeds: [embed],
                            ephemeral: true
                        })

                    } else {
                        if (!interaction.options.getUser(`пользователь`)) {
                            interaction.reply(`${interaction.member}  [̲̅$̲̅(̲̅ ͡° ͜ʖ ͡°̲̅)̲̅$̲̅]`)
                        } else {
                            interaction.reply(`${interaction.member}  [̲̅$̲̅(̲̅ ͡° ͜ʖ ͡°̲̅)̲̅$̲̅] ${interaction.options.getUser(`пользователь`)}`)
                        }
                    }
                };
                    break;

                case `music`: {
                    const role = `642393088689700893`;
                    if (!interaction.member.roles.cache.has(role)) {
                        const embed = new EmbedBuilder()
                            .setAuthor({
                                name: `❗ Отсутствует необходимая роль!`
                            })
                            .setDescription(`У вас нет эмоции \`${interaction.guild.roles.cache.get(role).name}\`!`)
                            .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                            .setColor(`DarkRed`)
                            .setTimestamp(Date.now())

                        interaction.reply({
                            embeds: [embed],
                            ephemeral: true
                        })

                    } else {
                        if (!interaction.options.getUser(`пользователь`)) {
                            interaction.reply(`${interaction.member} (￣▽￣)/♫•*¨*•.¸¸♪`)
                        } else {
                            interaction.reply(`${interaction.member} (￣▽￣)/♫•*¨*•.¸¸♪ ${interaction.options.getUser(`пользователь`)}`)
                        }
                    }
                };
                    break;

                case `spider`: {
                    const role = `636561006721761301`;
                    if (!interaction.member.roles.cache.has(role)) {
                        const embed = new EmbedBuilder()
                            .setAuthor({
                                name: `❗ Отсутствует необходимая роль!`
                            })
                            .setDescription(`У вас нет эмоции \`${interaction.guild.roles.cache.get(role).name}\`!`)
                            .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                            .setColor(`DarkRed`)
                            .setTimestamp(Date.now())

                        interaction.reply({
                            embeds: [embed],
                            ephemeral: true
                        })

                    } else {
                        if (!interaction.options.getUser(`пользователь`)) {
                            interaction.reply(`${interaction.member} /╲/\╭[☉﹏☉]╮/\╱\ `)
                        } else {
                            interaction.reply(`${interaction.member} /╲/\╭[☉﹏☉]╮/\╱\ ${interaction.options.getUser(`пользователь`)}`)
                        }
                    }
                };
                    break;

                case `pls`: {
                    const role = `607495941490212885`;
                    if (!interaction.member.roles.cache.has(role)) {
                        const embed = new EmbedBuilder()
                            .setAuthor({
                                name: `❗ Отсутствует необходимая роль!`
                            })
                            .setDescription(`У вас нет эмоции \`${interaction.guild.roles.cache.get(role).name}\`!`)
                            .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                            .setColor(`DarkRed`)
                            .setTimestamp(Date.now())

                        interaction.reply({
                            embeds: [embed],
                            ephemeral: true
                        })

                    } else {
                        if (!interaction.options.getUser(`пользователь`)) {
                            const choice = [
                                `(ʘ‿ʘ)
${interaction.member} вызывает дурку.`,
                                `˙ ͜ʟ˙

help ${interaction.member} pls`,
                                `ಥ_ಥ
Депрессия началась у ${interaction.member} из-за чата.`,
                                `◉_◉
${interaction.member} не понимает, что происходит...`]
                            const rand = choice[Math.floor(Math.random() * choice.length)]
                            interaction.reply(`${rand}`)
                        } else {
                            const choice = [
                                `(ʘ‿ʘ)
${interaction.member} вызывает дурку ${interaction.options.getUser(`пользователь`)}.`,
                                `˙ ͜ʟ˙

help ${interaction.member} and ${interaction.options.getUser(`пользователь`)} pls`,
                                `ಥ_ಥ
Депрессия началась у ${interaction.member} из-за ${interaction.options.getUser(`пользователь`)}.`,
                                `◉_◉
${interaction.member} не понимает, что происходит с ${interaction.options.getUser(`пользователь`)}...`]
                            const rand = choice[Math.floor(Math.random() * choice.length)]
                            interaction.reply(`${rand}`)
                        }
                    }
                };
                    break;

                case `party`: {
                    const role = `694221126494060604`;
                    if (!interaction.member.roles.cache.has(role)) {
                        const embed = new EmbedBuilder()
                            .setAuthor({
                                name: `❗ Отсутствует необходимая роль!`
                            })
                            .setDescription(`У вас нет эмоции \`${interaction.guild.roles.cache.get(role).name}\`!`)
                            .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                            .setColor(`DarkRed`)
                            .setTimestamp(Date.now())

                        interaction.reply({
                            embeds: [embed],
                            ephemeral: true
                        })

                    } else {
                        if (!interaction.options.getUser(`пользователь`)) {
                            const choice = [
                                `༼ つ ◕_◕ ༽つ 
Иди тусоваться с ${interaction.member} или бан.`,
                                `༼ つ ಥ_ಥ ༽つ 
Неужели есть такие, кто не хочет тусить с ${interaction.member}?`,
                                `＼(￣▽￣)／
Время тусить с ${interaction.member}!`,
                                `＼(＾▽＾)／
Зажигаем с ${interaction.member}!`]
                            const rand = choice[Math.floor(Math.random() * choice.length)]
                            interaction.reply(`${rand}`)
                        } else {
                            const choice = [
                                `༼ つ ◕_◕ ༽つ 
${interaction.options.getUser(`пользователь`)}, иди тусоваться с ${interaction.member} или бан.`,
                                `༼ つ ಥ_ಥ ༽つ 
Неужели есть такие, кто не хочет тусить с ${interaction.member} и ${interaction.options.getUser(`пользователь`)}?`,
                                `＼(￣▽￣)／
Время тусить с ${interaction.member} и ${interaction.options.getUser(`пользователь`)}!`,
                                `＼(＾▽＾)／
Зажигаем с ${interaction.member} и ${interaction.options.getUser(`пользователь`)}!`]
                            const rand = choice[Math.floor(Math.random() * choice.length)]
                            interaction.reply(`${rand}`)
                        }
                    }
                };
                    break;

                case `cool`: {
                    const role = `740241984190545971`;
                    if (!interaction.member.roles.cache.has(role)) {
                        const embed = new EmbedBuilder()
                            .setAuthor({
                                name: `❗ Отсутствует необходимая роль!`
                            })
                            .setDescription(`У вас нет эмоции \`${interaction.guild.roles.cache.get(role).name}\`!`)
                            .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                            .setColor(`DarkRed`)
                            .setTimestamp(Date.now())

                        interaction.reply({
                            embeds: [embed],
                            ephemeral: true
                        })

                    } else {
                        if (!interaction.options.getUser(`пользователь`)) {
                            const choice = [
                                `̿̿ ̿̿ ̿̿ ̿'̿'\̵͇̿̿\з= ( ▀ ͜͞ʖ▀) =ε/̵͇̿̿/’̿’̿ ̿ ̿̿ ̿̿ ̿̿ Не стоит шутить с ${interaction.member}...`,
                                `(▀̿Ĺ̯▀̿ ̿) ${interaction.member} из Starpixel. Он крут.`,
                                `ᕦ(ò_óˇ)ᕤ Страшно? Бойся ${interaction.member}!`,
                                `ヾ(⌐■_■)ノ♪ Едем, едем в соседнее село вместе с ${interaction.member}!`]
                            const rand = choice[Math.floor(Math.random() * choice.length)]
                            interaction.reply(`${rand}`)
                        } else {
                            const choice = [
                                `̿̿ ̿̿ ̿̿ ̿'̿'\̵͇̿̿\з= ( ▀ ͜͞ʖ▀) =ε/̵͇̿̿/’̿’̿ ̿ ̿̿ ̿̿ ̿̿ Не стоит шутить с ${interaction.member} и с ${interaction.options.getUser(`пользователь`)}...`,
                                `(▀̿Ĺ̯▀̿ ̿) ${interaction.member} и ${interaction.options.getUser(`пользователь`)} из Starpixel. Они круты.`,
                                `ᕦ(ò_óˇ)ᕤ Страшно? Бойся ${interaction.member} и ${interaction.options.getUser(`пользователь`)}!`,
                                `ヾ(⌐■_■)ノ♪ Едем, едем в соседнее село вместе с ${interaction.member} и ${interaction.options.getUser(`пользователь`)}!`]
                            const rand = choice[Math.floor(Math.random() * choice.length)]
                            interaction.reply(`${rand}`)
                        }
                    }
                };
                    break;





                default: {
                    await interaction.reply({
                        content: `Данной опции не существует! Выберите одну из предложенных!`,
                        ephemeral: true
                    })
                }
                    break;
            }
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
**Команда**: \`${interaction.commandName}\`
**Пользователь**: ${interaction.member}
**Канал**: ${interaction.channel}
**Опции**: \`\`\`json
${interaction.options.data.length <= 0 ? `{"status": false}` : options.join(`,\n`)}
\`\`\``)
            await admin.send(`◾`)
        }

    }

}