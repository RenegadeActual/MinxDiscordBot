const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('minx')
        .setDescription('Check to make sure Minx is awake.'),

    async execute(interaction) {
        await interaction.reply(`Hi ${interaction.user.username}, yes I am awake!`);
    }
};
