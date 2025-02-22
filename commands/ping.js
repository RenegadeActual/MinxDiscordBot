module.exports = {
    name: "ping",
    description: "Replies with pong!",
    execute: async (message) => {
        await message.reply("Pong!");
    }
};
