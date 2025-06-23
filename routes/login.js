// Here, the code handles the login functionality for the application.


const express = require('express');
const router = express.Router();
const getLoginURL = require('./login/getLoginURL')


const loginURL = getLoginURL.loginURL

router.get('/', (req, res) => {
    res.send(loginURL)
});


module.exports = router;