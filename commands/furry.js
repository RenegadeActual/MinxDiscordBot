const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('furry')
        .setDescription("MinxBot's reaction to furries."),

    async execute(interaction) {
        const furryResponses = [
            "No furries allowed! 😠",
            "Ew, a furry? GET OUT. 🚪",
            "I smell something... oh god, it's a furry. 🤢",
            "This is a **furry-free zone**, go touch grass. 🌱",
            "Imagine being a furry in **MY** chat. Couldn't be me. 😤",
            "Bro, I swear if I see one more furry here...",
            "Furries? In this chat? Not on my watch. ❌",
            "Oh great, the furries have arrived. Just what I needed today. 🙄"
        ];

        const randomResponse = furryResponses[Math.floor(Math.random() * furryResponses.length)];
        await interaction.reply(randomResponse);
    }
};
