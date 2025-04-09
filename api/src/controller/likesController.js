const client = require('../config/db');

exports.createLike = async (req, res) => {
  const { user_id, post_id } = req.body;
  try {
    const result = await client.query(
      'INSERT INTO likes (user_id, post_id) VALUES ($1, $2) RETURNING *',
      [user_id, post_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de la création du like');
  }
};

exports.getLikes = async (req, res) => {
  try {
    const result = await client.query('SELECT post_id, COUNT(*) as like_count FROM likes GROUP BY post_id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de la récupération des likes');
  }
};