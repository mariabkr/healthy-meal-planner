from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DECIMAL, Date
from sqlalchemy.orm import relationship
from app.database import Base

# ce fichier sert a définir la structure de la bd

class Utilisateur(Base):
    __tablename__ = "Utilisateur"
    id_user = Column(Integer, primary_key=True, index=True)
    nom = Column(String(50))
    mail = Column(String(100), unique=True)
    mot_de_passe = Column(String(200))

    preferences = relationship("PreferenceAlimentaire", back_populates="user")
    consommations = relationship("Consommation", back_populates="user")


class PreferenceAlimentaire(Base):
    __tablename__ = "Preference_Alimentaire"
    id_preference = Column(Integer, primary_key=True, index=True)
    id_user = Column(Integer, ForeignKey("Utilisateur.id_user"))
    type_preference = Column(String(50))
    valeur = Column(Boolean)

    user = relationship("Utilisateur", back_populates="preferences")


class Aliment(Base):
    __tablename__ = "Aliment"
    id_aliment = Column(Integer, primary_key=True, index=True)
    nom = Column(String(100))
    calories = Column(DECIMAL(5, 2))
    proteines = Column(DECIMAL(5, 2))
    lipides = Column(DECIMAL(5, 2))
    glucides = Column(DECIMAL(5, 2))
    cout = Column(DECIMAL(6, 2))
    vegan = Column(Boolean)


class Recette(Base):
    __tablename__ = "Recette"
    id_recette = Column(Integer, primary_key=True, index=True)
    nom = Column(String(100), nullable=False)
    total_calories = Column(DECIMAL(10, 2))
    budget = Column(DECIMAL(5, 2))
    description = Column(String(200), nullable=True)
    vegan = Column(Boolean)
    image = Column(String, nullable=True) 


    aliments = relationship("Aliment", secondary="Recette_Aliment", backref="recettes")


class Consommation(Base):
    __tablename__ = "Consommation"
    id = Column(Integer, primary_key=True, index=True)
    id_user = Column(Integer, ForeignKey("Utilisateur.id_user"))
    recette_id = Column(Integer, ForeignKey("Recette.id_recette"))
    aliment_id = Column(Integer, ForeignKey("Aliment.id_aliment"))
    date_consommation = Column(Date)
    quantite = Column(DECIMAL(6, 2))

    user = relationship("Utilisateur", back_populates="consommations")


class RecetteAliment(Base):
    __tablename__ = "Recette_Aliment"
    id_recette = Column(Integer, ForeignKey("Recette.id_recette"), primary_key=True)
    id_aliment = Column(Integer, ForeignKey("Aliment.id_aliment"), primary_key=True)


class Recette_Consommation(Base):
    __tablename__ = "Recette_Consommation"
    id = Column(Integer, primary_key=True, index=True)
    id_user = Column(Integer, ForeignKey("Utilisateur.id_user"))
    id_recette = Column(Integer, ForeignKey("Recette.id_recette"))
    date_consommation = Column(Date)

    user = relationship("Utilisateur", backref="recette_consommations")
    recette = relationship("Recette")
