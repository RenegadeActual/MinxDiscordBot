const sqlite3 = require('better-sqlite3');
const path = require('path');

// Connect to the database
const db = new sqlite3(path.join(__dirname, 'minxbot.db'));

// ✅ Create tables if they don't exist
db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT,
        bigchill_coins INTEGER DEFAULT 100,
        last_earned INTEGER DEFAULT 0
    )
`).run();

// ✅ Ensure 'total_wins' and 'total_payout' columns exist in users table
try {
    db.prepare(`SELECT total_wins FROM users LIMIT 1`).get();
} catch (err) {
    db.prepare(`ALTER TABLE users ADD COLUMN total_wins INTEGER DEFAULT 0`).run();
}

try {
    db.prepare(`SELECT total_payout FROM users LIMIT 1`).get();
} catch (err) {
    db.prepare(`ALTER TABLE users ADD COLUMN total_payout INTEGER DEFAULT 0`).run();
}

db.prepare(`
    CREATE TABLE IF NOT EXISTS bets (
        bet_id INTEGER PRIMARY KEY AUTOINCREMENT,
        creator_id TEXT,
        creator_username TEXT,
        description TEXT,
        option_one TEXT,
        option_two TEXT,
        total_pool INTEGER DEFAULT 0,
        status TEXT DEFAULT 'open'
    )
`).run();

db.prepare(`
    CREATE TABLE IF NOT EXISTS wagers (
        wager_id INTEGER PRIMARY KEY AUTOINCREMENT,
        bet_id INTEGER,
        user_id TEXT,
        username TEXT,
        option TEXT,
        amount INTEGER,
        FOREIGN KEY (bet_id) REFERENCES bets (bet_id)
    )
`).run();

module.exports = {
    // ✅ Ensure user exists in the database
    addUser: (id, username) => {
        db.prepare(`
            INSERT OR IGNORE INTO users (id, username, bigchill_coins, last_earned, total_wins, total_payout) 
            VALUES (?, ?, 100, 0, 0, 0)
        `).run(id, username);
    },

    getUserBalance: (id) => {
        const row = db.prepare(`SELECT bigchill_coins FROM users WHERE id = ?`).get(id);
        return row ? row.bigchill_coins : 0;
    },

    updateUserBalance: (id, amount) => {
        db.prepare(`
            UPDATE users 
            SET bigchill_coins = bigchill_coins + ? 
            WHERE id = ?
        `).run(amount, id);
    },

    removeUserBalance: (id, amount) => {
        const currentBalance = module.exports.getUserBalance(id);
        const newBalance = Math.max(0, currentBalance - amount); // Prevent negative balance
        db.prepare(`UPDATE users SET bigchill_coins = ? WHERE id = ?`).run(newBalance, id);
    },

    // ✅ Handle earning cooldown
    getLastEarned: (id) => {
        const row = db.prepare(`SELECT last_earned FROM users WHERE id = ?`).get(id);
        return row ? row.last_earned : 0;
    },

    updateLastEarned: (id, timestamp) => {
        db.prepare(`UPDATE users SET last_earned = ? WHERE id = ?`).run(timestamp, id);
    },

    // ✅ Create a bet and seed the pool with house funds
    createBet: (creatorId, creatorUsername, description, optionOne, optionTwo, houseSeed = 50) => {
        const result = db.prepare(`
            INSERT INTO bets (creator_id, creator_username, description, option_one, option_two, total_pool, status) 
            VALUES (?, ?, ?, ?, ?, ?, 'open')
        `).run(creatorId, creatorUsername, description, optionOne, optionTwo, houseSeed * 2);

        const betId = result.lastInsertRowid;

        // Add house-seeded wagers for both options
        db.prepare(`
            INSERT INTO wagers (bet_id, user_id, username, option, amount) 
            VALUES (?, ?, 'House', ?, ?), (?, ?, 'House', ?, ?)
        `).run(
            betId, "house", optionOne, houseSeed,
            betId, "house", optionTwo, houseSeed
        );

        return betId;
    },

    placeWager: (betId, userId, username, option, amount) => {
        db.prepare(`
            INSERT INTO wagers (bet_id, user_id, username, option, amount) 
            VALUES (?, ?, ?, ?, ?)
        `).run(betId, userId, username, option, amount);

        db.prepare(`
            UPDATE bets SET total_pool = total_pool + ? WHERE bet_id = ?
        `).run(amount, betId);
    },

    getActiveBets: () => {
        return db.prepare(`
            SELECT * FROM bets WHERE status = 'open'
        `).all();
    },

    getBetDetails: (betId) => {
        return db.prepare(`
            SELECT * FROM bets WHERE bet_id = ?
        `).get(betId);
    },

    getWagersForBet: (betId) => {
        return db.prepare(`
            SELECT * FROM wagers WHERE bet_id = ?
        `).all(betId);
    },

    resolveBet: (betId, winningOption) => {
        db.prepare(`
            UPDATE bets SET status = 'closed' WHERE bet_id = ?
        `).run(betId);

        const winningWagers = db.prepare(`
            SELECT * FROM wagers WHERE bet_id = ? AND option = ?
        `).all(betId, winningOption);

        const totalPool = db.prepare(`SELECT total_pool FROM bets WHERE bet_id = ?`).get(betId).total_pool;
        let totalWinningBets = winningWagers.reduce((sum, w) => sum + w.amount, 0);

        winningWagers.forEach(wager => {
            const userOdds = wager.amount / totalWinningBets;
            const payout = Math.floor(userOdds * totalPool); // Calculate payout

            db.prepare(`UPDATE users SET bigchill_coins = bigchill_coins + ? WHERE id = ?`)
                .run(payout, wager.user_id);

            db.prepare(`UPDATE users SET total_wins = total_wins + 1, total_payout = total_payout + ? WHERE id = ?`)
                .run(payout, wager.user_id);
        });

        return winningWagers;
    },

    // ✅ Get user betting stats
    getUserStats: (id) => {
        return db.prepare(`
            SELECT total_wins, total_payout FROM users WHERE id = ?
        `).get(id);
    },

    // ✅ Update user bet stats after winning
    updateUserStats: (id, payout) => {
        db.prepare(`
            UPDATE users 
            SET total_wins = total_wins + 1, total_payout = total_payout + ? 
            WHERE id = ?
        `).run(payout, id);
    },

    // ✅ Get top 10 users by BigChill Coins
    getTopUsers: () => {
        return db.prepare(`
            SELECT username, bigchill_coins 
            FROM users 
            ORDER BY bigchill_coins DESC 
            LIMIT 10
        `).all();
    },

    // ✅ Get top 10 users by betting wins
    getTopBettors: () => {
        return db.prepare(`
            SELECT username, total_wins, total_payout 
            FROM users 
            ORDER BY total_wins DESC 
            LIMIT 10
        `).all();
    }
};
