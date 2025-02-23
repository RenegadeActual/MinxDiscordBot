const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../database/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Check your BigChill Coin (BCC) balance.'),

    async execute(interaction) {
        // Ensure the user exists in the database
        db.addUser(interaction.user.id, interaction.user.username);

        // Fetch the user's balance
        const balance = db.getUserBalance(interaction.user.id);

        // Create an embedded response
        const embed = new EmbedBuilder()
            .setTitle("💰 BigChill Coin Balance")
            .setColor(0xFFD700) // Gold color
            .setDescription(`You currently have **${balance} BCC**.`)
            .setFooter({ text: "Earn BCC by chatting or betting smart!" });

        await interaction.reply({ embeds: [embed] });
    }
};
