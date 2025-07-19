const pool = require('./initalize');

async function containsUser(userID) {
  const { rows } = await pool.query(
    `SELECT 1
     FROM users
     WHERE id = $1
     LIMIT 1`,
    [userID]
  );

  // rows.length == 1  ⇒ user found
  // rows.length == 0  ⇒ no such user
  return rows.length > 0;
}

module.exports = containsUser;
