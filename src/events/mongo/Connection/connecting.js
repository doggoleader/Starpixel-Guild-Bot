const chalk = require(`chalk`);
    async function execute() {
        console.log(chalk.blackBright(`[${new Date()}]`) + chalk.cyan(`[Статус базы данных] Идёт подключение...`))
    }

module.exports = {
    name: `connecting`,
    execute
}