const pool = require('./initalize'); // adjust path as needed

async function getCodeVerifier(state) {
  const { rows } = await pool.query(
    'SELECT code_verifier FROM code_verifiers WHERE state = $1',
    [state]
  );
  return rows[0]?.code_verifier;
}

module.exports = getCodeVerifier;