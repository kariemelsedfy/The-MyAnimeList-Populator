const { Client } = require("pg");
require('dotenv').config();

const client = new Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

(async () => {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL!');
    // You can now run queries here
  } catch (err) {
    console.error('Connection error:', err);
  }
})();


module.exports = client