const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, GuildMember, ButtonBuilder, ButtonStyle, UserSelectMenuBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

const fetch = require(`node-fetch`);
const api = process.env.hypixel_apikey;
const { User } = require(`../../schemas/userdata`)
const { Guild } = require(`../../schemas/guilddata`)
const chalk = require(`chalk`);

/**
 * 
 * @param {import("discord.js").ChatInputCommandInteraction} interaction Interaction
 * @param {import("../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        let settings = {
            magicID: null,
            memberFrom: interaction.member,
            memberTo: null
        }
        await interaction.deferReply({ ephemeral: true, fetchReply: true })
        const userData = await User.findOne({ userid: interaction.user.id })
        if (userData.rank_number < 1) return interaction.editReply({
            content: `Вы должны быть **Специалистом гильдии** или выше для использования магии гильдии!`
        })
        let options = []
        if (userData.rank_number >= 1) {
            options.push(
                {
                    label: `Заклинание ветра`,
                    value: `blow`,
                    emoji: `🌬️`,
                    description: `Заклинание мага уровня I`
                },
                {
                    label: `Заклинание холода`,
                    value: `cold`,
                    emoji: `🥶`,
                    description: `Заклинание мага уровня I`
                },
                {
                    label: `Заклинание огня`,
                    value: `flame`,
                    emoji: `🔥`,
                    description: `Заклинание мага уровня I`
                }
            )
        }
        if (userData.rank_number >= 4) {
            options.push(
                {
                    label: `Заклинание летучей мыши`,
                    value: `bat`,
                    emoji: `🦇`,
                    description: `Заклинание мага уровня II`
                },
                {
                    label: `Заклинание проклятия`,
                    value: `curse`,
                    emoji: `🈹`,
                    description: `Заклинание мага уровня II`
                },
                {
                    label: `Заклинания готовки зелий`,
                    value: `potion`,
                    emoji: `🍶`,
                    description: `Заклинание мага уровня II`
                }
            )
        }
        if (userData.rank_number >= 6) {
            options.push(
                {
                    label: `Заклинание вампира`,
                    value: `blood`,
                    emoji: `🩸`,
                    description: `Заклинание мага уровня III`
                },
                {
                    label: `Заклинание превращения в лягушку`,
                    value: `frog`,
                    emoji: `🐸`,
                    description: `Заклинание мага уровня III`
                },
                {
                    label: `Заклинание испуга`,
                    value: `scare`,
                    emoji: `😈`,
                    description: `Заклинание мага уровня III`
                }
            )
        }
        if (userData.rank_number >= 8) {
            options.push(
                {
                    label: `Заклинание атаки`,
                    value: `attack`,
                    emoji: `💪`,
                    description: `Заклинание мага уровня IV`
                },
                {
                    label: `Заклинание ухаживания`,
                    value: `baby`,
                    emoji: `❤`,
                    description: `Заклинание мага уровня IV`
                },
                {
                    label: `Заклинание сканирования`,
                    value: `scan`,
                    emoji: `🛡`,
                    description: `Заклинание мага уровня IV`
                }
            )
        }

        const menu = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(`magic_menu`)
                    .setDisabled(options.length <= 0)
                    .setOptions(options.length > 0 ? options : {
                        label: `Нет доступной магии`,
                        value: 'no_magic'
                    })
            )

        const embed = new EmbedBuilder()
            .setColor(Number(client.information.bot_color))
            .setDescription(`Выберите желаемое заклинание из перечня доступных!
- Заклинания мага первого уровня доступны со **СПЕЦИАЛИСТА ГИЛЬДИИ**
- Заклинания мага второго уровня доступны с **ЧЕМПИОНА ГИЛЬДИИ**
- Заклинания мага третьего уровня доступны с **ЛЕГЕНДЫ ГИЛЬДИИ**
- Заклинания мага четвёртого уровня доступны с **ЛОРДА ГИЛЬДИИ**`)

        const msg = await interaction.editReply({
            embeds: [embed],
            components: [menu]
        })
        const collector = await msg.createMessageComponentCollector();
        collector.on('collect', async (i) => {
            if (i.customId == `magic_menu`) {
                await i.deferUpdate()
                settings.magicID = i.values[0];

                const userMenu = new ActionRowBuilder()
                    .addComponents(
                        new UserSelectMenuBuilder()
                            .setCustomId(`magic_usermenu`)
                            .setPlaceholder(`Выберите человека`)
                    )

                const buttons = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`magic_back`)
                            .setLabel(`Назад`)
                            .setEmoji(`⬅`)
                            .setStyle(ButtonStyle.Danger)
                    )
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`magic_nouser`)
                            .setEmoji(`❌`)
                            .setLabel(`Без пользователя`)
                            .setStyle(ButtonStyle.Secondary)
                    )

                const embed2 = new EmbedBuilder()
                    .setColor(Number(client.information.bot_color))
                    .setDescription(`Выберите пользователя, на которого хотите подействовать своей магией в главном чате!
Выбирая "Без пользователя", вы действуете магией на весь чат.

Нажмите "Назад", чтобы изменить выбранное вами заклинание!`)

                await interaction.editReply({
                    embeds: [embed2],
                    components: [userMenu, buttons]
                })
            } else if (i.customId == `magic_usermenu`) {

                const memberTo = i.members.first();
                settings.memberTo = memberTo;

                const msg = getMessage(settings.magicID, settings.memberFrom, settings.memberTo);

                await i.reply({
                    content: `${msg}`
                })
            } else if (i.customId == `magic_back`) {
                await i.deferUpdate();
                settings.magicID = null;
                settings.memberTo = null;

                await interaction.editReply({
                    embeds: [embed],
                    components: [menu]
                })
            } else if (i.customId == `magic_nouser`) {
                settings.memberTo = null;

                const msg = getMessage(settings.magicID, settings.memberFrom, settings.memberTo);

                await i.reply({
                    content: `${msg}`
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
    category: `mag`,
    plugin: {
        id: "misc",
        name: "Разное"
    },
    data: new SlashCommandBuilder()
        .setName(`magic`)
        .setDescription(`Магия гильдии`)
        .setDMPermission(false),
    execute
};


/**
 * 
 * @param {String} id ID of available magic
 * @param {GuildMember} memberFrom Command Executor
 * @param {GuildMember=} memberTo Member of the Guild
 * @returns {String} The message of the used magic
 */
