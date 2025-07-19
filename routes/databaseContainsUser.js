// routes/check-user.js
const express      = require('express');
const router       = express.Router();
const containsUser = require('../database/containsUser');
const getUserID    = require('./builtSuggestedAnimeList/getUserID');


router.post('/', async (req, res, next) => {
  try {
    const token = req.body.MAL_ACCESS_TOKEN;
    const userID = await getUserID(token);

    const exists = await containsUser(userID);
    res.status(200).json({ exists: exists });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
