/**
 * Generate a PKCE Code Verifier and (plain) Code Challenge
 * @param {number} length Desired length of the code verifier (43–128). Default is 128.
 * @returns {{ codeVerifier: string, codeChallenge: string }}
 */
function generatePkcePair(length = 128) {
  if (length < 43 || length > 128) {
    throw new Error('Code verifier length must be between 43 and 128 characters.');
  }

  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);

  let codeVerifier = '';
  for (let i = 0; i < length; i++) {
    // Map each random byte to one of the allowed chars
    const idx = randomValues[i] % charset.length;
    codeVerifier += charset.charAt(idx);
  }

  // Plain transformation: challenge = verifier
  const codeChallenge = codeVerifier;

  return { codeVerifier, codeChallenge };
}

module.exports = {
  generatePkcePair
};  
