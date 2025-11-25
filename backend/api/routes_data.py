# routes_roles.py
from fastapi import APIRouter
from services.Process import Process

router = APIRouter()

@router.get("/Roles")
def getListRoles():
    """
    Retorna todos los roles almacenados en la BD.
    """
    p = Process()
    return p.getRoles()

@router.get("/EstadoReserva")
def getListEstadoReserva():
    """
    Retorna todos los roles almacenados en la BD.
    """
    p = Process()
    return p.getEstadoReserva()

@router.get("/MarcaReactivo")
def getMarcaReactivo():
    """
    Retorna todos los roles almacenados en la BD.
    """
    p = Process()
    return p.getMarcaReactivo()


@router.get("/MarcaReactivo")
def getClasificacionReactivo():
    """
    Retorna todos los roles almacenados en la BD.
    """
    p = Process()
    return p.getMarcaReactivo()




