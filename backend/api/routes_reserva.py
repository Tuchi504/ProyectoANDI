from fastapi import APIRouter
from models.Reserva import Reserva
from services.ProcessReserva import ProcessReserva

router = APIRouter()

@router.post("/create")
def createReserva(r: Reserva):
    p = ProcessReserva()
    return p.createReserva(r.model_dump())

@router.get("/list")
def listReservas():
    p = ProcessReserva()
    return p.getReservas()

@router.put("/update/{id_reserva}")
def updateReserva(id_reserva: int, r: Reserva):
    p = ProcessReserva()
    return p.updateReserva(id_reserva, r)

@router.delete("/delete/{id_reserva}")
def deleteReserva(id_reserva: int):
    p = ProcessReserva()
    return p.deleteReserva(id_reserva)
