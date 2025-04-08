import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ username: '', email: '', password: '' });
  const [isSignup, setIsSignup] = useState(false);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ image_url: '', caption: '' });
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({});


  useEffect(() => {
    if (user) {
      axios.get('http://localhost:8080/posts')
        .then(response => setPosts(response.data))
        .catch(error => console.error('Erreur lors de la récupération des posts:', error));
      axios.get('http://localhost:8080/comments')
        .then(response => setComments(response.data))
        .catch(error => console.error('Erreur lors de la récupération des commentaires:', error));
    }
  }, [user]);


  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log('Tentative de connexion avec:', loginData);
    axios.post('http://localhost:8080/users/login', loginData)
      .then(response => {
        console.log('Réponse de l’API:', response.data);
        setUser(response.data.user);
        setLoginData({ email: '', password: '' });
      })
      .catch(error => {
        console.error('Erreur lors de la connexion:', error.response ? error.response.data : error.message);
        alert('Erreur de connexion, vérifiez vos identifiants');
      });
  };


  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData({ ...signupData, [name]: value });
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    console.log('Tentative d’inscription avec:', signupData);
    axios.post('http://localhost:8080/users', signupData)
      .then(response => {
        console.log('Réponse de l’API:', response.data);
        alert('Inscription réussie ! Connectez-vous maintenant.');
        setSignupData({ username: '', email: '', password: '' });
        setIsSignup(false);
      })
      .catch(error => {
        console.error('Erreur lors de l’inscription:', error.response ? error.response.data : error.message);
        alert('Erreur d’inscription, vérifiez vos données');
      });
  };


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
      .then(() => alert('Post liké !')) 
      .catch(error => console.error('Erreur lors de l’ajout du like:', error));
  };

  const handleLogout = () => {
    setUser(null);
    setPosts([]);
    setComments([]);
  };

  return (
    <div className="App">
      <h1>InstaLike</h1>

      {!user ? (
        isSignup ? (
          <form onSubmit={handleSignupSubmit}>
            <input
              type="text"
              name="username"
              value={signupData.username}
              onChange={handleSignupChange}
              placeholder="Nom d'utilisateur"
              required
            />
            <input
              type="email"
              name="email"
              value={signupData.email}
              onChange={handleSignupChange}
              placeholder="Email"
              required
            />
            <input
              type="password"
              name="password"
              value={signupData.password}
              onChange={handleSignupChange}
              placeholder="Mot de passe"
              required
            />
            <button type="submit">S’inscrire</button>
            <button type="button" onClick={() => setIsSignup(false)}>Retour au login</button>
          </form>
        ) : (
          <form onSubmit={handleLoginSubmit}>
            <input
              type="email"
              name="email"
              value={loginData.email}
              onChange={handleLoginChange}
              placeholder="Email"
              required
            />
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
              placeholder="Mot de passe"
              required
            />
            <button type="submit">Se connecter</button>
            <button type="button" onClick={() => setIsSignup(true)}>S’inscrire</button>
          </form>
        )
      ) : (
        <>
          <p>Bienvenue, {user.username} ! <button onClick={handleLogout}>Se déconnecter</button></p>

          <form onSubmit={handlePostSubmit}>
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

          
        </>
      )}
    </div>
  );
}

export default App;