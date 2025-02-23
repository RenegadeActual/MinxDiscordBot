const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits } = require('discord.js');
const { token, prefix } = require('./config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// Load all event handlers dynamically
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    client.on(event.name, (...args) => event.execute(...args, client));
}

// Define prefix globally for message commands
client.prefix = prefix;

// Start the bot
client.login(token);
