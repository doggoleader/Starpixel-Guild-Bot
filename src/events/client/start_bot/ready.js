const chalk = require(`chalk`);
const wait = require("timers/promises").setTimeout;
const { Collection, EmbedBuilder } = require(`discord.js`)
const linksInfo = require(`../../../discord structure/links.json`);

module.exports = {
    name: 'ready',
    plugin: {
        id: "admin",
        name: "Административное"
    },
    once: true,
    async execute(client) {
        await wait(1000)
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
                .setColor(Number(linksInfo.bot_color))
                .setTimestamp(Date.now())

            await channel.send({
                embeds: [embed]
            })
        });
    }
}