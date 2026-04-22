import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb+srv://fakar2419_db_user:<Arifinshaikh@12>@cluster0.x7pra8f.mongodb.net/?appName=Cluster0")
client = AsyncIOMotorClient(MONGODB_URI, uuidRepresentation="standard")

# Default database for PBAS
database = client.get_database("pbas_db")
