from fastapi import APIRouter, Depends
from sqlalchemy import text
from bd.Connection import Connection
from auth import get_current_user

router = APIRouter()

@router.get("/next-reservation")
def get_next_reservation(current_user: dict = Depends(get_current_user)):
    """
    Obtiene la próxima reserva programada. Requiere autenticación JWT.
    """
    con = Connection().getConnection()
    query = """
        SELECT TOP 1 R.*, E.NOMBRE AS NOMBRE_ESTADO
        FROM RESERVAS R
        JOIN ESTADOS_RESERVA E ON R.ID_ESTADO = E.ID_ESTADO
        WHERE R.ID_ESTADO = 1
        AND CAST(R.FECHA AS DATETIME) + CAST(R.HORA_INICIO AS DATETIME) >= GETDATE()
        ORDER BY R.FECHA ASC, R.HORA_INICIO ASC
    """
    
    with con.connect() as conn:
        result = conn.execute(text(query))
        row = result.fetchone()
        
        if row:
            item = dict(row._mapping)
            return {k.lower(): v for k, v in item.items()}
        return None


@router.get("/recent-movements/reagents")
def get_recent_reagent_movements(current_user: dict = Depends(get_current_user)):
    """
    Obtiene los movimientos recientes de reactivos. Requiere autenticación JWT.
    """
    con = Connection().getConnection()
    query = """
        SELECT TOP 10 
            M.ID_MOVIMIENTO,
            M.ID_REACTIVO,
            R.NOMBRE AS NOMBRE_REACTIVO,
            M.CANTIDAD,
            M.FECHA,
            T.NOMBRE AS TIPO_MOVIMIENTO,
            T.FACTOR
        FROM MOVIMIENTOS_REACTIVOS M
        JOIN REACTIVOS R ON M.ID_REACTIVO = R.ID_REACTIVO
        JOIN TIPOS_MOVIMIENTOS T ON M.ID_TIPO_MOVIMIENTO = T.ID_TIPO_MOVIMIENTO
        ORDER BY M.FECHA DESC
    """
    
    movements = []
    with con.connect() as conn:
        result = conn.execute(text(query))
        for row in result:
            item = dict(row._mapping)
            movements.append({k.lower(): v for k, v in item.items()})
    
    return movements


@router.get("/recent-movements/glassware")
def get_recent_glassware_movements(current_user: dict = Depends(get_current_user)):
    """
    Obtiene los movimientos recientes de cristalería. Requiere autenticación JWT.
    """
    con = Connection().getConnection()
    query = """
        SELECT TOP 10 
            M.ID_MOVIMIENTO,
            M.ID_CRISTALERIA,
            C.DESCRIPCION AS NOMBRE_CRISTALERIA,
            M.CANTIDAD,
            M.FECHA,
            T.NOMBRE AS TIPO_MOVIMIENTO,
            T.FACTOR
        FROM MOVIMIENTOS_CRISTALERIA M
        JOIN CRISTALERIA C ON M.ID_CRISTALERIA = C.ID_CRISTALERIA
        JOIN TIPOS_MOVIMIENTOS T ON M.ID_TIPO_MOVIMIENTO = T.ID_TIPO_MOVIMIENTO
        ORDER BY M.FECHA DESC
    """
    
    movements = []
    with con.connect() as conn:
        result = conn.execute(text(query))
        for row in result:
            item = dict(row._mapping)
            movements.append({k.lower(): v for k, v in item.items()})
    
    return movements
