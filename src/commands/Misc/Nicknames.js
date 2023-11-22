const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

const wait = require('node:timers/promises').setTimeout;
const fetch = require(`node-fetch`);
const api = process.env.hypixel_apikey;
const { User } = require(`../../schemas/userdata`)
const { Guild } = require(`../../schemas/guilddata`)
const chalk = require(`chalk`);
const prettyMilliseconds = require(`pretty-ms`); //ДОБАВИТЬ В ДРУГИЕ
const linksInfo = require(`../../discord structure/links.json`)
const { isOneEmoji } = require(`is-emojis`);
const { rankName } = require('../../functions');

/**
 * 
 * @param {import("discord.js").ChatInputCommandInteraction} interaction Interaction
 * @param {import("../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        const { member, user, guild } = interaction

        const userData = await User.findOne({ userid: user.id, guildid: guild.id })
        switch (interaction.options.getSubcommandGroup()) {
            case `rank`: {
                if (userData.rank_number < 10) return interaction.reply({
                    content: `Вы не можете менять значок ранга, так как вы не достигли необходимого ранга!`,
                    ephemeral: true
                })
                switch (interaction.options.getSubcommand()) {
                    case `collections`: {
                        let emoji = interaction.options.getString(`значок`)
                        if (emoji == `🐶`) {
                            let coll = [`1020400007989444678`, `1020400017330163712`, `1020400015300120638`]
                            if (!member.roles.cache.has(coll[0]) || !member.roles.cache.has(coll[1]) || !member.roles.cache.has(coll[2])) return interaction.reply({
                                content: `Вы не собрали полностью коллекцию Собаки, поэтому не можете установить этот значок!`,
                                ephemeral: true
                            })

                            userData.displayname.rank = emoji
                            userData.displayname.custom_rank = true
                            userData.save()

                            await interaction.reply({
                                content: `Вы установили значок ранга \`${emoji}\`! В течение 15 минут он будет установлен!`,
                                ephemeral: true
                            })
                        } else if (emoji == `🐱`) {
                            let coll = [`1020400022350725122`, `1020400026045915167`, `1020400024397565962`]
                            if (!member.roles.cache.has(coll[0]) || !member.roles.cache.has(coll[1]) || !member.roles.cache.has(coll[2])) return interaction.reply({
                                content: `Вы не собрали полностью коллекцию Кота, поэтому не можете установить этот значок!`,
                                ephemeral: true
                            })

                            userData.displayname.rank = emoji
                            userData.displayname.custom_rank = true
                            userData.save()

                            await interaction.reply({
                                content: `Вы установили значок ранга \`${emoji}\`! В течение 15 минут он будет установлен!`,
                                ephemeral: true
                            })
                        } else if (emoji == `🐰`) {
                            let coll = [`1020400030575763587`, `1020400034853957713`, `1020400032651952168`]
                            if (!member.roles.cache.has(coll[0]) || !member.roles.cache.has(coll[1]) || !member.roles.cache.has(coll[2])) return interaction.reply({
                                content: `Вы не собрали полностью коллекцию Кролика, поэтому не можете установить этот значок!`,
                                ephemeral: true
                            })

                            userData.displayname.rank = emoji
                            userData.displayname.custom_rank = true
                            userData.save()

                            await interaction.reply({
                                content: `Вы установили значок ранга \`${emoji}\`! В течение 15 минут он будет установлен!`,
                                ephemeral: true
                            })
                        } else if (emoji == `🦊`) {
                            let coll = [`1020400043154485278`, `1020400047260696647`, `1020400045251633163`]
                            if (!member.roles.cache.has(coll[0]) || !member.roles.cache.has(coll[1]) || !member.roles.cache.has(coll[2])) return interaction.reply({
                                content: `Вы не собрали полностью коллекцию Лисы, поэтому не можете установить этот значок!`,
                                ephemeral: true
                            })

                            userData.displayname.rank = emoji
                            userData.displayname.custom_rank = true
                            userData.save()

                            await interaction.reply({
                                content: `Вы установили значок ранга \`${emoji}\`! В течение 15 минут он будет установлен!`,
                                ephemeral: true
                            })
                        } else if (emoji == `🦁`) {
                            let coll = [`1020400055812886529`, `1020400060636344440`, `1020400058543374388`]
                            if (!member.roles.cache.has(coll[0]) || !member.roles.cache.has(coll[1]) || !member.roles.cache.has(coll[2])) return interaction.reply({
                                content: `Вы не собрали полностью коллекцию Льва, поэтому не можете установить этот значок!`,
                                ephemeral: true
                            })

                            userData.displayname.rank = emoji
                            userData.displayname.custom_rank = true
                            userData.save()

                            await interaction.reply({
                                content: `Вы установили значок ранга \`${emoji}\`! В течение 15 минут он будет установлен!`,
                                ephemeral: true
                            })
                        }
                    }
                        break;
                    case `buy`: {
                        let emoji = interaction.options.getString(`значок`)
                        if (userData.sub_type < 4) return interaction.reply({
                            content: `Вы должны иметь подписку Premium, чтобы использовать эту команду!`,
                            ephemeral: true
                        })
                        let price = 400
                        if (userData.rumbik < price) return interaction.reply({
                            content: `У вас недостаточно румбиков, чтобы купить свой значок ранга!`,
                            ephemeral: true
                        })
                        if (isOneEmoji(emoji) == false) return interaction.reply({
                            content: `Данный символ не является эмоджи или не поддерживается!`,
                            ephemeral: true
                        })
                        userData.rumbik -= price
                        userData.displayname.rank = emoji
                        userData.displayname.custom_rank = true
                        userData.save()
                        await interaction.reply({
                            content: `Вы приобрели пользовательский эмоджи ранга за ${price}<:Rumbik:883638847056003072>! Он будет установлен в течение 15 минут!`,
                            ephemeral: true
                        })
                    }
                        break;
                    case `default`: {
                        if (userData.displayname.custom_rank == false) return interaction.reply({
                            content: `У вас уже установлен значок ранга по умолчанию! Если он до сих пор не отображается, пожалуйста, подождите 15 минут и обратитесь в вопрос-модерам!`,
                            ephemeral: true
                        })
                        userData.displayname.custom_rank = true
                        let emoji
                        if (userData.rank_number == 0) emoji = `🦋`
                        else if (userData.rank_number == 1) emoji = `🥥`
                        else if (userData.rank_number == 2) emoji = `🍕`
                        else if (userData.rank_number == 3) emoji = `🍂`
                        else if (userData.rank_number == 4) emoji = `🍁`
                        else if (userData.rank_number == 5) emoji = `⭐`
                        else if (userData.rank_number == 6) emoji = `🏅`
                        else if (userData.rank_number == 7) emoji = `🍓`
                        else if (userData.rank_number == 8) emoji = `🧨`
                        else if (userData.rank_number == 9) emoji = `💎`
                        else if (userData.rank_number == 10) emoji = `🍇`

                        userData.displayname.rank = emoji
                        userData.save()

                        await interaction.reply({
                            content: `Вы вернули свой значок ранга по умолчанию! В течение 15 минут вам будет установлен значок ранга \`${emoji} ${rankName(userData.rank_number)}`
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
    category: `nick`,
    plugin: {
        id: "nicknames",
        name: "Никнеймы"
    },
    data: new SlashCommandBuilder()
        .setName(`nickname`)
        .setDescription(`Изменить ваш никнейм`)
        .setDMPermission(false)
        .addSubcommandGroup(gr => gr
            .setName(`rank`)
            .setDescription(`Установить значок ранга`)
            .addSubcommand(sb => sb
                .setName(`collections`)
                .setDescription(`Установить значок ранга за собранную коллекцию`)
                .addStringOption(option => option
                    .setName(`значок`)
                    .setDescription(`Значок коллекции`)
                    .setRequired(true)
                    .setChoices(
                        {
                            name: `🐶`,
                            value: `🐶`
                        },
                        {
                            name: `🐱`,
                            value: `🐱`
                        },
                        {
                            name: `🐰`,
                            value: `🐰`
                        },
                        {
                            name: `🦊`,
                            value: `🦊`
                        },
                        {
                            name: `🦁`,
                            value: `🦁`
                        }
                    )
                )
            )
            .addSubcommand(sb => sb
                .setName(`buy`)
                .setDescription(`Приобрести значок для ранга`)
                .addStringOption(option => option
                    .setName(`значок`)
                    .setDescription(`Значок, который вы хотите установить`)
                    .setRequired(true)
                )
            )
            .addSubcommand(sb => sb
                .setName(`default`)
                .setDescription(`Установить значок ранга по умолчанию (значок вашего ранга)`)
            )

        ),
    execute
};