const fs = require('fs');
const path = require('path');

module.exports = {
    name: "commands",
    description: "Lists all available commands for MinxBot with descriptions.",
    execute: async (message) => {
        // Load all commands
        const commandFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.js'));
        let commandList = "**Available Commands:**\n\n";

        for (const file of commandFiles) {
            const command = require(`./${file}`);
            if (command.name && command.description) {
                commandList += `**!${command.name}** - ${command.description}\n`;
            }
        }

        // Send the list
        await message.reply(commandList);
    }
};
