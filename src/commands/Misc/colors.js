const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

const { Temp } = require(`../../../src/schemas/temp_items`)
const chalk = require(`chalk`);
const { User } = require('../../../src/schemas/userdata');

const { mentionCommand } = require('../../../src/functions');


/**
 * 
 * @param {import("discord.js").ChatInputCommandInteraction} interaction Interaction
 * @param {import("../../../src/misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        const { roles } = interaction.member //Участник команды
        const { member, user, guild } = interaction
        const userData = await User.findOne({ userid: interaction.user.id, guildid: interaction.guild.id })
        const r1 = {
            name: `Чёрный`,
            id: `595893144055316490`
        };
        const r2 = {
            name: `Лазурный`,
            id: `595892599693246474`
        };
        const r3 = {
            name: `Пурпурный`,
            id: `595892677451710468`
        };
        const r4 = {
            name: `Сиреневый`,
            id: `595892238370996235`
        };
        const r5 = {
            name: `Фламинговый`,
            id: `589770984391966760`
        };
        const r6 = {
            name: `Изумрудный`,
            id: `595893568485326862`
        };
        const r7 = {
            name: `Яблочный`,
            id: `630395361508458516`
        };
        const r8 = {
            name: `Салатовый`,
            id: `595892930204401665`
        };
        const r9 = {
            name: `Песочный`,
            id: `595889341058777088`
        };
        const r10 = {
            name: `Ализариновый`,
            id: `1024741633947873401`
        };
        const r11 = {
            name: `Летний`,
            id: `1030760792359960607`
        };
        const r12 = {
            name: `Хэллоуинский`,
            id: `1030760791722434620`
        };
        const r13 = {
            name: `Новогодний`,
            id: `1030760793991565422`
        };
        const r14 = {
            name: `Пасхальный`,
            id: `1030760793672785991`
        };
        const colorsObj = [r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, r14];
        const colors = [r1.id, r2.id, r3.id, r4.id, r5.id, r6.id, r7.id, r8.id, r9.id, r10.id, r11.id, r12.id, r13.id, r14.id]

        let options = []
        for (let color of colorsObj) {
            if (userData.cosmetics_storage.colors.includes(color.id) || userData.sub_type >= 4) {
                options.push({
                    label: color.name,
                    value: color.id
                })
            }
        }

        let menuNormal
        if (options.length > 0) {
            menuNormal = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('colors_normal_set')
                        .setPlaceholder(`Установить цвет`)
                        .setOptions(options)
                )
        } else {
            menuNormal = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('colors_normal_set')
                        .setPlaceholder(`Установить цвет`)
                        .setDisabled(true)
                        .setOptions([
                            {
                                label: "Цветов нет",
                                value: "no_colors"
                            }
                        ])
                )
        }
        const buttonCustom = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`colors_normal_takeoff`)
                    .setLabel(`Снять цвет`)
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji(`❌`)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`colors_switch_custom`)
                    .setLabel(`К пользовательскому цвету`)
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji(`➡`)
            )
        const buttonNormal = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`colors_switch_normal`)
                    .setLabel(`К стандартным цветам`)
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji(`⬅`)
            )
        const menuCustom = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('colors_custom_settings')
                    .setPlaceholder(`Настройки пользовательского цвета`)
                    .setOptions([
                        {
                            label: `Приобрести цвет`,
                            value: `buy`,
                            description: `Приобрести пользовательский цвет за 200 румбиков`
                        },
                        {
                            label: `Установить цвет`,
                            value: `set`,
                            description: `Устанавливает ваш пользовательский цвет`
                        },
                        {
                            label: `Снять цвет`,
                            value: `remove`,
                            description: `Снимает ваш пользовательский цвет`
                        },
                        {
                            label: `Изменить цвет`,
                            value: `set_color`,
                            description: `Изменить цвет пользовательского цвета`
                        },
                        {
                            label: `Изменить имя роли`,
                            value: `set_name`,
                            description: `Изменяет имя вашего пользовательского цвета`
                        }
                    ])
            )


        const embed = new EmbedBuilder()
            .setColor(Number(client.information.bot_color))
            .setDescription(`## Настройки цвета
**Текущее меню**: \`Стандартные цвета\`
В данном меню вы можете установить стандартные цвета гильдии. Найти их вы можете в коробках гильдии или, если у вас есть подписка VIP, сразу же установить их, используя меню ниже!

:arrow_right: **Чтобы перейти к настройкам пользовательского цвета, нажмите на кнопку ниже** :arrow_right:`)

        const msg = await interaction.reply({
            embeds: [embed],
            components: [menuNormal, buttonCustom],
            ephemeral: true,
            fetchReply: true
        })

        const collector = msg.createMessageComponentCollector();
        collector.on('collect', async (i) => {
            if (i.customId == 'colors_normal_set') {
                await i.deferReply({ fetchReply: true, ephemeral: true })
                await i.member.roles.remove(colors).catch();
                if (userData.custom_color.created) {
                    await i.member.roles.remove(userData.custom_color.role);
                }
                await i.member.roles.add(i.values[0])
                await interaction.editReply({
                    components: [menuNormal, buttonCustom]
                })
                await i.editReply({
                    content: `Вы успешно установили следующий цвет: <@&${i.values[0]}>!`
                })
            } else if (i.customId == `colors_normal_takeoff`) {
                await i.deferReply({ fetchReply: true, ephemeral: true })
                await i.member.roles.remove(colors).catch();
                if (userData.custom_color.created) {
                    await i.member.roles.remove(userData.custom_color.role);
                }

                await i.editReply({
                    content: `Вы успешно сняли все цвета!`
                })
            } else if (i.customId == 'colors_switch_custom') {
                if (userData.rank_number < 7) return i.reply({
                    content: `Вы не можете открыть это меню, так как не являетесь **Владыкой гильдии**!`,
                    ephemeral: true
                })
                await i.deferUpdate()

                embed.setDescription(`## Настройки цвета
**Текущее меню**: \`Пользовательский цвет\`
В данном меню вы можете настроить или приобрести пользовательский цвет.

:arrow_left: **Чтобы перейти к стандартным цветам, нажмите на кнопку ниже** :arrow_left:`)

                await interaction.editReply({
                    embeds: [embed],
                    components: [menuCustom, buttonNormal]
                })
            } else if (i.customId == 'colors_switch_normal') {
                await i.deferUpdate();

                embed.setDescription(`## Настройки цвета
**Текущее меню**: \`Стандартные цвета\`
В данном меню вы можете установить стандартные цвета гильдии. Найти их вы можете в коробках гильдии или, если у вас есть подписка VIP, сразу же установить их, используя меню ниже!

:arrow_right: **Чтобы перейти к настройкам пользовательского цвета, нажмите на кнопку ниже** :arrow_right:`)

                await interaction.editReply({
                    embeds: [embed],
                    components: [menuNormal, buttonCustom]
                })
            } else if (i.customId == 'colors_custom_settings') {
                await interaction.editReply({
                    components: [menuCustom, buttonNormal]
                })
                if (i.values[0] == 'buy') {
                    if (userData.custom_color.created === true) return i.reply({
                        content: `У вас уже имеется собственный цвет! Используйте команду ${mentionCommand(client, 'colors')}, чтобы изменить код вашего цвета!`,
                        ephemeral: true
                    })
                    if (userData.rumbik < 200) return i.reply({
                        content: `Вы не можете создать собственный цвет, так как на вашем балансе меньше 200 румбиков!`,
                        ephemeral: true
                    })
                    const modal = new ModalBuilder()
                        .setTitle(`Приобрести цвет`)
                        .setCustomId(`color_custom_buy`)
                        .addComponents(
                            new ActionRowBuilder()
                                .addComponents(
                                    new TextInputBuilder()
                                        .setCustomId(`color_custom_buy_color`)
                                        .setLabel(`Цветовой (hex) код цвета`)
                                        .setPlaceholder(`Например, #000fff`)
                                        .setMinLength(6)
                                        .setMaxLength(7)
                                        .setRequired(true)
                                        .setStyle(TextInputStyle.Short)
                                )
                        )
                        .addComponents(
                            new ActionRowBuilder()
                                .addComponents(
                                    new TextInputBuilder()
                                        .setCustomId(`color_custom_buy_name`)
                                        .setLabel(`Имя цвета`)
                                        .setPlaceholder(`Например, Мой цвет`)
                                        .setMinLength(4)
                                        .setMaxLength(16)
                                        .setRequired(false)
                                        .setStyle(TextInputStyle.Short)
                                )

                        )

                    await i.showModal(modal);
                    i.awaitModalSubmit({ time: 1000000000 })
                        .then(async (int) => {
                            let hex = int.fields.getTextInputValue(`color_custom_buy_color`)
                            if (!hex.startsWith(`#`)) hex = `#${int.fields.getTextInputValue(`color_custom_buy_color`)}`
                            var test = /^#[0-9A-F]{6}$/i.test(hex)
                            if (test == false) return int.reply({
                                content: `Введённый вами код не является цветовым кодом hex!`,
                                ephemeral: true
                            })
                            const exampleRole = await int.guild.roles.fetch(`563793535250464809`)
                            const position = exampleRole.position - 3
                            let name = int.fields?.getTextInputValue(`color_custom_buy_name`) ? `ᅠᅠᅠЛР ➖ ${int.fields?.getTextInputValue(`color_custom_buy_name`).toUpperCase()}` : `ᅠᅠᅠЛИЧНЫЙ ЦВЕТ`
                            const role = await int.guild.roles.create({
                                name: name,
                                color: hex,
                                position: position
                            })
                            userData.rumbik -= 200
                            userData.custom_color.created = true
                            userData.custom_color.hex = hex
                            userData.custom_color.custom_name = name;
                            userData.custom_color.role = role.id
                            userData.save()

                            await member.roles.add(role.id).catch()
                            await int.reply({
                                content: `Вы приобрели свой собственный цвет! ${role}`,
                                ephemeral: true
                            })
                        })
                        .catch(e => {

                        })



                } else if (i.values[0] == 'set') {
                    if (!userData.custom_color.created) return i.reply({
                        content: `Вы не приобрели свой пользовательский цвет!`,
                        ephemeral: true
                    })
                    await i.member.roles.remove(colors).catch()
                    await i.member.roles.add(userData.custom_color.role).catch();
                    await i.reply({
                        content: `Вы установили пользовательский цвет!`,
                        ephemeral: true
                    })
                } else if (i.values[0] == 'remove') {
                    if (!userData.custom_color.created) return i.reply({
                        content: `Вы не приобрели свой пользовательский цвет!`,
                        ephemeral: true
                    })
                    await i.member.roles.remove(userData.custom_color.role).catch();
                    await i.reply({
                        content: `Вы сняли пользовательский цвет!`,
                        ephemeral: true
                    })
                } else if (i.values[0] == 'set_color') {
                    if (!userData.custom_color.created) return i.reply({
                        content: `Вы не приобрели свой пользовательский цвет!`,
                        ephemeral: true
                    })


                    const modal = new ModalBuilder()
                        .setTitle(`Редактировать цвет`)
                        .setCustomId(`color_custom_edit`)
                        .addComponents(
                            new ActionRowBuilder()
                                .addComponents(
                                    new TextInputBuilder()
                                        .setCustomId(`color_custom_edit_color`)
                                        .setLabel(`Цветовой (hex) код цвета`)
                                        .setPlaceholder(`Например, #000fff`)
                                        .setMinLength(6)
                                        .setMaxLength(7)
                                        .setRequired(true)
                                        .setStyle(TextInputStyle.Short)
                                )
                        )

                    await i.showModal(modal);
                    i.awaitModalSubmit({ time: 1000000000 })
                        .then(async (int) => {
                            let hex = int.fields.getTextInputValue(`color_custom_edit_color`)
                            const role = await int.guild.roles.fetch(userData.custom_color.role)
                            if (!hex.startsWith(`#`)) hex = `#${int.fields.getTextInputValue(`color_custom_edit_color`)}`
                            var test = /^#[0-9A-F]{6}$/i.test(hex)
                            if (test == false) return int.reply({
                                content: `Введённый вами код не является цветовым кодом hex!`,
                                ephemeral: true
                            })
                            await role.setColor(hex)
                            userData.custom_color.hex = hex
                            userData.save()

                            await int.reply({
                                content: `Вы изменили цвет вашей роли! ${role}`,
                                ephemeral: true
                            })
                        })
                        .catch(e => {

                        })
                } else if (i.values[0] == 'set_name') {
                    if (!userData.custom_color.created) return i.reply({
                        content: `Вы не приобрели свой пользовательский цвет!`,
                        ephemeral: true
                    })


                    const modal = new ModalBuilder()
                        .setTitle(`Редактировать цвет`)
                        .setCustomId(`color_custom_edit`)
                        .addComponents(
                            new ActionRowBuilder()
                                .addComponents(
                                    new TextInputBuilder()
                                        .setCustomId(`color_custom_edit_name`)
                                        .setLabel(`Имя цвета`)
                                        .setPlaceholder(`Например, Мой цвет`)
                                        .setMinLength(4)
                                        .setMaxLength(16)
                                        .setRequired(true)
                                        .setStyle(TextInputStyle.Short)
                                )

                        )

                    await i.showModal(modal);
                    i.awaitModalSubmit({ time: 1000000000 })
                        .then(async (int) => {
                            const role = await int.guild.roles.fetch(userData.custom_color.role)
                            let name = int.fields?.getTextInputValue(`color_custom_edit_name`) ? `ᅠᅠᅠЛР ➖ ${int.fields?.getTextInputValue(`color_custom_edit_name`).toUpperCase()}` : `ᅠᅠᅠЛИЧНЫЙ ЦВЕТ`
                            await role.setName(name)
                            userData.custom_color.custom_name = name
                            userData.save()

                            await int.reply({
                                content: `Вы изменили имя вашей роли! ${role}`,
                                ephemeral: true
                            })
                        })
                        .catch(e => {

                        })
                }
            }
        })
    } catch (e) {
        const admin = await client.users.fetch(`491343958660874242`)
        console.log(e)
        await admin.send({
            content: `-> \`\`\`${e.stack}\`\`\``
        }).catch()
    }


}
module.exports = {
    category: `set`,
    plugin: {
        id: "items",
        name: "Предметы"
    },
    data: new SlashCommandBuilder()
        .setName(`colors`)
        .setDescription(`Изменить цвет вашего никнейма`)
        .setDMPermission(false),
    execute,
};