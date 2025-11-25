from fastapi import APIRouter, Depends
from models.Reactivo import Reactivo
from services.ProcessReactivo import ProcessReactivo
from auth import get_current_user

router = APIRouter()


@router.post("/create")
def createReactivo(r: Reactivo, current_user: dict = Depends(get_current_user)):
    """
    Crea un nuevo reactivo. Requiere autenticación JWT.
    """
    p = ProcessReactivo()
    return p.createReactivo(r.model_dump())


@router.get("/list")
def listReactivos(current_user: dict = Depends(get_current_user)):
    """
    Lista todos los reactivos. Requiere autenticación JWT.
    """
    p = ProcessReactivo()
    return p.getReactivos()


@router.put("/update/{id_reactivo}")
def updateReactivo(id_reactivo: int, r: Reactivo, current_user: dict = Depends(get_current_user)):
    """
    Actualiza un reactivo. Requiere autenticación JWT.
    """
    p = ProcessReactivo()
    return p.updateReactivo(id_reactivo, r)


@router.delete("/delete/{id_reactivo}")
def deleteReactivo(id_reactivo: int, current_user: dict = Depends(get_current_user)):
    """
    Elimina un reactivo. Requiere autenticación JWT.
    """
    p = ProcessReactivo()
    return p.deleteReactivo(id_reactivo)