function getMessage(id, memberFrom, memberTo) {
    const strings = {
        "blow": `${memberFrom} :magic_wand:   :dash:  :cloud_tornado: ${memberTo ? memberTo : ""}`,
        "cold": `${memberFrom} :magic_wand:   :dash:  :cold_face: ${memberTo ? memberTo : ""}`,
        "flame": `${memberFrom} :magic_wand:   :dash:  :fire: ${memberTo ? memberTo : ""}`,
        "bat": `:bat: ${memberFrom} превращается в летучую мышь и покидает ${memberTo ? memberTo : "людей"}...`,
        "curse": `🈲 Проклятия... Они так ужасны... и поэтому ${memberFrom} накладывает на ${memberTo ? memberTo : "самого себя"} проклятие!`,
        "potion": `🍾 ${memberFrom} варит волшебное зелье... Скорее всего, ${memberTo ? memberTo : "кто-то"} скоро будет отравлен....`,
        "blood": `🩸 ${memberFrom} высасывает из ${memberTo ? memberTo : "воздуха"} всю кровь! Становится жутко..`,
        "frog": `:frog: ${memberFrom} превращает${memberTo ? ` <@` + memberTo.id + `>` : "ся"} в лягушку... Какая жалость!`,
        "scare": `👻 Перед ${memberTo ? memberTo : "кошкой"} становится темно, начинается гроза... Внезапно появляется ${memberFrom} и пугает ${memberTo ? memberTo : "кошку"}.`,
        "attack": `◾

${memberFrom} атакует ${memberTo ? memberTo : "самого себя"}.
:left_facing_fist::robot::right_facing_fist:

◾`,
        "baby": `◾

${memberFrom} %%word%% ${memberTo ? memberTo : "самого себя"}.
:robot:  :heart: 

◾`,
        "scan": `◾

${memberFrom} сканирует ${memberTo ? memberTo : "самого себя"}.
:robot: Он говорит, что этот человек любит %%word%%.

◾`
    }

    let finalWord = strings[id]
    if (id == 'baby') {
        let choose = [`целует`, `укутывает`, `обнимает`, `смотрит на`]
        let item = choose[Math.floor(Math.random() * choose.length)]
        finalWord = finalWord.replace(`%%word%%`, item)
    } else if (id == 'scan') {
        const choose = [`покушать`, `учиться`, `наблюдать за звёздами`, `поспать`, `поиграть`, `свою гильдию`, `участников гильдии`, `няню`, `себя`]
        let item = choose[Math.floor(Math.random() * choose.length)]
        finalWord = finalWord.replace(`%%word%%`, item)
    }
    return finalWord;
}