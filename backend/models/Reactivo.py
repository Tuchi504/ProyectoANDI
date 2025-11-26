from pydantic import BaseModel

class Reactivo(BaseModel):
    nombre: str
    id_marca: int
    peso_neto: float
    peso_frasco: float
    id_clasificacion: int
    ubicacion: str
    observaciones: str
    color: str
