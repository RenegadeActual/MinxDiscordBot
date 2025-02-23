module.exports = {
    name: "minxfact",
    description: "Minx shares a random fact about herself.",
    execute: async (message) => {
        const minxFacts = [
            `"Oi, did you know I once got banned on Twitch just for SCREAMING? Like, what do they expect me to do—whisper?"`,
            `"Fun fact: I’m Irish, which means I automatically win every bar fight. It's just science."`,
            `"One time, I got kicked out of a casino for yelling at a slot machine. IT TOOK ALL MY MONEY!"`,
            `"My diet? Chips and whatever I can scavenge from the fridge at 2 AM. Absolute chef’s kiss."`,
            `"Listen, I could 100% beat you in a fist fight. Don’t even try me."`
        ];

        const randomFact = minxFacts[Math.floor(Math.random() * minxFacts.length)];
        await message.reply(randomFact);
    }
};
