module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;

        // Retrieve the command from the registered commands map
        const command = client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`❌ Command not found: ${interaction.commandName}`);
            return interaction.reply({ content: "❌ Command not found.", ephemeral: true });
        }

        try {
            console.log(`✅ Executing command: /${interaction.commandName} by ${interaction.user.tag}`);
            await command.execute(interaction);
        } catch (error) {
            console.error(`❌ Error executing /${interaction.commandName}:`, error);
            await interaction.reply({ content: "❌ There was an error executing this command.", ephemeral: true });
        }
    }
};
