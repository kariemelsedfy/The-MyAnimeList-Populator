function buildURL(baseURL = "https://myanimelist.net/v1/oauth2/authorize", params) {
  const url = new URL(baseURL);
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key]);
    }
  });
  return url.toString();
}


module.exports = buildURL;