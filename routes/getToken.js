// Receives code from front end via POST, returns token
const express = require('express');
const axios = require('axios');
const router = express.Router();

const getLoginURL = require('./login/getLoginURL');
const codeVerifier = getLoginURL.codeVerifier;


// Example: expects ?code=... in the query string
router.post('/', async (req, res) => {
    const code = req.body.code;
    if (!code) {
        return res.status(400).json({ error: 'Missing code' });
    }

    try {
        const params = new URLSearchParams();
        params.append('client_id', process.env.CLIENT_ID);
        params.append('client_secret', process.env.CLIENT_SECRET); 
        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('code_verifier', codeVerifier);

        const response = await axios.post(
            'https://myanimelist.net/v1/oauth2/token',
            params,
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.response?.data || error.message });
    }
});


module.exports = router;