const express = require('express');

const app = express();
const login = require('./routes/login');
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/login', login);

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});