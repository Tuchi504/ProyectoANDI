from fastapi import APIRouter, Depends
from models.Reserva import Reserva
from services.ProcessReserva import ProcessReserva
from auth import get_current_user

router = APIRouter()


@router.post("/create")
def createReserva(r: Reserva, current_user: dict = Depends(get_current_user)):
    """
    Crea una nueva reserva. Requiere autenticación JWT.
    """
    p = ProcessReserva()
    return p.createReserva(r.model_dump())


@router.get("/list")
def listReservas(current_user: dict = Depends(get_current_user)):
    """
    Lista todas las reservas. Requiere autenticación JWT.
    """
    p = ProcessReserva()
    return p.getReservas()


@router.put("/update/{id_reserva}")
def updateReserva(id_reserva: int, r: Reserva, current_user: dict = Depends(get_current_user)):
    """
    Actualiza una reserva. Requiere autenticación JWT.
    """
    p = ProcessReserva()
    return p.updateReserva(id_reserva, r)


@router.delete("/delete/{id_reserva}")
def deleteReserva(id_reserva: int, current_user: dict = Depends(get_current_user)):
    """
    Elimina una reserva. Requiere autenticación JWT.
    """
    p = ProcessReserva()
    return p.deleteReserva(id_reserva)

