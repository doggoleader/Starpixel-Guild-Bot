const fs = require('fs');
const { connection } = require(`mongoose`)
const chalk = require(`chalk`)
const linksInfo = require(`../../discord structure/links.json`)
const wait = require(`node:timers/promises`).setTimeout
const plugin = {
    id: "admin",
    name: "Административное"
}

module.exports = (client) => {
    client.handleEvents = async () => {
        const folders = fs.readdirSync('./src/events');
        let i = 1
        for (const folder of folders) {
            const eventFolders = fs
                .readdirSync(`./src/events/${folder}`)
            switch (folder) {
                case "client":
                    for (const eventFolder of eventFolders) {
                        const eventFiles = fs
                            .readdirSync(`./src/events/${folder}/${eventFolder}`)
                            .filter((file) => file.endsWith(`.js`));;

                        for (const file of eventFiles) {
                            const event = require(`../../events/${folder}/${eventFolder}/${file}`)
                            if (event.once) client.once(event.name, (...args) => event.execute(...args, client))
                            else client.on(event.name, (...args) => event.execute(...args, client));
                            console.log(chalk.blackBright(`[${new Date()}]`) + chalk.hex(`#707070`)(`[ЗАГРУЗКА СОБЫТИЙ] ${i++}. ${file} был успешно загружен! (Discord.js)`))
                        }

                    }
                    break;



                case "mongo": {
                    for (const eventFolder of eventFolders) {
                        const eventFiles = fs
                            .readdirSync(`./src/events/${folder}/${eventFolder}`)
                            .filter((file) => file.endsWith(`.js`));;

                        for (const file of eventFiles) {
                            const event = require(`../../events/${folder}/${eventFolder}/${file}`)
                            if (event.once) connection.once(event.name, (...args) => event.execute(...args, client))
                            else connection.on(event.name, (...args) => event.execute(...args, client));
                            console.log(chalk.blackBright(`[${new Date()}]`) + chalk.hex(`#707070`)(`[ЗАГРУЗКА СОБЫТИЙ] ${i++}. ${file} был успешно загружен! (MongoDB)`))
                        }

                    }
                }
                    break;

                case "distube": {
                    for (const eventFolder of eventFolders) {
                        const eventFiles = fs
                            .readdirSync(`./src/events/${folder}/${eventFolder}`)
                            .filter((file) => file.endsWith(`.js`));;

                        for (const file of eventFiles) {
                            const event = require(`../../events/${folder}/${eventFolder}/${file}`)
                            if (event.once) client.distube.once(event.name, (...args) => event.execute(...args, client))
                            else client.distube.on(event.name, (...args) => event.execute(...args, client));
                            console.log(chalk.blackBright(`[${new Date()}]`) + chalk.hex(`#707070`)(`[ЗАГРУЗКА СОБЫТИЙ] ${i++}. ${file} был успешно загружен! (Distube)`))
                        }

                    }
                }
                    break;
                /* case "hypixelbot": {
                    for (const eventFolder of eventFolders) {
                        const eventFiles = fs
                            .readdirSync(`./src/events/${folder}/${eventFolder}`)
                            .filter((file) => file.endsWith(`.js`));;

                        for (const file of eventFiles) {
                            const event = require(`../../events/${folder}/${eventFolder}/${file}`)
                            if (event.once) McClient.once(event.name, (...args) => event.execute(...args, client))
                            else McClient.on(event.name, (...args) => event.execute(...args, client));
                            console.log(chalk.blackBright(`[${new Date()}]`) + chalk.hex(`#707070`)(`[ЗАГРУЗКА СОБЫТИЙ] ${i++}. ${file} был успешно загружен! (Hypixel Bot)`))
                        }

                    }
                }
                    break; */
                default:
                    break;
            }
        };

        console.log(chalk.blackBright(`[${new Date()}]`) + chalk.blue(`[Бот Starpixel] События запущены!`))

    }
}