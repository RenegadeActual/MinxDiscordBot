const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../database/db');

const HOUSE_SEED_AMOUNT = 150; // The amount the house contributes to each bet

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createbet')
        .setDescription('Create a new custom bet')
        .addStringOption(option =>
            option.setName('description')
                .setDescription('What is the bet about?')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('option_one')
                .setDescription('First betting option')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('option_two')
                .setDescription('Second betting option')
                .setRequired(true)),

    async execute(interaction) {
        const description = interaction.options.getString('description');
        const optionOne = interaction.options.getString('option_one');
        const optionTwo = interaction.options.getString('option_two');

        // Store bet in the database and seed the pool
        const betId = db.createBet(interaction.user.id, interaction.user.username, description, optionOne, optionTwo, HOUSE_SEED_AMOUNT);

        if (!betId) {
            return interaction.reply({ 
                content: "❌ Failed to create bet. Please try again.", 
                ephemeral: true 
            });
        }

        // Create embed for the bet
        const embed = new EmbedBuilder()
            .setTitle(`📢 New Bet Created!`)
            .setDescription(`**${interaction.user.username}** has started a bet!`)
            .setColor(0x1E90FF) // Dodger Blue
            .addFields(
                { name: "Bet ID", value: `#${betId}`, inline: true },
                { name: "Description", value: description, inline: false },
                { name: "Option 1", value: `✅ ${optionOne} (House Seeded: ${HOUSE_SEED_AMOUNT} BCC)`, inline: true },
                { name: "Option 2", value: `❌ ${optionTwo} (House Seeded: ${HOUSE_SEED_AMOUNT} BCC)`, inline: true }
            )
            .setFooter({ text: "Use /placebet <bet_id> to place a bet!" });

        await interaction.reply({ embeds: [embed] });
    }
};
