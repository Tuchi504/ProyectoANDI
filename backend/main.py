from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import routes_user,routes_cristaleria,routes_data,routes_reactivo


app = FastAPI()

# Routers
app.include_router(routes_user.router, prefix="/api/User")
app.include_router(routes_cristaleria.router,prefix="/api/Cristaleria")
app.include_router(routes_reactivo.router, prefix="/api/Reactivos")
app.include_router(routes_data.router, prefix="/api/Data")



origins = [
    "http://localhost:5173",  
    "http://127.0.0.1:5173",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      
    allow_credentials=True,
    allow_methods=["*"],       
    allow_headers=["*"],       
)
