const chalk = require(`chalk`);
async function execute() {
    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.red(`[Статус базы данных] Отключено`))
}

module.exports = {
    name: `disconnected`,
    execute
}