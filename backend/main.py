from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import routes_user, routes_cristaleria, routes_data, routes_reactivo, routes_reserva, routes_dashboard
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()

# Routers
app.include_router(routes_user.router, prefix="/api/User")
app.include_router(routes_cristaleria.router, prefix="/api/Cristaleria")
app.include_router(routes_reactivo.router, prefix="/api/Reactivos")
app.include_router(routes_reserva.router, prefix="/api/Reserva")
app.include_router(routes_data.router, prefix="/api/Dashboard")
app.include_router(routes_dashboard.router, prefix="/api/Dashboard")

# CORS Configuration
cors_origins_str = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
origins = [origin.strip() for origin in cors_origins_str.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      
    allow_credentials=True,
    allow_methods=["*"],       
    allow_headers=["*"],       
)
