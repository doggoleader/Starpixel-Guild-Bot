const chalk = require(`chalk`);
const wait = require("timers/promises").setTimeout;
const { Collection, EmbedBuilder } = require(`discord.js`)

let plugin = {
    id: "admin",
    name: "Административное"
}
/**
 * 
 * @param {import("../../../misc_functions/Exporter").StarpixelClient} client Client
 */
async function execute(client) {
    try {
        await wait(1000)
        await client.application.commands.fetch();
        await client.setupMusicPlugin();
        console.log(chalk.blackBright(`[${new Date()}]`) + chalk.blue(`[Бот Starpixel] Бот был успешно запущен!`))
        const { invites } = client
        client.guilds.cache.forEach(async (guild) => {

            const firstInvites = await guild.invites.fetch();

            await invites.set(guild.id, new Collection(firstInvites.map((invite) => [invite.code, invite.uses])));
            console.log(chalk.blackBright(`[${new Date()}]`) + chalk.blue(`[Бот Starpixel] Приглашения обработаны!`))

            const channel = await guild.channels.fetch(`982551755340537866`)
            const timestamp = Math.round(Date.now() / 1000)
            const embed = new EmbedBuilder()
                .setTitle(`Бот запущен!`)
                .setDescription(`Бот ${client.user} был успешно запущен на сервере \`${guild.name}\`! Команды можно использовать! <t:${timestamp}:R>`)
                .setColor(Number(client.information.bot_color))
                .setTimestamp(Date.now())

            await channel.send({
                embeds: [embed]
            })
        });
    } catch (e) {
        const admin = await client.users.fetch(`491343958660874242`)
        console.log(e)
        await admin.send({
            content: `-> \`\`\`${e.stack}\`\`\``
        }).catch()
    }
}
module.exports = {
    name: 'ready',
    plugin: plugin,
    once: true,
    execute
}