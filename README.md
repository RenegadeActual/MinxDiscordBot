# MinxBot 🤖

MinxBot is a **Discord bot** built using [Discord.js](https://discord.js.org/) that provides **fun interactions, voice channel event tracking, and custom word triggers**. It's modular and easy to maintain, supporting both **prefix commands** and **slash commands**.

---

## 📌 Features
✅ **Prefix Commands** (`!minx`, `!ping`, etc.)  
✅ **Slash Commands** (`/minx`, `/ping`)  
✅ **Voice Channel Join/Leave Alerts**  
✅ **Word Triggers** (e.g., `eat chips` → sends a GIF)  
✅ **Modular Command System** (Easy to add new commands)  
✅ **Secure `.gitignore` setup** (Prevents leaking `config.json` to GitHub)

---

## 🛠️ Installation

### 1️⃣ **Clone the Repository**
```sh
git clone https://github.com/YOUR_USERNAME/MinxBot.git
cd MinxBot
```

### 2️⃣ **Install Dependencies**
```sh
npm install
```

### 3️⃣ **Create `config.json`**
Since `config.json` is **ignored for security reasons**, create it manually:

1. **Copy** `config.example.json`
2. **Rename it** to `config.json`
3. **Fill in your actual bot credentials**

Example:
```json
{
    "token": "YOUR_BOT_TOKEN_HERE",
    "prefix": "!",
    "adminId": "USER_ID_HERE",
    "textChannelId": "TEXT_CHANNEL_ID_HERE",
    "roleIdToPing": "ROLE_ID_HERE",
    "chipGifUrl": "https://example.com/chip-gif.gif",
    "vcLeaveGif": "https://example.com/vc-leave-gif.gif",
    "user1Id": "USER_ID_1_HERE",
    "user2Id": "USER_ID_2_HERE",
    "user3Id": "USER_ID_3_HERE",
    "user4Id": "USER_ID_4_HERE"
}
```

> 🚨 **Never share your bot token!** If leaked, reset it on the [Discord Developer Portal](https://discord.com/developers/applications).

---

## 🚀 Running the Bot
```sh
node index.js
```
> If you want the bot to restart automatically on crashes, use:
```sh
npm install -g pm2
pm2 start index.js --name "MinxBot"
```

---

## ⚡ Available Commands
| Command | Description |
|---------|-------------|
| `!minx` | Checks if Minx is awake |
| `!ping` | Replies with "Pong!" |
| `eat chips` | Sends a GIF |
| `furry` / `furries` | Responds with a warning message |
| More... | You can add more commands in `/commands/` |

---

## 🎯 Adding a New Command
1️⃣ Go to the `commands/` folder.  
2️⃣ Create a new `.js` file.  
3️⃣ Use this template:
```js
module.exports = {
    name: "yourcommand",
    description: "What this command does.",
    execute: async (message, args) => {
        await message.reply("Your response here!");
    }
};
```
4️⃣ Restart the bot, and the command is ready!

---

## 🎤 Voice Channel Tracking
MinxBot tracks when certain users **join or leave** a voice channel and sends a message in a text channel.

| User | Event | Message |
|------|-------|---------|
| **User1** | Joins VC | "👀 User1 finally decided to show up!" |
| **User2** | Leaves VC | "💨 User2 has left VC!" |
| **User3** | Leaves VC | "💨 User3 has left VC!" |

> 🚀 **Want to add more users?** Update the `vcActions` object in `index.js`.

---

## 🔄 Updating the Bot
To pull the latest changes from GitHub:
```sh
git pull origin main
npm install
```
Then restart the bot.

---

## 🛠️ Contributing
Want to add features? Feel free to **fork** this repository, create a new branch, and submit a **pull request**!

---

## 📜 License
This bot is licensed under the **Apache License 2.0**. You’re free to use, modify, and distribute it under the terms of the license. See the [LICENSE](LICENSE) file for details.

---

### 🚀 **Now MinxBot is Ready to Run!**
If you have any questions, feel free to open an **issue** or submit a **pull request**. 🎉🔥

