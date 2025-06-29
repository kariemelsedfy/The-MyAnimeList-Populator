const dotenv = require('dotenv').config()
const PKCE = require('./getPKCEhelper');
const loginURLBuilder = require('./buildURL');

const { codeVerifier, codeChallenge } = PKCE.generatePkcePair();
const redirectURI = "http://localhost:3000/oauth";



const loginURL = loginURLBuilder('https://myanimelist.net/v1/oauth2/authorize', {
    client_id: process.env.CLIENT_ID,
    response_type: 'code',
    code_challenge: codeChallenge,
    code_challenge_method: 'plain',
    state: codeVerifier,
    //redirect_uri: redirectURI
});


module.exports.loginURL = loginURL;
module.exports.codeVerifier = codeVerifier;