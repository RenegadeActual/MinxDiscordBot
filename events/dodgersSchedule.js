const fs = require('fs');
const axios = require('axios');
const csv = require('csv-parser');
const schedule = require('node-schedule');
const { EmbedBuilder } = require('discord.js');
const { textChannelId } = require('../config.json');
const moment = require('moment-timezone');

const scheduleURL = 'https://www.ticketing-client.com/ticketing-client/csv/GameTicketPromotionPrice.tiksrv?team_id=119&display_in=singlegame&ticket_category=Tickets&site_section=Default%E2%8A%82category=Default&leave_empty_games=true&event_type=T&year=2025&begin_date=20250201';
const mlbTvLink = 'https://www.mlb.com/live-stream-games'; // MLB.tv streaming link

async function downloadSchedule() {
    try {
        const response = await axios({
            method: 'get',
            url: scheduleURL,
            responseType: 'stream'
        });

        const writer = fs.createWriteStream('./dodgers_schedule.csv');
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error("❌ Failed to download the Dodgers' schedule:", error);
    }
}

async function loadSchedule(client) {
    const games = [];

    return new Promise((resolve) => {
        fs.createReadStream('./dodgers_schedule.csv')
            .pipe(csv({ headers: false })) // No headers in CSV
            .on('data', (row) => {
                const gameDateRaw = row[0]; // START DATE (Column 1)
                const timeRaw = row[1]; // START TIME (Column 2)
                const opponentRaw = row[3]; // SUBJECT (Column 4 - Should contain opponent name)
                const locationRaw = row[4]; // LOCATION (Column 5)

                if (!gameDateRaw || !opponentRaw || !locationRaw || !timeRaw) return;

                // Convert time to LA time zone
                const gameDate = moment.tz(`${gameDateRaw} ${timeRaw}`, "MM/DD/YYYY hh:mm A", "America/Los_Angeles");

                games.push({
                    date: gameDate,
                    opponent: opponentRaw,
                    location: locationRaw
                });
            })
            .on('end', () => {
                console.log('✅ Dodgers schedule loaded.');
                scheduleAnnouncements(games, client);
                resolve();
            });
    });
}

function scheduleAnnouncements(games, client) {
    games.forEach((game) => {
        const announcementTime = game.date.clone().subtract(1, 'hour'); // 1 hour before game
        const morningAnnouncementTime = game.date.clone().tz("America/Chicago").startOf('day').add(7, 'hours'); // 7 AM CST

        schedule.scheduleJob(morningAnnouncementTime.toDate(), async () => {
            announceGame(client, game, "**Rise and shine, Dodgers fans!** 🌅 It's **Game Day!**");
        });

        schedule.scheduleJob(announcementTime.toDate(), async () => {
            announceGame(client, game, "**It's almost time!** The Dodgers are about to take the field! ⚾");
        });

        console.log(`📅 Scheduled announcements for ${game.opponent} on ${game.date.format("MMMM Do YYYY, h:mm A z")}`);
    });
}

async function announceGame(client, game, messagePrefix) {
    const channel = await client.channels.fetch(textChannelId).catch(() => null);
    if (!channel) return console.log("❌ Failed to fetch announcement channel.");

    const userTimeZones = ["America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles"];
    let gameTimes = userTimeZones.map(tz => `**${tz.split('/')[1]}**: ${game.date.clone().tz(tz).format("h:mm A")}`);

    const minxSupportMessages = [
        "The Dodgers are about to show the world why they're the best! ⚾",
        "Get ready for an **EPIC WIN** from the Dodgers tonight! 💙🔥",
        "Dodgers Nation, let’s get HYPED! LET’S GO BOYS! 💪💙",
        "This is gonna be a **legendary** game. Don't miss it!"
    ];

    const embed = new EmbedBuilder()
        .setTitle('⚾ Dodgers Game Today!')
        .setThumbnail('https://1000logos.net/wp-content/uploads/2017/04/Dodgers-Logo.png') // Dodgers Logo
        .setDescription(`${messagePrefix} The **Dodgers** are playing soon! **${game.opponent}** at **${game.location}**.`)
        .setColor(0x005A9C) // Dodgers' Blue
        .addFields(
            { name: "📅 Game Date:", value: game.date.format("MMMM Do YYYY"), inline: true },
            { name: "🕰️ Game Time (Multiple Time Zones):", value: gameTimes.join("\n"), inline: false },
            { name: "🔥 Minx Says:", value: minxSupportMessages[Math.floor(Math.random() * minxSupportMessages.length)], inline: false },
            { name: "🎥 Watch Live:", value: `[Click here to watch on MLB.tv](${mlbTvLink})`, inline: false }
        )
        .setFooter({ text: "Let's go Dodgers! 💙", iconURL: client.user.displayAvatarURL() });

    channel.send({ embeds: [embed] });
}

module.exports = {
    name: "dodgersSchedule",
    execute: async (client) => {
        await downloadSchedule();
        await loadSchedule(client);
    }
};

