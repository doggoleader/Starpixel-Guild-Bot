const { SlashCommandBuilder } = require('discord.js');

const { Temp } = require(`../../schemas/temp_items`)
const chalk = require(`chalk`);
const { User } = require('../../schemas/userdata');
const linksInfo = require(`../../discord structure/links.json`)

async function autoComplete(interaction, client) {

    const focusedValue = interaction.options.getFocused();
    const choices = ['Чёрный', 'Лазурный', 'Пурпурный', 'Сиреневый', 'Ализариновый', 'Фламинговый', 'Изумрудный', 'Яблочный', 'Салатовый', 'Песочный', 'Летний', 'Хэллоуинский', 'Новогодний', 'Пасхальный'];
    const filtered = choices.filter(choice => choice.toLowerCase().includes(focusedValue.toLowerCase()));
    await interaction.respond(
        filtered.map(choice => ({ name: choice, value: choice })),
    );

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
        const { roles } = interaction.member //Участник команды
        const { member, user, guild } = interaction
        const userData = await User.findOne({ userid: interaction.user.id, guildid: interaction.guild.id })
        const r1 = `595893144055316490`; //Чёрный
        const r2 = `595892599693246474`; //Лазурный
        const r3 = `595892677451710468`; //Пурпурный
        const r4 = `595892238370996235`; //Сиреневый
        const r5 = `589770984391966760`; //Фламинговый
        const r6 = `595893568485326862`; //Изумрудный 
        const r7 = `630395361508458516`; //Яблочный
        const r8 = `595892930204401665`; //Салатовый
        const r9 = `595889341058777088`; //Песочный
        const r10 = `1024741633947873401`; //Ализариновый
        const r11 = `1030760792359960607`; //Летний
        const r12 = `1030760791722434620`; //Хэллоуинский
        const r13 = `1030760793991565422`; //Новогодний
        const r14 = `1030760793672785991`; //Пасхальный
        switch (interaction.options.getSubcommandGroup()) {
            case `custom`: {
                if (userData.rank_number < 7) return interaction.reply({
                    content: `Вы не можете использовать эту команду, так как ваш ранг ниже Владыки!`,
                    ephemeral: true
                })

                switch (interaction.options.getSubcommand()) {
                    case `create`: {
                        if (userData.custom_color.created === true) return interaction.reply({
                            content: `У вас уже имеется собственный цвет! Используйте команду </colors custom change:1055546254609879099>, чтобы изменить код вашего цвета!`,
                            ephemeral: true
                        })
                        if (userData.rumbik < 200) return interaction.reply({
                            content: `Вы не можете создать собственный цвет, так как на вашем балансе меньше 200 румбиков!`,
                            ephemeral: true
                        })
                        let hex = interaction.options.getString(`код`)
                        if (!hex.startsWith(`#`)) hex = `#${interaction.options.getString(`код`)}`
                        var test = /^#[0-9A-F]{6}$/i.test(hex)
                        if (test == false) return interaction.reply({
                            content: `Введённый вами код не является цветовым кодом hex!`,
                            ephemeral: true
                        })
                        const exampleRole = await interaction.guild.roles.fetch(`563793535250464809`)
                        const position = exampleRole.position - 3
                        const role = await guild.roles.create({
                            name: `ᅠᅠᅠЛИЧНЫЙ ЦВЕТ`,
                            color: hex,
                            position: position
                        })
                        userData.rumbik -= 200
                        userData.custom_color.created = true
                        userData.custom_color.hex = hex
                        userData.custom_color.role = role.id
                        userData.save()

                        await member.roles.add(role.id)
                        await interaction.reply({
                            content: `Вы приобрели свой собственный цвет! ${role}`
                        })
                    }
                        break;
                    case `change`: {
                        if (userData.custom_color.created === false) return interaction.reply({
                            content: `У вас нет собственного цвета! Используйте команду </colors custom create:1055546254609879099>, чтобы приобрести его!`,
                            ephemeral: true
                        })

                        const role = await guild.roles.fetch(userData.custom_color.role)
                        let hex = interaction.options.getString(`код`)
                        if (!hex.startsWith(`#`)) hex = `#${interaction.options.getString(`код`)}`
                        var test = /^#[0-9A-F]{6}$/i.test(hex)
                        if (test == false) return interaction.reply({
                            content: `Введённый вами код не является цветовым кодом hex!`,
                            ephemeral: true
                        })
                        await role.setColor(hex)
                        userData.custom_color.hex = hex
                        userData.save()

                        await interaction.reply({
                            content: `Вы изменили цветовой код вашего цвета! ${role}`,
                            ephemeral: true
                        })
                    }
                        break;
                    case `rename`: {
                        if (userData.custom_color.created === false) return interaction.reply({
                            content: `У вас нет собственного цвета! Используйте команду </colors custom create:1055546254609879099>, чтобы приобрести его!`,
                            ephemeral: true
                        })
                        const role = await guild.roles.fetch(userData.custom_color.role)
                        let name = interaction.options.getString(`имя`).toUpperCase()
                        await role.setName(`ᅠᅠᅠЛР ➖ ${name}`)
                        userData.custom_color.custom_name = name
                        userData.save()

                        await interaction.reply({
                            content: `Вы изменили цветовой код вашего цвета! ${role}`,
                            ephemeral: true
                        })
                    }
                        break;
                    case `set`: {
                        if (userData.custom_color.created === false) return interaction.reply({
                            content: `У вас нет собственного цвета! Используйте команду </colors custom create:1055546254609879099>, чтобы приобрести его!`,
                            ephemeral: true
                        })
                        if (member.roles.cache.has(userData.custom_color.role)) return interaction.reply({
                            content: `У вас уже установлен собственный цвет!`,
                            ephemeral: true
                        })
                        await member.roles.add(userData.custom_color.role)
                        await interaction.reply({
                            content: `Вы установили свой цвет!`,
                            ephemeral: true
                        })

                    }
                        break;
                    case `reset`: {
                        if (userData.custom_color.created === false) return interaction.reply({
                            content: `У вас нет собственного цвета! Используйте команду </colors custom create:1055546254609879099>, чтобы приобрести его!`,
                            ephemeral: true
                        })
                        if (!member.roles.cache.has(userData.custom_color.role)) return interaction.reply({
                            content: `У вас не установлен собственный цвет!`,
                            ephemeral: true
                        })
                        await member.roles.remove(userData.custom_color.role)
                        await interaction.reply({
                            content: `Вы убрали свой цвет!`,
                            ephemeral: true
                        })


                    }
                        break;

                    default:
                        break;
                }
            }
                break;

            default:
                break;
        }
        if (interaction.options.getSubcommandGroup()) return
        switch (interaction.options.getSubcommand()) {
            case `set`: {


                switch (interaction.options.getString(`цвет`)) {
                    case `Чёрный`: {
                        if (userData.sub_type < 3 && userData.rank_number < 6) return interaction.reply({
                            content: `У вас нет подписки III уровня или ранга "Легенда", чтобы использовать данную команду!`,
                            ephemeral: true
                        })
                        const role = await interaction.guild.roles
                            .fetch(r1) //ID цвета
                            .catch(console.error);
                        if (roles.cache.has(r1)) return interaction.reply({
                            content: `У вас уже есть ${interaction.options.getString(`цвет`)} цвет!`,
                            ephemeral: true
                        });
                        interaction.reply({
                            content: `Вы выбрали ${interaction.options.getString(`цвет`)} цвет!`,
                            ephemeral: true
                        })
                        await roles.remove([r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, r14]).catch(console.error)
                        await roles.add(role).catch(console.error)
                    }

                        break;
                    case `Лазурный`: {
                        if (userData.sub_type < 3 && userData.rank_number < 6) return interaction.reply({
                            content: `У вас нет подписки III уровня или ранга "Легенда", чтобы использовать данную команду!`,
                            ephemeral: true
                        })
                        const role = await interaction.guild.roles
                            .fetch(r2) //ID цвета
                            .catch(console.error);
                        if (roles.cache.has(r2)) return interaction.reply({
                            content: `У вас уже есть ${interaction.options.getString(`цвет`)} цвет!`,
                            ephemeral: true
                        });
                        interaction.reply({
                            content: `Вы выбрали ${interaction.options.getString(`цвет`)} цвет!`,
                            ephemeral: true
                        })
                        await roles.remove([r1, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, r14]).catch(console.error)
                        await roles.add(role).catch(console.error)
                    }

                        break;
                    case `Пурпурный`: {
                        if (userData.sub_type < 3 && userData.rank_number < 6) return interaction.reply({
                            content: `У вас нет подписки III уровня или ранга "Легенда", чтобы использовать данную команду!`,
                            ephemeral: true
                        })
                        const role = await interaction.guild.roles
                            .fetch(r3) //ID цвета
                            .catch(console.error);
                        if (roles.cache.has(r3)) return interaction.reply({
                            content: `У вас уже есть ${interaction.options.getString(`цвет`)} цвет!`,
                            ephemeral: true
                        });
                        interaction.reply({
                            content: `Вы выбрали ${interaction.options.getString(`цвет`)} цвет!`,
                            ephemeral: true
                        })
                        await roles.remove([r2, r1, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, r14]).catch(console.error)
                        await roles.add(role).catch(console.error)
                    }

                        break;
                    case `Сиреневый`: {
                        if (userData.sub_type < 3 && userData.rank_number < 6) return interaction.reply({
                            content: `У вас нет подписки III уровня или ранга "Легенда", чтобы использовать данную команду!`,
                            ephemeral: true
                        })
                        const role = await interaction.guild.roles
                            .fetch(r4) //ID цвета
                            .catch(console.error);
                        if (roles.cache.has(r4)) return interaction.reply({
                            content: `У вас уже есть ${interaction.options.getString(`цвет`)} цвет!`,
                            ephemeral: true
                        });
                        interaction.reply({
                            content: `Вы выбрали ${interaction.options.getString(`цвет`)} цвет!`,
                            ephemeral: true
                        })
                        await roles.remove([r2, r3, r1, r5, r6, r7, r8, r9, r10, r11, r12, r13, r14]).catch(console.error)
                        await roles.add(role).catch(console.error)
                    }

                        break;
                    case `Фламинговый`: {
                        if (userData.sub_type < 3 && userData.rank_number < 6) return interaction.reply({
                            content: `У вас нет подписки III уровня или ранга "Легенда", чтобы использовать данную команду!`,
                            ephemeral: true
                        })
                        const role = await interaction.guild.roles
                            .fetch(r5) //ID цвета
                            .catch(console.error);
                        if (roles.cache.has(r5)) return interaction.reply({
                            content: `У вас уже есть ${interaction.options.getString(`цвет`)} цвет!`,
                            ephemeral: true
                        });
                        interaction.reply({
                            content: `Вы выбрали ${interaction.options.getString(`цвет`)} цвет!`,
                            ephemeral: true
                        })
                        await roles.remove([r2, r3, r4, r1, r6, r7, r8, r9, r10, r11, r12, r13, r14]).catch(console.error)
                        await roles.add(role).catch(console.error)
                    }

                        break;
                    case `Изумрудный`: {
                        if (userData.sub_type < 3 && userData.rank_number < 6) return interaction.reply({
                            content: `У вас нет подписки III уровня или ранга "Легенда", чтобы использовать данную команду!`,
                            ephemeral: true
                        })
                        const role = await interaction.guild.roles
                            .fetch(r6) //ID цвета
                            .catch(console.error);
                        if (roles.cache.has(r6)) return interaction.reply({
                            content: `У вас уже есть ${interaction.options.getString(`цвет`)} цвет!`,
                            ephemeral: true
                        });
                        interaction.reply({
                            content: `Вы выбрали ${interaction.options.getString(`цвет`)} цвет!`,
                            ephemeral: true
                        })
                        await roles.remove([r2, r3, r4, r5, r1, r7, r8, r9, r10, r11, r12, r13, r14]).catch(console.error)
                        await roles.add(role).catch(console.error)
                    }

                        break;
                    case `Яблочный`: {
                        if (userData.sub_type < 3 && userData.rank_number < 6) return interaction.reply({
                            content: `У вас нет подписки III уровня или ранга "Легенда", чтобы использовать данную команду!`,
                            ephemeral: true
                        })
                        const role = await interaction.guild.roles
                            .fetch(r7) //ID цвета
                            .catch(console.error);
                        if (roles.cache.has(r7)) return interaction.reply({
                            content: `У вас уже есть ${interaction.options.getString(`цвет`)} цвет!`,
                            ephemeral: true
                        });
                        interaction.reply({
                            content: `Вы выбрали ${interaction.options.getString(`цвет`)} цвет!`,
                            ephemeral: true
                        })
                        await roles.remove([r2, r3, r4, r5, r6, r1, r8, r9, r10, r11, r12, r13, r14]).catch(console.error)
                        await roles.add(role).catch(console.error)
                    }

                        break;
                    case `Салатовый`: {
                        if (userData.sub_type < 3 && userData.rank_number < 6) return interaction.reply({
                            content: `У вас нет подписки III уровня или ранга "Легенда", чтобы использовать данную команду!`,
                            ephemeral: true
                        })
                        const role = await interaction.guild.roles
                            .fetch(r8) //ID цвета
                            .catch(console.error);
                        if (roles.cache.has(r8)) return interaction.reply({
                            content: `У вас уже есть ${interaction.options.getString(`цвет`)} цвет!`,
                            ephemeral: true
                        });
                        interaction.reply({
                            content: `Вы выбрали ${interaction.options.getString(`цвет`)} цвет!`,
                            ephemeral: true
                        })
                        await roles.remove([r2, r3, r4, r5, r6, r7, r1, r9, r10, r11, r12, r13, r14]).catch(console.error)
                        await roles.add(role).catch(console.error)
                    }

                        break;
                    case `Песочный`: {
                        if (userData.sub_type < 3 && userData.rank_number < 6) return interaction.reply({
                            content: `У вас нет подписки III уровня или ранга "Легенда", чтобы использовать данную команду!`,
                            ephemeral: true
                        })
                        const role = await interaction.guild.roles
                            .fetch(r9) //ID цвета
                            .catch(console.error);
                        if (roles.cache.has(r9)) return interaction.reply({
                            content: `У вас уже есть ${interaction.options.getString(`цвет`)} цвет!`,
                            ephemeral: true
                        });
                        interaction.reply({
                            content: `Вы выбрали ${interaction.options.getString(`цвет`)} цвет!`,
                            ephemeral: true
                        })
                        await roles.remove([r2, r3, r4, r5, r6, r7, r8, r1, r10, r11, r12, r13, r14]).catch(console.error)
                        await roles.add(role).catch(console.error)
                    }

                        break;

                    case `Ализариновый`: {
                        if (userData.sub_type < 3 && userData.rank_number < 6) return interaction.reply({
                            content: `У вас нет подписки III уровня или ранга "Легенда", чтобы использовать данную команду!`,
                            ephemeral: true
                        })
                        const role = await interaction.guild.roles
                            .fetch(r10) //ID цвета
                            .catch(console.error);
                        if (roles.cache.has(r10)) return interaction.reply({
                            content: `У вас уже есть ${interaction.options.getString(`цвет`)} цвет!`,
                            ephemeral: true
                        });
                        interaction.reply({
                            content: `Вы выбрали ${interaction.options.getString(`цвет`)} цвет!`,
                            ephemeral: true
                        })
                        await roles.remove([r2, r3, r4, r5, r6, r7, r8, r1, r9, r11, r12, r13, r14]).catch(console.error)
                        await roles.add(role).catch(console.error)
                    }
                        break;
                    case `Летний`: {
                        if (!member.roles.cache.has(`1030757074839277608`)) return interaction.reply({
                            content: `У вас нет сезонной роли, чтобы использовать данную команду!`,
                            ephemeral: true
                        })
                        const role = await interaction.guild.roles
                            .fetch(r11) //ID цвета
                            .catch(console.error);
                        if (roles.cache.has(r11)) return interaction.reply({
                            content: `У вас уже есть ${interaction.options.getString(`цвет`)} цвет!`,
                            ephemeral: true
                        });
                        interaction.reply({
                            content: `Вы выбрали ${interaction.options.getString(`цвет`)} цвет!`,
                            ephemeral: true
                        })
                        await roles.remove([r2, r3, r4, r5, r6, r7, r8, r1, r9, r10, r12, r13, r14]).catch(console.error)
                        await roles.add(role).catch(console.error)
                    }
                        break;
                    case `Хэллоуинский`: {
                        if (!member.roles.cache.has(`1030757644320915556`)) return interaction.reply({
                            content: `У вас нет сезонной роли, чтобы использовать данную команду!`,
                            ephemeral: true
                        })
                        const role = await interaction.guild.roles
                            .fetch(r12) //ID цвета
                            .catch(console.error);
                        if (roles.cache.has(r12)) return interaction.reply({
                            content: `У вас уже есть ${interaction.options.getString(`цвет`)} цвет!`,
                            ephemeral: true
                        });
                        interaction.reply({
                            content: `Вы выбрали ${interaction.options.getString(`цвет`)} цвет!`,
                            ephemeral: true
                        })
                        await roles.remove([r2, r3, r4, r5, r6, r7, r8, r1, r9, r11, r10, r13, r14]).catch(console.error)
                        await roles.add(role).catch(console.error)
                    }
                        break;
                    case `Новогодний`: {
                        if (!member.roles.cache.has(`1030757867373998190`)) return interaction.reply({
                            content: `У вас нет сезонной роли, чтобы использовать данную команду!`,
                            ephemeral: true
                        })
                        const role = await interaction.guild.roles
                            .fetch(r13) //ID цвета
                            .catch(console.error);
                        if (roles.cache.has(r13)) return interaction.reply({
                            content: `У вас уже есть ${interaction.options.getString(`цвет`)} цвет!`,
                            ephemeral: true
                        });
                        interaction.reply({
                            content: `Вы выбрали ${interaction.options.getString(`цвет`)} цвет!`,
                            ephemeral: true
                        })
                        await roles.remove([r2, r3, r4, r5, r6, r7, r8, r1, r9, r11, r12, r10, r14]).catch(console.error)
                        await roles.add(role).catch(console.error)
                    }
                        break;
                    case `Пасхальный`: {
                        if (!member.roles.cache.has(`1030757633231167538`)) return interaction.reply({
                            content: `У вас нет сезонной роли, чтобы использовать данную команду!`,
                            ephemeral: true
                        })
                        const role = await interaction.guild.roles
                            .fetch(r14) //ID цвета
                            .catch(console.error);
                        if (roles.cache.has(r14)) return interaction.reply({
                            content: `У вас уже есть ${interaction.options.getString(`цвет`)} цвет!`,
                            ephemeral: true
                        });
                        interaction.reply({
                            content: `Вы выбрали ${interaction.options.getString(`цвет`)} цвет!`,
                            ephemeral: true
                        })
                        await roles.remove([r2, r3, r4, r5, r6, r7, r8, r1, r9, r11, r12, r13, r10]).catch(console.error)
                        await roles.add(role).catch(console.error)
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

            case `reset`: {
                const tempData = await Temp.findOne({ userid: interaction.user.id, guildid: interaction.guild.id, color: true })
                if (tempData) {
                    tempData.delete()
                }
                await interaction.reply({
                    content: `Вы убрали свой цвет!`,
                    ephemeral: true
                })
                await roles.remove([r2, r3, r4, r5, r6, r7, r8, r1, r9, r10, r11, r12, r13, r14]).catch(console.error)
            }
            default:
                break;
        }
        console.log(chalk.blackBright(`[${new Date()}]`) + chalk.green(`[Использована команда]`) + chalk.gray(`: ${interaction.user.tag} использовал команду /colors ${interaction.options.getSubcommand()}`))

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
module.exports = {
    category: `set`,
    plugin: {
        id: "misc",
        name: "Разное"
    },
    data: new SlashCommandBuilder()
        .setName(`colors`)
        .setDescription(`Выбрать цвет вашего ника`)
        .setDMPermission(false)
        .addSubcommand(subcommand => subcommand
            .setName(`set`)
            .setDescription(`Установить цвет`)
            .addStringOption(option => option
                .setName(`цвет`)
                .setDescription(`Выберите цвет, который хотите поставить`)
                .setAutocomplete(true)
                .setRequired(true))
        )
        .addSubcommand(subcommand => subcommand
            .setName(`reset`)
            .setDescription(`Сбросить текущий цвет`)
        )
        .addSubcommandGroup(gr => gr
            .setName(`custom`)
            .setDescription(`Пользовательский цвет никнейма (Владыка+)`)
            .addSubcommand(sb => sb
                .setName(`create`)
                .setDescription(`Приобрести собственный цвет за 200 румбиков`)
                .addStringOption(o => o
                    .setName(`код`)
                    .setDescription(`Цветовой код вашего цвета в формате hex`)
                    .setRequired(true)
                    .setMaxLength(7)
                    .setMinLength(6)
                )
            )
            .addSubcommand(sb => sb
                .setName(`change`)
                .setDescription(`Изменить цветовой код личного цвета`)
                .addStringOption(o => o
                    .setName(`код`)
                    .setDescription(`Цветовой код вашего нового цвета в формате hex`)
                    .setRequired(true)
                    .setMaxLength(7)
                    .setMinLength(6)
                )
            )
            .addSubcommand(sb => sb
                .setName(`rename`)
                .setDescription(`Изменить имя роли личного цвета`)
                .addStringOption(o => o
                    .setName(`имя`)
                    .setDescription(`Новое имя роли вашего личного цвета`)
                    .setRequired(true)
                    .setMaxLength(16)
                    .setMinLength(2)
                )
            )
            .addSubcommand(sb => sb
                .setName(`set`)
                .setDescription(`Установить пользовательский цвет`)
            )
            .addSubcommand(sb => sb
                .setName(`reset`)
                .setDescription(`Убрать пользовательский цвет`)
            )
        ),
    autoComplete,
    execute,
};