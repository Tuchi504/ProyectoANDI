from fastapi import APIRouter
from models.User import Usuario
from services.ProcessUser import ProcessUser

router = APIRouter()

@router.post("/create")
def create_user(user: Usuario):
    p = ProcessUser()
    return p.createUser(user.model_dump())

@router.get("/list")
def list_users():
    p = ProcessUser()
    return p.getUsers()

@router.put("/update/{id_usuario}")
def update_user(id_usuario: int, user: Usuario):
    p = ProcessUser()
    return p.updateUser(id_usuario, user)

@router.delete("/delete/{id_usuario}")
def delete_user(id_usuario: int):
    p = ProcessUser()
    return p.delete_user(id_usuario)
