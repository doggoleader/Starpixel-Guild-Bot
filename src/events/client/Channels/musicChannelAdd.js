const chalk = require(`chalk`);
const { ReactionCollector } = require("discord.js");
const { Guild } = require(`../../../schemas/guilddata`)
const { isURL } = require(`../../../functions`)
const linksInfo = require(`../../../discord structure/links.json`)
const { checkPlugin } = require("../../../functions");

module.exports = {
    name: 'messageReactionAdd',
    plugin: {
        id: "music",
        name: "Музыка"
    },
    async execute(reaction, user) {
        const guild = reaction.message?.guild
        if (!await checkPlugin(guild.id, this.plugin.id)) return
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                console.error('Произошла ошибка при обработке сообщения', error);

                return;
            }
        }

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

    }

}