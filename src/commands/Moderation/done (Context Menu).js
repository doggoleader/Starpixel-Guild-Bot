const { SlashCommandBuilder, EmbedBuilder, Embed, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, ContextMenuCommandBuilder, ApplicationCommandType, ModalBuilder, TextInputAssertions, TextInputComponent, TextInputBuilder, TextInputStyle } = require('discord.js');

const wait = require('node:timers/promises').setTimeout;
const ch_list = require(`../../discord structure/channels.json`)
const chalk = require(`chalk`)

/**
 * 
 * @param {import("discord.js").ChatInputCommandInteraction} interaction Interaction
 * @param {import("../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        const { member, user, guild, channel } = interaction
        const message = interaction.targetMessage
        const embed = new EmbedBuilder()
            .setAuthor({
                name: `❗ Отсутствует необходимая роль!`
            })
            .setDescription(`Вы не имеете роль \`${interaction.guild.roles.cache.get(`563793535250464809`).name}\`!`)
            .setThumbnail(`https://i.imgur.com/6IE3lz7.png`)
            .setColor(`DarkRed`)
            .setTimestamp(Date.now())

        if (!interaction.member.roles.cache.has(`563793535250464809`)) return interaction.reply({
            embeds: [embed],
            ephemeral: true
        })
        if (interaction.channel.id !== ch_list.ask) return interaction.reply({
            content: `Вы не можете использовать это в этом канале!`,
            ephemeral: true
        })
        const modal = new ModalBuilder()
            .setCustomId(`answer`)
            .setTitle(`Ответить на вопрос`)
            .addComponents(
                new ActionRowBuilder()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId(`comment`)
                            .setLabel(`Комментарий`)
                            .setMaxLength(1500)
                            .setRequired(false)
                            .setPlaceholder(`Комментарий к вопросу участника`)
                            .setStyle(TextInputStyle.Paragraph)
                    )
            )
        await interaction.showModal(modal)
        const filter = (int) => int.customId === 'answer';
        interaction.awaitModalSubmit({ filter, time: 10000000 })
            .then(async (int) => {
                let comment = int.fields.getTextInputValue(`comment`)
                const button_done = new ButtonBuilder()
                    .setCustomId('done')
                    .setLabel('Спасибо!')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji(`👌`);

                const done2 = new EmbedBuilder()
                    .setColor(Number(client.information.bot_color))
                    .setAuthor({
                        name: `Просьба обработана`
                    })
                    .setDescription(`Просьба ${message.author} была обработана офицером ${member}!`)
                await int.reply({
                    embeds: [done2]
                })

                if (!comment) {
                    const done = new EmbedBuilder()
                        .setAuthor({
                            name: `Спасибо за обращение в вопрос-модерам!`
                        })
                        .setColor(Number(client.information.bot_color))
                        .setTimestamp(Date.now())
                        .setDescription(`:envelope: Спасибо за обращение в вопрос-модерам. Ваша просьба была обработана!
                            
**Вопрос** ${message.content}`)
                        .addFields([{
                            name: `С уважением, офицер`, value: `${member}`
                        }]);
                    let msg
                    if (message.member.roles.cache.has(`504887113649750016`)) {
                        msg = await interaction.guild.channels.cache.get(ch_list.main).send({
                            content: `${message.author}`,
                            embeds: [done],
                            components: [new ActionRowBuilder().addComponents(button_done)]
                        })
                    } else {
                        msg = await interaction.guild.channels.cache.get(ch_list.guest).send({
                            content: `${message.author}`,
                            embeds: [done],
                            components: [new ActionRowBuilder().addComponents(button_done)]
                        })
                    }


                    const filter = i => i.customId === 'done';

                    const collector = msg.createMessageComponentCollector({ filter, componentType: ComponentType.Button });

                    collector.on('collect', async i => {
                        if (i.user.id === message.author.id) {
                            button_done.setDisabled(true)
                            await i.reply({
                                content: `Если будут вопросы, обращайтесь в канал <#849516805529927700>!`,
                                ephemeral: true
                            })
                            await msg.edit({
                                content: `${message.author}`,
                                embeds: [done],
                                components: [new ActionRowBuilder().addComponents(button_done)]
                            })
                            collector.stop()
                        } else {
                            await i.reply({ content: `Вы не можете использовать данную кнопочку!`, ephemeral: true });
                        }
                    });

                    collector.on('end', async collected => {
                        await button_done.setDisabled(true)
                        await msg.edit({
                            content: `${message.author}`,
                            embeds: [done],
                            components: [new ActionRowBuilder().addComponents(button_done)]
                        })
                    });
                    await message.react(`✅`)
                } else {
                    const done = new EmbedBuilder()
                        .setAuthor({
                            name: `Спасибо за обращение в вопрос-модерам!`
                        })
                        .setDescription(`:envelope: Спасибо за обращение в вопрос-модерам. Ваша просьба была обработана!
                            
**Вопрос** ${message.content}
**Комментарий** ${comment}`)
                        .setColor(Number(client.information.bot_color))
                        .setTimestamp(Date.now())
                        .addFields([{
                            name: `С уважением, офицер`, value: `${member}`
                        }]);

                    const msg = await interaction.guild.channels.cache.get(ch_list.main).send({
                        content: `${message.author}`,
                        embeds: [done],
                        components: [new ActionRowBuilder().addComponents(button_done)]


                    });
                    const filter = i => i.customId === 'done';

                    const collector = msg.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 600000, });

                    collector.on('collect', async i => {
                        if (i.user.id === message.author.id) {
                            button_done.setDisabled(true)
                            await i.reply({
                                content: `Если будут вопросы, обращайтесь в канал <#849516805529927700>!`,
                                ephemeral: true
                            })
                            await msg.edit({
                                content: `${message.author}`,
                                embeds: [done],
                                components: [new ActionRowBuilder().addComponents(button_done)]
                            })
                        } else {
                            await i.reply({ content: `Вы не можете использовать данную кнопочку!`, ephemeral: true });
                        }
                    });

                    collector.on('end', async collected => {
                        await button_done.setDisabled(true)
                        await msg.edit({
                            content: `${message.author}`,
                            embeds: [done],
                            components: [new ActionRowBuilder().addComponents(button_done)]
                        })
                    });

                    await message.react(`✅`)
                };
            })
            .catch(async err => {
                console.log(err)
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
    category: `officer`,
    plugin: {
        id: "admin",
        name: "Административное"
    },
    data: new ContextMenuCommandBuilder()
        .setType(ApplicationCommandType.Message)
        .setName(`Ответить на вопрос`)
        .setDMPermission(false),
    execute
}