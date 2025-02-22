module.exports = {
    name: "minx",
    description: "Check to make sure Minx is awake.",
    execute: async (message) => {
        await message.reply(`Hi ${message.author.username}, yes I am awake!`);
    }
};
