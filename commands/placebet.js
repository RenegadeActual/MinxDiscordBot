const { SlashCommandBuilder } = require('discord.js');
const db = require('../database/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('placebet')
        .setDescription('Place a bet on an active wager')
        .addIntegerOption(option =>
            option.setName('bet_id')
                .setDescription('The ID of the bet you want to place a wager on')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('option')
                .setDescription('Which option are you betting on?')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Amount of BigChill Coins to wager')
                .setRequired(true)),

    async execute(interaction) {
        const betId = interaction.options.getInteger('bet_id');
        const chosenOption = interaction.options.getString('option');
        const amount = interaction.options.getInteger('amount');

        // Fetch bet details
        const bet = db.getBetDetails(betId);
        if (!bet) {
            return interaction.reply({ content: "❌ Invalid bet ID. Please check active bets.", ephemeral: true });
        }

        // Ensure the chosen option is valid
        if (chosenOption !== bet.option_one && chosenOption !== bet.option_two) {
            return interaction.reply({ 
                content: `❌ Invalid option. Choose **"${bet.option_one}"** or **"${bet.option_two}"**.`,
                ephemeral: true 
            });
        }

        // Check user balance
        const userBalance = db.getUserBalance(interaction.user.id);
        if (userBalance < amount) {
            return interaction.reply({ content: "❌ You don't have enough BigChill Coins to place this bet!", ephemeral: true });
        }

        // Deduct amount and place wager
        db.removeUserBalance(interaction.user.id, amount);
        db.placeWager(betId, interaction.user.id, interaction.user.username, chosenOption, amount);

        return interaction.reply({
            content: `✅ **${interaction.user.username}** placed a bet of **${amount} BCC** on **"${chosenOption}"** in Bet #${betId}.`
        });
    }
};
