from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Recette, Aliment, RecetteAliment
from sqlalchemy import and_
from typing import List, Optional

router = APIRouter(prefix="/recipes", tags=["Recipes"])

@router.get("/")
def get_filtered_recipes(
    aliments: Optional[str] = None,
    max_calories: Optional[float] = None,
    max_budget: Optional[float] = None,
    vegan: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    if max_calories is not None:
        assert isinstance(max_calories, (int, float)), "max_calories doit etre un entier ou float "
        assert max_calories >= 0, "max_calories doit etre > 0"

    if max_budget is not None:
        assert isinstance(max_budget, (int, float)), "max_budget doit etre un nombre"
        assert max_budget >= 0, "max_budget doit etre >0"


    if vegan is not None:
        assert isinstance(vegan, bool), "vegan doit etre un bool"

    query = db.query(Recette).distinct()
    
    if aliments:
        aliment_list = aliments.split(',')
        for aliment_nom in aliment_list:
            subquery = db.query(RecetteAliment.id_recette)\
                .join(Aliment)\
                .filter(Aliment.nom == aliment_nom)\
                .subquery()
            query = query.filter(Recette.id_recette.in_(subquery))
    
    # filtre calories
    if max_calories:
        query = query.filter(Recette.total_calories <= max_calories)


    # Filtre budget
    if max_budget:
        query = query.filter(Recette.budget <= max_budget)
    

    #  filtre vegan
    if vegan:
        query = query.filter(Recette.vegan == True)
    
    recipes = query.all()



    # aucune recette trouvée
    if not recipes:
        raise HTTPException(
            status_code=404,
            detail="Aucune recette ne correspond à vos critères"
        )



    # convertir les recettes en dict et inclure les aliments pour les envoyer au foront end 
    recipes_with_aliments = []
    for recipe in recipes:
        recipe_dict = {
            "id_recette": recipe.id_recette,
            "nom": recipe.nom,
            "description": recipe.description,
            "total_calories": float(recipe.total_calories) if recipe.total_calories else 0,
            "budget": float(recipe.budget) if recipe.budget else 0,
            "vegan": recipe.vegan,
            "aliments": [
                {
                    "id_aliment": aliment.id_aliment,
                    "nom": aliment.nom,
                    "calories": float(aliment.calories) if aliment.calories else 0,
                    "cout": float(aliment.cout) if aliment.cout else 0
                }
                for aliment in recipe.aliments
            ]
        }
        recipes_with_aliments.append(recipe_dict)

    return recipes_with_aliments

@router.get("/aliments")
def get_available_aliments(db: Session = Depends(get_db)):
    aliments = db.query(Aliment).all()
    return aliments