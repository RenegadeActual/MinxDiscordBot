module.exports = {
    name: "ping",
    description: "Replies with Pong!",
    execute: async (message) => {
        await message.reply("Pong!");
    }
};
