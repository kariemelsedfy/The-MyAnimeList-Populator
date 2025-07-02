const axios = require('axios');
const getAuthHeaders = require('./getAuthHeaders')

async function getUserID(token) {
    const response = await axios.get("https://api.myanimelist.net/v2/users/@me", {
            headers: getAuthHeaders(token),
        });
    return response.data.id;
}

module.exports = getUserID;