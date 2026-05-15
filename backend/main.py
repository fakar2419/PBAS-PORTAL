from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, submissions, admin

app = FastAPI(title="PBAS Portal API")

# Configure CORS for React frontend
import os
frontend_url = os.getenv("FRONTEND_URL", "")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://pbas-frontend.onrender.com", # Update this with your actual frontend URL if different
]

if frontend_url:
    origins.append(frontend_url)

# In production, you might want to specify the exact domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.onrender\.com", # Automatically allows any Render app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(submissions.router, prefix="/api/submissions", tags=["Submissions"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])

@app.on_event("startup")
async def startup_event():
    from database import database
    from utils import hash_password
    count = await database["users"].count_documents({})
    if count == 0:
        admin_user = {
            "id": "u_admin_root",
            "name": "System Administrator",
            "email": "admin@college.ac.in",
            "pw": hash_password("admin123"),
            "role": "admin",
            "dept": "Admin",
            "approved": True
        }
        await database["users"].insert_one(admin_user)
        print("*"*60)
        print("DATABASE BOOTSTRAPPED.")
        print("Root Admin Created - Email: admin@college.ac.in | PW: admin123")
        print("*"*60)

@app.get("/")
def read_root():
    return {"message": "Welcome to PBAS API. The backend is running!"}
