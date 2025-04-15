import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../profile.css';

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
      <section className="profile-description">
        <div className="container">
          <div className="profile-text">
            <div className="profile-name">
              <span><b>{user.username}</b></span>
              <Link to="/feed">Retour au feed</Link>
            </div>
          </div>
          <br />
          <div className="profile-info">
            <p><strong>{myPosts.length}</strong> publications</p>
          </div>
          <div className="clear"></div>
        </div>
      </section>

      <section className="feed">
        <div className="container">
          <div className="line-feed">
            <div tab="publish" className="single-line-name active">
              <div className="line-mark"></div>
              <p>Publications</p>
            </div>
          </div>
        </div>
      </section>

      <section id="publish">
        <div className="container">
          {myPosts.length === 0 ? (
            <p>Vous n’avez pas encore publié.</p>
          ) : (
            myPosts.map(post => (
              <div
                key={post.id}
                className="publish-single"
                style={{ backgroundImage: `url(${post.image_url})` }}
              >
                <div className="post-overlay">
                  <p className="like-count">
                    {likes.find(l => l.post_id === post.id)?.like_count || 0} J’aime
                  </p>
                  <button onClick={() => handleLike(post.id)}>J’aime</button>
                </div>
              </div>
            ))
          )}
          <div className="clear"></div>
        </div>
      </section>

      <div className="profile-footer">
        <button className="logout-button" onClick={handleLogout}>Se déconnecter</button>
      </div>
    </div>
  );
}

export default Profile;