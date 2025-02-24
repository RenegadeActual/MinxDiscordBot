const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../database/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('betstatus')
        .setDescription('View all active bets and their current odds'),

    async execute(interaction) {
        const activeBets = db.getActiveBets();

        if (!activeBets || activeBets.length === 0) {
            return interaction.reply({ 
                content: "📭 **There are no active bets right now.**\nYou can start a new bet using `/createbet`!",
                ephemeral: true 
            });
        }

        let userBets = [];
        const embed = new EmbedBuilder()
            .setTitle("📊 **Active Bets & Your Wagers**")
            .setColor(0x1E90FF) // Dodger Blue
            .setFooter({ text: "Use /placebet <bet_id> to join a bet!" });

        activeBets.forEach(bet => {
            const wagers = db.getWagersForBet(bet.bet_id);
            const totalBet = bet.total_pool;

            // Calculate total bets on each option
            const optionOneTotal = wagers.filter(w => w.option === bet.option_one).reduce((sum, w) => sum + w.amount, 0);
            const optionTwoTotal = wagers.filter(w => w.option === bet.option_two).reduce((sum, w) => sum + w.amount, 0);

            // Calculate odds
            const optionOneOdds = totalBet > 0 ? ((optionOneTotal / totalBet) * 100).toFixed(1) : "50.0";
            const optionTwoOdds = totalBet > 0 ? ((optionTwoTotal / totalBet) * 100).toFixed(1) : "50.0";

            // Format the public bet details
            embed.addFields({
                name: `🆔 **Bet #${bet.bet_id} - ${bet.description}**`,
                value: `💰 **Total Pool:** ${totalBet} BCC\n\n` +
                       `✅ **${bet.option_one}** - **${optionOneOdds}%** *(${optionOneTotal} CP bet)*\n` +
                       `❌ **${bet.option_two}** - **${optionTwoOdds}%** *(${optionTwoTotal} CP bet)*\n\n`,
                inline: false
            });

            // Check if the user has placed a bet
            const userWagers = wagers.filter(w => w.user_id === interaction.user.id);
            if (userWagers.length > 0) {
                userWagers.forEach(wager => {
                    const userOdds = wager.option === bet.option_one
                        ? (optionOneTotal > 0 ? ((totalBet / optionOneTotal) * wager.amount).toFixed(2) : "1.00")
                        : (optionTwoTotal > 0 ? ((totalBet / optionTwoTotal) * wager.amount).toFixed(2) : "1.00");

                    const potentialPayout = (wager.amount * userOdds).toFixed(2);

                    userBets.push(`🆔 **Bet #${bet.bet_id} - ${bet.description}**\n` +
                                  `📌 **Your Bet:** ${wager.amount} BCC on **${wager.option}**\n` +
                                  `🔄 **Locked-in Payout Rate:** *${userOdds} CP per 1 CP bet*\n` +
                                  `🏆 **Potential Payout:** ${potentialPayout} CP\n`);
                });
            }
        });

        // Ensure user bet section is properly formatted and includes spacing
        embed.addFields(
            { name: '\u200B', value: '\u200B' }, // Adds a blank space before "Your Active Wagers"
            { name: "🎯 **Your Active Wagers**", value: userBets.length > 0 ? userBets.join("\n\n") : "🔍 **You haven't placed any bets yet.**\nUse `/placebet <bet_id>` to participate!" },
            { name: '\u200B', value: '\u200B' }  // Adds a blank space after "Your Active Wagers"
        );

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
