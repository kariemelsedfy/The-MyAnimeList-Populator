// This endpoint takes the answers the user gave, build the list of animes they have probably watched, then adds that to the database.

const express = require('express');
const router = express.Router();


router.post('/', (req, res) => {
    console.log(req.body);
    res.json({ received: req.body });
});


module.exports = router;