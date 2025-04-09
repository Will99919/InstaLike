const client = require('../config/db');

exports.getAllPosts = async (req, res) => {
  try {
    const result = await client.query(`
      SELECT p.*, u.username 
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de la récupération des posts');
  }
};

exports.createPost = async (req, res) => {
  const { user_id, image_url, caption } = req.body;
  try {
    const result = await client.query(
      'INSERT INTO posts (user_id, image_url, caption) VALUES ($1, $2, $3) RETURNING *',
      [user_id, image_url, caption]
    );
    const post = result.rows[0];
    const userResult = await client.query('SELECT username FROM users WHERE id = $1', [user_id]);
    post.username = userResult.rows[0].username;
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de la création du post');
  }
};