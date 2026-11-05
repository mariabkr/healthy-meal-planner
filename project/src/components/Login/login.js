import React, { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom'; // Import pour la navigation



const Login = () => {
  const [email, setEmail] = useState('');           // Stock l'email
  const [password, setPassword] = useState('');     // Stock le mot de passe
  const [error, setError] = useState('');           // message d'erreur
  const [success, setSuccess] = useState('');       // message de succès
  const navigate = useNavigate();                   // rediriger l'utilisateur



  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    try {
            // envoi des données au backend FastAPI
      const response = await fetch('http://localhost:8000/users/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          mail: email,
          mot_de_passe: password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Échec de la connexion");
      }

      localStorage.setItem('token', data.access_token); // stock le token dans le localstorage
      setSuccess('Connexion réussie ! Redirection...');
      
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);

    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      <h1>Connexion</h1>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form className="login-form" onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email :</label>
          <input type="email" id="email" placeholder="Enter your mail address" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe :</label>
          <input type="password" id="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
      <button onClick={() => navigate(-1)} className="back-button">Return</button>

    </div>
  );
};

export default Login;
