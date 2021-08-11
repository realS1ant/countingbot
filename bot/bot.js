const djs = require('discord.js');
const client = new djs.Client({
    intents: [djs.Intents.FLAGS.GUILD_MESSAGES, djs.Intents.FLAGS.GUILDS],
});
const { REST, CDN } = require('@discordjs/rest');
const fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

client.commands = new djs.Collection();

mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    }
)
    .then(() => {
        console.log("Connected to Database!");
    }, (reason) => {
        console.error(`Failed Database Connection!\n${reason}`);
    });

client.once('ready', () => {
    console.log(`${client.user.username}#${client.user.discriminator} is ready.`);
});

//Events
fs.readdirSync('./bot/listeners').forEach(fileName => {
    const eventFile = require(`./listeners/${fileName}`);
    client.on(eventFile.event, (...args) => eventFile.execute(client, ...args));
});

//Commands
fs.readdirSync('./bot/commands').forEach(fileName => {
    const cmdFile = require(`./commands/${fileName}`);
    client.commands.set(cmdFile.data.name, cmdFile);
});

const rest = new REST({ version: 9 }).setToken(process.env.BOT_TOKEN);

async function loadSlashCommands() {
    try {
        console.log('Loading commands...')

        const body = client.commands.mapValues(val => val.data.toJSON());

        await rest.put(
            process.env.ENV == 'DEV' ? process.env.TEST_URL : process.env.PROD_URL,
            // { body: [...client.commands.values()] },
            { body },
        );

        console.log('Loaded commands!');
    } catch (err) {
        console.error(err);
    }
}

loadSlashCommands();

client.login(process.env.BOT_TOKEN);