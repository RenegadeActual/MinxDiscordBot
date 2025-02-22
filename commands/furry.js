module.exports = {
    name: "furry",
    description: "Responds to furry messages.",
    execute: async (message) => {
        await message.reply("No furries allowed! 😠");
    }
};
