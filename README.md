# INFOB318-template
# EatMeSlow 🍽️

Acronyme: eatmeslow_01
Titre: eat me slow  
Frontend : ReactJS, CSS
Backend : FastAPI, SQLAlchemy, SQLite




##  Objectif du projet

EatMeSlow est une application web interactive qui offre aux utilisateurs la possibilité de :
- explorer une variété de recettes saines et équilibrées
- filtrer les options en fonction de leurs préférences personnelles (ingrédients, calories, budget, végan)
- suivre leurs consommation journalières
- visualiser leur historique nutritionnel à l'aide de graphiques.


### Execution du projet :
Executer le backend:
cd project/backend
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000


Executer le frontend :
cd project
npm start

#Après avoir déplacé le projet :
```bash
rm -rf node_modules package-lock.json
npm install
npm start


remplire la BD:
cd project/backend
python -m app.scripts.populate_db
