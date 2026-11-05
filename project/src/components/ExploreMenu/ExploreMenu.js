import React from 'react';
import './ExploreMenu.css';
import salad from '../../images/salad.jpg';
import meat from '../../images/meat.jpg';
import dessert from '../../images/dessert.jpg';
import sandwich from '../../images/sandwich.jpg';
import cake from '../../images/cake.jpg';
import pasta from '../../images/pasta.jpg';
import noodles from '../../images/noodles.jpg';

const menuItems = [
  { name: 'Salad', image: salad },
  { name: 'Meat', image: meat },
  { name: 'Sandwich', image: sandwich },
  { name: 'Pasta', image: pasta },
  { name: 'Noodles', image: noodles },
  { name: 'Cake', image: cake },
  { name: 'Desserts', image: dessert },
];

// Composant principal
const ExploreMenu = () => (
  <div id="explore-menu" className="explore-menu">
    <h1>Explore Our Menu</h1>
    <p className="explore-menu-text">
      Explore our healthy and balanced menu, designed to make eating well simple and enjoyable, one meal at a time.
    </p>
    <div className="explore-menu-list">
      {menuItems.map((item, index) => (
        <div key={index} className="explore-menu-item">
          <img src={item.image} alt={item.name} />
          <p>{item.name}</p>
        </div>
      ))}
    </div>
  </div>
);

export default ExploreMenu;
