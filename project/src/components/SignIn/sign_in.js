import React, { useState } from 'react';
import './sign_in.css';
import { useNavigate } from 'react-router-dom'; 


const SignIn = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate(); 
  

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name || !email || !password || !confirmPassword) {
      setError('Tous les champs sont obligatoires.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
          // envoie les données vers l'API
      const response = await fetch('http://localhost:8000/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          nom: name,
          mail: email,
          mot_de_passe: password,
          confirmation_mot_de_passe: confirmPassword
        }),
      });

      if (!response.ok) {
        throw new Error('Échec de l’inscription. Vérifiez vos informations.');
      }

      setSuccess('Inscription réussie ! Redirection vers la connexion...');
      setTimeout(() => {
        window.location.href = "/login"; // redirection apres inscription vers connexxion
      }, 2000);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="sign-in-container">
      <h1>Créer un compte</h1>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form className="sign-in-form" onSubmit={handleSignUp}>
        <div className="form-group">
          <label htmlFor="name">Nom :</label>
          <input type="text" id="name" placeholder="Enter your Name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email :</label>
          <input type="email" id="email" placeholder="Enter Your mail address" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe :</label>
          <input type="password" id="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmer le mot de passe :</label>
          <input type="password" id="confirmPassword" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        <button type="submit" className="sign-in-button">Sign in</button>
      </form>
      <button onClick={() => navigate(-1)} className="back-button">Return</button>

    </div>
  );
};

export default SignIn;
