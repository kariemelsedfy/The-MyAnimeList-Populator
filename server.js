const express = require('express');
const cors = require('cors');
const app = express();
const login = require('./routes/login');

app.use(cors());


app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/api/login', login);


app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});