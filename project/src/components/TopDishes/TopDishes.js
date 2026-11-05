import React from 'react';
import './TopDishes.css';
import dish1 from '../../images/dish1.jpg';
import dish2 from '../../images/dish2.jpg';
import dish3 from '../../images/dish3.jpg';
import dish4 from '../../images/dish4.jpg';



const topDishes = [
  {
    id: 1,
    name: "Spaghetti Carbonara",
    description: "A classic Italian pasta dish with creamy sauce.",
    calories: 500,
    image: dish1,
  },
  {
    id: 2,
    name: "Caesar Salad",
    description: "Fresh lettuce with Caesar dressing.",
    calories: 250,
    image: dish2,

   
  },
  {
    id: 3,
    name: "Grilled Chicken",
    description: "Juicy grilled chicken with vegetables.",
    calories: 300,
    image: dish3,

  },
  {
    id: 4,
    name: "Vegetarian Pizza",
    description: "A healthy pizza loaded with fresh veggies.",
    calories: 400,
    image: dish4,

  },
];

const TopDishes = () => (
  <div className="top-dishes-section">
    <h2>Top Dishes</h2>
    <p>Discover our most popular dishes loved by our users!</p>
    <div className="top-dishes-list">
      {topDishes.map((dish) => (
        <div className="top-dish-item" key={dish.id}>
          <img src={dish.image} alt={dish.name} className="top-dish-image" />
          <h3>{dish.name}</h3>
          <p>{dish.description}</p>
                    <span className="top-dish-calories">{dish.calories} kcal</span>


        </div>
      ))}
    </div>
  </div>
);

export default TopDishes;
