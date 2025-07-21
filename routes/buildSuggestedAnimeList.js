// This endpoint takes the answers the user gave, build the list of animes they have probably watched, then adds that to the database.

const express = require('express');
const router = express.Router();
require('dotenv').config();
const axios = require('axios');
const MAL_BASE_URL = 'https://api.myanimelist.net/v2';
const getMostPopular = require('./builtSuggestedAnimeList/getMostPopular');
const getSeasonalRange = require('./builtSuggestedAnimeList/getSeasonalRange');
const parsePeriod = require('./builtSuggestedAnimeList/parsePeriod');
const getUserID = require('./builtSuggestedAnimeList/getUserID');
const addRow = require('../database/addRow');

router.post('/', async (req, res) => {
    try {
        const startPeriod = req.body.startPeriod;
        const { fromYear } = parsePeriod(startPeriod);
        const count = req.body.animeCount;
        

        const token = req.body.MAL_ACCESS_TOKEN;
        const popularOverall = await getMostPopular(token, count * 3);
        const seasonalRange = await getSeasonalRange(token, fromYear);

        // Flatten all seasonal suggestions into one array
        const seasonalAnime = seasonalRange.flatMap(season => season.suggestions);

        // Combine all anime into one array
        let allAnime = [...popularOverall, ...seasonalAnime];
        // Optionally, fetch main_picture for popularOverall and seasonal if not already included
        // (If you want main_picture, update getMostPopular and getSeasonal to request it from the API)

        // Remove duplicates by anime id
        const seen = new Set();
        const uniqueAnime = allAnime.filter(anime => {
            if (seen.has(anime.id)) return false;
            seen.add(anime.id);
            return true;
        });

        // Only return id and main_picture
        const result = uniqueAnime.map(anime => ({
            id: anime.id,
            main_picture: anime.main_picture,
            title: anime.title
        }));

        const userID = await getUserID(token)

        await Promise.all(
            result.map(anime => addRow(userID, anime.id, anime.main_picture, anime.title))
        );  

        res.status(200).json({ anime: result });
    } catch (err) {
        console.error('Error /api/anime-profile:', err.response?.data || err.message);
        res.status(500).json({ error: 'Failed to fetch profile suggestions' });
    }
});

module.exports = router;
