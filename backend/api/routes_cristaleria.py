from fastapi import APIRouter, Depends
from models.Cristaleria import Cristaleria
from services.ProcessCristaleria import ProcessCristaleria
from auth import get_current_user

router = APIRouter()


@router.post("/create")
def createCristaleria(c: Cristaleria, current_user: dict = Depends(get_current_user)):
    """
    Crea un nuevo item de cristalería. Requiere autenticación JWT.
    """
    p = ProcessCristaleria()
    return p.createCristaleria(c.model_dump())


@router.get("/list")
def listCristaleria(current_user: dict = Depends(get_current_user)):
    """
    Lista todos los items de cristalería. Requiere autenticación JWT.
    """
    p = ProcessCristaleria()
    return p.getCristaleria()


@router.put("/update/{id_cristaleria}")
def updateCristaleria(id_cristaleria: str, c: Cristaleria, current_user: dict = Depends(get_current_user)):
    """
    Actualiza un item de cristalería. Requiere autenticación JWT.
    """
    p = ProcessCristaleria()
    return p.updateCristaleria(id_cristaleria, c)


@router.delete("/delete/{id_cristaleria}")
def deleteCristaleria(id_cristaleria: str, current_user: dict = Depends(get_current_user)):
    """
    Elimina un item de cristalería. Requiere autenticación JWT.
    """
    p = ProcessCristaleria()
    return p.deleteCristaleria(id_cristaleria)

