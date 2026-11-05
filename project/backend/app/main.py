from fastapi import FastAPI, status
from fastapi.responses import RedirectResponse
from app.routes.user_routes import router as user_router
from app.routes.recipe_routes import router as recipe_router
from app.routes.consumption_routes import router as consumption_router
from fastapi.middleware.cors import CORSMiddleware

from app.database import create_database
import uvicorn

app = FastAPI(title="EatMeSlow")

# aide IA pour connecter frontend et backend 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # autorise toutes les origines 
    allow_credentials=True,
    allow_methods=["*"],  # autorise toutes les méthodes (GET/POST..)
    allow_headers=["*"],  # autorise tous les headers
)

app.include_router(user_router)
app.include_router(recipe_router)
app.include_router(consumption_router)



@app.on_event("startup")
def on_startup():
    create_database()

@app.get("/")
def root():
    return RedirectResponse(url="/docs", status_code=status.HTTP_303_SEE_OTHER)

if __name__ == '__main__':
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
