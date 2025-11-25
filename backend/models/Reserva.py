from pydantic import BaseModel

class Reserva(BaseModel):
    descripcion: str
    fecha: str
    hora_inicio: str
    hora_fin: str
    id_estado: int
