from sqlalchemy import text
from bd.Connection import Connection
from utils.id_generator import generate_id

class ProcessReactivo:

    def __init__(self):
        self.con = Connection().getConnection()

    def createReactivo(self, data):
        # Generate ID with format RQ-YYYYMMDDhhmmss
        id_reactivo = generate_id("RQ")
        
        query = """
            INSERT INTO REACTIVOS
            (ID_REACTIVO, NOMBRE, ID_MARCA, PESO_NETO, PESO_FRASCO, ID_CLASIFICACION, UBICACION, OBSERVACIONES)
            VALUES
            (:id_reactivo, :nombre, :id_marca, :peso_neto, :peso_frasco, :id_clasificacion, :ubicacion, :observaciones)
        """

        with self.con.connect() as conn:
            conn.execute(
                text(query),
                {
                    "id_reactivo": id_reactivo,
                    "nombre": data["nombre"],
                    "id_marca": data["id_marca"],
                    "peso_neto": data["peso_neto"],
                    "peso_frasco": data["peso_frasco"],
                    "id_clasificacion": data["id_clasificacion"],
                    "ubicacion": data.get("ubicacion", ""),
                    "observaciones": data.get("observaciones", "")
                }
            )
            conn.commit()

        return {"message": "Reactivo creado correctamente", "id_reactivo": id_reactivo}

    def getReactivos(self):
        query = "SELECT * FROM REACTIVOS"
        reactivos = []

        with self.con.connect() as conn:
            result = conn.execute(text(query))
            
            for row in result:
                reactivos.append(dict(row._mapping))

        return reactivos

    def updateReactivo(self, id_reactivo, data):
        query = """
            UPDATE REACTIVOS
            SET NOMBRE = :nombre,
                ID_MARCA = :id_marca,
                PESO_NETO = :peso_neto,
                PESO_FRASCO = :peso_frasco,
                ID_CLASIFICACION = :id_clasificacion,
                UBICACION = :ubicacion,
                OBSERVACIONES = :observaciones
            WHERE ID_REACTIVO = :id_reactivo
        """

        with self.con.connect() as conn:
            conn.execute(
                text(query),
                {
                    "nombre": data["nombre"],
                    "id_marca": data["id_marca"],
                    "peso_neto": data["peso_neto"],
                    "peso_frasco": data["peso_frasco"],
                    "id_clasificacion": data["id_clasificacion"],
                    "ubicacion": data["ubicacion"],
                    "observaciones": data["observaciones"],
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
