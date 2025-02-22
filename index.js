const fs = require('fs');
const path = require('path');
const { Client, Events, GatewayIntentBits, SlashCommandBuilder } = require('discord.js');
const { 
    token, 
    prefix, 
    chrisId, 
    textChannelId, 
    roleIdToPing, 
    chipGifUrl, 
    carlosGb, 
    carlosId, 
    renegadeId, 
    breekiId, 
    sidewinderId 
} = require('./config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// 🔹 Load Commands Dynamically from `commands/` Folder
const commands = new Map();
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.set(command.name, command);
}

// 🔹 Bot Ready Event
client.once(Events.ClientReady, async () => {
    console.log(`Logged in as ${client.user.username}`);

    await client.application.fetch();

    // Slash Commands Setup
    const slashCommands = [
        new SlashCommandBuilder().setName("minx").setDescription("Check to make sure Minx is awake."),
        new SlashCommandBuilder().setName("ping").setDescription("Replies with pong!")
    ];

    for (const command of slashCommands) {
        await client.application.commands.create(command);
    }
});

// 🔹 Handle Slash Commands
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const responses = {
        minx: `Hi ${interaction.user.username}, yes I am awake!`,
        ping: "Pong!"
    };

    if (responses[interaction.commandName]) {
        await interaction.reply(responses[interaction.commandName]);
    }
});

// 🔹 Handle Prefix Commands
client.on('messageCreate', async message => {
    if (message.author.bot) return;

    const content = message.content.toLowerCase().trim();

    if (content.startsWith(prefix)) {
        const args = content.slice(prefix.length).trim().split(/\s+/);
        const commandName = args.shift().toLowerCase();

        if (commands.has(commandName)) {
            return commands.get(commandName).execute(message, args);
        }
    }
});

// 🔹 Word Triggers (Map Messages to Responses)
const wordResponses = {
    "minx": `Did someone call me? 👀`,
    "eat chips": `Yes sir!\n${chipGifUrl}`,
    "furry": `No furries allowed! 😠`,
    "furries": `No furries allowed! 😠`
};

client.on('messageCreate', async message => {
    if (message.author.bot) return;
    const content = message.content.toLowerCase().trim();

    for (const [trigger, response] of Object.entries(wordResponses)) {
        if (content.includes(trigger)) {
            console.log(`Detected "${trigger}" in message: ${message.content}`);
            return await message.reply(response);
        }
    }
});

// 🔹 Handle Voice Channel Join/Leave Events
client.on('voiceStateUpdate', async (oldState, newState) => {
    const user = newState?.member || oldState?.member;
    if (!user || !user.user) return;

    console.log(`🔊 Voice state update detected for: ${user.user.username}`);

    const textChannel = await client.channels.fetch(textChannelId).catch(() => null);
    if (!textChannel) {
        console.log("❌ Bot cannot access the text channel! Check the ID & permissions.");
        return;
    }

    // VC Join/Leave Actions
    const vcActions = {
        [chrisId]: { join: `👀 <@&${roleIdToPing}> **${user.user.username} finally decided to show up!**` },
        [carlosId]: { leave: `💨 **${user.user.username} has left VC!**\n${carlosGb}` },
        [renegadeId]: { leave: `💨 **${user.user.username} has left VC!**\n${carlosGb}` },
        [breekiId]: { leave: `💨 **${user.user.username} has left VC!**\n${carlosGb}` },
        [sidewinderId]: { leave: `💨 **${user.user.username} has left VC!**\n${carlosGb}` }
    };

    // Handle VC Join
    if (!oldState.channel && newState.channel && vcActions[user.id]?.join) {
        console.log(`✅ ${user.user.username} joined VC: ${newState.channel.name}`);
        await textChannel.send(vcActions[user.id].join);
    }

    // Handle VC Leave
    if (oldState.channel && !newState.channel && vcActions[user.id]?.leave) {
        console.log(`🚪 ${user.user.username} left VC: ${oldState.channel.name}`);
        await textChannel.send(vcActions[user.id].leave);
    }
});

// 🔹 Start the Bot
client.login(token);
