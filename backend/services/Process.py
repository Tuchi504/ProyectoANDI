from sqlalchemy import text
from bd.Connection import Connection

class Process :

    def __init__(self):
        self.con = Connection().getConnection()

    def getRoles(self):
        table = "ROLES"
        result = self.getData(table)
        return result 
    
    def getEstadoReserva(self):
        table = "ESTADOS_RESERVA"
        result = self.getData(table)
        return result 

    
    def getMarcaReactivo(self):
        table = "MARCAS"
        result = self.getData(table)
        return result 
    
    def getClasificacionReactivo(self):
        table = "CLASIFICACION_REACTIVOS"
        result = self.getData(table)
        return result 
    
    def getData(self, table):
     query = f"SELECT * FROM {table}"
     results = []

     with self.con.connect() as conn:
        result = conn.execute(text(query))

        for row in result:
            results.append(dict(row._mapping))

     return results
