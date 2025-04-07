const client = require('../config/db');

exports.createComment = async (req, res) => {
    const { user_id, post_id, content } = req.body;
    try {
      const result = await client.query(
        'INSERT INTO posts (user_id, post_id, content) VALUES ($1, $2, $3) RETURNING *',
        [user_id, post_id, content]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).send('Erreur lors de la création du post', err);
    }
  };

  exports.getAllComments = async (req, res) => {
    try {
      const result = await client.query('SELECT * FROM posts ORDER BY created_at DESC');
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).send('Erreur lors de la récupération des posts', err);
    }
  };