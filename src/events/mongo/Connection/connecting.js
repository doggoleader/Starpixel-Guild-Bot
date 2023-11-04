const chalk = require(`chalk`);
const linksInfo = require(`../../../discord structure/links.json`)

module.exports = {
    name: `connecting`,
    async execute() {
        console.log(chalk.blackBright(`[${new Date()}]`) + chalk.cyan(`[Статус базы данных] Идёт подключение...`))
    }
}