import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ username: '', email: '', password: '' });
  const [isSignup, setIsSignup] = useState(false);


  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log('Tentative de connexion avec:', loginData);
    axios.post('http://localhost:8080/users/login', loginData)
      .then(response => {
        console.log(`Réponse de l'API:`, response.data);
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
    console.log(`Tentative d'inscription avec:`, signupData);
    axios.post('http://localhost:8080/users', signupData)
      .then(response => {
        console.log(`Réponse de l'API:`, response.data);
        alert('Inscription réussie ! Connectez-vous maintenant.');
        setSignupData({ username: '', email: '', password: '' });
        setIsSignup(false);
      })
      .catch(error => {
        console.error(`Erreur lors de l'inscription:`, error.response ? error.response.data : error.message);
        alert(`Erreur d'inscription, vérifiez vos données`);
      });
  };

  const handleLogout = () => {
    setUser(null);
    setPosts([]);
    setComments([]);
  };

  return (
    <div className= "App">
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
                        placeholder="email"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        value={signupData.password}
                        onChange={handleSignupChange}
                        placeholder="Password"
                        required
                    />
                        <button type="submit">S'inscrire</button>
                        <button type="button" onClick={() => setIsSignup(true)}>Retour au login</button>
                </form>
            ) : (
                <>
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
                    <button type="button" onClick={() => setIsSignup(true)}>S'inscrire</button>
                </form>
            )
        )};
    </div>
  )
}

export default App;