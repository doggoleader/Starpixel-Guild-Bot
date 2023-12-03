const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, GuildMember, UserSelectMenuBuilder } = require('discord.js');

const { User } = require(`../../schemas/userdata`);
const chalk = require(`chalk`);

const { Emotions } = require('../../misc_functions/Exporter');

/**
 * 
 * @param {import("discord.js").ChatInputCommandInteraction} interaction Interaction
 * @param {import("../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        const { member: m, user, guild } = interaction;

        //Emotions
        let emotions = checkEmotions(m);
        let pictures = checkPictures(m)
        let mode = 'emotions';
        let chosen_value = '';
        const option = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`emotions`)
                    .setLabel(`Эмоции`)
                    .setStyle(ButtonStyle.Success)
                    .setEmoji(`😉`)
                    .setDisabled(true)
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`pictures`)
                    .setLabel(`Картинки`)
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji(`🖼`)
                    .setDisabled(false)
            )
        const emotions_row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(`choose_emotion`)
                    .setPlaceholder(`Выберите эмоцию`)
                    .setOptions(emotions)
            )
        const pictures_row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(`choose_picture`)
                    .setPlaceholder(`Выберите картинку`)
                    .setOptions(pictures)
            )

        const msg = await interaction.reply({
            content: `Выберите эмоцию, которую хотите отправить`,
            ephemeral: true,
            fetchReply: true,
            components: [option, emotions_row]
        })

        const collector = await msg.createMessageComponentCollector()

        collector.on('collect', async (i) => {
            if (i.customId == `emotions`) {
                await i.deferUpdate()

                option.components[0].setDisabled(true)
                option.components[0].setStyle(ButtonStyle.Success)
                option.components[1].setDisabled(false)
                option.components[1].setStyle(ButtonStyle.Primary)
                mode = 'emotions'

                await interaction.editReply({
                    content: `Выберите эмоцию, которую хотите отправить`,
                    ephemeral: true,
                    fetchReply: true,
                    components: [option, emotions_row]
                })
            } else if (i.customId == 'pictures') {
                await i.deferUpdate()

                option.components[0].setDisabled(false)
                option.components[0].setStyle(ButtonStyle.Primary)
                option.components[1].setDisabled(true)
                option.components[1].setStyle(ButtonStyle.Success)
                mode = 'pictures'

                await interaction.editReply({
                    content: `Выберите картинку, которую хотите отправить`,
                    ephemeral: true,
                    fetchReply: true,
                    components: [option, pictures_row]
                })
            } else if (i.customId == 'emotions_back') {
                await i.deferUpdate()
                let row2, type
                if (mode == 'pictures') {
                    row2 = pictures_row;
                    type = `картинку`
                } else if (mode == 'emotions') {
                    row2 = emotions_row
                    type = `эмоцию`
                }

                await interaction.editReply({
                    content: `Выберите ${type}, которую хотите отправить`,
                    ephemeral: true,
                    fetchReply: true,
                    components: [option, row2]
                })
            } else if (i.customId == 'choose_emotion') {
                await i.deferUpdate()
                const choose_user = new ActionRowBuilder()
                    .addComponents(
                        new UserSelectMenuBuilder()
                            .setCustomId(`emotions_chooseuser`)
                            .setPlaceholder(`Выберите пользователя`)
                    )

                const no_user = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`emotions_nouser`)
                            .setLabel(`Без пользователя`)
                            .setStyle(ButtonStyle.Danger)
                            .setEmoji(`❌`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`emotions_back`)
                            .setLabel(`Назад`)
                            .setStyle(ButtonStyle.Danger)
                            .setEmoji(`⬅`)
                    )

                chosen_value = i.values[0]
                await interaction.editReply({
                    content: `Выберите пользователя, которого хотите упомянуть при отправке эмоции`,
                    components: [choose_user, no_user],
                    fetchReply: true
                })
            } else if (i.customId == 'choose_picture') {
                await i.deferUpdate()
                const choose_user = new ActionRowBuilder()
                    .addComponents(
                        new UserSelectMenuBuilder()
                            .setCustomId(`emotions_chooseuser`)
                            .setPlaceholder(`Выберите пользователя`)
                    )

                const no_user = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`emotions_nouser`)
                            .setLabel(`Без пользователя`)
                            .setStyle(ButtonStyle.Danger)
                            .setEmoji(`❌`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`emotions_back`)
                            .setLabel(`Назад`)
                            .setStyle(ButtonStyle.Danger)
                            .setEmoji(`⬅`)
                    )
                chosen_value = i.values[0]
                await interaction.editReply({
                    content: `Выберите пользователя, которого хотите упомянуть при отправке картинки`,
                    components: [choose_user, no_user],
                    fetchReply: true
                })
            } else if (i.customId == 'emotions_nouser') {
                const choose_user = new ActionRowBuilder()
                    .addComponents(
                        new UserSelectMenuBuilder()
                            .setCustomId(`emotions_chooseuser`)
                            .setPlaceholder(`Выберите пользователя`)
                    )

                const choose_user_dev = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId(`emotions_chooseuser_dev`)
                            .setPlaceholder(`Выберите пользователя`)
                            .setOptions(
                                {
                                    label: `Выберите пользователя`,
                                    value: `CHOOSE_USER_DEV_ONLY`
                                }
                            )
                    )

                const no_user = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`emotions_nouser`)
                            .setLabel(`Без пользователя`)
                            .setStyle(ButtonStyle.Danger)
                            .setEmoji(`❌`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`emotions_back`)
                            .setLabel(`Назад`)
                            .setStyle(ButtonStyle.Danger)
                            .setEmoji(`⬅`)
                    )

                if (mode == 'emotions') {
                    let chosen = Emotions.getEmotions(chosen_value);
                    let string = '';
                    if (chosen_value == 'pls' || chosen_value == 'party' || chosen_value == 'cool') {
                        const ch2 = chosen.messagenotag[Math.floor(Math.random() * chosen.messagenotag.length)];
                        string = ch2.replace("%%u1%%", i.user).replace('%%u2%%', "")
                    } else {
                        const ch2 = chosen[0];
                        string = ch2.replace("%%u1%%", i.user).replace('%%u2%%', "")
                    }

                    await i.reply({
                        content: `${string}`
                    })
                } else if (mode == 'pictures') {
                    if (chosen_value == `banuser`) {
                        const n1 = [`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`, `N`, `O`, `P`, `Q`, `R`, `S`, `T`, `U`, `V`, `W`, `X`, `Y`, `Z`, `0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`]
                        let r1 = n1[Math.floor(Math.random() * n1.length)]
                        let r2 = n1[Math.floor(Math.random() * n1.length)]
                        let r3 = n1[Math.floor(Math.random() * n1.length)]
                        let r4 = n1[Math.floor(Math.random() * n1.length)]
                        let r5 = n1[Math.floor(Math.random() * n1.length)]
                        let r6 = n1[Math.floor(Math.random() * n1.length)]
                        let r7 = n1[Math.floor(Math.random() * n1.length)]
                        let r8 = n1[Math.floor(Math.random() * n1.length)]
                        let r9 = n1[Math.floor(Math.random() * n1.length)]
                        let r10 = n1[Math.floor(Math.random() * n1.length)]
                        let r11 = n1[Math.floor(Math.random() * n1.length)]
                        let r12 = n1[Math.floor(Math.random() * n1.length)]
                        let r13 = n1[Math.floor(Math.random() * n1.length)]
                        let r14 = n1[Math.floor(Math.random() * n1.length)]

                        let code1 = `${r1}${r2}${r3}${r4}${r5}${r6}`;
                        let code2 = `${r7}${r8}${r9}${r10}${r11}${r12}${r13}${r14}`

                        let chosen = Emotions.getPictures(chosen_value);
                        let string = `${chosen.picture.replace('%%u%%', i.member).replace('%%code1%%', code1).replace("%%code2%%", code2)}`;

                        await i.reply({
                            content: `${string}`
                        })
                    } else {
                        let chosen = Emotions.getPictures(chosen_value);
                        let string = `${chosen.picture}
${chosen.messagenotag.replace(`%%u1%%`, i.member).replace('%%u2%%', ``)}`;

                        await i.reply({
                            content: `${string}`
                        })
                    }
                }
                await interaction.editReply({
                    components: [choose_user_dev, no_user],
                    fetchReply: true
                })


                await interaction.editReply({
                    components: [choose_user, no_user],
                    fetchReply: true
                })
            } else if (i.customId == 'emotions_chooseuser') {
                const choose_user_dev = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId(`emotions_chooseuser_dev`)
                            .setPlaceholder(`Выберите пользователя`)
                            .setOptions(
                                {
                                    label: `Выберите пользователя`,
                                    value: `CHOOSE_USER_DEV_ONLY`
                                }
                            )
                    )
                const choose_user = new ActionRowBuilder()
                    .addComponents(
                        new UserSelectMenuBuilder()
                            .setCustomId(`emotions_chooseuser`)
                            .setPlaceholder(`Выберите пользователя`)
                    )

                const no_user = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`emotions_nouser`)
                            .setLabel(`Без пользователя`)
                            .setStyle(ButtonStyle.Danger)
                            .setEmoji(`❌`)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`emotions_back`)
                            .setLabel(`Назад`)
                            .setStyle(ButtonStyle.Danger)
                            .setEmoji(`⬅`)
                    )

                if (mode == 'emotions') {
                    let chosen = Emotions.getEmotions(chosen_value);
                    let string = '';
                    if (chosen_value == 'pls' || chosen_value == 'party' || chosen_value == 'cool') {
                        const ch2 = chosen.messagetag[Math.floor(Math.random() * chosen.messagetag.length)];
                        string = ch2.replace("%%u1%%", i.user).replace('%%u2%%', `<@${i.values[0]}>`)
                    } else {
                        const ch2 = chosen[0];
                        string = ch2.replace("%%u1%%", i.user).replace('%%u2%%', `<@${i.values[0]}>`)
                    }

                    await i.reply({
                        content: `${string}`
                    })
                } else if (mode == 'pictures') {
                    if (chosen_value == `banuser`) {
                        const n1 = [`A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`, `N`, `O`, `P`, `Q`, `R`, `S`, `T`, `U`, `V`, `W`, `X`, `Y`, `Z`, `0`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`]
                        let r1 = n1[Math.floor(Math.random() * n1.length)]
                        let r2 = n1[Math.floor(Math.random() * n1.length)]
                        let r3 = n1[Math.floor(Math.random() * n1.length)]
                        let r4 = n1[Math.floor(Math.random() * n1.length)]
                        let r5 = n1[Math.floor(Math.random() * n1.length)]
                        let r6 = n1[Math.floor(Math.random() * n1.length)]
                        let r7 = n1[Math.floor(Math.random() * n1.length)]
                        let r8 = n1[Math.floor(Math.random() * n1.length)]
                        let r9 = n1[Math.floor(Math.random() * n1.length)]
                        let r10 = n1[Math.floor(Math.random() * n1.length)]
                        let r11 = n1[Math.floor(Math.random() * n1.length)]
                        let r12 = n1[Math.floor(Math.random() * n1.length)]
                        let r13 = n1[Math.floor(Math.random() * n1.length)]
                        let r14 = n1[Math.floor(Math.random() * n1.length)]

                        let code1 = `${r1}${r2}${r3}${r4}${r5}${r6}`;
                        let code2 = `${r7}${r8}${r9}${r10}${r11}${r12}${r13}${r14}`

                        let chosen = Emotions.getPictures(chosen_value);
                        let string = `${chosen.picture.replace('%%u%%', `<@${i.values[0]}>`).replace('%%code1%%', code1).replace("%%code2%%", code2)}`;

                        await i.reply({
                            content: `${string}`
                        })
                    } else {
                        let chosen = Emotions.getPictures(chosen_value);
                        let string = `${chosen.picture}
${chosen.messagetag.replace(`%%u1%%`, i.member).replace('%%u2%%', `<@${i.values[0]}>`)}`;

                        await i.reply({
                            content: `${string}`
                        })
                    }
                }
                await interaction.editReply({
                    components: [choose_user_dev, no_user],
                    fetchReply: true
                })

                await interaction.editReply({
                    components: [choose_user, no_user],
                    fetchReply: true
                })


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

/**
 * 
 * @param {GuildMember} m Discord Member of Starpixel Guild
 * @returns Array of options for Select Menu
 * @description Check emotions that member has
 */
