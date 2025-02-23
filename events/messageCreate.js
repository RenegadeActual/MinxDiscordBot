const fs = require('fs');

const commands = new Map();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Load commands dynamically
for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    commands.set(command.name, command);
}

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;
        const content = message.content.toLowerCase().trim();

        // Handle prefix commands
        if (content.startsWith(client.prefix)) {
            const args = content.slice(client.prefix.length).trim().split(/\s+/);
            const commandName = args.shift().toLowerCase();
            if (commands.has(commandName)) {
                return commands.get(commandName).execute(message, args);
            }
        }

        // Handle keyword triggers
        if (content.includes('minx')) {
            return message.reply('Did someone call me? 👀');
        }
    }
};
