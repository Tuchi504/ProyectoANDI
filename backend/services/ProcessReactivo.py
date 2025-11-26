from sqlalchemy import text
from bd.Connection import Connection
from utils.id_generator import generate_id
from datetime import datetime

class ProcessReactivo:

    def __init__(self):
        self.con = Connection().getConnection()

    def createReactivo(self, data):
        # Generar ID con formato RQ-YYYYMMDDhhmmss
        id_reactivo = generate_id("RQ")

        # Generar ID de movimiento de reactivo con formato MR-YYYYMMDDhhmmss
        id_movimiento = generate_id("MR")
        
        query_create_reactivo = """
            INSERT INTO REACTIVOS
            (ID_REACTIVO, NOMBRE, ID_MARCA, PESO_NETO, PESO_FRASCO, ID_CLASIFICACION, UBICACION, OBSERVACIONES, COLOR)
            VALUES
            (:id_reactivo, :nombre, :id_marca, :peso_neto, :peso_frasco, :id_clasificacion, :ubicacion, :observaciones, :color)
        """

        query_create_movimiento_reactivo = """
            INSERT INTO MOVIMIENTOS_REACTIVOS
            (ID_MOVIMIENTO, ID_REACTIVO, CANTIDAD, FECHA, ID_TIPO_MOVIMIENTO)
            VALUES
            (:id_movimiento, :id_reactivo, :cantidad, :fecha, :id_tipo_movimiento)
        """

        with self.con.connect() as conn:
            conn.execute(
                text(query_create_reactivo),
                {
                    "id_reactivo": id_reactivo,
                    "nombre": data["nombre"],
                    "id_marca": data["id_marca"],
                    "peso_neto": data["peso_neto"],
                    "peso_frasco": data["peso_frasco"],
                    "id_clasificacion": data["id_clasificacion"],
                    "ubicacion": data.get("ubicacion", ""),
                    "observaciones": data.get("observaciones", ""),
                    "color": data.get("color", "#FFFFFF")
                }
            )
            conn.execute(
                text(query_create_movimiento_reactivo),
                {
                    "id_movimiento": id_movimiento,
                    "id_reactivo": id_reactivo,
                    "cantidad": data["peso_neto"] - data["peso_frasco"],
                    "fecha": datetime.now(),
                    "id_tipo_movimiento": 1
                }
            )
            conn.commit()

        return {"message": "Reactivo creado correctamente", "id_reactivo": id_reactivo}

    def getReactivos(self):
        query = """
            SELECT 
                R.*, 
                M.NOMBRE AS NOMBRE_MARCA, 
                C.NOMBRE AS NOMBRE_CLASIFICACION 
            FROM REACTIVOS R
            INNER JOIN MARCAS M ON R.ID_MARCA = M.ID_MARCA
            INNER JOIN CLASIFICACION_REACTIVOS C ON R.ID_CLASIFICACION = C.ID_CLASIFICACION
        """
        reactivos = []

        with self.con.connect() as conn:
            result = conn.execute(text(query))
            
            for row in result:
                item = dict(row._mapping)
                reactivos.append({k.lower(): v for k, v in item.items()})

        return reactivos

    def updateReactivo(self, id_reactivo, data):
        # Convertir modelo Pydantic a diccionario si es necesario
        if not isinstance(data, dict):
            data = data.dict()

        # Generar ID de movimiento de reactivo con formato MR-YYYYMMDDhhmmss
        id_movimiento = generate_id("MR")

        # Obtener el peso neto y el peso frasco del reactivo
        query_get_reactivo = """
            SELECT PESO_NETO, PESO_FRASCO FROM REACTIVOS WHERE ID_REACTIVO = :id_reactivo
        """
        
        with self.con.connect() as conn:
            result = conn.execute(text(query_get_reactivo), {"id_reactivo": id_reactivo})
            reactivo = result.fetchone()
            peso_neto = reactivo[0]
            peso_frasco = reactivo[1]

        query_update_reactivo = """
            UPDATE REACTIVOS
            SET NOMBRE = :nombre,
                ID_MARCA = :id_marca,
                PESO_NETO = :peso_neto,
                PESO_FRASCO = :peso_frasco,
                ID_CLASIFICACION = :id_clasificacion,
                UBICACION = :ubicacion,
                OBSERVACIONES = :observaciones,
                COLOR = :color
            WHERE ID_REACTIVO = :id_reactivo
        """
        
        query_create_movimiento_reactivo = """
            INSERT INTO MOVIMIENTOS_REACTIVOS
            (ID_MOVIMIENTO, ID_REACTIVO, CANTIDAD, FECHA, ID_TIPO_MOVIMIENTO)
            VALUES
            (:id_movimiento, :id_reactivo, :cantidad, :fecha, :id_tipo_movimiento)
        """

        # Si no ocurre que el peso neto actual y el nuevo son iguales, y que el peso del frasco actual y el nuevo son iguales, se realiza movimiento de inventario también, sino solo se actualizan los datos del reactivo
        if not(peso_neto == data["peso_neto"] and peso_frasco == data["peso_frasco"]):
            
            # Cantidad actual del reactivo
            cantidad_actual = peso_neto - peso_frasco

            # Cantidad nueva del reactivo
            cantidad_nueva = data["peso_neto"] - data["peso_frasco"]

            # Diferencia entre la cantidad actual y la cantidad nueva
            diferencia = cantidad_nueva - cantidad_actual

            # Si la diferencia es positiva, se realiza un movimiento de entrada
            if diferencia > 0:
                id_tipo_movimiento = 1
            # Si la diferencia es negativa, se realiza un movimiento de salida
            elif diferencia < 0:
                id_tipo_movimiento = 2

            with self.con.connect() as conn:
                conn.execute(
                    text(query_update_reactivo),
                    {
                    "nombre": data["nombre"],
                    "id_marca": data["id_marca"],
                    "peso_neto": data["peso_neto"],
                    "peso_frasco": data["peso_frasco"],
                    "id_clasificacion": data["id_clasificacion"],
                    "ubicacion": data["ubicacion"],
                    "observaciones": data["observaciones"],
                    "color": data.get("color", "#FFFFFF"),
                    "id_reactivo": id_reactivo
                    }
                )
                conn.execute(
                    text(query_create_movimiento_reactivo),
                    {
                    "id_movimiento": id_movimiento,
                    "id_reactivo": id_reactivo,
                    "cantidad": abs(diferencia),
                    "fecha": datetime.now(),
                    "id_tipo_movimiento": id_tipo_movimiento
                    }
                )
                conn.commit()
        else:
            with self.con.connect() as conn:
                conn.execute(
                    text(query_update_reactivo),
                    {
                    "nombre": data["nombre"],
                    "id_marca": data["id_marca"],
                    "peso_neto": data["peso_neto"],
                    "peso_frasco": data["peso_frasco"],
                    "id_clasificacion": data["id_clasificacion"],
                    "ubicacion": data["ubicacion"],
                    "observaciones": data["observaciones"],
                    "color": data.get("color", "#FFFFFF"),
                    "id_reactivo": id_reactivo
                    }
                )
                conn.commit()

        return {"message": "Reactivo actualizado correctamente"}


    def deleteReactivo(self, id_reactivo):
        query = "DELETE FROM REACTIVOS WHERE ID_REACTIVO = :id_reactivo"

        with self.con.connect() as conn:
            conn.execute(text(query), {"id_reactivo": id_reactivo})
            conn.commit()

        return {"message": "Reactivo eliminado correctamente"}
