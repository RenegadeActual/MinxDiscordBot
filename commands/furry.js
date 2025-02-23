module.exports = {
    name: "furry",
    description: "Admonishes users who mention furry.",
    execute: async (message) => {
        await message.reply("No furries allowed! 😠");
    }
};
