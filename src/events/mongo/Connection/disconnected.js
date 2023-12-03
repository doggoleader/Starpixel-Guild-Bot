const chalk = require(`chalk`);
async function execute(client) {
    try {
        console.log(chalk.blackBright(`[${new Date()}]`) + chalk.red(`[Статус базы данных] Отключено`))
    } catch (e) {
        const admin = await client.users.fetch(`491343958660874242`)
        console.log(e)
        await admin.send({
            content: `-> \`\`\`${e.stack}\`\`\``
        }).catch()
    }
}

module.exports = {
    name: `disconnected`,
    execute
}