import React, { useState, useEffect } from "react";
import "./recipe.css";
import dishPlaceholder from "../../images/dish1.jpg";
import salade from "../../images/salade.jpg";
import buddha_bowl from "../../images/buddha_bowl.jpg";
import saumon from "../../images/saumon.jpg";
import curry_lentilles from "../../images/curry_lentilles.jpg";
import toast_avocat from "../../images/toast_avocat.png";
import quinoa_legumes from "../../images/quinoa_legumes.png";
import omelette from "../../images/omelette.jpg";
import salade_pois_chiches from "../../images/salade_pois_chiches.png";
import riz_poulet from "../../images/riz_poulet.jpg";
import bowl_proteine from "../../images/bowl_proteine.jpg";


import { FaLeaf, FaSearch, FaFilter } from 'react-icons/fa';

const RecipesPage = () => {
  const [recipes, setRecipes] = useState([]);                 // toutes les recettes
  const [allAliments, setAllAliments] = useState([]);         //tTous les aliments
  const [selectedAliments, setSelectedAliments] = useState([]); // ingrédients sélectionnés
  const [calories, setCalories] = useState("");               // max calories
  const [isVegan, setIsVegan] = useState(false);              // Vegan ?
  const [message, setMessage] = useState("");                 // message info/erreur
  const [loading, setLoading] = useState(false);              // our recherche
  const [showFilters, setShowFilters] = useState(false);      // affichage des filtres
  const [maxBudget, setMaxBudget] = useState("");             // budget max
  const [selectedRecipe, setSelectedRecipe] = useState(null); // recette sélectionnée
  const [showIngredients, setShowIngredients] = useState(false); // afficher ingrédients
  
  const images = {
    "Salade César au Poulet": salade,
    "Buddha Bowl Végétalien": buddha_bowl,
    "Curry de Lentilles": curry_lentilles,
    "Toast à l'Avocat": toast_avocat,
    "Bol de Quinoa aux Légumes": quinoa_legumes,
    "Salade de Pois Chiches": salade_pois_chiches,
    "Saumon aux Épinards": saumon, 
    "Omelette aux Épinards":omelette,
    "Riz au Poulet":riz_poulet,
    "Bowl Protéiné":bowl_proteine,

  };
  



  const getImage = (recipeName) => images[recipeName] || dishPlaceholder;

  


  

  useEffect(() => {
    const fetchAliments = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/recipes/aliments");
        const data = await response.json();
        setAllAliments(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des aliments:", error);
        setMessage("Erreur lors du chargement des aliments");
      }
    };
    fetchAliments();
  }, []);

  // recherche des recettes % les filtres
  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (selectedAliments.length > 0) {
        params.append("aliments", selectedAliments.join(","));
      }

      if (calories) params.append("max_calories", calories);
      if (maxBudget) params.append("max_budget", maxBudget);
      if (isVegan) params.append("vegan", "true");

      // Remove credentials and simplify headers
      const response = await fetch(`http://127.0.0.1:8000/recipes?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      const data = await response.json();

      if (response.ok) {
        setRecipes(data);
        setMessage("");
        setShowFilters(false);
      } else {
        setMessage(data.detail || "Aucune recette trouvée");
        setRecipes([]);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche de recettes:", error);
      setMessage("Erreur lors de la recherche");
    } finally {
      setLoading(false);
    }
  };

  //  enregistrement d'une consommation
  const handleLogConsumption = async (recipeId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/consumption/log-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          recipe_id: recipeId,
          consumption_date: new Date().toISOString().split('T')[0]
        })
      });

      if (response.ok) {
        setMessage('Recette ajoutée à votre historique de consommation!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Impossible d\'enregistrer la consommation');
      }
    } catch (error) {
      console.error('Journalisation des erreurs de consommation:', error);
      setMessage('Erreur lors de l\'ajout de la recette à l\'historique de consommation (se déconnecter puis se reconnecter)');
    }
  };

  // afficher les ingrédients d’une recette (popup)
  const handleShowIngredients = (e, recipe) => {
    e.stopPropagation();
    setSelectedRecipe(recipe);
    setShowIngredients(true);
  };

  return (
    <div className="recipes-page">
      <div className="recipes-header">
        <h1>Discover our Recipes</h1>
        <p>Healthy and delicious recipes tailored to your preferences</p>
        <button 
          className="toggle-filters-button"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter /> Filtres
        </button>
      </div>

      <div className={`filters-section ${showFilters ? 'show' : ''}`}>
        <div className="filters-content">
          <div className="filter-group">
            <div className="filter-item">
              <label>
                <FaSearch className="filter-icon" />
                Select ingredients

              </label>
              <div className="ingredients-tags">
                {allAliments.map((aliment) => (
                  <button
                    key={aliment.id_aliment}
                    className={`ingredient-tag ${
                      selectedAliments.includes(aliment.nom) ? "selected" : ""
                    }`}
                    onClick={() => {
                      const updated = selectedAliments.includes(aliment.nom)
                        ? selectedAliments.filter(a => a !== aliment.nom)
                        : [...selectedAliments, aliment.nom];
                      setSelectedAliments(updated);
                    }}
                  >
                    {aliment.nom}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-row">
              <div className="filter-item calories-filter">
              <label>Maximum calories</label>
              <div className="input-with-unit">
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    placeholder="Ex: 300"
                    min="0"
                  />
                  <span className="unit">kcal</span>
                </div>
              </div>

              <div className="filter-item budget-filter">
                <label>Maximal budget (€)</label>
                <div className="input-with-unit">
                  <input
                    type="number"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                    placeholder="Ex: 20"
                    min="0"
                  />
                  <span className="unit">€</span>
                </div>
              </div>
            </div>

            <div className="filter-row single-row">
              <div className="filter-item checkbox-item full-width">
                <label className="vegan-label">
                  <input
                    type="checkbox"
                    checked={isVegan}
                    onChange={(e) => setIsVegan(e.target.checked)}
                  />
                  <FaLeaf className="vegan-icon" />
                  Végans only
                </label>
              </div>
            </div>
          </div>

          <button 
            className="search-button" 
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Recherche...
              </>
            ) : (
              <>
                <FaSearch />
                Search
              </>
            )}
          </button>
        </div>
      </div>

      {message && (
        <div className={`message ${message.includes('Erreur') ? 'error' : 'info'}`}>
          {message}
        </div>
      )}

      {showIngredients && selectedRecipe && (
        <div className="ingredients-popup-overlay" onClick={() => setShowIngredients(false)}>
          <div className="ingredients-popup" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={() => setShowIngredients(false)}>×</button>
            <h3>Ingrédients pour {selectedRecipe.nom}</h3>
            <div className="ingredients-list">
              {selectedRecipe.aliments && selectedRecipe.aliments.length > 0 ? (
                selectedRecipe.aliments.map((aliment, index) => (
                  <div key={index} className="ingredient-item">
                    <span>{aliment.nom}</span>
                    <div className="ingredient-details">
                      <small>{aliment.calories} kcal</small>
                      <small>{aliment.cout}€</small>
                    </div>
                  </div>
                ))
              ) : (
                <p>Aucun ingrédient disponible pour cette recette.</p>
              )}
            </div>
          </div>
        </div>
      )}

<div className="recipes-grid">
  {recipes.map((recipe) => (
    <div key={recipe.id_recette} className="recipe-card">
      <div className="recipe-image-container">
        <img src={getImage(recipe.nom)} alt={recipe.nom} className="recipe-image" />
        {recipe.vegan && (
          <div className="recipe-badge">
            <FaLeaf /> Végan
          </div>
        )}
      </div>


            <div className="recipe-content">
              <h3>{recipe.nom}</h3>
              <p className="recipe-description">{recipe.description}</p>
              <div className="recipe-details">
                <span className="recipe-calories">
                  {recipe.total_calories} kcal
                </span>
                <span className="recipe-time">
                  {recipe.budget} €
                </span>
              </div>
            </div>
            <div className="recipe-actions">
              <button 
                className="show-ingredients-button"
                onClick={(e) => handleShowIngredients(e, recipe)}
              >
                Voir les ingrédients
              </button>
              <button 
                className="log-consumption-button"
                onClick={(e) => {
                  e.stopPropagation(); 
                  handleLogConsumption(recipe.id_recette);
                }}
              >
                Ajouter à ma consommation
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipesPage;



