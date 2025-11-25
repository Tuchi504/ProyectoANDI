from sqlalchemy import create_engine
import sqlalchemy

class Connection:
    def __init__(self):
  
        self.user = "sa"
        self.password = "1234"
        self.server = "localhost"
        self.driver = "ODBC+Driver+17+for+SQL+Server"
        self.database = "lab_inventory"

    def getConnection(self):

        try:
            connection_str = (
                f"mssql+pyodbc://{self.user}:{self.password}"
                f"@{self.server}/{self.database}"
                f"?driver={self.driver}"
                "&Encrypt=no&TrustServerCertificate=yes"
            )

            engine = create_engine(connection_str)
            #print(engine)
            return engine

        except Exception as e:
            print(f" Error: {e}")
            return None
