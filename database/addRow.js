const pool = require('./initalize')


async function addRow(userID, animeID) {
    await pool.query(`INSERT INTO user_anime (user_id, anime_id) VALUES (${userID}, ${animeID});`);
}

module.exports = addRow;