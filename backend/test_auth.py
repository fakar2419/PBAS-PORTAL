import asyncio
from database import database
from utils import verify_password

async def test_auth():
    user = await database["users"].find_one({"email": "admin@college.ac.in"})
    if not user:
        print("User not found")
        return
    
    print("Hash from DB:", user.get("pw"))
    print("verify_password('admin123', hash):", verify_password("admin123", user.get("pw")))
    
if __name__ == "__main__":
    asyncio.run(test_auth())
