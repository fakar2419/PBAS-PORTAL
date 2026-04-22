from fastapi import APIRouter, HTTPException
from typing import List, Optional
from models import Submission, SubmissionCreate, ActionRequest
from database import database
import time
from datetime import datetime

router = APIRouter()

@router.get("/", response_model=List[Submission])
async def get_submissions(facultyId: Optional[str] = None):
    query = {}
    if facultyId:
        query["facultyId"] = facultyId
    subs = await database["submissions"].find(query).to_list(1000)
    for s in subs:
        s["_id"] = str(s["_id"])
    return subs

@router.post("/", response_model=Submission)
async def create_submission(sub: SubmissionCreate):
    new_sub = sub.dict()
    new_sub["id"] = "s_" + str(int(time.time() * 1000))
    new_sub["status"] = "pending_hod"
    new_sub["hodRemark"] = ""
    new_sub["principalRemark"] = ""
    new_sub["expertComment"] = ""
    new_sub["submittedAt"] = datetime.now().strftime("%d/%m/%Y")
    
    await database["submissions"].insert_one(new_sub)
    new_sub["_id"] = str(new_sub["_id"])
    return new_sub

@router.put("/{sub_id}")
async def update_submission(sub_id: str, sub: SubmissionCreate):
    updates = sub.dict()
    updates["status"] = "pending_hod"
    updates["hodRemark"] = ""
    updates["principalRemark"] = ""
    updates["submittedAt"] = datetime.now().strftime("%d/%m/%Y")
    # Reset section remarks on re-submission? Usually yes.
    updates["sectionRemarks"] = {}
    
    res = await database["submissions"].update_one(
        {"id": sub_id},
        {"$set": updates}
    )
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Submission not found")
    return {"status": "success"}

@router.put("/{sub_id}/action")
async def submission_action(sub_id: str, req: ActionRequest):
    sub = await database["submissions"].find_one({"id": sub_id})
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")
        
    updates = {}
    if req.action == 'return_faculty':
        updates["status"] = 'returned_to_faculty'
        updates["hodRemark"] = req.remark
    elif req.action == 'approve_hod':
        updates["status"] = 'sent_to_principal'
        if req.remark: updates["hodRemark"] = req.remark
    elif req.action == 'return_hod':
        updates["status"] = 'returned_to_hod'
        updates["principalRemark"] = req.remark
    elif req.action == 'send_expert':
        updates["status"] = 'sent_to_expert'
        if req.remark: updates["principalRemark"] = req.remark
    elif req.action == 'expert_review':
        updates["status"] = 'expert_reviewed'
        updates["expertComment"] = req.remark
        
    if req.sectionRemarks:
        current_remarks = sub.get("sectionRemarks", {})
        current_remarks.update(req.sectionRemarks)
        # remove empty remarks
        current_remarks = {k: v for k, v in current_remarks.items() if v.strip()}
        updates["sectionRemarks"] = current_remarks
        
    await database["submissions"].update_one({"id": sub_id}, {"$set": updates})
    return {"status": "success"}
