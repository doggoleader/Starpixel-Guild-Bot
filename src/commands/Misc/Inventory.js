const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

const fetch = require(`node-fetch`);
const api = process.env.hypixel_apikey;
const { User } = require(`../../schemas/userdata`)
const chalk = require(`chalk`);
const ch_list = require(`../../discord structure/channels.json`)
const { Guild } = require(`../../schemas/guilddata`);
const { Inventory } = require('../../misc_functions/Exporter');
const { divideOnPages, secondPage } = require('../../functions');
const { isOneEmoji } = require('is-emojis');
const wait = require(`node:timers/promises`).setTimeout

/**
 * 
 * @param {import("discord.js").ChatInputCommandInteraction} interaction Interaction
 * @param {import("../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        await interaction.deferReply({ ephemeral: true, fetchReply: true })

        const { user, member, guild } = interaction;
        let inventory = new Inventory(member, client);
        let allItems = await inventory.getEverything();
        let createdTimespamp = inventory.getCreatedTimestamp();

        const types = {
            ITEMS: Symbol('items'),
            SYMBOLS: Symbol('symbols'),
            FRAMES: Symbol('frames'),
            SUFFIXES: Symbol('suffixes'),
            RANKS: Symbol('ranks'),
            COLORS: Symbol('colors')
        }
        let curType = types.ITEMS;

        let curPage = 1
        let itemOnPage = 10;
        let totalPages = Math.ceil(allItems[0].length / itemOnPage)
        let pages = []
        if (allItems[0].length > 0) {
            pages = await divideOnPages(allItems[0], itemOnPage, curPage);
        }
        let map = pages.map((item, i = itemOnPage * (curPage - 1) + 1) => {
            return `- <@&${item}>`
        })

        const menu = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(`inv_changeinv`)
                    .setPlaceholder(`Текущее меню`)
                    .setOptions([
                        {
                            label: `Предметы`,
                            value: `items`,
                            default: true
                        },
                        {
                            label: `Косметические значки`,
                            value: `symbols`,
                            default: false
                        },
                        {
                            label: `Косметические рамки`,
                            value: `frames`,
                            default: false
                        },
                        {
                            label: `Косметические постфиксы`,
                            value: `suffixes`,
                            default: false
                        },
                        {
                            label: `Косметические значки ранга`,
                            value: `ranks`,
                            default: false
                        },
                        {
                            label: `Цвета`,
                            value: `colors`,
                            default: false
                        },
                    ])
            )
        let buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel(`Предыдущая`)
                    .setCustomId(`inv_prev`)
                    .setEmoji(`⬅`)
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(true)
            )
            .addComponents(
                new ButtonBuilder()
                    .setLabel(`Следующая`)
                    .setCustomId(`inv_next`)
                    .setEmoji(`➡`)
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(secondPage(totalPages))
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`inv_dev`)
                    .setEmoji(`➖`)
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true)
            )
            .addComponents(
                new ButtonBuilder()
                    .setLabel(`Забрать предметы`)
                    .setCustomId(`inv_claim`)
                    .setEmoji(`🎁`)
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(allItems[0].length <= 0 ? true : false)
            )
        const buttonsPagesOnly = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel(`Предыдущая`)
                    .setCustomId(`inv_prev`)
                    .setEmoji(`⬅`)
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(true)
            )
            .addComponents(
                new ButtonBuilder()
                    .setLabel(`Следующая`)
                    .setCustomId(`inv_next`)
                    .setEmoji(`➡`)
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(secondPage(totalPages))
            )
        const buttonsRank = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel(`Предыдущая`)
                    .setCustomId(`inv_prev`)
                    .setEmoji(`⬅`)
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(true)
            )
            .addComponents(
                new ButtonBuilder()
                    .setLabel(`Следующая`)
                    .setCustomId(`inv_next`)
                    .setEmoji(`➡`)
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(secondPage(totalPages))
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`inv_setdefault`)
                    .setEmoji(`♻`)
                    .setStyle(ButtonStyle.Primary)
                    .setLabel(`Установить по умолчанию`)
            )
            .addComponents(
                new ButtonBuilder()
                    .setLabel(`Приобрести значок`)
                    .setCustomId(`inv_rankbuy`)
                    .setEmoji(`🛒`)
                    .setStyle(ButtonStyle.Primary)
            )
        const setup = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(`inv_setup`)
                    .setPlaceholder(`Установить значок ранга`)
                    .setOptions({
                        label: 'dev',
                        value: 'dev'
                    })
            )
        const embed = new EmbedBuilder()
            .setColor(Number(client.information.bot_color))
            .setTimestamp(createdTimespamp)
            .setDescription(`## Инвентарь предметов
        
${map.length <= 0 ? '\`Инвентарь пуст.\`' : `${map.join(`\n`)}`}

Страница ${curPage}/${totalPages}`)


        const msg = await interaction.editReply({
            embeds: [embed],
            components: [menu, buttons],
            ephemeral: true,
            fetchReply: true
        })

        const collector = msg.createMessageComponentCollector()

        collector.on('collect', async (int) => {
            if (int.customId == 'inv_changeinv') {
                await int.deferUpdate()
                let v = int.values[0]
                await menu.components[0].options.forEach(option => {
                    if (option.data.value == v) {
                        option.data.default = true
                    } else option.data.default = false
                })

                if (v == 'items') {
                    curPage = 1
                    itemOnPage = 10;
                    totalPages = Math.ceil(allItems[0].length / itemOnPage)
                    pages = []
                    if (allItems[0].length > 0) {
                        pages = await divideOnPages(allItems[0], itemOnPage, curPage);
                    }
                    map = pages.map((item, i = itemOnPage * (curPage - 1) + 1) => {
                        return `- <@&${item}>`
                    })


                    curType = types.ITEMS
                    embed
                        .setTimestamp(createdTimespamp)
                        .setDescription(`## Инвентарь предметов
        
${map.length <= 0 ? '\`Инвентарь пуст.\`' : `${map.join(`\n`)}`}

Страница ${curPage}/${totalPages}`)


                    buttons = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(`Предыдущая`)
                                .setCustomId(`inv_prev`)
                                .setEmoji(`⬅`)
                                .setStyle(ButtonStyle.Danger)
                                .setDisabled(true)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(`Следующая`)
                                .setCustomId(`inv_next`)
                                .setEmoji(`➡`)
                                .setStyle(ButtonStyle.Success)
                                .setDisabled(secondPage(totalPages))
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId(`inv_dev`)
                                .setEmoji(`➖`)
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setLabel(`Забрать предметы`)
                                .setCustomId(`inv_claim`)
                                .setEmoji(`🎁`)
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(allItems[0].length <= 0 ? true : false)
                        )


                    await interaction.editReply({
                        embeds: [embed],
                        components: [menu, buttons]
                    })
                } else if (v == 'symbols') {
                    curPage = 1
                    itemOnPage = 25;
                    totalPages = Math.ceil(allItems[1].length / itemOnPage)
                    pages = []
                    if (allItems[1].length > 0) {
                        pages = await divideOnPages(allItems[1], itemOnPage, curPage);
                    }
                    curType = types.SYMBOLS
                    let options = []
                    map = pages.map((item, i = itemOnPage * (curPage - 1) + 1) => {
                        options.push({
                            label: `Косметический значок "${item}"`,
                            value: item
                        })
                        return `- \`${item}\``
                    })
                    if (options.length <= 0) {
                        options.push({
                            label: "Инвентарь пуст",
                            value: "empty"
                        })
                        curPage = 0
                        setup.components[0].setDisabled(true)
                    } else {
                        setup.components[0].setDisabled(false)
                    }
                    setup.components[0].setPlaceholder(`Установить косметический значок`)
                    setup.components[0].setOptions(options)
                    buttonsPagesOnly.components[0].setDisabled(true)
                    buttonsPagesOnly.components[1].setDisabled(secondPage(totalPages))

                    embed
                        .setTimestamp(createdTimespamp)
                        .setDescription(`## Инвентарь косметических значков
        
${map.length <= 0 ? '\`Инвентарь пуст.\`' : `${map.join(`\n`)}`}

Страница ${curPage}/${totalPages}`)
                    await interaction.editReply({
                        embeds: [embed],
                        components: [menu, setup, buttonsPagesOnly]
                    })
                } else if (v == 'frames') {
                    curPage = 1
                    itemOnPage = 25;
                    totalPages = Math.ceil(allItems[2].length / itemOnPage)
                    pages = []
                    if (allItems[2].length > 0) {
                        pages = await divideOnPages(allItems[2], itemOnPage, curPage);
                    }
                    curType = types.FRAMES
                    let options = []
                    map = pages.map((item, i = itemOnPage * (curPage - 1) + 1) => {
                        options.push({
                            label: `Косметическая рамка "${item.ramka1}ИМЯ${item.ramka2}"`,
                            value: `${item.ramka1}ИМЯ${item.ramka2}`
                        })
                        return `- \`${item.ramka1}ИМЯ${item.ramka2}\``
                    })
                    if (options.length <= 0) {
                        options.push({
                            label: "Инвентарь пуст",
                            value: "empty"
                        })
                        curPage = 0
                        setup.components[0].setDisabled(true)
                    } else {
                        setup.components[0].setDisabled(false)
                    }
                    setup.components[0].setPlaceholder(`Установить косметическую рамку`)
                    setup.components[0].setOptions(options)
                    buttonsPagesOnly.components[0].setDisabled(true)
                    buttonsPagesOnly.components[1].setDisabled(secondPage(totalPages))

                    embed
                        .setTimestamp(createdTimespamp)
                        .setDescription(`## Инвентарь косметических рамок
        
${map.length <= 0 ? '\`Инвентарь пуст.\`' : `${map.join(`\n`)}`}

Страница ${curPage}/${totalPages}`)
                    await interaction.editReply({
                        embeds: [embed],
                        components: [menu, setup, buttonsPagesOnly]
                    })
                } else if (v == 'suffixes') {
                    curPage = 1
                    itemOnPage = 25;
                    totalPages = Math.ceil(allItems[3].length / itemOnPage)
                    pages = []
                    if (allItems[3].length > 0) {
                        pages = await divideOnPages(allItems[3], itemOnPage, curPage);
                    }
                    curType = types.SUFFIXES
                    let options = []
                    map = pages.map((item, i = itemOnPage * (curPage - 1) + 1) => {
                        options.push({
                            label: `Косметический суффикс "ИМЯ${item}"`,
                            value: item
                        })
                        return `- \`${item}\``
                    })

                    if (options.length <= 0) {
                        options.push({
                            label: "Инвентарь пуст",
                            value: "empty"
                        })
                        curPage = 0
                        setup.components[0].setDisabled(true)
                    } else {
                        setup.components[0].setDisabled(false)
                    }
                    setup.components[0].setPlaceholder(`Установить косметический суффикс`)
                    setup.components[0].setOptions(options)
                    buttonsPagesOnly.components[0].setDisabled(true)
                    buttonsPagesOnly.components[1].setDisabled(secondPage(totalPages))

                    embed
                        .setTimestamp(createdTimespamp)
                        .setDescription(`## Инвентарь косметических суффиксов
        
${map.length <= 0 ? '\`Инвентарь пуст.\`' : `${map.join(`\n`)}`}

Страница ${curPage}/${totalPages}`)
                    await interaction.editReply({
                        embeds: [embed],
                        components: [menu, setup, buttonsPagesOnly]
                    })
                } else if (v == 'ranks') {
                    curPage = 1
                    itemOnPage = 25;
                    totalPages = Math.ceil(map.length / itemOnPage)
                    pages = []
                    if (allItems[4].length > 0) {
                        pages = await divideOnPages(allItems[4], itemOnPage, curPage);
                    }
                    curType = types.RANKS
                    let options = []
                    map = pages.map((item, i = itemOnPage * (curPage - 1) + 1) => {
                        options.push({
                            label: `Значок ранга "${item}"`,
                            value: item
                        })
                        return `- \`${item}\``
                    })
                    if (options.length <= 0) {
                        options.push({
                            label: "Инвентарь пуст",
                            value: "empty"
                        })
                        curPage = 0
                        setup.components[0].setDisabled(true)
                    } else {
                        setup.components[0].setDisabled(false)
                    }
                    setup.components[0].setPlaceholder(`Установить значок ранга`)
                    setup.components[0].setOptions(options)
                    buttonsRank.components[0].setDisabled(true)
                    buttonsRank.components[1].setDisabled(secondPage(totalPages))

                    embed
                        .setTimestamp(createdTimespamp)
                        .setDescription(`## Инвентарь косметических значков ранга
        
${map.length <= 0 ? '\`Инвентарь пуст.\`' : `${map.join(`\n`)}`}

Нажав на кнопку "Установить по умолчанию", вы установите значок ранга по умолчанию (соответствующий вашему текущему рангу).
Нажав на кнопку "Приобрести значок" вы можете приобрести свой значок за 400 <:Rumbik:883638847056003072> (при условии, что у вас имеется ранг "Повелитель гильдии").
Страница ${curPage}/${totalPages}`)
                    await interaction.editReply({
                        embeds: [embed],
                        components: [menu, setup, buttonsRank]
                    })
                } else if (v == 'colors') {
                    map = allItems[5].map((item) => {
                        return `- <@&${item}>`
                    })

                    curType = types.COLORS
                    embed
                        .setTimestamp(createdTimespamp)
                        .setDescription(`## Инвентарь цветов
        
${map.length <= 0 ? '\`Инвентарь пуст.\`' : `${map.join(`\n`)}`}`)

                    await interaction.editReply({
                        embeds: [embed],
                        components: [menu]
                    })
                }

            } else if (int.customId == 'inv_prev') {
                await int.deferUpdate();

                if (curType == types.ITEMS) {
                    curPage -= 1
                    pages = []
                    if (allItems[0].length > 0) {
                        pages = await divideOnPages(allItems[0], itemOnPage, curPage);
                    }
                    map = pages.map((item, i = itemOnPage * (curPage - 1) + 1) => {
                        return `- <@&${item}>`
                    })
                    if (curPage <= 1) {
                        buttons.components[0].setDisabled(true)
                    } else {
                        buttons.components[0].setDisabled(false)
                    }
                    buttons.components[1].setDisabled(false)

                    embed
                        .setTimestamp(createdTimespamp)
                        .setDescription(`## Инвентарь предметов
        
${map.length <= 0 ? '\`Инвентарь пуст.\`' : `${map.join(`\n`)}`}

Страница ${curPage}/${totalPages}`)
                    await interaction.editReply({
                        embeds: [embed],
                        components: [menu, buttons]
                    })
                } else if (curType == types.SYMBOLS) {
                    curPage -= 1
                    pages = []
                    if (allItems[1].length > 0) {
                        pages = await divideOnPages(allItems[1], itemOnPage, curPage);
                    }
                    let options = []
                    map = pages.map((item, i = itemOnPage * (curPage - 1) + 1) => {
                        options.push({
                            label: `Косметический значок "${item}"`,
                            value: item
                        })
                        return `- \`${item}\``
                    })

                    if (options.length <= 0) {
                        options.push({
                            label: "Инвентарь пуст",
                            value: "empty"
                        })
                        curPage = 0
                        setup.components[0].setDisabled(true)
                    } else {
                        setup.components[0].setDisabled(false)
                    }
                    setup.components[0].setOptions(options)
                    if (curPage <= 1) {
                        buttonsPagesOnly.components[0].setDisabled(true)
                    } else {
                        buttonsPagesOnly.components[0].setDisabled(false)
                    }
                    buttonsPagesOnly.components[1].setDisabled(false)

                    embed
                        .setTimestamp(createdTimespamp)
                        .setDescription(`## Инвентарь косметических значков
        
${map.length <= 0 ? '\`Инвентарь пуст.\`' : `${map.join(`\n`)}`}

Страница ${curPage}/${totalPages}`)
                    await interaction.editReply({
                        embeds: [embed],
                        components: [menu, setup, buttonsPagesOnly]
                    })
                } else if (curType == types.FRAMES) {
                    curPage -= 1
                    pages = []
                    if (allItems[2].length > 0) {
                        pages = await divideOnPages(allItems[2], itemOnPage, curPage);
                    }
                    let options = []
                    map = pages.map((item, i = itemOnPage * (curPage - 1) + 1) => {
                        options.push({
                            label: `Косметическая рамка "${item.ramka1}ИМЯ${item.ramka2}"`,
                            value: `${item.ramka1}ИМЯ${item.ramka2}`
                        })
                        return `- \`${item.ramka1}ИМЯ${item.ramka2}\``
                    })

                    if (options.length <= 0) {
                        options.push({
                            label: "Инвентарь пуст",
                            value: "empty"
                        })
                        curPage = 0
                        setup.components[0].setDisabled(true)
                    } else {
                        setup.components[0].setDisabled(false)
                    }
                    setup.components[0].setOptions(options)
                    if (curPage <= 1) {
                        buttonsPagesOnly.components[0].setDisabled(true)
                    } else {
                        buttonsPagesOnly.components[0].setDisabled(false)
                    }
                    buttonsPagesOnly.components[1].setDisabled(false)

                    embed
                        .setTimestamp(createdTimespamp)
                        .setDescription(`## Инвентарь косметических рамок
        
${map.length <= 0 ? '\`Инвентарь пуст.\`' : `${map.join(`\n`)}`}

Страница ${curPage}/${totalPages}`)
                    await interaction.editReply({
                        embeds: [embed],
                        components: [menu, setup, buttonsPagesOnly]
                    })
                } else if (curType == types.SUFFIXES) {
                    curPage -= 1
                    pages = []
                    if (allItems[3].length > 0) {
                        pages = await divideOnPages(allItems[3], itemOnPage, curPage);
                    }
                    let options = []
                    map = pages.map((item, i = itemOnPage * (curPage - 1) + 1) => {
                        options.push({
                            label: `Косметический суффикс "ИМЯ${item}"`,
                            value: item
                        })
                        return `- \`${item}\``
                    })

                    if (options.length <= 0) {
                        options.push({
                            label: "Инвентарь пуст",
                            value: "empty"
                        })
                        curPage = 0
                        setup.components[0].setDisabled(true)
                    } else {
                        setup.components[0].setDisabled(false)
                    }
                    setup.components[0].setOptions(options)
                    if (curPage <= 1) {
                        buttonsPagesOnly.components[0].setDisabled(true)
                    } else {
                        buttonsPagesOnly.components[0].setDisabled(false)
                    }
                    buttonsPagesOnly.components[1].setDisabled(false)

                    embed
                        .setTimestamp(createdTimespamp)
                        .setDescription(`## Инвентарь косметических суффиксов
        
${map.length <= 0 ? '\`Инвентарь пуст.\`' : `${map.join(`\n`)}`}

Страница ${curPage}/${totalPages}`)
                    await interaction.editReply({
                        embeds: [embed],
                        components: [menu, setup, buttonsPagesOnly]
                    })
                } else if (curType == types.RANKS) {
                    curPage -= 1
                    pages = []
                    if (allItems[4].length > 0) {
                        pages = await divideOnPages(allItems[4], itemOnPage, curPage);
                    }
                    let options = []
                    map = pages.map((item, i = itemOnPage * (curPage - 1) + 1) => {
                        options.push({
                            label: `Значок ранга "${item}"`,
                            value: item
                        })
                        return `- \`${item}\``
                    })

                    if (options.length <= 0) {
                        options.push({
                            label: "Инвентарь пуст",
                            value: "empty"
                        })
                        curPage = 0
                        setup.components[0].setDisabled(true)
                    } else {
                        setup.components[0].setDisabled(false)
                    }
                    setup.components[0].setOptions(options)
                    if (curPage <= 1) {
                        buttonsRank.components[0].setDisabled(true)
                    } else {
                        buttonsRank.components[0].setDisabled(false)
                    }
                    buttonsRank.components[1].setDisabled(false)

                    embed
                        .setTimestamp(createdTimespamp)
                        .setDescription(`## Инвентарь косметических значков ранга
        
${map.length <= 0 ? '\`Инвентарь пуст.\`' : `${map.join(`\n`)}`}

Нажав на кнопку "Установить по умолчанию", вы установите значок ранга по умолчанию (соответствующий вашему текущему рангу).
Нажав на кнопку "Приобрести значок" вы можете приобрести свой значок за 400 <:Rumbik:883638847056003072> (при условии, что у вас имеется ранг "Повелитель гильдии").
Страница ${curPage}/${totalPages}`)
                    await interaction.editReply({
                        embeds: [embed],
                        components: [menu, setup, buttonsRank]
                    })
                }
            } else if (int.customId == 'inv_next') {
                await int.deferUpdate();

                if (curType == types.ITEMS) {
                    curPage += 1
                    pages = []
                    if (allItems[0].length > 0) {
                        pages = await divideOnPages(allItems[0], itemOnPage, curPage);
                    }
                    map = pages.map((item, i = itemOnPage * (curPage - 1) + 1) => {
                        return `- <@&${item}>`
                    })
                    if (curPage >= totalPages) {
                        buttons.components[1].setDisabled(true)
                    } else {
                        buttons.components[1].setDisabled(false)
                    }
                    buttons.components[0].setDisabled(false)

                    embed
                        .setTimestamp(createdTimespamp)
                        .setDescription(`## Инвентарь предметов
        
${map.length <= 0 ? '\`Инвентарь пуст.\`' : `${map.join(`\n`)}`}

Страница ${curPage}/${totalPages}`)
                    await interaction.editReply({
                        embeds: [embed],
                        components: [menu, buttons]
                    })
                } else if (curType == types.SYMBOLS) {
                    curPage += 1
                    pages = []
                    if (allItems[1].length > 0) {
                        pages = await divideOnPages(allItems[1], itemOnPage, curPage);
                    }
                    let options = []
                    map = pages.map((item, i = itemOnPage * (curPage - 1) + 1) => {
                        options.push({
                            label: `Косметический значок "${item}"`,
                            value: item
                        })
                        return `- \`${item}\``
                    })

                    if (options.length <= 0) {
                        options.push({
                            label: "Инвентарь пуст",
                            value: "empty"
                        })
                        curPage = 0
                        setup.components[0].setDisabled(true)
                    } else {
                        setup.components[0].setDisabled(false)
                    }
                    setup.components[0].setOptions(options)
                    if (curPage >= totalPages) {
                        buttonsPagesOnly.components[1].setDisabled(true)
                    } else {
                        buttonsPagesOnly.components[1].setDisabled(false)
                    }
                    buttonsPagesOnly.components[0].setDisabled(false)

                    embed
                        .setTimestamp(createdTimespamp)
                        .setDescription(`## Инвентарь косметических значков
        
${map.length <= 0 ? '\`Инвентарь пуст.\`' : `${map.join(`\n`)}`}

Страница ${curPage}/${totalPages}`)
                    await interaction.editReply({
                        embeds: [embed],
                        components: [menu, setup, buttonsPagesOnly]
                    })
                } else if (curType == types.FRAMES) {
                    curPage += 1
                    pages = []
                    if (allItems[2].length > 0) {
                        pages = await divideOnPages(allItems[2], itemOnPage, curPage);
                    }
                    let options = []
                    map = pages.map((item, i = itemOnPage * (curPage - 1) + 1) => {
                        options.push({
                            label: `Косметическая рамка "${item.ramka1}ИМЯ${item.ramka2}"`,
                            value: `${item.ramka1}ИМЯ${item.ramka2}`
                        })
                        return `- \`${item.ramka1}ИМЯ${item.ramka2}\``
                    })

                    if (options.length <= 0) {
                        options.push({
                            label: "Инвентарь пуст",
                            value: "empty"
                        })
                        curPage = 0
                        setup.components[0].setDisabled(true)
                    } else {
                        setup.components[0].setDisabled(false)
                    }
                    setup.components[0].setOptions(options)
                    if (curPage >= totalPages) {
                        buttonsPagesOnly.components[1].setDisabled(true)
                    } else {
                        buttonsPagesOnly.components[1].setDisabled(false)
                    }
                    buttonsPagesOnly.components[0].setDisabled(false)

                    embed
                        .setTimestamp(createdTimespamp)
                        .setDescription(`## Инвентарь косметических рамок
        
${map.length <= 0 ? '\`Инвентарь пуст.\`' : `${map.join(`\n`)}`}

Страница ${curPage}/${totalPages}`)
                    await interaction.editReply({
                        embeds: [embed],
                        components: [menu, setup, buttonsPagesOnly]
                    })
                } else if (curType == types.SUFFIXES) {
                    curPage += 1
                    pages = []
                    if (allItems[3].length > 0) {
                        pages = await divideOnPages(allItems[3], itemOnPage, curPage);
                    }
                    let options = []
                    map = pages.map((item, i = itemOnPage * (curPage - 1) + 1) => {
                        options.push({
                            label: `Косметический суффикс "ИМЯ${item}"`,
                            value: item
                        })
                        return `- \`${item}\``
                    })

                    if (options.length <= 0) {
                        options.push({
                            label: "Инвентарь пуст",
                            value: "empty"
                        })
                        curPage = 0
                        setup.components[0].setDisabled(true)
                    } else {
                        setup.components[0].setDisabled(false)
                    }
                    setup.components[0].setOptions(options)
                    if (curPage >= totalPages) {
                        buttonsPagesOnly.components[1].setDisabled(true)
                    } else {
                        buttonsPagesOnly.components[1].setDisabled(false)
                    }
                    buttonsPagesOnly.components[0].setDisabled(false)

                    embed
                        .setTimestamp(createdTimespamp)
                        .setDescription(`## Инвентарь косметических суффиксов
        
${map.length <= 0 ? '\`Инвентарь пуст.\`' : `${map.join(`\n`)}`}

Страница ${curPage}/${totalPages}`)
                    await interaction.editReply({
                        embeds: [embed],
                        components: [menu, setup, buttonsPagesOnly]
                    })
                } else if (curType == types.RANKS) {
                    curPage += 1
                    pages = []
                    if (allItems[4].length > 0) {
                        pages = await divideOnPages(allItems[4], itemOnPage, curPage);
                    }
                    let options = []
                    map = pages.map((item, i = itemOnPage * (curPage - 1) + 1) => {
                        options.push({
                            label: `Значок ранга "${item}"`,
                            value: item
                        })
                        return `- \`${item}\``
                    })

                    if (options.length <= 0) {
                        options.push({
                            label: "Инвентарь пуст",
                            value: "empty"
                        })
                        curPage = 0
                        setup.components[0].setDisabled(true)
                    } else {
                        setup.components[0].setDisabled(false)
                    }
                    setup.components[0].setOptions(options)
                    if (curPage >= totalPages) {
                        buttonsRank.components[1].setDisabled(true)
                    } else {
                        buttonsRank.components[1].setDisabled(false)
                    }
                    buttonsRank.components[0].setDisabled(false)

                    embed
                        .setTimestamp(createdTimespamp)
                        .setDescription(`## Инвентарь косметических значков ранга
        
${map.length <= 0 ? '\`Инвентарь пуст.\`' : `${map.join(`\n`)}`}

Нажав на кнопку "Установить по умолчанию", вы установите значок ранга по умолчанию (соответствующий вашему текущему рангу).
Нажав на кнопку "Приобрести значок" вы можете приобрести свой значок за 400 <:Rumbik:883638847056003072> (при условии, что у вас имеется ранг "Повелитель гильдии").
Страница ${curPage}/${totalPages}`)
                    await interaction.editReply({
                        embeds: [embed],
                        components: [menu, setup, buttonsRank]
                    })
                }
            } else if (int.customId == 'inv_claim') {
                await inventory.claimRewards(int);
                inventory = new Inventory(member, client);
                allItems = await inventory.getEverything();
                createdTimespamp = inventory.getCreatedTimestamp();

                curPage = 1
                itemOnPage = 10;
                pages = []
                if (allItems[0].length > 0) {
                    pages = await divideOnPages(allItems[0], itemOnPage, curPage);
                }
                map = pages.map((item, i = itemOnPage * (curPage - 1) + 1) => {
                    return `- <@&${item}>`
                })
                totalPages = Math.ceil(allItems[0].length / itemOnPage)

                curType = types.ITEMS
                embed
                    .setTimestamp(createdTimespamp)
                    .setDescription(`## Инвентарь предметов
        
${map.length <= 0 ? '\`Инвентарь пуст.\`' : `${map.join(`\n`)}`}

Страница ${curPage}/${totalPages}`)


                buttons = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel(`Предыдущая`)
                            .setCustomId(`inv_prev`)
                            .setEmoji(`⬅`)
                            .setStyle(ButtonStyle.Danger)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel(`Следующая`)
                            .setCustomId(`inv_next`)
                            .setEmoji(`➡`)
                            .setStyle(ButtonStyle.Success)
                            .setDisabled(secondPage(totalPages))
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`inv_dev`)
                            .setEmoji(`➖`)
                            .setStyle(ButtonStyle.Secondary)
                            .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel(`Забрать предметы`)
                            .setCustomId(`inv_claim`)
                            .setEmoji(`🎁`)
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(allItems[0].length <= 0 ? true : false)
                    )


                await interaction.editReply({
                    embeds: [embed],
                    components: [menu, buttons]
                })
            } else if (int.customId == 'inv_setup') {
                let userData = await inventory.getUserData();
                let value = int.values[0]
                let typeChanged = ''
                if (curType == types.SYMBOLS) {
                    if (userData.rank_number < 4) return int.reply({
                        content: `Вы должны быть **Чемпионом гильдии** или выше, чтобы установить этот предмет в ваш никнейм!`,
                        ephemeral: true
                    })
                    typeChanged = 'косметический значок'
                    userData.displayname.symbol = value
                } else if (curType == types.FRAMES) {
                    if (userData.rank_number < 5) return int.reply({
                        content: `Вы должны быть **Звёздочкой гильдии** или выше, чтобы установить этот предмет в ваш никнейм!`,
                        ephemeral: true
                    })
                    typeChanged = 'косметическую рамку'
                    let frames = value.split("ИМЯ")
                    userData.displayname.ramka1 = frames[0]
                    userData.displayname.ramka2 = frames[1]
                } else if (curType == types.SUFFIXES) {
                    if (userData.rank_number < 8) return int.reply({
                        content: `Вы должны быть **Лордом гильдии** или выше, чтобы установить этот предмет в ваш никнейм!`,
                        ephemeral: true
                    })
                    typeChanged = 'косметический постфикс'
                    userData.displayname.suffix = value
                } else if (curType == types.RANKS) {
                    if (userData.rank_number < 10) return int.reply({
                        content: `Вы должны быть **Повелителем гильдии** или выше, чтобы установить этот предмет в ваш никнейм!`,
                        ephemeral: true
                    })
                    typeChanged = 'косметический значок ранга'
                    userData.displayname.rank = value
                    userData.displayname.custom_rank = true
                }

                userData.save()
                let nickname = `「${userData.displayname.rank}」${userData.displayname.ramka1}${userData.displayname.name}${userData.displayname.ramka2}${userData.displayname.suffix} ${userData.displayname.symbol}┇${userData.displayname.premium}`
                await int.reply({
                    content: `Вы изменили ${typeChanged}. Теперь ваш никнейм будет выглядеть так: \`${nickname}\`. Изменения вступят в силу в течение 15 минут. Если этого не произойдёт, обратитесь в вопрос-модерам!`,
                    ephemeral: true
                })
            } else if (int.customId == 'inv_rankbuy') {
                let userData = await inventory.getUserData();
                if (userData.rank_number < 10) return int.reply({
                    content: `Вы должны быть "Повелителем гильдии" или выше, чтобы приобрести значок ранга!`,
                    ephemeral: true
                })
                if (userData.rumbik < 400) return int.reply({
                    content: `У вас должно быть минимум 400 <:Rumbik:883638847056003072> для покупки своего значка ранга!`,
                    ephemeral: true
                })

                const modal = new ModalBuilder()
                    .setCustomId('inv_rank_setup')
                    .setTitle(`Установить значок ранга`)
                    .addComponents(
                        new ActionRowBuilder()
                            .addComponents(
                                new TextInputBuilder()
                                    .setCustomId(`inv_rank_emoji`)
                                    .setLabel(`Эмодзи значка ранга`)
                                    .setMaxLength(10)
                                    .setRequired(true)
                                    .setStyle(TextInputStyle.Short)
                                    .setPlaceholder(`Введите эмодзи, который хотите установить в качестве значка ранга.`)
                            )
                    )


                await int.showModal(modal);

                int.awaitModalSubmit({ time: 1_000_000_000 })
                    .then(async (inter) => {
                        const emoji = inter.fields.getTextInputValue('inv_rank_emoji');
                        if (!isOneEmoji(emoji)) return inter.reply({
                            content: `Введённый вами символ \`${emoji}\` не является эмодзи или не поддерживается!`,
                            ephemeral: true
                        })

                        userData.rumbik -= 400
                        userData.cosmetics_storage.rank.push(emoji)
                        userData.displayname.rank = emoji;
                        userData.displayname.custom_rank = true;
                        userData.save()

                        await inter.reply({
                            content: `Вы приобрели значок ранга \`${emoji}\`! В скором времени он появится в вашем никнейме!`,
                            ephemeral: true
                        })
                    })
                    .catch(async (e) => {

                    })
            } else if (int.customId == 'inv_setdefault') {
                let userData = await inventory.getUserData();
                if (userData.displayname.custom_rank == false) return int.reply({
                    content: `У вас уже установлен значок ранга по умолчанию!`,
                    ephemeral: true
                })

                userData.displayname.custom_rank = false
                userData.save();

                await int.reply({
                    content: `Вы установили значок ранга по умолчанию. В скором времени он будет изменён.`,
                    ephemeral: true
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
module.exports = {
    category: `items`,
    plugin: {
        id: "items",
        name: "Предметы"
    },
    data: new SlashCommandBuilder()
        .setName(`inventory`)
        .setDescription(`Инвентарь игрока`)
        .setDMPermission(false),
    execute
};