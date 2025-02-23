const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('minxcommands')
        .setDescription('Lists all available commands in categorized format.'),

    async execute(interaction) {
        console.log(`✅ Command received: /minxcommands by ${interaction.user.tag}`);

        const commandFiles = fs.readdirSync(path.join(__dirname)).filter(file => file.endsWith('.js'));
        console.log(`📂 Found ${commandFiles.length} command files.`);

        // Define categories
        const categories = {
            "🎮 General Commands": [],
            "💰 BigChill Coins & Betting": [],
            "🎭 Fun Commands": [],
            "⚾ Dodgers Notifications": [],
            "🔧 Admin Commands": []
        };

        commandFiles.forEach(file => {
            try {
                const command = require(`./${file}`);
                console.log(`✅ Loaded command: ${command.data.name}`);

                // Categorize commands based on their function
                if (["ping", "minx", "minxcommands"].includes(command.data.name)) {
                    categories["🎮 General Commands"].push(command);
                } else if (["balance", "leaderboard", "createbet", "placebet", "resolvebet", "betstatus", "topbettors", "pay"].includes(command.data.name)) {
                    categories["💰 BigChill Coins & Betting"].push(command);
                } else if (["8ball", "furry", "lonely", "roastme", "sayhello", "simprate", "minxfacts"].includes(command.data.name)) {
                    categories["🎭 Fun Commands"].push(command);
                } else if (["nextgame"].includes(command.data.name)) {
                    categories["⚾ Dodgers Notifications"].push(command);
                } else if (["pay"].includes(command.data.name)) {
                    categories["🔧 Admin Commands"].push(command);
                }
            } catch (err) {
                console.error(`❌ Failed to load command file: ${file}`, err);
            }
        });

        // Build the embed message
        const embed = new EmbedBuilder()
            .setTitle("📜 MinxBot Command List")
            .setDescription("Here are the available commands categorized by function:")
            .setColor(0xff66cc) // Pinkish Minx Theme
            .setFooter({ text: "More features coming soon!", iconURL: interaction.client.user.displayAvatarURL() });

        Object.entries(categories).forEach(([category, commands]) => {
            if (commands.length > 0) {
                embed.addFields({
                    name: category,
                    value: commands.map(cmd => `**/${cmd.data.name}** - ${cmd.data.description}`).join("\n")
                });
            }
        });

        console.log("📤 Sending categorized command embed...");
        await interaction.reply({ embeds: [embed] });

        console.log("✅ Command executed successfully.");
    }
};
