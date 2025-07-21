const pool = require('./initalize'); // adjust path as needed

async function saveCodeVerifier(state, codeVerifier) {
  await pool.query(
    'INSERT INTO code_verifiers (state, code_verifier) VALUES ($1, $2) ON CONFLICT (state) DO UPDATE SET code_verifier = $2',
    [state, codeVerifier]
  );
}


module.exports = saveCodeVerifier;