// This is the endpoint to patch a user's anime list.

const axios = require('axios');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    //Calls database query function 
    const token = req.body.MAL_ACCESS_TOKEN;
    const score = req.body.score;
    const animeID = req.body.animeID;

    try {
    const response = await axios.put(
      `https://api.myanimelist.net/v2/anime/${animeID}/my_list_status`,
      {
        status: 'completed',  // or 'watching', 'plan_to_watch', etc.
        score: score          // 1–10
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type':  'application/x-www-form-urlencoded'
        }
      }
    );
    return res.status(200).json(response.data);
  } catch (err) {
    console.error('MAL update error:', err.response?.data || err.message);
    throw err;
  }
});


module.exports = router;