const dotenv = require('dotenv').config()
const loginURLBuilder = require('./buildURL');
const saveCodeVerifier = require('../../database/saveCodeVerifier');
const redirectURI = "http://localhost:3000/oauth";

async function getLoginURL(codeVerifier, codeChallenge) {
    const loginURL = loginURLBuilder('https://myanimelist.net/v1/oauth2/authorize', {
    client_id: process.env.CLIENT_ID,
    response_type: 'code',
    code_challenge: codeChallenge,
    code_challenge_method: 'plain',
    state: codeVerifier,
    //redirect_uri: redirectURI
    });
    await saveCodeVerifier(codeVerifier, codeVerifier);
    return loginURL;
}




module.exports = getLoginURL