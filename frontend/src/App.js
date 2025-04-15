import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login';
import Feed from './components/feed';
import Profile from './components/profil';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="App">
      <h1>InstaLike</h1>
      <Routes>
        <Route path="/" element={!user ? <Login setUser={setUser} /> : <Navigate to="/feed" />} />
        <Route path="/feed" element={user ? <Feed user={user} /> : <Navigate to="/" />} />
        <Route path="/feed" element={user ? <Feed user={user} /> : <Navigate to="/" />} />
        <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;