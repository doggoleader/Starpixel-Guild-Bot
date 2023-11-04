const chalk = require(`chalk`);
const linksInfo = require(`../../../discord structure/links.json`)

module.exports = {
    name: `disconnected`,
    execute() {
        console.log(chalk.blackBright(`[${new Date()}]`) + chalk.red(`[Статус базы данных] Отключено`))
    }
}