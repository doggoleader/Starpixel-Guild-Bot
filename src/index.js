require('dotenv').config();
const chalk = require(`chalk`)
const { connect, set } = require(`mongoose`)
const { Client, Collection, GatewayIntentBits, Partials, ActivityType, Options } = require('discord.js');
const fs = require('fs');
const { DisTube } = require(`distube`);
const { setInterval } = require('timers/promises')
const Nodeactyl = require('nodeactyl')

const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessageReactions, //1
        GatewayIntentBits.DirectMessageTyping, //2
        GatewayIntentBits.DirectMessages, //3
        GatewayIntentBits.GuildModeration, //4
        GatewayIntentBits.GuildEmojisAndStickers, //5
        GatewayIntentBits.GuildIntegrations, //6
        GatewayIntentBits.GuildInvites, //7
        GatewayIntentBits.GuildMembers, //8
        GatewayIntentBits.GuildMessageReactions, //9
        GatewayIntentBits.GuildMessageTyping, //10
        GatewayIntentBits.GuildMessages, //11
        GatewayIntentBits.GuildPresences, //12
        GatewayIntentBits.GuildScheduledEvents, //13
        GatewayIntentBits.GuildVoiceStates, //14
        GatewayIntentBits.GuildWebhooks, //15
        GatewayIntentBits.Guilds, //16
        GatewayIntentBits.MessageContent, //17
        GatewayIntentBits.AutoModerationConfiguration, //18
        GatewayIntentBits.AutoModerationExecution, //19
        
    ],
    partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.GuildScheduledEvent,
        Partials.Message,
        Partials.Reaction,
        Partials.ThreadMember,
        Partials.User,
    ],
    presence: {
        status: `online`,
        activities: [{
            type: ActivityType.Custom,
            name: `Работаю на гильдию Starpixel. Присоединяйтесь к гильдии по ссылке: https://discord.gg/CjNwZfSvej!`,
            state: "👋 Работаю на гильдию Starpixel. Присоединяйтесь к гильдии по ссылке: https://discord.gg/CjNwZfSvej!",
        }]
    }
});

client.distube = new DisTube(client, {
    leaveOnEmpty: true,
    emptyCooldown: 300,
    leaveOnFinish: false,
    leaveOnStop: false,
    savePreviousSongs: true,
    searchSongs: 5,
    searchCooldown: 30,
    nsfw: true,
    emitAddListWhenCreatingQueue: true,
    emitAddSongWhenCreatingQueue: true,
    joinNewVoiceChannel: true,
    directLink: true,
})


client.commands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();
client.selectMenus = new Collection();
client.voiceManager = new Collection();
client.invites = new Collection()

client.commandArray = [];


let i = 1
const functionFolders1 = fs.readdirSync('./src/functions');
for (const folder of functionFolders1) {
    const functionFiles = fs
        .readdirSync(`./src/functions/${folder}`)
        .filter((file) => file.endsWith(`.js`));
    for (const file of functionFiles) {
        require(`./functions/${folder}/${file}`)(client);
        console.log(chalk.blackBright(`[${new Date()}]`) + chalk.hex(`#3d1b33`)(`[ЗАГРУЗКА ФУНКЦИЙ] ${i++}. ${file} был успешно загружен!`))
    }
}

//Handlers
client.handleCommands();
client.handleComponents();
client.repeatFunctions();
client.handleEvents();


(async () => {
    set('strictQuery', true);
    //set('debug', true)
    await connect(process.env.databaseToken).catch(console.error)
})();

client.login(process.env.token);


process.on('warning', e => console.warn(e.stack))
