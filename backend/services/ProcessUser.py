from sqlalchemy import text
from bd.Connection import Connection

class ProcessUser:

    def __init__(self):
        self.con = Connection().getConnection()

    def createUser(self, user_data):
        query = """
            INSERT INTO USUARIOS (NOMBRE_COMPLETO, CORREO, CONTRASENA, ID_ROL, ACTIVO)
            VALUES (:nombre, :correo, :contrasena, :id_rol, :activo)
        """

        with self.con.connect() as conn:
            conn.execute(
                text(query),
                {
                    "nombre": user_data["nombre_completo"],
                    "correo": user_data["correo"],
                    "contrasena": user_data["contrasena"],
                    "id_rol": user_data["id_rol"],
                    "activo": user_data["activo"]
                }
            )
            conn.commit()

        return {"message": "Usuario creado correctamente"}

    def getUsers(self):
        query = """
            SELECT U.ID_USUARIO, U.NOMBRE_COMPLETO, U.CORREO, U.ID_ROL, U.ACTIVO, R.NOMBRE AS NOMBRE_ROL
            FROM USUARIOS U
            JOIN ROLES R ON U.ID_ROL = R.ID_ROL
        """
        users = []

        with self.con.connect() as conn:
            result = conn.execute(text(query))
            
            for row in result:
                item = dict(row._mapping)
                users.append({k.lower(): v for k, v in item.items()})
                
        return users

    def updateUser(self, id_usuario, user_data):
        query = """
            UPDATE USUARIOS
            SET NOMBRE_COMPLETO = :nombre,
                CORREO = :correo,
                ID_ROL = :id_rol,
                ACTIVO = :activo
            WHERE ID_USUARIO = :id_usuario
        """

        with self.con.connect() as conn:
            conn.execute(
                text(query),
                {
                    "nombre": user_data["nombre_completo"],
                    "correo": user_data["correo"],
                    "id_rol": user_data["id_rol"],
                    "activo": user_data["activo"],
                    "id_usuario": id_usuario
                }
            )
            conn.commit()

        return {"message": "Usuario actualizado correctamente"}

    
    def delete_user(self, id_usuario):
        query = "DELETE FROM USUARIOS WHERE ID_USUARIO = :id"

        with self.con.connect() as conn:
            conn.execute(text(query), {"id": id_usuario})
            conn.commit()

        return {"message": "Usuario eliminado correctamente"}
