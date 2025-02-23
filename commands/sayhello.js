const { playSound } = require('../utils/audioPlayer');

module.exports = {
    name: "sayhello",
    description: "Minx joins VC and says hello.",
    execute: async (message) => {
        await playSound(message, "hello.mp3");
    }
};
