const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription("Ask Minx a question, and she'll predict your future.")
        .addStringOption(option =>
            option.setName('question')
                .setDescription('The question you want to ask Minx')
                .setRequired(false)
        ),

    async execute(interaction) {
        const responses = [
            "Absolutely yes.",
            "No chance, loser.",
            "Ask me later, I’m eating chips.",
            "100% gonna happen. You better be ready.",
            "Not even in your dreams.",
            "Bruh, why are you asking ME this?",
            "Signs point to... ew, I don’t care."
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        const question = interaction.options.getString('question') || "No question given?";

        const embed = new EmbedBuilder()
            .setTitle("🎱 Minx's 8ball Prediction")
            .setDescription(`**Question:** ${question}`)
            .setColor(0x9933ff) // Purple Theme
            .addFields({ name: "Minx Says:", value: randomResponse })
            .setFooter({ text: "Use /8ball again if you dare.", iconURL: interaction.client.user.displayAvatarURL() });

        await interaction.reply({ embeds: [embed] });
    }
};
