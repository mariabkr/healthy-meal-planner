import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom'; 
import './header.css';
import logo from '../../images/logo.png';

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // etat pour savoir si l'utilisateur est connecté

  useEffect(() => {
    // on verifie si un token est présent
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // naviguer vers explore-menu
  const handleMenuClick = () => {
    navigate('/'); 
    setTimeout(() => {
      const element = document.getElementById('explore-menu'); 
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' }); // scroll vers explore menu
      }
    }, 100); 
  };

    // deconnexion et suppression du token
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Logo GreenPlates" />
        </Link>
      </div>
      <nav className="navbar">
        {/* si le user esr connecter  */}
  {isLoggedIn ? (
    <>
      <Link to="/" onClick={handleMenuClick} className="navbar-link">Our menu</Link>
      <Link to="/calories">Calories</Link>
      <Link to="/recipes">Recipes !</Link>
      <Link to="/" onClick={handleLogout} className="navbar-link">Logout</Link>
    </>
  ) : (
    <>
      <Link to="/login">Login</Link>
      <Link to="/sign-in">SignIn</Link>
      <Link to="/" onClick={handleMenuClick} className="navbar-link">Our menu</Link>
    </>
  )}
</nav>

    </header>
  );
};

export default Header;
