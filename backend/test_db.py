import asyncio
from database import database

async def test():
    print("Testing DB connection...")
    try:
        count = await database["users"].count_documents({})
        print("Success! Count:", count)
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    asyncio.run(test())
