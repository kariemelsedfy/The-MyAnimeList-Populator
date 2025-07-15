const pool = require('./initalize');


async function addRow(userID, animeID, animeImage, animeTitle) {
    // 0. Insert user if not exists (adjust username as needed)
    await pool.query(
        `INSERT INTO users (id, username) VALUES ($1, $2)
         ON CONFLICT (id) DO NOTHING;`,
        [userID, `user_${userID}`] // Replace with actual username if available
    );

    // 1. Insert anime if not exists
    await pool.query(
        `INSERT INTO anime (id, main_picture, title) VALUES ($1, $2, $3)
         ON CONFLICT (id) DO NOTHING;`,
        [animeID, animeImage, animeTitle]
    );

    // 2. Insert into user_anime if not exists
    await pool.query(
        `INSERT INTO user_anime (user_id, anime_id) VALUES ($1, $2)
         ON CONFLICT (user_id, anime_id) DO NOTHING;`,
        [userID, animeID]
    );
}


module.exports = addRow;