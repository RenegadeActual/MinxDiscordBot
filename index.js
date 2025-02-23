const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const { token, clientId, guildId, prefix } = require('./config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// Debugging: Check if clientId and guildId are properly loaded
if (!clientId || !guildId) {
    console.error("❌ ERROR: clientId or guildId is undefined! Check your config.json.");
    process.exit(1); // Prevent bot from running with missing config values
}

// Load commands dynamically with validation
client.commands = new Map();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const commandsArray = [];
const loadedCommands = new Set(); // Track unique commands

for (const file of commandFiles) {
    try {
        console.log(`🔍 Loading command file: ${file}`);
        const command = require(`./commands/${file}`);

        // Check if command has 'data' and 'name'
        if (!command.data || !command.data.name) {
            console.error(`❌ ERROR: Command file "${file}" is missing 'data.name'. Skipping.`);
            continue; // Skip invalid commands
        }

        // Detect duplicate commands
        if (loadedCommands.has(command.data.name)) {
            console.error(`🚨 DUPLICATE COMMAND DETECTED: ${command.data.name} in ${file}`);
        } else {
            loadedCommands.add(command.data.name);
        }

        console.log(`✅ Successfully loaded command: ${command.data.name}`);
        client.commands.set(command.data.name, command);
        commandsArray.push(command.data.toJSON()); // Add command for registration
    } catch (error) {
        console.error(`❌ ERROR: Failed to load command "${file}":`, error);
    }
}

// Register slash commands with Discord
const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('📢 Registering slash commands...');
        
        // Debugging: Check if any commands are being sent
        if (commandsArray.length === 0) {
            console.error("❌ ERROR: No commands found! Ensure command files are correctly formatted.");
            return;
        }

        await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commandsArray });
        console.log(`✅ Successfully registered ${commandsArray.length} slash commands.`);
    } catch (error) {
        console.error('❌ ERROR: Failed to register commands:', error);
    }
})();

// Load all event handlers dynamically
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    try {
        const event = require(`./events/${file}`);
        client.on(event.name, (...args) => event.execute(...args, client));
        console.log(`✅ Loaded event: ${file}`); // Debug log for events
    } catch (error) {
        console.error(`❌ ERROR: Failed to load event "${file}":`, error);
    }
}

// Debugging: Log prefix and start bot
console.log(`✅ Prefix set to: ${prefix}`);
console.log("🚀 Starting bot...");

// Start the bot
client.login(token);
