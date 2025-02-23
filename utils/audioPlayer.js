const { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection } = require('@discordjs/voice');
const fs = require('fs');
const path = require('path');

module.exports = {
    playSound: async function (message, soundFile) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) return message.reply("❌ You need to be in a voice channel!");

        const filePath = path.join(__dirname, '../sounds/', soundFile);
        if (!fs.existsSync(filePath)) return message.reply("❌ **Audio file not found!**");

        try {
            // Check if a connection already exists
            let connection = getVoiceConnection(message.guild.id);
            if (!connection) {
                connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: message.guild.id,
                    adapterCreator: message.guild.voiceAdapterCreator,
                });
            }

            const player = createAudioPlayer();
            const resource = createAudioResource(filePath);

            player.play(resource);
            connection.subscribe(player);

            // Log for debugging
            console.log(`✅ Playing ${soundFile} in ${voiceChannel.name}`);

        } catch (error) {
            console.error("Voice Error:", error);
            message.reply("❌ **Failed to play audio!**");
        }
    }
};
