from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Consommation, Aliment, Recette_Consommation, Recette, Utilisateur
from datetime import datetime, timedelta, date
from sqlalchemy import func
from pydantic import BaseModel
from app.routes.user_routes import get_current_user

router = APIRouter(prefix="/consumption", tags=["Consumption"])

class RecipeConsumptionCreate(BaseModel):
    recipe_id: int
    consumption_date: date

@router.get("/history")
def get_consumption_history(
    db: Session = Depends(get_db),
    current_user: Utilisateur = Depends(get_current_user) 
):
    # recuperer l'historique des 30 derniers jours
    thirty_days_ago = datetime.now() - timedelta(days=30)
    
    
    food_consumption = (
        db.query(
            Consommation.date_consommation,
            func.sum(Aliment.calories * Consommation.quantite).label('calories'),
            func.sum(Aliment.proteines * Consommation.quantite).label('proteins'),
            func.sum(Aliment.lipides * Consommation.quantite).label('lipids'),
            func.sum(Aliment.glucides * Consommation.quantite).label('carbs')
        )
        .join(Aliment)
        .filter(
            Consommation.date_consommation >= thirty_days_ago,
            Consommation.id_user == current_user.id_user  
        )
        .group_by(Consommation.date_consommation)
    )

    # obtenir la consommation de la recette et ajouter un filtre utilisateur
    recipe_consumption = (
        db.query(
            Recette_Consommation.date_consommation,
            func.sum(Recette.total_calories).label('calories'),
            func.sum(Recette.total_calories * 0.2).label('proteins'),
            func.sum(Recette.total_calories * 0.3).label('lipids'),
            func.sum(Recette.total_calories * 0.5).label('carbs')
        )
        .join(Recette)
        .filter(
            Recette_Consommation.date_consommation >= thirty_days_ago,
            Recette_Consommation.id_user == current_user.id_user 
        )
        .group_by(Recette_Consommation.date_consommation)
    )

    # Combine 
    consumption_by_date = {}
    
    for day in food_consumption.all():
        date_str = str(day.date_consommation)
        consumption_by_date[date_str] = {
            "date": date_str,
            "calories": float(day.calories or 0),
            "proteins": float(day.proteins or 0),
            "lipids": float(day.lipids or 0),
            "carbs": float(day.carbs or 0)
        }

    for day in recipe_consumption.all():
        date_str = str(day.date_consommation)
        if date_str in consumption_by_date:
            consumption_by_date[date_str]["calories"] += float(day.calories or 0)
            consumption_by_date[date_str]["proteins"] += float(day.proteins or 0)
            consumption_by_date[date_str]["lipids"] += float(day.lipids or 0)
            consumption_by_date[date_str]["carbs"] += float(day.carbs or 0)
        else:
            consumption_by_date[date_str] = {
                "date": date_str,
                "calories": float(day.calories or 0),
                "proteins": float(day.proteins or 0),
                "lipids": float(day.lipids or 0),
                "carbs": float(day.carbs or 0)
            }

    return sorted(consumption_by_date.values(), key=lambda x: x["date"])





@router.post("/log-recipe")
def log_recipe_consumption(
 consumption: RecipeConsumptionCreate,
    db: Session = Depends(get_db),
    current_user: Utilisateur = Depends(get_current_user) 
):
    assert isinstance(consumption.recipe_id, int), "l'id doit etre un entier"
    assert consumption.recipe_id > 0, "l'id > 0"
    assert consumption.consumption_date <= date.today(), "La date de consommation ne doit pas etre dans le futur"


    # cree une nouvelle ligne consommation de recette
    new_consumption = Recette_Consommation(
        id_user=current_user.id_user,
        id_recette=consumption.recipe_id,
        date_consommation=consumption.consumption_date
    )
    db.add(new_consumption)
    db.commit()
    return {"message": "Consommation de recette enregistrée avec succès"}


