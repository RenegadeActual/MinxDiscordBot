const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../database/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Shows the top users with the most Chill Points.'),

    async execute(interaction) {
        const topUsers = db.getTopUsers(); // Fetch top users from the database

        if (!topUsers || topUsers.length === 0) {
            return interaction.reply({
                content: "📭 No one has earned any Chill Points yet. Start chatting to earn some!",
                ephemeral: true
            });
        }

        // Create the leaderboard embed
        const embed = new EmbedBuilder()
            .setTitle("🏆 Chill Points Leaderboard")
            .setColor(0xFFD700) // Gold color
            .setDescription(
                topUsers
                    .map((user, index) => `**${index + 1}.** ${user.username} - 💰 ${user.bigchill_coins} CP`)
                    .join("\n")
            )
            .setFooter({ text: "Earn more CP by being active in the server!" });

        await interaction.reply({ embeds: [embed] });
    }
};
