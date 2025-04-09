const client = require('../config/db');

exports.createComment = async (req, res) => {
  const { user_id, post_id, content } = req.body;
  try {
    const result = await client.query(
      'INSERT INTO comments (user_id, post_id, content) VALUES ($1, $2, $3) RETURNING *',
      [user_id, post_id, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de la création du commentaire');
  }
};

exports.getAllComments = async (req, res) => {
  try {
    const result = await client.query(`
      SELECT c.*, u.username 
      FROM comments c
      JOIN users u ON c.user_id = u.id
      ORDER BY c.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de la récupération des commentaires');
  }
};