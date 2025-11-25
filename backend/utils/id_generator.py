from datetime import datetime


def generate_id(prefix: str) -> str:
    """
    Genera un ID único con formato: PREFIX-YYYYMMDDhhmmss
    
    Args:
        prefix: Prefijo del ID (ej: 'RQ', 'C', 'R', 'H', 'MR', 'CR')
    
    Returns:
        ID generado con formato PREFIX-YYYYMMDDhhmmss
    
    Ejemplos:
        - Reactivo: RQ-20250125143022
        - Cristalería: C-20250125143022
        - Reserva: R-20250125143022
        - Historial: H-20250125143022
        - Movimiento Reactivo: MR-20250125143022
        - Movimiento Cristalería: CR-20250125143022
    """
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    return f"{prefix}-{timestamp}"
