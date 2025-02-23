const { SlashCommandBuilder } = require('discord.js');
const { playSound } = require('../utils/audioPlayer');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sayhello')
        .setDescription('Minx joins VC and says hello.'),

    async execute(interaction) {
        const member = interaction.member;
        if (!member.voice.channel) {
            return interaction.reply({ content: "❌ You need to be in a voice channel for me to join!", ephemeral: true });
        }

        await playSound(interaction, "hello.mp3");
        await interaction.reply({ content: "🎤 **Minx has joined VC and said hello!**", ephemeral: true });
    }
};
