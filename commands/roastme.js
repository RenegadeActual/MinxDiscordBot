module.exports = {
    name: "roastme",
    description: "Minx will roast you. Hope you can handle it.",
    execute: async (message) => {
        const roasts = [
            "You bring *negative* charisma to this chat.",
            "Your personality is as dry as my internet connection.",
            "Even Google doesn't have answers for why you're like this.",
            "You're the reason I lose brain cells every day.",
            "Bro, your *face* looks like a lagging Discord call."
        ];

        const randomRoast = roasts[Math.floor(Math.random() * roasts.length)];
        await message.reply(`🔥 **Minx's Roast:** ${randomRoast}`);
    }
};
