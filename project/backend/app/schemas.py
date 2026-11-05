from pydantic import BaseModel, EmailStr
from typing import Optional

# Valider les données entrantes (Pydantic)
 
# création utilisateur
class UtilisateurCreate(BaseModel):
    nom: str
    mail: EmailStr
    mot_de_passe: str



#pour valider les données 
class UtilisateurResponse(BaseModel):
    id_user: int
    nom: str
    mail: EmailStr

   
# Schéma pour la connexion (login)
class UtilisateurLogin(BaseModel):
    mail: EmailStr
    mot_de_passe: str
