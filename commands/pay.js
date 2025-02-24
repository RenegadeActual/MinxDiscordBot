const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../database/db');
const { adminRoles } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pay')
        .setDescription('Admin command to add Chill Points to a user.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to receive Chill Points')
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName('amount')
                .setDescription('Amount of CP to grant')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild), // Restrict usage to admin roles

    async execute(interaction) {
        const targetUser = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');

        // Check if the user has admin permissions via role IDs
        const member = interaction.guild.members.cache.get(interaction.user.id);
        if (!member.roles.cache.some(role => adminRoles.includes(role.id))) {
            return interaction.reply({
                content: "🚫 You don’t have permission to use this command.",
                ephemeral: true
            });
        }

        if (amount <= 0) {
            return interaction.reply({
                content: "❌ Invalid amount. Please enter a positive number.",
                ephemeral: true
            });
        }

        // Update user's BCC balance
        db.updateUserBalance(targetUser.id, amount);

        // Create an embed notification
        const embed = new EmbedBuilder()
            .setTitle("💰 Chill Points Awarded!")
            .setColor(0xFFD700) // Gold color
            .setDescription(`**${targetUser.username}** has received **${amount}** Chill Points!`)
            .setFooter({ text: "Use /balance to check your total.", iconURL: interaction.client.user.displayAvatarURL() });

        await interaction.reply({ embeds: [embed] });
    }
};
