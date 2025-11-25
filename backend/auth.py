from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy import text
from bd.Connection import Connection

# JWT Configuration
SECRET_KEY = "tu_clave_secreta_super_segura_cambiala_en_produccion_12345"  # Cambiar en producción
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 30

# HTTP Bearer security scheme
security = HTTPBearer()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifica si la contraseña en texto plano coincide con el hash.
    """
    # Convert strings to bytes for bcrypt
    if isinstance(plain_password, str):
        plain_password = plain_password.encode('utf-8')
    if isinstance(hashed_password, str):
        hashed_password = hashed_password.encode('utf-8')
    
    return bcrypt.checkpw(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """
    Genera un hash de la contraseña usando bcrypt.
    """
    # Convert to bytes and hash
    if isinstance(password, str):
        password = password.encode('utf-8')
    
    # Generate salt and hash
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password, salt)
    
    # Return as string for database storage
    return hashed.decode('utf-8')


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Crea un token JWT con los datos proporcionados.
    
    Args:
        data: Diccionario con los datos a incluir en el token
        expires_delta: Tiempo de expiración del token
    
    Returns:
        Token JWT codificado
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    
    return encoded_jwt


def decode_token(token: str) -> dict:
    """
    Decodifica y valida un token JWT.
    
    Args:
        token: Token JWT a decodificar
    
    Returns:
        Payload del token decodificado
    
    Raises:
        HTTPException: Si el token es inválido o ha expirado
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """
    Dependency para obtener el usuario actual desde el token JWT.
    
    Args:
        credentials: Credenciales HTTP Bearer extraídas del header Authorization
    
    Returns:
        Diccionario con la información del usuario del token
    
    Raises:
        HTTPException: Si el token es inválido o no contiene la información requerida
    """
    token = credentials.credentials
    payload = decode_token(token)
    
    user_id = payload.get("user_id")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido: falta información del usuario",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return payload


def authenticate_user(correo: str, contrasena: str) -> Optional[dict]:
    """
    Autentica un usuario verificando su correo y contraseña.
    
    Args:
        correo: Email del usuario
        contrasena: Contraseña en texto plano
    
    Returns:
        Diccionario con la información del usuario si la autenticación es exitosa,
        None si falla
    """
    con = Connection().getConnection()
    
    query = """
        SELECT ID_USUARIO, NOMBRE_COMPLETO, CORREO, CONTRASENA, ID_ROL, ACTIVO
        FROM USUARIOS
        WHERE CORREO = :correo
    """
    
    with con.connect() as conn:
        result = conn.execute(text(query), {"correo": correo})
        user = result.fetchone()
    
    if not user:
        return None
    
    user_dict = dict(user._mapping)
    
    # Verificar contraseña
    if not verify_password(contrasena, user_dict["CONTRASENA"]):
        return None
    
    # Verificar que el usuario esté activo
    if not user_dict["ACTIVO"]:
        return None
    
    return user_dict