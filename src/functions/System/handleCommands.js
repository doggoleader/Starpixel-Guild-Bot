const { REST } = require('@discordjs/rest');
const { Routes } = require(`discord-api-types/v10`);
const fs = require('fs');
const chalk = require(`chalk`)
const linksInfo = require(`../../discord structure/links.json`)
const plugin = {
    id: "admin",
    name: "Административное"
}

module.exports = (client) => {
    client.handleCommands = async () => {
        const commandFolders = fs.readdirSync('./src/commands');
        let i = 1
        for (const folder of commandFolders) {
            const commandFiles = fs
                .readdirSync(`./src/commands/${folder}`)
                .filter((file) => file.endsWith('.js'));

            const { commands, commandArray } = client;
            for (const file of commandFiles) {
                const command = require(`../../commands/${folder}/${file}`);
                client.commands.set(command.data.name, command);
                commandArray.push(command.data.toJSON());
                console.log(chalk.blackBright(`[${new Date()}]`) + chalk.hex(`#535b83`)(`[ЗАГРУЗКА КОМАНД] ${i++}. ${file} был успешно загружен!`))
            }
        }

        const clientId = '883421063369859122';
        const guildId = '320193302844669959';
        const rest = new REST({ version: '9' }).setToken(process.env.token);
        try {
            console.log(chalk.blackBright(`[${new Date()}]`) + chalk.blue(`[Бот Starpixel] Обновление команд приложения...`));

            await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
                body: [],
            });
            await rest.put(Routes.applicationCommands(clientId), { body: client.commandArray })
            console.log(chalk.blackBright(`[${new Date()}]`) + chalk.blue(`[Бот Starpixel] Команды обновлены.`));
        } catch (error) {
            console.error(error);
        }
    };
};