const chalk = require(`chalk`);
const { ReactionCollector } = require("discord.js");
const { Guild } = require(`../../../schemas/guilddata`)
const { isURL } = require(`../../../functions`)
const { checkPlugin } = require("../../../functions");
let plugin = {
    id: "music",
    name: "Музыка"
}
async function execute(reaction, user, client) {
    try {
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                console.error('Произошла ошибка при обработке сообщения', error);

                return;
            }
        }
        const guild = reaction.message?.guild
        if (!await checkPlugin(guild.id, plugin.id)) return

        if (reaction.message.channel.id == `967754140199555163` && reaction.emoji.name == `❤️`) {
            if (reaction.message.reactions.cache.get(`❤️`).count >= 5) {
                reaction.message.pin(`Получено 5 ❤️!`);
                const words = reaction.message.content.split(` `)
                const link = words.find(word => {
                    if (isURL(word) == true) return word
                });
                let i = guildData.guildgames.music.find(l => l.link == link)
                if (!i) {
                    guildData.guildgames.music.push({
                        link: link,
                        sent: reaction.message.author.id
                    })
                }
                guildData.save()
                console.log(chalk.blackBright(`[${new Date()}]`) + chalk.green(`[Закреплено сообщение]`) + chalk.gray(`: Сообщение: ${reaction.message.url}`))
            }
            console.log(chalk.blackBright(`[${new Date()}]`) + chalk.green(`[Добавлена реакция]`) + chalk.gray(`: Сообщение ${reaction.message.url} имеет теперь ${reaction.message.reactions.cache.get(`❤️`).count}❤️`))

        };
    } catch (e) {
        const admin = await client.users.fetch(`491343958660874242`)
        console.log(e)
        await admin.send({
            content: `-> \`\`\`${e.stack}\`\`\``
        }).catch()
    }

}

module.exports = {
    name: 'messageReactionAdd',
    plugin: plugin,
    execute

}