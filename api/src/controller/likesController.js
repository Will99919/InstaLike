const client = require('../config/db');

exports.createLike = async (req, res) => {
    const { user_id, image_url, caption } = req.body;
    try {
      const result = await client.query(
        'INSERT INTO posts (user_id, image_url, caption) VALUES ($1, $2, $3) RETURNING *',
        [user_id, image_url, caption]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Erreur lors de la création du post', err);
    }
  };

  exports.getAllLikes = async (req, res) => {
    try {
      const result = await client.query('SELECT * FROM posts ORDER BY created_at DESC');
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Erreur lors de la récupération des posts', err);
    }
  };