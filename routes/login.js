// Here, the code handles the login functionality for the application.


const express = require('express');
const router = express.Router();
const getLoginURL = require('./login/getLoginURL')
const PKCE = require('./login/getPKCEhelper');

const { codeVerifier, codeChallenge } = PKCE.generatePkcePair();



router.get('/', async (req, res) => {
    const loginURL = await getLoginURL(codeVerifier, codeChallenge);
    res.send(loginURL);
});


module.exports = router;