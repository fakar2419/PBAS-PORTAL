import asyncio
from database import database
from utils import hash_password

async def fix_admin():
    hashed = hash_password("admin123")
    result = await database["users"].update_one(
        {"email": "admin@college.ac.in"},
        {"$set": {"pw": hashed}}
    )
    print(f"Matched: {result.matched_count}, Modified: {result.modified_count}")
    print("Admin password hash has been fixed.")

if __name__ == "__main__":
    asyncio.run(fix_admin())
