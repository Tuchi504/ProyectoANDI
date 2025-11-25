from sqlalchemy import text
from bd.Conection import Conection

class ProcessReserva:

    def __init__(self):
        self.con = Conection.getConnection()

    def createReserva(self, data):
        query = """
            INSERT INTO RESERVAS (ID_RESERVA, DESCRIPCION, FECHA, HORA_INICIO, HORA_FIN, ID_ESTADO)
            VALUES (:id_reserva, :descripcion, :fecha, :hora_inicio, :hora_fin, :id_estado)
        """

        with self.con.connect() as conn:
            conn.execute(
                text(query),
                {
                    "id_reserva": data["id_reserva"],
                    "descripcion": data["descripcion"],
                    "fecha": data["fecha"],
                    "hora_inicio": data["hora_inicio"],
                    "hora_fin": data["hora_fin"],
                    "id_estado": data["id_estado"]
                }
            )
            conn.commit()

        return {"message": "Reserva creada correctamente"}

  
    def getReservas(self):
        query = "SELECT * FROM RESERVAS"
        reservas = []

        with self.con.connect() as conn:
            result = conn.execute(text(query))
            row = result.fetchone()

            while row:
                item = {}
                for col in row.keys():
                    item[col] = getattr(row, col)
                reservas.append(item)
                row = result.fetchone()

        return reservas


    def updateReserva(self, id_reserva, data):
        query = """
            UPDATE RESERVAS
            SET DESCRIPCION = :descripcion,
                FECHA = :fecha,
                HORA_INICIO = :hora_inicio,
                HORA_FIN = :hora_fin,
                ID_ESTADO = :id_estado
            WHERE ID_RESERVA = :id_reserva
        """

        with self.con.connect() as conn:
            conn.execute(
                text(query),
                {
                    "descripcion": data["descripcion"],
                    "fecha": data["fecha"],
                    "hora_inicio": data["hora_inicio"],
                    "hora_fin": data["hora_fin"],
                    "id_estado": data["id_estado"],
                    "id_reserva": id_reserva
                }
            )
            conn.commit()

        return {"message": "Reserva actualizada correctamente"}

    def deleteReserva(self, id_reserva):
        query = "DELETE FROM RESERVAS WHERE ID_RESERVA = :id_reserva"

        with self.con.connect() as conn:
            conn.execute(text(query), {"id_reserva": id_reserva})
            conn.commit()

        return {"message": "Reserva eliminada correctamente"}
