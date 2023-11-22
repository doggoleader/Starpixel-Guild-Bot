require('dotenv').config();
const chalk = require(`chalk`)
const { connect, set } = require(`mongoose`)
const { Client, Collection, GatewayIntentBits, Partials, ActivityType, Options } = require('discord.js');
const fs = require('fs');
const { DisTube } = require(`distube`);
const { setInterval } = require('timers/promises')
const Nodeactyl = require('nodeactyl')
const { StarpixelClient } = require(`./misc_functions/Exporter`)



const client = new StarpixelClient({
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

//Handlers
client.handleEvents();
client.handleCommands();
client.handleComponents();
client.startFunctions();


(async () => {
    set('strictQuery', true);
    //set('debug', true)
    await connect(process.env.databaseToken).catch(console.error)
})();

client.login(process.env.token)

process.on('warning', e => console.warn(e.stack))
