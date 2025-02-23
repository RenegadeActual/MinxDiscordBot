const { playSound } = require('../utils/audioPlayer');

module.exports = {
    name: "lonely",
    description: "Minx joins VC and plays a flirt sound.",
    execute: async (message) => {
        await playSound(message, "flirt.mp3");
    }
};
