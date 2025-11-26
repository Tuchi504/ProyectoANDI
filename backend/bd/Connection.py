from sqlalchemy import create_engine
import sqlalchemy
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Connection:
    def __init__(self):
        self.user = os.getenv("DB_USER", "sa")
        self.password = os.getenv("DB_PASSWORD", "1234")
        self.server = os.getenv("DB_SERVER", "localhost")
        self.driver = os.getenv("DB_DRIVER", "ODBC+Driver+17+for+SQL+Server")
        self.database = os.getenv("DB_NAME", "lab_inventory")

    def getConnection(self):
        try:
            connection_str = (
                f"mssql+pyodbc://{self.user}:{self.password}"
                f"@{self.server}/{self.database}"
                f"?driver={self.driver}"
                "&Encrypt=no&TrustServerCertificate=yes"
            )

            engine = create_engine(connection_str)
            return engine

        except Exception as e:
            print(f" Error: {e}")
            return None
