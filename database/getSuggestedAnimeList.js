const pool = require('./initalize');

async function getSuggestedAnimeList(userID) {
    const { rows } = await pool.query(
        `SELECT a.id, a.main_picture, a.title
         FROM user_anime ua
         JOIN anime a ON ua.anime_id = a.id
         WHERE ua.user_id = $1`,
        [userID]
    );
    //console.log(rows)
    return rows;
}

module.exports = getSuggestedAnimeList;


