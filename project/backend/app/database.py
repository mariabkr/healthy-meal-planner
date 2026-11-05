from sqlalchemy.orm import DeclarativeBase, sessionmaker, Session
from sqlalchemy import create_engine

DATABASE_URL = "sqlite:///./data/db.sqlite"  

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False}, echo=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)  #

class Base(DeclarativeBase):
    pass

# obtenir une session de base de données
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# créer la base de données
def create_database():
    Base.metadata.create_all(engine)

# Fonction pour supprimer la base de données
def delete_database():
    Base.metadata.clear()
