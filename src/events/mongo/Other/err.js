const chalk = require(`chalk`);
const linksInfo = require(`../../../discord structure/links.json`)
async function execute(err) {
    console.log(chalk.blackBright(`[${new Date()}]`) + chalk.red(`[Статус базы данных] Произошла ошибка
${err}`))
}

module.exports = {
    name: `err`,
    execute
}