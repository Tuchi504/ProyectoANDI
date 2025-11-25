from sqlalchemy import text
from bd.Connection import Connection

class ProcessCristaleria:

    def __init__(self):
        self.con = Connection().getConnection()

 
    def createCristaleria(self, data):
        query = """
            INSERT INTO CRISTALERIA
            (ID_CRISTALERIA, DESCRIPCION, CANT_BUEN_ESTADO, CANT_RAJADO_FUNCIONAL, CANT_DANADO, OBSERVACIONES)
            VALUES
            (:id_cristaleria, :descripcion, :cant_buen_estado, :cant_rajado_funcional, :cant_danado, :observaciones)
        """

        with self.con.connect() as conn:
            conn.execute(
                text(query),
                {
                    "id_cristaleria": data["id_cristaleria"],
                    "descripcion": data["descripcion"],
                    "cant_buen_estado": data["cant_buen_estado"],
                    "cant_rajado_funcional": data["cant_rajado_funcional"],
                    "cant_danado": data["cant_danado"],
                    "observaciones": data["observaciones"]
                }
            )
            conn.commit()

        return {"message": "Cristalería creada correctamente"}

    def getCristaleria(self):
        query = "SELECT * FROM CRISTALERIA"
        cristaleria = []

        with self.con.connect() as conn:
            result = conn.execute(text(query))
            
            for row in result:
                cristaleria.append(dict(row._mapping))

        return cristaleria

    def updateCristaleria(self, id_cristaleria, data):
        query = """
            UPDATE CRISTALERIA
            SET 
                DESCRIPCION = :descripcion,
                CANT_BUEN_ESTADO = :cant_buen_estado,
                CANT_RAJADO_FUNCIONAL = :cant_rajado_funcional,
                CANT_DANADO = :cant_danado,
                OBSERVACIONES = :observaciones
            WHERE ID_CRISTALERIA = :id_cristaleria
        """

        with self.con.connect() as conn:
            conn.execute(
                text(query),
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
