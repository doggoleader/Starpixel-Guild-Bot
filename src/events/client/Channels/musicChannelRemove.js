const chalk = require(`chalk`);
const { EmbedBuilder } = require("discord.js");
const { Guild } = require(`../../../schemas/guilddata`)
const { isURL } = require(`../../../functions`)
const linksInfo = require(`../../../discord structure/links.json`)
const { checkPlugin } = require("../../../functions");

module.exports = {
    name: 'messageReactionRemove',
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
            if (reaction.message.reactions.cache.get(`❤️`).count < 5 && reaction.message.pinned === true) {
                reaction.message.unpin(`Меньше 5 ❤️!`);
                const words = reaction.message.content.split(` `)
                const link = words.find(word => {
                    if (isURL(word) == true) return word
                });
                const i = guildData.guildgames.music.findIndex(music => music.link == link)
                guildData.guildgames.music.splice(i, 1)
                guildData.save()
                console.log(chalk.blackBright(`[${new Date()}]`) + chalk.green(`[Убрано закрепленное сообщение]`) + chalk.gray(`: Сообщение: ${reaction.message.url}`))
            }
            console.log(chalk.blackBright(`[${new Date()}]`) + chalk.green(`[Убрана реакция]`) + chalk.gray(`: Сообщение ${reaction.message.url} имеет теперь ${reaction.message.reactions.cache.get(`❤️`).count}❤️`))
        }
    }
}