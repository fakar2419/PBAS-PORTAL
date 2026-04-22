from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any

class UserBase(BaseModel):
    name: str
    email: str
    role: str
    dept: str
    approved: bool = False

class UserCreate(UserBase):
    pw: str

class User(UserBase):
    id: str

class LoginRequest(BaseModel):
    email: str
    pw: str

class PasswordChangeRequest(BaseModel):
    new_pw: str

class RegRequestCreate(BaseModel):
    name: str
    email: str
    dept: str

class RegRequest(RegRequestCreate):
    id: str
    requestedAt: str

class PwResetRequest(BaseModel):
    id: str
    email: str
    requestedAt: str

class SubmissionBase(BaseModel):
    year: str
    partA: Dict[str, Any] = {}
    partB: Dict[str, Any] = {}
    partC: Dict[str, Any] = {}
    scores: Dict[str, Any] = {}
    sectionRemarks: Dict[str, str] = {}

class SubmissionCreate(SubmissionBase):
    facultyId: str
    facultyName: str
    dept: str

class Submission(SubmissionCreate):
    id: str
    status: str
    hodRemark: str = ""
    principalRemark: str = ""
    expertComment: str = ""
    submittedAt: str = ""

class ActionRequest(BaseModel):
    action: str
    remark: Optional[str] = ""
    sectionRemarks: Dict[str, str] = {}

class RoleUpdateRequest(BaseModel):
    role: str
