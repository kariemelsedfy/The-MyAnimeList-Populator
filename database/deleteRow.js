const pool = require('./initalize');


async function deleteRow(userID, animeID) {
    await pool.query(`DELETE FROM user_anime
    WHERE user_id  = $1
      AND anime_id = $2;
      `, 
    [userID, animeID]);
}


module.exports = deleteRow;