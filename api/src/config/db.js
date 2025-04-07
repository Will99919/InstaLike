const { Client } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT),
  });

  client.connect()
  .then(() => console.log('Connecté à la base de données PostgreSQL'))
  .catch(err => console.error('Erreur de connexion à PostgreSQL:', err));

module.exports = client;