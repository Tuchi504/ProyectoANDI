from pydantic import BaseModel

class Usuario(BaseModel):
    nombre_completo: str
    correo: str
    contrasena: str 
    id_rol: int
    activo: bool
