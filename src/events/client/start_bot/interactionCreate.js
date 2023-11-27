const { InteractionType, AttachmentBuilder } = require(`discord.js`)
const { ClientSettings } = require(`../../../schemas/client`)
const chalk = require(`chalk`)
const { connection } = require("mongoose")
const fs = require(`fs`)
const { Guild } = require("../../../schemas/guilddata")
const { checkPlugin } = require("../../../functions");
let plugin = {
    id: "admin",
    name: "Административное"
}

/**
 * 
 * @param {import("discord.js").BaseInteraction} interaction Interaction
 * @param {import("../../misc_functions/Exporter").StarpixelClient} client Client
 * 
 * Interaction main function
 */
async function execute(interaction, client) {
    try {
        if (interaction.channel.id == `1052865050597150731` || interaction.channel.id == `1052865547563442207`) return interaction.reply({
            content: `Вы не можете использовать команды в данном канале!`,
            ephemeral: true
        })
        if (!await checkPlugin(interaction?.guild?.id, plugin.id)) return interaction.reply({
            content: `Бот гильдии в данное время недоступен!`,
            ephemeral: true
        })
        const guildData = await Guild.findOne({ id: interaction.guild.id })
        if (interaction.isChatInputCommand()) {

            const { commands } = client;
            const { commandName } = interaction;
            const command = commands.get(commandName);
            if (!command) return

            try {
                if (!guildData.plugins[command.plugin.id]) return interaction.reply({
                    content: `Плагин \`${command.plugin.name}\` в данный момент отключён! Повторите попытку позже!`,
                    ephemeral: true
                })
                await command.execute(interaction, client);
            } catch (error) {
                console.error(error)
                await interaction.editReply({
                    content: `Что-то пошло не так при выполнении данной команды!`,
                    ephemeral: true
                })
            }
        } else if (interaction.isButton()) {
            const { buttons } = client;
            const { customId } = interaction;
            const button = buttons.get(customId);
            if (!button) return new Error(`Нет кода для этой кнопочки :'(`);

            try {
                if (!guildData.plugins[button.plugin.id]) return interaction.reply({
                    content: `Плагин \`${button.plugin.name}\` в данный момент отключён! Повторите попытку позже!`,
                    ephemeral: true
                })
                await button.execute(interaction, client)
            } catch (err) {
                console.error(err)
            }
        } else if (interaction.type == InteractionType.ModalSubmit) {
            const { modals } = client;
            const { customId } = interaction;
            const modal = modals.get(customId)
            if (!modal) return new Error(`Нет кода для этой модели :'(`);
            try {
                if (!guildData.plugins[modal.plugin.id]) return interaction.reply({
                    content: `Плагин \`${modal.plugin.name}\` в данный момент отключён! Повторите попытку позже!`,
                    ephemeral: true
                })
                await modal.execute(interaction, client)
            } catch (error) {
                console.error(error)
            }
        } else if (interaction.isStringSelectMenu() || interaction.isUserSelectMenu() || interaction.isRoleSelectMenu() || interaction.isChannelSelectMenu()) {
            const { selectMenus } = client;
            const { customId } = interaction;
            const menu = selectMenus.get(customId);
            if (!menu) return new Error(`Нет кода для этого меню :'(`);

            try {
                if (!guildData.plugins[menu.plugin.id]) return interaction.reply({
                    content: `Плагин \`${menu.plugin.name}\` в данный момент отключён! Повторите попытку позже!`,
                    ephemeral: true
                })
                await menu.execute(interaction, client)
            } catch (err) {
                console.error(err)
            }
        } else if (interaction.isContextMenuCommand()) {

            const { commands } = client;
            const { commandName } = interaction;
            const contextCommand = commands.get(commandName);
            if (!contextCommand) return
            try {
                if (!guildData.plugins[contextCommand.plugin.id]) return interaction.reply({
                    content: `Плагин \`${contextCommand.plugin.name}\` в данный момент отключён! Повторите попытку позже!`,
                    ephemeral: true
                })
                await contextCommand.execute(interaction, client)
            } catch (error) {
                console.log(error)
            }
        } else if (interaction.type == InteractionType.ApplicationCommandAutocomplete) {
            const { commands } = client;
            const { commandName } = interaction;
            const command = commands.get(commandName);
            if (!command) return

            try {
                if (!guildData.plugins[command.plugin.id]) return interaction.reply({
                    content: `Плагин \`${command.plugin.name}\` в данный момент отключён! Повторите попытку позже!`,
                    ephemeral: true
                })
                await command.autoComplete(interaction, client)
            } catch (error) {
                console.log(error)
            }
        }
        let stream = await fs.createWriteStream(`./src/events/client/start_bot/Interaction Files/Interactions.json`)
        let json = JSON.stringify(interaction, (_, v) => typeof v === 'bigint' ? v.toString() : v)
        stream.once('open', function (fd) {
            stream.write(json);
            stream.end();
        });


        const guild = await client.guilds.fetch(`320193302844669959`)
        let interactionChannel = await guild.channels.fetch(`1057711111471911046`)
        let attach = new AttachmentBuilder()
            .setFile(`./src/events/client/start_bot/Interaction Files/Interactions.json`)
            .setName(`Interactions.json`)

        await interactionChannel.send({
            files: [attach]
        })

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
    name: 'interactionCreate',
    plugin: plugin,
    execute
}