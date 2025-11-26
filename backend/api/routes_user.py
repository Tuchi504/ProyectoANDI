from fastapi import APIRouter, Depends, HTTPException, status
from models.User import Usuario
from models.UserUpdate import UserUpdate
from models.LoginRequest import LoginRequest
from models.LoginResponse import LoginResponse
from models.ChangePasswordRequest import ChangePasswordRequest
from services.ProcessUser import ProcessUser
from auth import get_current_user, authenticate_user, create_access_token, create_refresh_token, decode_token, get_password_hash, verify_password

router = APIRouter()


@router.post("/login", response_model=LoginResponse)
def login(login_data: LoginRequest):
    """
    Endpoint de login que valida credenciales y retorna un JWT token.
    """
    user = authenticate_user(login_data.correo, login_data.contrasena)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Crear token JWT con información del usuario
    token_data = {
        "user_id": user["ID_USUARIO"],
        "correo": user["CORREO"],
        "id_rol": user["ID_ROL"]
    }
    access_token = create_access_token(data=token_data)
    refresh_token = create_refresh_token(data=token_data)
    
    # Preparar información del usuario para retornar (sin la contraseña)
    user_info = {
        "id_usuario": user["ID_USUARIO"],
        "nombre_completo": user["NOMBRE_COMPLETO"],
        "correo": user["CORREO"],
        "id_rol": user["ID_ROL"],
        "activo": user["ACTIVO"]
    }
    
    return LoginResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        user=user_info
    )


@router.post("/refresh")
def refresh_token(refresh_token: str):
    """
    Genera un nuevo access token usando un refresh token válido.
    """
    try:
        payload = decode_token(refresh_token)
        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        # Crear nuevo access token
        token_data = {
            "user_id": payload["user_id"],
            "correo": payload["correo"],
            "id_rol": payload["id_rol"]
        }
        new_access_token = create_access_token(data=token_data)
        
        return {"access_token": new_access_token, "token_type": "bearer"}
        
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token inválido o expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )


@router.post("/create")
def create_user(user: Usuario, current_user: dict = Depends(get_current_user)):
    """
    Crea un nuevo usuario. Requiere autenticación JWT.
    """
    p = ProcessUser()
    # Hash de la contraseña antes de crear el usuario
    user_data = user.model_dump()
    user_data["contrasena"] = get_password_hash(user_data["contrasena"])
    return p.createUser(user_data)


@router.get("/list")
def list_users(current_user: dict = Depends(get_current_user)):
    """
    Lista todos los usuarios. Requiere autenticación JWT.
    """
    p = ProcessUser()
    return p.getUsers()


@router.put("/update/{id_usuario}")
def update_user(id_usuario: int, user: UserUpdate, current_user: dict = Depends(get_current_user)):
    """
    Actualiza un usuario (sin modificar contraseña). Requiere autenticación JWT.
    """
    p = ProcessUser()
    user_data = user.model_dump()
    return p.updateUser(id_usuario, user_data)


@router.delete("/delete/{id_usuario}")
def delete_user(id_usuario: int, current_user: dict = Depends(get_current_user)):
    """
    Elimina un usuario. Requiere autenticación JWT.
    """
    p = ProcessUser()
    return p.delete_user(id_usuario)


@router.post("/change-password")
def change_password(
    password_data: ChangePasswordRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Cambia la contraseña del usuario autenticado.
    Requiere autenticación JWT y verificación de la contraseña actual.
    """
    from sqlalchemy import text
    from bd.Connection import Connection
    
    # Get user's current password hash from database
    con = Connection().getConnection()
    query = """
        SELECT CONTRASENA
        FROM USUARIOS
        WHERE ID_USUARIO = :user_id
    """
    
    with con.connect() as conn:
        result = conn.execute(text(query), {"user_id": current_user["user_id"]})
        user = result.fetchone()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuario no encontrado"
        )
    
    # Verify current password
    if not verify_password(password_data.current_password, user[0]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Contraseña actual incorrecta"
        )
    
    # Validate new password length
    if len(password_data.new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La nueva contraseña debe tener al menos 8 caracteres"
        )
    
    # Hash new password and update
    new_password_hash = get_password_hash(password_data.new_password)
    
    update_query = """
        UPDATE USUARIOS
        SET CONTRASENA = :new_password
        WHERE ID_USUARIO = :user_id
    """
    
    with con.connect() as conn:
        conn.execute(
            text(update_query),
            {"new_password": new_password_hash, "user_id": current_user["user_id"]}
        )
        conn.commit()
    
    return {"message": "Contraseña actualizada exitosamente"}
