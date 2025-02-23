const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../database/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resolvebet')
        .setDescription('Resolve a bet and distribute winnings')
        .addIntegerOption(option =>
            option.setName('bet_id')
                .setDescription('The ID of the bet you are resolving')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('winner')
                .setDescription('The winning outcome')
                .setRequired(true)),

    async execute(interaction) {
        const betId = interaction.options.getInteger('bet_id');
        const winningOption = interaction.options.getString('winner');

        // Fetch bet details
        const bet = db.getBetDetails(betId);
        if (!bet) {
            return interaction.reply({ content: "❌ Invalid bet ID. Please check active bets.", ephemeral: true });
        }

        // Ensure bet is still open
        if (bet.status !== 'open') {
            return interaction.reply({ content: "❌ This bet has already been resolved.", ephemeral: true });
        }

        // Ensure the chosen winner is valid
        if (winningOption !== bet.option_one && winningOption !== bet.option_two) {
            return interaction.reply({ 
                content: `❌ Invalid option. Choose **"${bet.option_one}"** or **"${bet.option_two}"**.`,
                ephemeral: true 
            });
        }

        // Get all winning wagers
        const winningWagers = db.resolveBet(betId, winningOption);

        if (winningWagers.length === 0) {
            return interaction.reply({ content: "⚠️ No one bet on the winning option. The bet has been closed with no payouts.", ephemeral: true });
        }

        // Calculate payouts
        const totalPool = bet.total_pool;
        const totalWinningBet = winningWagers.reduce((sum, w) => sum + w.amount, 0);
        let payoutMessages = [];

        winningWagers.forEach(wager => {
            const payout = Math.floor((wager.amount / totalWinningBet) * totalPool); // Distribute based on bet share
            db.updateUserBalance(wager.user_id, payout);
            db.updateUserStats(wager.user_id, payout); // Log bet victory and payout
            payoutMessages.push(`💰 **${wager.username}** won **${payout} BCC**`);
        });

        // Send an embed message announcing the results
        const embed = new EmbedBuilder()
            .setTitle("🏆 Bet Resolved!")
            .setColor(0x32CD32) // Green color
            .setDescription(`**Bet #${betId}** has been resolved!\nThe winning outcome was **"${winningOption}"**.`)
            .addFields(
                { name: "Total Pool", value: `${totalPool} BCC`, inline: true },
                { name: "Winners", value: payoutMessages.join("\n") || "No winners", inline: false }
            )
            .setFooter({ text: "Use /createbet to start a new bet!" });

        await interaction.reply({ embeds: [embed] });
    }
};
