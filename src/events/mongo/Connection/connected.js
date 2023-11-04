const chalk = require(`chalk`);
const linksInfo = require(`../../../discord structure/links.json`)

module.exports = {
    name: `connected`,
    execute() {
        console.log(chalk.blackBright(`[${new Date()}]`) + chalk.green(`[Статус базы данных] Подключено`))
    }
}