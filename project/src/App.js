import React from 'react';
import Header from './components/Header/header'; 
import HeroSection from './components/HeroSection/hero'; 
import ExploreMenu from './components/ExploreMenu/ExploreMenu';
import Login from './components/Login/login'; 
import './components/Header/header.css'; 
import './components/HeroSection/Herosection.css'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopDishes from './components/TopDishes/TopDishes';
import SignIn from './components/SignIn/sign_in';
import RecipesPage from "./components/Recipes/recipe";
import CaloriesPage from './components/Calories/Calories';




function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={
            <>
              <HeroSection />
              <ExploreMenu />
              <TopDishes />
            </>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/menus" element={<ExploreMenu />} /> 
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/calories" element={<CaloriesPage />} /> 



        </Routes>
      </div>
    </Router>
  );
}

export default App;
