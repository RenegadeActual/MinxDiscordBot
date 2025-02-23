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
                content: "📭 There are no active bets right now. Start one with `/createbet`!", 
                ephemeral: true 
            });
        }

        const userBets = [];
        const embed = new EmbedBuilder()
            .setTitle("📊 **Active Bets & Odds**")
            .setColor(0x1E90FF) // Dodger Blue
            .setFooter({ text: "Use /placebet <bet_id> to place a bet!" });

        activeBets.forEach(bet => {
            const wagers = db.getWagersForBet(bet.bet_id);
            const totalBet = bet.total_pool;
            const optionOneTotal = wagers.filter(w => w.option === bet.option_one).reduce((sum, w) => sum + w.amount, 0);
            const optionTwoTotal = wagers.filter(w => w.option === bet.option_two).reduce((sum, w) => sum + w.amount, 0);

            // Calculate current odds
            const optionOneOdds = totalBet > 0 ? ((optionOneTotal / totalBet) * 100).toFixed(1) : "50.0";
            const optionTwoOdds = totalBet > 0 ? ((optionTwoTotal / totalBet) * 100).toFixed(1) : "50.0";

            // Format the public bet details
            embed.addFields({
                name: `🆔 **Bet #${bet.bet_id} - ${bet.description}**`,
                value: `💰 **Total Pool:** ${totalBet} BCC\n\n` +
                       `✅ **${bet.option_one}** - **${optionOneOdds}%** (${optionOneTotal} BCC)\n` +
                       `❌ **${bet.option_two}** - **${optionTwoOdds}%** (${optionTwoTotal} BCC)`,
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

                    userBets.push(`🆔 Bet #${bet.bet_id} - **${bet.description}**\n` +
                                  `📌 **Your Wager:** ${wager.amount} BCC on **${wager.option}**\n` +
                                  `💸 **Locked-in Payout Rate:** ${userOdds} BCC\n` +
                                  `🏆 **Potential Payout if you win:** ${potentialPayout} BCC`);
                });
            }
        });

        // Send main public embed
        await interaction.reply({ embeds: [embed] });

        // Send private ephemeral message about the user's own bets
        if (userBets.length > 0) {
            const userEmbed = new EmbedBuilder()
                .setTitle("🔎 **Your Active Bets**")
                .setColor(0xFFD700) // Gold
                .setDescription(userBets.join("\n\n"))
                .setFooter({ text: "You can check back anytime with /betstatus" });

            await interaction.followUp({ embeds: [userEmbed], ephemeral: true });
        } else {
            await interaction.followUp({ 
                content: "🔍 You haven't placed any bets yet. Use `/placebet <bet_id>` to participate!", 
                ephemeral: true 
            });
        }
    }
};
