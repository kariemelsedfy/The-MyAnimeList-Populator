// This endpoint takes the answers the user gave, build the list of animes they have probably watched, then adds that to the database.

const express = require('express');
const router = express.Router();
require('dotenv').config();
const axios = require('axios');
const MAL_BASE_URL = 'https://api.myanimelist.net/v2';

router.post('/', async (req, res) => {
    try {
        const startPeriod = req.body.startPeriod;
        const { fromYear } = parsePeriod(startPeriod);

        const token = req.body.MAL_ACCESS_TOKEN;
        const popularOverall = await getMostPopular(token, 50);
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
            main_picture: anime.main_picture
        }));
        console.log(result.length)
        res.json({ anime: result });
    } catch (err) {
        console.error('Error /api/anime-profile:', err.response?.data || err.message);
        res.status(500).json({ error: 'Failed to fetch profile suggestions' });
    }
});

// Authorization header helper
function getAuthHeaders(token) {
    return { Authorization: `Bearer ${token}` };
}

// 1. Most popular anime (overall ranking)
async function getMostPopular(token, limit = 10) {
    const url = `${MAL_BASE_URL}/anime/ranking`;
    const response = await axios.get(url, {
        headers: getAuthHeaders(token),
        params: { ranking_type: 'bypopularity', limit, fields: 'id,title,main_picture' }
    });
    return response.data.data.map(item => ({
        id: item.node.id,
        main_picture: item.node.main_picture
    }));
}

// 2. Seasonal anime for a given year and season (top 5)
async function getSeasonal(token, year, season, top = 5) {
    const url = `${MAL_BASE_URL}/anime/season/${year}/${season}`;
    const response = await axios.get(url, {
        headers: getAuthHeaders(token),
        params: { fields: 'id,title,main_picture' }
    });
    return response.data.data.slice(0, top).map(item => ({
        id: item.node.id,
        main_picture: item.node.main_picture
    }));
}

// 3. get top seasonal anime from startYear up to current year
async function getSeasonalRange(token, fromYear) {
    const currentYear = new Date().getFullYear();
    const seasons = ['winter', 'spring', 'summer', 'fall'];
    const allSeasonal = [];
    for (let year = fromYear; year <= currentYear; year++) {
        for (const season of seasons) {
            try {
                const list = await getSeasonal(token, year, season, 5);
                allSeasonal.push({ year, season, suggestions: list });
            } catch (err) {
                console.warn(`Skipping ${year}-${season}:`, err.message);
            }
        }
    }
    return allSeasonal;
}

// Parse period strings or year
function parsePeriod(period) {
    const p = period.toString().trim();
    // Single year (e.g., '2018')
    if (/^\d{4}$/.test(p)) {
        const y = parseInt(p, 10);
        return { fromYear: y, toYear: y };
    }
    const lower = p.toLowerCase();
    // Decade (e.g., '2010s')
    const dec = lower.match(/(\d{4})s/);
    if (dec) {
        const y = parseInt(dec[1], 10);
        return { fromYear: y, toYear: y + 9 };
    }
    // Recent (last 5 years)
    if (lower.includes('recent') || lower.includes('lately')) {
        const now = new Date().getFullYear();
        return { fromYear: now - 5, toYear: now };
    }
    // Fallback: 2000 to current year
    const now = new Date().getFullYear();
    return { fromYear: 2000, toYear: now };
}

module.exports = router;
