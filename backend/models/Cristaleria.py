# models/Cristaleria.py
from pydantic import BaseModel

class Cristaleria(BaseModel):
    descripcion: str
    cantidad: int
    cant_buen_estado: int
    cant_rajado_funcional: int
    cant_danado: int
    observaciones: str 
