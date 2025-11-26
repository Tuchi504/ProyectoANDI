from sqlalchemy import text
from bd.Connection import Connection
from utils.id_generator import generate_id
from datetime import datetime

class ProcessCristaleria:

    def __init__(self):
        self.con = Connection().getConnection()

 
    def createCristaleria(self, data):
        # Generar ID con formato C-YYYYMMDDhhmmss
        id_cristaleria = generate_id("C")

        # Generar ID con formato CR-YYYYMMDDhhmmss
        id_movimiento_cristaleria = generate_id("CR")
        
        query_create_cristaleria = """
            INSERT INTO CRISTALERIA
            (ID_CRISTALERIA, DESCRIPCION, CANT_BUEN_ESTADO, CANT_RAJADO_FUNCIONAL, CANT_DANADO, OBSERVACIONES)
            VALUES
            (:id_cristaleria, :descripcion, :cant_buen_estado, :cant_rajado_funcional, :cant_danado, :observaciones)
        """

        query_create_movimiento_cristaleria = """
            INSERT INTO MOVIMIENTOS_CRISTALERIA
            (ID_MOVIMIENTO, ID_CRISTALERIA, CANTIDAD, FECHA, ID_TIPO_MOVIMIENTO)
            VALUES
            (:id_movimiento_cristaleria, :id_cristaleria, :cantidad, :fecha, :id_tipo_movimiento)
        """

        with self.con.connect() as conn:
            conn.execute(
                text(query_create_cristaleria),
                {
                    "id_cristaleria": id_cristaleria,
                    "descripcion": data["descripcion"],
                    "cant_buen_estado": data["cant_buen_estado"],
                    "cant_rajado_funcional": data["cant_rajado_funcional"],
                    "cant_danado": data["cant_danado"],
                    "observaciones": data.get("observaciones", "")
                }
            )
            conn.execute(
                text(query_create_movimiento_cristaleria),
                {
                    "id_movimiento_cristaleria": id_movimiento_cristaleria,
                    "id_cristaleria": id_cristaleria,
                    "cantidad": data["cant_buen_estado"] + data["cant_rajado_funcional"] + data["cant_danado"],
                    "fecha": datetime.now(),
                    "id_tipo_movimiento": 1
                }
            )
            conn.commit()

        return {"message": "Cristalería creada correctamente", "id_cristaleria": id_cristaleria}

    def getCristaleria(self):
        query = "SELECT * FROM CRISTALERIA"
        cristaleria = []

        with self.con.connect() as conn:
            result = conn.execute(text(query))
            
            for row in result:
                item = dict(row._mapping)
                cristaleria.append({k.lower(): v for k, v in item.items()})

        return cristaleria

    def updateCristaleria(self, id_cristaleria, data):

        # Convertir modelo Pydantic a diccionario si es necesario
        if not isinstance(data, dict):
            data = data.dict()

        # Generar ID con formato CR-YYYYMMDDhhmmss
        id_movimiento_cristaleria = generate_id("CR")

        # Obtener la cantidad actual de la cristalería
        query_get_cantidad_actual = """
            SELECT CANT_BUEN_ESTADO + CANT_RAJADO_FUNCIONAL + CANT_DANADO AS CANTIDAD_ACTUAL
            FROM CRISTALERIA
            WHERE ID_CRISTALERIA = :id_cristaleria
        """

        cantidad_actual = 0
        cantidad_nueva = 0

        with self.con.connect() as conn:
            result = conn.execute(text(query_get_cantidad_actual), {"id_cristaleria": id_cristaleria})
            cantidad_actual = result.scalar()
            cantidad_nueva = data["cant_buen_estado"] + data["cant_rajado_funcional"] + data["cant_danado"]
        
        id_tipo_movimiento = 0

        # Si cantidad actual es mayor a la nueva, es un movimiento de salida
        if cantidad_actual > cantidad_nueva:
            id_tipo_movimiento = 2
        # Si cantidad actual es menor a la nueva, es un movimiento de entrada
        elif cantidad_actual < cantidad_nueva:
            id_tipo_movimiento = 1

        query_update_cristaleria = """
            UPDATE CRISTALERIA
            SET 
                DESCRIPCION = :descripcion,
                CANT_BUEN_ESTADO = :cant_buen_estado,
                CANT_RAJADO_FUNCIONAL = :cant_rajado_funcional,
                CANT_DANADO = :cant_danado,
                OBSERVACIONES = :observaciones
            WHERE ID_CRISTALERIA = :id_cristaleria
        """

        query_create_movimiento_cristaleria = """
            INSERT INTO MOVIMIENTOS_CRISTALERIA
            (ID_MOVIMIENTO, ID_CRISTALERIA, CANTIDAD, FECHA, ID_TIPO_MOVIMIENTO)
            VALUES
            (:id_movimiento_cristaleria, :id_cristaleria, :cantidad, :fecha, :id_tipo_movimiento)
        """

        # Si el movimiento es de entrada o salida, se actualiza la cristalería y se crea un movimiento, de lo contrario solo se actualiza la cristalería
        if id_tipo_movimiento != 0:
            with self.con.connect() as conn:
                conn.execute(
                    text(query_update_cristaleria),
                    {
                        "descripcion": data["descripcion"],
                        "cant_buen_estado": data["cant_buen_estado"],
                        "cant_rajado_funcional": data["cant_rajado_funcional"],
                        "cant_danado": data["cant_danado"],
                        "observaciones": data["observaciones"],
                        "id_cristaleria": id_cristaleria
                    }
                )
                conn.execute(
                    text(query_create_movimiento_cristaleria),
                    {
                        "id_movimiento_cristaleria": id_movimiento_cristaleria,
                        "id_cristaleria": id_cristaleria,
                        "cantidad": abs(cantidad_actual - cantidad_nueva),
                        "fecha": datetime.now(),
                        "id_tipo_movimiento": id_tipo_movimiento
                    }
                )
                conn.commit()
        else:
            with self.con.connect() as conn:
                conn.execute(
                    text(query_update_cristaleria),
                    {
                        "descripcion": data["descripcion"],
                        "cant_buen_estado": data["cant_buen_estado"],
                        "cant_rajado_funcional": data["cant_rajado_funcional"],
                        "cant_danado": data["cant_danado"],
                        "observaciones": data["observaciones"],
                        "id_cristaleria": id_cristaleria
                    }
                )
                conn.commit()

        return {"message": "Cristalería actualizada correctamente"}

    def deleteCristaleria(self, id_cristaleria):
        query = "DELETE FROM CRISTALERIA WHERE ID_CRISTALERIA = :id_cristaleria"

        with self.con.connect() as conn:
            conn.execute(text(query), {"id_cristaleria": id_cristaleria})
            conn.commit()

        return {"message": "Cristalería eliminada correctamente"}
