from fastapi import APIRouter
from models.Reactivo import Reactivo
from services.ProcessReactivo import ProcessReactivo

router = APIRouter()

@router.post("/create")
def createReactivo(r: Reactivo):
    p = ProcessReactivo()
    return p.createReactivo(r.model_dump())

@router.get("/list")
def listReactivos():
    p = ProcessReactivo()
    return p.getReactivos()

@router.put("/update/{id_reactivo}")
def updateReactivo(id_reactivo: int, r: Reactivo):
    p = ProcessReactivo()
    return p.updateReactivo(id_reactivo, r)

@router.delete("/delete/{id_reactivo}")
def deleteReactivo(id_reactivo: int):
    p = ProcessReactivo()
    return p.deleteReactivo(id_reactivo)
