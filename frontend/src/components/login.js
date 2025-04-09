import React, { useState } from 'react';
import axios from 'axios';

function Login({ setUser }) {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ username: '', email: '', password: '' });
  const [isSignup, setIsSignup] = useState(false);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData({ ...signupData, [name]: value });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/users/login', loginData)
      .then(response => {
        setUser(response.data.user);
        setLoginData({ email: '', password: '' });
      })
      .catch(error => {
        console.error('Erreur lors de la connexion:', error);
        alert('Erreur de connexion, vérifiez vos identifiants');
      });
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/users', signupData)
      .then(response => {
        alert('Inscription réussie ! Connectez-vous maintenant.');
        setSignupData({ username: '', email: '', password: '' });
        setIsSignup(false);
      })
      .catch(error => {
        console.error(`Erreur lors de l'inscription:`, error);
        alert(`Erreur d'inscription`);
      });
  };

  return (
    <div className="login-container">
      {isSignup ? (
        <form className="login-form" onSubmit={handleSignupSubmit}>
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
        <form className="login-form" onSubmit={handleLoginSubmit}>
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
      )}
    </div>
  );
}

export default Login;