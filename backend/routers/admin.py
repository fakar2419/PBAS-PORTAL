from fastapi import APIRouter, HTTPException
from typing import List
from models import User, RegRequest, PwResetRequest, RoleUpdateRequest
from database import database
import time
from utils import hash_password

router = APIRouter()

@router.get("/users")
async def get_all_users():
    users = await database["users"].find({}).to_list(1000)
    for u in users:
        u["_id"] = str(u["_id"])
        u.pop("pw", None)
    return users

@router.put("/users/{user_id}/role")
async def update_user_role(user_id: str, req: RoleUpdateRequest):
    res = await database["users"].update_one(
        {"id": user_id},
        {"$set": {"role": req.role}}
    )
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"status": "success"}

@router.get("/reg_reqs", response_model=List[RegRequest])
async def get_reg_reqs():
    reqs = await database["reg_reqs"].find({}).to_list(100)
    for r in reqs: r["_id"] = str(r["_id"])
    return reqs

@router.post("/reg_reqs/{req_id}/approve")
async def approve_reg_req(req_id: str):
    req = await database["reg_reqs"].find_one({"id": req_id})
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
        
    new_user = {
        "id": "u_" + str(int(time.time() * 1000)),
        "name": req["name"],
        "email": req["email"],
        "pw": hash_password("change@123"),
        "role": "faculty",
        "dept": req["dept"],
        "approved": True
    }
    await database["users"].insert_one(new_user)
    await database["reg_reqs"].delete_one({"id": req_id})
    return {"status": "success", "user_id": new_user["id"]}

@router.post("/reg_reqs/{req_id}/reject")
async def reject_reg_req(req_id: str):
    await database["reg_reqs"].delete_one({"id": req_id})
    return {"status": "success"}

@router.get("/pw_reqs", response_model=List[PwResetRequest])
async def get_pw_reqs():
    reqs = await database["pw_reqs"].find({}).to_list(100)
    for r in reqs: r["_id"] = str(r["_id"])
    return reqs

@router.post("/pw_reqs/{req_id}/approve")
async def approve_pw_req(req_id: str):
    req = await database["pw_reqs"].find_one({"id": req_id})
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
        
    # We pass the new password in body or default to change@123, but the mockup just sets it to newPw. Wait, the API for this usually takes a payload.
    # In the React code, HOD provides a new password. So we need a payload for the new password.
    pass

@router.post("/pw_reqs/{req_id}/approve_with_pw")
async def approve_pw_req_with_pw(req_id: str, payload: dict):
    new_pw = payload.get("new_pw")
    if not new_pw:
        raise HTTPException(status_code=400, detail="Password is required")
        
    req = await database["pw_reqs"].find_one({"id": req_id})
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
        
    await database["users"].update_one(
        {"email": {"$regex": f"^{req['email']}$", "$options": "i"}},
        {"$set": {"pw": hash_password(new_pw)}}
    )
    await database["pw_reqs"].delete_one({"id": req_id})
    return {"status": "success"}
