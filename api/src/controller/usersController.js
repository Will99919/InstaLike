const client = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
 
const saltRounds = 10;

exports.createUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const result = await client.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
            [username, email, hashedPassword]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send(`Erreur lors de la création de l'utilisateur`); 
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM users ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la récupération des utilisateurs');
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {

      const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = result.rows[0];
  
      if (!user) {
        return res.status(404).send('Utilisateur non trouvé');
      }
  
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        res.json({
          message: 'Connexion réussie',
          user: { id: user.id, username: user.username, email: user.email, created_at: user.created_at }
        });
      } else {
        res.status(401).send('Mot de passe incorrect');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Erreur lors de la connexion');
    }
};
