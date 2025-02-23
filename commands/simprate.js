module.exports = {
    name: "simprate",
    description: "Minx will judge how much of a simp you are today.",
    execute: async (message) => {
        const simprate = Math.floor(Math.random() * 101); // 0 - 100%
        let comment;

        if (simprate < 20) {
            comment = "Barely a simp. Are you even trying?";
        } else if (simprate < 50) {
            comment = "Moderate simp energy. Could be worse.";
        } else if (simprate < 80) {
            comment = "Major simp detected. It's getting embarrassing.";
        } else {
            comment = "100% SIMP ALERT 🚨. Do you even have self-respect?";
        }

        await message.reply(`❤️ **Simprate:** ${simprate}% - ${comment}`);
    }
};
