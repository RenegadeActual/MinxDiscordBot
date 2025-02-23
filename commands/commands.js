const { EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: "commands",
    description: "Lists all available commands.",
    execute: async (message) => {
        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

        // Generate command list dynamically
        const commandList = commandFiles.map(file => {
            const command = require(`./${file}`);
            return { name: `!${command.name}`, value: command.description || "No description provided.", inline: false };
        });

        const embed = new EmbedBuilder()
            .setTitle("📜 MinxBot Command List")
            .setDescription("Here's everything I can do:")
            .setColor(0xff66cc) // Pinkish Minx Theme
            .addFields(commandList)
            .setFooter({ text: "More features coming soon!", iconURL: message.client.user.displayAvatarURL() });

        await message.reply({ embeds: [embed] });
    }
};
