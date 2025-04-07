const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const postsRoutes = require('./routes/posts');
const usersRoutes = require('./routes/users');
const commentsRoutes = require('./routes/comments');
const likesRoutes = require('./routes/likes');

dotenv.config();

const app = express();
app.use(express.json())
app.use(cors());

const API_PORT = process.env.API_PORT || 8080;

console.log("API_PORT:", API_PORT);

app.get('/', (req, res) => {
  res.send('API connecte bien avec postgres !');
});

app.use('/posts', postsRoutes);
app.use('/users', usersRoutes);
app.use('/comments', commentsRoutes);
app.use('/likes', likesRoutes);

app.listen(API_PORT, () => {
  console.log(`Server is running at http://localhost:${API_PORT}`);
});
