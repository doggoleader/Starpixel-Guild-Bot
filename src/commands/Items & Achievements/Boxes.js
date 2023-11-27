const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');
const { User } = require(`../../schemas/userdata`);
const chalk = require(`chalk`);
const ch_list = require(`../../discord structure/channels.json`)

/**
 * 
 * @param {import("discord.js").ChatInputCommandInteraction} interaction Interaction
 * @param {import("../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {

        const selectMenu = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(`boxes_menu`)
                    .setPlaceholder(`Выберите коробку`)
                    .addOptions(
                        {
                            label: `Большая коробка`,
                            emoji: `🎁`,
                            description: `Открыть большую коробку`,
                            value: `big`
                        },
                        {
                            label: `Ежедневная коробка`,
                            emoji: `🕑`,
                            description: `Открыть ежедневную коробку`,
                            value: `daily`
                        },
                        {
                            label: `Ежемесячная коробка`,
                            emoji: `🕑`,
                            description: `Открыть ежемесячную коробку`,
                            value: `monthly`
                        },
                        {
                            label: `Еженедельная коробка`,
                            emoji: `🕑`,
                            description: `Открыть еженедельную коробку`,
                            value: `weekly`
                        },
                        {
                            label: `Жуткая коробка`,
                            emoji: `🎃`,
                            description: `Открыть жуткую коробку`,
                            value: `spooky`
                        },
                        {
                            label: `Загадочная коробка`,
                            emoji: `🎁`,
                            description: `Открыть загадочную коробку`,
                            value: `mystery`
                        },
                        {
                            label: `Коробка активности`,
                            emoji: `🎁`,
                            description: `Открыть коробку активности`,
                            value: `activity`
                        },
                        {
                            label: `Коробка персонала`,
                            emoji: `💼`,
                            description: `Открыть коробку персонала`,
                            value: `staff`
                        },
                        {
                            label: `Королевская коробка`,
                            emoji: `🎁`,
                            description: `Открыть королевскую коробку`,
                            value: `king`
                        },
                        {
                            label: `Летняя коробка`,
                            emoji: `🌞`,
                            description: `Открыть летнюю коробку`,
                            value: `summer`
                        },
                        {
                            label: `Маленькая коробка`,
                            emoji: `🎁`,
                            description: `Открыть маленькую коробку`,
                            value: `small`
                        },
                        {
                            label: `Мешочек`,
                            emoji: `💰`,
                            description: `Открыть мешочек`,
                            value: `bag`
                        },
                        {
                            label: `Новогодний подарок`,
                            emoji: `🎁`,
                            description: `Открыть новогодний подарок`,
                            value: `present`
                        },
                        {
                            label: `Огромная коробка`,
                            emoji: `🎁`,
                            description: `Открыть огромную коробку`,
                            value: `mega`
                        },
                        {
                            label: `Пасхальное яйцо`,
                            emoji: `🥚`,
                            description: `Открыть пасхальную коробку`,
                            value: `easter`
                        },
                        {
                            label: `Подарок судьбы`,
                            emoji: `💼`,
                            description: `Открыть подарок судьбы`,
                            value: `myth`
                        },
                        {
                            label: `Сезонный победитель`,
                            emoji: `🏆`,
                            description: `Открыть коробку сезонного победителя`,
                            value: `seasonal_winner`
                        },
                        {
                            label: `Сокровище`,
                            emoji: `🎁`,
                            description: `Открыть сокровище`,
                            value: `treasure`
                        },
                        {
                            label: `Талисман счастья`,
                            emoji: `🧿`,
                            description: `Открыть талисман счастья`,
                            value: `prestige`
                        },
                    )
            )


        const embed = new EmbedBuilder()
            .setColor(Number(client.information.bot_color))
            .setTitle(`Меню коробок`)
            .setDescription(`Открыто меню коробок. Выберите коробку, которую хотите открыть. Желаю вам удачи в луте из коробок!`)
            .setTimestamp(Date.now())

        await interaction.reply({
            embeds: [embed],
            components: [selectMenu]
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
    category: `box`,
    plugin: {
        id: "items",
        name: "Предметы"
    },
    data: new SlashCommandBuilder()
        .setName(`boxes`)  //Название команды
        .setDescription(`Открыть меню открытия коробок`)
        .setDMPermission(false), //Описание команды
    execute
};