from fastapi import APIRouter, Depends
from services.Process import Process
from auth import get_current_user

router = APIRouter()


@router.get("/Roles")
def getListRoles(current_user: dict = Depends(get_current_user)):
    """
    Retorna todos los roles almacenados en la BD.
    Requiere autenticación JWT.
    """
    p = Process()
    return p.getRoles()


@router.get("/EstadoReserva")
def getListEstadoReserva(current_user: dict = Depends(get_current_user)):
    """
    Retorna todos los estados de reserva almacenados en la BD.
    Requiere autenticación JWT.
    """
    p = Process()
    return p.getEstadoReserva()


@router.get("/MarcaReactivo")
def getMarcaReactivo(current_user: dict = Depends(get_current_user)):
    """
    Retorna todas las marcas de reactivo almacenadas en la BD.
    Requiere autenticación JWT.
    """
    p = Process()
    return p.getMarcaReactivo()


@router.get("/ClasificacionReactivo")
def getClasificacionReactivo(current_user: dict = Depends(get_current_user)):
    """
    Retorna todas las clasificaciones de reactivo almacenadas en la BD.
    Requiere autenticación JWT.
    """
    p = Process()
    return p.getClasificacionReactivo()





