const { REST, Routes } = require('discord.js');
const { token, clientId, guildId } = require('./config.json');

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('🚨 Removing ALL slash commands (Guild & Global)...');

        // Delete ALL Global Commands
        await rest.put(Routes.applicationCommands(clientId), { body: [] });
        console.log('✅ Successfully removed all **global** commands.');

        // Delete ALL Guild Commands
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] });
        console.log('✅ Successfully removed all **guild-specific** commands.');

    } catch (error) {
        console.error('❌ Failed to remove commands:', error);
    }
})();
