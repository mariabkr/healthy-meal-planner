import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import "react-responsive-carousel/lib/styles/carousel.min.css"; // style du carousel
import { Carousel } from 'react-responsive-carousel'; // composant carousel
import { useNavigate } from 'react-router-dom'; 
import './Herosection.css'; 

// Import images pour le carousel
import image1 from '../../images/image1.jpg';
import image2 from '../../images/image2.jpg';
import image4 from '../../images/image4.jpg';
import image6 from '../../images/image6.jpg';


const HeroSection = () => {
  const navigate = useNavigate(); 
  const [isLoggedIn, setIsLoggedIn] = useState(false); // etat user connecté ou pas 

  // check if l'utilisateur est connecté (via le token)
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); 
  }, []);

  // Redirection vers la page d'inscription si l'utilisateur clique sur le bouton
  const handleSignUpClick = () => {
    navigate('/sign-in'); 
  };

  return (
    <section className="hero">
      <div className='hero-text'>
        <h1>Discover GreenPlates 🍃 </h1>
        <p>
          Your partner for healthy and balanced eating. Plan your meals according to your preferences and budget.
        </p>
        {!isLoggedIn && ( 
          <button 
            className="btn btn-success btn-lg" 
            onClick={handleSignUpClick}>
              Sign up now
          </button>
        )}
      </div>
      
      <div className="carousel-container">
        <Carousel autoPlay infiniteLoop showThumbs={false}> 
          <div>
            <img src={image6} alt="Healthy Food 1" />
          </div>
          <div>
            <img src={image1} alt="Healthy Food 2" />
          </div>
          <div>
            <img src={image4} alt="Healthy Food 3" />
          </div>
          <div>
            <img src={image2} alt="Healthy Food 4" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default HeroSection;
