import asyncio
from database import database

async def get_users():
    users = await database["users"].find({}).to_list(length=100)
    for u in users:
        print(f"Role: {u.get('role')}, Email: {u.get('email')}, Name: {u.get('name')}")
    if not users:
        print("No users found in the database.")

if __name__ == "__main__":
    asyncio.run(get_users())
