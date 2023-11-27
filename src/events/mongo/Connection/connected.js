const chalk = require(`chalk`);
async function execute() {
    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.green(`[Статус базы данных] Подключено`))
}

module.exports = {
    name: `connected`,
    execute
}