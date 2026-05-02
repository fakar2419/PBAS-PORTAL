import asyncio
from database import database
async def test():
    count = await database['users'].count_documents({})
    print(f'Users: {count}')
asyncio.run(test())
