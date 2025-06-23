// Handles the redirect after clicking the login link

const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
    const code = req.query.code
    const state = req.query.state

    console.log(code);
    console.log(state);
})


module.exports = router