function checkEmotions(m) {
    const emotions_options = []
    if (m.roles.cache.has("566528019208863744")) {
        emotions_options.push(
            {
                label: "Эмоция \"oh\"",
                emoji: "🙄",
                value: "oh"
            }
        )
    }
    if (m.roles.cache.has("571743750049497089")) {
        emotions_options.push(
            {
                label: "Эмоция \"army\"",
                emoji: "😌",
                value: "army"
            }
        )
    }
    if (m.roles.cache.has("571745411929341962")) {
        emotions_options.push(
            {
                label: "Эмоция \"getup\"",
                emoji: "😮",
                value: "getup"
            }
        )
    }
    if (m.roles.cache.has("571744516894228481")) {
        emotions_options.push(
            {
                label: "Эмоция \"sleep\"",
                emoji: "😴",
                value: "sleep"
            }
        )
    }
    if (m.roles.cache.has("571757459732168704")) {
        emotions_options.push(
            {
                label: "Эмоция \"hey\"",
                emoji: "🤗",
                value: "hey"
            }
        )
    }
    if (m.roles.cache.has("571757461380399106")) {
        emotions_options.push(
            {
                label: "Эмоция \"hmm\"",
                emoji: "🤔",
                value: "hmm"
            }
        )
    }
    if (m.roles.cache.has("571757462219128832")) {
        emotions_options.push(
            {
                label: "Эмоция \"love\"",
                emoji: "😍",
                value: "love"
            }
        )
    }
    if (m.roles.cache.has("571757463876141077")) {
        emotions_options.push(
            {
                label: "Эмоция \"happy\"",
                emoji: "🙂",
                value: "happy"
            }
        )
    }
    if (m.roles.cache.has("642810527579373588")) {
        emotions_options.push(
            {
                label: "Эмоция \"money\"",
                emoji: "🤑",
                value: "money"
            }
        )
    }
    if (m.roles.cache.has("642393088689700893")) {
        emotions_options.push(
            {
                label: "Эмоция \"music\"",
                emoji: "😋",
                value: "music"
            }
        )
    }
    if (m.roles.cache.has("636561006721761301")) {
        emotions_options.push(
            {
                label: "Эмоция \"spider\"",
                emoji: "😠",
                value: "spider"
            }
        )
    }
    if (m.roles.cache.has("607495941490212885")) {
        emotions_options.push(
            {
                label: "Эмоция \"pls\"",
                emoji: "🥺",
                value: "pls"
            }
        )
    }
    if (m.roles.cache.has("694221126494060604")) {
        emotions_options.push(
            {
                label: "Эмоция \"party\"",
                emoji: "🥳",
                value: "party"
            }
        )
    }
    if (m.roles.cache.has("740241984190545971")) {
        emotions_options.push(
            {
                label: "Эмоция \"cool\"",
                emoji: "😎",
                value: "cool"
            }
        )
    }

    if (emotions_options.length <= 0) emotions_options.push({
        label: "У вас нет эмоций в профиле",
        emoji: "❌",
        value: "no_emotions"
    })


    return emotions_options
}
/**
 * 
 * @param {GuildMember} m Discord Member of Starpixel Guild
 * @returns Array of options for Select Menu 
 * @description Check pictures that member has.
 */
