// Authorization header helper
function getAuthHeaders(token) {
    return { Authorization: `Bearer ${token}` };
}

module.exports = getAuthHeaders;