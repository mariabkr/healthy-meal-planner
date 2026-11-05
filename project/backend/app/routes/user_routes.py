from fastapi import APIRouter, Depends, HTTPException, status, Form, Request
from fastapi.responses import RedirectResponse, HTMLResponse,JSONResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Utilisateur
from app.schemas import UtilisateurCreate, UtilisateurLogin, UtilisateurResponse
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer

# Contexte de hachage du mot de passe
pwd_context = CryptContext(
    schemes=["django_pbkdf2_sha256"],
    default="django_pbkdf2_sha256",
    django_pbkdf2_sha256__default_rounds=30000
)

# Clé secrète et algorithme pour JWT
SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

router = APIRouter(prefix="/users", tags=["Users"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Fonction de hachage du mot de passe
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# Fonction pour vérifier le mot de passe
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


# Vérifier si un email est used
def mail_available(mail: str, db: Session) -> bool:
    user = db.query(Utilisateur).filter(Utilisateur.mail == mail).first()
    return user is None

# Fonction pour générer un token JWT
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Route d'inscription 
@router.get("/register", response_class=HTMLResponse)
def create_account_form(request: Request):
    return {"message": "Formulaire d'inscription"}

# route d'inscription 
@router.post("/register")
def create_account(
    request: Request,
    nom: str = Form(...),
    mail: str = Form(...),
    mot_de_passe: str = Form(...),
    confirmation_mot_de_passe: str = Form(...),
    db: Session = Depends(get_db)
):
    
        assert nom != "", "Le nom ne peuts être vide"
        assert mail != "", "L'email ne peut être vide"
        assert mot_de_passe != "", "Le mot de passe ne peut être vide"
        assert confirmation_mot_de_passe != "", "La confirmation ne peut être vide"
        assert len(mot_de_passe) >= 0

        if mot_de_passe != confirmation_mot_de_passe:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Les mots de passe ne correspondent pas")

        if not mail_available(mail, db):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="L'email est déjà utilisé")

        hashed_password = hash_password(mot_de_passe)
        new_user = Utilisateur(nom=nom, mail=mail, mot_de_passe=hashed_password)

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return JSONResponse(
        status_code=200,
        content={"message": "Utilisateur créé avec succès", "user_id": new_user.id_user}
    )


# Route de connexion
@router.get("/auth", response_class=HTMLResponse)
def login_page(request: Request):
    return HTMLResponse(content="<h1>Formulaire de connexion</h1>")



@router.post("/auth")
def login(
    request: Request,
    mail: str = Form(...),
    mot_de_passe: str = Form(...),
    db: Session = Depends(get_db)
    
):
    assert mail != "", "L'email ne peut pas être vide"
    assert mot_de_passe != "", "Le mot de passe ne peut pas être vide"


    user = db.query(Utilisateur).filter(Utilisateur.mail == mail).first()
    
    if not user or not verify_password(mot_de_passe, user.mot_de_passe):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Identifiant ou mot de passe incorrect")

    access_token = create_access_token(data={"sub": user.mail})

    return JSONResponse(content={"access_token": access_token, "token_type": "bearer"})


# Route de déconnexion
@router.get("/logout", response_class=HTMLResponse)
def ask_logout(request: Request):
    return {"message": "Voulez-vous vous déconnecter?"}

@router.post("/logout", response_class=HTMLResponse)
def logout(request: Request):
    response = RedirectResponse(url="/users/main", status_code=302)
    response.delete_cookie("access_token")
    return response

# mettre à jour le mot de passe
@router.post('/update_password', response_class=HTMLResponse)
def update_password(
    request: Request,
    current_password: str = Form(...),
    new_password: str = Form(...),
    confirm_password: str = Form(...),
    db: Session = Depends(get_db)
):
    
    assert current_password != "", "Le mot de passe actuel ne peut etre vide"
    assert new_password != "", "Le nouveau mot de passe ne peut etre vide "
    assert confirm_password != "", "La confirmation ne peut etre vide "

    user = db.query(Utilisateur).filter(Utilisateur.mail == request.cookies.get("access_token")).first()

    if not user:
        raise HTTPException(status_code=401, detail="Utilisateur non authentifié")

    if new_password != confirm_password:
        raise HTTPException(status_code=400, detail="Les nouveaux mots de passe ne correspondent pas")

    if not verify_password(current_password, user.mot_de_passe):
        raise HTTPException(status_code=400, detail="Mot de passe actuel incorrect")

    user.mot_de_passe = hash_password(new_password)
    db.commit()

    return RedirectResponse(url="/users/profile", status_code=302)



def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Impossible de valider les informations d'identification",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = db.query(Utilisateur).filter(Utilisateur.mail == email).first()
    if user is None:
        raise credentials_exception
    return user
