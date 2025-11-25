from fastapi import APIRouter
from models.Cristaleria import Cristaleria
from services.ProcessCristaleria import ProcessCristaleria

router = APIRouter()


@router.post("/create")
def createCristaleria(c: Cristaleria):
    p = ProcessCristaleria()
    return p.createCristaleria(c.model_dump())

@router.get("/list")
def listCristaleria():
    p = ProcessCristaleria()
    return p.getCristaleria()

@router.put("/update/{id_cristaleria}")
def updateCristaleria(id_cristaleria: int, c: Cristaleria):
    p = ProcessCristaleria()
    return p.updateCristaleria(id_cristaleria, c)

@router.delete("/delete/{id_cristaleria}")
def deleteCristaleria(id_cristaleria: int):
    p = ProcessCristaleria()
    return p.deleteCristaleria(id_cristaleria)
