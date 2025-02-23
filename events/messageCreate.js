const fs = require('fs');

const commands = new Map();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Load commands dynamically
for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    commands.set(command.name, command);
}

// Random idle messages (if chat is quiet for too long)
let lastMessageTime = Date.now();
const idleMessages = [
    "Hello? Is this chat dead, or did everyone finally get a life?",
    "I swear, if someone doesn’t entertain me soon, I’m starting a fight.",
    "I could be eating chips right now, but instead, I’m waiting for you losers to say something interesting."
];

// Function to check inactivity and send idle messages (2-6 hours delay)
function checkIdleMessages(client) {
    const now = Date.now();
    const randomIdleTime = Math.floor(Math.random() * (6 - 2) + 2) * 60 * 60 * 1000; // Random 2-6 hours in ms

    if (now - lastMessageTime > randomIdleTime) {
        const randomChannel = client.channels.cache.random();
        if (randomChannel && randomChannel.isTextBased()) {
            randomChannel.send(idleMessages[Math.floor(Math.random() * idleMessages.length)]);
        }
        lastMessageTime = now;
    }
    setTimeout(() => checkIdleMessages(client), 3600000); // Check every 1 hour
}

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;
        const content = message.content.toLowerCase().trim();

        // Update last message time
        lastMessageTime = Date.now();

        // ✅ Handle prefix commands (!minx, !ping, !commands, etc.)
        if (content.startsWith(client.prefix)) {
            const args = content.slice(client.prefix.length).trim().split(/\s+/);
            const commandName = args.shift().toLowerCase();
            if (commands.has(commandName)) {
                return commands.get(commandName).execute(message, args);
            }
        }

        // ✅ Handle exact phrase "Hey Minx" with different moods
        if (content === "hey minx") {
            const responses = Math.random() > 0.5
                ? [ // Nice Minx
                    "Oh hi! What’s up? 😃",
                    "Hey hey! What do you need?",
                    "You rang? Hope it’s something fun!"
                ]
                : [ // Evil Minx
                    "Ughhh, what do you want? 😑",
                    "Why are you summoning me like I’m some kind of pet?",
                    "Shut up, I’m busy eating chips. 🍟"
                ];
            return message.reply(responses[Math.floor(Math.random() * responses.length)]);
        }

        // ✅ Automatically trigger !furry when "furry" or "furries" is detected
        if (content.includes("furry") || content.includes("furries")) {
            console.log(`Detected "furry" in: ${message.content}`);
            if (commands.has("furry")) {
                return commands.get("furry").execute(message);
            }
        }

        // ✅ Automatically roast users who mention "lonely"
        if (content.includes("lonely")) {
            return message.reply("LONELY?? Bro, have you **considered touching grass** or are you just gonna cry in chat again?");
        }

        // ✅ Sarcastic Auto-Replies
        const sarcasticReplies = {
            "brb": "Yeah, sure. Like you’ll actually come back.",
            "gg": "GG? That was the worst gameplay I’ve ever seen.",
            "i'm tired": "Then go take a nap, genius. Why are you still here?"
        };

        for (const phrase in sarcasticReplies) {
            if (content.includes(phrase)) {
                return message.reply(sarcasticReplies[phrase]);
            }
        }
    }
};

// Start checking for idle messages
checkIdleMessages();
