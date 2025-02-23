const fs = require('fs');

const commands = new Map();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Load commands dynamically
for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    commands.set(command.name, command);
}

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;
        const content = message.content.toLowerCase().trim();

        // ✅ Handle prefix commands (!minx, !ping, !commands, etc.)
        if (content.startsWith(client.prefix)) {
            const args = content.slice(client.prefix.length).trim().split(/\s+/);
            const commandName = args.shift().toLowerCase();
            if (commands.has(commandName)) {
                return commands.get(commandName).execute(message, args);
            }
        }

        // ✅ Handle exact phrase "Hey Minx"
        if (content === "hey minx") {
            const responses = [
                "WHAT DO YOU WANT? 😡",
                "Ughhh, what now? 💤",
                "Did someone call me? 👀",
                "Are you bothering me again??",
                "Oi, why are you summoning me like I'm some kind of pet?",
                "Shut up, I'm busy eating chips. 🍟"
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
    }
};
