const MAL_BASE_URL = 'https://api.myanimelist.net/v2';
const getAuthHeaders = require('./getAuthHeaders')
const axios = require('axios');

//Get Most popular anime (overall ranking)
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

module.exports = getMostPopular;