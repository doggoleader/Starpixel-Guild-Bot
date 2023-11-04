const fs = require('fs');
const chalk = require(`chalk`);
const linksInfo = require(`../../discord structure/links.json`)
const plugin = {
    id: "admin",
    name: "Административное"
}

module.exports = (client) => {
    client.handleComponents = async () => {
        const folders = fs.readdirSync('./src/components');
        for (const folder of folders) {
            const componentFolder = fs
                .readdirSync(`./src/components/${folder}`)

            const { buttons, modals, selectMenus } = client;
            switch (folder) {
                case "buttons": {
                    let i = 1
                    for (const buttonFolder of componentFolder) {
                        const buttonFiles = fs
                            .readdirSync(`./src/components/${folder}/${buttonFolder}`)
                            .filter(file => file.endsWith(`.js`))
                        for (const file of buttonFiles) {
                            const button = require(`../../components/${folder}/${buttonFolder}/${file}`)
                            buttons.set(button.data.name, button)
                            console.log(chalk.blackBright(`[${new Date()}]`) + chalk.hex(`#63fffb`)(`[ЗАГРУЗКА КНОПОК] ${i++}. ${file} был успешно загружен!`))
                        }
                    }
                }
                    break;



                case "modals": {
                    let i = 1
                    for (const modalFolder of componentFolder) {
                        const modalFiles = fs
                            .readdirSync(`./src/components/${folder}/${modalFolder}`)
                            .filter((file) => file.endsWith(`.js`));;

                        for (const file of modalFiles) {
                            const modal = require(`../../components/${folder}/${modalFolder}/${file}`)
                            modals.set(modal.data.name, modal)
                            console.log(chalk.blackBright(`[${new Date()}]`) + chalk.hex(`#9370d8`)(`[ЗАГРУЗКА ФОРМ] ${i++}. ${file} был успешно загружен!`))
                        }

                    }
                }
                    break;

                case "selectMenus": {
                    let i = 1
                    for (const selectMenuFolder of componentFolder) {
                        const selectMenuFiles = fs
                            .readdirSync(`./src/components/${folder}/${selectMenuFolder}`)
                            .filter((file) => file.endsWith(`.js`));;

                        for (const file of selectMenuFiles) {
                            const selectMenu = require(`../../components/${folder}/${selectMenuFolder}/${file}`)
                            selectMenus.set(selectMenu.data.name, selectMenu)
                            console.log(chalk.blackBright(`[${new Date()}]`) + chalk.hex(`#fdda64`)(`[ЗАГРУЗКА МЕНЮ] ${i++}. ${file} был успешно загружен!`))
                        }

                    }
                }
                    break;

                default:
                    break;
            }
        };
    }
}