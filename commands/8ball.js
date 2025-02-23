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
        await message.reply(`🎱 **Minx's 8ball says:** ${randomResponse}`);
    }
};
