const express = require('express');
const cors = require('cors');
const app = express();
const login = require('./routes/login');
const getToken = require('./routes/getToken')
const buildSuggestedAnimeList = require('./routes/buildSuggestedAnimeList')
const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(express.json())
app.use(cors());


app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/api/login', login);
app.use('/api/getToken', getToken);
app.use('/api/buildSuggestedAnimeList', buildSuggestedAnimeList);


app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});