import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import certifi

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb+srv://fakar2419_db_user:SfBeVFB6r4ERFphF@cluster0.gbb4cqq.mongodb.net/?appName=Cluster0")
client = AsyncIOMotorClient(MONGODB_URI, uuidRepresentation="standard", tlsCAFile=certifi.where(), tlsAllowInvalidCertificates=True)

# Default database for PBAS
database = client.get_database("pbas_db")
