const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../database/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('topbettors')
        .setDescription('View the top users based on total bet wins and total payout earnings.'),

    async execute(interaction) {
        const topBettors = db.getTopBettors(); // Fetch top bettors from database

        if (!topBettors || topBettors.length === 0) {
            return interaction.reply({
                content: "📭 No betting history found. Start placing bets to climb the leaderboard!",
                ephemeral: true
            });
        }

        // Build the leaderboard embed
        const embed = new EmbedBuilder()
            .setTitle("🏆 Top Bettors Leaderboard")
            .setColor(0xFFD700) // Gold color
            .setDescription(
                topBettors
                    .map((user, index) => 
                        `**${index + 1}.** ${user.username} - 🏅 **${user.total_wins} Wins** - 💰 **${user.total_payout} CP Earned**`
                    )
                    .join("\n")
            )
            .setFooter({ text: "Think you can make it to the top? Start betting now!" });

        await interaction.reply({ embeds: [embed] });
    }
};
