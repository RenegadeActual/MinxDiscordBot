module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const responses = {
            minx: `Hi ${interaction.user.username}, yes I am awake!`,
            ping: "Pong!"
        };

        if (responses[interaction.commandName]) {
            await interaction.reply(responses[interaction.commandName]);
        }
    }
};
