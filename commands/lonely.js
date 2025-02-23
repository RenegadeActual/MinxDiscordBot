const { SlashCommandBuilder } = require('discord.js');
const { playSound } = require('../utils/audioPlayer');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lonely')
        .setDescription('Minx joins VC and plays a flirt sound.'),

    async execute(interaction) {
        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.reply({ 
                content: "❌ You must be in a voice channel for me to flirt with you!", 
                ephemeral: true 
            });
        }

        await playSound(interaction, "flirt.mp3");
        await interaction.reply({ 
            content: "💋 Minx is here to keep you company!", 
            ephemeral: true 
        });
    }
};
