const chalk = require(`chalk`);
const linksInfo = require(`../../../discord structure/links.json`)
async function execute() {
    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.red(`[Статус базы данных] Отключено`))
}

module.exports = {
    name: `disconnected`,
    execute
}