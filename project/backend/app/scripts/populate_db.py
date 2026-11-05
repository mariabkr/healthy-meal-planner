from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta
from app.models import Aliment, Recette, RecetteAliment
from app.database import Base, engine

Base.metadata.create_all(bind=engine)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()
# bd generer par IA
def populate_database():
    try:
        # ajouter aliments
        aliments = [
            Aliment(
                nom="Tomate",
                calories=22.0,
                proteines=1.1,
                lipides=0.2,
                glucides=4.8,
                cout=0.50,
                vegan=True
            ),
            Aliment(
                nom="Poulet",
                calories=165.0,
                proteines=31.0,
                lipides=3.6,
                glucides=0.0,
                cout=3.50,
                vegan=False
            ),
            Aliment(
                nom="Riz",
                calories=130.0,
                proteines=2.7,
                lipides=0.3,
                glucides=28.0,
                cout=0.80,
                vegan=True
            ),
            Aliment(
                nom="Saumon",
                calories=208.0,
                proteines=22.0,
                lipides=13.0,
                glucides=0.0,
                cout=5.00,
                vegan=False
            ),
            Aliment(
                nom="Lentilles",
                calories=116.0,
                proteines=9.0,
                lipides=0.4,
                glucides=20.0,
                cout=1.20,
                vegan=True
            ),
            Aliment(
                nom="Avocat",
                calories=160.0,
                proteines=2.0,
                lipides=14.7,
                glucides=8.5,
                cout=1.50,
                vegan=True
            ),
            Aliment(
                nom="Quinoa",
                calories=120.0,
                proteines=4.4,
                lipides=1.9,
                glucides=21.3,
                cout=2.00,
                vegan=True
            ),
            Aliment(
                nom="Oeuf",
                calories=155.0,
                proteines=13.0,
                lipides=11.0,
                glucides=1.1,
                cout=0.30,
                vegan=False
            ),
            Aliment(
                nom="Épinards",
                calories=23.0,
                proteines=2.9,
                lipides=0.4,
                glucides=3.6,
                cout=1.00,
                vegan=True
            ),
            Aliment(
                nom="Pois chiches",
                calories=164.0,
                proteines=8.9,
                lipides=2.6,
                glucides=27.0,
                cout=1.00,
                vegan=True
            )
        ]

        for aliment in aliments:
            db.add(aliment)
        db.commit()

        # ajouter Recettes
        recettes = [
    Recette(
        nom="Salade César au Poulet",
        total_calories=450.0,
        budget=8.00,
        description="Salade fraîche avec poulet grillé",
        vegan=False,
        image="salade_cesar.jpg"
    ),
    Recette(
        nom="Buddha Bowl Végétalien",
        total_calories=380.0,
        budget=7.50,
        description="Bowl nutritif aux légumes et quinoa",
        vegan=True,
        image="buddha_bowl.jpg"
    ),
    Recette(
        nom="Saumon aux épinards",
        total_calories=520.0,
        budget=12.00,
        description="Saumon grillé sur lit d'épinards",
        vegan=False,
        image="saumon.jpg"
    ),
    Recette(
        nom="Curry de Lentilles",
        total_calories=340.0,
        budget=5.00,
        description="Curry végétarien aux lentilles",
        vegan=True,
        image="curry_lentilles.jpg"
    ),
    Recette(
        nom="Toast à l'Avocat",
        total_calories=280.0,
        budget=4.00,
        description="Toast healthy à l'avocat",
        vegan=True,
        image="toast_avocat.jpg"
    ),
    Recette(
        nom="Bol de Quinoa aux Légumes",
        total_calories=310.0,
        budget=6.50,
        description="Bol de quinoa aux légumes de saison",
        vegan=True,
        image="quinoa_legumes.jpg"
    ),
    Recette(
        nom="Omelette aux Épinards",
        total_calories=290.0,
        budget=3.50,
        description="Omelette légère aux épinards frais",
        vegan=False,
        image="omelette_epinards.jpg"
    ),
    Recette(
        nom="Salade de Pois Chiches",
        total_calories=320.0,
        budget=4.00,
        description="Salade protéinée aux pois chiches",
        vegan=True,
        image="salade_pois_chiches.jpg"
    ),
    Recette(
        nom="Riz au Poulet",
        total_calories=480.0,
        budget=7.00,
        description="Riz parfumé avec poulet grillé",
        vegan=False,
        image="riz_poulet.jpg"
    ),
    Recette(
        nom="Bowl Protéiné",
        total_calories=420.0,
        budget=8.50,
        description="Bowl riche en protéines végétales",
        vegan=True,
        image="bowl_proteine.jpg"
    )
]


        for recette in recettes:
            db.add(recette)
        db.commit()

        # ajouter RecetteAliments
        recette_aliments = [
            # Salade César au Poulet
            RecetteAliment(id_recette=1, id_aliment=2),  # Poulet
            RecetteAliment(id_recette=1, id_aliment=1),  # Tomate

            # Buddha Bowl Végétalien
            RecetteAliment(id_recette=2, id_aliment=7),  # Quinoa
            RecetteAliment(id_recette=2, id_aliment=6),  # Avocat
            RecetteAliment(id_recette=2, id_aliment=9),  # Épinards

            # Saumon aux Épinards
            RecetteAliment(id_recette=3, id_aliment=4),  # Saumon
            RecetteAliment(id_recette=3, id_aliment=9),  # Épinards

            # Curry de Lentilles
            RecetteAliment(id_recette=4, id_aliment=5),  # Lentilles
            RecetteAliment(id_recette=4, id_aliment=3),  # Riz

            # Toast à l'Avocat
            RecetteAliment(id_recette=5, id_aliment=6),  # Avocat
            RecetteAliment(id_recette=5, id_aliment=1),  # Tomate

            # Bol de Quinoa aux Légumes
            RecetteAliment(id_recette=6, id_aliment=7),  # Quinoa
            RecetteAliment(id_recette=6, id_aliment=9),  # Épinards

            # Omelette aux Épinards
            RecetteAliment(id_recette=7, id_aliment=8),  # Oeuf
            RecetteAliment(id_recette=7, id_aliment=9),  # Épinards

            # Salade de Pois Chiches
            RecetteAliment(id_recette=8, id_aliment=10), # Pois chiches
            RecetteAliment(id_recette=8, id_aliment=1),  # Tomate

            # Riz au Poulet
            RecetteAliment(id_recette=9, id_aliment=3),  # Riz
            RecetteAliment(id_recette=9, id_aliment=2),  # Poulet

            # Bowl Protéiné
            RecetteAliment(id_recette=10, id_aliment=10), # Pois chiches
            RecetteAliment(id_recette=10, id_aliment=7),  # Quinoa
            RecetteAliment(id_recette=10, id_aliment=6)   # Avocat
        ]

        for recette_aliment in recette_aliments:
            db.add(recette_aliment)
        db.commit()

        print("Base de données remplie avec succès !")

    except Exception as e:
        print(f"Une erreur s'est produite: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    populate_database() 