module.exports = {
    name: "minx",
    description: "Replies to a Minx check.",
    execute: async (message) => {
        await message.reply(`Hi ${message.author.username}, yes I am awake!`);
    }
};
