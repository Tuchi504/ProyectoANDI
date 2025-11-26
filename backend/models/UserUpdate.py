from pydantic import BaseModel

class UserUpdate(BaseModel):
    nombre_completo: str
    correo: str
    id_rol: int
    activo: bool
