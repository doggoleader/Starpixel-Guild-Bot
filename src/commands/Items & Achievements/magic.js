const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

const fetch = require(`node-fetch`);
const api = process.env.hypixel_apikey;
const { User } = require(`../../schemas/userdata`)
const { Guild } = require(`../../schemas/guilddata`)
const chalk = require(`chalk`);

async function autoComplete(interaction, client) {
    switch (interaction.options.getSubcommand()) {
        case `first`: {
            const focusedValue = interaction.options.getFocused();
            const choices = [
                'blow',
                'cold',
                'flame'
            ];
            const filtered = choices.filter(choice => choice.toLowerCase().includes(focusedValue.toLowerCase()));;
            await interaction.respond(
                filtered.map(choice => ({ name: choice, value: choice })),
            );
        }

            break;
        case `second`: {
            const focusedValue = interaction.options.getFocused();
            const choices = [
                'bat',
                'curse',
                'potion'
            ];
            const filtered = choices.filter(choice => choice.toLowerCase().includes(focusedValue.toLowerCase()));;
            await interaction.respond(
                filtered.map(choice => ({ name: choice, value: choice })),
            );
        }

            break;
        case `third`: {
            const focusedValue = interaction.options.getFocused();
            const choices = [
                'blood',
                'frog',
                'scare'
            ];
            const filtered = choices.filter(choice => choice.toLowerCase().includes(focusedValue.toLowerCase()));;
            await interaction.respond(
                filtered.map(choice => ({ name: choice, value: choice })),
            );
        }

            break;
        case `fourth`: {
            const focusedValue = interaction.options.getFocused();
            const choices = [
                'attack',
                'baby',
                'scan'
            ];
            const filtered = choices.filter(choice => choice.toLowerCase().includes(focusedValue.toLowerCase()));;
            await interaction.respond(
                filtered.map(choice => ({ name: choice, value: choice })),
            );
        }

            break;

        default: {
            await interaction.reply({
                content: `Данной опции не существует! Выберите одну из предложенных!`,
                ephemeral: true
            })
        }
            break;
    }

}
/**
 * 
 * @param {import("discord.js").ChatInputCommandInteraction} interaction Interaction
 * @param {import("../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {

        const user = interaction.options.getUser(`пользователь`)
        const member = interaction.member

        switch (interaction.options.getSubcommand()) {
            case `first`: {
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: `❗ Отсутствует необходимая роль!`
                    })
                    .setDescription(`Вы должны иметь ранг \`${interaction.guild.roles.cache.get(`553593734479216661`).name}\` или выше, чтобы использовать данную команду!`)
                    .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                    .setColor(`DarkRed`)
                    .setTimestamp(Date.now())



                if (!member.roles.cache.has(`553593734479216661`) && !member.roles.cache.has(`553593136895623208`) && !member.roles.cache.has(`553593133884112900`) && !member.roles.cache.has(`553593136027533313`) && !member.roles.cache.has(`553593976037310489`) && !member.roles.cache.has(`780487593485008946`) && !member.roles.cache.has(`849695880688173087`) && !member.roles.cache.has(`992122876394225814`) && !member.roles.cache.has(`992123014831419472`) && !member.roles.cache.has(`992123019793276961`)) return interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                })

                switch (interaction.options.getString(`заклинание`)) {
                    case `blow`: {
                        if (!user) {
                            await interaction.reply({
                                content: `${member} :magic_wand:   :dash:  :cloud_tornado:`
                            })
                        } else if (user) {
                            await interaction.reply({
                                content: `${member} :magic_wand:   :dash:  :cloud_tornado: ${user}`
                            })
                        }
                    }

                        break;
                    case `cold`: {
                        if (!user) {
                            await interaction.reply({
                                content: `${member} :magic_wand:   :dash:  :cold_face:`
                            })
                        } else if (user) {
                            await interaction.reply({
                                content: `${member} :magic_wand:   :dash:  :cold_face: ${user}`
                            })
                        }
                    }

                        break;
                    case `flame`: {
                        if (!user) {
                            await interaction.reply({
                                content: `${member} :magic_wand:   :dash:  :fire:`
                            })
                        } else if (user) {
                            await interaction.reply({
                                content: `${member} :magic_wand:   :dash:  :fire: ${user}`
                            })
                        }
                    }

                        break;

                    default: {
                        await interaction.reply({
                            content: `Данной опции не существует! Выберите одну из предложенных!`,
                            ephemeral: true
                        })
                    }
                        break;
                }
            }

                break;
            case `second`: {
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: `❗ Отсутствует необходимая роль!`
                    })
                    .setDescription(`Вы должны иметь ранг \`${interaction.guild.roles.cache.get(`553593136027533313`).name}\` или выше, чтобы использовать данную команду!`)
                    .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                    .setColor(`DarkRed`)
                    .setTimestamp(Date.now())



                if (!member.roles.cache.has(`553593136027533313`) && !member.roles.cache.has(`553593976037310489`) && !member.roles.cache.has(`780487593485008946`) && !member.roles.cache.has(`849695880688173087`) && !member.roles.cache.has(`992122876394225814`) && !member.roles.cache.has(`992123014831419472`) && !member.roles.cache.has(`992123019793276961`)) return interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                })

                switch (interaction.options.getString(`заклинание`)) {
                    case `bat`: {
                        if (!user) {
                            await interaction.reply({
                                content: `:bat: ${member} превращается в летучую мышь и покидает людей...`
                            })
                        } else if (user) {
                            await interaction.reply({
                                content: `:bat: ${member} превращается в летучую мышь и покидает ${user}...`
                            })
                        }
                    }

                        break;
                    case `curse`: {
                        if (!user) {
                            await interaction.reply({
                                content: `🈲 Проклятия... Они так ужасны... и поэтому ${member} накладывает на самого себя проклятие!`
                            })
                        } else if (user) {
                            await interaction.reply({
                                content: `🈲 Проклятия... Они так ужасны... и поэтому ${member} накладывает на ${user} проклятие!`
                            })
                        }
                    }

                        break;
                    case `potion`: {
                        if (!user) {
                            await interaction.reply({
                                content: `🍾 ${member} варит волшебное зелье... Скорее всего, скоро кто-то будет отравлен....`
                            })
                        } else if (user) {
                            await interaction.reply({
                                content: `🍾 ${member} варит волшебное зелье... Скорее всего, ${user} скоро будет отравлен....`
                            })
                        }
                    }

                        break;

                    default: {
                        await interaction.reply({
                            content: `Данной опции не существует! Выберите одну из предложенных!`,
                            ephemeral: true
                        })
                    }
                        break;
                }
            }

                break;
            case `third`: {
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: `❗ Отсутствует необходимая роль!`
                    })
                    .setDescription(`Вы должны иметь ранг \`${interaction.guild.roles.cache.get(`780487593485008946`).name}\` или выше, чтобы использовать данную команду!`)
                    .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                    .setColor(`DarkRed`)
                    .setTimestamp(Date.now())



                if (!member.roles.cache.has(`780487593485008946`) && !member.roles.cache.has(`849695880688173087`) && !member.roles.cache.has(`992122876394225814`) && !member.roles.cache.has(`992123014831419472`) && !member.roles.cache.has(`992123019793276961`)) return interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                })

                switch (interaction.options.getString(`заклинание`)) {
                    case `blood`: {
                        if (!user) {
                            await interaction.reply({
                                content: `🩸 ${member} высасывает из воздуха всю кровь! Становится жутко..`
                            })
                        } else if (user) {
                            await interaction.reply({
                                content: `🩸 ${member} высасывает из ${user} всю кровь! Становится жутко..`
                            })
                        }
                    }

                        break;
                    case `frog`: {
                        if (!user) {
                            await interaction.reply({
                                content: `:frog: ${member} превращается в лягушку... Какая жалость!`
                            })
                        } else if (user) {
                            await interaction.reply({
                                content: `:frog: ${member} превращает ${user} в лягушку... Какая жалость!`
                            })
                        }
                    }

                        break;
                    case `scare`: {
                        if (!user) {
                            await interaction.reply({
                                content: `👻 Перед кошкой становится темно, начинается гроза... Внезапно появляется ${member} и пугает кошечку.`
                            })
                        } else if (user) {
                            await interaction.reply({
                                content: `👻 Перед ${user} становится темно, начинается гроза... Внезапно появляется ${member} и пугает ${user}.`
                            })
                        }
                    }

                        break;

                    default: {
                        await interaction.reply({
                            content: `Данной опции не существует! Выберите одну из предложенных!`,
                            ephemeral: true
                        })
                    }
                        break;
                }
            }

                break;
            case `fourth`: {
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: `❗ Отсутствует необходимая роль!`
                    })
                    .setDescription(`Вы должны иметь ранг \`${interaction.guild.roles.cache.get(`930520087797051452`).name}\` или выше, чтобы использовать данную команду!`)
                    .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
                    .setColor(`DarkRed`)
                    .setTimestamp(Date.now())



                if (!member.roles.cache.has(`930520087797051452`)) return interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                })

                switch (interaction.options.getString(`заклинание`)) {
                    case `attack`: {
                        if (!user) {
                            await interaction.reply({
                                content: `◾

${member} атакует самого себя.
:left_facing_fist::robot::right_facing_fist:

◾`
                            })
                        } else if (user) {
                            await interaction.reply({
                                content: `◾

${member} атакует ${user}.
:left_facing_fist::robot::right_facing_fist:

◾`
                            })
                        }
                    }

                        break;
                    case `baby`: {
                        const choose = [`целует`, `укутывает`, `обнимает`, `смотрит на`]
                        let random = choose[Math.floor(Math.random() * choose.length)]
                        if (!user) {
                            await interaction.reply({
                                content: `◾

${member} ${random} самого себя.
:robot:  :heart: 

◾`
                            })
                        } else if (user) {
                            await interaction.reply({
                                content: `◾

${member} ${random} ${user}.
:robot:  :heart: 

◾`
                            })
                        }
                    }

                        break;
                    case `scan`: {
                        const choose = [`покушать`, `учиться`, `наблюдать за звёздами`, `поспать`, `поиграть`, `свою гильдию`, `участников гильдии`, `няню`, `себя`]
                        let random = choose[Math.floor(Math.random() * choose.length)]
                        if (!user) {
                            await interaction.reply({
                                content: `◾

${member} сканирует самого себя.
:robot: Он говорит, что этот он любит ${random}.

◾`
                            })
                        } else if (user) {
                            await interaction.reply({
                                content: `◾

${member} сканирует ${user}.
:robot: Он говорит, что этот человек любит ${random}.

◾`
                            })
                        }
                    }

                        break;

                    default: {
                        await interaction.reply({
                            content: `Данной опции не существует! Выберите одну из предложенных!`,
                            ephemeral: true
                        })
                    }
                        break;
                }
            }

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
        await admin.send({
            content: `-> \`\`\`${e.stack}\`\`\``
        }).catch()
    }


}
module.exports = {
    category: `mag`,
    plugin: {
        id: "misc",
        name: "Разное"
    },
    data: new SlashCommandBuilder()
        .setName(`magic`)
        .setDescription(`Магия гильдии`)
        .setDMPermission(false)
        .addSubcommand(subcommand => subcommand
            .setName(`first`)
            .setDescription(`Магия первого уровня`)
            .addStringOption(option => option
                .setName(`заклинание`)
                .setDescription(`Заклинания мага первого уровня`)
                .setAutocomplete(true)
                .setRequired(true)
            )
            .addUserOption(option => option
                .setName(`пользователь`)
                .setDescription(`Пользователь, на котором хотите применить заклинание`)
                .setRequired(false)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName(`second`)
            .setDescription(`Магия второго уровня`)
            .addStringOption(option => option
                .setName(`заклинание`)
                .setDescription(`Заклинания мага второго уровня`)
                .setAutocomplete(true)
                .setRequired(true)
            )
            .addUserOption(option => option
                .setName(`пользователь`)
                .setDescription(`Пользователь, на котором хотите применить заклинание`)
                .setRequired(false)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName(`third`)
            .setDescription(`Магия третьего уровня`)
            .addStringOption(option => option
                .setName(`заклинание`)
                .setDescription(`Заклинания мага третьего уровня`)
                .setAutocomplete(true)
                .setRequired(true)
            )
            .addUserOption(option => option
                .setName(`пользователь`)
                .setDescription(`Пользователь, на котором хотите применить заклинание`)
                .setRequired(false)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName(`fourth`)
            .setDescription(`Магия четвёртого уровня`)
            .addStringOption(option => option
                .setName(`заклинание`)
                .setDescription(`Заклинания мага четвёртого уровня`)
                .setAutocomplete(true)
                .setRequired(true)
            )
            .addUserOption(option => option
                .setName(`пользователь`)
                .setDescription(`Пользователь, на котором хотите применить заклинание`)
                .setRequired(false)
            )
        ),
    autoComplete,
    execute
};