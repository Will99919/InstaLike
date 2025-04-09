import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Feed({ user }) {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ image_url: '', caption: '' });
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({});
  const [likes, setLikes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/posts')
      .then(response => setPosts(response.data))
      .catch(error => console.error('Erreur lors de la récupération des posts:', error));
    axios.get('http://localhost:8080/comments')
      .then(response => setComments(response.data))
      .catch(error => console.error('Erreur lors de la récupération des commentaires:', error));
    axios.get('http://localhost:8080/likes')
      .then(response => setLikes(response.data))
      .catch(error => console.error('Erreur lors de la récupération des likes:', error));
  }, []);

  const handlePostChange = (e) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    const postData = { user_id: user.id, image_url: newPost.image_url, caption: newPost.caption };
    axios.post('http://localhost:8080/posts', postData)
      .then(response => {
        setPosts([response.data, ...posts]);
        setNewPost({ image_url: '', caption: '' });
      })
      .catch(error => console.error('Erreur lors de la création du post:', error));
  };

  const handleCommentChange = (postId) => (e) => {
    setNewComment({ ...newComment, [postId]: e.target.value });
  };

  const handleCommentSubmit = (postId) => (e) => {
    e.preventDefault();
    const commentData = { user_id: user.id, post_id: postId, content: newComment[postId] || '' };
    axios.post('http://localhost:8080/comments', commentData)
      .then(response => {
        setComments([response.data, ...comments]);
        setNewComment({ ...newComment, [postId]: '' });
      })
      .catch(error => console.error('Erreur lors de la création du commentaire:', error));
  };

  const handleLike = (postId) => {
    axios.post('http://localhost:8080/likes', { user_id: user.id, post_id: postId })
      .then(() => {
        axios.get('http://localhost:8080/likes')
          .then(response => setLikes(response.data))
          .catch(error => console.error('Erreur lors de la récupération des likes:', error));
      })
      .catch(error => console.error('Erreur lors de l’ajout du like:', error));
  };

  return (
    <div>
      <div className="feed-header">
        <p>Bienvenue, {user.username} ! <Link to="/profile">Profil 👤​</Link></p>
      </div>
      <form className="post-form" onSubmit={handlePostSubmit}>
        <input
          type="text"
          name="image_url"
          value={newPost.image_url}
          onChange={handlePostChange}
          placeholder="URL de l'image"
          required
        />
        <input
          type="text"
          name="caption"
          value={newPost.caption}
          onChange={handlePostChange}
          placeholder="Légende"
        />
        <button type="submit">Publier</button>
      </form>
      <h2>Publications</h2>
      {posts.length === 0 ? (
        <p>Aucun post pour l'instant.</p>
      ) : (
        posts.map(post => (
          <div key={post.id} className="post">
            <img src={post.image_url} alt={post.caption} />
            <p>{post.caption}</p>
            <small>Par {post.username}</small>
            <p className="like-count">{likes.find(l => l.post_id === post.id)?.like_count || 0} J’aime</p>
            <button onClick={() => handleLike(post.id)}>🤍</button>
            <div className="comment-section">
              <h3>Commentaires</h3>
              {comments.filter(c => c.post_id === post.id).map(comment => (
                <p key={comment.id}>{comment.content} <small>(par {comment.username})</small></p>
              ))}
              <form className="comment-form" onSubmit={handleCommentSubmit(post.id)}>
                <input
                  type="text"
                  value={newComment[post.id] || ''}
                  onChange={handleCommentChange(post.id)}
                  placeholder="Ajouter un commentaire"
                />
                <button type="submit">Commenter</button>
              </form>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Feed;