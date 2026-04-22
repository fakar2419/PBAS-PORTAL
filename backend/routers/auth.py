from fastapi import APIRouter, HTTPException, Depends
from typing import List
from models import User, LoginRequest, RegRequestCreate, PasswordChangeRequest
from database import database
import time
from utils import hash_password, verify_password, create_access_token

router = APIRouter()

@router.post("/login")
async def login(req: LoginRequest):
    user = await database["users"].find_one({"email": {"$regex": f"^{req.email}$", "$options": "i"}})
    if not user or not verify_password(req.pw, user.get("pw", "")):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not user.get("approved", False):
        raise HTTPException(status_code=403, detail="Account not approved yet")
    
    # We create a token containing the user details
    token_data = {"sub": user["id"], "email": user["email"], "role": user["role"]}
    token = create_access_token(token_data)
    
    # We still return user data structured similarly so frontend doesn't break entirely, but wrapped or alongside token.
    # App.jsx expects the whole user object on login. We can just add 'token' to the user response.
    user["_id"] = str(user["_id"])
    user["token"] = token
    # Do not send hash back to client
    user.pop("pw", None)
    return user

@router.post("/reg_req")
async def request_registration(req: RegRequestCreate):
    new_req = req.dict()
    new_req["id"] = "reg_" + str(int(time.time() * 1000))
    from datetime import datetime
    new_req["requestedAt"] = datetime.now().strftime("%d/%m/%Y")
    await database["reg_reqs"].insert_one(new_req)
    return {"status": "success", "id": new_req["id"]}

@router.post("/pw_req")
async def request_password_reset(email: str):
    new_req = {
        "id": "pw_" + str(int(time.time() * 1000)),
        "email": email,
        "requestedAt": __import__('datetime').datetime.now().strftime("%d/%m/%Y")
    }
    await database["pw_reqs"].insert_one(new_req)
    return {"status": "success", "id": new_req["id"]}

@router.put("/users/{user_id}/password")
async def change_password(user_id: str, req: PasswordChangeRequest):
    hashed = hash_password(req.new_pw)
    result = await database["users"].update_one(
        {"id": user_id},
        {"$set": {"pw": hashed}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"status": "success"}
