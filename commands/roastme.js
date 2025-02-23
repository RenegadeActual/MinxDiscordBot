const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roastme')
        .setDescription("Minx will roast you. Hope you can handle it."),

    async execute(interaction) {
        const roasts = [
            "You bring *negative* charisma to this chat.",
            "Your personality is as dry as my internet connection.",
            "Even Google doesn't have answers for why you're like this.",
            "You're the reason I lose brain cells every day.",
            "Bro, your *face* looks like a lagging Discord call.",
            "You're proof that even artificial intelligence can feel disappointment.",
            "I’d agree with you, but then we’d both be wrong.",
            "Your WiFi is stronger than your personality. And that’s saying something.",
            "I'd roast you harder, but I don't want to waste good material.",
            "Even the bots in this server have better comebacks than you."
        ];

        const randomRoast = roasts[Math.floor(Math.random() * roasts.length)];
        await interaction.reply(`🔥 **Minx's Roast:** ${randomRoast}`);
    }
};
