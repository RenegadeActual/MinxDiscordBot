const { REST, Routes } = require('discord.js');
const { token, clientId, guildId } = require('./config.json');

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('📢 Fetching registered slash commands...');

        // Fetch guild-specific commands
        const guildCommands = await rest.get(Routes.applicationGuildCommands(clientId, guildId));
        console.log(`\n✅ Guild Commands (${guildCommands.length} total):`);
        guildCommands.forEach(cmd => console.log(`- /${cmd.name}: ${cmd.description}`));

        // Fetch global commands
        const globalCommands = await rest.get(Routes.applicationCommands(clientId));
        console.log(`\n🌎 Global Commands (${globalCommands.length} total):`);
        globalCommands.forEach(cmd => console.log(`- /${cmd.name}: ${cmd.description}`));

    } catch (error) {
        console.error('❌ Failed to fetch commands:', error);
    }
})();
