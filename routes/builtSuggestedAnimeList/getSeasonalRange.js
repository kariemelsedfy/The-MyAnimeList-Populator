const MAL_BASE_URL = 'https://api.myanimelist.net/v2';
const getAuthHeaders = require('./getAuthHeaders')
const axios = require('axios');


// Get seasonal anime for a given year and season (top 5)
async function getSeasonal(token, year, season, top = 5) {
    const url = `${MAL_BASE_URL}/anime/season/${year}/${season}`;
    const response = await axios.get(url, {
        headers: getAuthHeaders(token),
        params: { fields: 'id,title,main_picture' }
    });
    return response.data.data.slice(0, top).map(item => ({
        id: item.node.id,
        main_picture: item.node.main_picture, 
        title: item.node.title
    }));
}

// Get top seasonal anime from startYear up to current year
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


module.exports = getSeasonalRange;