import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Profile({ user }) {
  const [myPosts, setMyPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({});
  const [likes, setLikes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/posts')
      .then(response => {
        const userPosts = response.data.filter(post => post.user_id === user.id);
        setMyPosts(userPosts);
      })
      .catch(error => console.error('Erreur lors de la récupération des posts:', error));
    axios.get('http://localhost:8080/comments')
      .then(response => setComments(response.data))
      .catch(error => console.error('Erreur lors de la récupération des commentaires:', error));
    axios.get('http://localhost:8080/likes')
      .then(response => setLikes(response.data))
      .catch(error => console.error('Erreur lors de la récupération des likes:', error));
  }, [user]);

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

  const handleLogout = () => {
    window.location.href = '/';
  };

  return (
    <div>
      <div className="profile-header">
        <p>Profil de {user.username}</p>
        <Link to="/feed">Retour</Link>
      </div>
      <h2>Mes publications</h2>
      {myPosts.length === 0 ? (
        <p>Vous n’avez pas encore publié.</p>
      ) : (
        myPosts.map(post => (
          <div key={post.id} className="post">
            <img src={post.image_url} alt={post.caption} />
            <p>{post.caption}</p>
            <small>{new Date(post.created_at).toLocaleString()}</small>
            <p className="like-count">{likes.find(l => l.post_id === post.id)?.like_count || 0} J’aime</p>
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
      <div className="profile-footer">
        <button className="logout-button" onClick={handleLogout}>Se déconnecter</button>
      </div>
    </div>
  );
}

export default Profile;