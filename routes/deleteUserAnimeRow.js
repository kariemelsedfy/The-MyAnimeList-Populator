// This is the endpoint to delete a user-anime row in the database.


const express = require('express');
const router = express.Router();
const getUserID = require('./builtSuggestedAnimeList/getUserID');
const deleteRow = require('../database/deleteRow');

router.post('/', async (req, res) => {
    //Calls database query function 
    const token = req.body.MAL_ACCESS_TOKEN;
    userID = await getUserID(token);
    animeID = req.body.animeID;

    deleteRow(userID, animeID);
});


module.exports = router;