function checkPictures(m) {
    const emotions_options = []
    if (m.roles.cache.has("850079153746346044")) {
        emotions_options.push(
            {
                label: "Картинка \"cake\"",
                emoji: "🍰",
                value: "cake"
            }
        )
    }
    if (m.roles.cache.has("850079142413598720")) {
        emotions_options.push(
            {
                label: "Картинка \"like\"",
                emoji: "👍",
                value: "like"
            }
        )
    }
    if (m.roles.cache.has("850079173149065277")) {
        emotions_options.push(
            {
                label: "Картинка \"banuser\"",
                emoji: "😡",
                value: "banuser"
            }
        )
    }
    if (m.roles.cache.has("642810535737425930")) {
        emotions_options.push(
            {
                label: "Картинка \"heart\"",
                emoji: "🧡",
                value: "heart"
            }
        )
    }
    if (m.roles.cache.has("642810538518118430")) {
        emotions_options.push(
            {
                label: "Картинка \"miracle\"",
                emoji: "👾",
                value: "miracle"
            }
        )
    }
    if (m.roles.cache.has("642819600429481997")) {
        emotions_options.push(
            {
                label: "Картинка \"snowman\"",
                emoji: "⛄",
                value: "snowman"
            }
        )
    }
    if (m.roles.cache.has("850079134700666890")) {
        emotions_options.push(
            {
                label: "Картинка \"sova\"",
                emoji: "🧡",
                value: "sova"
            }
        )
    }
    if (m.roles.cache.has("694914077104799764")) {
        emotions_options.push(
            {
                label: "Картинка \"dragon\"",
                emoji: "🐉",
                value: "dragon"
            }
        )
    }
    if (m.roles.cache.has("893927886766096384")) {
        emotions_options.push(
            {
                label: "Картинка \"ghost\"",
                emoji: "👻",
                value: "ghost"
            }
        )
    }
    if (m.roles.cache.has("1046475276080648302")) {
        emotions_options.push(
            {
                label: "Картинка \"santa\"",
                emoji: "🎅",
                value: "santa"
            }
        )
    }
    if (m.roles.cache.has("1088824017517031544")) {
        emotions_options.push(
            {
                label: "Картинка \"egg\"",
                emoji: "🥚",
                value: "egg"
            }
        )
    }
    if (m.roles.cache.has("1088824078342832240")) {
        emotions_options.push(
            {
                label: "Картинка \"palm\"",
                emoji: "🌴",
                value: "palm"
            }
        )
    }

    if (emotions_options.length <= 0) emotions_options.push({
        label: "У вас нет картинок в профиле",
        emoji: "❌",
        value: "no_pictures"
    })


    return emotions_options
}


module.exports = {
    category: `em`,
    plugin: {
        id: "items",
        name: "Предметы"
    },
    data: new SlashCommandBuilder()
        .setName(`emotions`)
        .setDescription(`Отправить эмоцию или картинку в чат`)
        .setDMPermission(false),
    execute
}