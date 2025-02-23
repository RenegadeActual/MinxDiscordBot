const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const csv = require('csv-parser');
const moment = require('moment-timezone');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nextgame')
        .setDescription('Displays the next scheduled Dodgers game.'),

    async execute(interaction) {
        const games = [];

        // Read the CSV file
        fs.createReadStream('./dodgers_schedule.csv')
            .pipe(csv({ headers: false }))
            .on('data', (row) => {
                const gameDateRaw = row[0]; // START DATE (Column 1)
                const timeRaw = row[1]; // START TIME (Column 2)
                const opponentRaw = row[3]; // SUBJECT (Column 4 - Should contain opponent name)
                const locationRaw = row[4]; // LOCATION (Column 5)

                if (!gameDateRaw || !opponentRaw || !locationRaw || !timeRaw) return;

                const gameDate = moment.tz(`${gameDateRaw} ${timeRaw}`, "MM/DD/YYYY hh:mm A", "America/Los_Angeles");
                games.push({
                    date: gameDate,
                    opponent: opponentRaw,
                    location: locationRaw
                });
            })
            .on('end', async () => {
                if (games.length === 0) {
                    return interaction.reply("❌ No upcoming Dodgers games found.");
                }

                // Find the next game
                const nextGame = games.find(game => game.date.isAfter(moment()));
                if (!nextGame) {
                    return interaction.reply("❌ No upcoming Dodgers games scheduled.");
                }

                const userTimeZones = ["America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles"];
                let gameTimes = userTimeZones.map(tz => `**${tz.split('/')[1]}**: ${nextGame.date.clone().tz(tz).format("h:mm A")}`);

                // Minx's personality-based messages
                const minxHypeMessages = [
                    "**Dodgers are about to DOMINATE.** If you miss it, you’re a fake fan. 💙🔥",
                    "No excuses. **You better be watching this game.**",
                    "**Get hyped!!** If the Dodgers don’t win, I’m throwing hands. 💪",
                    "This game is gonna be **legendary.** You ready?"
                ];

                const embed = new EmbedBuilder()
                    .setTitle('⚾ Next Dodgers Game!')
                    .setThumbnail('https://cdn.discordapp.com/attachments/630584557296549899/1343251579163115590/LA_Dodgers.png?ex=67bc9804&is=67bb4684&hm=371135691dafa531b63e3641d240b0199c3ab9d30c5cb25f9defad7461b7d7a9&') // PNG Dodgers Logo
                    .setDescription(`The **Dodgers** will play against **${nextGame.opponent}** at **${nextGame.location}**.`)
                    .setColor(0x005A9C) // Dodgers' Blue
                    .addFields(
                        { name: "📅 Game Date:", value: nextGame.date.format("MMMM Do YYYY"), inline: true },
                        { name: "🕰️ Game Time (Multiple Time Zones):", value: gameTimes.join("\n"), inline: false },
                        { name: "🔥 Minx Says:", value: minxHypeMessages[Math.floor(Math.random() * minxHypeMessages.length)], inline: false }
                    )
                    .setFooter({ text: "Let's go Dodgers! 💙", iconURL: interaction.client.user.displayAvatarURL() });

                await interaction.reply({ embeds: [embed] });
            });
    }
};

