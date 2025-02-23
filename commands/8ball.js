const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "8ball",
    description: "Ask Minx a question, and she'll predict your future.",
    execute: async (message) => {
        const responses = [
            "Absolutely yes.",
            "No chance, loser.",
            "Ask me later, I’m eating chips.",
            "100% gonna happen. You better be ready.",
            "Not even in your dreams.",
            "Bruh, why are you asking ME this?",
            "Signs point to... ew, I don’t care."
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        const embed = new EmbedBuilder()
            .setTitle("🎱 Minx's 8ball Prediction")
            .setDescription(`**Question:** ${message.content.slice(7).trim() || "No question given?"}`)
            .setColor(0x9933ff) // Purple Theme
            .addFields({ name: "Minx Says:", value: randomResponse })
            .setFooter({ text: "Use !8ball again if you dare.", iconURL: message.client.user.displayAvatarURL() });

        await message.reply({ embeds: [embed] }).catch(console.error);
    }
};
