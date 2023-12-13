const { ButtonBuilder, ChannelType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const { Tickets } = require(`../../../schemas/tickets`)
const { TicketsUser } = require(`../../../schemas/ticketUser`)
const { Guild } = require(`../../../schemas/guilddata`)
const { User } = require(`../../../schemas/userdata`)

const { Temp } = require("../../../schemas/temp_items");
const { mentionCommand, calcCooldown } = require('../../../functions');
/**
 * 
 * @param {import("discord.js").ButtonInteraction} interaction Interaction
 * @param {import("../../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        const userData = await User.findOne({ userid: interaction.user.id, guildid: interaction.guild.id })

        if (userData.cooldowns.ny_santa_rew > Date.now()) //ДОБАВИТЬ В ДРУГИЕ(ГДЕ КУЛДАУН)
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(Number(client.information.bot_color))
                        .setAuthor({
                            name: `Вы не можете использовать эту команду`
                        })
                        .setDescription(`Данная команда сейчас находится на перезарядке, вы сможете её использовать через ${calcCooldown(userData.cooldowns.ny_santa_rew - Date.now())}!`)
                ],
                ephemeral: true
            });

        const boxes = [
            "925799156679856240",
            "521248091853291540",
            "992820494900412456"
        ]
        let rb = boxes[Math.floor(Math.random() * boxes.length)]
        if (interaction.member.roles.cache.has(rb)) {
            if (userData.stacked_items.length < userData.upgrades.inventory_size) {
                await userData.stacked_items.push(rb)
                await interaction.reply({
                    content: `Награда была добавлена в инвентарь! Чтобы получить награду, откройте коробки и пропишите команду ${mentionCommand(client, 'inventory')}! Для просмотра списка неполученных наград пропишите ${mentionCommand(client, 'inventory')}!`,
                    ephemeral: true
                })
            } else return interaction.reply({
                content: `Мы не можем добавить предмет в ваш инвентарь, так как он переполнен. Чтобы увеличить вместительность своего инвентаря, перейдите в канал <#1141026403765211136>!`,
                ephemeral: true
            })
        } else {
            await interaction.member.roles.add(rb)
        }
        userData.cooldowns.ny_santa_rew = Date.now() + (1000 * 60 * 60 * 24 * 4) * (1 - (userData.perks.decrease_cooldowns * 0.1))
        if (userData.cd_remind.includes('ny_santa_rew')) {
            let ITEM_ID = userData.cd_remind.findIndex(item_id => item_id == 'ny_santa_rew')
            userData.cd_remind.splice(ITEM_ID, 1)
        }
        userData.save()
        await interaction.reply({
            content: `Вы получили <@&${rb}> от Деда Мороза!`,
            ephemeral: true
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
    plugin: {
        id: "seasonal",
        name: "Сезонное"
    },
    data: {
        name: `get_reward`
    },
    execute
}
