const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../database/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Shows the top users with the most BigChill Coins.'),

    async execute(interaction) {
        const topUsers = db.getTopUsers(); // Fetch top users from the database

        if (!topUsers || topUsers.length === 0) {
            return interaction.reply({
                content: "📭 No one has earned any BigChill Coins yet. Start chatting to earn some!",
                ephemeral: true
            });
        }

        // Create the leaderboard embed
        const embed = new EmbedBuilder()
            .setTitle("🏆 BigChill Coins Leaderboard")
            .setColor(0xFFD700) // Gold color
            .setDescription(
                topUsers
                    .map((user, index) => `**${index + 1}.** ${user.username} - 💰 ${user.bigchill_coins} BCC`)
                    .join("\n")
            )
            .setFooter({ text: "Earn more BCC by being active in the server!" });

        await interaction.reply({ embeds: [embed] });
    }
};
