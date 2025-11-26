from sqlalchemy import text
from bd.Connection import Connection
from utils.id_generator import generate_id
from datetime import datetime

class ProcessReserva:

    def __init__(self):
        self.con = Connection().getConnection()

    def createReserva(self, data):
        # Generar ID con formato R-YYYYMMDDhhmmss
        id_reserva = generate_id("R")

        # Generar ID con formato H-YYYYMMDDhhmmss
        id_historial = generate_id("H")

        # Calcular el id_estado de la reserva de acuerdo a la fecha actua y hora actual
        id_estado = 0

        if datetime.now().strftime("%Y-%m-%d") < data["fecha"]:
            id_estado = 1
        elif datetime.now().strftime("%Y-%m-%d") == data["fecha"]:
            if datetime.now().strftime("%H:%M:%S") < data["hora_inicio"]:
                id_estado = 1
            elif datetime.now().strftime("%H:%M:%S") > data["hora_fin"]:
                id_estado = 3
            else:
                id_estado = 2
        elif datetime.now().strftime("%Y-%m-%d") > data["fecha"]:
            id_estado = 3

        query_create_reserva = """
            INSERT INTO RESERVAS (ID_RESERVA, DESCRIPCION, FECHA, HORA_INICIO, HORA_FIN, ID_ESTADO)
            VALUES (:id_reserva, :descripcion, :fecha, :hora_inicio, :hora_fin, :id_estado)
        """

        query_create_historial = """
            INSERT INTO HISTORIAL_RESERVAS (ID_HISTORIAL, ID_RESERVA, FECHA_MODIFICACION, ID_ACCION)
            VALUES (:id_historial, :id_reserva, :fecha_modificacion, :id_accion)
        """

        with self.con.connect() as conn:
            conn.execute(
                text(query_create_reserva),
                {
                    "id_reserva": id_reserva,
                    "descripcion": data["descripcion"],
                    "fecha": data["fecha"],
                    "hora_inicio": data["hora_inicio"],
                    "hora_fin": data["hora_fin"],
                    "id_estado": id_estado
                }
            )
            conn.execute(
                text(query_create_historial),
                {
                    "id_historial": id_historial,
                    "id_reserva": id_reserva,
                    "fecha_modificacion": datetime.now(),
                    "id_accion": 1
                }
            )
            conn.commit()

        return {"message": "Reserva creada correctamente", "id_reserva": id_reserva}

  
    def getReservas(self):
        query_get_reservas = """
            SELECT R.*, E.NOMBRE AS NOMBRE_ESTADO
            FROM RESERVAS R
            JOIN ESTADOS_RESERVA E ON R.ID_ESTADO = E.ID_ESTADO
            WHERE R.ID_ESTADO <> 3
        """
        reservas = []

        with self.con.connect() as conn:
            result = conn.execute(text(query_get_reservas))
            
            for row in result:
                item = dict(row._mapping)
                reservas.append({k.lower(): v for k, v in item.items()})

        return reservas

    def updateReserva(self, id_reserva, data):

        # Convertir modelo Pydantic a diccionario si es necesario
        if not isinstance(data, dict):
            data = data.dict()        

        # Generar ID con formato H-YYYYMMDDhhmmss
        id_historial = generate_id("H")

         # Calcular el id_estado de la reserva de acuerdo a la fecha actua y hora actual
        id_estado = 0

        if datetime.now().strftime("%Y-%m-%d") < data["fecha"]:
            id_estado = 1
        elif datetime.now().strftime("%Y-%m-%d") == data["fecha"]:
            if datetime.now().strftime("%H:%M:%S") < data["hora_inicio"]:
                id_estado = 1
            elif datetime.now().strftime("%H:%M:%S") > data["hora_fin"]:
                id_estado = 3
            else:
                id_estado = 2
        elif datetime.now().strftime("%Y-%m-%d") > data["fecha"]:
            id_estado = 3

        query_update_reserva = """
            UPDATE RESERVAS
            SET DESCRIPCION = :descripcion,
                FECHA = :fecha,
                HORA_INICIO = :hora_inicio,
                HORA_FIN = :hora_fin,
                ID_ESTADO = :id_estado
            WHERE ID_RESERVA = :id_reserva
        """

        query_create_historial = """
            INSERT INTO HISTORIAL_RESERVAS (ID_HISTORIAL, ID_RESERVA, FECHA_MODIFICACION, ID_ACCION)
            VALUES (:id_historial, :id_reserva, :fecha_modificacion, :id_accion)
        """

        with self.con.connect() as conn:
            conn.execute(
                text(query_update_reserva),
                {
                    "descripcion": data["descripcion"],
                    "fecha": data["fecha"],
                    "hora_inicio": data["hora_inicio"],
                    "hora_fin": data["hora_fin"],
                    "id_estado": id_estado,
                    "id_reserva": id_reserva
                }
            )
            conn.execute(
                text(query_create_historial),
                {
                    "id_historial": id_historial,
                    "id_reserva": id_reserva,
                    "fecha_modificacion": datetime.now(),
                    "id_accion": 2
                }
            )
            conn.commit()

        return {"message": "Reserva actualizada correctamente"}

    def deleteReserva(self, id_reserva):

        # Generar ID con formato H-YYYYMMDDhhmmss
        id_historial = generate_id("H")

        query_delete_reserva = "UPDATE RESERVAS SET ID_ESTADO = 3 WHERE ID_RESERVA = :id_reserva"

        query_create_historial = """
            INSERT INTO HISTORIAL_RESERVAS (ID_HISTORIAL, ID_RESERVA, FECHA_MODIFICACION, ID_ACCION)
            VALUES (:id_historial, :id_reserva, :fecha_modificacion, :id_accion)
        """

        with self.con.connect() as conn:
            conn.execute(text(query_delete_reserva), {"id_reserva": id_reserva})
            conn.execute(
                text(query_create_historial),
                {
                    "id_historial": id_historial,
                    "id_reserva": id_reserva,
                    "fecha_modificacion": datetime.now(),
                    "id_accion": 3
                }
            )
            conn.commit()

        return {"message": "Reserva eliminada correctamente"}